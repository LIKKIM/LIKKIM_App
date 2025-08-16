import { galleryAPI } from "../env/apiEndpoints";

/**
 * 查询 NFT 详情
 * @param {string} chain
 * @param {string} tokenContractAddress
 * @param {string} tokenId
 * @returns {Promise<Object|null>}
 */
export const queryNFTDetail = async (chain, tokenContractAddress, tokenId) => {
  const detailRequestBody = {
    chain,
    tokenContractAddress,
    tokenId,
    type: "okx",
  };

  console.log("Query NFT Details Request:", detailRequestBody);

  try {
    const response = await fetch(galleryAPI.queryNFTDetails, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(detailRequestBody),
    });
    const responseText = await response.text();
    if (!responseText) {
      console.error("Empty response for NFT details", detailRequestBody);
      return null;
    }
    const json = JSON.parse(responseText);
    console.log("NFT Detail Response:", json);
    // 如果返回的 data 是数组且至少有一项，则返回第一项
    if (json.code === "0" && Array.isArray(json.data) && json.data.length > 0) {
      return json.data[0];
    }
    return json;
  } catch (error) {
    console.error("Error querying NFT details", error);
    return null;
  }
};
