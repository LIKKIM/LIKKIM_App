// ScreenLock.js
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
import Icon from "react-native-vector-icons/MaterialIcons"; // 导入图标库

const ScreenLock = () => {
  const { screenLockPassword, setIsAppLaunching } = useContext(CryptoContext); // 使用 setIsAppLaunching
  const { isDarkMode } = useContext(DarkModeContext);
  const [inputPassword, setInputPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true); // 用于控制密码的可见性
  const { t } = useTranslation(); // 使用国际化 hook

  const handleUnlock = () => {
    if (inputPassword === screenLockPassword) {
      setIsAppLaunching(false); // 解锁后设置 isAppLaunching 为 false
    } else {
      Alert.alert(t("Incorrect Password"), t("Please try again.")); // 国际化提示
    }
  };

  const handleLostPassword = () => {
    Alert.alert(
      t("I lost my password"),
      t(
        "Please uninstall then reinstall the app on your phone to delete LIKKIM app data, including accounts and settings."
      )
    );
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

          {/* 密码输入框和小眼睛图标 */}
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={[styles.input, themeStyles.input]}
              secureTextEntry={isPasswordHidden} // 根据状态控制密码是否隐藏
              value={inputPassword}
              onChangeText={setInputPassword}
              placeholder={t("Enter Password")}
              placeholderTextColor={themeStyles.placeholder.color}
            />
            <TouchableOpacity
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              style={styles.eyeIcon}
            >
              <Icon
                name={isPasswordHidden ? "visibility-off" : "visibility"}
                size={24}
                color={themeStyles.placeholder.color}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, themeStyles.button]} // 圆角按钮样式
            onPress={handleUnlock}
          >
            <Text style={themeStyles.buttonText}>{t("Unlock")}</Text>
          </TouchableOpacity>

          {/* "I lost my password" 文本 */}
          <TouchableOpacity
            onPress={handleLostPassword}
            style={styles.lostPasswordContainer}
          >
            <Text
              style={[styles.lostPasswordText, themeStyles.lostPasswordText]}
            >
              {t("I lost my password")}
            </Text>
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
    height: 50, // 确保输入框的高度一致
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 50, // 给右侧的小眼睛图标留出空间
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
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15, // 确保图标靠近输入框的右边缘
    top: "50%", // 垂直居中
    transform: [{ translateY: -22 }], // 偏移量为图标高度的一半，调整为适合的值
    alignItems: "center",
    justifyContent: "center",
  },
  lostPasswordContainer: {
    marginTop: 30, // 调整这个值来确定文本的位置
    alignItems: "center",
  },
  lostPasswordText: {
    fontSize: 16,
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
  lostPasswordText: {
    color: "#8E80F0", // 你可以调整这个颜色
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
  lostPasswordText: {
    color: "#6C6CF4", // 你可以调整这个颜色
  },
});

export default ScreenLock;
