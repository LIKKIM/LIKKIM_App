/**
 * 保存 NFT 到设备（蓝牙发送图片和文本）
 * @param {Object} params
 * @param {Object} params.selectedNFT
 * @param {Array} params.devices
 * @param {Array} params.verifiedDevices
 * @param {Function} params.setBleVisible
 * @param {Object} params.device
 * @param {Function} params.Alert
 * @param {Object} params.ImageResizer
 * @param {Object} params.FileSystem
 * @param {Object} params.Buffer
 * @param {string} params.serviceUUID
 * @param {string} params.writeCharacteristicUUID
 * @param {string} params.notifyCharacteristicUUID
 * @returns {Promise<void>}
 */
export const handleSaveToDevice = async ({
  selectedNFT,
  devices,
  verifiedDevices,
  setBleVisible,
  device,
  Alert,
  ImageResizer,
  FileSystem,
  Buffer,
  serviceUUID,
  writeCharacteristicUUID,
  notifyCharacteristicUUID,
}) => {
  let targetDevice = device;
  if (verifiedDevices.length > 0 && !targetDevice) {
    targetDevice = devices.find((d) => d.id === verifiedDevices[0]);
    if (Alert) Alert.alert("NFT sending started");
  }
  if (verifiedDevices.length === 0 || !targetDevice) {
    if (setBleVisible) {
      setBleVisible(true);
    }
    return;
  }

  if (selectedNFT?.logoUrl) {
    try {
      // 使用 fetch 获取图片数据
      const response = await fetch(selectedNFT.logoUrl);
      const imageBlob = await response.blob();

      // 生成 420x420 和 210x210 两种尺寸的 JPEG 图片
      const resizedImage420 = await ImageResizer.createResizedImage(
        URL.createObjectURL(imageBlob),
        420,
        420,
        "JPEG",
        80
      );
      const resizedImage210 = await ImageResizer.createResizedImage(
        URL.createObjectURL(imageBlob),
        210,
        210,
        "JPEG",
        80
      );

      // 读取转换后的 JPEG 文件为 base64 编码字符串
      const fileData420 = await FileSystem.readAsStringAsync(
        resizedImage420.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );
      const fileData210 = await FileSystem.readAsStringAsync(
        resizedImage210.uri,
        {
          encoding: FileSystem.EncodingType.Base64,
        }
      );

      // 写入 .bin 文件，路径为应用文档目录下的 image_420.bin 和 image_210.bin
      const binFileUri420 = FileSystem.documentDirectory + "image_420.bin";
      const binFileUri210 = FileSystem.documentDirectory + "image_210.bin";
      await FileSystem.writeAsStringAsync(binFileUri420, fileData420, {
        encoding: FileSystem.EncodingType.Base64,
      });
      await FileSystem.writeAsStringAsync(binFileUri210, fileData210, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // 读取 bin 文件内容并拆包发送给 BLE 设备
      if (!targetDevice) {
        console.log("没有选择设备，无法发送数据");
        return;
      }

      try {
        // 确保设备已连接，并发现所有服务和特性
        await targetDevice.connect();
        await targetDevice.discoverAllServicesAndCharacteristics();

        // 读取 bin 文件的 base64 内容
        const binData420 = await FileSystem.readAsStringAsync(binFileUri420, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const binData210 = await FileSystem.readAsStringAsync(binFileUri210, {
          encoding: FileSystem.EncodingType.Base64,
        });

        // 发送 nft 的 collectionName，带头部标志 "DATA_NFT_TEXT"
        if (selectedNFT?.name) {
          const collectionName = selectedNFT.name;
          // 计算字节长度
          const collectionNameBytesLength = Buffer.byteLength(
            collectionName,
            "utf-8"
          );
          const collectionNameHeader =
            "DATA_NFT_TEXT" + collectionNameBytesLength.toString() + "SIZE";

          // 先发送头部标志（包含字节大小），并进行Base64编码
          const collectionNameHeaderBase64 = Buffer.from(
            collectionNameHeader,
            "utf-8"
          ).toString("base64");
          await targetDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            collectionNameHeaderBase64
          );

          // 订阅通知，监听嵌入式设备的GET请求
          const subscription = targetDevice.monitorCharacteristicForService(
            serviceUUID,
            notifyCharacteristicUUID,
            async (error, characteristic) => {
              if (error) {
                console.log("监听特性错误:", error);
                return;
              }
              if (!characteristic?.value) return;

              // 解码收到的Base64数据
              const receivedData = Buffer.from(
                characteristic.value,
                "base64"
              ).toString("utf-8");

              if (receivedData.startsWith("GET")) {
                // 解析包序号
                const packetIndex = parseInt(receivedData.substring(3), 10) - 1;
                if (
                  packetIndex >= 0 &&
                  packetIndex * 200 < collectionName.length
                ) {
                  const start = packetIndex * 200;
                  const end = Math.min(start + 200, collectionName.length);
                  const chunk = collectionName.substring(start, end);
                  try {
                    // 对分包数据进行Base64编码后发送
                    const chunkBase64 = Buffer.from(chunk, "utf-8").toString(
                      "base64"
                    );
                    await targetDevice.writeCharacteristicWithResponseForService(
                      serviceUUID,
                      writeCharacteristicUUID,
                      chunkBase64
                    );
                  } catch (e) {
                    console.log("发送 collectionName 数据包错误:", e);
                  }
                }
              } else if (receivedData === "FINISH") {
                subscription.remove();
              }
            }
          );

          // 在 DATA_NFT_TEXT 发送完成后，开始发送 DATA_NFT_IMG 数据
          const sendNFTImgData = async () => {
            // 发送 420 尺寸图片数据，前面加开头标志 "DATA_NFT_IMG" + 数据字节大小
            const header420 =
              "DATA_NFT_IMG" + binData420.length.toString() + "SIZE";

            // 先发送 420 头部标志（包含字节大小），并进行Base64编码
            const header420Base64 = Buffer.from(header420, "utf-8").toString(
              "base64"
            );
            await targetDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              header420Base64
            );

            // 订阅通知，监听嵌入式设备的GET请求
            const subscription420 =
              targetDevice.monitorCharacteristicForService(
                serviceUUID,
                notifyCharacteristicUUID,
                async (error, characteristic) => {
                  if (error) {
                    console.log("监听特性错误:", error);
                    return;
                  }
                  if (!characteristic?.value) return;

                  // 解码收到的Base64数据
                  const receivedData = Buffer.from(
                    characteristic.value,
                    "base64"
                  ).toString("utf-8");

                  if (receivedData.startsWith("GET")) {
                    // 解析包序号
                    const packetIndex =
                      parseInt(receivedData.substring(3), 10) - 1;
                    if (
                      packetIndex >= 0 &&
                      packetIndex * 200 < binData420.length
                    ) {
                      const start = packetIndex * 200;
                      const end = Math.min(start + 200, binData420.length);
                      const chunk = binData420.substring(start, end);
                      try {
                        // 对分包数据进行Base64编码后发送
                        const chunkBase64 = Buffer.from(
                          chunk,
                          "utf-8"
                        ).toString("base64");
                        await targetDevice.writeCharacteristicWithResponseForService(
                          serviceUUID,
                          writeCharacteristicUUID,
                          chunkBase64
                        );
                      } catch (e) {
                        console.log("发送 420 图片数据包错误:", e);
                      }
                    }
                  } else if (receivedData === "FINISH") {
                    subscription420.remove();
                  }
                }
              );

            // 订阅完成
          };

          // 监听 DATA_NFT_TEXT 的通知，收到 FINISH 后触发发送图片数据
          const originalSubscription =
            targetDevice.monitorCharacteristicForService(
              serviceUUID,
              notifyCharacteristicUUID,
              async (error, characteristic) => {
                if (error) {
                  console.log("监听特性错误:", error);
                  return;
                }
                if (!characteristic?.value) return;

                const receivedData = Buffer.from(
                  characteristic.value,
                  "base64"
                ).toString("utf-8");

                if (receivedData.startsWith("GET")) {
                  // 解析包序号
                  const packetIndex =
                    parseInt(receivedData.substring(3), 10) - 1;
                  if (
                    packetIndex >= 0 &&
                    packetIndex * 200 < collectionName.length
                  ) {
                    const start = packetIndex * 200;
                    const end = Math.min(start + 200, collectionName.length);
                    const chunk = collectionName.substring(start, end);
                    try {
                      const chunkBase64 = Buffer.from(chunk, "utf-8").toString(
                        "base64"
                      );
                      await targetDevice.writeCharacteristicWithResponseForService(
                        serviceUUID,
                        writeCharacteristicUUID,
                        chunkBase64
                      );
                    } catch (e) {
                      console.log("发送 collectionName 数据包错误:", e);
                    }
                  }
                } else if (receivedData === "FINISH") {
                  originalSubscription.remove();
                  // 发送图片数据
                  await sendNFTImgData();
                }
              }
            );
        }
      } catch (error) {
        console.log("发送 bin 文件时出错:", error);
      }
    } catch (error) {
      console.log("Error fetching image or converting to JPEG .bin:", error);
    }
  }
};
