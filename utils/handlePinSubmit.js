// utils/handlePinSubmit.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

/**
 * 提取后的 handlePinSubmit 函数
 *
 * 参数对象中需要传入：
 * - receivedVerificationCode: 完整的验证数据字符串
 * - pinCode: 用户输入的 PIN 字符串
 * - setPinModalVisible: 控制 PIN 弹窗显示的函数
 * - setVerificationModalVisible: 控制验证弹窗显示的函数
 * - setVerificationStatus: 更新验证状态的函数
 * - selectedDevice: 当前已连接的设备对象
 * - setVerifiedDevices: 更新已验证设备的函数
 * - setIsVerificationSuccessful: 更新验证成功状态的函数
 * - serviceUUID: 服务 UUID 字符串
 * - writeCharacteristicUUID: 写入特征 UUID 字符串
 * - monitorSubscription: （可选）监控订阅对象，若存在则可移除
 * - setPinCode: 重置 PIN 输入的函数
 */
export async function handlePinSubmit({
  receivedVerificationCode,
  pinCode,
  setPinModalVisible,
  setVerificationModalVisible,
  setVerificationStatus,
  selectedDevice,
  setVerifiedDevices,
  setIsVerificationSuccessful,
  serviceUUID,
  writeCharacteristicUUID,
  monitorSubscription,
  setPinCode,
}) {
  setPinModalVisible(false);
  setVerificationModalVisible(false);
  const verificationCodeValue = receivedVerificationCode.trim();
  const pinCodeValue = pinCode.trim();

  console.log(`User PIN: ${pinCodeValue}`);
  console.log(`Received data: ${verificationCodeValue}`);

  const [prefix, rest] = verificationCodeValue.split(":");
  if (prefix !== "PIN" || !rest) {
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
      console.log("Flag Y received; sending 'address' to device");
      try {
        const addressMessage = "address";
        const bufferAddress = Buffer.from(addressMessage, "utf-8");
        const base64Address = bufferAddress.toString("base64");

        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Address
        );
        console.log("Sent 'address' to device");
        setVerificationModalVisible(true);
      } catch (error) {
        console.log("Error sending 'address':", error);
      }

      const pubkeyMessages = [
        "pubkey:cosmos,m/44'/118'/0'/0/0",
        "pubkey:ripple,m/44'/144'/0'/0/0",
        "pubkey:celestia,m/44'/118'/0'/0/0",
        "pubkey:juno,m/44'/118'/0'/0/0",
        "pubkey:osmosis,m/44'/118'/0'/0/0",
      ];

      for (const message of pubkeyMessages) {
        try {
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");

          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log(`Sent message: ${message}`);
        } catch (error) {
          console.log(`Error sending message "${message}":`, error);
        }
      }
    } else if (flag === "N") {
      console.log("Flag N received; no 'address' sent");
      setVerificationModalVisible(true);
    }
  } else {
    console.log("PIN verification failed");
    setVerificationStatus("fail");

    if (monitorSubscription) {
      monitorSubscription.remove();
      console.log("Stopped monitoring verification code");
    }

    if (selectedDevice) {
      await selectedDevice.cancelConnection();
      console.log("Disconnected device");
    }
  }

  setPinCode("");
}
