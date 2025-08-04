import { Modal, View, Text, TouchableOpacity } from "react-native";

const PendingModal = ({ visible, onRequestClose, VaultScreenStyle, t }) => (
  <Modal
    visible={visible}
    onRequestClose={onRequestClose}
    transparent={true}
    animationType="slide"
  >
    <View style={VaultScreenStyle.centeredView}>
      <View style={VaultScreenStyle.pendingModalView}>
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
