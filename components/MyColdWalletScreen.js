// MyColdWalletScreen.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Vibration,
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
import LanguageModal from "./modal/LanguageModal";
import CurrencyModal from "./modal/CurrencyModal";
import ChangePasswordModal from "./modal/ChangePasswordModal";
import ConfirmDisconnectModal from "./modal/ConfirmDisconnectModal";
import MyColdWalletSuccessModal from "./modal/MyColdWalletSuccessModal";
import MyColdWalletErrorModal from "./modal/MyColdWalletErrorModal";
import PinModal from "./modal/PinModal";
import BluetoothModal from "./modal/BluetoothModal";
import VerificationModal from "./modal/VerificationModal";
import * as LocalAuthentication from "expo-local-authentication";
import AddressBookModal from "./modal/AddressBookModal";
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
  const {
    currencies,
    currencyUnit,
    setCurrencyUnit,
    setIsVerificationSuccessful,
    verifiedDevices,
    setVerifiedDevices,
    isScreenLockEnabled,
    screenLockPassword,
    toggleScreenLock,
    changeScreenLockPassword,
  } = useContext(CryptoContext);

  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const MyColdWalletScreenStyle = MyColdWalletScreenStyles(isDarkMode);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [enterPasswordModalVisible, setEnterPasswordModalVisible] =
    useState(false);
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
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true);
  const restoreIdentifier = Constants.installationId;
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [newPasswordModalVisible, setNewPasswordModalVisible] = useState(false);
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCurrency, setSearchCurrency] = useState("");
  const [changePasswordModalVisible, setChangePasswordModalVisible] =
    useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(searchLanguage.toLowerCase())
  );
  const [confirmPasswordModalVisible, setConfirmPasswordModalVisible] =
    useState(false);
  const [storedPassword, setStoredPassword] = useState(""); // 存储已设置的密码
  const [passwordError, setPasswordError] = useState(""); // 新增密码错误状态
  const [confirmDisconnectModalVisible, setConfirmDisconnectModalVisible] =
    useState(false);
  const [deviceToDisconnect, setDeviceToDisconnect] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [addressBookModalVisible, setAddressBookModalVisible] = useState(false);
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [addresses, setAddresses] = useState([
    { id: "1", name: "Home", address: "0x1234..." },
    { id: "2", name: "Office", address: "0x5678..." },
  ]);
  const handleAddAddress = () => {
    // 处理添加地址的逻辑，例如导航到添加地址的页面
    console.log("Add Address button clicked");
  };

  const handleAddressSelect = (address) => {
    console.log("Selected Address:", address);

    // 这里可以添加进一步的处理逻辑，例如设置选中的地址为交易地址
  };
  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(() => {
    AsyncStorage.getItem("faceID").then((status) =>
      setIsFaceIDEnabled(status === "open")
    );
  });

  const toggleFaceID = async (value) => {
    if (value) {
      // 启用时进行一次Face ID验证
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("Authenticate to enable Face ID"),
      });

      if (result.success) {
        setIsFaceIDEnabled(value);
        await AsyncStorage.setItem("faceID", value ? "open" : "close");
      } else {
        // 如果验证失败，可以弹出提示或者保持原状态
        Alert.alert(t("Authentication Failed"), t("Unable to enable Face ID."));
      }
    } else {
      // 直接禁用
      setIsFaceIDEnabled(value);
      await AsyncStorage.setItem("faceID", "close");
    }
  };

  // 确保 handleDisconnectPress 仅设置 ConfirmDisconnectModal 的状态
  const handleDisconnectPress = (device) => {
    setModalVisible(false); // 关闭设备选择模态框
    setDeviceToDisconnect(device); // 保存当前要断开的设备
    setConfirmDisconnectModalVisible(true); // 显示确认断开模态框
  };

  // Called when the user confirms the disconnection
  const confirmDisconnect = async () => {
    if (deviceToDisconnect) {
      await handleDisconnectDevice(deviceToDisconnect); // 执行断开操作
      setConfirmDisconnectModalVisible(false); // 关闭确认断开模态框
      setDeviceToDisconnect(null); // 清空当前要断开的设备
    }
  };

  // Called when the user cancels the disconnection
  const cancelDisconnect = () => {
    setConfirmDisconnectModalVisible(false); // 关闭确认断开模态框
    setModalVisible(true); // 重新显示设备选择模态框
  };

  // 关闭设置密码模态框并清空输入
  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setPassword(""); // 清空密码输入框
    setConfirmPassword(""); // 清空确认密码输入框
    setIsPasswordHidden(true); // 重置隐藏密码图标状态
    setIsConfirmPasswordHidden(true); // 重置隐藏密码图标状态
  };
  // 关闭输入密码模态框并清空输入
  const closeEnterPasswordModal = () => {
    setEnterPasswordModalVisible(false);
    setCurrentPassword(""); // 清空当前密码输入框
    setIsCurrentPasswordHidden(true); // 重置隐藏密码图标状态
  };

  // 显示设置密码模态框并清空输入
  const openPasswordModal = () => {
    setPassword(""); // 清空密码输入框
    setConfirmPassword(""); // 清空确认密码输入框
    setIsPasswordHidden(true); // 重置隐藏密码图标状态
    setIsConfirmPasswordHidden(true); // 重置隐藏密码图标状态
    setPasswordModalVisible(true); // 打开模态框
  };
  // 显示输入密码模态框并清空输入
  const openEnterPasswordModal = () => {
    setCurrentPassword(""); // 清空当前密码输入框
    setIsCurrentPasswordHidden(true); // 重置隐藏密码图标状态
    setEnterPasswordModalVisible(true); // 打开模态框
  };
  // 显示更改密码模态框并清空输入
  const openChangePasswordModal = () => {
    setCurrentPassword(""); // 清空当前密码输入框
    setIsCurrentPasswordHidden(true); // 重置隐藏密码图标状态
    setChangePasswordModalVisible(true); // 打开模态框
  };

  // 确保 openNewPasswordModal 被调用时，清空输入框的值
  const openNewPasswordModal = () => {
    setPasswordError("");
    setPassword(""); // 清空密码输入框
    setConfirmPassword(""); // 清空确认密码输入框
    setIsPasswordHidden(true); // 重置隐藏密码图标状态
    setIsConfirmPasswordHidden(true); // 重置隐藏密码图标状态
    setNewPasswordModalVisible(true); // 打开模态框
  };
  // 持久化已连接设备
  useEffect(() => {
    const loadVerifiedDevices = async () => {
      try {
        const savedDevices = await AsyncStorage.getItem("verifiedDevices");
        if (savedDevices !== null) {
          setVerifiedDevices(JSON.parse(savedDevices));
        }
      } catch (error) {
        console.error("Failed to load verified devices", error);
      }
    };

    loadVerifiedDevices();
  }, []);

  // 停止监听
  useEffect(() => {
    if (!pinModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [pinModalVisible]);

  const handleScreenLockToggle = async (value) => {
    if (value) {
      openPasswordModal(); // 启用锁屏时打开设置密码的模态框
    } else {
      openEnterPasswordModal(); // 禁用锁屏时打开输入密码的模态框
    }
  };

  const handleChangePassword = async () => {
    if (password === confirmPassword) {
      try {
        await changeScreenLockPassword(password);
        setNewPasswordModalVisible(false); // 关闭设置新密码的模态框
        setModalMessage(t("Password changed successfully"));
        setSuccessModalVisible(true); // 显示成功的 Modal
      } catch (error) {
        console.error("Failed to change password", error);
      }
    } else {
      // 设置错误信息，显示在原有的 Modal 中
      setPasswordError(t("Passwords do not match"));
    }
  };

  const handleNextForChangePassword = (currentPassword) => {
    if (currentPassword === screenLockPassword) {
      setIsCurrentPasswordValid(true);
      setChangePasswordModalVisible(false); // 关闭当前模态框
      openNewPasswordModal(); // 打开设置新密码的模态框并清空输入
      setCurrentPassword(""); // 清空当前密码的输入框
    } else {
      // 关闭其他可能正在显示的模态框
      setChangePasswordModalVisible(false);
      setModalMessage(t("Incorrect current password"));
      setSuccessModalVisible(false);
      setErrorModalVisible(true);
    }
  };
  // 设置密码模态框的提交处理函数
  const handleSetPassword = async () => {
    if (password.length < 4) {
      setPasswordError(t("Password must be at least 4 characters long"));
      return;
    }

    if (password === confirmPassword) {
      try {
        await changeScreenLockPassword(password);
        toggleScreenLock(true); // 启用屏幕锁定
        setPasswordModalVisible(false);
        setPasswordError(""); // 清除错误信息
        setModalMessage(t("Screen lock enabled successfully"));
        setSuccessModalVisible(true);
      } catch (error) {
        console.error("Failed to save password", error);
      }
    } else {
      setPasswordError(t("Passwords do not match"));
    }
  };

  // 输入密码模态框的提交处理函数
  const handleConfirmPassword = async () => {
    if (currentPassword === screenLockPassword) {
      toggleScreenLock(false); // 禁用屏幕锁定
      setEnterPasswordModalVisible(false);
      setModalMessage(t("Screen lock disabled successfully"));
      setSuccessModalVisible(true);
    } else {
      setEnterPasswordModalVisible(false); // 关闭其他模态框
      setModalMessage(t("Incorrect password"));
      setErrorModalVisible(true);
      // 确保 success 模态框不与 error 模态框同时显示
      setSuccessModalVisible(false);
    }
  };

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      currency.shortName.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  const bleManagerRef = useRef(null);

  useEffect(() => {
    if (Platform.OS !== "web") {
      bleManagerRef.current = new BleManager({
        restoreStateIdentifier: restoreIdentifier,
      });

      const subscription = bleManagerRef.current.onStateChange((state) => {
        if (state === "PoweredOn") {
          // 添加短暂延迟以确保蓝牙模块完全准备好
          setTimeout(() => {
            scanDevices();
          }, 2000); // 1秒延迟
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
              //   console.error("Bluetooth LE is unsupported on this device");
              //    return;
            }
          } else if (device.name && device.name.includes("LIKKIM")) {
            setDevices((prevDevices) => {
              if (!prevDevices.find((d) => d.id === device.id)) {
                return [...prevDevices, device];
              }
              return prevDevices;
            });
            //   console.log("Scanned device:", device);
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

  const reconnectDevice = async (device) => {
    try {
      console.log(`正在尝试重新连接设备: ${device.id}`);
      await device.cancelConnection(); // 首先断开连接
      await device.connect(); // 尝试重新连接
      await device.discoverAllServicesAndCharacteristics(); // 重新发现服务和特性
      console.log("设备重新连接成功");
    } catch (error) {
      console.error("设备重新连接失败:", error);
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
          if (error.message.includes("Operation was cancelled")) {
            console.error("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连
          } else if (error.message.includes("Unknown error occurred")) {
            console.error("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.error("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连
          } else {
            console.error("监听设备响应时出错:", error.message);
          }
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

  const handleCancel = () => {
    setModalVisible(false);
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
      // 显示 PIN 模态框
      setPinModalVisible(true);
    } catch (error) {
      console.error("设备连接或命令发送错误:", error);
    }
  };

  const handlePinSubmit = async () => {
    setPinModalVisible(false);
    setVerificationModalVisible(false);

    const pinCodeValue = parseInt(pinCode, 10);
    const verificationCodeValue = parseInt(
      receivedVerificationCode.replace(" ", ""),
      16
    );

    if (pinCodeValue === verificationCodeValue) {
      setVerificationStatus("success");

      // 更新设备验证状态
      const newVerifiedDevices = [selectedDevice.id];
      setVerifiedDevices(newVerifiedDevices);
      console.log("验证成功！验证状态已更新。");
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(newVerifiedDevices)
      );
      setIsVerificationSuccessful(true);

      // 发送成功命令 F4 03 10 00 04 95 97 0D 0A
      const successCommand = new Uint8Array([
        0xf4, 0x03, 0x10, 0x00, 0x04, 0x95, 0x97, 0x0d, 0x0a,
      ]);
      const base64SuccessCommand = base64.fromByteArray(successCommand);

      try {
        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64SuccessCommand
        );
        console.log("Success command has been sent");
      } catch (error) {
        console.error("Failed to send success command", error);
      }
    } else {
      console.log("PIN 验证失败");
      setVerificationStatus("fail");
      stopMonitoringVerificationCode();
      await selectedDevice.cancelConnection();
    }

    setVerificationModalVisible(true);
    setPinCode("");
  };

  // 处理断开连接的逻辑
  const handleDisconnectDevice = async (device) => {
    try {
      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.warn(`设备 ${device.id} 已经断开连接`);
      } else {
        await device.cancelConnection(); // 断开设备连接
        console.log(`设备 ${device.id} 已断开连接`);
      }

      // 更新已验证设备列表
      const updatedVerifiedDevices = verifiedDevices.filter(
        (id) => id !== device.id
      );
      setVerifiedDevices(updatedVerifiedDevices);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(updatedVerifiedDevices)
      );
      console.log(`设备 ${device.id} 已从已验证设备中移除`);
      stopMonitoringVerificationCode();
      // 更新全局状态，表示设备已不再验证成功
      setIsVerificationSuccessful(false);
      console.log("验证状态已更新为 false。");
    } catch (error) {
      if (
        error instanceof BleError &&
        error.errorCode === BleErrorCode.OperationCancelled
      ) {
        console.warn(`设备 ${device.id} 断开操作被取消`);
      } else {
        console.error("断开设备连接失败:", error);
      }
    }
  };

  const handleFirmwareUpdate = () => {
    console.log("Firmware Update clicked");
    // Add your firmware update logic here
  };

  const buildNumber = appConfig.ios.buildNumber;

  const settingsOptions = {
    settings: [
      {
        title: t("Default Currency"),
        icon: "attach-money",
        onPress: () => {
          Vibration.vibrate();
          setCurrencyModalVisible(true);
        },
        extraIcon: "arrow-drop-down",
        selectedOption: selectedCurrency,
      },
      {
        title: t("Language"),
        icon: "language",
        onPress: () => {
          Vibration.vibrate();
          setLanguageModalVisible(true);
        },
        extraIcon: "arrow-drop-down",
        selectedOption: (
          languages.find((lang) => lang.code === selectedLanguage) ||
          languages.find((lang) => lang.code === "en")
        ).name,
      },
      {
        title: t("Dark Mode"),
        icon: "dark-mode",
        onPress: () => {
          Vibration.vibrate();
          handleDarkModeChange(!isDarkMode);
        },
        toggle: (
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              Vibration.vibrate();
              handleDarkModeChange(!isDarkMode);
            }}
            value={isDarkMode}
          />
        ),
      },
      {
        title: t("Address Book"),
        icon: "portrait",
        onPress: () => {
          Vibration.vibrate();
          setAddressBookModalVisible(true);
        },
      },
      {
        title: t("Enable Screen Lock"),
        icon: "lock-outline",
        onPress: () => {
          Vibration.vibrate();
          handleScreenLockToggle(!isScreenLockEnabled);
        },
        toggle: (
          <Switch
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isScreenLockEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => {
              Vibration.vibrate();
              handleScreenLockToggle(!isScreenLockEnabled);
            }}
            value={isScreenLockEnabled}
          />
        ),
      },
      ...(isScreenLockEnabled
        ? [
            {
              title: t("Change App Screen Lock Password"),
              icon: "password",
              onPress: () => {
                Vibration.vibrate();
                openChangePasswordModal();
              },
            },
            {
              title: t("Enable Face ID"),
              icon: "face",
              onPress: () => {
                Vibration.vibrate();
                toggleFaceID(!isFaceIDEnabled);
              },
              toggle: (
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={isFaceIDEnabled ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={async () => {
                    Vibration.vibrate();
                    await toggleFaceID(!isFaceIDEnabled);
                  }}
                  value={isFaceIDEnabled}
                />
              ),
            },
          ]
        : []),
    ],
    support: [
      {
        title: t("Firmware Update"),
        icon: "downloading",
        onPress: () => {
          Vibration.vibrate();
          handleFirmwareUpdate();
        },
      },
      {
        title: t("Help & Support"),
        icon: "help-outline",
        onPress: () => {
          Vibration.vibrate();
          Linking.openURL("https://www.likkim.com");
        },
      },
    ],
    info: [
      {
        title: t("Privacy & Data"),
        icon: "gpp-good",
        onPress: () => {
          Vibration.vibrate();
          Linking.openURL("https://www.likkim.com");
        },
      },
      {
        title: t("About"),
        icon: "info-outline",
        onPress: () => {
          Vibration.vibrate();
          Linking.openURL("https://www.likkim.com");
        },
      },
      {
        title: t("Version"),
        icon: "update",
        version: appConfig.ios.buildNumber,
        onPress: () => {
          Vibration.vibrate();
        },
      },
    ],
  };

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
          {/* 设置分类 */}
          {/*     <Text style={MyColdWalletScreenStyle.categoryTitle}>
            {t("Settings")}
          </Text> */}
          <View>
            {settingsOptions.settings.map((option) => (
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
                </View>
                {option.toggle}
              </TouchableOpacity>
            ))}
          </View>
          {/* 支持分类 */}
          {/*      <Text style={MyColdWalletScreenStyle.categoryTitle}>
            {t("Support")}
          </Text> */}
          <View>
            {settingsOptions.support.map((option) => (
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
                </View>
              </TouchableOpacity>
            ))}
          </View>
          {/* 信息分类 */}
          {/*      <Text style={MyColdWalletScreenStyle.categoryTitle}>{t("Info")}</Text> */}

          <View>
            {settingsOptions.info.map((option) => (
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
              </TouchableOpacity>
            ))}
          </View>

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
          </View>
        </View>
      </ScrollView>
      {/* Language Modal */}
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        languages={languages}
        searchLanguage={searchLanguage}
        setSearchLanguage={setSearchLanguage}
        handleLanguageChange={handleLanguageChange}
        styles={MyColdWalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* Currency Modal */}
      <CurrencyModal
        visible={currencyModalVisible}
        onClose={() => setCurrencyModalVisible(false)}
        currencies={currencies}
        searchCurrency={searchCurrency}
        setSearchCurrency={setSearchCurrency}
        handleCurrencyChange={handleCurrencyChange}
        styles={MyColdWalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* enable screen lock modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={passwordModalVisible}
        onRequestClose={closePasswordModal}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.enableLockModalView}>
            <Text style={MyColdWalletScreenStyle.passwordModalTitle}>
              {t("Enable Screen Lock")}
            </Text>

            <View style={MyColdWalletScreenStyle.passwordInputContainer}>
              <TextInput
                style={MyColdWalletScreenStyle.passwordInput}
                placeholder={t("Enter new password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isPasswordHidden}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError(""); // 清除错误信息
                }}
                value={password}
                autoFocus={true}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                style={MyColdWalletScreenStyle.eyeIcon}
              >
                <Icon
                  name={isPasswordHidden ? "visibility-off" : "visibility"}
                  size={24}
                  color={isDarkMode ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>

            <View style={MyColdWalletScreenStyle.passwordInputContainer}>
              <TextInput
                style={MyColdWalletScreenStyle.passwordInput}
                placeholder={t("Confirm new password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isConfirmPasswordHidden}
                onChangeText={setConfirmPassword}
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
                    isConfirmPasswordHidden ? "visibility-off" : "visibility"
                  }
                  size={24}
                  color={isDarkMode ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>
            {/* 错误提示，确保与输入框左对齐 */}
            {passwordError ? (
              <Text
                style={[MyColdWalletScreenStyle.errorText, { marginLeft: 10 }]}
              >
                {passwordError}
              </Text>
            ) : null}
            <View style={MyColdWalletScreenStyle.buttonContainer}>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.submitButton}
                onPress={handleSetPassword}
              >
                <Text style={MyColdWalletScreenStyle.submitButtonText}>
                  {t("Submit")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.cancelButton}
                onPress={closePasswordModal} // 使用关闭函数
              >
                <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Disable Lock Screen modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={enterPasswordModalVisible}
        onRequestClose={closeEnterPasswordModal} // 使用关闭函数
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.disableLockModalView}>
            <Text style={MyColdWalletScreenStyle.passwordModalTitle}>
              {t("Disable Lock Screen")}
            </Text>
            <View style={{ marginVertical: 10, width: "100%" }}>
              <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                <TextInput
                  style={MyColdWalletScreenStyle.passwordInput}
                  placeholder={t("Enter your password")}
                  placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                  secureTextEntry={isCurrentPasswordHidden}
                  onChangeText={setCurrentPassword}
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
                      isCurrentPasswordHidden ? "visibility-off" : "visibility"
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
                onPress={handleConfirmPassword}
              >
                <Text style={MyColdWalletScreenStyle.submitButtonText}>
                  {t("Submit")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.cancelButton}
                onPress={closeEnterPasswordModal} // 使用关闭函数
              >
                <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
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
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
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
                    isPasswordFocused && MyColdWalletScreenStyle.focusedInput,
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
                      isCurrentPasswordHidden ? "visibility-off" : "visibility"
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

      <ChangePasswordModal
        visible={changePasswordModalVisible}
        onClose={() => setChangePasswordModalVisible(false)}
        onSubmit={handleNextForChangePassword}
        styles={MyColdWalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />
      {/* New Password Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={newPasswordModalVisible}
        onRequestClose={() => setNewPasswordModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.setPasswordModalView}>
            <Text style={MyColdWalletScreenStyle.passwordModalTitle}>
              {t("Set New Password")}
            </Text>

            <View style={{ marginVertical: 10, width: "100%" }}>
              <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                <TextInput
                  style={[
                    MyColdWalletScreenStyle.passwordInput,
                    MyColdWalletScreenStyle.focusedInput,
                  ]}
                  placeholder={t("Enter new password")}
                  placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                  secureTextEntry={isPasswordHidden}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError(""); // 清除错误信息
                  }}
                  value={password}
                  autoFocus={true}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                  style={MyColdWalletScreenStyle.eyeIcon}
                >
                  <Icon
                    name={isPasswordHidden ? "visibility-off" : "visibility"}
                    size={24}
                    color={isDarkMode ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ marginVertical: 10, width: "100%" }}>
              <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                <TextInput
                  style={[
                    MyColdWalletScreenStyle.passwordInput,
                    MyColdWalletScreenStyle.focusedInput,
                  ]}
                  placeholder={t("Confirm new password")}
                  placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                  secureTextEntry={isConfirmPasswordHidden}
                  onChangeText={(text) => {
                    setConfirmPassword(text);
                    setPasswordError(""); // 清除错误信息
                  }}
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
                      isConfirmPasswordHidden ? "visibility-off" : "visibility"
                    }
                    size={24}
                    color={isDarkMode ? "#ccc" : "#666"}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* 显示错误信息 */}
            {passwordError ? (
              <Text
                style={[MyColdWalletScreenStyle.errorText, { marginLeft: 10 }]}
              >
                {passwordError}
              </Text>
            ) : null}

            <View style={MyColdWalletScreenStyle.buttonContainer}>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.submitButton}
                onPress={handleChangePassword} // 保存新密码
              >
                <Text style={MyColdWalletScreenStyle.submitButtonText}>
                  {t("Submit")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.cancelButton}
                onPress={() => setNewPasswordModalVisible(false)}
              >
                <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>

      {/* Bluetooth modal */}
      <BluetoothModal
        visible={modalVisible}
        devices={devices}
        isScanning={isScanning}
        iconColor={iconColor}
        onDevicePress={handleDevicePress}
        onCancel={handleCancel}
        verifiedDevices={verifiedDevices}
        MyColdWalletScreenStyle={MyColdWalletScreenStyle}
        t={t}
        onDisconnectPress={handleDisconnectPress}
      />

      {/* PIN码输入modal窗口 */}
      <PinModal
        visible={pinModalVisible} // 控制 PIN 模态框的可见性
        pinCode={pinCode} // 绑定 PIN 输入的状态
        setPinCode={setPinCode} // 设置 PIN 的状态函数
        onSubmit={handlePinSubmit} // PIN 提交后的逻辑
        onCancel={() => setPinModalVisible(false)} // 关闭 PIN 模态框
        styles={MyColdWalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* 验证码模态框 */}
      <VerificationModal
        visible={verificationModalVisible && verificationStatus !== null}
        status={verificationStatus}
        onClose={() => setVerificationModalVisible(false)}
        styles={MyColdWalletScreenStyle}
        t={t}
      />
      {/* 二次确认模态框   Confirm Disconnect Modal */}
      <ConfirmDisconnectModal
        visible={confirmDisconnectModalVisible} // 仅控制这个模态框的可见性
        onConfirm={confirmDisconnect} // 确认断开连接后的逻辑
        onCancel={cancelDisconnect} // 取消断开连接后的逻辑
        styles={MyColdWalletScreenStyle}
        t={t}
      />

      {/* 成功模态框 */}
      <MyColdWalletSuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message={modalMessage}
        styles={MyColdWalletScreenStyle}
        t={t}
      />
      {/* 失败模态框 */}
      <MyColdWalletErrorModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        message={modalMessage}
        styles={MyColdWalletScreenStyle}
        t={t}
      />

      {/* Address Book Modal */}
      <AddressBookModal
        visible={addressBookModalVisible}
        onClose={() => setAddressBookModalVisible(false)}
        addresses={addresses}
        onSelect={handleAddressSelect}
        styles={MyColdWalletScreenStyle}
        isDarkMode={isDarkMode}
        onAddAddress={handleAddAddress} // 传递添加地址的回调函数
      />
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
