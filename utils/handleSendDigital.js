/**
 * 发送数字资产到设备（蓝牙发送合约地址和链名称）
 * @param {Object} params
 * @param {Object} params.selectedNFT
 * @param {Object} params.device
 * @param {Object} params.Buffer
 * @param {string} params.serviceUUID
 * @param {string} params.writeCharacteristicUUID
 * @param {Function} params.Alert
 * @returns {Promise<void>}
 */
export const handleSendDigital = async ({
  selectedNFT,
  device,
  Buffer,
  serviceUUID,
  writeCharacteristicUUID,
  Alert,
}) => {
  if (!device) {
    console.log("没有选择设备");
    return;
  }

  const contractAddress = selectedNFT?.tokenContractAddress;
  const chainName = selectedNFT?.chain;

  if (!contractAddress || !chainName) {
    console.log("合约地址或链名称为空");
    return;
  }

  const base64ContractAddress = Buffer.from(contractAddress, "utf-8").toString(
    "base64"
  );
  const base64ChainName = Buffer.from(chainName, "utf-8").toString("base64");

  console.log("转换后的 Base64 合约地址:", base64ContractAddress);
  console.log("转换后的 Base64 链名称:", base64ChainName);

  const message = {
    contractAddress: base64ContractAddress,
    chainName: base64ChainName,
  };

  try {
    await device.connect();
    await device.discoverAllServicesAndCharacteristics();

    await device.writeCharacteristicWithResponseForService(
      serviceUUID,
      writeCharacteristicUUID,
      JSON.stringify(message)
    );

    console.log("合约地址和链名称（Base64）已成功发送到设备");
    if (Alert) Alert.alert("发送成功", "合约地址和链名称已发送到设备");
  } catch (error) {
    console.log("发送数据时出错:", error);
    if (Alert) Alert.alert("发送失败", error.message || "发送数据时出错");
  }
};
