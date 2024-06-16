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
import { BleManager } from "react-native-ble-plx";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import MyColdWalletScreenStyles from "../styles/MyColdWalletScreenStyle";

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
  const [selectedCurrency, setSelectedCurrency] = useState(currencyUnit); // 使用 currencyUnit 初始化
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [modalVisible, setModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [devices, setDevices] = useState([]);
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const restoreIdentifier = Constants.installationId;
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#E0E0E0"];
  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "简体中文" },
    { code: "zh-TW", name: "繁體中文" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "ar", name: "العربية" },
    { code: "ja", name: "日本語" },
    { code: "ru", name: "Русский" },
    { code: "ko", name: "한국어" },
    { code: "pt", name: "Português" },
    { code: "pt-BR", name: "Português (Brasil)" },
    { code: "it", name: "Italiano" },
    { code: "de", name: "Deutsch" },
    { code: "hi", name: "हिन्दी" },
    { code: "mn", name: "Монгол хэл" },
    { code: "th", name: "ไทย" },
    { code: "uk", name: "Українська" },
    { code: "vi", name: "Tiếng Việt" },
    { code: "id", name: "Bahasa Indonesia" },
    { code: "tl", name: "Filipino" },
    { code: "bn", name: "বাংলা" },
  ];

  let bleManager;
  if (Platform.OS !== "web") {
    bleManager = new BleManager({ restoreStateIdentifier: restoreIdentifier });
  }

  const handleBluetoothPairing = () => {
    setModalVisible(true);
    scanDevices();
  };

  const handleCurrencyChange = (currency) => {
    console.log("Selected currency:", currency);
    setSelectedCurrency(currency.shortName);
    setCurrencyUnit(currency.shortName); // 确保使用 currency.shortName
    setCurrencyModalVisible(false);
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: t("My Cold Wallet"),
    });
  }, [t, navigation]);

  useEffect(() => {
    let subscription;
    if (Platform.OS !== "web") {
      subscription = bleManager.onStateChange((state) => {
        if (state === "PoweredOn") {
          scanDevices();
        } else if (state === "Unknown") {
          console.warn("Bluetooth state is unknown");
        }
      }, true);
    }
    return () => {
      if (subscription) {
        subscription.remove();
      }
      bleManager.destroy();
    };
  }, [bleManager]);

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      console.log("Scanning started");
      setIsScanning(true);
      const scanOptions = { allowDuplicates: true };
      const scanFilter = null;

      bleManager.startDeviceScan(scanFilter, scanOptions, (error, device) => {
        if (error) {
          console.error("BleManager scanning error:", error);
          setIsScanning(false);
          return;
        }
        setDevices((prevDevices) => {
          if (!prevDevices.find((d) => d.id === device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
        console.log("Scanned device:", device);
      });

      setTimeout(() => {
        console.log("Scanning stopped");
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 90000);
    } else {
      console.log("Attempt to scan while already scanning");
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
      selectedOption: selectedCurrency, // 更新选中货币
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
      selectedOption: languages.find((lang) => lang.code === selectedLanguage)
        .name,
    },
    {
      title: t("Dark Mode"),
      icon: "dark-mode",
      onPress: () => setIsDarkMode(!isDarkMode),
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsDarkMode(!isDarkMode)}
          value={isDarkMode}
        />
      ),
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
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Icon name={option.icon} size={24} color={iconColor} />
                <Text style={[MyColdWalletScreenStyle.buttonText, { flex: 1 }]}>
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
                      onPress={() => {
                        console.log("Selected language:", language.name);
                        setSelectedLanguage(language.code);
                        i18n.changeLanguage(language.code);
                        setLanguageModalVisible(false);
                      }}
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
                <Text style={MyColdWalletScreenStyle.languageModalTitle}>
                  {t("Set Password")}
                </Text>
                <Text style={MyColdWalletScreenStyle.languageModalText}>
                  {t("Only you can unlock your wallet")}
                </Text>
                <View style={{ marginVertical: 10, width: 200 }}>
                  <Text style={MyColdWalletScreenStyle.passwordModalText}>
                    {t("Password")}
                  </Text>
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#1A1A37",
                        borderRadius: 10,
                        padding: 10,
                      },
                      isPasswordFocused && {
                        borderColor: "blue",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <TextInput
                      style={{ flex: 1, color: "#fff" }}
                      secureTextEntry={isPasswordHidden}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setIsPasswordFocused(true)}
                      onBlur={() => setIsPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      onPress={() => setIsPasswordHidden(!isPasswordHidden)}
                    >
                      <Icon
                        name={
                          isPasswordHidden ? "visibility-off" : "visibility"
                        }
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ marginVertical: 10, width: 200 }}>
                  <Text style={MyColdWalletScreenStyle.passwordModalText}>
                    {t("Confirm Password")}
                  </Text>
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#1A1A37",
                        borderRadius: 10,
                        padding: 10,
                      },
                      isConfirmPasswordFocused && {
                        borderColor: "blue",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <TextInput
                      style={{ flex: 1, color: "#fff" }}
                      secureTextEntry={isConfirmPasswordHidden}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      onFocus={() => setIsConfirmPasswordFocused(true)}
                      onBlur={() => setIsConfirmPasswordFocused(false)}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
                      }
                    >
                      <Icon
                        name={
                          isConfirmPasswordHidden
                            ? "visibility-off"
                            : "visibility"
                        }
                        size={24}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={MyColdWalletScreenStyle.languageCancelButton}
                  onPress={() => setPasswordModalVisible(false)}
                >
                  <Text style={MyColdWalletScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Modal>

          {/* Bluetooth Btn */}
          <View style={{ marginTop: 40 }}>
            <Text style={MyColdWalletScreenStyle.languageModalTitle}>
              {t("Bluetooth")}
            </Text>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={MyColdWalletScreenStyle.roundButton}
                onPress={handleBluetoothPairing}
              >
                <Text style={MyColdWalletScreenStyle.buttonText}>
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
                <View style={MyColdWalletScreenStyle.modalView}>
                  <Text style={MyColdWalletScreenStyle.modalTitle}>
                    {t("LOOKING FOR DEVICES")}
                  </Text>
                  {isScanning ? (
                    <View
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Image
                        source={require("../assets/Bluetooth.gif")}
                        style={{
                          width: 100,
                          height: 100,
                        }}
                      />
                      <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                        {t("Scanning...")}
                      </Text>
                    </View>
                  ) : (
                    devices.length > 0 && (
                      <FlatList
                        data={devices}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                            {item.name || t("Unknown Device")}
                          </Text>
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
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
