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
import styles, { lightTheme, darkTheme } from "../styles";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { CryptoContext, DarkModeContext } from "./CryptoContext";

function TransactionsScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { addedCryptos } = useContext(CryptoContext);
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
      style={styles.container}
    >
      <View className="w-[100%]">
        <TouchableOpacity style={styles.roundButton} onPress={handleSendPress}>
          <Text style={styles.buttonText}>{t("Send")}</Text>
          <Text style={styles.subButtonText}>
            {t("Send crypto to another wallet")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton}
          onPress={handleReceivePress}
        >
          <Text style={styles.buttonText}>{t("Receive")}</Text>
          <Text style={styles.subButtonText}>
            {t("Receive crypto from another wallet")}
          </Text>
        </TouchableOpacity>
        <View style={styles.historyContainer}>
          <Text style={styles.historyTitle}>{t("Transaction History")}</Text>
          {transactionHistory.length === 0 ? (
            <Text style={styles.noHistoryText}>{t("No Histories")}</Text>
          ) : (
            transactionHistory.map((transaction, index) => (
              <View key={index} style={styles.historyItem}>
                <Text style={styles.historyItemText}>{transaction.detail}</Text>
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
          <BlurView intensity={10} style={styles.centeredView}>
            <View
              style={{
                margin: 20,
                height: 450,
                display: "flex",
                backgroundColor: "#484692",
                borderRadius: 20,
                padding: 35,
                width: "80%",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
              }}
            >
              <Text style={styles.modalTitle}>
                {t("Enter the recipient's address:")}
              </Text>

              <View
                style={{
                  width: "100%",
                }}
              >
                <TextInput
                  style={[styles.input, { color: "#ffffff" }]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor="#ffffff"
                  onChangeText={(text) => setInputAddress(text)}
                  value={inputAddress}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: "#6C6CF4",
                    padding: 10,
                    marginBottom: 10,
                    justifyContent: "center",
                    borderRadius: 30,
                    height: 60,
                    alignItems: "center",
                  }}
                  onPress={() => {
                    console.log(`Sending ${selectedCrypto} to ${inputAddress}`);
                    setInputAddressModalVisible(false);
                    // Implement the logic to send crypto to the input address
                  }}
                >
                  <Text style={styles.submitButtonText}>{t("Submit")}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    backgroundColor: "#6C6CF4",
                    padding: 10,

                    justifyContent: "center",
                    borderRadius: 30,
                    height: 60,
                    alignItems: "center",
                  }}
                  onPress={() => setInputAddressModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
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
          <BlurView intensity={10} style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text
                style={{
                  color: "#ffffff", // 白色文字
                  textAlign: "center", // 文本居中对齐
                  marginBottom: 20, // 与下一个元素间距
                }}
              >
                {operationType === "send"
                  ? t("Choose the cryptocurrency to send:")
                  : t("Choose the cryptocurrency to receive:")}
              </Text>
              {addedCryptos.length === 0 ? ( // 使用 addedCryptos 而不是 additionalCryptos
                <Text style={{ color: "#ffffff", textAlign: "center" }}>
                  {t("No cryptocurrencies available. Please add some first.")}
                </Text>
              ) : (
                <ScrollView
                  contentContainerStyle={{ alignItems: "center" }}
                  style={{ maxHeight: 400, width: 280 }} // 限制弹窗的最大高度
                >
                  {addedCryptos.map((crypto) => (
                    <TouchableOpacity
                      key={crypto.shortName}
                      style={styles.optionButton}
                      onPress={() => selectCrypto(crypto)}
                    >
                      <Text style={styles.optionButtonText}>
                        {crypto.shortName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={{
                  backgroundColor: "#6C6CF4",
                  padding: 10,
                  width: "80%",
                  justifyContent: "center",
                  borderRadius: 30,
                  height: 60,
                  alignItems: "center",
                  marginTop: 20, // 与上一个元素间距
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
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
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>
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
                style={styles.cancelButton}
                onPress={() => setAddressModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>{t("Close")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default TransactionsScreen;
