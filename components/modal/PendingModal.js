import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";

const PendingModal = ({
  visible,
  onRequestClose,
  title,
  imageSource,
  subtitle,
  VaultScreenStyle,
  t,
}) => (
  <Modal
    visible={visible}
    onRequestClose={onRequestClose}
    transparent={true}
    animationType="slide"
  >
    <View style={VaultScreenStyle.centeredView}>
      <View style={VaultScreenStyle.pendingModalView}>
        <Text style={VaultScreenStyle.modalTitle}>{title}</Text>
        <Image source={imageSource} style={{ width: 120, height: 120 }} />
        <Text style={VaultScreenStyle.modalSubtitle}>{subtitle}</Text>
        <TouchableOpacity
          style={VaultScreenStyle.submitButton}
          onPress={onRequestClose}
        >
          <Text style={VaultScreenStyle.submitButtonText}>{t("Close")}</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default PendingModal;
