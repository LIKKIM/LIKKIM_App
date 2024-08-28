// DeleteConfirmationModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

const DeleteConfirmationModal = ({
  visible,
  onClose,
  onConfirm,
  styles,
  t,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.deleteModalView}>
          <Text style={styles.alertModalTitle}>
            {t("Remove Chain Account")}
          </Text>
          <Text style={styles.modalSubtitle}>
            {t("This chain account will be removed")}
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
      </BlurView>
    </Modal>
  );
};

export default DeleteConfirmationModal;
