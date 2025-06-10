// AddressBookModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { networkImages, networks } from "../../config/networkConfig";

function AddressBookModal({ visible, onClose, onSelect, styles, isDarkMode }) {
  const [searchAddress, setSearchAddress] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newNetwork, setNewNetwork] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [newNetworkError, setNewNetworkError] = useState("");
  const [newNameError, setNewNameError] = useState("");
  const [newAddressError, setNewAddressError] = useState("");
  const [networkDropdownVisible, setNetworkDropdownVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const { t } = useTranslation();
  const [searchNetwork, setSearchNetwork] = useState("");
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (visible) {
      setSearchAddress("");
      setIsAddingAddress(false);
      setNewNetwork("");
      setNewName("");
      setNewAddress("");
      setNewNetworkError("");
      setNewNameError("");
      setNewAddressError("");
      setDropdownVisible(null);
      setNetworkDropdownVisible(false);
    }
  }, [visible]);

  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const storedAddresses = await AsyncStorage.getItem("savedAddresses");
        if (storedAddresses) {
          setSavedAddresses(JSON.parse(storedAddresses));
        }
      } catch (error) {
        console.error("Failed to load addresses", error);
      }
    };

    loadAddresses();
  }, []);

  const saveAddressesToStorage = async (addresses) => {
    try {
      await AsyncStorage.setItem("savedAddresses", JSON.stringify(addresses));
    } catch (error) {
      console.error("Failed to save addresses", error);
    }
  };

  const filteredAddresses = savedAddresses.filter(
    (address) =>
      address.network.toLowerCase().includes(searchAddress.toLowerCase()) ||
      address.name.toLowerCase().includes(searchAddress.toLowerCase()) ||
      address.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id);
  };

  const handleCopy = (address) => {
    Clipboard.setString(address);
    Alert.alert("Copied", "Address copied to clipboard.");
    setDropdownVisible(null);
  };

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this address?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const updatedAddresses = savedAddresses.filter(
              (item) => item.id !== id
            );
            setSavedAddresses(updatedAddresses);
            saveAddressesToStorage(updatedAddresses);
            setDropdownVisible(null);
          },
        },
      ]
    );
  };

  const handleEdit = (id) => {
    const addressToEdit = savedAddresses.find((item) => item.id === id);
    if (addressToEdit) {
      setEditingId(id);
      setNewNetwork(addressToEdit.network);
      setNewName(addressToEdit.name);
      setNewAddress(addressToEdit.address);
      setIsAddingAddress(true);
      setDropdownVisible(null);
    }
  };

  const handleSaveAddress = () => {
    let hasError = false;

    if (!newNetwork) {
      setNewNetworkError(t("Network is required"));
      hasError = true;
    } else {
      setNewNetworkError("");
    }

    if (!newName) {
      setNewNameError(t("Name is required"));
      hasError = true;
    } else {
      setNewNameError("");
    }

    if (!newAddress) {
      setNewAddressError(t("Address is required"));
      hasError = true;
    } else {
      setNewAddressError("");
    }

    if (hasError) {
      return;
    }

    let updatedAddresses = [];
    if (editingId) {
      updatedAddresses = savedAddresses.map((item) => {
        if (item.id === editingId) {
          return {
            id: editingId,
            network: newNetwork,
            name: newName,
            address: newAddress,
          };
        }
        return item;
      });
    } else {
      const newEntry = {
        id: Date.now().toString(),
        network: newNetwork,
        name: newName,
        address: newAddress,
      };
      updatedAddresses = [...savedAddresses, newEntry];
    }

    setSavedAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    setNewNetwork("");
    setNewName("");
    setNewAddress("");
    setNewNetworkError("");
    setNewNameError("");
    setNewAddressError("");
    setEditingId(null);
    setIsAddingAddress(false);
  };

  const filteredNetworks = networks.filter((network) =>
    network.toLowerCase().includes(searchNetwork.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <BlurView intensity={10} style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => setDropdownVisible(null)}>
              <View
                style={[
                  styles.addressModalView,
                  { justifyContent: "space-between" },
                  !isAddingAddress && { height: 480 },
                ]}
              >
                {!isAddingAddress ? (
                  <>
                    {/*                     <Text style={styles.modalTitle}>{t("Address Book")}</Text> */}
                    <View style={styles.searchContainer}>
                      <Icon name="search" size={20} style={styles.searchIcon} />
                      <TextInput
                        style={styles.searchInput}
                        placeholder={t("Search Address")}
                        placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                        onChangeText={setSearchAddress}
                        value={searchAddress}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <FlatList
                        data={filteredAddresses}
                        keyExtractor={(item) => item.id}
                        style={{ marginBottom: 20 }}
                        renderItem={({ item }) => (
                          <View
                            style={{ position: "relative", marginBottom: 8 }}
                          >
                            <TouchableOpacity
                              onPress={() => onSelect(item)}
                              style={{
                                width: 280,
                                backgroundColor: isDarkMode
                                  ? "#21201E80"
                                  : "#E5E1E980",
                                padding: 10,
                                alignItems: "center",
                                flexDirection: "row",
                                borderRadius: 10,
                                justifyContent: "space-between",
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "column",
                                  flexShrink: 1,
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    marginBottom: 4,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: isDarkMode ? "#fff" : "#000",
                                      fontSize: 16,
                                    }}
                                  >
                                    {t("Network")}:&nbsp;
                                  </Text>
                                  <Image
                                    source={networkImages[item.network]}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      marginRight: 5,
                                    }}
                                  />
                                  <Text
                                    style={{
                                      color: isDarkMode ? "#ccc" : "#333",
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.network}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    flexDirection: "row",
                                    marginBottom: 8,
                                    alignItems: "center",
                                  }}
                                >
                                  <Text
                                    style={{
                                      color: isDarkMode ? "#fff" : "#000",
                                      fontSize: 16,
                                    }}
                                  >
                                    {t("Name")}:&nbsp;
                                  </Text>
                                  <Text
                                    style={{
                                      color: isDarkMode ? "#ccc" : "#333",
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.name}
                                  </Text>
                                </View>
                                <Text
                                  style={{
                                    color: isDarkMode ? "#fff" : "#000",
                                    fontSize: 16,
                                    flexShrink: 1,
                                  }}
                                  numberOfLines={1}
                                  ellipsizeMode="middle"
                                >
                                  {t("Address")}:&nbsp;
                                  <Text
                                    style={{
                                      color: isDarkMode ? "#ccc" : "#333",
                                      fontSize: 14,
                                    }}
                                  >
                                    {item.address}
                                  </Text>
                                </Text>
                              </View>
                              <TouchableOpacity
                                onPress={() => toggleDropdown(item.id)}
                                style={{ marginLeft: 10 }}
                              >
                                <Icon
                                  name="more-vert"
                                  size={24}
                                  color={isDarkMode ? "#fff" : "#000"}
                                />
                              </TouchableOpacity>
                            </TouchableOpacity>
                            {dropdownVisible === item.id && (
                              <View style={styles.dropdown}>
                                <TouchableOpacity
                                  onPress={() => handleCopy(item.address)}
                                >
                                  <Text style={styles.dropdownButtonText}>
                                    {t("Copy")}
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleDelete(item.id)}
                                >
                                  <Text style={styles.dropdownButtonText}>
                                    {t("Delete")}
                                  </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleEdit(item.id)}
                                >
                                  <Text style={styles.dropdownButtonText}>
                                    {t("Edit")}
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        )}
                      />
                    </View>
                    <View
                      style={[
                        styles.AddressBookContainer,
                        { justifyContent: "flex-start" },
                      ]}
                    >
                      <TouchableOpacity
                        onPress={onClose}
                        style={styles.backButton}
                      >
                        <Text style={styles.submitButtonText}>
                          {t("Close")}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setIsAddingAddress(true)}
                        style={styles.saveButton}
                      >
                        <Text style={styles.cancelButtonText}>
                          {t("Add Address")}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ marginBottom: 10, width: "100%" }}>
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
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            flex: 1,
                          }}
                        >
                          {newNetwork &&
                            filteredNetworks.includes(newNetwork) && (
                              <Image
                                source={networkImages[newNetwork]}
                                style={{
                                  width: 24,
                                  height: 24,
                                  marginRight: 10,
                                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                                  borderRadius: 12,
                                }}
                              />
                            )}
                          <TextInput
                            style={{
                              color: isDarkMode ? "#ddd" : "#000",
                              flex: 1,
                            }}
                            value={newNetwork}
                            onChangeText={(text) => {
                              setNewNetwork(text);
                              setSearchNetwork(text);
                              setNetworkDropdownVisible(true);
                            }}
                            placeholder="Search Network"
                            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                          />
                        </View>
                        <Icon
                          name={
                            networkDropdownVisible
                              ? "expand-less"
                              : "expand-more"
                          }
                          size={24}
                          color={isDarkMode ? "#ddd" : "#676776"}
                        />
                      </TouchableOpacity>
                      {newNetworkError ? (
                        <Text style={{ color: "red", marginBottom: 10 }}>
                          {newNetworkError}
                        </Text>
                      ) : null}
                      {networkDropdownVisible && (
                        <View style={{ width: "100%", marginBottom: 10 }}>
                          <ScrollView
                            style={{ maxHeight: 200, borderRadius: 10 }}
                            showsVerticalScrollIndicator
                            showsHorizontalScrollIndicator={false}
                          >
                            {filteredNetworks.map((network) => (
                              <TouchableOpacity
                                key={network}
                                onPress={() => {
                                  setNewNetwork(network);
                                  setNetworkDropdownVisible(false);
                                }}
                                style={{
                                  padding: 10,
                                  flexDirection: "row",
                                  alignItems: "center",
                                  backgroundColor:
                                    network === newNetwork
                                      ? styles.submitButton.backgroundColor
                                      : styles.passwordInput.backgroundColor,
                                }}
                              >
                                <Image
                                  source={networkImages[network]}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    marginRight: 8,
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderRadius: 12,
                                  }}
                                />
                                <Text style={{ color: styles.Text.color }}>
                                  {network}
                                </Text>
                              </TouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                      {!networkDropdownVisible && (
                        <>
                          <TextInput
                            style={styles.passwordInput}
                            placeholder="Name Required"
                            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                            onChangeText={setNewName}
                            value={newName}
                            autoFocus={true}
                          />
                          {newNameError ? (
                            <Text style={{ color: "red", marginBottom: 10 }}>
                              {newNameError}
                            </Text>
                          ) : null}
                          <TextInput
                            style={styles.addressInput}
                            placeholder="Address Required"
                            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                            onChangeText={setNewAddress}
                            value={newAddress}
                            multiline
                          />
                          {newAddressError ? (
                            <Text
                              style={{
                                color: "red",
                                marginTop: 10,
                              }}
                            >
                              {newAddressError}
                            </Text>
                          ) : null}
                        </>
                      )}
                    </View>
                    <View style={styles.AddressBookContainer}>
                      <TouchableOpacity
                        onPress={() => setIsAddingAddress(false)}
                        style={styles.backButton}
                      >
                        <Text style={styles.cancelButtonText}>{t("Back")}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleSaveAddress}
                        style={styles.saveButton}
                      >
                        <Text style={styles.submitButtonText}>{t("Save")}</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </BlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default AddressBookModal;
