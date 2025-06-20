import { Alert } from "react-native";
import { Buffer } from "buffer";
import { firmwareAPI } from "../../env/apiEndpoints";

const handleFirmwareUpdate = async ({
  selectedDevice,
  t,
  setModalMessage,
  setErrorModalVisible,
  serviceUUID,
  writeCharacteristicUUID,
}) => {
  console.log("Firmware Update clicked");
  if (!selectedDevice) {
    setModalMessage(t("No device paired. Please pair with device first."));
    setErrorModalVisible(true);
    return;
  }

  try {
    const response = await fetch(firmwareAPI.lvglExec);
    if (!response.ok) {
      throw new Error("Download failed");
    }
    const arrayBuffer = await response.arrayBuffer();
    const firmwareData = new Uint8Array(arrayBuffer);
    console.log("Firmware downloaded, size:", firmwareData.length);

    const hexBlock = Array.from(firmwareData)
      .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
      .join("");

    const commandString = "DATA_OTA" + "SIZE" + hexBlock;
    console.log("Command String:", commandString);

    const base64Command = Buffer.from(commandString, "utf-8").toString(
      "base64"
    );
    console.log("Base64 Command:", base64Command);

    await selectedDevice.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeCharacteristicUUID,
      base64Command
    );
    console.log("Sent XMODEM update command as Base64 text");

    Alert.alert(
      t("Firmware Update Test"),
      t(
        "First 128-byte block sent successfully as a Base64 text command. Please check if the embedded device received the data."
      )
    );
  } catch (error) {
    console.error("Firmware update error:", error);
    Alert.alert(t("Firmware Update Error"), error.message);
  }
};

export default handleFirmwareUpdate;
