// TipModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

const TipModal = ({ visible, onClose, onContinue, styles, t }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.alertModalTitle}>{t("Recovery Phrase")}</Text>
          <Text style={styles.alertModalSubtitle}>
            {t("Read the following, then save the phrase securely.")}
          </Text>
          <Text style={styles.alertModalContent}>
            {`🔑  ${t(
              "The recovery phrase alone gives you full access to your wallets and funds."
            )}\n\n`}
            {`🔒  ${t(
              "If you forget your password, you can use the recovery phrase to get back into your wallet."
            )}\n\n`}
            {`🚫  ${t("LIKKIM will never ask for your recovery phrase.")}\n\n`}
            {`🤫  ${t("Never share it with anyone.")}`}
          </Text>
          <TouchableOpacity
            style={styles.alertModalButton}
            onPress={onContinue}
          >
            <Text style={styles.ButtonText}>{t("Continue")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default TipModal;
