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
  openChangePasswordModal,
  toggleFaceID,
  isFaceIDEnabled,
  handleFirmwareUpdate,
  isDeleteWalletVisible,
  toggleDeleteWalletVisibility,
  handleDeleteWallet,
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
    persistScreenLockSetting(newValue);
  };

  return {
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
