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
  onAddAddress, // 添加回调函数
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
                <Text style={styles.Text}>
                  {item.name}: {item.address}
                </Text>
              </TouchableOpacity>
            )}
          />
          {/* "Add Address" 按钮 */}
          <TouchableOpacity
            onPress={onAddAddress} // 触发回调函数
            style={styles.submitButton} // 使用现有的样式
          >
            <Text style={styles.submitButtonText}>Add Address</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.cancelButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
}

export default AddressBookModal;
