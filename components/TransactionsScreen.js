// TransactionsScreen.js
import React, { useContext, useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Clipboard,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import TransactionsScreenStyles from "../styles/TransactionsScreenStyle";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TransactionsScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { addedCryptos, setAddedCryptos } = useContext(CryptoContext);
  const TransactionsScreenStyle = TransactionsScreenStyles(isDarkMode);
  const addressIcon = isDarkMode ? "#ffffff" : "#676776";
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const placeholderColor = isDarkMode ? "#ffffff" : "#24234C";
  const [inputAddress, setInputAddress] = useState("");
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [inputAddressModalVisible, setInputAddressModalVisible] =
    useState(false);

  useEffect(() => {
    // 从 AsyncStorage 加载 addedCryptos 数据
    const loadAddedCryptos = async () => {
      try {
        const savedCryptos = await AsyncStorage.getItem("addedCryptos");
        if (savedCryptos !== null) {
          setAddedCryptos(JSON.parse(savedCryptos));
        }
      } catch (error) {
        console.error("Error loading addedCryptos: ", error);
      }
    };
    loadAddedCryptos();
  }, []);

  const handleReceivePress = () => {
    setOperationType("receive");
    setModalVisible(true);
  };

  const handleSendPress = () => {
    setOperationType("send");
    setModalVisible(true);
  };

  const selectCrypto = async (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedAddress(crypto.address);
    setModalVisible(false);
    if (operationType === "receive") {
      setAddressModalVisible(true);
    } else if (operationType === "send") {
      setAddressModalVisible(false);
      setInputAddress("");
      setInputAddressModalVisible(true);
    }
  };

  const copyToClipboard = (address) => {
    Clipboard.setString(address);
    alert(t("Address copied to clipboard!"));
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={TransactionsScreenStyle.bgContainer}
    >
      <View className="w-[100%]" style={TransactionsScreenStyle.container}>
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
          {/*       <BlurView intensity={3} style={TransactionsScreenStyle.blurView} /> */}
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
                  placeholderTextColor={placeholderColor}
                  onChangeText={(text) => setInputAddress(text)}
                  value={inputAddress}
                />
              </View>
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
                style={TransactionsScreenStyle.cancelButton}
                onPress={() => setInputAddressModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
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
                style={TransactionsScreenStyle.cancelButton}
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
            <View style={TransactionsScreenStyle.receiveModalView}>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Address for")} {selectedCrypto}:
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={TransactionsScreenStyle.addressText}>
                  {selectedAddress}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(selectedAddress)}
                >
                  <Icon name="content-copy" size={24} color={addressIcon} />
                </TouchableOpacity>
              </View>
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
