// MyColdWalletScreen.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
  TextInput,
  Linking,
  Alert,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import MyColdWalletScreenStyles from "../styles/MyColdWalletScreenStyle";
import { languages } from "../config/languages";
import base64 from "base64-js";
import { Buffer } from "buffer";
import appConfig from "../app.config";

let PermissionsAndroid;
if (Platform.OS === "android") {
  PermissionsAndroid = require("react-native").PermissionsAndroid;
}

const serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB";
const writeCharacteristicUUID = "0000FFE2-0000-1000-8000-00805F9B34FB";

function MyColdWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { currencies, currencyUnit, setCurrencyUnit } =
    useContext(CryptoContext);
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const MyColdWalletScreenStyle = MyColdWalletScreenStyles(isDarkMode);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [enterPasswordModalVisible, setEnterPasswordModalVisible] =
    useState(false); // 新增状态
  const [selectedCurrency, setSelectedCurrency] = useState(currencyUnit);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pinCode, setPinCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState(""); // 当前密码状态
  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true); // 控制当前密码的显示或隐藏
  const restoreIdentifier = Constants.installationId;
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const verifyCode = (userInputCode, deviceCode) => {
    if (userInputCode === deviceCode) {
      // 验证成功
      setVerificationSuccessModalVisible(true);
    } else {
      // 验证失败
      setVerificationFailModalVisible(true);
    }
  };

  const bleManagerRef = useRef(null);

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

  const handleBluetoothPairing = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t("Location Permission"),
          message: t("We need access to your location to use Bluetooth."),
          buttonNeutral: t("Ask Me Later"),
          buttonNegative: t("Cancel"),
          buttonPositive: t("OK"),
        }
      );

      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.warn("Location permission denied");
        return;
      }
    }

    setModalVisible(true);
    scanDevices();
  };

  const handleCurrencyChange = async (currency) => {
    console.log("Selected currency:", currency);
    setSelectedCurrency(currency.shortName);
    setCurrencyUnit(currency.shortName);
    await AsyncStorage.setItem("currencyUnit", currency.shortName);
    setCurrencyModalVisible(false);
  };

  const handleLanguageChange = async (language) => {
    console.log("Selected language:", language.name);
    setSelectedLanguage(language.code);
    i18n.changeLanguage(language.code);
    await AsyncStorage.setItem("language", language.code);
    setLanguageModalVisible(false);
  };

  const handleDarkModeChange = async (value) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem("darkMode", JSON.stringify(value));
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("My Cold Wallet"),
    });
  }, [t, navigation]);

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      console.log("Scanning started");
      setIsScanning(true);
      const scanOptions = { allowDuplicates: true };
      const scanFilter = null;

      bleManagerRef.current.startDeviceScan(
        scanFilter,
        scanOptions,
        (error, device) => {
          if (error) {
            console.error("BleManager scanning error:", error);
            if (error.errorCode === BleErrorCode.BluetoothUnsupported) {
              console.error("Bluetooth LE is unsupported on this device");
              setIsScanning(false);
              return;
            }
          } else if (device.name && device.name.includes("LIKKIM")) {
            setDevices((prevDevices) => {
              if (!prevDevices.find((d) => d.id === device.id)) {
                return [...prevDevices, device];
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

  useEffect(() => {
    if (!modalVisible && selectedDevice) {
      setPinModalVisible(true);
    }
  }, [modalVisible, selectedDevice]);

  // 发送启动嵌入式验证码生成命令的函数
  const sendStartCommand = async (device) => {
    const command = new Uint8Array([0xf1, 0x01, 0x02, 0x0d, 0x0a]);
    const base64Command = base64.fromByteArray(command);

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 命令数据的Base64编码
      );
      console.log("启动验证命令已发送");
    } catch (error) {
      console.error("发送启动命令失败", error);
    }
  };

  // 设备选择和显示弹窗的处理函数
  const handleDevicePress = async (device) => {
    setSelectedDevice(device);
    setModalVisible(false);

    // 连接设备并发送启动命令（可以根据需要加入连接逻辑）
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务和特性");

      // 发送启动命令
      await sendStartCommand(device);
    } catch (error) {
      console.error("设备连接或命令发送错误:", error);
    }
  };

  const handlePinSubmit = async (device, pinCode) => {
    try {
      await connectToDevice(device, pinCode);
      console.log(`PIN code sent successfully to device ${device.id}`);
    } catch (error) {
      console.error(`Failed to connect and send PIN: ${error.message}`);
    } finally {
      setPinModalVisible(false);
      setPinCode("");
    }
  };

  const connectToDevice = async (device, pinCode) => {
    // 开发版本使用生产版本要避免安全隐患
    const serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB";
    const writeCharacteristicUUID = "0000FFE2-0000-1000-8000-00805F9B34FB";
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    try {
      await device.connect();
      console.log(`Connected to device: ${device.id}`);
      await device.discoverAllServicesAndCharacteristics();
      console.log(
        `Discovered services and characteristics for device: ${device.id}`
      );

      // 订阅通知特征
      await device.monitorCharacteristicForService(
        serviceUUID,
        notifyCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.error("Error subscribing to notifications:", error.message);
            return;
          }
          // 处理接收到的通知数据
          const receivedData = Buffer.from(characteristic.value, "base64");
          const decodedData = receivedData.toString("utf-8");
          console.log("Notification received:", decodedData);
          Alert.alert("Notification", `Received data: ${decodedData}`);
        }
      );

      // 写入PIN码到特征
      const pinCodeBytes = stringToBytes(pinCode);
      const base64PinCode = base64.fromByteArray(pinCodeBytes);
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64PinCode
      );
      console.log(`PIN code sent: ${pinCode}`);
    } catch (error) {
      throw new Error(`Failed to connect to device: ${error.message}`);
    }
  };

  // 辅助函数：将字符串转换为字节数组
  const stringToBytes = (str) => {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i));
    }
    return bytes;
  };

  // New handlers for the buttons
  const handleSyncBalances = () => {
    console.log("Sync balances to LIKKIM coldwallet clicked");
    // Add your sync logic here
  };

  const handleFirmwareUpdate = () => {
    console.log("Firmware Update clicked");
    // Add your firmware update logic here
  };

  const buildNumber = appConfig.ios.buildNumber;

  const settingsOptions = [
    {
      title: t("Change Password"),
      icon: "lock-outline",
      onPress: () => setEnterPasswordModalVisible(true), // 改变为显示 Enter Password 模态框
    },
    {
      title: t("Default Currency"),
      icon: "attach-money",
      onPress: () => setCurrencyModalVisible(true),
      extraIcon: "arrow-drop-down",
      selectedOption: selectedCurrency,
    },
    {
      title: t("Language"),
      icon: "language",
      onPress: () => setLanguageModalVisible(true),
      extraIcon: "arrow-drop-down",
      selectedOption: (
        languages.find((lang) => lang.code === selectedLanguage) ||
        languages.find((lang) => lang.code === "en")
      ).name,
    },
    {
      title: t("Dark Mode"),
      icon: "dark-mode",
      onPress: () => handleDarkModeChange(!isDarkMode),
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => handleDarkModeChange(!isDarkMode)}
          value={isDarkMode}
        />
      ),
    },
    {
      title: t("Sync balances to LIKKIM coldwallet"),
      icon: "sync",
      onPress: handleSyncBalances,
    },
    {
      title: t("Firmware Update"),
      icon: "downloading",
      onPress: handleFirmwareUpdate,
    },
    {
      title: t("Help & Support"),
      icon: "help-outline",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: t("Privacy & Data"),
      icon: "gpp-good",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },

    {
      title: t("About"),
      icon: "info-outline",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: t("Version"),
      icon: "update",
      version: buildNumber, // 使用导入的 buildNumber

      onPress: () => {},
    },
  ];

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isConfirmPasswordHidden, setIsConfirmPasswordHidden] = useState(true);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={MyColdWalletScreenStyle.container}
    >
      <ScrollView
        style={MyColdWalletScreenStyle.scrollView}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <View style={MyColdWalletScreenStyle.contentContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.title}
              style={MyColdWalletScreenStyle.settingsItem}
              onPress={option.onPress}
            >
              <View style={MyColdWalletScreenStyle.listContainer}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={iconColor}
                  style={MyColdWalletScreenStyle.Icon}
                />
                <Text style={[MyColdWalletScreenStyle.Text, { flex: 1 }]}>
                  {option.title}
                </Text>
                {option.selectedOption && (
                  <Text
                    style={[
                      MyColdWalletScreenStyle.buttonText,
                      { marginRight: 8 },
                    ]}
                  >
                    {option.selectedOption}
                  </Text>
                )}
                {option.extraIcon && (
                  <Icon name={option.extraIcon} size={24} color={iconColor} />
                )}
                {option.version && (
                  <Text
                    style={[
                      MyColdWalletScreenStyle.buttonText,
                      { marginRight: 8 },
                    ]}
                  >
                    {option.version}
                  </Text>
                )}
              </View>
              {option.toggle}
            </TouchableOpacity>
          ))}

          {/* Language Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={languageModalVisible}
            onRequestClose={() => setLanguageModalVisible(false)}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
              <View style={MyColdWalletScreenStyle.modalView}>
                <Text style={MyColdWalletScreenStyle.languageModalTitle}>
                  {t("Select Language")}
                </Text>
                <ScrollView style={MyColdWalletScreenStyle.languageList}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      onPress={() => handleLanguageChange(language)}
                    >
                      <Text style={MyColdWalletScreenStyle.languageModalText}>
                        {language.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={MyColdWalletScreenStyle.languageCancelButton}
                  onPress={() => setLanguageModalVisible(false)}
                >
                  <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Modal>

          {/* Currency Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={currencyModalVisible}
            onRequestClose={() => setCurrencyModalVisible(false)}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
              <View style={MyColdWalletScreenStyle.modalView}>
                <Text style={MyColdWalletScreenStyle.languageModalTitle}>
                  {t("Select Currency")}
                </Text>
                <ScrollView style={MyColdWalletScreenStyle.languageList}>
                  {currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.shortName}
                      style={MyColdWalletScreenStyle.currencyOption}
                      onPress={() => handleCurrencyChange(currency)}
                    >
                      <Text style={MyColdWalletScreenStyle.languageModalText}>
                        {currency.name} - {currency.shortName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={MyColdWalletScreenStyle.languageCancelButton}
                  onPress={() => setCurrencyModalVisible(false)}
                >
                  <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Modal>

          {/* Enter Password Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={enterPasswordModalVisible}
            onRequestClose={() => setEnterPasswordModalVisible(false)}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
              <View style={MyColdWalletScreenStyle.EnterPasswordModalView}>
                <Text style={MyColdWalletScreenStyle.passwordModalTitle}>
                  {t("Enter Password")}
                </Text>
                <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                  {t("Enter current password before resetting it")}
                </Text>
                <View style={{ marginVertical: 10, width: "100%" }}>
                  <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                    <TextInput
                      style={[
                        MyColdWalletScreenStyle.passwordInput,
                        isPasswordFocused &&
                          MyColdWalletScreenStyle.focusedInput,
                      ]}
                      placeholder={t("Enter current password")}
                      placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                      secureTextEntry={isCurrentPasswordHidden}
                      onChangeText={setCurrentPassword}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      value={currentPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setIsCurrentPasswordHidden(!isCurrentPasswordHidden)
                      }
                      style={MyColdWalletScreenStyle.eyeIcon}
                    >
                      <Icon
                        name={
                          isCurrentPasswordHidden
                            ? "visibility-off"
                            : "visibility"
                        }
                        size={24}
                        color={isDarkMode ? "#ccc" : "#666"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={MyColdWalletScreenStyle.buttonContainer}>
                  <TouchableOpacity
                    style={MyColdWalletScreenStyle.submitButton}
                    onPress={() => {
                      setEnterPasswordModalVisible(false);
                      setPasswordModalVisible(true);
                    }}
                  >
                    <Text style={MyColdWalletScreenStyle.submitButtonText}>
                      {t("Continue")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={MyColdWalletScreenStyle.cancelButton}
                    onPress={() => setEnterPasswordModalVisible(false)}
                  >
                    <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                      {t("Cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>

          {/* Change Password Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={passwordModalVisible}
            onRequestClose={() => setPasswordModalVisible(false)}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
              <View style={MyColdWalletScreenStyle.modalView}>
                <Text style={MyColdWalletScreenStyle.passwordModalTitle}>
                  {t("Set Password")}
                </Text>
                <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                  {t("Only you can unlock your wallet")}
                </Text>
                <View style={{ marginVertical: 10, width: "100%" }}>
                  <Text style={MyColdWalletScreenStyle.passwordModalText}>
                    {t("Password")}
                  </Text>
                  <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                    <TextInput
                      style={[
                        MyColdWalletScreenStyle.passwordInput,
                        isPasswordFocused &&
                          MyColdWalletScreenStyle.focusedInput,
                      ]}
                      placeholder={t("Enter new password")}
                      placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                      secureTextEntry={isPasswordHidden}
                      onChangeText={setPassword}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                      value={password}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                      style={MyColdWalletScreenStyle.eyeIcon}
                    >
                      <Icon
                        name={
                          isPasswordHidden ? "visibility-off" : "visibility"
                        }
                        size={24}
                        color={isDarkMode ? "#ccc" : "#666"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginVertical: 10, width: "100%" }}>
                  <Text style={MyColdWalletScreenStyle.passwordModalText}>
                    {t("Confirm Password")}
                  </Text>
                  <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                    <TextInput
                      style={[
                        MyColdWalletScreenStyle.passwordInput,
                        isConfirmPasswordFocused &&
                          MyColdWalletScreenStyle.focusedInput,
                      ]}
                      placeholder={t("Confirm new password")}
                      placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                      secureTextEntry={isConfirmPasswordHidden}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setIsConfirmPasswordFocused(true)}
                      onBlur={() => setIsConfirmPasswordFocused(false)}
                      value={confirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
                      }
                      style={MyColdWalletScreenStyle.eyeIcon}
                    >
                      <Icon
                        name={
                          isConfirmPasswordHidden
                            ? "visibility-off"
                            : "visibility"
                        }
                        size={24}
                        color={isDarkMode ? "#ccc" : "#666"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={MyColdWalletScreenStyle.buttonContainer}>
                  <TouchableOpacity
                    style={MyColdWalletScreenStyle.submitButton}
                    onPress={() => setPasswordModalVisible(false)}
                  >
                    <Text style={MyColdWalletScreenStyle.submitButtonText}>
                      {t("Submit")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={MyColdWalletScreenStyle.cancelButton}
                    onPress={() => setPasswordModalVisible(false)}
                  >
                    <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                      {t("Cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>

          {/* Bluetooth Btn modal*/}
          <View style={{ marginTop: 40 }}>
            {/* <Text style={MyColdWalletScreenStyle.languageModalTitle}>
              {t("Bluetooth")}
            </Text> */}
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.roundButton}
                onPress={handleBluetoothPairing}
              >
                <Text style={MyColdWalletScreenStyle.BluetoothBtnText}>
                  {t("Pair with Bluetooth")}
                </Text>
              </TouchableOpacity>
            </View>
            {/* Bluetooth modal */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <BlurView
                intensity={10}
                style={MyColdWalletScreenStyle.centeredView}
              >
                <View style={MyColdWalletScreenStyle.bluetoothModalView}>
                  <Text style={MyColdWalletScreenStyle.bluetoothModalTitle}>
                    {t("LOOKING FOR DEVICES")}
                  </Text>
                  {isScanning ? (
                    <View style={{ alignItems: "center" }}>
                      <Image
                        source={require("../assets/Bluetooth.gif")}
                        style={MyColdWalletScreenStyle.bluetoothImg}
                      />
                      <Text style={MyColdWalletScreenStyle.scanModalSubtitle}>
                        {t("Scanning...")}
                      </Text>
                    </View>
                  ) : (
                    devices.length > 0 && (
                      <FlatList
                        data={devices}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleDevicePress(item)}
                          >
                            <View
                              style={
                                MyColdWalletScreenStyle.deviceItemContainer
                              }
                            >
                              <Icon
                                name="smartphone"
                                size={24}
                                color={iconColor}
                                style={MyColdWalletScreenStyle.deviceIcon}
                              />
                              <Text
                                style={MyColdWalletScreenStyle.modalSubtitle}
                              >
                                {item.name || item.id}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      />
                    )
                  )}
                  {!isScanning && devices.length === 0 && (
                    <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                      {t(
                        "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                      )}
                    </Text>
                  )}
                  <TouchableOpacity
                    style={MyColdWalletScreenStyle.cancelButtonLookingFor}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                      {t("Cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Modal>
          </View>
        </View>
      </ScrollView>

      {/* PIN码输入modal窗口 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={pinModalVisible}
        onRequestClose={() => setPinModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.pinModalView}>
            <View style={{ alignItems: "center" }}>
              <Text style={MyColdWalletScreenStyle.pinModalTitle}>
                {t("Enter PIN to Connect")}
              </Text>
              <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                {t(
                  "Use the PIN code to establish a secure connection with your LIKKIM hardware."
                )}
              </Text>
            </View>
            <TextInput
              style={MyColdWalletScreenStyle.passwordInput}
              placeholder={t("Enter PIN")}
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              keyboardType="numeric"
              secureTextEntry
              onChangeText={setPinCode}
              value={pinCode}
            />
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.submitButton}
                onPress={() => handlePinSubmit(selectedDevice, pinCode)}
              >
                <Text style={MyColdWalletScreenStyle.submitButtonText}>
                  {t("Submit")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.cancelButton}
                onPress={() => setPinModalVisible(false)}
              >
                <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
      {/* PIN码匹配modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={verificationSuccessModalVisible}
        onRequestClose={() => setVerificationSuccessModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.pinModalView}>
            <Text style={MyColdWalletScreenStyle.modalTitle}>
              {t("Verification successful!")}
            </Text>
            <Text style={MyColdWalletScreenStyle.modalSubtitle}>
              {t("You can now safely use the device.")}
            </Text>
            <TouchableOpacity
              style={MyColdWalletScreenStyle.submitButton}
              onPress={() => setVerificationSuccessModalVisible(false)}
            >
              <Text style={MyColdWalletScreenStyle.submitButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={verificationFailModalVisible}
        onRequestClose={() => setVerificationFailModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.pinModalView}>
            <Text style={MyColdWalletScreenStyle.modalTitle}>
              {t("Verification failed!")}
            </Text>
            <Text style={MyColdWalletScreenStyle.modalSubtitle}>
              {t("Please try to connect again.")}
            </Text>
            <TouchableOpacity
              style={MyColdWalletScreenStyle.submitButton}
              onPress={() => setVerificationFailModalVisible(false)}
            >
              <Text style={MyColdWalletScreenStyle.submitButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
