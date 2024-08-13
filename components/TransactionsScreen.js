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
import Feather from "react-native-vector-icons/Feather";
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
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const placeholderColor = isDarkMode ? "#ffffff" : "#24234C";
  const [inputAddress, setInputAddress] = useState("");
  const [amountModalVisible, setAmountModalVisible] = useState(false); // 新增状态
  const [amount, setAmount] = useState(""); // 保存输入的金额
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 新增交易确认modal状态
  const [transactionFee, setTransactionFee] = useState("0.001"); // 示例交易手续费
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
    setSelectedCryptoIcon(crypto.icon);
    setModalVisible(false);
    if (operationType === "receive") {
      setAddressModalVisible(true);
    } else if (operationType === "send") {
      setAddressModalVisible(false);
      setInputAddress("");
      setInputAddressModalVisible(true);
    }
  };
  const handleNextAfterAddress = () => {
    setInputAddressModalVisible(false);
    setAmountModalVisible(true);
  };

  const handleNextAfterAmount = () => {
    setAmountModalVisible(false);
    setConfirmModalVisible(true);
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
        <View
          style={{
            width: 360,
            height: 170,
            flexDirection: "row",

            gap: 20,
          }}
        >
          <TouchableOpacity
            style={TransactionsScreenStyle.roundButton}
            onPress={handleSendPress}
          >
            <Feather name="send" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Send")}
            </Text>
            <Text style={TransactionsScreenStyle.mainSubButtonText}>
              {t("Send crypto to another wallet")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={TransactionsScreenStyle.roundButton}
            onPress={handleReceivePress}
          >
            <Icon name="vertical-align-bottom" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Receive")}
            </Text>
            <Text style={TransactionsScreenStyle.mainSubButtonText}>
              {t("Receive crypto from another wallet")}
            </Text>
          </TouchableOpacity>
        </View>
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

        {/* 输入地址的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={inputAddressModalVisible}
          onRequestClose={() => setInputAddressModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.inputModelView}>
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
                  {selectedCrypto}
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Enter the recipient's address:")}
              </Text>
              <View style={{ width: "100%" }}>
                <TextInput
                  style={[
                    TransactionsScreenStyle.input,
                    { color: isDarkMode ? "#ffffff" : "#000000" },
                  ]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
                  onChangeText={(text) => setInputAddress(text)}
                  value={inputAddress}
                  autoFocus={true}
                />
              </View>
              <TouchableOpacity
                style={TransactionsScreenStyle.optionButton}
                onPress={handleNextAfterAddress}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Next")}
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

        {/* 输入金额的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={amountModalVisible}
          onRequestClose={() => setAmountModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
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
                  {selectedCrypto}
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Enter the amount to send:")}
              </Text>
              <View style={{ width: "100%" }}>
                <TextInput
                  style={[
                    TransactionsScreenStyle.amountInput,
                    { color: isDarkMode ? "#ffffff" : "#000000" },
                  ]}
                  placeholder={t("Enter Amount")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
                  keyboardType="numeric"
                  onChangeText={(text) => setAmount(text)}
                  value={amount}
                />
              </View>
              <View
                style={{
                  flexDirection: "col",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={handleNextAfterAmount}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Next")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => {
                    setAmountModalVisible(false);
                    setInputAddressModalVisible(true);
                  }}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Back")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* 交易确认的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.confirmModalView}>
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
                  {selectedCrypto}
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.cancelButtonText}>
                {t("Amount:")} {amount} {selectedCrypto}
              </Text>
              <Text style={TransactionsScreenStyle.cancelButtonText}>
                {t("Recipient Address:")} {inputAddress}
              </Text>
              <Text style={TransactionsScreenStyle.cancelButtonText}>
                {t("Transaction Fee:")} {transactionFee} {selectedCrypto}
              </Text>
              <View style={{ marginTop: 20, width: "100%" }}>
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={() => {
                    // 实现确认交易的逻辑
                    console.log("Transaction Confirmed");
                    setConfirmModalVisible(false);
                  }}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Confirm")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => setConfirmModalVisible(false)}
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
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {crypto.icon && (
                          <Image
                            source={crypto.icon}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                          />
                        )}
                        <Text style={TransactionsScreenStyle.optionButtonText}>
                          {crypto.shortName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButtonReceive}
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
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.receiveModalView}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={TransactionsScreenStyle.modalReceiveTitle}>
                  {t("Address for")}
                </Text>
                {selectedCryptoIcon && (
                  <Image
                    source={selectedCryptoIcon}
                    style={{
                      width: 24,
                      height: 24,
                      marginLeft: 5,
                      marginRight: 5,
                    }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalReceiveTitle}>
                  {selectedCrypto}:
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.subtitleText}>
                {t("Assets can only be sent within the same chain.")}
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
              <View
                style={{
                  flexDirection: "col",
                  width: "100%",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity style={TransactionsScreenStyle.optionButton}>
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Verify Address")}
                  </Text>
                </TouchableOpacity>

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
          </BlurView>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default TransactionsScreen;
