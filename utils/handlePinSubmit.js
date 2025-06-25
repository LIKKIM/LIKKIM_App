// utils/handlePinSubmit.js
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Buffer } from "buffer";

/**
 * Extracted handlePinSubmit function.
 *
 * The parameter object should include:
 * - receivedVerificationCode: The complete verification data string.
 * - pinCode: The user-entered PIN string.
 * - setSecurityCodeModalVisible: Function to control the visibility of the PIN modal.
 * - setCheckStatusModalVisible: Function to control the visibility of the verification modal.
 * - setVerificationStatus: Function to update the verification status.
 * - selectedDevice: The currently connected device object.
 * - setVerifiedDevices: Function to update the list of verified devices.
 * - setIsVerificationSuccessful: Function to update the verification success state.
 * - serviceUUID: The service UUID string.
 * - writeCharacteristicUUID: The characteristic UUID string for writing.
 * - monitorSubscription: (Optional) Monitoring subscription object; if present, it will be removed.
 * - setPinCode: Function to reset the PIN input.
 */
export async function handlePinSubmit({
  receivedVerificationCode,
  pinCode,
  setSecurityCodeModalVisible,
  setCheckStatusModalVisible,
  setVerificationStatus,
  selectedDevice,
  setVerifiedDevices,
  setIsVerificationSuccessful,
  serviceUUID,
  writeCharacteristicUUID,
  monitorSubscription,
  setPinCode,
}) {
  setSecurityCodeModalVisible(false);
  setCheckStatusModalVisible(false);
  const verificationCodeValue = receivedVerificationCode.trim();
  const pinCodeValue = pinCode.trim();

  //  console.log(`User PIN: ${pinCodeValue}`);
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
        setCheckStatusModalVisible(true);
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
        await new Promise((resolve) => setTimeout(resolve, 250));
        try {
          // 在每条指令结尾加上 \n
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
    } else if (flag === "N") {
      console.log("Flag N received; no 'address' sent");
      setCheckStatusModalVisible(true);
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
