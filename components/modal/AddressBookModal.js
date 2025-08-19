// AddressBookModal.js
import React, { useState, useEffect, useRef } from "react";
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
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { BlurView } from "expo-blur";
import { Animated, Easing } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { networkImages, networks } from "../../config/networkConfig";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// 新增 AnimatedTouchableOpacity 组件，封装点击缩放效果
const AnimatedTouchableOpacity = ({ children, style, onPress, ...rest }) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...rest}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
};

function AddressBookModal({ visible, onClose, onSelect, styles, isDarkMode }) {
  const [searchAddress, setSearchAddress] = useState("");
  const [showModal, setShowModal] = useState(false);
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

  // 动画相关
  const intensityAnim = useRef(new Animated.Value(0)).current;

  // 控制 Modal 挂载和动画
  useEffect(() => {
    if (visible) {
      setShowModal(true);
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

      // 进入动画
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(intensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (showModal) {
      setShowModal(false);
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      });
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
    Alert.alert("", t("Address copied to clipboard"));
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
      visible={showModal}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <AnimatedBlurView
            intensity={intensityAnim}
            style={styles.centeredView}
          >
            <TouchableWithoutFeedback onPress={() => setDropdownVisible(null)}>
              <View
                style={[
                  styles.addressModalView,
                  { justifyContent: "space-between" },
                  !isAddingAddress && { height: 380 },
                  { backgroundColor: isDarkMode ? "#3F3D3C" : "#ffffff" },
                ]}
              >
                {!isAddingAddress ? (
                  <>
                    {/*                     <Text style={styles.modalTitle}>{t("Address Book")}</Text> */}
                    <View
                      style={[
                        styles.searchContainer,
                        { backgroundColor: isDarkMode ? "#21201E" : "#E5E1E9" },
                      ]}
                    >
                      <Icon
                        name="search"
                        size={20}
                        style={[
                          styles.searchIcon,
                          { color: isDarkMode ? "#fff" : "#000" },
                        ]}
                      />
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
                            <AnimatedTouchableOpacity
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
                                      backgroundColor:
                                        "rgba(255, 255, 255, 0.2)",
                                      borderRadius: 12,
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
                              <AnimatedTouchableOpacity
                                onPress={() => toggleDropdown(item.id)}
                                style={{ marginLeft: 10 }}
                              >
                                <Icon
                                  name="more-vert"
                                  size={24}
                                  color={isDarkMode ? "#fff" : "#000"}
                                />
                              </AnimatedTouchableOpacity>
                            </AnimatedTouchableOpacity>
                            {dropdownVisible === item.id && (
                              <View
                                style={[
                                  styles.dropdown,
                                  {
                                    backgroundColor: isDarkMode
                                      ? "#3F3D3C"
                                      : "#ffffff",
                                  },
                                ]}
                              >
                                <AnimatedTouchableOpacity
                                  onPress={() => handleCopy(item.address)}
                                >
                                  <Text
                                    style={[
                                      styles.dropdownButtonText,
                                      { color: isDarkMode ? "#fff" : "#000" },
                                    ]}
                                  >
                                    {t("Copy")}
                                  </Text>
                                </AnimatedTouchableOpacity>
                                <AnimatedTouchableOpacity
                                  onPress={() => handleDelete(item.id)}
                                >
                                  <Text
                                    style={[
                                      styles.dropdownButtonText,
                                      { color: isDarkMode ? "#fff" : "#000" },
                                    ]}
                                  >
                                    {t("Delete")}
                                  </Text>
                                </AnimatedTouchableOpacity>
                                <AnimatedTouchableOpacity
                                  onPress={() => handleEdit(item.id)}
                                >
                                  <Text
                                    style={[
                                      styles.dropdownButtonText,
                                      { color: isDarkMode ? "#fff" : "#000" },
                                    ]}
                                  >
                                    {t("Edit")}
                                  </Text>
                                </AnimatedTouchableOpacity>
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
                      <AnimatedTouchableOpacity
                        onPress={onClose}
                        style={[
                          styles.backButton,
                          {
                            borderColor: isDarkMode ? "#CCB68C" : "#E5E1E9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.submitButtonText,
                            {
                              color: isDarkMode ? "#fff" : "#000",
                            },
                          ]}
                        >
                          {t("Close")}
                        </Text>
                      </AnimatedTouchableOpacity>
                      <AnimatedTouchableOpacity
                        onPress={() => setIsAddingAddress(true)}
                        style={[
                          styles.saveButton,
                          {
                            backgroundColor: isDarkMode ? "#CCB68C" : "#E5E1E9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.cancelButtonText,
                            {
                              color: isDarkMode ? "#fff" : "#000",
                            },
                          ]}
                        >
                          {t("Add Address")}
                        </Text>
                      </AnimatedTouchableOpacity>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{ marginBottom: 10, width: "100%" }}>
                      <AnimatedTouchableOpacity
                        style={[
                          styles.passwordInput,
                          {
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: isDarkMode ? "#21201E" : "#e0e0e0",
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
                      </AnimatedTouchableOpacity>
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
                              <AnimatedTouchableOpacity
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
                                      ? isDarkMode
                                        ? "#3F3D3C"
                                        : "#f5f5f5"
                                      : isDarkMode
                                      ? "#21201E"
                                      : "#e0e0e0",
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
                                <Text
                                  style={[
                                    styles.Text,
                                    { color: isDarkMode ? "#fff" : "#000" },
                                  ]}
                                >
                                  {network}
                                </Text>
                              </AnimatedTouchableOpacity>
                            ))}
                          </ScrollView>
                        </View>
                      )}
                      {!networkDropdownVisible && (
                        <>
                          <TextInput
                            style={[
                              styles.passwordInput,
                              {
                                backgroundColor: isDarkMode
                                  ? "#21201E"
                                  : "#e0e0e0",
                                color: isDarkMode ? "#fff" : "#000",
                              },
                            ]}
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
                            style={[
                              styles.addressInput,
                              {
                                backgroundColor: isDarkMode
                                  ? "#21201E"
                                  : "#e0e0e0",
                                color: isDarkMode ? "#fff" : "#000",
                              },
                            ]}
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
                      <AnimatedTouchableOpacity
                        onPress={() => setIsAddingAddress(false)}
                        style={[
                          styles.backButton,
                          {
                            borderColor: isDarkMode ? "#CCB68C" : "#E5E1E9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.cancelButtonText,
                            {
                              color: isDarkMode ? "#fff" : "#000",
                            },
                          ]}
                        >
                          {t("Back")}
                        </Text>
                      </AnimatedTouchableOpacity>
                      <AnimatedTouchableOpacity
                        onPress={handleSaveAddress}
                        style={[
                          styles.saveButton,
                          {
                            backgroundColor: isDarkMode ? "#CCB68C" : "#E5E1E9",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.submitButtonText,
                            {
                              color: isDarkMode ? "#fff" : "#000",
                            },
                          ]}
                        >
                          {t("Save")}
                        </Text>
                      </AnimatedTouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </AnimatedBlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default AddressBookModal;
