/**
 * confirmDeleteWallet 工具函数
 * 用于确认并执行钱包删除操作，需传入所有依赖项
 *
 * @param {Object} params
 * @param {Function} params.setVerifiedDevices
 * @param {Function} params.setDeleteWalletModalVisible
 * @param {Array} params.cryptoCards
 * @param {Function} params.setCryptoCards
 * @param {Function} [params.setAddedCryptos]
 * @param {Function} [params.setInitialAdditionalCryptos]
 * @param {Object} params.navigation
 * @param {Function} params.t
 * @param {Object} params.Alert
 * @param {Object} params.AsyncStorage
 */
export async function confirmDeleteWallet({
  setVerifiedDevices,
  setDeleteWalletModalVisible,
  cryptoCards,
  setCryptoCards,
  setAddedCryptos,
  setInitialAdditionalCryptos,
  navigation,
  t,
  Alert,
  AsyncStorage,
}) {
  setVerifiedDevices([]);
  setDeleteWalletModalVisible(false);
  try {
    // 打印删除前的state和AsyncStorage
    const [asCryptoCards, asAddedCryptos, asInitialAdditionalCryptos] =
      await Promise.all([
        AsyncStorage.getItem("cryptoCards"),
        AsyncStorage.getItem("addedCryptos"),
        AsyncStorage.getItem("initialAdditionalCryptos"),
      ]);
    console.log("==== 删除前 ====");
    console.log("state.cryptoCards:", cryptoCards);
    if (typeof setAddedCryptos !== "undefined")
      console.log(
        "state.addedCryptos:",
        typeof setAddedCryptos === "function" ? "function" : setAddedCryptos
      );
    if (typeof setInitialAdditionalCryptos !== "undefined")
      console.log(
        "state.initialAdditionalCryptos:",
        typeof setInitialAdditionalCryptos === "function"
          ? "function"
          : setInitialAdditionalCryptos
      );
    console.log("AS.cryptoCards:", asCryptoCards);
    console.log("AS.addedCryptos:", asAddedCryptos);
    console.log("AS.initialAdditionalCryptos:", asInitialAdditionalCryptos);

    const cryptoCardsData = asCryptoCards;
    const parsedCryptoCards = JSON.parse(cryptoCardsData);
    if (parsedCryptoCards && parsedCryptoCards.length > 0) {
      await AsyncStorage.multiRemove([
        "cryptoCards",
        "addedCryptos",
        "initialAdditionalCryptos",
      ]);
      setCryptoCards([]);
      setVerifiedDevices([]);
      if (typeof setAddedCryptos === "function") setAddedCryptos([]);
      if (typeof setInitialAdditionalCryptos === "function")
        setInitialAdditionalCryptos([]);
      // 打印删除后的state和AsyncStorage
      const [asCryptoCards2, asAddedCryptos2, asInitialAdditionalCryptos2] =
        await Promise.all([
          AsyncStorage.getItem("cryptoCards"),
          AsyncStorage.getItem("addedCryptos"),
          AsyncStorage.getItem("initialAdditionalCryptos"),
        ]);
      console.log("==== 删除后 ====");
      console.log("state.cryptoCards:", []);
      if (typeof setAddedCryptos === "function")
        console.log("state.addedCryptos:", []);
      if (typeof setInitialAdditionalCryptos === "function")
        console.log("state.initialAdditionalCryptos:", []);
      console.log("AS.cryptoCards:", asCryptoCards2);
      console.log("AS.addedCryptos:", asAddedCryptos2);
      console.log("AS.initialAdditionalCryptos:", asInitialAdditionalCryptos2);

      Alert.alert(t("Success"), t("Deleted successfully."));
      navigation.goBack();
    } else {
      Alert.alert(t("No Wallet"), t("No wallet available to delete."));
    }
  } catch (error) {
    console.log("Error deleting wallet:", error);
    Alert.alert(t("Error"), t("An error occurred while deleting your wallet."));
  }
}
