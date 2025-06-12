//  modal/AmountModal.js
import React, { useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { metricsAPII } from "../../env/apiEndpoints";
const AmountModal = ({
  visible,
  onRequestClose,
  ActivityScreenStyle,
  t,
  isDarkMode,
  amount,
  setAmount,
  balance,
  fee,
  rapidFee,
  setFee,
  isAmountValid,
  buttonBackgroundColor,
  disabledButtonBackgroundColor,
  handleNextAfterAmount,
  selectedCrypto,
  selectedCryptoChain,
  selectedCryptoIcon,
  currencyUnit,
  exchangeRates,
  cryptoCards,
  selectedCryptoName,
  EstimatedValue,
  setCryptoCards,
  recommendedFee,
  recommendedValue,
  rapidFeeValue,
  rapidCurrencyValue,
  selectedFeeTab,
  setSelectedFeeTab,
}) => {
  useEffect(() => {
    if (visible) {
      fetchPriceChanges();
    }
  }, [visible]);

  const fetchPriceChanges = async () => {
    if (cryptoCards.length === 0) return;
    const instIds = cryptoCards
      .map((card) => `${card.shortName}-USD`)
      .join(",");
    try {
      const response = await fetch(
        `${metricsAPII.indexTickers}?instId=${instIds}`
      );
      const data = await response.json();
      if (data.code === 0 && data.data) {
        setCryptoCards((prevCards) =>
          prevCards.map((card) => {
            const ticker = data.data[`${card.shortName}-USD`];
            return ticker ? { ...card, priceUsd: ticker.last || "0" } : card;
          })
        );
      }
    } catch (error) {
      console.log("Error fetching price changes:", error);
    }
  };

  const selectedCryptoInfo = cryptoCards.find(
    (crypto) =>
      crypto.shortName === selectedCrypto || crypto.name === selectedCryptoName
  );
  const priceUsd = selectedCryptoInfo ? selectedCryptoInfo.priceUsd : 1;

  const getConvertedBalance = (cardBalance) => {
    const cryptoToUsdBalance = cardBalance * priceUsd;
    return (cryptoToUsdBalance * exchangeRates[currencyUnit]).toFixed(2);
  };
  const convertedBalance = getConvertedBalance(balance);

  const convertedAmount =
    amount && !isNaN(amount)
      ? (parseFloat(amount) * priceUsd * exchangeRates[currencyUnit]).toFixed(2)
      : "0.00";

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={ActivityScreenStyle.centeredView}
      >
        <BlurView intensity={10} style={ActivityScreenStyle.blurBackground} />
        <View
          style={[
            ActivityScreenStyle.amountModalView,
            { alignSelf: "center", justifyContent: "center" },
          ]}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {selectedCryptoIcon && (
              <Image
                source={selectedCryptoIcon}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
            )}
            <Text style={ActivityScreenStyle.modalTitle}>
              {selectedCrypto} ({selectedCryptoChain})
            </Text>
          </View>

          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              style={[
                ActivityScreenStyle.amountInput,
                {
                  color: isDarkMode ? "#ffffff" : "#000000",
                  backgroundColor: "transparent",
                  fontSize: 30,
                  textAlign: "center",
                  fontWeight: "bold",
                },
              ]}
              placeholder={t("Enter Amount")}
              placeholderTextColor={isDarkMode ? "#808080" : "#cccccc"}
              keyboardType="numeric"
              onChangeText={(text) => {
                const normalizedText = text.replace(/^0+(?!\.|$)/, "");
                const regex = /^\d*\.?\d{0,10}$/;
                if (regex.test(normalizedText)) {
                  setAmount(normalizedText);
                }
              }}
              value={amount}
              autoFocus
              caretHidden
            />

            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              <View
                style={{
                  width: "90%",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={ActivityScreenStyle.AssetsModalSubtitle}>
                  {t("Balance")}: {balance} {selectedCrypto}
                </Text>

                <Text style={ActivityScreenStyle.balanceModalSubtitle}>
                  {t("Balance in")} {currencyUnit}: {convertedBalance}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <Text style={ActivityScreenStyle.balanceLabel}>
                  {t("Entered Amount in")}
                </Text>
                <Text style={ActivityScreenStyle.balanceValue}>
                  {currencyUnit}: {convertedAmount}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              {parseFloat(amount) > parseFloat(balance) && (
                <Text
                  style={[
                    ActivityScreenStyle.balanceValue,
                    { color: "#FF5252", marginTop: 5 },
                  ]}
                >
                  {t("Not enough value")}
                </Text>
              )}
            </View>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  backgroundColor: isDarkMode ? "#333" : "#eee",
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: isDarkMode ? "#333" : "#eee",
                  padding: 2,
                  alignSelf: "flex-start",
                }}
              >
                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    backgroundColor:
                      selectedFeeTab === "Recommended"
                        ? isDarkMode
                          ? "#555"
                          : "#fff"
                        : "transparent",
                    borderColor: isDarkMode ? "#333" : "#eee",
                    borderWidth: 1,
                  }}
                  onPress={() => setSelectedFeeTab("Recommended")}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        selectedFeeTab === "Recommended"
                          ? isDarkMode
                            ? "#fff"
                            : "#000"
                          : "#888",
                    }}
                  >
                    {t("Recommended")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    paddingVertical: 8,
                    paddingHorizontal: 20,
                    borderRadius: 20,
                    backgroundColor:
                      selectedFeeTab === "Rapid"
                        ? isDarkMode
                          ? "#555"
                          : "#fff"
                        : "transparent",
                    borderColor: isDarkMode ? "#333" : "#eee",
                    borderWidth: 1,
                    marginLeft: 10,
                  }}
                  onPress={() => setSelectedFeeTab("Rapid")}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color:
                        selectedFeeTab === "Rapid"
                          ? isDarkMode
                            ? "#fff"
                            : "#000"
                          : "#888",
                    }}
                  >
                    {t("Rapid")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                width: "90%",
              }}
            >
              <Text
                style={[ActivityScreenStyle.balanceLabel, { marginBottom: 8 }]}
              >
                {t("Processing Fee")}:
              </Text>

              {selectedFeeTab === "Recommended" ? (
                <View style={{ marginBottom: 10 }}>
                  <Text style={ActivityScreenStyle.balanceValue}>
                    {recommendedFee} {selectedCrypto} (Recommended)
                  </Text>
                  <Text style={ActivityScreenStyle.balanceValue}>
                    ({currencyUnit} {recommendedValue})
                  </Text>
                </View>
              ) : (
                <View style={{ marginBottom: 10 }}>
                  <Text style={ActivityScreenStyle.balanceValue}>
                    {rapidFeeValue} {selectedCrypto} (Rapid)
                  </Text>
                  <Text style={ActivityScreenStyle.balanceValue}>
                    ({currencyUnit} {rapidCurrencyValue})
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              width: "100%",
              marginTop: 10,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={[
                  ActivityScreenStyle.cancelButton,
                  { flex: 1, marginRight: 8, borderRadius: 15 },
                ]}
                onPress={onRequestClose}
              >
                <Text style={ActivityScreenStyle.cancelButtonText}>
                  {t("Back")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  ActivityScreenStyle.optionButton,
                  { flex: 1, marginLeft: 8, borderRadius: 15 },
                  {
                    backgroundColor: isAmountValid
                      ? buttonBackgroundColor
                      : disabledButtonBackgroundColor,
                  },
                ]}
                onPress={handleNextAfterAmount}
                disabled={!isAmountValid}
              >
                <Text style={ActivityScreenStyle.submitButtonText}>
                  {t("Next")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AmountModal;
