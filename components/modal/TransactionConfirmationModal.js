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
  ActivityScreenStyle,
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
      <BlurView intensity={10} style={ActivityScreenStyle.centeredView}>
        <View style={ActivityScreenStyle.confirmModalView}>
          <Text style={ActivityScreenStyle.modalTitle}>
            {t("Waiting for Confirmation")}
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
                }}
              />
            )}
            <Text style={ActivityScreenStyle.modalTitle}>
              {`${selectedCrypto} (${selectedCryptoChain})`}
            </Text>
          </View>

          <ScrollView
            style={{ maxHeight: 320 }}
            contentContainerStyle={{ paddingHorizontal: 0 }}
          >
            <Text style={ActivityScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Amount")}:
              </Text>
              {` ${amount} ${selectedCrypto}`}
            </Text>

            <Text style={ActivityScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Amount in Currency")}:
              </Text>
              {` ${(
                parseFloat(amount) *
                priceUsd *
                exchangeRates[currencyUnit]
              ).toFixed(2)} ${currencyUnit}`}
            </Text>

            <Text style={ActivityScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Payment Address")}:
              </Text>
              {` ${selectedAddress}`}
            </Text>

            <Text style={ActivityScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Recipient Address")}:
              </Text>
              {` ${inputAddress}`}
            </Text>

            <View style={ActivityScreenStyle.transactionText}>
              <Text style={ActivityScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                  {t("Processing Fee")}:
                </Text>
              </Text>
              <View>
                {selectedFeeTab === "Recommended" ? (
                  <>
                    <Text style={ActivityScreenStyle.transactionText}>
                      {recommendedFee} {selectedCrypto} (Recommended)
                    </Text>
                    <Text style={ActivityScreenStyle.transactionText}>
                      ({currencyUnit} {recommendedValue})
                    </Text>
                  </>
                ) : (
                  <>
                    <Text style={ActivityScreenStyle.balanceLabel}>
                      {rapidFeeValue} {selectedCrypto} (Rapid)
                    </Text>
                    <Text style={ActivityScreenStyle.balanceLabel}>
                      ({currencyUnit} {rapidCurrencyValue})
                    </Text>
                  </>
                )}
              </View>
            </View>

            <Text style={ActivityScreenStyle.transactionText}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                {t("Detected Network")}:
              </Text>
              {"\n"}
              {` ${detectedNetwork}`}
            </Text>
          </ScrollView>

          <View style={{ marginTop: 20, width: "100%" }}>
            <TouchableOpacity
              style={ActivityScreenStyle.optionButton}
              onPress={onConfirm}
            >
              <Text style={ActivityScreenStyle.submitButtonText}>
                {t("Confirm")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ActivityScreenStyle.cancelButton}
              onPress={onCancel}
            >
              <Text style={ActivityScreenStyle.cancelButtonText}>
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
