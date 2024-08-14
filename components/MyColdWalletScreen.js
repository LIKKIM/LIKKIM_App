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
import successImage from "../assets/success.png";
import failImage from "../assets/fail.png";

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
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCurrency, setSearchCurrency] = useState("");

  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(searchLanguage.toLowerCase())
  );

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      currency.shortName.toLowerCase().includes(searchCurrency.toLowerCase())
  );

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

  function crc16Modbus(arr) {
    let crc = 0xffff; // 初始值为0xFFFF
    for (let byte of arr) {
      crc ^= byte; // 按位异或
      for (let i = 0; i < 8; i++) {
        // 处理每一个字节的8位
        if (crc & 0x0001) {
          crc = (crc >> 1) ^ 0xa001; // 多项式为0xA001
        } else {
          crc = crc >> 1;
        }
      }
    }
    return crc & 0xffff; // 确保CRC值是16位
  }

  const sendStartCommand = async (device) => {
    // 命令数据，未包含CRC校验码
    const commandData = new Uint8Array([0xf1, 0x01, 0x02]);

    // 使用CRC-16-Modbus算法计算CRC校验码
    const crc = crc16Modbus(commandData);

    // 将CRC校验码转换为高位在前，低位在后的格式
    const crcHighByte = (crc >> 8) & 0xff;
    const crcLowByte = crc & 0xff;

    // 将原始命令数据、CRC校验码以及结束符组合成最终的命令
    const finalCommand = new Uint8Array([
      ...commandData,
      crcLowByte,
      crcHighByte,
      0x0d, // 结束符
      0x0a, // 结束符
    ]);

    // 将最终的命令转换为Base64编码
    const base64Command = base64.fromByteArray(finalCommand);

    // 打印最终的命令数据（十六进制表示）
    console.log(
      `Final command: ${Array.from(finalCommand)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(" ")}`
    );

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 最终的命令数据的Base64编码
      );
      console.log("启动验证命令已发送");
    } catch (error) {
      console.error("发送启动命令失败", error);
    }
  };

  let monitorSubscription;

  const monitorVerificationCode = (device) => {
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error("监听验证码时出错:", error.message);
          return;
        }

        // Base64解码接收到的数据
        const receivedData = Buffer.from(characteristic.value, "base64");

        // 将接收到的数据解析为16进制字符串
        const receivedDataHex = receivedData.toString("hex");
        console.log("接收到的16进制数据字符串:", receivedDataHex);

        // 示例：检查接收到的数据的前缀是否正确（例如，预期为 "a1"）
        if (receivedDataHex.startsWith("a1")) {
          // 提取接收到的验证码（根据你的协议调整具体的截取方式）
          const verificationCode = receivedDataHex.substring(2, 6); // 获取从第2个字符开始的4个字符（例如 "a1 04 D2" 中的 "04D2"）
          console.log("接收到的验证码:", verificationCode);

          // 将验证码存储到状态中，或进行进一步的处理
          setReceivedVerificationCode(verificationCode);
        } else {
          console.warn("接收到的不是预期的验证码数据");
        }
      }
    );
  };

  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription) {
      try {
        monitorSubscription.remove();
        monitorSubscription = null;
        console.log("验证码监听已停止");
      } catch (error) {
        console.error("停止监听时发生错误:", error);
      }
    }
  };

  // 设备选择和显示弹窗的处理函数
  const handleDevicePress = async (device) => {
    setSelectedDevice(device);
    setModalVisible(false);

    try {
      // 连接设备
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务和特性");

      // 发送第一条命令 F0 01 02
      const connectionCommandData = new Uint8Array([0xf0, 0x01, 0x02]);
      const connectionCrc = crc16Modbus(connectionCommandData);
      const connectionCrcHighByte = (connectionCrc >> 8) & 0xff;
      const connectionCrcLowByte = connectionCrc & 0xff;
      const finalConnectionCommand = new Uint8Array([
        ...connectionCommandData,
        connectionCrcLowByte,
        connectionCrcHighByte,
        0x0d,
        0x0a,
      ]);
      const base64ConnectionCommand = base64.fromByteArray(
        finalConnectionCommand
      );

      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64ConnectionCommand
      );
      console.log("第一条蓝牙连接命令已发送: F0 01 02");

      // 延迟5毫秒
      await new Promise((resolve) => setTimeout(resolve, 5));

      // 发送第二条命令 F1 01 02
      await sendStartCommand(device);

      // 开始监听嵌入式设备的返回信息
      monitorVerificationCode(device);
    } catch (error) {
      console.error("设备连接或命令发送错误:", error);
    }
  };

  const handlePinSubmit = async () => {
    // 首先关闭 "Enter PIN to Connect" 的模态框
    setPinModalVisible(false);

    // 关闭所有其他可能打开的模态框
    setVerificationSuccessModalVisible(false);
    setVerificationFailModalVisible(false);

    // 将用户输入的 PIN 转换为数字
    const pinCodeValue = parseInt(pinCode, 10); // 将 "1234" 转换为数字 1234

    // 将接收到的验证码转换为数字
    const verificationCodeValue = parseInt(
      receivedVerificationCode.replace(" ", ""),
      16
    );

    console.log(`用户输入的 PIN 数值: ${pinCodeValue}`);
    console.log(`接收到的验证码数值: ${verificationCodeValue}`);

    if (pinCodeValue === verificationCodeValue) {
      console.log("PIN 验证成功");
      setVerificationSuccessModalVisible(true); // 显示成功提示
    } else {
      console.log("PIN 验证失败");

      // 停止监听验证码
      if (monitorSubscription) {
        try {
          monitorSubscription.remove();
          console.log("验证码监听已停止");
        } catch (error) {
          console.error("停止监听时发生错误:", error);
        }
      }

      // 主动断开与嵌入式设备的连接
      if (selectedDevice) {
        try {
          await selectedDevice.cancelConnection();
          console.log("已断开与设备的连接");
        } catch (error) {
          console.error("断开连接时发生错误:", error);
        }
      }

      setVerificationFailModalVisible(true); // 显示失败提示
    }

    // 清空 PIN 输入框
    setPinCode("");
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
              <View style={MyColdWalletScreenStyle.languageModalView}>
                <Text style={MyColdWalletScreenStyle.languageModalTitle}>
                  {t("Select Language")}
                </Text>

                {/* Search Box */}
                <View style={MyColdWalletScreenStyle.searchContainer}>
                  <Icon
                    name="search"
                    size={20}
                    style={MyColdWalletScreenStyle.searchIcon}
                  />
                  <TextInput
                    style={MyColdWalletScreenStyle.searchInput}
                    placeholder={t("Search Language")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                    onChangeText={(text) => setSearchLanguage(text)}
                    value={searchLanguage}
                  />
                </View>

                <ScrollView style={MyColdWalletScreenStyle.languageList}>
                  {filteredLanguages.map((language) => (
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
              <View style={MyColdWalletScreenStyle.currencyModalView}>
                <Text style={MyColdWalletScreenStyle.languageModalTitle}>
                  {t("Select Currency")}
                </Text>

                {/* Search Box */}
                <View style={MyColdWalletScreenStyle.searchContainer}>
                  <Icon
                    name="search"
                    size={20}
                    style={MyColdWalletScreenStyle.searchIcon}
                  />
                  <TextInput
                    style={MyColdWalletScreenStyle.searchInput}
                    placeholder={t("Search Currency")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                    onChangeText={(text) => setSearchCurrency(text)}
                    value={searchCurrency}
                  />
                </View>

                <ScrollView style={MyColdWalletScreenStyle.languageList}>
                  {filteredCurrencies.map((currency) => (
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
                      autoFocus={true}
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
              <View style={MyColdWalletScreenStyle.setPasswordModalView}>
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
                      autoFocus={true}
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
                    onPress={() => {
                      setModalVisible(false);
                      setSelectedDevice(null); // 重置 selectedDevice 状态
                    }}
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

      {/* 成功验证模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={verificationSuccessModalVisible}
        onRequestClose={() => setVerificationSuccessModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.pinModalView}>
            <Image
              source={successImage}
              style={{ width: 60, height: 60, marginTop: 20 }}
            />
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

      {/* 失败验证模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={verificationFailModalVisible}
        onRequestClose={() => setVerificationFailModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.pinModalView}>
            <Image
              source={failImage}
              style={{ width: 60, height: 60, marginTop: 20 }}
            />
            <Text style={MyColdWalletScreenStyle.modalTitle}>
              {t("Verification failed!")}
            </Text>
            <Text style={MyColdWalletScreenStyle.modalSubtitle}>
              {t(
                "The verification code you entered is incorrect. Please try again."
              )}
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
