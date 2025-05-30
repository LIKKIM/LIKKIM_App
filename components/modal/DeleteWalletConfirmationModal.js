import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";

function DeleteWalletConfirmationModal({
  visible,
  onRequestClose,
  onConfirm,
  onCancel,
  styles,
  t,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <BlurView intensity={10} style={styles.centeredView}>
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
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default DeleteWalletConfirmationModal;
