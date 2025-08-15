// modal/ConfirmDisconnectModal.js
import React, { useContext, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Modal, Animated } from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import { DarkModeContext } from "../../utils/DeviceContext";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const ConfirmDisconnectModal = ({ visible, onConfirm, onCancel }) => {
  const { isDarkMode } = useContext(DarkModeContext);
  const styles = SecureDeviceScreenStyles(isDarkMode);
  const { t } = useTranslation();

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
      transparent={true}
      visible={showModal}
      onRequestClose={onCancel}
    >
      <AnimatedBlurView intensity={intensityAnim} style={styles.centeredView}>
        <View style={styles.disconnectModalView}>
          <Text style={styles.modalTitle}>{t("Confirm Disconnect")}</Text>
          <Text
            style={[
              styles.disconnectSubtitle,
              { height: 80, textAlignVertical: "center" },
            ]}
          >
            {t("Are you sure you want to disconnect this device?")}
          </Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={onConfirm}>
              <Text style={styles.submitButtonText}>{t("Confirm")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{t("Back")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </AnimatedBlurView>
    </Modal>
  );
};

export default ConfirmDisconnectModal;
