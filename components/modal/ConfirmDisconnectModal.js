// modal/ConfirmDisconnectModal.js
import React from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import { BlurView } from "expo-blur";

const ConfirmDisconnectModal = ({
  visible,
  onConfirm,
  onCancel,
  styles,
  t,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={10} style={styles.centeredView}>
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
      </BlurView>
    </Modal>
  );
};

export default ConfirmDisconnectModal;
