// VerificationModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

const VerificationModal = ({ visible, status, onClose, styles, t }) => {
  let imageSource;
  let title;
  let subtitle;

  if (status === "success") {
    imageSource = require("../../assets/gif/Success.gif");
    title = t("Verification successful!");
    subtitle = t("You can now safely use the device.");
  } else if (status === "fail") {
    imageSource = require("../../assets/gif/Fail.gif");
    title = t("Verification failed!");
    subtitle = t(
      "The verification code you entered is incorrect. Please try again."
    );
  } else if (status === "waiting") {
    imageSource = require("../../assets/gif/Pending.gif");
    title = t("Creating wallet...");
    subtitle = t(
      "Receiving all addresses from the device. Wallet is being created, please wait..."
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.pinModalView}>
          <Image
            key={status}
            source={imageSource}
            style={{ width: 120, height: 120, marginTop: 20 }}
          />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          {status !== "waiting" ? (
            <TouchableOpacity style={styles.submitButton} onPress={onClose}>
              <Text style={styles.submitButtonText}>{t("Close")}</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ height: 60 }} />
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default VerificationModal;
