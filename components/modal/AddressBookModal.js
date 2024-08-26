// AddressBookModal.js
import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

function MyColdWalletBluetoothModal({
  visible,
  onClose,
  addresses,
  onSelect,
  styles,
  isDarkMode,
  onAddAddress,
  devices,
  isScanning,
  iconColor,
  onDevicePress,
  onCancel,
  verifiedDevices,
  t,
  onDisconnectPress,
}) {
  const [searchAddress, setSearchAddress] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newNetwork, setNewNetwork] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [networkDropdownVisible, setNetworkDropdownVisible] = useState(false);

  const filteredAddresses = addresses?.filter(
    (address) =>
      address.name.toLowerCase().includes(searchAddress.toLowerCase()) ||
      address.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  const networks = ["Ethereum", "Bitcoin", "Litecoin", "Ripple"];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View
          style={[styles.addressModalView, { justifyContent: "space-between" }]}
        >
          {!isAddingAddress ? (
            <>
              <Text style={styles.modalTitle}>
                {isScanning ? "Bluetooth Devices" : "Address Book"}
              </Text>

              {!isScanning ? (
                <>
                  {/* 搜索框 */}
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

                  <TouchableOpacity
                    onPress={() => setIsAddingAddress(true)}
                    style={styles.submitButton}
                  >
                    <Text style={styles.submitButtonText}>Add Address</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={styles.closeButton}
                  >
                    <Text style={styles.cancelButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <TouchableOpacity onPress={() => onDevicePress(item)}>
                        <Text style={styles.Text}>
                          {item.name || "Unnamed Device"} - {item.id}
                        </Text>
                        {verifiedDevices.includes(item.id) && (
                          <Icon name="verified" size={20} color={iconColor} />
                        )}
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    onPress={onCancel}
                    style={styles.closeButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </>
              )}
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Add New Address</Text>

              {/* 包裹三个输入框的视图 */}
              <View style={{ marginBottom: 20, width: "100%" }}>
                {/* Network 选择窗口 */}
                <Text style={[styles.Text, { marginBottom: 5 }]}>Network</Text>
                <TouchableOpacity
                  style={[
                    styles.passwordInput,

                    {
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    },
                  ]}
                  onPress={() =>
                    setNetworkDropdownVisible(!networkDropdownVisible)
                  }
                >
                  <Text
                    style={{ color: newNetwork ? styles.Text.color : "#666" }}
                  >
                    {newNetwork || "Select Network"}
                  </Text>
                  <Icon
                    name={
                      networkDropdownVisible ? "expand-less" : "expand-more"
                    }
                    size={24}
                    color={styles.Text.color}
                  />
                </TouchableOpacity>
                {networkDropdownVisible && (
                  <View style={{ width: "100%", marginBottom: 10 }}>
                    <ScrollView>
                      {networks.map((network) => (
                        <TouchableOpacity
                          key={network}
                          onPress={() => {
                            setNewNetwork(network);
                            setNetworkDropdownVisible(false);
                          }}
                          style={{
                            padding: 10,
                            backgroundColor:
                              network === newNetwork
                                ? styles.submitButton.backgroundColor
                                : styles.passwordInput.backgroundColor,
                          }}
                        >
                          <Text style={{ color: styles.Text.color }}>
                            {network}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}

                {/* 仅当 networkDropdownVisible 为 false 时显示 Name 和 Address 输入框 */}
                {!networkDropdownVisible && (
                  <>
                    {/* Name 输入框 */}
                    <Text
                      style={[styles.Text, { marginBottom: 5, marginTop: 10 }]}
                    >
                      Name
                    </Text>
                    <TextInput
                      style={[styles.passwordInput]}
                      placeholder="Required"
                      placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                      onChangeText={setNewName}
                      value={newName}
                    />

                    {/* Address 输入框 */}
                    <Text
                      style={[styles.Text, { marginBottom: 5, marginTop: 10 }]}
                    >
                      Address
                    </Text>
                    <TextInput
                      style={[
                        styles.passwordInput,

                        { height: 120 }, // 这里设置高度，可以根据需要调整
                      ]}
                      placeholder="Address"
                      placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                      onChangeText={setNewAddress}
                      value={newAddress}
                      multiline
                    />
                  </>
                )}
              </View>

              {/* 包裹两个按钮的视图 */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    console.log({
                      network: newNetwork,
                      name: newName,
                      address: newAddress,
                    });
                    setIsAddingAddress(false); // 返回地址簿视图
                  }}
                  style={styles.submitButton}
                >
                  <Text style={styles.submitButtonText}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setIsAddingAddress(false)}
                  style={styles.closeButton}
                >
                  <Text style={styles.cancelButtonText}>Back</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </BlurView>
    </Modal>
  );
}

export default MyColdWalletBluetoothModal;
