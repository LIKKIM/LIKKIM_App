import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";

const PendingModal = ({
  visible,
  onRequestClose,
  title,
  imageSource,
  subtitle,
  WalletScreenStyle,
  t,
}) => (
  <Modal
    visible={visible}
    onRequestClose={onRequestClose}
    transparent={true}
    animationType="slide"
  >
    <View style={WalletScreenStyle.centeredView}>
      <View style={WalletScreenStyle.pendingModalView}>
        <Text style={WalletScreenStyle.modalTitle}>{title}</Text>
        <Image source={imageSource} style={{ width: 120, height: 120 }} />
        <Text style={WalletScreenStyle.modalSubtitle}>{subtitle}</Text>
        <TouchableOpacity
          style={WalletScreenStyle.submitButton}
          onPress={onRequestClose}
        >
          <Text style={WalletScreenStyle.submitButtonText}>{t("Close")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default PendingModal;
