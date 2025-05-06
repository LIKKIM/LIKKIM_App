// showLIKKIMAddressCommand.js

import { Buffer } from "buffer";
import coinCommandMapping from "../config/coinCommandMapping";
import { bluetoothConfig } from "../env/bluetoothConfig";

const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

/**
 * Sends a command to display an address on the device and monitors its response.
 *
 * @param {object} device - The Bluetooth device.
 * @param {string} coinType - Coin type to determine the command.
 * @param {function} setIsVerifyingAddress - Updates the verifying state.
 * @param {function} setAddressVerificationMessage - Updates the verification message.
 * @param {function} t - Translation function.
 * @returns {Promise<object|undefined>} - The subscription object or undefined on error.
 */
const showLIKKIMAddressCommand = async (
  device,
  coinType,
  setIsVerifyingAddress,
  setAddressVerificationMessage,
  t
) => {
  try {
    if (typeof device !== "object" || !device.isConnected) {
      console.log("Invalid device:", device);
      return;
    }

    await device.connect();
    await device.discoverAllServicesAndCharacteristics();
    console.log(
      "Show address function Device connected and services discovered."
    );

    if (
      typeof device.writeCharacteristicWithResponseForService !== "function"
    ) {
      console.log(
        "Device does not support writeCharacteristicWithResponseForService."
      );
      return;
    }

    const commandString = coinCommandMapping[coinType];
    if (!commandString) {
      console.log("Unsupported coin type:", coinType);
      return;
    }

    const encodedCommand = Buffer.from(commandString, "utf-8").toString(
      "base64"
    );

    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeCharacteristicUUID,
      encodedCommand
    );

    setIsVerifyingAddress(true);
    setAddressVerificationMessage("Verifying address on LIKKIM...");
    console.log("Display command sent:", commandString);

    const addressMonitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.log("Error monitoring response:", error);
          return;
        }
        if (!characteristic || !characteristic.value) {
          console.log("No valid data received.");
          return;
        }
        const receivedDataString = Buffer.from(
          characteristic.value,
          "base64"
        ).toString("utf8");
        const receivedDataHex = Buffer.from(characteristic.value, "base64")
          .toString("hex")
          .toUpperCase();
        console.log("Received string:", receivedDataString);
        console.log("Received hex:", receivedDataHex);

        if (receivedDataString === "Address_OK") {
          console.log("Address displayed successfully.");
          setAddressVerificationMessage(t("addressShown"));
        }
      }
    );

    return addressMonitorSubscription;
  } catch (error) {
    console.log("Failed to send display address command:", error);
  }
};

export default showLIKKIMAddressCommand;
