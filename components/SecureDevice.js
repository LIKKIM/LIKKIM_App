// SecureDevice.js
/**
 * 本文件中定义的主要函数及其功能说明（自动生成）：
 *
 * SecureDeviceScreen：主组件，负责安全设备页面的所有业务逻辑和UI渲染。
 * handleAddAddress：处理添加地址按钮点击事件（目前仅打印日志）。
 * handleAddressSelect：处理地址选择事件（目前仅打印日志）。
 * toggleFaceID：切换FaceID功能，进行本地认证并保存状态。
 * handleDisconnectPress：处理断开设备按钮点击，弹出确认断开模态框。
 * confirmDisconnect：确认断开设备，调用断开逻辑并刷新设备列表。
 * cancelDisconnect：取消断开设备操作，关闭确认断开模态框。
 * closeEnterLockCodeModal：关闭输入锁屏密码模态框并重置相关状态。
 * openLockCodeModal：打开设置锁屏密码模态框并重置相关状态。
 * openEnterLockCodeModal：打开输入锁屏密码模态框并重置相关状态。
 * openChangeLockCodeModal：打开修改锁屏密码模态框并重置相关状态。
 * openNewLockCodeModal：打开新密码设置模态框并重置相关状态。
 * handleScreenLockToggle：切换屏幕锁功能，弹出相应模态框。
 * handleChangePassword：处理新密码设置，校验并保存新密码。
 * handleNextForChangePassword：校验当前密码，进入新密码设置流程。
 * handleSetPassword：设置锁屏密码，校验并保存到本地和上下文。
 * closeLockCodeModal：关闭设置锁屏密码模态框并重置相关状态。
 * handleConfirmPassword：校验输入的锁屏密码，决定是否关闭屏幕锁。
 * handleBluetoothPairing：处理蓝牙配对，申请权限并扫描设备。
 * handleCurrencyChange：切换法币单位，保存到本地并更新上下文。
 * handleLanguageChange：切换语言，保存到本地并更新i18n。
 * handleDarkModeChange：切换深色模式，保存到本地并调用回调。
 * stopMonitoringVerificationCode：停止监听设备验证码。
 * handleCancel：关闭蓝牙设备列表模态框。
 * handleDevicePress：处理设备点击，发起设备校验流程。
 * handlePinSubmitProxy：PIN码提交代理，收集依赖参数后调用PIN校验。
 * handleDisconnectDevice：断开蓝牙设备连接并更新本地状态。
 * toggleDeleteWalletVisibility：切换删除钱包确认模态框的显示状态。
 * handleDeleteWallet：触发删除钱包流程，弹出确认模态框。
 * confirmDeleteWallet：确认删除钱包，调用删除逻辑并关闭模态框。
 * deleteWallet：执行钱包删除操作，清空相关本地存储和状态。
 * cancelDeleteWallet：取消删除钱包操作，关闭模态框。
 */
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  Vibration,
  View,
  Text,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  Platform,
  Switch,
  TextInput,
  Linking,
  Alert,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import Constants from "expo-constants";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DeviceContext, DarkModeContext } from "../utils/DeviceContext";
import SecureDeviceScreenStyles from "../styles/SecureDeviceScreenStyle";
import LanguageModal from "./modal/LanguageModal";
import CurrencyModal from "./modal/CurrencyModal";
import ChangeLockCodeModal from "./modal/ChangeLockCodeModal";
import ConfirmDisconnectModal from "./modal/ConfirmDisconnectModal";
import SuccessModal from "./modal/SuccessModal";
import ErrorModal from "./modal/ErrorModal";
import EnterLockCodeModal from "./modal/EnterLockCodeModal";
import DisableLockScreenModal from "./modal/DisableLockScreenModal";
import SecurityCodeModal from "./modal/SecurityCodeModal";
import BluetoothModal from "./modal/BluetoothModal";
import CheckStatusModal from "./modal/CheckStatusModal";
import NewLockCodeModal from "./modal/NewLockCodeModal";
import DeleteWalletConfirmationModal from "./modal/DeleteWalletConfirmationModal";
import * as LocalAuthentication from "expo-local-authentication";
import AddressBookModal from "./modal/AddressBookModal";
import LockCodeModal from "./modal/LockCodeModal";
import ModuleSecureView from "./SecureDeviceScreen/ModuleSecureView";
import getSettingsOptions from "./SecureDeviceScreen/settingsOptions";
import handleFirmwareUpdate from "./SecureDeviceScreen/FirmwareUpdate";
import { languages } from "../config/languages";
import base64 from "base64-js";
import { Buffer } from "buffer";
import appConfig from "../app.config";
import { prefixToShortName } from "../config/chainPrefixes";
import { createHandlePinSubmit } from "../utils/handlePinSubmit";
import checkAndReqPermission from "../utils/BluetoothPermissions"; // Request Bluetooth permission on Android
import { parseDeviceCode } from "../utils/parseDeviceCode";
import { firmwareAPI } from "../env/apiEndpoints";
import { bluetoothConfig } from "../env/bluetoothConfig";
import { createHandleDevicePress } from "../utils/handleDevicePress";
import { scanDevices } from "../utils/scanDevices";
import createMonitorVerificationCode from "../utils/monitorVerificationCode";

/**
 * deleteWallet and confirmDeleteWallet are the core functions for the wallet deletion feature.
 * - deleteWallet: Handles the actual removal of wallet data from storage and UI updates.
 * - confirmDeleteWallet: Confirms the user's intent and triggers the deletion process.
 */
const FILE_NAME = "SecureDevice.js";
const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

let PermissionsAndroid;
if (Platform.OS === "android") {
  PermissionsAndroid = require("react-native").PermissionsAndroid;
}

function SecureDeviceScreen({ onDarkModeChange }) {
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
    updateDevicePubHintKey,
    cryptoCards,
  } = useContext(DeviceContext);
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const SecureDeviceScreenStyle = SecureDeviceScreenStyles(isDarkMode);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [LockCodeModalVisible, setLockCodeModalVisible] = useState(false);
  const [enterLockCodeModalVisible, setEnterLockCodeModalVisible] =
    useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(currencyUnit);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  /** 已切换为 bleVisible，原 modalVisible 变量已移除 */
  const [bleVisible, setBleVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [SecurityCodeModalVisible, setSecurityCodeModalVisible] =
    useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [pinCode, setPinCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true);
  const restoreIdentifier = Constants.installationId;
  const toggleColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [newLockCodeModalVisible, setNewLockCodeModalVisible] = useState(false);
  const [isSupportExpanded, setIsSupportExpanded] = useState(false);
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [searchLanguage, setSearchLanguage] = useState("");
  const [searchCurrency, setSearchCurrency] = useState("");
  const [changeLockCodeModalVisible, setChangeLockCodeModalVisible] =
    useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState(false);
  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(searchLanguage.toLowerCase())
  );
  const [confirmLockCodeModalVisible, setConfirmLockCodeModalVisible] =
    useState(false);
  const [storedPassword, setStoredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmDisconnectModalVisible, setConfirmDisconnectModalVisible] =
    useState(false);
  const [deviceToDisconnect, setDeviceToDisconnect] = useState(null);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [modalMessage, setModalMessage] = useState("");
  const [addressBookModalVisible, setAddressBookModalVisible] = useState(false);
  const [CheckStatusModalVisible, setCheckStatusModalVisible] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [missingChainsForModal, setMissingChainsForModal] = useState([]);
  const handleAddAddress = () => {
    console.log("Add Address button clicked");
  };

  const handleAddressSelect = (address) => {
    console.log("Selected Address:", address);
  };

  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(() => {
    AsyncStorage.getItem("faceID").then((status) =>
      setIsFaceIDEnabled(status === "open")
    );
  });

  const toggleFaceID = async (value) => {
    if (value) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: t("Authenticate to enable Face ID"),
      });
      if (result.success) {
        setIsFaceIDEnabled(value);
        await AsyncStorage.setItem("faceID", value ? "open" : "close");
      } else {
        Alert.alert(t("Authentication Failed"), t("Unable to enable Face ID."));
      }
    } else {
      setIsFaceIDEnabled(value);
      await AsyncStorage.setItem("faceID", "close");
    }
  };

  const handleDisconnectPress = (device) => {
    setBleVisible(false);
    setDeviceToDisconnect(device);
    setConfirmDisconnectModalVisible(true);
  };

  const confirmDisconnect = async () => {
    if (deviceToDisconnect) {
      await handleDisconnectDevice(deviceToDisconnect);
      setConfirmDisconnectModalVisible(false);
      setDeviceToDisconnect(null);
      scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
    }
  };

  const cancelDisconnect = () => {
    setConfirmDisconnectModalVisible(false);
    setBleVisible(true);
  };

  const closeEnterLockCodeModal = () => {
    setEnterLockCodeModalVisible(false);
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
  };

  const openLockCodeModal = () => {
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
    setLockCodeModalVisible(true);
  };

  const openEnterLockCodeModal = () => {
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
    setEnterLockCodeModalVisible(true);
  };

  const openChangeLockCodeModal = () => {
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
    setChangeLockCodeModalVisible(true);
  };

  const openNewLockCodeModal = () => {
    setPasswordError("");
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
    setNewLockCodeModalVisible(true);
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

  useEffect(() => {
    if (!SecurityCodeModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [SecurityCodeModalVisible]);

  const handleScreenLockToggle = async (value) => {
    if (value) {
      openLockCodeModal();
    } else {
      openEnterLockCodeModal();
    }
  };

  const handleChangePassword = async () => {
    if (password === confirmPassword) {
      try {
        await changeScreenLockPassword(password);
        setNewLockCodeModalVisible(false);
        setModalMessage(t("Password changed successfully"));
        setSuccessModalVisible(true);
      } catch (error) {
        console.log("Failed to change password", error);
      }
    } else {
      setPasswordError(t("Passwords do not match"));
    }
  };

  const handleNextForChangePassword = (currentPassword) => {
    if (currentPassword === screenLockPassword) {
      setIsCurrentPasswordValid(true);
      setChangeLockCodeModalVisible(false);
      openNewLockCodeModal();
      setCurrentPassword("");
    } else {
      setChangeLockCodeModalVisible(false);
      setModalMessage(t("Incorrect current password"));
      setSuccessModalVisible(false);
      setErrorModalVisible(true);
    }
  };

  const handleSetPassword = async () => {
    if (password.length < 4) {
      setPasswordError(t("Password must be at least 4 characters long"));
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(t("Passwords do not match"));
      return;
    }

    try {
      // 保存到 DeviceContext 及 AsyncStorage
      await changeScreenLockPassword(password);
      await AsyncStorage.setItem(
        "screenLockFeatureEnabled",
        JSON.stringify(true)
      );
      toggleScreenLock(true); // 更新 UI 状态
      setLockCodeModalVisible(false); // 关闭 modal
      setPasswordError("");
      setModalMessage(t("Screen lock enabled successfully"));
      setSuccessModalVisible(true);
    } catch (error) {
      console.error("❌ Failed to enable lock:", error);
      setPasswordError(t("An error occurred while saving password"));
    }
  };

  const closeLockCodeModal = () => {
    setLockCodeModalVisible(false);
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
  };

  const handleConfirmPassword = async () => {
    /*     console.log("⛔ 当前输入：", currentPassword);
    console.log("✅ 正确密码：", screenLockPassword);
 */
    if (currentPassword === screenLockPassword) {
      try {
        await AsyncStorage.setItem(
          "screenLockFeatureEnabled",
          JSON.stringify(false)
        );
        toggleScreenLock(false);
        setEnterLockCodeModalVisible(false);
        setModalMessage(t("Screen lock disabled successfully"));
        setSuccessModalVisible(true);
      } catch (err) {
        console.error("❌ Failed to disable screen lock:", err);
        setModalMessage(t("An error occurred"));
        setErrorModalVisible(true);
      }
    } else {
      setEnterLockCodeModalVisible(false);
      setModalMessage(t("Incorrect password"));
      setErrorModalVisible(true);
    }
  };

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      currency.shortName.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  const { bleManagerRef } = useContext(DeviceContext);

  // 已移除蓝牙 onStateChange 监听，统一由 App.js 管理

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
    setBleVisible(true);
    scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
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

  // 修改后的 handleDarkModeChange 方法，添加 onDarkModeChange 回调调用
  const handleDarkModeChange = async (value) => {
    setIsDarkMode(value);
    await AsyncStorage.setItem("darkMode", JSON.stringify(value));
    if (typeof onDarkModeChange === "function") {
      onDarkModeChange();
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("General"),
    });
  }, [t, navigation]);

  const [receivedAddresses, setReceivedAddresses] = useState({});

  const monitorSubscription = useRef(null);

  // 公共工厂函数替换
  const monitorVerificationCode = createMonitorVerificationCode({
    serviceUUID,
    notifyCharacteristicUUID,
    prefixToShortName,
    updateCryptoAddress,
    setReceivedAddresses,
    setVerificationStatus,
    updateDevicePubHintKey,
    parseDeviceCode,
    setReceivedVerificationCode,
    Buffer,
    writeCharacteristicUUID,
  });
  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription.current) {
      try {
        monitorSubscription.current.remove(); // 使用 monitorSubscription.current
        monitorSubscription.current = null; // 清除当前订阅
        console.log("Stopped monitoring verification code");
      } catch (error) {
        console.log("Error stopping monitoring:", error);
      }
    }
  };

  const handleCancel = () => {
    setBleVisible(false);
  };

  // 新增：使用工厂函数生成 handleDevicePress
  const handleDevicePress = createHandleDevicePress({
    setReceivedAddresses,
    setVerificationStatus,
    setSelectedDevice,
    setBleVisible,
    monitorVerificationCode,
    setSecurityCodeModalVisible,
    serviceUUID,
    writeCharacteristicUUID,
    Buffer,
  });

  // handlePinSubmit 已迁移至 utils/handlePinSubmit.js
  const handlePinSubmit = React.useMemo(
    () =>
      createHandlePinSubmit({
        setSecurityCodeModalVisible,
        setCheckStatusModalVisible,
        setVerificationStatus,
        setVerifiedDevices,
        setIsVerificationSuccessful,
        setPinCode,
        setReceivedAddresses,
        prefixToShortName,
        monitorVerificationCode,
        serviceUUID,
        writeCharacteristicUUID,
      }),
    [
      setSecurityCodeModalVisible,
      setCheckStatusModalVisible,
      setVerificationStatus,
      setVerifiedDevices,
      setIsVerificationSuccessful,
      setPinCode,
      setReceivedAddresses,
      prefixToShortName,
      monitorVerificationCode,
      serviceUUID,
      writeCharacteristicUUID,
    ]
  );

  // 包装一层，收集依赖参数，适配 SecurityCodeModal 的无参 onSubmit
  const handlePinSubmitProxy = React.useCallback(() => {
    handlePinSubmit({
      receivedVerificationCode,
      pinCode,
      selectedDevice,
      receivedAddresses,
    });
  }, [
    handlePinSubmit,
    receivedVerificationCode,
    pinCode,
    selectedDevice,
    receivedAddresses,
  ]);
  // 删除设备功能
  const handleDisconnectDevice = async (device) => {
    try {
      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.log(`Device ${device.id} already disconnected`);
      } else {
        await device.cancelConnection();
        console.log(`Device ${device.id} disconnected`);
      }
      const updatedVerifiedDevices = verifiedDevices.filter(
        (id) => id !== device.id
      );
      setVerifiedDevices(updatedVerifiedDevices);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(updatedVerifiedDevices)
      );
      console.log(`Device ${device.id} removed from verified devices`);
      stopMonitoringVerificationCode();
      setIsVerificationSuccessful(false);
      console.log("Verification status updated to false");
    } catch (error) {
      if (error.errorCode === "OperationCancelled") {
        console.log(`Disconnection cancelled for device ${device.id}`);
      } else {
        console.log("Error disconnecting device:", error);
      }
    }
  };

  const XMODEM_BLOCK_SIZE = 100;

  const buildNumber = appConfig.ios.buildNumber;
  const [isDeleteWalletVisible, setIsDeleteWalletVisible] = useState(false);
  const toggleDeleteWalletVisibility = () => {
    setIsDeleteWalletVisible((prevState) => !prevState);
  };

  const settingsOptions = getSettingsOptions({
    t,
    navigation,
    selectedCurrency,
    setCurrencyModalVisible,
    setLanguageModalVisible,
    languages,
    selectedLanguage,
    isDarkMode,
    toggleColor,
    handleDarkModeChange,
    setAddressBookModalVisible,
    handleScreenLockToggle,
    isScreenLockEnabled,
    openChangeLockCodeModal,
    toggleFaceID,
    isFaceIDEnabled,
    handleFirmwareUpdate,
    isDeleteWalletVisible,
    toggleDeleteWalletVisibility,
    handleDeleteWallet,
    cryptoCards,
    device: devices.find((d) => d.id === verifiedDevices[0]),
    setModalMessage,
    setErrorModalVisible,
    serviceUUID,
    writeCharacteristicUUID,
  });

  const [deleteWalletModalVisible, setDeleteWalletModalVisible] =
    useState(false);

  const handleDeleteWallet = () => {
    Vibration.vibrate();
    setDeleteWalletModalVisible(true);
  };

  const confirmDeleteWallet = async () => {
    setVerifiedDevices([]);
    deleteWallet();
    setDeleteWalletModalVisible(false);
  };

  const deleteWallet = async () => {
    try {
      // 打印删除前的state和AsyncStorage
      const [asCryptoCards, asAddedCryptos, asInitialAdditionalCryptos] =
        await Promise.all([
          AsyncStorage.getItem("cryptoCards"),
          AsyncStorage.getItem("addedCryptos"),
          AsyncStorage.getItem("initialAdditionalCryptos"),
        ]);
      console.log("==== 删除前 ====");
      console.log("state.cryptoCards:", cryptoCards);
      if (typeof addedCryptos !== "undefined")
        console.log("state.addedCryptos:", addedCryptos);
      if (typeof initialAdditionalCryptos !== "undefined")
        console.log(
          "state.initialAdditionalCryptos:",
          initialAdditionalCryptos
        );
      console.log("AS.cryptoCards:", asCryptoCards);
      console.log("AS.addedCryptos:", asAddedCryptos);
      console.log("AS.initialAdditionalCryptos:", asInitialAdditionalCryptos);

      const cryptoCardsData = asCryptoCards;
      const parsedCryptoCards = JSON.parse(cryptoCardsData);
      if (parsedCryptoCards && parsedCryptoCards.length > 0) {
        await AsyncStorage.multiRemove([
          "cryptoCards",
          "addedCryptos",
          "initialAdditionalCryptos",
        ]);
        setCryptoCards([]);
        setVerifiedDevices([]);
        if (typeof setAddedCryptos === "function") setAddedCryptos([]);
        if (typeof setInitialAdditionalCryptos === "function")
          setInitialAdditionalCryptos([]);
        // 打印删除后的state和AsyncStorage
        const [asCryptoCards2, asAddedCryptos2, asInitialAdditionalCryptos2] =
          await Promise.all([
            AsyncStorage.getItem("cryptoCards"),
            AsyncStorage.getItem("addedCryptos"),
            AsyncStorage.getItem("initialAdditionalCryptos"),
          ]);
        console.log("==== 删除后 ====");
        console.log("state.cryptoCards:", cryptoCards);
        if (typeof addedCryptos !== "undefined")
          console.log("state.addedCryptos:", addedCryptos);
        if (typeof initialAdditionalCryptos !== "undefined")
          console.log(
            "state.initialAdditionalCryptos:",
            initialAdditionalCryptos
          );
        console.log("AS.cryptoCards:", asCryptoCards2);
        console.log("AS.addedCryptos:", asAddedCryptos2);
        console.log(
          "AS.initialAdditionalCryptos:",
          asInitialAdditionalCryptos2
        );

        Alert.alert(t("Success"), t("Deleted successfully."));
        navigation.goBack();
      } else {
        Alert.alert(t("No Wallet"), t("No wallet available to delete."));
      }
    } catch (error) {
      console.log("Error deleting wallet:", error);
      Alert.alert(
        t("Error"),
        t("An error occurred while deleting your wallet.")
      );
    }
  };

  const cancelDeleteWallet = () => {
    setDeleteWalletModalVisible(false);
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
      style={SecureDeviceScreenStyle.container}
    >
      <ModuleSecureView
        styles={SecureDeviceScreenStyle}
        settingsOptions={settingsOptions}
        isDeleteWalletVisible={isDeleteWalletVisible}
        setIsDeleteWalletVisible={setIsDeleteWalletVisible}
        isSupportExpanded={isSupportExpanded}
        setIsSupportExpanded={setIsSupportExpanded}
        handleDeleteWallet={handleDeleteWallet}
        handleBluetoothPairing={handleBluetoothPairing}
        iconColor={iconColor}
        cryptoCards={cryptoCards}
        t={t}
      />

      {/* Delete Wallet Confirmation Modal */}
      <DeleteWalletConfirmationModal
        visible={deleteWalletModalVisible}
        onRequestClose={cancelDeleteWallet}
        onConfirm={confirmDeleteWallet}
        onCancel={cancelDeleteWallet}
        styles={SecureDeviceScreenStyle}
        t={t}
      />

      {/* Language Modal */}
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        languages={languages}
        searchLanguage={searchLanguage}
        setSearchLanguage={setSearchLanguage}
        handleLanguageChange={handleLanguageChange}
        styles={SecureDeviceScreenStyle}
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
        styles={SecureDeviceScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* Enable Screen Lock Modal */}
      <LockCodeModal
        visible={LockCodeModalVisible}
        onClose={closeLockCodeModal}
        onSubmit={handleSetPassword}
        isDarkMode={isDarkMode}
        styles={SecureDeviceScreenStyle}
        t={t}
        LockCodeModalVisible={LockCodeModalVisible}
        closeLockCodeModal={closeLockCodeModal}
        handleSetPassword={handleSetPassword}
        password={password}
        setPassword={setPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        isPasswordHidden={isPasswordHidden}
        setIsPasswordHidden={setIsPasswordHidden}
        isConfirmPasswordHidden={isConfirmPasswordHidden}
        setIsConfirmPasswordHidden={setIsConfirmPasswordHidden}
      />

      {/* Disable Lock Screen Modal */}
      <DisableLockScreenModal
        visible={enterLockCodeModalVisible}
        onRequestClose={closeEnterLockCodeModal}
        onSubmit={handleConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        isCurrentPasswordHidden={isCurrentPasswordHidden}
        setIsCurrentPasswordHidden={setIsCurrentPasswordHidden}
        t={t}
        isDarkMode={isDarkMode}
        styles={SecureDeviceScreenStyle}
      />

      {/* Enter Password Modal */}
      <EnterLockCodeModal
        visible={enterLockCodeModalVisible}
        onClose={closeEnterLockCodeModal}
        onSubmit={handleConfirmPassword}
        isDarkMode={isDarkMode}
        styles={SecureDeviceScreenStyle}
        t={t}
        enterLockCodeModalVisible={enterLockCodeModalVisible}
        closeEnterLockCodeModal={closeEnterLockCodeModal}
        handleConfirmPassword={handleConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        isCurrentPasswordHidden={isCurrentPasswordHidden}
        setIsCurrentPasswordHidden={setIsCurrentPasswordHidden}
      />

      {/* Change Password Modal */}
      <ChangeLockCodeModal
        visible={changeLockCodeModalVisible}
        onClose={() => setChangeLockCodeModalVisible(false)}
        onSubmit={handleNextForChangePassword}
        styles={SecureDeviceScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* New Password Modal */}
      <NewLockCodeModal
        visible={newLockCodeModalVisible}
        onRequestClose={() => setNewLockCodeModalVisible(false)}
        onSubmit={handleChangePassword}
        password={password}
        setPassword={setPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordError={passwordError}
        setPasswordError={setPasswordError}
        isPasswordHidden={isPasswordHidden}
        setIsPasswordHidden={setIsPasswordHidden}
        isConfirmPasswordHidden={isConfirmPasswordHidden}
        setIsConfirmPasswordHidden={setIsConfirmPasswordHidden}
        t={t}
        isDarkMode={isDarkMode}
        styles={SecureDeviceScreenStyle}
      />

      {/* Bluetooth Modal */}
      <BluetoothModal
        visible={bleVisible}
        devices={devices}
        isScanning={isScanning}
        onDisconnectPress={handleDisconnectPress}
        handleDevicePress={handleDevicePress}
        onCancel={handleCancel}
        verifiedDevices={verifiedDevices}
        SecureDeviceScreenStyle={SecureDeviceScreenStyle}
      />

      {/* PIN Modal */}
      <SecurityCodeModal
        visible={SecurityCodeModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        onSubmit={handlePinSubmitProxy}
        onCancel={() => setSecurityCodeModalVisible(false)}
        styles={SecureDeviceScreenStyle}
        isDarkMode={isDarkMode}
        status={verificationStatus}
      />

      {/* Verification Modal */}
      <CheckStatusModal
        visible={CheckStatusModalVisible && verificationStatus !== null}
        status={verificationStatus}
        missingChains={missingChainsForModal}
        onClose={() => setCheckStatusModalVisible(false)}
        progress={
          verificationStatus === "waiting"
            ? Object.keys(receivedAddresses).length /
              Object.keys(prefixToShortName).length
            : undefined
        }
      />
      {/* Confirm Disconnect Modal */}
      <ConfirmDisconnectModal
        visible={confirmDisconnectModalVisible}
        onConfirm={confirmDisconnect}
        onCancel={cancelDisconnect}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message={modalMessage}
        styles={SecureDeviceScreenStyle}
      />

      {/* Error Modal */}
      <ErrorModal
        visible={errorModalVisible}
        onClose={() => setErrorModalVisible(false)}
        message={modalMessage}
        styles={SecureDeviceScreenStyle}
        t={t}
      />

      {/* Address Book Modal */}
      <AddressBookModal
        visible={addressBookModalVisible}
        onClose={() => setAddressBookModalVisible(false)}
        addresses={addresses}
        onSelect={handleAddressSelect}
        styles={SecureDeviceScreenStyle}
        isDarkMode={isDarkMode}
        onAddAddress={handleAddAddress}
      />
      <Modal
        visible={errorModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setErrorModalVisible(false)}
      >
        <View style={SecureDeviceScreenStyle.modalView}>
          <Text style={SecureDeviceScreenStyle.modalTitle}>{t("Error")}</Text>
          <Text style={SecureDeviceScreenStyle.modalSubtitle}>
            {modalMessage}
          </Text>
          <Button title={t("OK")} onPress={() => setErrorModalVisible(false)} />
        </View>
      </Modal>
    </LinearGradient>
  );
}

export default SecureDeviceScreen;
