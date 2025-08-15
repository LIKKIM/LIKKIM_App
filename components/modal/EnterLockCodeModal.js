// EnterLockCodeModal.js
import React, { useState, useRef, useEffect } from "react";
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

function EnterLockCodeModal({
  visible,
  onClose,
  handleConfirmPassword,
  closeEnterLockCodeModal,
  isDarkMode,
  styles,
  t,
  currentPassword,
  setCurrentPassword,
  isCurrentPasswordHidden,
  setIsCurrentPasswordHidden,
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
        <View style={styles.disableLockModalView}>
          <Text style={styles.LockCodeModalTitle}>
            {t("Disable Lock Screen")}
          </Text>
          <View style={{ marginVertical: 10, width: "100%" }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t("Enter your password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isCurrentPasswordHidden}
                onChangeText={setCurrentPassword}
                value={currentPassword}
                autoFocus
              />
              <TouchableOpacity
                onPress={() =>
                  setIsCurrentPasswordHidden(!isCurrentPasswordHidden)
                }
                style={styles.eyeIcon}
              >
                <Icon
                  name={
                    isCurrentPasswordHidden ? "visibility-off" : "visibility"
                  }
                  size={24}
                  color={isDarkMode ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleConfirmPassword}
            >
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeEnterLockCodeModal}
            >
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedBlurView>
    </Modal>
  );
}

export default EnterLockCodeModal;
