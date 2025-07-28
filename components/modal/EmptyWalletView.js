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
      {isDarkMode ? (
        <ImageBackground
          source={require("../../assets/AddWallet.png")}
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
      ) : (
        <View style={VaultScreenStyle.addWalletImage}>
          <Video
            source={require("../../assets/LightBg.mp4")}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
            shouldPlay
            isLooping
            muted
          />
          <TouchableOpacity
            //   onPress={handleContinue}
            onPress={handleWalletTest} //      {/*  测试按钮test btn  */}
            style={VaultScreenStyle.addWalletButton}
          >
            <Text style={VaultScreenStyle.addWalletButtonText}>
              {t("Get Started")}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={VaultScreenStyle.walletInfoContainer}>
        <Text style={VaultScreenStyle.securityTitle}>
          {t("Security in your hands")}
        </Text>
      </View>
    </View>
  );
};

export default EmptyWalletView;
