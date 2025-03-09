// utils/handleDevicePress.js
import { Buffer } from "buffer";

const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";

/**
 * Handles device press action for MyColdWalletScreen:
 * - Resets receivedAddresses and verificationStatus.
 * - Connects to the device and discovers its services/characteristics.
 * - Sets up a listener to monitor the verification code and send a decrypted value.
 * - Sends a "request" command after a short delay.
 *
 * @param {object} device - The BLE device object.
 * @param {object} callbacks - An object containing state setter functions and the monitor function.
 * @param {function} callbacks.setReceivedAddresses - Function to reset received addresses.
 * @param {function} callbacks.setVerificationStatus - Function to reset verification status.
 * @param {function} callbacks.setSelectedDevice - Function to update selected device.
 * @param {function} callbacks.setModalVisible - Function to hide the modal.
 * @param {function} callbacks.setBleVisible - Function to hide the BLE modal.
 * @param {function} callbacks.setPinModalVisible - Function to show the PIN modal.
 * @param {function} callbacks.monitorVerificationCode - Function to monitor verification code.
 */
export async function handleDevicePress(
  device,
  {
    setReceivedAddresses,
    setVerificationStatus,
    setSelectedDevice,
    setModalVisible,
    setBleVisible,
    setPinModalVisible,
    monitorVerificationCode,
  }
) {
  if (typeof device !== "object" || typeof device.connect !== "function") {
    console.log("Invalid device object, cannot connect device:", device);
    return;
  }

  // Reset screen-specific states
  setReceivedAddresses({});
  setVerificationStatus(null);
  setSelectedDevice(device);
  setModalVisible(false);
  setBleVisible(false);

  try {
    await device.connect();
    await device.discoverAllServicesAndCharacteristics();
    console.log(
      "Device connected and all services and characteristics discovered"
    );

    const sendDecryptedValue = async (decryptedValue) => {
      try {
        const message = `ID:${decryptedValue}`;
        const bufferMessage = Buffer.from(message, "utf-8");
        const base64Message = bufferMessage.toString("base64");

        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Message
        );
        console.log(`Decrypted value sent: ${message}`);
      } catch (error) {
        console.log("Error sending decrypted value:", error);
      }
    };

    monitorVerificationCode(device, sendDecryptedValue);

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
        console.log("'request' string sent");
      } catch (error) {
        console.log("Error sending 'request':", error);
      }
    }, 200);

    setPinModalVisible(true);
  } catch (error) {
    console.log("Device connection or command send error:", error);
  }
}
