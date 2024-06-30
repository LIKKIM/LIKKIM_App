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
import { languages } from "../config/languages"; // 导入 languages

let PermissionsAndroid;
if (Platform.OS === "android") {
  PermissionsAndroid = require("react-native").PermissionsAndroid;
}

function MyColdWalletScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { currencies, currencyUnit, setCurrencyUnit } =
    useContext(CryptoContext);
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const MyColdWalletScreenStyle = MyColdWalletScreenStyles(isDarkMode);
  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
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
  const restoreIdentifier = Constants.installationId;
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];

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
        async (error, device) => {
          if (error) {
            console.error("BleManager scanning error:", error);
            if (error.errorCode === BleErrorCode.BluetoothUnsupported) {
              console.error("Bluetooth LE is unsupported on this device");
              setIsScanning(false);
              return;
            }
          } else {
            try {
              await device.connect();
              await device.discoverAllServicesAndCharacteristics();
              const services = await device.services();

              for (const service of services) {
                const characteristics = await service.characteristics();
                for (const characteristic of characteristics) {
                  // 将服务 UUID 和特征 UUID 添加到设备对象
                  if (
                    characteristic.isWritableWithResponse ||
                    characteristic.isWritableWithoutResponse
                  ) {
                    device.serviceUUID = service.uuid;
                    device.characteristicUUID = characteristic.uuid;
                    break;
                  }
                }
              }
              await device.cancelConnection();

              setDevices((prevDevices) => {
                if (!prevDevices.find((d) => d.id === device.id)) {
                  return [...prevDevices, device];
                }
                return prevDevices;
              });

              console.log("Scanned device:", device);
            } catch (connectError) {
              console.error(
                "Failed to connect and discover services:",
                connectError
              );
            }
          }
        }
      );

      setTimeout(() => {
        console.log("Scanning stopped");
        bleManagerRef.current.stopDeviceScan();
        setIsScanning(false);
      }, 3000);
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };

  useEffect(() => {
    if (!modalVisible && selectedDevice) {
      setPinModalVisible(true);
    }
  }, [modalVisible, selectedDevice]);

  const handleDevicePress = (device) => {
    setSelectedDevice(device);
    setModalVisible(false); // Close Bluetooth modal
  };

  const handlePinSubmit = () => {
    connectToDevice(selectedDevice, pinCode);
    setPinModalVisible(false);
    setPinCode("");
  };

  const connectToDevice = async (device, pinCode) => {
    try {
      await device.connect();
      console.log(`Connected to device ${device.id}`);

      const serviceUUID = device.serviceUUID;
      const characteristicUUID = device.characteristicUUID;

      if (serviceUUID && characteristicUUID) {
        await device.discoverAllServicesAndCharacteristics();
        const characteristics = await device.characteristicsForService(
          serviceUUID
        );
        const pinCharacteristic = characteristics.find(
          (c) => c.uuid === characteristicUUID
        );
        if (pinCharacteristic) {
          await pinCharacteristic.writeWithResponse(pinCode);
          console.log(`PIN code ${pinCode} sent to device ${device.id}`);
        } else {
          console.error("PIN characteristic not found");
        }
      } else {
        console.error("Service UUID or Characteristic UUID not found");
      }
    } catch (error) {
      console.error("Failed to connect to device or send PIN code:", error);
    } finally {
      await device.cancelConnection();
    }
  };

  const settingsOptions = [
    {
      title: t("Change Password"),
      icon: "lock-outline",
      onPress: () => {
        setPasswordModalVisible(true);
      },
    },
    {
      title: t("Default Currency"),
      icon: "attach-money",
      onPress: () => setCurrencyModalVisible(true),
      extraIcon: "arrow-drop-down",
      selectedOption: selectedCurrency,
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
      icon: "privacy-tip",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: t("About"),
      icon: "info",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
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
      title: t("Version"),
      icon: "info-outline",
      version: Constants.expoConfig.version, // Updated to use expoConfig
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
      <ScrollView style={MyColdWalletScreenStyle.scrollView}>
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
                  <TextInput
                    style={[
                      MyColdWalletScreenStyle.passwordInput,
                      isPasswordFocused && MyColdWalletScreenStyle.focusedInput,
                    ]}
                    placeholder={t("Enter new password")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                    secureTextEntry
                    onChangeText={setPassword}
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    value={password}
                  />
                </View>
                <View style={{ marginVertical: 10, width: "100%" }}>
                  <Text style={MyColdWalletScreenStyle.passwordModalText}>
                    {t("Confirm Password")}
                  </Text>
                  <TextInput
                    style={[
                      MyColdWalletScreenStyle.passwordInput,
                      isConfirmPasswordFocused &&
                        MyColdWalletScreenStyle.focusedInput,
                    ]}
                    placeholder={t("Confirm new password")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                    secureTextEntry
                    onChangeText={setConfirmPassword}
                    onFocus={() => setIsConfirmPasswordFocused(true)}
                    onBlur={() => setIsConfirmPasswordFocused(false)}
                    value={confirmPassword}
                  />
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
            <Text style={MyColdWalletScreenStyle.languageModalTitle}>
              {t("Bluetooth")}
            </Text>
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
              onRequestClose={() => setModalVisible(!modalVisible)}
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
                        data={devices.filter((item) => item.name)} // 仅显示具有名称的设备
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            onPress={() => handleDevicePress(item)}
                          >
                            <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                              {item.name}
                            </Text>
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
                    style={MyColdWalletScreenStyle.cancelButton}
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
            <Text style={MyColdWalletScreenStyle.pinModalTitle}>
              {t("Enter PIN to Connect")}
            </Text>
            <Text style={MyColdWalletScreenStyle.modalSubtitle}>
              {t(
                "Use the PIN code to establish a secure connection with your LIKKIM hardware."
              )}
            </Text>
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
                onPress={handlePinSubmit}
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
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
