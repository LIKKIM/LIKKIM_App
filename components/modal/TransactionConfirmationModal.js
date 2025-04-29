// TransactionConfirmationModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";

const TransactionConfirmationModal = ({
  visible,
  onRequestClose,
  onConfirm,
  onCancel,
  t,
  TransactionsScreenStyle,
  isDarkMode,
  selectedCryptoIcon,
  selectedCrypto,
  selectedCryptoChain,
  amount,
  priceUsd,
  exchangeRates,
  currencyUnit,
  recommendedFee,
  recommendedValue,
  rapidFeeValue,
  rapidCurrencyValue,
  selectedFeeTab,
  setSelectedFeeTab,
  detectedNetwork,
  selectedAddress,
  inputAddress,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
        <View style={TransactionsScreenStyle.confirmModalView}>
          <Text style={TransactionsScreenStyle.modalTitle}>
            {t("Transaction Confirmation")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 6,
              marginBottom: 16,
            }}
          >
            {selectedCryptoIcon && (
              <Image
                source={selectedCryptoIcon}
                style={{
                  width: 24,
                  height: 24,
                  marginRight: 8,
                  marginBottom: 10,
                }}
              />
            )}
            <Text style={TransactionsScreenStyle.modalTitle}>
              {`${selectedCrypto} (${selectedCryptoChain})`}
            </Text>
          </View>

          <ScrollView
            style={{ maxHeight: 320 }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <Text style={TransactionsScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Amount")}:
              </Text>
              {` ${amount} ${selectedCrypto}`}
            </Text>

            <Text style={TransactionsScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Amount in Currency")}:
              </Text>
              {` ${(
                parseFloat(amount) *
                priceUsd *
                exchangeRates[currencyUnit]
              ).toFixed(2)} ${currencyUnit}`}
            </Text>

            <Text style={TransactionsScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Payment Address")}:
              </Text>
              {` ${selectedAddress}`}
            </Text>

            <Text style={TransactionsScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Recipient Address")}:
              </Text>
              {` ${inputAddress}`}
            </Text>

            <View style={TransactionsScreenStyle.transactionText}>
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {t("Transaction Fee")}:
                </Text>
              </Text>
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

              {selectedFeeTab === "Recommended" ? (
                <View style={{ marginTop: 10 }}>
                  <Text style={TransactionsScreenStyle.balanceValue}>
                    {recommendedFee} {selectedCrypto} (Recommended)
                  </Text>
                  <Text style={TransactionsScreenStyle.balanceValue}>
                    ({currencyUnit} {recommendedValue})
                  </Text>
                </View>
              ) : (
                <View style={{ marginTop: 10 }}>
                  <Text style={TransactionsScreenStyle.balanceValue}>
                    {rapidFeeValue} {selectedCrypto} (Rapid)
                  </Text>
                  <Text style={TransactionsScreenStyle.balanceValue}>
                    ({currencyUnit} {rapidCurrencyValue})
                  </Text>
                </View>
              )}
            </View>

            <Text style={TransactionsScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Detected Network")}:
              </Text>
              {"\n"}
              {` ${detectedNetwork}`}
            </Text>
          </ScrollView>

          <View style={{ marginTop: 20, width: "100%" }}>
            <TouchableOpacity
              style={TransactionsScreenStyle.optionButton}
              onPress={onConfirm}
            >
              <Text style={TransactionsScreenStyle.submitButtonText}>
                {t("Confirm")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={TransactionsScreenStyle.cancelButton}
              onPress={onCancel}
            >
              <Text style={TransactionsScreenStyle.cancelButtonText}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default TransactionConfirmationModal;
