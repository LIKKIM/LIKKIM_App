import { Buffer } from "buffer";

/**
 * 处理“确认兑换”逻辑
 * @param {Object} params
 * @param {Object} params.selectedFromToken
 * @param {Object} params.selectedToToken
 * @param {string|number} params.fromValue
 * @param {Function} params.setConvertModalVisible
 * @param {Function} params.setConfirmModalVisible
 * @param {Function} params.getTokenDetails
 * @param {Object} params.selectedDevice
 * @param {Object} params.convertAPI
 * @param {Object} params.bluetoothConfig
 */
export const handleConfirmConvert = async ({
  selectedFromToken,
  selectedToToken,
  fromValue,
  setConvertModalVisible,
  setConfirmModalVisible,
  getTokenDetails,
  selectedDevice,
  convertAPI,
  bluetoothConfig,
}) => {
  if (!selectedFromToken || !selectedToToken || !fromValue) {
    console.log("缺少必要参数，无法执行Convert");
    return;
  }

  setConvertModalVisible(false);
  setConfirmModalVisible(true);
  try {
    const fromDetails = getTokenDetails(selectedFromToken);
    const toDetails = getTokenDetails(selectedToToken);

    if (!fromDetails || !toDetails) {
      console.log("找不到代币详情");
      return;
    }

    /* 
      const requestBody = {
        chain: fromDetails.queryChainName || "ethereum",
        fromTokenAddress: fromDetails.contractAddress,
        toTokenAddress: toDetails.contractAddress,
        amount: fromValue.toString(),
        userWalletAddress: fromDetails.address,
        slippage: "1",
        provider: "openocean",
      };
    */

    // 这里的 requestBody 可根据实际业务调整
    const requestBody = {
      chain: "ethereum",
      fromTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      amount: fromValue.toString(),
      userWalletAddress: "0x36F06561b946801DCa606842C9701EA3Fe850Ca2",
      slippage: "1",
      provider: "openocean",
    };

    console.log("准备发起Convert请求：", requestBody);

    const response = await fetch(convertAPI.executeConvert, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) throw new Error("网络请求失败");

    const responseData = await response.json();

    if (responseData?.code === "0") {
      console.log("Convert成功");
      console.log("交易签名Data：", responseData.data?.data);

      // 👉 新增：把Convert返回的data封装成sign消息发给设备
      const hexToSign = responseData.data.data;
      const chainKey = "ethereum"; // 这里先固定，如果以后支持其他链，记得做成动态
      const path = "m/44'/60'/0'/0/0"; // 你的默认BIP44路径

      const signMessage = `sign:${chainKey},${path},${hexToSign}`;
      const signBuffer = Buffer.from(signMessage, "utf-8");
      const signBase64 = signBuffer.toString("base64");

      await selectedDevice.writeCharacteristicWithResponseForService(
        bluetoothConfig.serviceUUID,
        bluetoothConfig.writeCharacteristicUUID,
        signBase64
      );
      console.log("Convert的sign消息已发送给设备等待签名...");
    } else {
      console.log("Convert失败", responseData?.message || "未知错误");
    }
  } catch (error) {
    console.log("发送Convert请求异常:", error);
  }
};
