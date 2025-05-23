// VerificationModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

import SuccessGif from "../../assets/gif/Success.gif";
import FailGif from "../../assets/gif/Fail.gif";
import PendingGif from "../../assets/gif/Pending.gif";

const VerificationModal = ({ visible, status, onClose, styles, t }) => {
  let imageSource;
  let title;
  let subtitle;

  if (status === "success") {
    imageSource = SuccessGif;
    title = t("Verification successful!");
    subtitle = t("You can now safely use the device.");
  } else if (status === "walletReady") {
    imageSource = SuccessGif;
    title = t("Wallet ready!");
    subtitle = t("The wallet has been fully set up and is ready to use.");
  } else if (status === "fail") {
    imageSource = FailGif;
    title = t("Verification failed!");
    subtitle = t(
      "The verification code you entered is incorrect. Please try again."
    );
  } else if (status === "waiting") {
    imageSource = PendingGif;
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
