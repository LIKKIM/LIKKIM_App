// SecureDevice.js
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
      await AsyncStorage.setItem("appLockPassword", password);
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
    console.log("⛔ 当前输入：", currentPassword);
    console.log("✅ 正确密码：", screenLockPassword);

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

  function hexStringToUint32Array(hexString) {
    return new Uint32Array([
      parseInt(hexString.slice(0, 8), 16),
      parseInt(hexString.slice(8, 16), 16),
    ]);
  }

  function uint32ArrayToHexString(uint32Array) {
    return (
      uint32Array[0].toString(16).toUpperCase().padStart(8, "0") +
      uint32Array[1].toString(16).toUpperCase().padStart(8, "0")
    );
  }

  const [receivedAddresses, setReceivedAddresses] = useState({});

  const monitorSubscription = useRef(null);

  const monitorVerificationCode = (device, sendparseDeviceCodeedValue) => {
    // 正确地移除已有监听
    if (monitorSubscription.current) {
      monitorSubscription.current.remove();
      monitorSubscription.current = null;
    }

    monitorSubscription.current = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log(
            `${FILE_NAME} Error monitoring device response:`,
            error.message
          );
          return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        // 该代码块用于处理嵌入式设备发送来的不同区块链地址
        // 通过prefixToShortName映射，查找receivedDataString中以哪个区块链前缀开头
        // 如果找到对应前缀，则提取地址部分，并根据映射获取区块链简称
        // 调用updateCryptoAddress更新对应区块链的地址
        // 同时更新receivedAddresses状态，统计已接收的地址数量
        // 如果接收到的地址数量达到预期（即所有区块链地址均已接收），则设置验证状态为"walletReady"
        // 否则，设置状态为"waiting"，表示仍在等待更多地址

        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const chainShortName = prefixToShortName[prefix];
          console.log(`Received ${chainShortName} address: `, newAddress);
          updateCryptoAddress(chainShortName, newAddress);

          setReceivedAddresses((prev) => {
            const updated = { ...prev, [chainShortName]: newAddress };
            const expectedCount = Object.keys(prefixToShortName).length;
            if (Object.keys(updated).length >= expectedCount) {
              setTimeout(() => {
                setVerificationStatus("walletReady");
                console.log("All public keys received, wallet ready.");
              }, 5000);
            } else {
              setVerificationStatus("waiting");
              // 新增打印缺失的区块链地址
              const missingChains = Object.values(prefixToShortName).filter(
                (shortName) => !updated.hasOwnProperty(shortName)
              );
              if (missingChains.length > 0) {
                console.log(
                  "Missing addresses for chains:",
                  missingChains.join(", ")
                );
              }
            }
            return updated;
          });
        }
        /**
         * 监听部分区块链的公钥
         */
        if (receivedDataString.startsWith("pubkeyData:")) {
          const pubkeyData = receivedDataString
            .replace("pubkeyData:", "")
            .trim();
          const [queryChainName, publicKey] = pubkeyData.split(",");
          if (queryChainName && publicKey) {
            //console.log(
            //  `Received public key for ${queryChainName}: ${publicKey}`
            //);
            updateDevicePubHintKey(queryChainName, publicKey);
          }
        }

        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);
          parseDeviceCode(encryptedData, key);
          const parseDeviceCodeedHex = uint32ArrayToHexString(encryptedData);
          console.log("parseDeviceCodeed string:", parseDeviceCodeedHex);
          if (sendparseDeviceCodeedValue) {
            sendparseDeviceCodeedValue(parseDeviceCodeedHex);
          }
        }

        if (receivedDataString === "VALID") {
          try {
            setVerificationStatus("VALID");
            console.log("Status set to: VALID");
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
            console.log(`Sent 'validation' to device`);
          } catch (error) {
            console.log("发送 'validation' 时出错:", error);
          }
        }

        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          monitorSubscription.current?.remove();
          monitorSubscription.current = null;
        }
      }
    );
  };
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
      const cryptoCardsData = await AsyncStorage.getItem("cryptoCards");
      const cryptoCards = JSON.parse(cryptoCardsData);
      if (cryptoCards && cryptoCards.length > 0) {
        await AsyncStorage.removeItem("cryptoCards");
        setCryptoCards([]);
        setVerifiedDevices([]);
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
