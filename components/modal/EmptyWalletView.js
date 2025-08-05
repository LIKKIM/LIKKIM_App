import React from "react";
import {
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { Video } from "expo-av";

const EmptyWalletView = ({
  isDarkMode,
  VaultScreenStyle,
  handleContinue,
  handleWalletTest,
  t,
}) => {
  return (
    <View style={VaultScreenStyle.centeredContent}>
      <View style={VaultScreenStyle.addWalletImage}>
        <Video
          source={
            isDarkMode
              ? require("../../assets/darkBg.mp4")
              : require("../../assets/LightBg.mp4")
          }
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          shouldPlay
          isLooping
          muted
        />
        <TouchableOpacity
          onPress={global.__DEV__ ? handleWalletTest : handleContinue}
          style={VaultScreenStyle.addWalletButton}
        >
          <Text style={VaultScreenStyle.addWalletButtonText}>
            {t("Get Started")}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={VaultScreenStyle.walletInfoContainer}>
        <Text style={VaultScreenStyle.securityTitle}>
          {t("Security in your hands")}
        </Text>
      </View>
    </View>
  );
};

export default EmptyWalletView;
