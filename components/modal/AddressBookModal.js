// AddressBookModal.js
import React from "react";
import { Modal, View, Text, TouchableOpacity, FlatList } from "react-native";
import { BlurView } from "expo-blur";

function AddressBookModal({
  visible,
  onClose,
  addresses,
  onSelect,
  styles,
  isDarkMode,
}) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Address Book</Text>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)}>
                <Text style={styles.addressItemText}>
                  {item.name}: {item.address}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

export default AddressBookModal;
