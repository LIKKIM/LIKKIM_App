// AddWalletModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

const AddWalletModal = ({
  visible,
  onClose,
  onCreateWallet,
  onImportWallet,
  onWalletTest,
  styles,
  t,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.modalView}>
          <TouchableOpacity style={styles.modalButton} onPress={onCreateWallet}>
            <Text style={styles.mainButtonText}>{t("Create Wallet")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onImportWallet}>
            <Text style={styles.mainButtonText}>{t("Import Wallet")}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={onWalletTest}>
            <Text style={styles.mainButtonText}>
              {t("直接创建钱包用于测试(无法转账)")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default AddWalletModal;
