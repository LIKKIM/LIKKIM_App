/**
 * handleDevicePress 工厂函数
 * 迁移自 App.js，注入所有依赖
 *
 * 蓝牙配对流程整体说明：
 * 该流程结合 utils/monitorVerificationCode.js 中的监听和处理逻辑，完成嵌入式设备的蓝牙配对和通讯。
 *
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
