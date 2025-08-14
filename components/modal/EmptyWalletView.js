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
      <View style={VaultScreenStyle.walletInfoContainer}>
        <Text style={VaultScreenStyle.securityTitle}>
          {t("Security in your hands")}
        </Text>
      </View>
    </View>
  );
};

export default EmptyWalletView;
