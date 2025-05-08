// ActivityProgressModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";

const ActivityProgressModal = ({
  visible,
  onClose,
  modalStatus,
  ActivityScreenStyle,
  t,
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <View style={ActivityScreenStyle.centeredView}>
        <View style={ActivityScreenStyle.pendingModalView}>
          <Text style={ActivityScreenStyle.modalTitle}>
            {modalStatus.title}
          </Text>
          <Image
            source={modalStatus.image}
            style={{ width: 120, height: 120 }}
          />
          <Text
            style={[ActivityScreenStyle.modalSubtitle, { marginBottom: 20 }]}
          >
            {modalStatus.subtitle}
          </Text>
          <TouchableOpacity
            style={ActivityScreenStyle.submitButton}
            onPress={onClose}
          >
            <Text style={ActivityScreenStyle.submitButtonText}>
              {t("Close")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityProgressModal;
