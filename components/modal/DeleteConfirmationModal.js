// modal/DeleteConfirmationModal.js
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  styles,
  t,
}) => {
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
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onClose}
    >
      <AnimatedBlurView intensity={intensityAnim} style={styles.centeredView}>
        <View style={styles.deleteModalView}>
          <Text style={styles.alertModalTitle}>{t("Remove Asset Card")}</Text>
          <Text style={styles.modalSubtitle}>
            {t("This asset card will be removed")}
          </Text>
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <Image
              source={require("../../assets/gif/Delete.gif")}
              style={{ width: 200, height: 200, marginBottom: 40 }}
            />
          </View>
          <TouchableOpacity
            style={styles.removeModalButton}
            onPress={onConfirm}
          >
            <Text style={styles.ButtonText}>{t("Remove")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeCancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </AnimatedBlurView>
    </Modal>
  );
};

export default DeleteConfirmationModal;
