// utils/handlePinSubmit.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

/**
 * 工厂函数，生成 handlePinSubmit，所有依赖通过参数注入。
 * @param {Object} deps - 依赖项
 * @param {function} deps.setSecurityCodeModalVisible
 * @param {function} deps.setCheckStatusModalVisible
 * @param {function} deps.setVerificationStatus
 * @param {function} deps.setVerifiedDevices
 * @param {function} deps.setIsVerificationSuccessful
 * @param {function} deps.setPinCode
 * @param {function} deps.setReceivedAddresses
 * @param {Object} deps.prefixToShortName
 * @param {function} deps.monitorVerificationCode
 * @param {string} deps.serviceUUID
 * @param {string} deps.writeCharacteristicUUID
 * @returns {function} handlePinSubmit
 */
export function createHandlePinSubmit({
  setSecurityCodeModalVisible,
  setCheckStatusModalVisible,
  setVerificationStatus,
  setVerifiedDevices,
  setIsVerificationSuccessful,
  setPinCode,
  setReceivedAddresses,
  prefixToShortName,
  monitorVerificationCode,
  serviceUUID,
  writeCharacteristicUUID,
}) {
  /**
   * @param {Object} params
   * @param {string} params.receivedVerificationCode
   * @param {string} params.pinCode
   * @param {Object} params.selectedDevice
   * @param {Object} params.receivedAddresses
   */
  return async function handlePinSubmit({
    receivedVerificationCode,
    pinCode,
    selectedDevice,
    receivedAddresses,
  }) {
    setSecurityCodeModalVisible(false);
    setCheckStatusModalVisible(false);
    const verificationCodeValue = receivedVerificationCode.trim();
    const pinCodeValue = pinCode.trim();

    console.log(`Received data: ${verificationCodeValue}`);

    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      setCheckStatusModalVisible(true);
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    const [receivedPin, flag] = rest.split(",");
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    console.log(`Extracted PIN: ${receivedPin}`);
    console.log(`Flag: ${flag}`);

    // 立即发送 pinCodeValue 与 receivedPin 给嵌入式设备
    try {
      const pinData = `pinCodeValue:${pinCodeValue},receivedPin:${receivedPin}`;
      const bufferPinData = Buffer.from(pinData, "utf-8");
      const base64PinData = bufferPinData.toString("base64");
      await selectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64PinData
      );
      console.log("Sent pinCodeValue and receivedPin to device:", pinData);
    } catch (error) {
      console.log("Error sending pin data:", error);
    }

    if (pinCodeValue === receivedPin) {
      console.log("PIN verified successfully");
      setVerificationStatus("success");
      setVerifiedDevices([selectedDevice.id]);

      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
      );

      setIsVerificationSuccessful(true);
      console.log("Device verified and saved");

      try {
        const confirmationMessage = "PIN_OK";
        const bufferConfirmation = Buffer.from(confirmationMessage, "utf-8");
        const base64Confirmation = bufferConfirmation.toString("base64");
        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Confirmation
        );
        console.log("Sent confirmation message:", confirmationMessage);
      } catch (error) {
        console.log("Error sending confirmation message:", error);
      }

      if (flag === "Y") {
        monitorVerificationCode(selectedDevice);

        setCheckStatusModalVisible(true);
        setVerificationStatus("waiting");

        // 1. 依次批量发所有 address:<chainName> 命令
        for (const prefix of Object.keys(prefixToShortName)) {
          const chainName = prefix.replace(":", "");
          const getMessage = `address:${chainName}`;
          const bufferGetMessage = Buffer.from(getMessage, "utf-8");
          const base64GetMessage = bufferGetMessage.toString("base64");
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64GetMessage
          );
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        // 2. 统一延迟2秒检查所有缺失的链地址，然后自动补发一次
        setTimeout(async () => {
          // 自动补发最多3次（用本地缓存记补发次数）
          const retryCountKey = "bluetoothMissingChainRetryCount";
          let retryCountObj = {};
          try {
            const retryStr = await AsyncStorage.getItem(retryCountKey);
            if (retryStr) retryCountObj = JSON.parse(retryStr);
          } catch (e) {}
          if (!retryCountObj) retryCountObj = {};

          // 检查所有链的地址收集情况
          const addresses = receivedAddresses || {};
          const missingChains = Object.values(prefixToShortName).filter(
            (shortName) => !addresses[shortName]
          );

          if (missingChains.length > 0) {
            console.log(
              "🚨 统一补发缺失链 address 请求:",
              missingChains.join(", ")
            );
            for (let i = 0; i < missingChains.length; i++) {
              const shortName = missingChains[i];
              // 读取补发次数
              if (!retryCountObj[shortName]) retryCountObj[shortName] = 0;
              if (retryCountObj[shortName] >= 3) {
                continue; // 每个链最多补发3次
              }
              retryCountObj[shortName] += 1;

              const prefixEntry = Object.entries(prefixToShortName).find(
                ([k, v]) => v === shortName
              );
              if (prefixEntry) {
                const prefix = prefixEntry[0];
                const chainName = prefix.replace(":", "");
                const getMessage = `address:${chainName}`;
                const bufferGetMessage = Buffer.from(getMessage, "utf-8");
                const base64GetMessage = bufferGetMessage.toString("base64");
                await selectedDevice.writeCharacteristicWithResponseForService(
                  serviceUUID,
                  writeCharacteristicUUID,
                  base64GetMessage
                );
                console.log(
                  `🔁 Retry request address:${chainName} (${retryCountObj[shortName]}/3)`
                );
                await new Promise((resolve) => setTimeout(resolve, 400));
              }
            }
            // 保存补发次数
            await AsyncStorage.setItem(
              retryCountKey,
              JSON.stringify(retryCountObj)
            );
          } else {
            console.log("✅ All addresses received, no missing chains");
          }
        }, 2000);

        // 3. (原有 pubkey 指令)
        setTimeout(async () => {
          const pubkeyMessages = [
            "pubkey:cosmos,m/44'/118'/0'/0/0",
            "pubkey:ripple,m/44'/144'/0'/0/0",
            "pubkey:celestia,m/44'/118'/0'/0/0",
            "pubkey:juno,m/44'/118'/0'/0/0",
            "pubkey:osmosis,m/44'/118'/0'/0/0",
          ];

          for (const message of pubkeyMessages) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            try {
              const messageWithNewline = message + "\n";
              const bufferMessage = Buffer.from(messageWithNewline, "utf-8");
              const base64Message = bufferMessage.toString("base64");
              await selectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                writeCharacteristicUUID,
                base64Message
              );
              console.log(`Sent message: ${messageWithNewline}`);
            } catch (error) {
              console.log(`Error sending message "${message}":`, error);
            }
          }
        }, 250);
        setCheckStatusModalVisible(true);
      } else if (flag === "N") {
        console.log("Flag N received; no 'address' sent");
        setCheckStatusModalVisible(true);
      }
    } else {
      console.log("PIN verification failed");
      setVerificationStatus("fail");

      if (selectedDevice && selectedDevice.cancelConnection) {
        await selectedDevice.cancelConnection();
        console.log("Disconnected device");
      }
    }

    setPinCode("");
  };
}
