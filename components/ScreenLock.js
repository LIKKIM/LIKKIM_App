import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  Image,
} from "react-native";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import { useTranslation } from "react-i18next"; // 导入国际化库
import Icon from "react-native-vector-icons/MaterialIcons"; // 导入图标库
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScreenLock = () => {
  const { screenLockPassword, setIsAppLaunching } = useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const [inputPassword, setInputPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isFocused, setIsFocused] = useState(false); // 跟踪输入框是否聚焦
  const [modalVisible, setModalVisible] = useState(false); // 用于显示丢失密码的 Modal
  const [errorModalVisible, setErrorModalVisible] = useState(false); // 用于显示错误信息的 Modal
  const [faceIDEnabled, setFaceIDEnabled] = useState(false); // 用于跟踪是否启用FaceID
  const { t } = useTranslation();

  useEffect(() => {
    AsyncStorage.getItem("faceID").then((status) => {
      if (status === "open") {
        setFaceIDEnabled(true);
      }
    });
  }, []);

  const handleUnlock = () => {
    if (inputPassword === screenLockPassword) {
      setIsAppLaunching(false);
    } else {
      setErrorModalVisible(true); // 显示错误 Modal
    }
  };

  const handleFaceIDIconPress = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t("Unlock with Face ID"), // 提示信息
    });

    if (result.success) {
      setIsAppLaunching(false);
    } else {
      console.log("Face ID 认证失败");
      // 处理认证失败的情况，例如显示错误信息
    }
  };

  const handleLostPassword = () => {
    setModalVisible(true); // 显示丢失密码的 Modal
  };

  const handleCloseModal = () => {
    setModalVisible(false); // 关闭丢失密码的 Modal
  };

  const handleCloseErrorModal = () => {
    setErrorModalVisible(false); // 关闭错误 Modal
  };

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  useEffect(() => {
    if (Platform.OS === "ios" || Platform.OS === "macos") {
      AsyncStorage.getItem("faceID").then((status) => {
        if (status === "open") {
          LocalAuthentication.authenticateAsync({}).then((res) => {
            if (res.success) {
              setIsAppLaunching(false); //解锁后设置 isAppLaunching 为 false
            }
          });
        }
      });
    }
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.container, themeStyles.container]}>
        <View style={styles.header}>
          <Image
            source={require("../assets/Logo@500.png")}
            style={{ width: 50, height: 50, marginBottom: 20 }}
          />
          <Text style={[styles.title, themeStyles.title]}>{t("LIKKIM")}</Text>
          <Text style={[styles.subTitle, themeStyles.subTitle]}>
            {t("Enter Password to Unlock")}
          </Text>
        </View>

        <View style={styles.passwordInputContainer}>
          <TextInput
            style={[styles.input, themeStyles.input]}
            secureTextEntry={isPasswordHidden}
            value={inputPassword}
            onChangeText={setInputPassword}
            placeholder={t("Enter Password")}
            placeholderTextColor={themeStyles.placeholder.color}
            onFocus={() => setIsFocused(true)} // 输入框获取焦点时
            onBlur={() => setIsFocused(false)} // 输入框失去焦点时
          />
          <TouchableOpacity
            onPress={
              isFocused
                ? () => setIsPasswordHidden(!isPasswordHidden)
                : handleFaceIDIconPress
            }
            style={styles.eyeIcon}
          >
            <Icon
              name={
                isFocused || !faceIDEnabled
                  ? isPasswordHidden
                    ? "visibility-off"
                    : "visibility"
                  : "face"
              }
              size={24}
              color={themeStyles.placeholder.color}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, themeStyles.button]}
          onPress={handleUnlock}
        >
          <Text style={themeStyles.buttonText}>{t("Unlock")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLostPassword}
          style={styles.lostPasswordContainer}
        >
          <Text style={[styles.lostPasswordText, themeStyles.lostPasswordText]}>
            {t("I lost my password")}
          </Text>
        </TouchableOpacity>

        {/* 丢失密码的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalBackground}>
            <View style={[styles.modalView, themeStyles.modalView]}>
              <Text style={[styles.modalTitle, themeStyles.modalTitle]}>
                {t("I lost my password")}
              </Text>
              <Text style={[styles.modalText, themeStyles.modalText]}>
                {t(
                  "Please uninstall then reinstall the app on your phone to delete LIKKIM app data, including accounts and settings."
                )}
              </Text>
              <TouchableOpacity
                style={[styles.closeButton, themeStyles.closeButton]}
                onPress={handleCloseModal}
              >
                <Text style={themeStyles.buttonText}>{t("OK")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* 密码错误的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible}
          onRequestClose={handleCloseErrorModal}
        >
          <View style={styles.modalBackground}>
            <View style={[styles.modalView, themeStyles.modalView]}>
              <Text style={[styles.modalTitle, themeStyles.modalTitle]}>
                {t("Incorrect Password")}
              </Text>
              <Text style={[styles.modalText, themeStyles.modalText]}>
                {t("Please try again.")}
              </Text>
              <TouchableOpacity
                style={[styles.closeButton, themeStyles.closeButton]}
                onPress={handleCloseErrorModal}
              >
                <Text style={themeStyles.buttonText}>{t("OK")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
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
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 50,
    marginBottom: 20,
    fontSize: 18,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: 25,
    transform: [{ translateY: -12 }],
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  lostPasswordContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  lostPasswordText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "80%", // Optional: Adjust modal width if needed
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  title: {
    color: "#333",
  },
  subTitle: {
    color: "#999",
  },
  input: {
    color: "#000",
    backgroundColor: "#f1f1f1",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#CFAB95",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  lostPasswordText: {
    color: "#CFAB95",
  },
  modalView: {
    backgroundColor: "#fff",
  },
  modalTitle: {
    color: "#333",
  },
  modalText: {
    color: "#666",
  },
  closeButton: {
    backgroundColor: "#CFAB95",
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#24234C",
  },
  title: {
    color: "#f5f5f5",
  },
  subTitle: {
    color: "#ccc",
  },
  input: {
    color: "#fff",
    backgroundColor: "#1A1A37",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#CCB68C",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  lostPasswordText: {
    color: "#CCB68C",
  },
  modalView: {
    backgroundColor: "#2A2A48",
  },
  modalTitle: {
    color: "#f5f5f5",
  },
  modalText: {
    color: "#ccc",
  },
  closeButton: {
    backgroundColor: "#CCB68C",
  },
});

export default ScreenLock;
