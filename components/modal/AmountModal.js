// AmountModal.js
import React from "react";
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
  isAmountValid,
  buttonBackgroundColor,
  disabledButtonBackgroundColor,
  handleNextAfterAmount,
  selectedCrypto,
  selectedCryptoChain,
  selectedCryptoIcon,
  currencyUnit,
  exchangeRates,
}) => {
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

          {/* 显示余额和相关信息 */}
          <View style={{ marginBottom: 15 }}>
            {/*  <Text style={TransactionsScreenStyle.infoText}>
              {t("Price per unit in USD")}: ${priceUsd}
            </Text> */}
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
                  backgroundColor: "transparent", // 去掉背景颜色
                  fontSize: 30, // 设置大字号
                  textAlign: "center", // 输入的文本居中
                  fontWeight: "bold", // 设置粗体字
                },
              ]}
              placeholder={t("Enter Amount")}
              placeholderTextColor={isDarkMode ? "#808080" : "#cccccc"}
              keyboardType="numeric"
              onChangeText={(text) => {
                // Normalize the input by removing leading zeros
                let normalizedText = text.replace(/^0+(?!\.|$)/, "");

                // Allow only valid decimal numbers with up to 10 decimal places
                const regex = /^\d*\.?\d{0,10}$/;
                if (regex.test(normalizedText)) {
                  setAmount(normalizedText);
                }
              }}
              value={amount}
              autoFocus={true}
              caretHidden={true} // 隐藏光标
            />
            <Text style={TransactionsScreenStyle.balanceModalSubtitle}>
              {t("Balance")}: {balance} {selectedCrypto}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: 280,
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <View style={{ justifyContent: "flex-start" }}>
              <Text style={TransactionsScreenStyle.balanceSubtitle}>
                {currencyUnit} : {balance}
              </Text>

              {/* 当用户输入的金额大于余额时显示余额不足 */}
              {parseFloat(amount) > parseFloat(balance) + parseFloat(fee) && (
                <Text
                  style={[
                    TransactionsScreenStyle.balanceSubtitle,
                    { color: "#FF5252", marginTop: 5 },
                  ]}
                >
                  {t("Insufficient Balance")}
                </Text>
              )}
            </View>

            <Text style={TransactionsScreenStyle.balanceSubtitle}>
              {t("Fee")}: {fee} {selectedCrypto}
            </Text>
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
              disabled={isAmountValid} //测试使用
              // disabled={!isAmountValid}
            >
              <Text style={TransactionsScreenStyle.submitButtonText}>
                {t("Next")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TransactionsScreenStyle.cancelButton}
              onPress={() => {
                onRequestClose();
              }}
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
