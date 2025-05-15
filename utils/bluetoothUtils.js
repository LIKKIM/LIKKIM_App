// utils/bluetoothUtils.js
import { useRef } from "react";
import { Buffer } from "buffer";
import {
  serviceUUID,
  writeCharacteristicUUID,
  notifyCharacteristicUUID,
} from "../env/bluetoothConfig";
import { prefixToShortName } from "../config/chainPrefixes";
import {
  hexStringToUint32Array,
  uint32ArrayToHexString,
} from "../utils/hexUtils";

export const monitorSubscription = useRef(null);

export const monitorVerificationCode = (
  device,
  sendparseDeviceCodeedValue,
  setVerificationStatus,
  setReceivedAddresses,
  updateCryptoAddress,
  updateDevicePubHintKey
) => {
  // 正确地移除已有监听
  if (monitorSubscription.current) {
    monitorSubscription.current.remove();
    monitorSubscription.current = null;
  }

  monitorSubscription.current = device.monitorCharacteristicForService(
    serviceUUID,
    notifyCharacteristicUUID,
    async (error, characteristic) => {
      if (error) {
        console.log("Error monitoring device response:", error.message);
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
            setVerificationStatus("walletReady");
          } else {
            setVerificationStatus("waiting");
          }
          return updated;
        });
      }

      if (receivedDataString.startsWith("pubkeyData:")) {
        const pubkeyData = receivedDataString.replace("pubkeyData:", "").trim();
        const [queryChainName, publicKey] = pubkeyData.split(",");
        if (queryChainName && publicKey) {
          console.log(
            `Received public key for ${queryChainName}: ${publicKey}`
          );
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
            writeCharacteristicUUID,
            base64ValidationMessage
          );
          console.log(`Sent 'validation' to device`);
        } catch (error) {
          console.log("Error sending 'validation':", error);
        }
      }

      if (receivedDataString.startsWith("PIN:")) {
        setReceivedVerificationCode(receivedDataString);
        monitorSubscription.current?.remove();
        monitorSubscription.current = null;
        console.log("Complete PIN data received:", receivedDataString);
      }
    }
  );
};

export const stopMonitoringVerificationCode = () => {
  if (monitorSubscription.current) {
    try {
      monitorSubscription.current.remove(); // 使用 monitorSubscription.current
      monitorSubscription.current = null; // 清除当前订阅
      console.log("Stopped monitoring verification code");
    } catch (error) {
      console.log("Error stopping monitoring:", error);
    }
  }
};
