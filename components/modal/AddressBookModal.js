// AddressBookModal.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

function AddressBookModal({
  visible,
  onClose,
  addresses,
  onSelect,
  styles,
  isDarkMode,
  onAddAddress,
}) {
  const [searchAddress, setSearchAddress] = useState("");

  const filteredAddresses = addresses.filter(
    (address) =>
      address.name.toLowerCase().includes(searchAddress.toLowerCase()) ||
      address.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

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

          {/* Search Box */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search Address"
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              onChangeText={setSearchAddress}
              value={searchAddress}
            />
          </View>

          <FlatList
            data={filteredAddresses}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => onSelect(item)}>
                <Text style={styles.Text}>
                  {item.name}: {item.address}
                </Text>
              </TouchableOpacity>
            )}
          />
          {/* "Add Address" Button */}
          <TouchableOpacity onPress={onAddAddress} style={styles.submitButton}>
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
