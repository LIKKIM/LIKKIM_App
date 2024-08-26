// MyColdWalletVerificationModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

const MyColdWalletVerificationModal = ({
  visible,
  status,
  onClose,
  styles,
  t,
}) => {
  const isSuccess = status === "success";
  const imageSource = isSuccess
    ? require("../../assets/gif/Success.gif")
    : require("../../assets/gif/Fail.gif");
  const title = isSuccess
    ? t("Verification successful!")
    : t("Verification failed!");
  const subtitle = isSuccess
    ? t("You can now safely use the device.")
    : t("The verification code you entered is incorrect. Please try again.");

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
            source={imageSource}
            style={{ width: 120, height: 120, marginTop: 20 }}
          />
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalSubtitle}>{subtitle}</Text>
          <TouchableOpacity style={styles.submitButton} onPress={onClose}>
            <Text style={styles.submitButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default MyColdWalletVerificationModal;
