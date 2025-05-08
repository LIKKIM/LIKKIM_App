import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Modal,
  Image,
  Platform,
} from "react-native";
import { DeviceContext, DarkModeContext } from "../utils/DeviceContext";
import { useTranslation } from "react-i18next";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ScreenLock = () => {
  const { screenLockPassword, setIsAppLaunching } = useContext(DeviceContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation();

  const [inputPassword, setInputPassword] = useState("");
  const [isPasswordHidden, setIsPasswordHidden] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [faceIDEnabled, setFaceIDEnabled] = useState(false);

  // Check Face ID status on mount
  useEffect(() => {
    AsyncStorage.getItem("faceID").then((status) => {
      if (status === "open") {
        setFaceIDEnabled(true);
      }
    });
  }, []);

  // Attempt to unlock with password
  const handleUnlock = () => {
    if (inputPassword === screenLockPassword) {
      setIsAppLaunching(false);
    } else {
      setErrorModalVisible(true);
    }
  };

  // Attempt to unlock using Face ID
  const handleFaceIDIconPress = async () => {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: t("Unlock with Face ID"),
    });
    if (result.success) {
      setIsAppLaunching(false);
    } else {
      console.log("Face ID authentication failed");
    }
  };

  const handleLostPassword = () => setModalVisible(true);
  const handleCloseModal = () => setModalVisible(false);
  const handleCloseErrorModal = () => setErrorModalVisible(false);

  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  // Automatically trigger Face ID on iOS/macOS if enabled
  useEffect(() => {
    if (Platform.OS === "ios" || Platform.OS === "macos") {
      AsyncStorage.getItem("faceID").then((status) => {
        if (status === "open") {
          LocalAuthentication.authenticateAsync({}).then((res) => {
            if (res.success) {
              setIsAppLaunching(false);
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
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

        {/* Lost Password Modal */}
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

        {/* Incorrect Password Modal */}
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
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    width: "80%",
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
    backgroundColor: "#21201E",
  },
  title: {
    color: "#f5f5f5",
  },
  subTitle: {
    color: "#ccc",
  },
  input: {
    color: "#fff",
    backgroundColor: "#121212",
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
    backgroundColor: "#21201E",
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
