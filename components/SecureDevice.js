// SecureDevice.js
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
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
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
import * as LocalAuthentication from "expo-local-authentication";
import AddressBookModal from "./modal/AddressBookModal";
import LockCodeModal from "./modal/LockCodeModal";
import ModuleSecureView from "./SecureDeviceScreen/ModuleSecureView";
import getSettingsOptions from "./SecureDeviceScreen/settingsOptions";
import { languages } from "../config/languages";
import base64 from "base64-js";
import { Buffer } from "buffer";
import appConfig from "../app.config";
import { prefixToShortName } from "../config/chainPrefixes";
import checkAndReqPermission from "../utils/BluetoothPermissions"; // Request Bluetooth permission on Android
import { parseDeviceCode } from "../utils/parseDeviceCode";
import { firmwareAPI } from "../env/apiEndpoints";
import { bluetoothConfig } from "../env/bluetoothConfig";
// SecureDevice.js
import {
  monitorVerificationCode,
  stopMonitoringVerificationCode,
} from "../utils/bluetoothUtils";

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
  const [modalVisible, setModalVisible] = useState(false);
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
  const blueToothColor = isDarkMode ? "#CCB68C" : "#CFAB95";
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
      headerTitle: t("General"),
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

  const [receivedAddresses, setReceivedAddresses] = useState({});

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleDevicePress = async (device) => {
    setReceivedAddresses({});
    setVerificationStatus(null);
    setSelectedDevice(device);
    setModalVisible(false);
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected and services discovered");

      const sendparseDeviceCodeedValue = async (parseDeviceCodeedValue) => {
        try {
          const message = `ID:${parseDeviceCodeedValue}`;
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log(`Sent parseDeviceCodeed value: ${message}`);
        } catch (error) {
          console.log("Error sending parseDeviceCodeed value:", error);
        }
      };

      monitorVerificationCode(
        device,
        sendparseDeviceCodeedValue,
        setVerificationStatus,
        setReceivedAddresses,
        updateCryptoAddress,
        updateDevicePubHintKey
      );
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
      setSecurityCodeModalVisible(true);
    } catch (error) {
      console.log("Error connecting or sending command to device:", error);
    }
  };
  // SecureDeviceScreen.js handlePinSubmit
  const handlePinSubmit = async () => {
    setSecurityCodeModalVisible(false);
    setCheckStatusModalVisible(false);
    const verificationCodeValue = receivedVerificationCode.trim();
    const pinCodeValue = pinCode.trim();

    console.log(`User PIN: ${pinCodeValue}`);
    console.log(`Received data: ${verificationCodeValue}`);

    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      console.log("Invalid verification format:", verificationCodeValue);
      setCheckStatusModalVisible(true);
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

      try {
        const confirmationMessage = "PIN_OK";
        const bufferConfirmation = Buffer.from(confirmationMessage, "utf-8");
        const base64Confirmation = bufferConfirmation.toString("base64");
        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Confirmation
        );
        console.log("Sent confirmation message:", confirmationMessage);
      } catch (error) {
        console.log("Error sending confirmation message:", error);
      }

      if (flag === "Y") {
        console.log("Flag Y received; sending 'address' to device");
        // 开启监听，确保设备返回的地址信息能被接收
        monitorVerificationCode(
          selectedDevice,
          (parseDeviceCodeedValue) => {
            console.log("Parsed device code:", parseDeviceCodeedValue);
          },
          setVerificationStatus,
          setReceivedAddresses,
          updateCryptoAddress,
          updateDevicePubHintKey
        );

        try {
          const addressMessage = "address";
          const bufferAddress = Buffer.from(addressMessage, "utf-8");
          const base64Address = bufferAddress.toString("base64");
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Address
          );
          console.log("Sent 'address' to device");
          setCheckStatusModalVisible(true);
        } catch (error) {
          console.log("Error sending 'address':", error);
        }
      } else if (flag === "N") {
        console.log("Flag N received; no 'address' sent");
        setCheckStatusModalVisible(true);
      }
    } else {
      console.log("PIN verification failed");
      setVerificationStatus("fail");
      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("Disconnected device");
      }
    }
    setPinCode("");
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
      if (error.errorCode === "OperationCancelled") {
        console.log(`Disconnection cancelled for device ${device.id}`);
      } else {
        console.log("Error disconnecting device:", error);
      }
    }
  };

  const XMODEM_BLOCK_SIZE = 100;

  const handleFirmwareUpdate = async () => {
    console.log("Firmware Update clicked");
    if (!selectedDevice) {
      setModalMessage(t("No device paired. Please pair with device first."));
      setErrorModalVisible(true);

      return;
    }

    try {
      const response = await fetch(firmwareAPI.lvglExec);
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
    openChangeLockCodeModal,
    toggleFaceID,
    isFaceIDEnabled,
    handleFirmwareUpdate,
    isDeleteWalletVisible,
    toggleDeleteWalletVisibility,
    handleDeleteWallet,
    cryptoCards,
  });

  const handleDeleteWallet = () => {
    Alert.alert(
      t("Warning"),
      t("deleteDeviceConfirmMessage"),
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
        visible={modalVisible}
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
        onSubmit={handlePinSubmit}
        onCancel={() => setSecurityCodeModalVisible(false)}
        styles={SecureDeviceScreenStyle}
        isDarkMode={isDarkMode}
        status={verificationStatus}
      />

      {/* Verification Modal */}
      <CheckStatusModal
        visible={CheckStatusModalVisible && verificationStatus !== null}
        status={verificationStatus}
        onClose={() => setCheckStatusModalVisible(false)}
        styles={SecureDeviceScreenStyle}
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
        <View style={SecureDeviceScreenStyle.modalContainer}>
          <View style={SecureDeviceScreenStyle.modalContent}>
            <Text style={SecureDeviceScreenStyle.modalTitle}>{t("Error")}</Text>
            <Text style={SecureDeviceScreenStyle.modalMessage}>
              {modalMessage}
            </Text>
            <Button
              title={t("OK")}
              onPress={() => setErrorModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

export default SecureDeviceScreen;
