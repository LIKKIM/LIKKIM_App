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

    // 先发送表头，包含固件文件大小
    const headerCommand = "DATA_OTA" + firmwareData.length + "SIZE";
    const base64HeaderCommand = Buffer.from(headerCommand, "utf-8").toString(
      "base64"
    );
    await selectedDevice.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeCharacteristicUUID,
      base64HeaderCommand
    );

    // 然后将固件数据拆分为每包200字节的块，逐个发送数据块内容
    const chunkSize = 200;
    for (let offset = 0; offset < firmwareData.length; offset += chunkSize) {
      const chunk = firmwareData.slice(offset, offset + chunkSize);
      const hexChunk = Array.from(chunk)
        .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
        .join("");
      const base64ChunkCommand = Buffer.from(hexChunk, "utf-8").toString();
      console.log(`Sending chunk at offset ${offset}, size ${chunk.length}`);
      await selectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64ChunkCommand
      );
    }
    console.log("All chunks sent successfully");

    Alert.alert(
      t("Firmware Update Test"),
      t(
        "All firmware data sent successfully in 200-byte chunks as Base64 text commands. Please check if the embedded device received the data."
      )
    );
  } catch (error) {
    console.error("Firmware update error:", error);
    Alert.alert(t("Firmware Update Error"), error.message);
  }
};

export default handleFirmwareUpdate;
