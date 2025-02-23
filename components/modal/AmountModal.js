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

const AmountModal = ({
  visible,
  onRequestClose,
  TransactionsScreenStyle,
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
  valueUsd,
  setCryptoCards,
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
        `https://df.likkim.com/api/market/index-tickers?instId=${instIds}`
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
        style={TransactionsScreenStyle.centeredView}
      >
        <BlurView
          intensity={10}
          style={TransactionsScreenStyle.blurBackground}
        />
        <View style={TransactionsScreenStyle.amountModalView}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {selectedCryptoIcon && (
              <Image
                source={selectedCryptoIcon}
                style={{ width: 24, height: 24, marginRight: 8 }}
              />
            )}
            <Text style={TransactionsScreenStyle.modalTitle}>
              {selectedCrypto} ({selectedCryptoChain})
            </Text>
          </View>

          <Text style={TransactionsScreenStyle.modalTitle}>
            {t("Enter the amount to send:")}
          </Text>

          <View style={{ width: "100%", alignItems: "center" }}>
            <TextInput
              style={[
                TransactionsScreenStyle.amountInput,
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
                <Text style={TransactionsScreenStyle.balanceModalSubtitle}>
                  {t("Balance")}: {balance} {selectedCrypto}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                  marginBottom: 8,
                }}
              >
                <Text style={TransactionsScreenStyle.balanceLabel}>
                  {t("Balance in")}
                </Text>
                <Text style={TransactionsScreenStyle.balanceValue}>
                  {currencyUnit}: {convertedBalance}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "90%",
                }}
              >
                <Text style={TransactionsScreenStyle.balanceLabel}>
                  {t("Entered Amount in")}
                </Text>
                <Text style={TransactionsScreenStyle.balanceValue}>
                  {currencyUnit}: {convertedAmount}
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                width: "90%",
                marginBottom: 20,
              }}
            >
              {parseFloat(amount) > parseFloat(balance) && (
                <Text
                  style={[
                    TransactionsScreenStyle.balanceValue,
                    { color: "#FF5252", marginTop: 5 },
                  ]}
                >
                  {t("Insufficient Balance")}
                </Text>
              )}
            </View>
          </View>

          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <TouchableOpacity
              style={[
                TransactionsScreenStyle.optionButton,
                {
                  backgroundColor: isAmountValid
                    ? buttonBackgroundColor
                    : disabledButtonBackgroundColor,
                },
              ]}
              onPress={handleNextAfterAmount}
              disabled={!isAmountValid}
            >
              <Text style={TransactionsScreenStyle.submitButtonText}>
                {t("Next")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TransactionsScreenStyle.cancelButton}
              onPress={onRequestClose}
            >
              <Text style={TransactionsScreenStyle.cancelButtonText}>
                {t("Back")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AmountModal;
