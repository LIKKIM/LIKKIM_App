import React from "react";
import { View, ImageBackground, TouchableOpacity, Text } from "react-native";

const EmptyWalletView = ({
  isDarkMode,
  VaultScreenStyle,
  handleContinue,
  t,
}) => {
  return (
    <View style={VaultScreenStyle.centeredContent}>
      <ImageBackground
        source={
          isDarkMode
            ? require("../../assets/AddWallet.png")
            : require("../../assets/Card22.png")
        }
        style={VaultScreenStyle.addWalletImage}
        imageStyle={VaultScreenStyle.addWalletImageBorder}
      >
        <TouchableOpacity
          onPress={handleContinue}
          style={VaultScreenStyle.addWalletButton}
        >
          <Text style={VaultScreenStyle.addWalletButtonText}>
            {t("Add Wallet")}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={VaultScreenStyle.walletInfoContainer}>
        <Text style={VaultScreenStyle.securityTitle}>
          {t("Security in your hands")}
        </Text>
      </View>
    </View>
  );
};

export default EmptyWalletView;
