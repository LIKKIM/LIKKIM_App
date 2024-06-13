//MyColdWalletScreen.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Modal,
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
import styles, { lightTheme, darkTheme } from "../styles";
import { BlurView } from "expo-blur";
import FastImage from "react-native-fast-image";
import { BleManager } from "react-native-ble-plx";
import Constants from "expo-constants";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import i18n from "../config/i18n"; // 导入 i18n

let PermissionsAndroid;
if (Platform.OS === "android") {
  PermissionsAndroid = require("react-native").PermissionsAndroid;
}

function MyColdWalletScreen() {
  const { t, i18n } = useTranslation();

  const [currencyModalVisible, setCurrencyModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const currencies = [
    "USD",
    "EUR",
    "JPY",
    "GBP",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "SEK",
    "NZD",
  ];
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const [devices, setDevices] = useState([]);
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const restoreIdentifier = Constants.installationId;
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#E0E0E0"];
  const languages = [
    { code: "en", name: "English" },
    { code: "zh", name: "中文" },
    { code: "fr", name: "Français" },
    { code: "es", name: "Español" },
    { code: "ar", name: "العربية" },
    { code: "ja", name: "日本語" },
    { code: "ru", name: "Русский" },
    { code: "ko", name: "한국어" },
    { code: "pt", name: "Português" },
    { code: "it", name: "Italiano" },
    { code: "de", name: "Deutsch" },
  ];

  let bleManager;
  if (Platform.OS !== "web") {
    bleManager = new BleManager({ restoreStateIdentifier: restoreIdentifier });
  }

  const handleBluetoothPairing = () => {
    setModalVisible(true);
    scanDevices();
  };

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
      title: "Change Password",
      icon: "lock-outline",
      onPress: () => {
        setPasswordModalVisible(true);
      },
    },
    {
      title: "Default Currency",
      icon: "attach-money",
      onPress: () => setCurrencyModalVisible(true),
      extraIcon: "arrow-drop-down",
    },
    {
      title: "Help & Support",
      icon: "help-outline",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: "Privacy & Data",
      icon: "privacy-tip",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: "About",
      icon: "info",
      onPress: () => {
        Linking.openURL("https://www.likkim.com");
      },
    },
    {
      title: "Language",
      icon: "language",
      onPress: () => setLanguageModalVisible(true),
      extraIcon: "arrow-drop-down",
    },
    {
      title: "Dark Mode",
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
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.title}
              style={styles.settingsItem}
              onPress={option.onPress}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Icon name={option.icon} size={24} color={iconColor} />
                <Text style={[theme.settingsText, { flex: 1 }]}>
                  {option.title}
                </Text>
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
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.languageModalTitle}>
                  {t("Select Language")}
                </Text>
                <ScrollView style={styles.languageList}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language.code}
                      onPress={() => {
                        console.log("Selected language:", language.name);
                        i18n.changeLanguage(language.code); // 使用语言代码切换语言
                        setLanguageModalVisible(false);
                      }}
                    >
                      <Text style={styles.languageModalText}>
                        {language.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <TouchableOpacity
                  style={styles.languageCancelButton}
                  onPress={() => setLanguageModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Currency Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={currencyModalVisible}
            onRequestClose={() => setCurrencyModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.languageModalTitle}>Select Currency</Text>
                <ScrollView style={styles.languageList}>
                  {currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency}
                      onPress={() => {
                        console.log("Selected currency:", currency);
                        setCurrencyModalVisible(false);
                      }}
                    >
                      <Text style={styles.languageModalText}>{currency}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.languageCancelButton}
                  onPress={() => setCurrencyModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Change Password Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={passwordModalVisible}
            onRequestClose={() => setPasswordModalVisible(false)}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.languageModalTitle}>Set Password</Text>
                <Text style={styles.languageModalText}>
                  Only you can unlock your wallet
                </Text>
                <View style={{ marginVertical: 10, width: 200 }}>
                  <Text style={styles.passwordModalText}>Password</Text>
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
                  <Text style={styles.passwordModalText}>Confirm Password</Text>
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
                  style={styles.languageCancelButton}
                  onPress={() => setPasswordModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* Bluetooth Btn */}
          <View style={{ marginTop: 40 }}>
            <Text style={theme.titleText}>Bluetooth</Text>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={handleBluetoothPairing}
              >
                <Text style={styles.buttonText}>Pair with Bluetooth</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <BlurView intensity={10} style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>LOOKING FOR DEVICES</Text>
                  {isScanning ? (
                    <Text style={styles.modalSubtitle}>Scanning...</Text>
                  ) : (
                    devices.length > 0 && (
                      <FlatList
                        data={devices}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                          <Text style={styles.modalSubtitle}>
                            {item.name || "Unknown Device"}
                          </Text>
                        )}
                      />
                    )
                  )}
                  {!isScanning && devices.length === 0 && (
                    <Text style={styles.modalSubtitle}>
                      Please make sure your Cold Wallet is unlocked and
                      Bluetooth is enabled.
                    </Text>
                  )}
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
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
