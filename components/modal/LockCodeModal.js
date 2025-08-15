// modal/LockCodeModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

function LockCodeModal({
  visible,
  onClose,
  onSubmit,
  isDarkMode,
  styles,
  t,
  LockCodeModalVisible,
  closeLockCodeModal,
  handleSetPassword,
  password,
  setPassword,
  passwordError,
  setPasswordError,
  confirmPassword,
  setConfirmPassword,
  isPasswordHidden,
  setIsPasswordHidden,
  isConfirmPasswordHidden,
  setIsConfirmPasswordHidden,
}) {
  const [showModal, setShowModal] = useState(visible);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(intensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (showModal) {
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        setShowModal(false);
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={showModal}
      onRequestClose={onClose}
    >
      <AnimatedBlurView intensity={intensityAnim} style={styles.centeredView}>
        <View style={styles.enableLockModalView}>
          <Text style={styles.LockCodeModalTitle}>
            {t("Enable Screen Lock")}
          </Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={t("Enter new password")}
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              secureTextEntry={isPasswordHidden}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              value={password}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              style={styles.eyeIcon}
            >
              <Icon
                name={isPasswordHidden ? "visibility-off" : "visibility"}
                size={24}
                color={isDarkMode ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={t("Confirm new password")}
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              secureTextEntry={isConfirmPasswordHidden}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
              }
              style={styles.eyeIcon}
            >
              <Icon
                name={isConfirmPasswordHidden ? "visibility-off" : "visibility"}
                size={24}
                color={isDarkMode ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {passwordError && (
            <Text style={[styles.errorText, { marginLeft: 10 }]}>
              {passwordError}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSetPassword}
            >
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedBlurView>
    </Modal>
  );
}

export default LockCodeModal;
