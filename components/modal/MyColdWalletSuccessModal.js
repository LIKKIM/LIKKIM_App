import React from "react";
import { View, Text, TouchableOpacity, Image, Modal } from "react-native";
import { BlurView } from "expo-blur";

const MyColdWalletSuccessModal = ({ visible, onClose, message, styles, t }) => {
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
            source={require("../../assets/gif/Success.gif")}
            style={{ width: 120, height: 120, marginTop: 20 }}
          />
          <Text style={styles.modalTitle}>{t("Success!")}</Text>
          <Text style={styles.modalSubtitle}>{message}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.submitButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default MyColdWalletSuccessModal;
