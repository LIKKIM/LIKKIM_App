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
import { CryptoContext, DarkModeContext } from "../utils/CryptoContext";
import MyColdWalletScreenStyles from "../styles/MyColdWalletScreenStyle";
import LanguageModal from "./modal/LanguageModal";
import CurrencyModal from "./modal/CurrencyModal";
import ChangePasswordModal from "./modal/ChangePasswordModal";
import ConfirmDisconnectModal from "./modal/ConfirmDisconnectModal";
import MyColdWalletSuccessModal from "./modal/MyColdWalletSuccessModal";
import MyColdWalletErrorModal from "./modal/MyColdWalletErrorModal";
import EnterPasswordModal from "./modal/EnterPasswordModal";
import DisableLockScreenModal from "./modal/DisableLockScreenModal";
import PinModal from "./modal/PinModal";
import BluetoothModal from "./modal/BluetoothModal";
import VerificationModal from "./modal/VerificationModal";
import NewPasswordModal from "./modal/NewPasswordModal";
import * as LocalAuthentication from "expo-local-authentication";
import AddressBookModal from "./modal/AddressBookModal";
import PasswordModal from "./modal/PasswordModal";
import MyColdWalletContent from "./myColdWalletScreen/MyColdWalletContent";
import getSettingsOptions from "./myColdWalletScreen/settingsOptions";
import { languages } from "../config/languages";
import base64 from "base64-js";
import { Buffer } from "buffer";
import appConfig from "../app.config";
import { prefixToShortName } from "../config/chainPrefixes";

// 自定义组件
import checkAndReqPermission from "../utils/BluetoothPermissions"; // Request Bluetooth permission on Android
import { handlePinSubmit } from "../utils/handlePinSubmit";
import { decrypt } from "../utils/decrypt";
import { handleDevicePress } from "../utils/handleDevicePress";

let PermissionsAndroid;
if (Platform.OS === "android") {
  PermissionsAndroid = require("react-native").PermissionsAndroid;
}

const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function MyColdWalletScreen({ onDarkModeChange }) {
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
    updateCryptoPublicKey,
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
  const [verificationModalVisible, setVerificationModalVisible] =
    useState(false);
  const [addresses, setAddresses] = useState([
    { id: "1", name: "Home", address: "0x1234..." },
    { id: "2", name: "Office", address: "0x5678..." },
  ]);

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
    setModalVisible(false);
    setDeviceToDisconnect(device);
    setConfirmDisconnectModalVisible(true);
  };

  const confirmDisconnect = async () => {
    if (deviceToDisconnect) {
      await handleDisconnectDevice(deviceToDisconnect);
      setConfirmDisconnectModalVisible(false);
      setDeviceToDisconnect(null);
    }
  };

  const cancelDisconnect = () => {
    setConfirmDisconnectModalVisible(false);
    setModalVisible(true);
  };

  const closePasswordModal = () => {
    setPasswordModalVisible(false);
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
  };

  const closeEnterPasswordModal = () => {
    setEnterPasswordModalVisible(false);
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
  };

  const openPasswordModal = () => {
    setPassword("");
    setConfirmPassword("");
    setIsPasswordHidden(true);
    setIsConfirmPasswordHidden(true);
    setPasswordModalVisible(true);
  };

  const openEnterPasswordModal = () => {
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
    setEnterPasswordModalVisible(true);
  };

  const openChangePasswordModal = () => {
    setCurrentPassword("");
    setIsCurrentPasswordHidden(true);
    setChangePasswordModalVisible(true);
  };

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
    if (!pinModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [pinModalVisible]);

  const handleScreenLockToggle = async (value) => {
    if (value) {
      openPasswordModal();
    } else {
      openEnterPasswordModal();
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

  let monitorSubscription;

  const monitorVerificationCode = (device, sendDecryptedValue) => {
    if (monitorSubscription) {
      monitorSubscription.remove();
      monitorSubscription = null;
    }
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
              setVerificationStatus("walletReady");
            } else {
              setVerificationStatus("waiting");
            }
            return updated;
          });
        }

        if (receivedDataString.startsWith("pubkeyData:")) {
          const pubkeyData = receivedDataString
            .replace("pubkeyData:", "")
            .trim();
          const [queryChainName, publicKey] = pubkeyData.split(",");
          if (queryChainName && publicKey) {
            console.log(
              `Received public key for ${queryChainName}: ${publicKey}`
            );
            updateCryptoPublicKey(queryChainName, publicKey);
          }
        }

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

  const XMODEM_BLOCK_SIZE = 64;

  const handleFirmwareUpdate = async () => {
    console.log("Firmware Update clicked");
    if (!selectedDevice) {
      Alert.alert(
        t("Error"),
        t("No device paired. Please pair with device first.")
      );
      return;
    }

    try {
      const response = await fetch(
        "https://file.likkim.com/algo/lvgl_exec.dat"
      );
      if (!response.ok) {
        throw new Error("Download failed");
      }
      const arrayBuffer = await response.arrayBuffer();
      const firmwareData = new Uint8Array(arrayBuffer);
      console.log("Firmware downloaded, size:", firmwareData.length);

      let firstBlock = firmwareData.slice(0, XMODEM_BLOCK_SIZE);
      if (firstBlock.length < XMODEM_BLOCK_SIZE) {
        const padded = new Uint8Array(XMODEM_BLOCK_SIZE);
        padded.set(firstBlock);
        padded.fill(0x1a, firstBlock.length);
        firstBlock = padded;
      }

      const hexBlock = Array.from(firstBlock)
        .map((byte) => ("0" + (byte & 0xff).toString(16)).slice(-2))
        .join("");

      const commandString = "XMODEM_UPDATE:" + hexBlock;
      console.log("Command String:", commandString);

      const base64Command = Buffer.from(commandString, "utf-8").toString(
        "base64"
      );
      console.log("Base64 Command:", base64Command);

      await selectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64Command
      );
      console.log("Sent XMODEM update command as Base64 text");

      Alert.alert(
        t("Firmware Update Test"),
        t(
          "First 128-byte block sent successfully as a Base64 text command. Please check if the embedded device received the data."
        )
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
      let blockData = firmwareData.slice(offset, offset + XMODEM_BLOCK_SIZE);
      if (blockData.length < XMODEM_BLOCK_SIZE) {
        const padded = new Uint8Array(XMODEM_BLOCK_SIZE);
        padded.set(blockData);
        padded.fill(0x1a, blockData.length);
        blockData = padded;
      }
      const packet = new Uint8Array(3 + XMODEM_BLOCK_SIZE + 1);
      packet[0] = SOH;
      packet[1] = blockNumber & 0xff;
      packet[2] = ~blockNumber & 0xff;
      packet.set(blockData, 3);
      let checksum = 0;
      for (const byte of blockData) {
        checksum = (checksum + byte) & 0xff;
      }
      packet[3 + XMODEM_BLOCK_SIZE] = checksum;

      let success = false;
      let retries = 0;
      while (!success && retries < 10) {
        const base64Packet = Buffer.from(packet).toString("base64");
        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Packet
        );
        console.log(`Sent block ${blockNumber}, retry ${retries}`);
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
            resolve(data[0]);
          }
        }
      );
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
    openChangePasswordModal,
    toggleFaceID,
    isFaceIDEnabled,
    handleFirmwareUpdate,
    isDeleteWalletVisible,
    toggleDeleteWalletVisibility,
    handleDeleteWallet,
  });

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
      <MyColdWalletContent
        styles={MyColdWalletScreenStyle}
        settingsOptions={settingsOptions}
        isDeleteWalletVisible={isDeleteWalletVisible}
        setIsDeleteWalletVisible={setIsDeleteWalletVisible}
        isSupportExpanded={isSupportExpanded}
        setIsSupportExpanded={setIsSupportExpanded}
        handleDeleteWallet={handleDeleteWallet}
        handleBluetoothPairing={handleBluetoothPairing}
        iconColor={iconColor}
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
      <DisableLockScreenModal
        visible={enterPasswordModalVisible}
        onRequestClose={closeEnterPasswordModal}
        onSubmit={handleConfirmPassword}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        isCurrentPasswordHidden={isCurrentPasswordHidden}
        setIsCurrentPasswordHidden={setIsCurrentPasswordHidden}
        t={t}
        isDarkMode={isDarkMode}
        styles={MyColdWalletScreenStyle}
      />

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
      <NewPasswordModal
        visible={newPasswordModalVisible}
        onRequestClose={() => setNewPasswordModalVisible(false)}
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
        styles={MyColdWalletScreenStyle}
      />

      {/* Bluetooth Modal */}
      <BluetoothModal
        visible={modalVisible}
        devices={devices}
        isScanning={isScanning}
        iconColor={blueToothColor}
        handleDevicePress={handleDevicePress}
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
