// AmountModal.js

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
}) => {
  useEffect(() => {
    console.log("AmountModal - fee:", fee, "rapidFee:", rapidFee);
  }, [fee, rapidFee]);
  const selectedCryptoInfo = cryptoCards.find(
    (crypto) =>
      crypto.shortName === selectedCrypto || crypto.name === selectedCryptoName
  );
  const priceUsd = selectedCryptoInfo ? selectedCryptoInfo.priceUsd : 1;

  // 将余额转换为法币金额
  const getConvertedBalance = (cardBalance) => {
    const cryptoToUsdBalance = cardBalance * priceUsd;
    const convertedBalance = cryptoToUsdBalance * exchangeRates[currencyUnit];
    return convertedBalance.toFixed(2);
  };
  const convertedBalance = getConvertedBalance(balance);

  // 将用户输入金额转换为法币金额
  const convertedAmount =
    amount && !isNaN(amount)
      ? (parseFloat(amount) * priceUsd * exchangeRates[currencyUnit]).toFixed(2)
      : "0.00";

  return (
    <Modal
      animationType="slide"
      transparent={true}
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
          {/* 标题及图标 */}
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
            {/* 用户输入金额 */}
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
                // 去除多余的前导 0
                let normalizedText = text.replace(/^0+(?!\.|$)/, "");
                // 限制数字格式（最多 10 位小数）
                const regex = /^\d*\.?\d{0,10}$/;
                if (regex.test(normalizedText)) {
                  setAmount(normalizedText);
                }
              }}
              value={amount}
              autoFocus={true}
              caretHidden={true}
            />

            {/* 信息展示区域：原始余额 & 转换后的余额/输入金额 */}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginVertical: 10,
              }}
            >
              {/* 显示原始余额信息 */}
              <View
                style={{
                  width: "90%",

                  justifyContent: "center", // 水平居中
                  alignItems: "center", // 垂直居中
                }}
              >
                <Text style={TransactionsScreenStyle.balanceModalSubtitle}>
                  {t("Balance")}: {balance} {selectedCrypto}
                </Text>
              </View>

              {/* 同时显示余额转换后的法币金额 */}
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

              {/* 显示用户输入金额转换后的法币金额 */}
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

            {/* 手续费及余额不足提示 */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "90%",
                marginBottom: 20,
              }}
            >
              <Text style={TransactionsScreenStyle.balanceLabel}>
                {t("Transaction Fee")}:
              </Text>

              <Text style={TransactionsScreenStyle.balanceValue}>
                {fee} {selectedCrypto}
              </Text>
              <Text style={TransactionsScreenStyle.balanceValue}>
                {rapidFee} {selectedCrypto}
              </Text>
              {parseFloat(amount) > parseFloat(balance) + parseFloat(fee) && (
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

          {/* 按钮区域 */}
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
