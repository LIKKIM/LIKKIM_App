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
  } = useContext(CryptoContext); // 从 CryptoContext 中获取 setIsVerificationSuccessful 和 verifiedDevices
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

  // Called when the user clicks the "Disconnect" button
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

  // 确保在唤起 New Password Modal 时调用 openNewPasswordModal
  const handleNextForChangePassword = () => {
    if (currentPassword === screenLockPassword) {
      setIsCurrentPasswordValid(true);
      setChangePasswordModalVisible(false); // 关闭当前模态框
      openNewPasswordModal(); // 打开设置新密码的模态框并清空输入
      setCurrentPassword(""); // 清空当前密码的输入框
    } else {
      Alert.alert(t("Error"), t("Incorrect current password"));
    }
  };
  const handleChangePassword = async () => {
    if (password === confirmPassword) {
      try {
        await changeScreenLockPassword(password);
        setNewPasswordModalVisible(false); // 关闭设置新密码的模态框
        Alert.alert(t("Success"), t("Password changed successfully"));
      } catch (error) {
        console.error("Failed to change password", error);
      }
    } else {
      Alert.alert(t("Error"), t("Passwords do not match"));
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
        Alert.alert(t("Success"), t("Screen lock enabled successfully"));
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
      Alert.alert(t("Success"), t("Screen lock disabled successfully"));
    } else {
      Alert.alert(t("Error"), t("Incorrect password"));
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
    setPinModalVisible(false);
    setVerificationSuccessModalVisible(false);
    setVerificationFailModalVisible(false);

    const pinCodeValue = parseInt(pinCode, 10);
    const verificationCodeValue = parseInt(
      receivedVerificationCode.replace(" ", ""),
      16
    );

    if (pinCodeValue === verificationCodeValue) {
      setVerificationSuccessModalVisible(true);

      // 清空已验证设备的状态并持久化
      const newVerifiedDevices = [selectedDevice.id]; // 只存储当前设备的ID
      setVerifiedDevices(newVerifiedDevices);
      console.log("验证成功！验证状态已更新。");
      // 将更新后的 verifiedDevices 存储到 AsyncStorage
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(newVerifiedDevices)
      );

      // 更新全局状态为成功
      setIsVerificationSuccessful(true);
      console.log("验证成功！验证状态已更新。");
    } else {
      console.log("PIN 验证失败");
      stopMonitoringVerificationCode();
      await selectedDevice.cancelConnection();
      setVerificationFailModalVisible(true);
    }

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

  const settingsOptions = [
    {
      title: t("Enable Screen Lock"),
      icon: "lock-outline",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        handleScreenLockToggle(!isScreenLockEnabled);
      },
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isScreenLockEnabled ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            Vibration.vibrate(); // 添加震动反馈
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
              Vibration.vibrate(); // 添加震动反馈
              openChangePasswordModal();
            },
          },
        ]
      : []),
    {
      title: t("Default Currency"),
      icon: "attach-money",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        setCurrencyModalVisible(true);
      },
      extraIcon: "arrow-drop-down",
      selectedOption: selectedCurrency,
    },
    {
      title: t("Language"),
      icon: "language",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
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
        Vibration.vibrate(); // 添加震动反馈
        handleDarkModeChange(!isDarkMode);
      },
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            Vibration.vibrate(); // 添加震动反馈
            handleDarkModeChange(!isDarkMode);
          }}
          value={isDarkMode}
        />
      ),
    },
    /*     {
      title: t("Sync balances to LIKKIM coldwallet"),
      icon: "sync",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        handleSyncBalances();
      },
    }, */
    {
      title: t("Firmware Update"),
      icon: "downloading",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        handleFirmwareUpdate();
      },
    },
    {
      title: t("Help & Support"),
      icon: "help-outline",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: t("Privacy & Data"),
      icon: "gpp-good",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: t("About"),
      icon: "info-outline",
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: t("Version"),
      icon: "update",
      version: buildNumber, // 使用导入的 buildNumber
      onPress: () => {
        Vibration.vibrate(); // 添加震动反馈
      },
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

          {/* enable screen lock modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={passwordModalVisible}
            onRequestClose={closePasswordModal}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
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
                        isConfirmPasswordHidden
                          ? "visibility-off"
                          : "visibility"
                      }
                      size={24}
                      color={isDarkMode ? "#ccc" : "#666"}
                    />
                  </TouchableOpacity>
                </View>
                {/* 错误提示，确保与输入框左对齐 */}
                {passwordError ? (
                  <Text
                    style={[
                      MyColdWalletScreenStyle.errorText,
                      { marginLeft: 10 },
                    ]}
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
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
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
            visible={changePasswordModalVisible}
            onRequestClose={() => setChangePasswordModalVisible(false)}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
              <View style={MyColdWalletScreenStyle.changePasswordModalView}>
                <Text style={MyColdWalletScreenStyle.passwordModalTitle}>
                  {t("Change Password")}
                </Text>
                <View style={{ marginVertical: 10, width: "100%" }}>
                  <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                    <TextInput
                      style={[
                        MyColdWalletScreenStyle.passwordInput,
                        MyColdWalletScreenStyle.focusedInput,
                      ]}
                      placeholder={t("Enter current password")}
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
                    onPress={handleNextForChangePassword} // 验证并进入新密码设置页面
                  >
                    <Text style={MyColdWalletScreenStyle.submitButtonText}>
                      {t("Next")}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={MyColdWalletScreenStyle.cancelButton}
                    onPress={() => setChangePasswordModalVisible(false)}
                  >
                    <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                      {t("Cancel")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </Modal>

          {/* New Password Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={newPasswordModalVisible}
            onRequestClose={() => setNewPasswordModalVisible(false)}
          >
            <BlurView
              intensity={10}
              style={MyColdWalletScreenStyle.centeredView}
            >
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
                      onChangeText={setPassword}
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
                  <View style={MyColdWalletScreenStyle.passwordInputContainer}>
                    <TextInput
                      style={[
                        MyColdWalletScreenStyle.passwordInput,
                        MyColdWalletScreenStyle.focusedInput,
                      ]}
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
      {/* Bluetooth modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.bluetoothModalView}>
            <Text style={MyColdWalletScreenStyle.bluetoothModalTitle}>
              {t("LOOKING FOR DEVICES")}
            </Text>
            {isScanning ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/gif/Bluetooth.gif")}
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
                  renderItem={({ item }) => {
                    const isVerified = verifiedDevices.includes(item.id);

                    return (
                      <TouchableOpacity
                        onPress={() => {
                          if (!isVerified) {
                            handleDevicePress(item); // 传递完整的设备对象
                          }
                        }}
                      >
                        <View
                          style={MyColdWalletScreenStyle.deviceItemContainer}
                        >
                          <Icon
                            name={isVerified ? "mobile-friendly" : "smartphone"}
                            size={24}
                            color={isVerified ? "#3CDA84" : iconColor}
                            style={MyColdWalletScreenStyle.deviceIcon}
                          />
                          <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                            {item.name || item.id}
                          </Text>
                          {isVerified && (
                            <TouchableOpacity
                              style={MyColdWalletScreenStyle.disconnectButton}
                              onPress={() => handleDisconnectPress(item)} // 使用新方法触发确认
                            >
                              <Text
                                style={
                                  MyColdWalletScreenStyle.disconnectButtonText
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
              <View>
                <Image
                  source={require("../assets/gif/Search.gif")}
                  style={{ width: 180, height: 180, margin: 30 }}
                />
                <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                  {t(
                    "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                  )}
                </Text>
              </View>
            )}
            <TouchableOpacity
              style={MyColdWalletScreenStyle.cancelButtonLookingFor}
              onPress={() => {
                setModalVisible(false);
                setSelectedDevice(null);
              }}
            >
              <Text style={MyColdWalletScreenStyle.cancelButtonText}>
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
              autoFocus={true}
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
              source={require("../assets/gif/Success.gif")}
              style={{ width: 120, height: 120, marginTop: 20 }}
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
              source={require("../assets/gif/Fail.gif")}
              style={{ width: 120, height: 120, marginTop: 20 }}
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
      {/* 二次确认模态框 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmDisconnectModalVisible}
        onRequestClose={() => setConfirmDisconnectModalVisible(false)}
      >
        <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
          <View style={MyColdWalletScreenStyle.disconnectModalView}>
            <Text style={MyColdWalletScreenStyle.modalTitle}>
              {t("Confirm Disconnect")}
            </Text>
            <Text
              style={[
                MyColdWalletScreenStyle.disconnectSubtitle,
                {
                  height: 80,
                  textAlignVertical: "center",
                },
              ]}
            >
              {t("Are you sure you want to disconnect this device?")}
            </Text>
            <View style={MyColdWalletScreenStyle.buttonContainer}>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.submitButton}
                onPress={confirmDisconnect} // 执行断开操作
              >
                <Text style={MyColdWalletScreenStyle.submitButtonText}>
                  {t("Confirm")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.cancelButton}
                onPress={cancelDisconnect} // 返回设备选择模态框
              >
                <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                  {t("Back")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
