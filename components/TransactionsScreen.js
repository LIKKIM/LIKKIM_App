// TransactionsScreen.js
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import TransactionsScreenStyles from "../styles/TransactionsScreenStyle";

function TransactionsScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { addedCryptos } = useContext(CryptoContext);
  const TransactionsScreenStyle = TransactionsScreenStyles(isDarkMode);

  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#E0E0E0"];
  const [inputAddress, setInputAddress] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [inputAddressModalVisible, setInputAddressModalVisible] =
    useState(false);

  const handleReceivePress = () => {
    setOperationType("receive");
    setModalVisible(true);
  };

  const handleSendPress = () => {
    setOperationType("send");
    setModalVisible(true);
  };

  const selectCrypto = (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedAddress(crypto.address);
    setModalVisible(false);
    if (operationType === "receive") {
      setAddressModalVisible(true);
    } else if (operationType === "send") {
      setAddressModalVisible(false); // 隐藏地址模态窗口
      setInputAddress(""); // 清除先前的输入地址
      setInputAddressModalVisible(true); // 显示输入地址模态窗口
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={TransactionsScreenStyle.container}
    >
      <View className="w-[100%]">
        <TouchableOpacity
          style={TransactionsScreenStyle.roundButton}
          onPress={handleSendPress}
        >
          <Text style={TransactionsScreenStyle.buttonText}>{t("Send")}</Text>
          <Text style={TransactionsScreenStyle.subButtonText}>
            {t("Send crypto to another wallet")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={TransactionsScreenStyle.roundButton}
          onPress={handleReceivePress}
        >
          <Text style={TransactionsScreenStyle.buttonText}>{t("Receive")}</Text>
          <Text style={TransactionsScreenStyle.subButtonText}>
            {t("Receive crypto from another wallet")}
          </Text>
        </TouchableOpacity>
        <View style={TransactionsScreenStyle.historyContainer}>
          <Text style={TransactionsScreenStyle.historyTitle}>
            {t("Transaction History")}
          </Text>
          {transactionHistory.length === 0 ? (
            <Text style={TransactionsScreenStyle.noHistoryText}>
              {t("No Histories")}
            </Text>
          ) : (
            transactionHistory.map((transaction, index) => (
              <View key={index} style={TransactionsScreenStyle.historyItem}>
                <Text style={TransactionsScreenStyle.historyItemText}>
                  {transaction.detail}
                </Text>
              </View>
            ))
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={inputAddressModalVisible}
          onRequestClose={() => setInputAddressModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.modalView}>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Enter the recipient's address:")}
              </Text>

              <View style={{ width: "100%" }}>
                <TextInput
                  style={[TransactionsScreenStyle.input, { color: "#ffffff" }]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor="#ffffff"
                  onChangeText={(text) => setInputAddress(text)}
                  value={inputAddress}
                />
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={() => {
                    console.log(`Sending ${selectedCrypto} to ${inputAddress}`);
                    setInputAddressModalVisible(false);
                    // Implement the logic to send crypto to the input address
                  }}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Submit")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={() => setInputAddressModalVisible(false)}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* 选择接收的加密货币模态窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.modalView}>
              <Text style={TransactionsScreenStyle.TransactionModalTitle}>
                {operationType === "send"
                  ? t("Choose the cryptocurrency to send:")
                  : t("Choose the cryptocurrency to receive:")}
              </Text>
              {addedCryptos.length === 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 300,
                  }}
                >
                  <Text style={TransactionsScreenStyle.modalText}>
                    {t(
                      "No cryptocurrencies available. Please add wallet first."
                    )}
                  </Text>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{ alignItems: "center" }}
                  style={{ maxHeight: 400, width: 280 }}
                >
                  {addedCryptos.map((crypto) => (
                    <TouchableOpacity
                      key={crypto.shortName}
                      style={TransactionsScreenStyle.optionButton}
                      onPress={() => selectCrypto(crypto)}
                    >
                      <Text style={TransactionsScreenStyle.optionButtonText}>
                        {crypto.shortName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={TransactionsScreenStyle.optionButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* 显示选择的加密货币地址的模态窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addressModalVisible}
          onRequestClose={() => setAddressModalVisible(false)}
        >
          <View style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.modalView}>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Address for")} {selectedCrypto}:
              </Text>
              <Text
                style={{
                  color: "#ffffff",
                  textAlign: "center",
                  marginBottom: 30,
                }}
              >
                {selectedAddress}
              </Text>
              <View
                style={{
                  backgroundColor: "#fff",
                  height: 220,
                  width: 220,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                }}
              >
                <QRCode value={selectedAddress} size={200} />
              </View>
              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButton}
                onPress={() => setAddressModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default TransactionsScreen;
