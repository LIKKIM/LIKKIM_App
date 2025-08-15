import React, { useState, useContext, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Modal,
  Image,
  Platform,
} from "react-native";
import {
  screenLockStyles,
  screenLockLightStyles,
  screenLockDarkStyles,
} from "../styles/styles";
import { DeviceContext, DarkModeContext } from "../utils/DeviceContext";
import { useTranslation } from "react-i18next";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import * as LocalAuthentication from "expo-local-authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { Animated } from "react-native";
const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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

  // 动画相关
  const lostModalIntensityAnim = useRef(new Animated.Value(0)).current;
  const errorModalIntensityAnim = useRef(new Animated.Value(0)).current;

  // Lost Password Modal 动画
  useEffect(() => {
    if (modalVisible) {
      Animated.sequence([
        Animated.timing(lostModalIntensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(lostModalIntensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.timing(lostModalIntensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [modalVisible]);

  // Error Modal 动画
  useEffect(() => {
    if (errorModalVisible) {
      Animated.sequence([
        Animated.timing(errorModalIntensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(errorModalIntensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.timing(errorModalIntensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [errorModalVisible]);

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

  const themeStyles = isDarkMode ? screenLockDarkStyles : screenLockLightStyles;

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
      <View style={[screenLockStyles.container, themeStyles.container]}>
        <View style={screenLockStyles.header}>
          <Image
            source={require("../assets/Logo@500.png")}
            style={{ width: 50, height: 50, marginBottom: 20 }}
          />
          <Text style={[screenLockStyles.title, themeStyles.title]}>
            {t("LUKKEY")}
          </Text>
          <Text style={[screenLockStyles.subTitle, themeStyles.subTitle]}>
            {t("Enter Password to Unlock")}
          </Text>
        </View>

        <View style={screenLockStyles.passwordInputContainer}>
          <TextInput
            style={[screenLockStyles.input, themeStyles.input]}
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
            style={screenLockStyles.eyeIcon}
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
          style={[screenLockStyles.button, themeStyles.button]}
          onPress={handleUnlock}
        >
          <Text style={themeStyles.buttonText}>{t("Unlock")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleLostPassword}
          style={screenLockStyles.lostPasswordContainer}
        >
          <Text
            style={[
              screenLockStyles.lostPasswordText,
              themeStyles.lostPasswordText,
            ]}
          >
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
          <AnimatedBlurView
            intensity={lostModalIntensityAnim}
            style={screenLockStyles.modalBackground}
          >
            <View style={[screenLockStyles.modalView, themeStyles.modalView]}>
              <Text
                style={[screenLockStyles.modalTitle, themeStyles.modalTitle]}
              >
                {t("I lost my password")}
              </Text>
              <Text style={[screenLockStyles.modalText, themeStyles.modalText]}>
                {t(
                  "To reset the app and remove stored data, please uninstall and reinstall it on your phone."
                )}
              </Text>
              <TouchableOpacity
                style={[screenLockStyles.closeButton, themeStyles.closeButton]}
                onPress={handleCloseModal}
              >
                <Text style={themeStyles.buttonText}>{t("OK")}</Text>
              </TouchableOpacity>
            </View>
          </AnimatedBlurView>
        </Modal>

        {/* Incorrect Password Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={errorModalVisible}
          onRequestClose={handleCloseErrorModal}
        >
          <AnimatedBlurView
            intensity={errorModalIntensityAnim}
            style={screenLockStyles.modalBackground}
          >
            <View style={[screenLockStyles.modalView, themeStyles.modalView]}>
              <Text
                style={[screenLockStyles.modalTitle, themeStyles.modalTitle]}
              >
                {t("Incorrect Password")}
              </Text>
              <Text style={[screenLockStyles.modalText, themeStyles.modalText]}>
                {t("Please try again.")}
              </Text>
              <TouchableOpacity
                style={[screenLockStyles.closeButton, themeStyles.closeButton]}
                onPress={handleCloseErrorModal}
              >
                <Text style={themeStyles.buttonText}>{t("OK")}</Text>
              </TouchableOpacity>
            </View>
          </AnimatedBlurView>
        </Modal>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ScreenLock;
