/**
 * 获取链上手续费
 * @param {Object} params
 * @param {string} params.selectedQueryChainName - 当前选中链名
 * @param {Function} params.setFee - 设置推荐手续费
 * @param {Function} params.setRapidFee - 设置快速手续费
 * @param {Object} params.accountAPI - API对象，需有 blockchainFee 字段
 */
export const fetchTransactionFee = async ({
  selectedQueryChainName,
  setFee,
  setRapidFee,
  accountAPI,
}) => {
  try {
    const postData = {
      chain: selectedQueryChainName,
      type: "",
    };

    // 打印发送的 POST 数据
    console.log("🚀 Sending POST data:", JSON.stringify(postData, null, 2));

    const response = await fetch(accountAPI.blockchainFee, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      console.log("❌ HTTP Error:", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    console.log("✅ Received response data:", JSON.stringify(data, null, 2));

    if (data && data.data) {
      const { rapidFee, recommendedFee } = data.data;

      setFee(recommendedFee);
      console.log("✅ Fee set to:", recommendedFee);

      setRapidFee(rapidFee);
      console.log("✅ Rapid fee set to:", rapidFee);
    }
  } catch (error) {
    console.log("❌ Failed to fetch processing Fee:", error);
  }
};
