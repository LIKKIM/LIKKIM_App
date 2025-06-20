// settingsOptions.js
import React from "react";
import { Vibration, Switch, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import appConfig from "../../app.config";
import { externalLinks } from "../../env/apiEndpoints";

const getSettingsOptions = ({
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
}) => {
  // Helper function to persist the screen lock setting
  const persistScreenLockSetting = (newValue) => {
    AsyncStorage.setItem("screenLockFeatureEnabled", JSON.stringify(newValue))
      .then(() => {
        console.log("Persisted screenLockFeatureEnabled:", newValue);
      })
      .catch((error) =>
        console.error("Failed to persist screenLockFeatureEnabled", error)
      );
  };

  // Toggle handler for Screen Lock option
  const toggleScreenLock = () => {
    const newValue = !isScreenLockEnabled;
    Vibration.vibrate();
    handleScreenLockToggle(newValue);
    //  persistScreenLockSetting(newValue);
  };

  return {
    settings: [
      ...(cryptoCards && cryptoCards.length > 0
        ? [
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
          ]
        : []),
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
      ...(cryptoCards && cryptoCards.length > 0
        ? [
            {
              title: t("Address Book"),
              icon: "portrait",
              onPress: () => {
                Vibration.vibrate();
                setAddressBookModalVisible(true);
              },
            },
          ]
        : []),
      ...(cryptoCards && cryptoCards.length > 0
        ? [
            {
              title: t("Enable Screen Lock"),
              icon: "lock-outline",
              onPress: () => {
                Vibration.vibrate();
                toggleScreenLock();
              },
              toggle: (
                <Switch
                  trackColor={{ false: "#767577", true: toggleColor }}
                  thumbColor={isScreenLockEnabled ? "#fff" : "#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={() => {
                    Vibration.vibrate();
                    toggleScreenLock();
                  }}
                  value={isScreenLockEnabled}
                />
              ),
            },
          ]
        : []),
      ...(isScreenLockEnabled
        ? [
            {
              title: t("Change App Screen Lock Password"),
              icon: "password",
              onPress: () => {
                Vibration.vibrate();
                openChangeLockCodeModal();
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

      ...(cryptoCards && cryptoCards.length > 0
        ? [
            {
              title: t("Secure Device Status"),
              icon: "location-on",
              onPress: () => {
                Vibration.vibrate();
                navigation.navigate("Secure Device Status");
              },
            },
          ]
        : []),
      ,
      {
        title: t("Firmware Update"),
        icon: "downloading",
        onPress: () => {
          Vibration.vibrate();
          handleFirmwareUpdate({
            selectedDevice,
            t,
            setModalMessage,
            setErrorModalVisible,
            serviceUUID,
            writeCharacteristicUUID,
          });
        },
      },
    ],
    walletManagement:
      cryptoCards && cryptoCards.length > 0
        ? [
            {
              title: t("Device Settings"),
              icon: "wallet",
              extraIcon: isDeleteWalletVisible
                ? "arrow-drop-up"
                : "arrow-drop-down",
              onPress: toggleDeleteWalletVisibility,
            },
            isDeleteWalletVisible && {
              title: t("Reset Local Profile"),
              icon: "delete-outline",
              onPress: () => {
                Vibration.vibrate();
                handleDeleteWallet();
              },
              style: { color: "red" },
            },
          ].filter(Boolean) // 过滤掉 false 值，防止渲染出 null 项
        : [],

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
          Linking.openURL(externalLinks.privacyPolicy);
        },
      },
      {
        title: t("About"),
        icon: "info-outline",
        onPress: () => {
          Vibration.vibrate();
          Linking.openURL(externalLinks.aboutPage);
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
};

export default getSettingsOptions;
