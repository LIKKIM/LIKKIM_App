import React, { useRef } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Animated,
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
  // 动画值
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // 点击动画：0.9 -> 1.1 -> 1
  const handlePressIn = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95, // 缩小幅度小一点
        duration: 200, // 慢一点
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = (onDone) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDone && onDone(); // 动画结束后再执行
    });
  };

  return (
    <View style={VaultScreenStyle.centeredContent}>
      <Animated.View
        style={[
          VaultScreenStyle.addWalletImage,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
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
          onPressOut={() => {
            handlePressOut(() => {
              if (global.__DEV__) {
                handleWalletTest && handleWalletTest();
              } else {
                handleContinue && handleContinue();
              }
            });
          }}
          onPressIn={handlePressIn}
          style={VaultScreenStyle.addWalletButton}
          activeOpacity={0.8}
        >
          <Text style={VaultScreenStyle.addWalletButtonText}>
            {t("Get Started")}
          </Text>
        </TouchableOpacity>
      </Animated.View>
      <View style={VaultScreenStyle.walletInfoContainer}>
        <Text style={VaultScreenStyle.securityTitle}>
          {t("Security in your hands")}
        </Text>
      </View>
    </View>
  );
};

export default EmptyWalletView;
