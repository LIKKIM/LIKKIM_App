import React from "react";
import { View, ImageBackground, TouchableOpacity, Text } from "react-native";

const EmptyWalletView = ({
  isDarkMode,
  VaultScreenStyle,
  handleContinue,
  handleWalletTest,
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
          //   onPress={handleContinue}
          onPress={handleWalletTest} //      {/*  测试按钮test btn  */}
          style={VaultScreenStyle.addWalletButton}
        >
          <Text style={VaultScreenStyle.addWalletButtonText}>
            {t("Get Started")}
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
