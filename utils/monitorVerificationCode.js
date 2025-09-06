/**
 * 工厂函数：生成 monitorVerificationCode
 * 这是蓝牙配对流程中的关键监听函数，负责监听设备发送的验证码和状态更新
 *
 * 通讯方向与内容：
 *  - 设备通过 notifyCharacteristicUUID 通知发送数据，内容包括区块链地址、公钥、加密ID、验证状态等
 *  - 应用端监听这些通知，解析数据并更新状态
 *  - 应用端根据状态发送相应命令，如发送解析后的设备码、请求字符串、验证消息等
 *
 * 通讯步骤：
 *  1. 监听设备通知，接收并解析数据。例如接收到的字符串可能是 "BTC1A2B3C4D5E6F" 表示比特币地址
 *  2. 根据数据前缀识别区块链地址并更新，如 "BTC" 是比特币，"ETH" 是以太坊，更新对应地址状态
 *  3. 处理公钥数据更新设备公钥提示，格式如 "pubkeyData:ETH,abcdef123456"
 *  4. 解析加密ID并发送解析结果，接收格式如 "ID:1234ABCD"，解析后发送回设备确认
 *  5. 处理验证状态，发送验证消息。当接收到 "VALID" 时，发送 "validation" 消息给设备
 *  6. 监听PIN码，PIN:<随机验证码>,<Y/N>` 例："PIN:6375,Y"。
 *
 * @param {Object} deps - 依赖项
 * @param {string} deps.serviceUUID
 * @param {string} deps.notifyCharacteristicUUID
 * @param {Object} deps.prefixToShortName
 * @param {function} deps.updateCryptoAddress
 * @param {function} deps.setReceivedAddresses
 * @param {function} deps.setVerificationStatus
 * @param {function} deps.updateDevicePubHintKey
 * @param {function} deps.parseDeviceCode
 * @param {function} deps.setReceivedVerificationCode
 * @param {Object} deps.Buffer
 * @returns {function} monitorVerificationCode
 */
function createMonitorVerificationCode({
  serviceUUID,
  notifyCharacteristicUUID,
  prefixToShortName,
  updateCryptoAddress,
  setReceivedAddresses,
  setVerificationStatus,
  updateDevicePubHintKey,
  parseDeviceCode,
  setReceivedVerificationCode,
  Buffer,
}) {
  // 订阅对象由调用方维护
  let monitorSubscription = null;

  // 生成的监听函数
  function monitorVerificationCode(device, sendparseDeviceCodeedValue) {
    // 正确地移除已有监听
    if (monitorSubscription) {
      monitorSubscription.remove();
      monitorSubscription = null;
    }

    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("monitorVerificationCode Error:", error.message);
          return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const chainShortName = prefixToShortName[prefix];
          console.log(`Received ${chainShortName} address: `, newAddress);
          updateCryptoAddress(chainShortName, newAddress);

          setReceivedAddresses((prev) => {
            const updated = { ...prev, [chainShortName]: newAddress };
            const expectedCount = Object.keys(prefixToShortName).length;
            if (Object.keys(updated).length >= expectedCount) {
              setTimeout(() => {
                setVerificationStatus("walletReady");
                console.log("All public keys received, wallet ready.");
              }, 5000);
            } else {
              setVerificationStatus("waiting");
              // 新增打印缺失的区块链地址
              const missingChains = Object.values(prefixToShortName).filter(
                (shortName) => !updated.hasOwnProperty(shortName)
              );
              if (missingChains.length > 0) {
                console.log(
                  "Missing addresses for chains:",
                  missingChains.join(", ")
                );
              }
            }
            return updated;
          });
        }

        if (receivedDataString.startsWith("pubkeyData:")) {
          const pubkeyData = receivedDataString
            .replace("pubkeyData:", "")
            .trim();
          const [queryChainName, publicKey] = pubkeyData.split(",");
          if (queryChainName && publicKey) {
            updateDevicePubHintKey(queryChainName, publicKey);
          }
        }

        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);
          parseDeviceCode(encryptedData, key);
          const parseDeviceCodeedHex = uint32ArrayToHexString(encryptedData);
          console.log("parseDeviceCodeed string:", parseDeviceCodeedHex);
          if (sendparseDeviceCodeedValue) {
            sendparseDeviceCodeedValue(parseDeviceCodeedHex);
          }
        }

        if (receivedDataString === "VALID") {
          try {
            setVerificationStatus("VALID");
            console.log("Status set to: VALID");
            const validationMessage = "validation";
            const bufferValidationMessage = Buffer.from(
              validationMessage,
              "utf-8"
            );
            const base64ValidationMessage =
              bufferValidationMessage.toString("base64");
            await device.writeCharacteristicWithResponseForService(
              serviceUUID,
              deps.writeCharacteristicUUID, // 兼容性：如果有 writeCharacteristicUUID
              base64ValidationMessage
            );
            console.log(`Sent 'validation' to device`);
          } catch (error) {
            console.log("发送 'validation' 时出错:", error);
          }
        }

        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          monitorSubscription?.remove();
          monitorSubscription = null;
        }
      }
    );
  }

  // 工具函数：16进制字符串转Uint32Array
  function hexStringToUint32Array(hexString) {
    return new Uint32Array([
      parseInt(hexString.slice(0, 8), 16),
      parseInt(hexString.slice(8, 16), 16),
    ]);
  }

  // 工具函数：Uint32Array转16进制字符串
  function uint32ArrayToHexString(uint32Array) {
    return (
      uint32Array[0].toString(16).toUpperCase().padStart(8, "0") +
      uint32Array[1].toString(16).toUpperCase().padStart(8, "0")
    );
  }

  // 返回实际监听函数
  return monitorVerificationCode;
}

export default createMonitorVerificationCode;
