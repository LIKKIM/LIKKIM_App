/**
 * handleDevicePress 工厂函数
 * 迁移自 App.js，注入所有依赖
 *
 * 蓝牙配对流程整体说明：
 * 该流程结合 utils/monitorVerificationCode.js 中的监听和处理逻辑，完成嵌入式设备的蓝牙配对和通讯。
 *
 * 具体流程：
 * 1. 请求蓝牙和定位权限，确保设备可连接。
 * 2. 调用 device.connect() 连接设备。
 * 3. 调用 device.discoverAllServicesAndCharacteristics() 发现设备服务和特征。
 * 4. 通过 monitorVerificationCode 监听 notifyCharacteristicUUID，接收设备发送的区块链地址、公钥、加密ID、验证状态等数据。
 *    - 监听设备通知，接收并解析数据。例如接收到的字符串可能是 "BTC1A2B3C4D5E6F" 表示比特币地址。
 *    - 根据数据前缀识别区块链地址并更新，如 "BTC" 是比特币，"ETH" 是以太坊，更新对应地址状态。
 *    - 处理公钥数据更新设备公钥提示，格式如 "pubkeyData:ETH,abcdef123456"。
 *    - 解析加密ID并发送解析结果，接收格式如 "ID:1234ABCD"，解析后发送回设备确认。
 *    - 处理验证状态，发送验证消息。当接收到 "VALID" 时，发送 "validation" 消息给设备。
 *    - 监听PIN码，接收格式如 "PIN:123456"。
 *      该值需与用户输入的验证码进行比对，确认匹配后完成配对流程。
 * 5. 发送请求字符串："request" 发送给设备，触发设备返回数据。
 * 6. 监听到设备发送的加密ID后，解析并发送解析结果回设备。
 * 7. 接收设备发送的 "VALID" 状态后，发送 "validation" 消息确认。
 * 8. 接收设备发送的 PIN 码，完成配对流程。
 */
export function createHandleDevicePress({
  setReceivedAddresses,
  setVerificationStatus,
  setSelectedDevice,
  setBleVisible,
  monitorVerificationCode,
  setSecurityCodeModalVisible,
  serviceUUID,
  writeCharacteristicUUID,
  Buffer,
}) {
  return async function handleDevicePress(device) {
    setReceivedAddresses({});
    setVerificationStatus(null);
    setSelectedDevice(device);
    setBleVisible(false);

    // 权限校验
    let permissionsGranted = true;
    if (typeof require !== "undefined") {
      try {
        const { Platform, PermissionsAndroid } = require("react-native");
        if (Platform.OS === "android" && Platform.Version >= 23) {
          const permissions = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          ]);
          for (let permission in permissions) {
            if (
              permissions[permission] !== PermissionsAndroid.RESULTS.GRANTED
            ) {
              console.log(`${permission} permission not granted`);
              permissionsGranted = false;
            }
          }
        }
      } catch (e) {
        console.log("Permission check error:", e);
        permissionsGranted = false;
      }
    }
    if (!permissionsGranted) {
      console.log(
        "Bluetooth or location permission not granted, aborting connection."
      );
      return;
    }

    // 连接和服务发现单独捕获异常
    try {
      try {
        console.log("handleDevicePress: device name =", device.name);
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
        console.log("Device connected and services discovered");
      } catch (error) {
        console.log("Error connecting or discovering services:", error);
        if (error && typeof error === "object") {
          console.log(
            "Error details:",
            "message:",
            error.message,
            "reason:",
            error.reason,
            "code:",
            error.code,
            "stack:",
            error.stack
          );
        }
        return;
      }

      const sendparseDeviceCodeedValue = async (parseDeviceCodeedValue) => {
        try {
          const message = `ID:${parseDeviceCodeedValue}`;
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log(`Sent parseDeviceCodeed value: ${message}`);
        } catch (error) {
          console.log("Error sending parseDeviceCodeed value:", error);
        }
      };

      monitorVerificationCode(device, sendparseDeviceCodeedValue);

      setTimeout(async () => {
        try {
          const requestString = "request";
          const bufferRequestString = Buffer.from(requestString, "utf-8");
          const base64requestString = bufferRequestString.toString("base64");
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64requestString
          );
          console.log("Sent 'request'");
        } catch (error) {
          console.log("Error sending 'request':", error);
        }
      }, 200);
      setSecurityCodeModalVisible(true);
    } catch (error) {
      console.log("Error connecting or sending command to device:", error);
    }
  };
}
