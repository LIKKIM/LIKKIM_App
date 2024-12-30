import React, { useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
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
  const borderColor = isDarkMode ? "#3C3C3C" : "#EDEBEF";

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
    {
      name: "Twitter",
      icon: isDarkMode
        ? require("../assets/icon/Twitter.png")
        : require("../assets/icon/TwitterDark.png"),
      url: "https://x.com/LIKKIMwallet",
    },
    {
      name: "Telegram",
      icon: isDarkMode
        ? require("../assets/icon/Telegram.png")
        : require("../assets/icon/TelegramDark.png"),
      url: "https://t.me/+VQMQoKWz0s5lNGZl",
    },
    {
      name: "Discord",
      icon: isDarkMode
        ? require("../assets/icon/Discord.png")
        : require("../assets/icon/DiscordDark.png"),
      url: "https://discord.gg/W8Dz52BF",
    },
    {
      name: "Reddit",
      icon: isDarkMode
        ? require("../assets/icon/Reddit.png")
        : require("../assets/icon/RedditDark.png"),
      url: "https://www.reddit.com/user/Ok_Bass_6829/",
    },
    {
      name: "Facebook",
      icon: isDarkMode
        ? require("../assets/icon/Facebook.png")
        : require("../assets/icon/FacebookDark.png"),
      url: "https://www.facebook.com/profile.php?id=61570753106156",
    },
    {
      name: "YouTube",
      icon: isDarkMode
        ? require("../assets/icon/Youtube.png")
        : require("../assets/icon/YoutubeDark.png"),
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
          <Image
            source={link.icon}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
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
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    width: "100%",
    paddingHorizontal: 20,
  },
  linkText: {
    marginLeft: 20,
    fontSize: 18,
  },
});

export default SupportPage;
