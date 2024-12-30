// src/components/SupportPage.js
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import { View, Text } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { DarkModeContext } from "./CryptoContext";
const SupportPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation();
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF",
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
    });
  }, [isDarkMode, navigation]);
  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: t("Back"), // 设置国际化的“返回”按钮文本
    });
  }, [navigation, t]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Support Information</Text>
    </View>
  );
};

export default SupportPage;
