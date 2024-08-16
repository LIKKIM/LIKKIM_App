import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import { useTranslation } from "react-i18next"; // 导入国际化库

const ScreenLock = () => {
  const { screenLockPassword, setIsScreenLockEnabled } =
    useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [inputPassword, setInputPassword] = useState("");
  const { t } = useTranslation(); // 使用国际化 hook

  const handleUnlock = () => {
    if (inputPassword === screenLockPassword) {
      setIsScreenLockEnabled(false); // 解锁后设置 isScreenLocked 为 false
    } else {
      Alert.alert(t("Incorrect Password"), t("Please try again.")); // 国际化提示
    }
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={[styles.container, themeStyles.container]}>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <Text style={[styles.title, themeStyles.title]}>{t("LIKKIM")}</Text>
            <Text style={[styles.subTitle, themeStyles.subTitle]}>
              {t("Enter Password to Unlock")}
            </Text>
          </View>
          <TextInput
            style={[styles.input, themeStyles.input]}
            secureTextEntry
            value={inputPassword}
            onChangeText={setInputPassword}
            placeholder={t("Enter Password")}
            placeholderTextColor={themeStyles.placeholder.color}
          />
          <TouchableOpacity
            style={[styles.button, themeStyles.button]} // 圆角按钮样式
            onPress={handleUnlock}
          >
            <Text style={themeStyles.buttonText}>{t("Unlock")}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25, // 设置圆角
  },
});

const lightStyles = StyleSheet.create({
  subTitle: {
    color: "#999",
  },
  container: {
    backgroundColor: "#fff",
  },
  title: {
    color: "#333",
  },
  input: {
    color: "#000",
    backgroundColor: "#f1f1f1",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#8E80F0",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

const darkStyles = StyleSheet.create({
  subTitle: {
    color: "#ccc",
  },
  container: {
    backgroundColor: "#24234C",
  },
  title: {
    color: "#f5f5f5",
  },
  input: {
    color: "#fff",
    backgroundColor: "#1A1A37",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#6C6CF4",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScreenLock;
