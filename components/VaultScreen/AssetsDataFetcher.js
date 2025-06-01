import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountAPI, metricsAPII } from "../../env/apiEndpoints";

/**
 * 获取价格变动数据
 * @param {Array} cryptoCards - 币种卡片数组
 * @param {Function} setPriceChanges - 设置价格变动状态函数
 * @param {Function} setCryptoCards - 设置币种卡片状态函数
 * @param {Function} setRefreshing - 设置刷新状态函数
 */
export const fetchPriceChanges = async (
  cryptoCards,
  setPriceChanges,
  setCryptoCards,
  setRefreshing
) => {
  if (cryptoCards.length === 0) return; // 没有卡片时不请求

  const instIds = cryptoCards.map((card) => `${card.shortName}-USD`).join(",");

  try {
    const response = await fetch(
      `${metricsAPII.indexTickers}?instId=${instIds}`
    );
    const data = await response.json();

    if (data.code === 0 && data.data) {
      const changes = {};

      // 解析返回的 'data' 对象，按币种进行更新
      Object.keys(data.data).forEach((key) => {
        const shortName = key.replace("$", "").split("-")[0]; // 提取币种名称
        const ticker = data.data[key];

        changes[shortName] = {
          priceChange: ticker.last || "0", // 最新价格
          percentageChange: ticker.changePercent || "0", // 百分比变化
        };
      });

      setPriceChanges(changes); // 更新状态

      // 更新 cryptoCards 中的 priceUsd
      setCryptoCards((prevCards) => {
        let hasChange = false;
        const updatedCards = prevCards.map((card) => {
          if (
            changes[card.shortName] &&
            card.priceUsd !== changes[card.shortName].priceChange
          ) {
            hasChange = true;
            return {
              ...card,
              priceUsd: changes[card.shortName].priceChange, // 更新价格
            };
          }
          return card;
        });
        if (hasChange) {
          return updatedCards;
        } else {
          return prevCards;
        }
      });
    }
  } catch (error) {
    console.log("Error fetching price changes:", error);
  } finally {
    setRefreshing(false);
  }
};

/**
 * 获取钱包余额
 * @param {Array} cryptoCards - 币种卡片数组
 * @param {Function} setCryptoCards - 设置币种卡片状态函数
 */
export const fetchWalletBalance = async (cryptoCards, setCryptoCards) => {
  try {
    const updatedCards = [...cryptoCards];
    let hasChange = false;
    for (let i = 0; i < updatedCards.length; i++) {
      const card = updatedCards[i];
      const postData = {
        chain: card.queryChainName,
        address: card.address,
      };

      const response = await fetch(accountAPI.balance, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();

      if (data.code === "0" && data.data) {
        const { name, balance } = data.data;

        if (
          name.toLowerCase() === card.queryChainName.toLowerCase() &&
          card.balance !== balance
        ) {
          updatedCards[i] = { ...card, balance: balance };
          hasChange = true;
        }
      }
    }
    if (hasChange) {
      setCryptoCards(updatedCards);
      AsyncStorage.setItem("cryptoCards", JSON.stringify(updatedCards));
    }
  } catch (error) {
    console.log("Error fetching wallet balance:", error);
  }
};
