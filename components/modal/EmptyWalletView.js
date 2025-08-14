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
  // 视频ref
  const videoRef = useRef(null);
  // 速率过渡定时器
  const rateTimerRef = useRef(null);

  // 点击动画：0.9 -> 1.1 -> 1
  // 平滑递增速率到2.0
  const handlePressIn = () => {
    if (rateTimerRef.current) {
      clearInterval(rateTimerRef.current);
      rateTimerRef.current = null;
    }
    let currentRate = 1.0;
    const targetRate = 1.6;
    const step = 0.2;
    const interval = 50;
    // 先设置到当前速率
    if (videoRef.current && videoRef.current.setStatusAsync) {
      videoRef.current.setStatusAsync({ rate: currentRate });
    }
    rateTimerRef.current = setInterval(() => {
      currentRate += step;
      if (currentRate >= targetRate) {
        currentRate = targetRate;
        clearInterval(rateTimerRef.current);
        rateTimerRef.current = null;
      }
      if (videoRef.current && videoRef.current.setStatusAsync) {
        videoRef.current.setStatusAsync({ rate: currentRate });
      }
    }, interval);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.97, // 缩小幅度小一点
        duration: 100, // 慢一点
        useNativeDriver: true,
      }),
    ]).start();
  };

  // 平滑递减速率到1.0
  const handlePressOut = (onDone) => {
    if (rateTimerRef.current) {
      clearInterval(rateTimerRef.current);
      rateTimerRef.current = null;
    }
    let currentRate = 2.0;
    const targetRate = 1.0;
    const step = 0.2;
    const interval = 50;
    rateTimerRef.current = setInterval(() => {
      currentRate -= step;
      if (currentRate <= targetRate) {
        currentRate = targetRate;
        clearInterval(rateTimerRef.current);
        rateTimerRef.current = null;
      }
      if (videoRef.current && videoRef.current.setStatusAsync) {
        videoRef.current.setStatusAsync({ rate: currentRate });
      }
    }, interval);

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.0,
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
          ref={videoRef}
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
