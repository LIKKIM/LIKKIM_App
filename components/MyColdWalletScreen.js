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
import EnterPasswordModal from "./modal/EnterPasswordModal";
import PinModal from "./modal/PinModal";
import BluetoothModal from "./modal/BluetoothModal";
import VerificationModal from "./modal/VerificationModal";
import * as LocalAuthentication from "expo-local-authentication";
import AddressBookModal from "./modal/AddressBookModal";
import PasswordModal from "./modal/PasswordModal";
import { languages } from "../config/languages";
import base64 from "base64-js";
import { Buffer } from "buffer";
import appConfig from "../app.config";
import { prefixToShortName } from "../config/chainPrefixes";
import checkAndReqPermission from "../utils/BluetoothPermissions"; // Request Bluetooth permission on Android

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
  const [storedPassword, setStoredPassword] = useState(""); // Stored password
  const [passwordError, setPasswordError] = useState(""); // Password error state
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

  // 在文件顶部的常量部分加入 XMODEM 协议相关常量
  const XMODEM_BLOCK_SIZE = 128;
  const SOH = 0x01; // start of header
  const EOT = 0x04; // end of transmission
  const ACK = 0x06; // acknowledgment
  const NAK = 0x15; // negative acknowledgment
  const CAN = 0x18; // cancel

  const handleAddAddress = () => {
    // Handle adding a new address
    console.log("Add Address button clicked");
  };

  const handleAddressSelect = (address) => {
    console.log("Selected Address:", address);
    // Further processing for the selected address can be added here
  };

  const [isFaceIDEnabled, setIsFaceIDEnabled] = useState(() => {
    AsyncStorage.getItem("faceID").then((status) =>
      setIsFaceIDEnabled(status === "open")
    );
  });

  const toggleFaceID = async (value) => {
    if (value) {
      // Verify Face ID when enabling
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
      // Disable directly
      setIsFaceIDEnabled(value);
      await AsyncStorage.setItem("faceID", "close");
    }
  };

  // Set disconnect modal state
  const handleDisconnectPress = (device) => {
    setModalVisible(false); // Close device selection modal
    setDeviceToDisconnect(device);
    setConfirmDisconnectModalVisible(true);
  };

  // Called when user confirms disconnection
  const confirmDisconnect = async () => {
    if (deviceToDisconnect) {
      await handleDisconnectDevice(deviceToDisconnect);
      setConfirmDisconnectModalVisible(false);
      setDeviceToDisconnect(null);
    }
  };

  // Called when user cancels disconnection
  const cancelDisconnect = () => {
    setConfirmDisconnectModalVisible(false);
    setModalVisible(true);
  };

  // Close password modal and clear input
  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setPassword(""); // Clear password input
    setConfirmPassword(""); // Clear confirmation input
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
  };

  // Close enter password modal and clear input
  const closeEnterPasswordModal = () => {
    setEnterPasswordModalVisible(false);
    setCurrentPassword(""); // Clear current password input
    setIsCurrentPasswordHidden(true);
  };

  // Open password modal and clear input
  const openPasswordModal = () => {
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
    setPasswordModalVisible(true);
  };

  // Open enter password modal and clear input
  const openEnterPasswordModal = () => {
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
    setEnterPasswordModalVisible(true);
  };

  // Open change password modal and clear input
  const openChangePasswordModal = () => {
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
    setChangePasswordModalVisible(true);
  };

  // Open new password modal and clear input
  const openNewPasswordModal = () => {
    setPasswordError("");
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
    setNewPasswordModalVisible(true);
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

  // Load verified devices from storage
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

  // Stop monitoring when PIN modal is closed
  useEffect(() => {
    if (!pinModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [pinModalVisible]);

  const handleScreenLockToggle = async (value) => {
    if (value) {
      openPasswordModal(); // Enable lock: open set password modal
    } else {
      openEnterPasswordModal(); // Disable lock: open enter password modal
    }
  };

  const handleChangePassword = async () => {
    if (password === confirmPassword) {
      try {
        await changeScreenLockPassword(password);
        setNewPasswordModalVisible(false);
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
      setChangePasswordModalVisible(false);
      openNewPasswordModal();
      setCurrentPassword("");
    } else {
      setChangePasswordModalVisible(false);
      setModalMessage(t("Incorrect current password"));
      setSuccessModalVisible(false);
      setErrorModalVisible(true);
    }
  };

  // Handle password modal submission
  const handleSetPassword = async () => {
    if (password.length < 4) {
      setPasswordError(t("Password must be at least 4 characters long"));
      return;
    }
    if (password === confirmPassword) {
      try {
        await changeScreenLockPassword(password);
        toggleScreenLock(true);
        setPasswordModalVisible(false);
        setPasswordError("");
        setModalMessage(t("Screen lock enabled successfully"));
        setSuccessModalVisible(true);
      } catch (error) {
        console.log("Failed to save password", error);
      }
    } else {
      setPasswordError(t("Passwords do not match"));
    }
  };

  // Handle enter password modal submission
  const handleConfirmPassword = async () => {
    if (currentPassword === screenLockPassword) {
      toggleScreenLock(false);
      setEnterPasswordModalVisible(false);
      setModalMessage(t("Screen lock disabled successfully"));
      setSuccessModalVisible(true);
    } else {
      setEnterPasswordModalVisible(false);
      setModalMessage(t("Incorrect password"));
      setErrorModalVisible(true);
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
          // Delay to ensure Bluetooth is ready
          setTimeout(() => {
            scanDevices();
          }, 2000);
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
                // Bluetooth LE unsupported on device
              }
            } else if (device.name && device.name.includes("LIKKIM")) {
              setDevices((prevDevices) => {
                if (!prevDevices.find((d) => d.id === device.id)) {
                  return [...prevDevices, device];
                }
                return prevDevices;
              });
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
    let crc = 0xffff;
    for (let byte of arr) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) {
        crc = crc & 0x0001 ? (crc >> 1) ^ 0xa001 : crc >> 1;
      }
    }
    return crc & 0xffff;
  }

  const reconnectDevice = async (device) => {
    try {
      console.log(`Attempting to reconnect device: ${device.id}`);
      await device.cancelConnection();
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device reconnected");
    } catch (error) {
      console.log("Device reconnection failed:", error);
    }
  };

  function hexStringToUint32Array(hexString) {
    // Convert hex string to two 32-bit unsigned integers
    return new Uint32Array([
      parseInt(hexString.slice(0, 8), 16),
      parseInt(hexString.slice(8, 16), 16),
    ]);
  }

  function uint32ArrayToHexString(uint32Array) {
    // Convert two 32-bit integers to a hex string
    return (
      uint32Array[0].toString(16).toUpperCase().padStart(8, "0") +
      uint32Array[1].toString(16).toUpperCase().padStart(8, "0")
    );
  }

  // Decryption algorithm
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
          console.log("Error monitoring device response:", error.message);
          return;
        }
        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        // Check if data starts with a known prefix
        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const shortName = prefixToShortName[prefix];
          console.log(`Received ${shortName} address: `, newAddress);
          updateCryptoAddress(shortName, newAddress);
        }

        // Process data containing "ID:"
        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);
          decrypt(encryptedData, key);
          const decryptedHex = uint32ArrayToHexString(encryptedData);
          console.log("Decrypted string:", decryptedHex);
          if (sendDecryptedValue) {
            sendDecryptedValue(decryptedHex);
          }
        }

        // If data is "VALID", update status and send "validation"
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
            console.log("Error sending 'validation':", error);
          }
        }

        // Extract complete PIN data (e.g., PIN:1234,Y or PIN:1234,N)
        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          console.log("Complete PIN data received:", receivedDataString);
        }
      }
    );
  };

  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription) {
      try {
        monitorSubscription.remove();
        monitorSubscription = null;
        console.log("Stopped monitoring verification code");
      } catch (error) {
        console.log("Error stopping monitoring:", error);
      }
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  // Handle device selection and show modal
  const handleDevicePress = async (device) => {
    setVerificationStatus(null);
    setSelectedDevice(device);
    setModalVisible(false);
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected and services discovered");

      // Function to send decrypted value to device
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
          console.log(`Sent decrypted value: ${message}`);
        } catch (error) {
          console.log("Error sending decrypted value:", error);
        }
      };

      // Start monitoring before sending request
      monitorVerificationCode(device, sendDecryptedValue);
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
          console.log("Sent 'request'");
        } catch (error) {
          console.log("Error sending 'request':", error);
        }
      }, 200);
      setPinModalVisible(true);
    } catch (error) {
      console.log("Error connecting or sending command to device:", error);
    }
  };

  // Validate the PIN input
  const handlePinSubmit = async () => {
    setPinModalVisible(false);
    setVerificationModalVisible(false);
    const verificationCodeValue = receivedVerificationCode.trim();
    const pinCodeValue = pinCode.trim();
    console.log(`User PIN: ${pinCodeValue}`);
    console.log(`Received data: ${verificationCodeValue}`);
    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }
    const [receivedPin, flag] = rest.split(",");
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }
    console.log(`Extracted PIN: ${receivedPin}`);
    console.log(`Flag: ${flag}`);
    if (pinCodeValue === receivedPin) {
      console.log("PIN verified successfully");
      setVerificationStatus("success");
      setVerifiedDevices([selectedDevice.id]);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
      );
      setIsVerificationSuccessful(true);
      console.log("Device verified and saved");
      if (flag === "Y") {
        console.log("Flag Y received; sending 'address' to device");
        try {
          const message = "address";
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log("Sent 'address' to device");
        } catch (error) {
          console.log("Error sending 'address':", error);
        }
      } else if (flag === "N") {
        console.log("Flag N received; no 'address' sent");
      }
    } else {
      console.log("PIN verification failed");
      setVerificationStatus("fail");
      if (monitorSubscription) {
        monitorSubscription.remove();
        console.log("Stopped monitoring verification code");
      }
      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("Disconnected device");
      }
    }
    setVerificationModalVisible(true);
    setPinCode("");
  };

  // Handle device disconnection
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
      if (
        error instanceof BleError &&
        error.errorCode === BleErrorCode.OperationCancelled
      ) {
        console.log(`Disconnection cancelled for device ${device.id}`);
      } else {
        console.log("Error disconnecting device:", error);
      }
    }
  };

  // 修改 handleFirmwareUpdate 函数
  const handleFirmwareUpdate = async () => {
    console.log("Firmware Update clicked");
    // 检查是否已连接蓝牙设备（你可能需要让用户先完成配对）
    if (!selectedDevice) {
      Alert.alert(
        t("Error"),
        t("No device paired. Please pair with device first.")
      );
      return;
    }
    try {
      // 下载固件文件
      const response = await fetch(
        "https://file.likkim.com/algo/lvgl_exec.dat"
      );
      if (!response.ok) {
        throw new Error("Download failed");
      }
      const arrayBuffer = await response.arrayBuffer();
      const firmwareData = new Uint8Array(arrayBuffer);
      console.log("Firmware downloaded, size:", firmwareData.length);

      // 开始使用 XMODEM 协议传输固件
      await xmodemTransfer(selectedDevice, firmwareData);
      Alert.alert(
        t("Firmware Update"),
        t("Firmware update completed successfully.")
      );
    } catch (error) {
      console.error("Firmware update error:", error);
      Alert.alert(t("Firmware Update Error"), error.message);
    }
  };

  // XMODEM 协议传输函数（简化实现）
  // 1. 将当前数据块转换为 Base64 后发送给设备。
  // 2. 每个数据块最多尝试发送 10 次，直到收到设备返回的 ACK（0x06）。
  //    如果收到 NAK（0x15），则重传该数据块；收到其他响应则抛出错误。
  // 3. 所有数据块发送完毕后，发送 EOT 字节，并同样等待设备返回 ACK，最多重传 10 次。

  async function xmodemTransfer(device, firmwareData) {
    let blockNumber = 1;
    for (
      let offset = 0;
      offset < firmwareData.length;
      offset += XMODEM_BLOCK_SIZE
    ) {
      // 取出当前块数据
      let blockData = firmwareData.slice(offset, offset + XMODEM_BLOCK_SIZE);
      // 不足 128 字节则用 0x1A（SUB）填充
      if (blockData.length < XMODEM_BLOCK_SIZE) {
        const padded = new Uint8Array(XMODEM_BLOCK_SIZE);
        padded.set(blockData);
        padded.fill(0x1a, blockData.length);
        blockData = padded;
      }
      // 构造 XMODEM 数据包：[SOH, block#, 255 - block#, data(128字节), checksum]
      const packet = new Uint8Array(3 + XMODEM_BLOCK_SIZE + 1);
      packet[0] = SOH;
      packet[1] = blockNumber & 0xff;
      packet[2] = ~blockNumber & 0xff;
      packet.set(blockData, 3);
      // 计算简单校验和（所有数据字节求和 mod 256）
      let checksum = 0;
      for (const byte of blockData) {
        checksum = (checksum + byte) & 0xff;
      }
      packet[3 + XMODEM_BLOCK_SIZE] = checksum;

      // 尝试发送当前块，最多重传 10 次
      let success = false;
      let retries = 0;
      while (!success && retries < 10) {
        // 将 packet 转换为 Base64 字符串并写入蓝牙特征
        const base64Packet = Buffer.from(packet).toString("base64");
        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Packet
        );
        console.log(`Sent block ${blockNumber}, retry ${retries}`);
        // 等待设备响应（ACK/NAK），这里使用 waitForResponse 简单实现
        const response = await waitForResponse(device);
        if (response === ACK) {
          success = true;
        } else if (response === NAK) {
          retries++;
        } else {
          throw new Error("Unexpected response during XMODEM transfer");
        }
      }
      if (!success) {
        throw new Error("Failed to transfer block " + blockNumber);
      }
      blockNumber = (blockNumber + 1) & 0xff;
    }
    // 全部数据传输完成后，发送 EOT（结束传输）
    let eotSent = false;
    let eotRetries = 0;
    while (!eotSent && eotRetries < 10) {
      const base64EOT = Buffer.from(new Uint8Array([EOT])).toString("base64");
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64EOT
      );
      console.log("Sent EOT");
      const response = await waitForResponse(device);
      if (response === ACK) {
        eotSent = true;
      } else {
        eotRetries++;
      }
    }
    if (!eotSent) {
      throw new Error("Failed to complete XMODEM transfer");
    }
  }

  // 简单实现一个等待设备响应的函数（监听 notifyCharacteristic）
  function waitForResponse(device) {
    return new Promise((resolve, reject) => {
      const subscription = device.monitorCharacteristicForService(
        serviceUUID,
        notifyCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            subscription.remove();
            reject(error);
            return;
          }
          const data = Buffer.from(characteristic.value, "base64");
          if (data.length > 0) {
            subscription.remove();
            // 假设设备响应为单字节数据
            resolve(data[0]);
          }
        }
      );
      // 超时 5 秒未响应，则 reject
      setTimeout(() => {
        subscription.remove();
        reject(new Error("Response timeout"));
      }, 5000);
    });
  }

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
    walletManagement: [
      {
        title: t("Wallet Management"),
        icon: "wallet",
        extraIcon: isDeleteWalletVisible ? "arrow-drop-up" : "arrow-drop-down",
        onPress: toggleDeleteWalletVisibility,
      },
      isDeleteWalletVisible && {
        title: t("Delete Wallet"),
        icon: "delete-outline",
        onPress: () => {
          Vibration.vibrate();
          handleDeleteWallet();
        },
        style: { color: "red" },
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

  // Confirm delete wallet alert
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
            deleteWallet();
          },
        },
      ],
      { cancelable: false }
    );
  };

  // Delete wallet from storage and state
  const deleteWallet = async () => {
    try {
      const cryptoCardsData = await AsyncStorage.getItem("cryptoCards");
      const cryptoCards = JSON.parse(cryptoCardsData);
      if (cryptoCards && cryptoCards.length > 0) {
        await AsyncStorage.removeItem("cryptoCards");
        setCryptoCards([]);
        setVerifiedDevices([]);
        Alert.alert(
          t("Success"),
          t("Your wallet has been deleted successfully.")
        );
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
          {/* Settings Section */}
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
            onPress={() => setIsDeleteWalletVisible(!isDeleteWalletVisible)}
          >
            <View style={MyColdWalletScreenStyle.listContainer}>
              <Icon
                name="wallet"
                size={24}
                color={iconColor}
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

          {isDeleteWalletVisible && (
            <View>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.settingsItem}
                onPress={handleDeleteWallet}
              >
                <View style={MyColdWalletScreenStyle.listContainer}>
                  <Icon
                    name="delete-outline"
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

          {/* Support Section (collapsible) */}
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

          {/* Info Section (always expanded) */}
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

          {/* Bluetooth Pairing Button */}
          <View style={{ marginTop: 40, alignItems: "center" }}>
            <TouchableOpacity
              style={MyColdWalletScreenStyle.roundButton}
              onPress={() => {
                Vibration.vibrate();
                handleBluetoothPairing();
              }}
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

      {/* Enable Screen Lock Modal */}
      <PasswordModal
        visible={passwordModalVisible}
        onClose={closePasswordModal}
        onSubmit={handleSetPassword}
        isDarkMode={isDarkMode}
        styles={MyColdWalletScreenStyle}
        t={t}
        passwordModalVisible={passwordModalVisible}
        closePasswordModal={closePasswordModal}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={enterPasswordModalVisible}
        onRequestClose={closeEnterPasswordModal}
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
                onPress={closeEnterPasswordModal}
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
      <EnterPasswordModal
        visible={enterPasswordModalVisible}
        onClose={closeEnterPasswordModal}
        onSubmit={handleConfirmPassword}
        isDarkMode={isDarkMode}
        styles={MyColdWalletScreenStyle}
        t={t}
        enterPasswordModalVisible={enterPasswordModalVisible}
        closeEnterPasswordModal={closeEnterPasswordModal}
        handleConfirmPassword={handleConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        isCurrentPasswordHidden={isCurrentPasswordHidden}
        setIsCurrentPasswordHidden={setIsCurrentPasswordHidden}
      />

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
                    setPasswordError("");
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
                    setPasswordError("");
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
                onPress={handleChangePassword}
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

      {/* Bluetooth Modal */}
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

      {/* PIN Modal */}
      <PinModal
        visible={pinModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        onSubmit={handlePinSubmit}
        onCancel={() => setPinModalVisible(false)}
        styles={MyColdWalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
        status={verificationStatus}
      />

      {/* Verification Modal */}
      <VerificationModal
        visible={verificationModalVisible && verificationStatus !== null}
        status={verificationStatus}
        onClose={() => setVerificationModalVisible(false)}
        styles={MyColdWalletScreenStyle}
        t={t}
      />

      {/* Confirm Disconnect Modal */}
      <ConfirmDisconnectModal
        visible={confirmDisconnectModalVisible}
        onConfirm={confirmDisconnect}
        onCancel={cancelDisconnect}
        styles={MyColdWalletScreenStyle}
        t={t}
      />

      {/* Success Modal */}
      <MyColdWalletSuccessModal
        visible={successModalVisible}
        onClose={() => setSuccessModalVisible(false)}
        message={modalMessage}
        styles={MyColdWalletScreenStyle}
        t={t}
      />

      {/* Error Modal */}
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
        onAddAddress={handleAddAddress}
      />
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
