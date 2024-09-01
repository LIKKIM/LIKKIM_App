import React from "react";
import { View, ImageBackground, TouchableOpacity, Text } from "react-native";

const EmptyWalletView = ({
  isDarkMode,
  WalletScreenStyle,
  setAddWalletModalVisible,
  t,
}) => {
  return (
    <View style={WalletScreenStyle.centeredContent}>
      <ImageBackground
        source={
          isDarkMode
            ? require("../../assets/AddWallet.png")
            : require("../../assets/Card22.png")
        }
        style={WalletScreenStyle.addWalletImage}
        imageStyle={WalletScreenStyle.addWalletImageBorder}
      >
        <TouchableOpacity
          onPress={() => setAddWalletModalVisible(true)}
          style={WalletScreenStyle.addWalletButton}
        >
          <Text style={WalletScreenStyle.addWalletButtonText}>
            {t("Add Wallet")}
          </Text>
        </TouchableOpacity>
      </ImageBackground>
      <View style={WalletScreenStyle.walletInfoContainer}>
        <Text style={WalletScreenStyle.securityTitle}>
          {t("Security in your hands")}
        </Text>
        <Text style={WalletScreenStyle.walletInfoText}>
          {t(
            "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies."
          )}
        </Text>
      </View>
    </View>
  );
};

export default EmptyWalletView;
