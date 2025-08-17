/**
 * This is the modal for deleting app wallet data.
 * The onConfirm prop passed in is the confirmDeleteWallet function from SecureDevice.js, which handles the delete functionality.
 */
import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

function DeleteWalletConfirmationModal({
  visible,
  onRequestClose,
  onConfirm,
  onCancel,
  styles,
  t,
}) {
  // 动画相关
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
      setShowModal(false);
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      });
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal
      visible={showModal}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <AnimatedBlurView intensity={intensityAnim} style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{t("Warning")}</Text>
            <Text style={styles.modalSubtitle}>
              {t("deleteDeviceConfirmMessage")}
            </Text>
            <View
              style={{
                flexDirection: "column",
                justifyContent: "flex-end",
                width: 300,
                marginTop: 20,
                alignSelf: "center",
              }}
            >
              <TouchableOpacity style={styles.submitButton} onPress={onConfirm}>
                <Text style={styles.submitButtonText}>{t("Delete")}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedBlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default DeleteWalletConfirmationModal;
