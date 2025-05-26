// modal/DeleteConfirmationModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import VaultScreenStyles from "../../styles/VaultScreenStyle";

const DeleteConfirmationModal = ({ visible, onClose, onConfirm, t }) => {
  const styles = VaultScreenStyles(false); // 默认不传 dark mode，或者根据需要传入

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.deleteModalView}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 30,
            }}
          >
            <Text style={styles.alertModalTitle}>{t("Warning")}</Text>
            <Text style={styles.modalSubtitle}>
              {t("deleteDeviceConfirmMessage")}
            </Text>
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
      </BlurView>
    </Modal>
  );
};

export default DeleteConfirmationModal;
