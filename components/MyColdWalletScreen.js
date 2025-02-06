// MyColdWalletScreen.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Vibration,
  View,
  Text,
  Modal,
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
import { useNavigation, useRoute } from "@react-navigation/native";
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
import { prefixToShortName } from "../config/chainPrefixes";
import checkAndReqPermission from "../utils/BluetoothPermissions"; //安卓高版本申请蓝牙权限

let PermissionsAndroid;
if (Platform.OS === "android") {
  PermissionsAndroid = require("react-native").PermissionsAndroid;
}

const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function MyColdWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {
    updateCryptoAddress,
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
    setCryptoCards,
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
  const toggleColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const blueToothColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [newPasswordModalVisible, setNewPasswordModalVisible] = useState(false);
  const [isSupportExpanded, setIsSupportExpanded] = useState(false);
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

  useEffect(() => {
    const loadLanguageSetting = async () => {
      const storedLanguageCode = await AsyncStorage.getItem("language");
      if (storedLanguageCode) {
        setSelectedLanguage(storedLanguageCode);
      }
    };

    loadLanguageSetting();
  }, []);

  // 持久化已连接设备
  useEffect(() => {
    const loadVerifiedDevices = async () => {
      try {
        const savedDevices = await AsyncStorage.getItem("verifiedDevices");
        if (savedDevices !== null) {
          setVerifiedDevices(JSON.parse(savedDevices));
        }
      } catch (error) {
        console.log("Failed to load verified devices", error);
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
        console.log("Failed to change password", error);
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
        console.log("Failed to save password", error);
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
        bleManagerRef.current && bleManagerRef.current.destroy();
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
        console.log("Location permission denied");
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
      checkAndReqPermission(() => {
        console.log("Scanning started");
        setIsScanning(true);
        const scanOptions = { allowDuplicates: true };
        const scanFilter = null;

        bleManagerRef.current.startDeviceScan(
          scanFilter,
          scanOptions,
          (error, device) => {
            if (error) {
              console.log("BleManager scanning error:", error);
              if (error.errorCode === BleErrorCode.BluetoothUnsupported) {
                // console.log("Bluetooth LE is unsupported on this device");
                // return;
              }
            } else if (device.name && device.name.includes("LIKKIM")) {
              setDevices((prevDevices) => {
                if (!prevDevices.find((d) => d.id === device.id)) {
                  return [...prevDevices, device];
                }
                return prevDevices;
              });
              // console.log("Scanned device:", device);
            }
          }
        );

        setTimeout(() => {
          console.log("Scanning stopped");
          bleManagerRef.current.stopDeviceScan();
          setIsScanning(false);
        }, 2000);
      });
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

  const reconnectDevice = async (device) => {
    try {
      console.log(`正在尝试重新连接设备: ${device.id}`);
      await device.cancelConnection(); // 首先断开连接
      await device.connect(); // 尝试重新连接
      await device.discoverAllServicesAndCharacteristics(); // 重新发现服务和特性
      console.log("设备重新连接成功");
    } catch (error) {
      console.log("设备重新连接失败:", error);
    }
  };

  function hexStringToUint32Array(hexString) {
    // 将16进制字符串拆分为两个32位无符号整数
    return new Uint32Array([
      parseInt(hexString.slice(0, 8), 16),
      parseInt(hexString.slice(8, 16), 16),
    ]);
  }

  function uint32ArrayToHexString(uint32Array) {
    // 将两个32位无符号整数转换回16进制字符串
    return (
      uint32Array[0].toString(16).toUpperCase().padStart(8, "0") +
      uint32Array[1].toString(16).toUpperCase().padStart(8, "0")
    );
  }

  // 解密算法
  function decrypt(v, k) {
    let v0 = v[0] >>> 0,
      v1 = v[1] >>> 0,
      sum = 0xc6ef3720 >>> 0,
      i;
    const delta = 0x9e3779b9 >>> 0;
    const k0 = k[0] >>> 0,
      k1 = k[1] >>> 0,
      k2 = k[2] >>> 0,
      k3 = k[3] >>> 0;

    for (i = 0; i < 32; i++) {
      v1 -= (((v0 << 4) >>> 0) + k2) ^ (v0 + sum) ^ (((v0 >>> 5) >>> 0) + k3);
      v1 >>>= 0;
      v0 -= (((v1 << 4) >>> 0) + k0) ^ (v1 + sum) ^ (((v1 >>> 5) >>> 0) + k1);
      v0 >>>= 0;
      sum -= delta;
      sum >>>= 0;
    }
    v[0] = v0 >>> 0;
    v[1] = v1 >>> 0;
  }

  let monitorSubscription;

  const monitorVerificationCode = (device, sendDecryptedValue) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("监听设备响应时出错:", error.message);
          return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("接收到的数据字符串:", receivedDataString);

        // ==========================
        // 映射表: 前缀 -> shortName
        // ==========================

        // 检查是否以某个前缀开头
        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );

        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim(); // 提取地址
          const shortName = prefixToShortName[prefix]; // 获取对应的 shortName

          console.log(`收到的 ${shortName} 地址: `, newAddress);

          // 更新对应加密货币的地址
          updateCryptoAddress(shortName, newAddress);
        }

        // 处理包含 "ID:" 的数据
        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);

          decrypt(encryptedData, key);

          const decryptedHex = uint32ArrayToHexString(encryptedData);
          console.log("解密后的字符串:", decryptedHex);

          // 将解密后的值发送给设备
          if (sendDecryptedValue) {
            sendDecryptedValue(decryptedHex);
          }
        }

        // 如果接收到 "VALID"，改变状态并发送 "validation"
        if (receivedDataString === "VALID") {
          try {
            // 立即更新状态为 "VALID"
            setVerificationStatus("VALID");
            console.log("状态更新为: VALID");

            const validationMessage = "validation";
            const bufferValidationMessage = Buffer.from(
              validationMessage,
              "utf-8"
            );
            const base64ValidationMessage =
              bufferValidationMessage.toString("base64");

            await device.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              base64ValidationMessage
            );
            console.log(`已发送字符串 'validation' 给设备`);
          } catch (error) {
            console.log("发送 'validation' 时出错:", error);
          }
        }

        // 提取完整的 PIN 数据（例如 PIN:1234,Y 或 PIN:1234,N）
        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString); // 保存完整的 PIN 数据
          console.log("接收到的完整数据字符串:", receivedDataString);
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
        console.log("停止监听时发生错误:", error);
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  // 设备选择和显示弹窗的处理函数
  // 保存已连接设备的信息
  // 根据的值（VALID 或 INVALID），判断设备真伪
  // 修改 handleDevicePress 方法，增加获取位置和保存信息的逻辑
  const handleDevicePress = async (device) => {
    setVerificationStatus(null);
    setSelectedDevice(device);
    setModalVisible(false);

    try {
      // 异步连接设备和发现服务
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务和特性");

      // 解密后的值发送给设备
      const sendDecryptedValue = async (decryptedValue) => {
        try {
          const message = `ID:${decryptedValue}`;
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");

          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log(`解密后的值已发送: ${message}`);
        } catch (error) {
          console.log("发送解密值时出错:", error);
        }
      };

      // 先启动监听器
      monitorVerificationCode(device, sendDecryptedValue);

      // 确保监听器已完全启动后再发送 'request'
      setTimeout(async () => {
        try {
          const requestString = "request";
          const bufferRequestString = Buffer.from(requestString, "utf-8");
          const base64requestString = bufferRequestString.toString("base64");

          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64requestString
          );
          console.log("字符串 'request' 已发送");
        } catch (error) {
          console.log("发送 'request' 时出错:", error);
        }
      }, 200); // 延迟 200ms 确保监听器启动（根据设备响应调整）

      // 显示 PIN 码弹窗
      setPinModalVisible(true);
    } catch (error) {
      console.log("设备连接或命令发送错误:", error);
    }
  };
  // 匹配验证码
  const handlePinSubmit = async () => {
    setPinModalVisible(false); // 关闭 PIN 输入框
    setVerificationModalVisible(false); // 关闭验证状态框

    // 确保完整保留接收到的数据字符串
    const verificationCodeValue = receivedVerificationCode.trim(); // 接收到的完整字符串
    const pinCodeValue = pinCode.trim(); // 用户输入的 PIN

    console.log(`用户输入的 PIN: ${pinCodeValue}`);
    console.log(`接收到的完整数据: ${verificationCodeValue}`);

    // 使用 ':' 分割，提取 PIN 和标志位部分
    const [prefix, rest] = verificationCodeValue.split(":"); // 分割出前缀和其余部分
    if (prefix !== "PIN" || !rest) {
      console.log("接收到的验证码格式不正确:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    // 使用 ',' 分割，提取 PIN 和标志位
    const [receivedPin, flag] = rest.split(","); // 分割出 PIN 值和标志位
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("接收到的验证码格式不正确:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    console.log(`提取到的 PIN 值: ${receivedPin}`);
    console.log(`提取到的标志位: ${flag}`);

    // 验证用户输入的 PIN 是否匹配
    if (pinCodeValue === receivedPin) {
      console.log("PIN 验证成功");
      setVerificationStatus("success");

      setVerifiedDevices([selectedDevice.id]);

      // 异步存储更新后的 verifiedDevices 数组（只存一个设备ID）
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
      );

      setIsVerificationSuccessful(true);
      console.log("设备验证并存储成功");

      // 如果标志位为 Y，发送字符串 'address'
      if (flag === "Y") {
        console.log("设备返回了 PIN:xxxx,Y，发送字符串 'address' 给嵌入式设备");
        try {
          const message = "address";
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");

          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log("字符串 'address' 已成功发送给设备");
        } catch (error) {
          console.log("发送字符串 'address' 时发生错误:", error);
        }
      } else if (flag === "N") {
        console.log("设备返回了 PIN:xxxx,N，无需发送 'address'");
      }
    } else {
      console.log("PIN 验证失败");
      setVerificationStatus("fail");

      if (monitorSubscription) {
        monitorSubscription.remove();
        console.log("验证码监听已停止");
      }

      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("已断开与设备的连接");
      }
    }
    setVerificationModalVisible(true); // 显示验证结果
    setPinCode(""); // 清空 PIN 输入框
  };

  // 处理断开连接的逻辑
  const handleDisconnectDevice = async (device) => {
    try {
      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.log(`设备 ${device.id} 已经断开连接`);
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
        console.log(`设备 ${device.id} 断开操作被取消`);
      } else {
        console.log("断开设备连接失败:", error);
      }
    }
  };

  const handleFirmwareUpdate = () => {
    console.log("Firmware Update clicked");
    // Add your firmware update logic here
  };

  const buildNumber = appConfig.ios.buildNumber;

  const [isDeleteWalletVisible, setIsDeleteWalletVisible] = useState(false);

  const toggleDeleteWalletVisibility = () => {
    setIsDeleteWalletVisible((prevState) => !prevState);
  };

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
            trackColor={{ false: "#767577", true: toggleColor }}
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
            trackColor={{ false: "#767577", true: toggleColor }}
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
                  trackColor={{ false: "#767577", true: toggleColor }}
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

      {
        title: t("Find My LIKKIM"),
        icon: "location-on",
        onPress: () => {
          Vibration.vibrate();
          navigation.navigate("Find My LIKKIM");
        },
      },
      {
        title: t("Firmware Update"),
        icon: "downloading",
        onPress: () => {
          Vibration.vibrate();
          handleFirmwareUpdate();
        },
      },
    ],
    // 新增 walletManagement 部分
    walletManagement: [
      {
        title: t("Wallet Management"),
        icon: "wallet",
        extraIcon: isDeleteWalletVisible ? "arrow-drop-up" : "arrow-drop-down", // 控制箭头方向
        onPress: toggleDeleteWalletVisibility, // 切换折叠状态
      },
      isDeleteWalletVisible && {
        title: t("Delete Wallet"),
        icon: "delete-outline",
        onPress: () => {
          Vibration.vibrate();
          handleDeleteWallet(); // 调用删除钱包的处理函数
        },
        style: { color: "red" }, // 使用红色强调危险性
      },
    ],

    support: [
      {
        title: t("Help & Support"),
        icon: "help-outline",
        onPress: () => {
          Vibration.vibrate();
          navigation.navigate("Support");
        },
      },

      {
        title: t("Privacy & Data"),
        icon: "gpp-good",
        onPress: () => {
          Vibration.vibrate();
          Linking.openURL("https://likkim.com/privacy-policy");
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
    ],
    info: [
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

  // 处理删除钱包的函数
  const handleDeleteWallet = () => {
    Alert.alert(
      t("Warning"),
      t(
        "Are you sure you want to delete your wallet?\nPlease make sure you have saved your recovery phrase (mnemonic).\n\nOnce deleted, your wallet can be restored by importing it into the LIKKIM device and then linking the device to the app.\nIf you already have a wallet on the LIKKIM device, simply link the device to the app to restore your wallet."
      ),
      [
        {
          text: t("Cancel"),
          style: "cancel",
        },
        {
          text: t("Delete"),
          style: "destructive",
          onPress: () => {
            // 执行删除钱包的操作
            deleteWallet();
          },
        },
      ],
      { cancelable: false }
    );
  };

  // 删除钱包的具体操作
  const deleteWallet = async () => {
    try {
      // 先从存储中获取 cryptoCards 数据
      const cryptoCardsData = await AsyncStorage.getItem("cryptoCards");
      const cryptoCards = JSON.parse(cryptoCardsData);

      // 检查 cryptoCards 是否为空
      if (cryptoCards && cryptoCards.length > 0) {
        // 执行删除钱包的操作
        await AsyncStorage.removeItem("cryptoCards");
        setCryptoCards([]); // 清空应用状态中的钱包数据
        setVerifiedDevices([]);
        // 显示成功信息
        Alert.alert(
          t("Success"),
          t("Your wallet has been deleted successfully.")
        );
        navigation.goBack(); // 返回上一页或跳转到登录界面等
      } else {
        // 如果没有钱包数据，提示用户 这里以后需要国际化
        Alert.alert(t("No Wallet"), t("No wallet available to delete."));
      }
    } catch (error) {
      console.log("删除钱包时出错:", error);
      Alert.alert(
        t("Error"),
        t("An error occurred while deleting your wallet.")
      );
    }
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

          <TouchableOpacity
            style={MyColdWalletScreenStyle.settingsItem}
            onPress={() => setIsDeleteWalletVisible(!isDeleteWalletVisible)} // 切换折叠状态
          >
            <View style={MyColdWalletScreenStyle.listContainer}>
              <Icon
                name="wallet"
                size={24}
                color={iconColor} // 这里的颜色可以根据需要调整
                style={{ marginRight: 8 }}
              />
              <Text style={[MyColdWalletScreenStyle.Text, { flex: 1 }]}>
                {t("Wallet Management")}
              </Text>
              <Icon
                name={
                  isDeleteWalletVisible ? "arrow-drop-up" : "arrow-drop-down"
                }
                size={24}
                color={iconColor}
              />
            </View>
          </TouchableOpacity>

          {/* 如果 isDeleteWalletVisible 为 true，显示删除钱包项 */}
          {isDeleteWalletVisible && (
            <View>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.settingsItem}
                onPress={handleDeleteWallet} // 调用删除钱包的处理函数
              >
                <View style={MyColdWalletScreenStyle.listContainer}>
                  <Icon
                    name="delete-outline" // 这是删除图标
                    size={24}
                    color={iconColor}
                    style={MyColdWalletScreenStyle.Icon}
                  />
                  <Text style={[MyColdWalletScreenStyle.Text, { flex: 1 }]}>
                    {t("Delete Wallet")}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* 支持分类（折叠功能） */}
          <TouchableOpacity
            style={MyColdWalletScreenStyle.settingsItem}
            onPress={() => setIsSupportExpanded(!isSupportExpanded)}
          >
            <View style={MyColdWalletScreenStyle.listContainer}>
              <Icon
                name="support-agent"
                size={24}
                color={iconColor}
                style={{ marginRight: 8 }}
              />
              <Text style={[MyColdWalletScreenStyle.Text, { flex: 1 }]}>
                {t("Support")}
              </Text>
              <Icon
                name={isSupportExpanded ? "arrow-drop-up" : "arrow-drop-down"}
                size={24}
                color={iconColor}
              />
            </View>
          </TouchableOpacity>

          {isSupportExpanded && (
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
          )}

          {/* 信息分类（保持展开状态，无需折叠） */}
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

          {/* 蓝牙配对按钮 */}
          <View style={{ marginTop: 40, alignItems: "center" }}>
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
        iconColor={blueToothColor}
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
        status={verificationStatus} // 传递状态
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
