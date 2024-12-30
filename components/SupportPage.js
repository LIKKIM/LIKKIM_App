import React, { useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { DarkModeContext } from "./CryptoContext";
import Icon from "react-native-vector-icons/MaterialIcons";

const SupportPage = () => {
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const { t } = useTranslation();

  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const borderColor = isDarkMode ? "#3C3C3C" : "#EDEBEF"; // Adjusted for dark/light mode

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF",
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
      headerBackTitle: t("Back"),
    });
  }, [isDarkMode, navigation, t]);

  const socialMediaLinks = [
    { name: "Twitter", icon: "chat", url: "https://x.com/LIKKIMwallet" },
    { name: "Telegram", icon: "send", url: "https://t.me/+VQMQoKWz0s5lNGZl" },
    { name: "Discord", icon: "group", url: "https://discord.gg/W8Dz52BF" },
    {
      name: "Reddit",
      icon: "whatshot",
      url: "https://www.reddit.com/user/Ok_Bass_6829/",
    },
    { name: "Instagram", icon: "camera-alt", url: "https://www.instagram.com" },
    {
      name: "Facebook",
      icon: "thumb-up",
      url: "https://www.facebook.com/profile.php?id=61570753106156",
    },
    { name: "LinkedIn", icon: "work", url: "https://www.linkedin.com" },
    {
      name: "YouTube",
      icon: "video-library",
      url: "https://www.youtube.com/@LukkeyAG",
    },
  ];

  return (
    <LinearGradient
      style={styles.container}
      colors={isDarkMode ? darkColors : lightColors}
    >
      {socialMediaLinks.map((link, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.settingsItem, { borderBottomColor: borderColor }]}
          onPress={() => Linking.openURL(link.url)}
        >
          <Icon
            name={link.icon}
            size={24}
            color={isDarkMode ? "#FFFFFF" : "#000000"}
          />
          <Text
            style={[
              styles.linkText,
              { color: isDarkMode ? "#FFFFFF" : "#000000" },
            ]}
          >
            {link.name}
          </Text>
        </TouchableOpacity>
      ))}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 10, // 顶部 padding
    paddingLeft: 20, // 左侧 padding
    paddingRight: 20, // 右侧 padding
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    width: "100%", // Ensure full width for alignment
    paddingHorizontal: 20, // Padding for aesthetic spacing
  },
  linkText: {
    marginLeft: 20,
    fontSize: 18,
  },
});

export default SupportPage;
