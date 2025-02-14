// PendingTransactionModal.js
import React from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";

const PendingTransactionModal = ({
  visible,
  onClose,
  modalStatus,
  TransactionsScreenStyle,
  t,
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <View style={TransactionsScreenStyle.centeredView}>
        <View style={TransactionsScreenStyle.pendingModalView}>
          <Text style={TransactionsScreenStyle.modalTitle}>
            {modalStatus.title}
          </Text>
          <Image
            source={modalStatus.image}
            style={{ width: 120, height: 120 }}
          />
          <Text
            style={[
              TransactionsScreenStyle.modalSubtitle,
              { marginBottom: 20 },
            ]}
          >
            {modalStatus.subtitle}
          </Text>
          <TouchableOpacity
            style={TransactionsScreenStyle.submitButton}
            onPress={onClose}
          >
            <Text style={TransactionsScreenStyle.submitButtonText}>
              {t("Close")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PendingTransactionModal;
