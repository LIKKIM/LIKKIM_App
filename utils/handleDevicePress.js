/**
 * handleDevicePress 工厂函数
 * 迁移自 App.js，注入所有依赖
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
    // 连接和服务发现单独捕获异常
    try {
      try {
        console.log("handleDevicePress: device name =", device.name);
        await device.connect();
        await device.discoverAllServicesAndCharacteristics();
        console.log("Device connected and services discovered");
      } catch (error) {
        console.log("Error connecting or discovering services:", error);
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
