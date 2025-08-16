import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * 获取所有币种第一页交易历史
 * @param {Object[]} initialAdditionalCryptos - 币种数组
 * @param {Function} setActivityLog - 设置交易历史的 setState
 * @param {Function} setActivityLogPages - 设置分页状态的 setState
 * @param {Object} accountAPI - API对象，需有 queryTransaction 字段
 */
export const fetchAllActivityLog = async ({
  initialAdditionalCryptos,
  setActivityLog,
  setActivityLogPages,
  accountAPI,
}) => {
  if (initialAdditionalCryptos && initialAdditionalCryptos.length > 0) {
    const uniqueCryptos = initialAdditionalCryptos.filter(
      (crypto, index, self) =>
        crypto.address &&
        crypto.address.trim() !== "" &&
        index ===
          self.findIndex(
            (c) =>
              c.queryChainName === crypto.queryChainName &&
              c.address === crypto.address
          )
    );

    // 查第一页
    const requests = uniqueCryptos.map(async (crypto) => {
      const key = `${crypto.queryChainName}:${crypto.address}`;
      const postData = {
        chain: crypto.queryChainName,
        address: crypto.address,
        page: 1,
        pageSize: 10,
      };

      try {
        const response = await fetch(accountAPI.queryTransaction, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
        const data = await response.json();

        if (data && data.code === "0" && Array.isArray(data.data)) {
          const processedTransactions = data.data.map((tx) => ({
            ...tx, // 保留所有字段
            chainKey: key,
          }));
          // 标记当前页，是否还有下一页
          setActivityLogPages((prev) => ({
            ...prev,
            [key]: { page: 1, finished: data.data.length < 10 },
          }));
          return processedTransactions;
        } else {
          setActivityLogPages((prev) => ({
            ...prev,
            [key]: { page: 1, finished: true },
          }));
        }
      } catch (err) {
        setActivityLogPages((prev) => ({
          ...prev,
          [key]: { page: 1, finished: true },
        }));
      }
      return [];
    });

    const results = await Promise.all(requests);
    // 合并所有交易记录
    const merged = results.flat();
    setActivityLog(merged);
    // 清理并持久化
    const filtered = merged.filter(
      (item) =>
        item.amount !== null &&
        item.amount !== undefined &&
        item.amount !== "0" &&
        item.amount !== "" &&
        Number(item.amount) !== 0 &&
        !isNaN(Number(item.amount)) &&
        item.state !== 0 &&
        item.state !== "0" &&
        item.state !== null &&
        item.state !== undefined
    );
    await AsyncStorage.setItem("ActivityLog", JSON.stringify(filtered));
    setActivityLog(filtered);
  }
};

/**
 * 分页获取所有币种下一页交易历史
 * @param {Object[]} initialAdditionalCryptos - 币种数组
 * @param {Object} activityLogPages - 分页状态对象
 * @param {Object[]} ActivityLog - 当前已加载的交易历史
 * @param {Function} setActivityLog - 设置交易历史的 setState
 * @param {Function} setActivityLogPages - 设置分页状态的 setState
 * @param {Object} accountAPI - API对象，需有 queryTransaction 字段
 * @returns {Promise<boolean>} - 是否有新数据加载
 */
export const fetchNextActivityLogPage = async ({
  initialAdditionalCryptos,
  activityLogPages,
  ActivityLog,
  setActivityLog,
  setActivityLogPages,
  accountAPI,
}) => {
  if (!initialAdditionalCryptos || initialAdditionalCryptos.length === 0)
    return false;

  let anyLoaded = false;
  const uniqueCryptos = initialAdditionalCryptos.filter(
    (crypto, index, self) =>
      crypto.address &&
      crypto.address.trim() !== "" &&
      index ===
        self.findIndex(
          (c) =>
            c.queryChainName === crypto.queryChainName &&
            c.address === crypto.address
        )
  );

  const requests = uniqueCryptos.map(async (crypto) => {
    const key = `${crypto.queryChainName}:${crypto.address}`;
    const pageState = activityLogPages[key] || { page: 1, finished: false };
    if (pageState.finished) return []; // 当前币已加载完

    const nextPage = (pageState.page || 1) + 1;
    const postData = {
      chain: crypto.queryChainName,
      address: crypto.address,
      page: nextPage,
      pageSize: 10,
    };

    try {
      const response = await fetch(accountAPI.queryTransaction, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });
      const data = await response.json();

      if (
        data &&
        data.code === "0" &&
        Array.isArray(data.data) &&
        data.data.length > 0
      ) {
        anyLoaded = true;
        setActivityLogPages((prev) => ({
          ...prev,
          [key]: { page: nextPage, finished: data.data.length < 10 },
        }));
        return data.data.map((tx) => ({
          ...tx,
          chainKey: key,
        }));
      } else {
        setActivityLogPages((prev) => ({
          ...prev,
          [key]: { page: nextPage, finished: true },
        }));
      }
    } catch (err) {
      setActivityLogPages((prev) => ({
        ...prev,
        [key]: { page: nextPage, finished: true },
      }));
    }
    return [];
  });

  const results = await Promise.all(requests);
  const newLogs = results.flat();
  if (newLogs.length > 0) {
    const merged = [...ActivityLog, ...newLogs];

    // 过滤函数
    const filtered = merged.filter(
      (item) =>
        item.state !== 0 &&
        item.state !== "0" &&
        item.state !== null &&
        item.state !== undefined &&
        item.amount !== null &&
        item.amount !== undefined &&
        item.amount !== "0" &&
        item.amount !== "" &&
        Number(item.amount) !== 0 &&
        !isNaN(Number(item.amount))
    );

    // 持久化到AsyncStorage
    await AsyncStorage.setItem("ActivityLog", JSON.stringify(filtered));
    setActivityLog(filtered);
  }
  return anyLoaded;
};
