// src/components/SupportPage.js
import React, { useContext, useLayoutEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { DarkModeContext } from "./CryptoContext";

const SupportPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF",
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
      headerBackTitle: t("Back"),
    });
  }, [isDarkMode, navigation, t]);

  return (
    <LinearGradient
      style={styles.container}
      colors={isDarkMode ? darkColors : lightColors}
    ></LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default SupportPage;
