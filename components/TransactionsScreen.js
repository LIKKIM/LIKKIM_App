// TransactionsScreen.js
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Clipboard,
  Platform,
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
import successImage from "../assets/success.png";
import failImage from "../assets/fail.png";
import Constants from "expo-constants";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
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
  const [selectedDevice, setSelectedDevice] = useState(null);
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const restoreIdentifier = Constants.installationId;
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [inputAddressModalVisible, setInputAddressModalVisible] =
    useState(false);
  const [detectedNetwork, setDetectedNetwork] = useState("");
  const bleManagerRef = useRef(null);
  const [paymentAddress, setPaymentAddress] = useState("Your Payment Address");

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      console.log("Scanning started");
      setIsScanning(true);

      bleManagerRef.current.startDeviceScan(
        null,
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            console.error("BleManager scanning error:", error);
            setIsScanning(false);
            return;
          }

          if (device.name && device.name.includes("LIKKIM")) {
            setDevices((prevDevices) => {
              if (!prevDevices.find((d) => d.id === device.id)) {
                return [...prevDevices, device]; // 这里 device 是完整的设备对象
              }
              return prevDevices;
            });
            console.log("Scanned device:", device);
          }
        }
      );

      setTimeout(() => {
        console.log("Scanning stopped");
        bleManagerRef.current.stopDeviceScan();
        setIsScanning(false);
      }, 2000);
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };

  const [bleVisible, setBleVisible] = useState(false); // New state for Bluetooth modal

  useEffect(() => {
    if (!bleVisible && selectedDevice) {
      setPinModalVisible(true);
    }
  }, [bleVisible, selectedDevice]);
  // Update Bluetooth modal visibility management
  useEffect(() => {
    if (Platform.OS !== "web") {
      bleManagerRef.current = new BleManager({
        restoreStateIdentifier: restoreIdentifier,
      });

      const subscription = bleManagerRef.current.onStateChange((state) => {
        if (state === "PoweredOn") {
          scanDevices();
        }
      }, true);

      return () => {
        subscription.remove();
        bleManagerRef.current.destroy();
      };
    }
  }, []);

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

  const detectNetwork = (address) => {
    if (/^(1|3|bc1)/.test(address)) {
      return "Bitcoin (BTC)";
    } else if (/^0x/.test(address)) {
      return "Ethereum (ETH) / Binance Smart Chain (BSC) / Chainlink (LINK) / VeChain (VET) / Arbitrum (ARB) / Polygon (MATIC)";
    } else if (/^T/.test(address)) {
      return "Tron (TRX)";
    } else if (/^r/.test(address)) {
      return "Ripple (XRP)";
    } else if (/^(A|D)/.test(address)) {
      return "Cardano (ADA)";
    } else if (/^(1|3|k)/.test(address)) {
      return "Polkadot (DOT)";
    } else if (/^(L|M|ltc1)/.test(address)) {
      return "Litecoin (LTC)";
    } else if (/^G/.test(address)) {
      return "Stellar (XLM)";
    } else if (/^(q|p|bitcoincash:)/.test(address)) {
      return "Bitcoin Cash (BCH)";
    } else if (/^(D|A)/.test(address)) {
      return "Dogecoin (DOGE)";
    } else if (/^tz[1-3]/.test(address)) {
      return "Tezos (XTZ)";
    } else if (/^[a-zA-Z0-9]{12}$/.test(address)) {
      return "EOS (EOS)";
    } else if (/^(4|8)/.test(address)) {
      return "Monero (XMR)";
    } else if (/^X/.test(address)) {
      return "Dash (DASH)";
    } else if (/^(t1|t3|zs)/.test(address)) {
      return "Zcash (ZEC)";
    } else if (/^A/.test(address)) {
      return "NEO (NEO)";
    } else if (address.length === 90) {
      return "IOTA (MIOTA)";
    } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return "Solana (SOL)";
    } else {
      return "Unknown Network";
    }
  };

  const handleAddressChange = (text) => {
    setInputAddress(text);
    const network = detectNetwork(text);
    setDetectedNetwork(network);
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
              <View style={{ width: "100%", marginBottom: 10 }}>
                <TextInput
                  style={[
                    TransactionsScreenStyle.input,
                    { color: isDarkMode ? "#ffffff" : "#000000" },
                  ]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
                  onChangeText={handleAddressChange}
                  value={inputAddress}
                  autoFocus={true}
                />
                <Text
                  style={{
                    color: isDarkMode ? "#ccc" : "#666",
                    marginTop: 5,
                    minHeight: 20,
                  }}
                >
                  {inputAddress ? `Detected Network: ${detectedNetwork}` : ""}
                </Text>
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
                  autoFocus={true}
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
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
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
                  {t("Crypto:")} {selectedCrypto}
                </Text>
              </View>
              <View
                style={{
                  width: 280,
                  height: 220, // 将高度增加以容纳新字段
                  justifyContent: "space-between",
                }}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>{t("Amount")}:</Text>
                  {` ${amount} ${selectedCrypto}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Payment Address")}:
                  </Text>
                  {` ${paymentAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Recipient Address")}:
                  </Text>
                  {` ${inputAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Detected Network")}:
                  </Text>
                  {` ${detectedNetwork}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Transaction Fee")}:
                  </Text>
                  {` ${transactionFee} ${selectedCrypto}`}
                </Text>
              </View>

              <View style={{ marginTop: 20, width: "100%" }}>
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={() => {
                    // 实现确认交易的逻辑
                    console.log("Transaction Confirmed");
                    setConfirmModalVisible(false);
                  }}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
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
                  <Text style={TransactionsScreenStyle.submitButtonText}>
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

        {/* Bluetooth modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={bleVisible} // Use bleVisible to control this modal
          onRequestClose={() => {
            setBleVisible(!bleVisible); // Toggle visibility
          }}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.bluetoothModalView}>
              <Text style={TransactionsScreenStyle.bluetoothModalTitle}>
                {t("LOOKING FOR DEVICES")}
              </Text>
              {isScanning ? (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={require("../assets/Bluetooth.gif")}
                    style={TransactionsScreenStyle.bluetoothImg}
                  />
                  <Text style={TransactionsScreenStyle.scanModalSubtitle}>
                    {t("Scanning...")}
                  </Text>
                </View>
              ) : (
                devices.length > 0 && (
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      const isVerified = verifiedDevices.includes(item.id);

                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (!isVerified) {
                              handleDevicePress(item); // 确保这里传递的是完整的设备对象
                            }
                          }}
                        >
                          <View
                            style={TransactionsScreenStyle.deviceItemContainer}
                          >
                            <Icon
                              name={
                                isVerified ? "phonelink-ring" : "smartphone"
                              }
                              size={24}
                              color={isVerified ? "#3CDA84" : iconColor}
                              style={TransactionsScreenStyle.deviceIcon}
                            />
                            <Text
                              style={TransactionsScreenStyle.scanModalSubtitle}
                            >
                              {item.name || item.id}
                            </Text>
                            {isVerified && (
                              <TouchableOpacity
                                style={TransactionsScreenStyle.disconnectButton}
                                onPress={() => handleDisconnectDevice(item)}
                              >
                                <Text
                                  style={
                                    TransactionsScreenStyle.disconnectButtonText
                                  }
                                >
                                  {t("Disconnect")}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                )
              )}
              {!isScanning && devices.length === 0 && (
                <Text style={TransactionsScreenStyle.modalSubtitle}>
                  {t(
                    "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                  )}
                </Text>
              )}
              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButtonLookingFor}
                onPress={() => {
                  setBleVisible(false); // Close Bluetooth modal
                  setSelectedDevice(null); // Reset selected device state
                }}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* PIN码输入modal窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={pinModalVisible}
          onRequestClose={() => setPinModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pinModalView}>
              <View style={{ alignItems: "center" }}>
                <Text style={TransactionsScreenStyle.pinModalTitle}>
                  {t("Enter PIN to Connect")}
                </Text>
                <Text style={TransactionsScreenStyle.modalSubtitle}>
                  {t(
                    "Use the PIN code to establish a secure connection with your LIKKIM hardware."
                  )}
                </Text>
              </View>
              <TextInput
                style={TransactionsScreenStyle.passwordInput}
                placeholder={t("Enter PIN")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                keyboardType="numeric"
                secureTextEntry
                onChangeText={setPinCode}
                value={pinCode}
              />
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  style={TransactionsScreenStyle.submitButton}
                  onPress={() => handlePinSubmit(selectedDevice, pinCode)}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Submit")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => setPinModalVisible(false)}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* 成功验证模态框 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={verificationSuccessModalVisible}
          onRequestClose={() => setVerificationSuccessModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pinModalView}>
              <Image
                source={successImage}
                style={{ width: 60, height: 60, marginTop: 20 }}
              />
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Verification successful!")}
              </Text>
              <Text style={TransactionsScreenStyle.modalSubtitle}>
                {t("You can now safely use the device.")}
              </Text>
              <TouchableOpacity
                style={TransactionsScreenStyle.submitButton}
                onPress={() => setVerificationSuccessModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* 失败验证模态框 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={verificationFailModalVisible}
          onRequestClose={() => setVerificationFailModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pinModalView}>
              <Image
                source={failImage}
                style={{ width: 60, height: 60, marginTop: 20 }}
              />
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Verification failed!")}
              </Text>
              <Text style={TransactionsScreenStyle.modalSubtitle}>
                {t(
                  "The verification code you entered is incorrect. Please try again."
                )}
              </Text>
              <TouchableOpacity
                style={TransactionsScreenStyle.submitButton}
                onPress={() => setVerificationFailModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default TransactionsScreen;
