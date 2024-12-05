//AddressBookModal.js
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
  Alert, // 引入 Alert 组件
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

function AddressBookModal({ visible, onClose, onSelect, styles, isDarkMode }) {
  const [searchAddress, setSearchAddress] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newNetwork, setNewNetwork] = useState("");
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [networkDropdownVisible, setNetworkDropdownVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(null);
  const [savedAddresses, setSavedAddresses] = useState([]);

  useEffect(() => {
    if (visible) {
      setSearchAddress("");
      setIsAddingAddress(false);
      setNewNetwork("");
      setNewName("");
      setNewAddress("");
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
    Alert.alert("Copied", "Address copied to clipboard."); // 显示确认提示
    setDropdownVisible(null); // 隐藏Dropdown
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
      setNewNetwork(addressToEdit.network);
      setNewName(addressToEdit.name);
      setNewAddress(addressToEdit.address);
      setIsAddingAddress(true); // 切换到添加/编辑视图
      setDropdownVisible(null);
      // handleDelete(id); // 不再在这里删除，而是等待用户保存编辑后处理
    }
  };

  const handleSaveAddress = () => {
    if (newNetwork && newName && newAddress) {
      const newEntry = {
        id: Date.now().toString(), // 使用时间戳作为唯一ID
        network: newNetwork,
        name: newName,
        address: newAddress,
      };
      const updatedAddresses = savedAddresses.filter(
        (item) => item.id !== newEntry.id
      ); // 先移除旧的地址
      updatedAddresses.push(newEntry); // 添加更新后的新地址
      setSavedAddresses(updatedAddresses);
      saveAddressesToStorage(updatedAddresses);
      // 清空输入框
      setNewNetwork("");
      setNewName("");
      setNewAddress("");
      setIsAddingAddress(false); // 返回地址簿视图
    } else {
      console.log("Please fill all fields"); // 添加一个提示，以确保所有字段都填写
    }
  };

  const networkImages = {
    Arbitrum: require("../../assets/icon/ARBIcon.png"),
    Aurora: require("../../assets/icon/AURORAIcon.png"),
    Avalanche: require("../../assets/icon/AVAXIcon.png"),
    Bitcoin: require("../../assets/icon/BTCIcon.png"),
    "Bitcoin Cash": require("../../assets/icon/BCHIcon.png"),
    "BNB Smart Chain": require("../../assets/icon/BNBIcon.png"),
    Celo: require("../../assets/icon/CELOIcon.png"),
    Ethereum: require("../../assets/icon/ETHIcon.png"),
    "Ethereum Classic": require("../../assets/icon/ETCIcon.png"),
    Fantom: require("../../assets/icon/FTMIcon.png"),
    "Huobi ECO Chain": require("../../assets/icon/HTIcon.png"),
    "IoTeX Network Mainnet": require("../../assets/icon/IOTXIcon.png"),
    Litecoin: require("../../assets/icon/LTCIcon.png"),
    "OKX Chain": require("../../assets/icon/OKTIcon.png"),
    Optimism: require("../../assets/icon/OPIcon.png"),
    Polygon: require("../../assets/icon/PolygonIcon.png"),
    Ripple: require("../../assets/icon/XRPIcon.png"),
    Solana: require("../../assets/icon/SOLIcon.png"),
    Tron: require("../../assets/icon/TRXIcon.png"),
    "zkSync Era Mainnet": require("../../assets/icon/ZKSIcon.png"),
    Cosmos: require("../../assets/icon/ATOMIcon.png"),
    Celestia: require("../../assets/icon/TIAIcon.png"),
    Cronos: require("../../assets/icon/CROIcon.png"),
    Juno: require("../../assets/icon/JUNOIcon.png"),
    Osmosis: require("../../assets/icon/OSMOIcon.png"),
    Gnosis: require("../../assets/icon/GNOIcon.png"),
    Linea: require("../../assets/icon/LINEAIcon.png"),
    Ronin: require("../../assets/icon/RONIcon.png"),
    Aptos: require("../../assets/icon/APTIcon.png"),
    SUI: require("../../assets/icon/SUIIcon.png"),
  };

  const networks = [
    "Arbitrum",
    "Aurora",
    "Avalanche",
    "Bitcoin",
    "Bitcoin Cash",
    "BNB Smart Chain",
    "Celo",
    "Ethereum",
    "Ethereum Classic",
    "Fantom",
    "Huobi ECO Chain",
    "IoTeX Network Mainnet",
    "Litecoin",
    "OKX Chain",
    "Optimism",
    "Polygon",
    "Ripple",
    "Solana",
    "Tron",
    "zkSync Era Mainnet",
    "Cosmos",
    "Celestia",
    "Cronos",
    "Juno",
    "Osmosis",
    "Gnosis",
    "Linea",
    "Ronin",
    "Aptos",
    "SUI",
  ].sort();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <BlurView intensity={10} style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={() => setDropdownVisible(null)}>
            <View
              style={[
                styles.addressModalView,
                { justifyContent: "space-between" },
              ]}
            >
              {!isAddingAddress ? (
                <>
                  <Text style={styles.modalTitle}>Address Book</Text>
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
                  <View style={{ flex: 1 }}>
                    <FlatList
                      data={filteredAddresses}
                      keyExtractor={(item) => item.id}
                      style={{
                        marginBottom: 20,
                      }}
                      renderItem={({ item }) => (
                        <View
                          style={{
                            position: "relative",
                            marginBottom: 8,
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => onSelect(item)}
                            style={{
                              width: 280,
                              paddingVertical: 10,
                              alignItems: "center",
                              flexDirection: "row",
                              justifyContent: "space-between",
                            }}
                          >
                            <View
                              style={{ flexDirection: "column", flexShrink: 1 }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  marginBottom: 5,
                                  flexWrap: "wrap",
                                }}
                              >
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    marginRight: 10,
                                  }}
                                >
                                  <Text style={styles.text}>
                                    Network:&nbsp;
                                  </Text>
                                  <Image
                                    source={networkImages[item.network]}
                                    style={{
                                      width: 24,
                                      height: 24,
                                      marginLeft: 5,
                                    }}
                                  />
                                  <Text style={styles.modalSubtitle}>
                                    {item.network}
                                  </Text>
                                </View>

                                <Text
                                  style={[styles.text, { marginRight: 10 }]}
                                >
                                  Name:&nbsp;
                                  <Text style={styles.modalSubtitle}>
                                    {item.name}
                                  </Text>
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.text,
                                  { marginRight: 10, flexShrink: 1 },
                                ]}
                                numberOfLines={1}
                                ellipsizeMode="middle"
                              >
                                Address:&nbsp;
                                <Text style={styles.modalSubtitle}>
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
                                  Copy
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                              >
                                <Text style={styles.dropdownButtonText}>
                                  Delete
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleEdit(item.id)}
                              >
                                <Text style={styles.dropdownButtonText}>
                                  Edit
                                </Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    />
                  </View>

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
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {newNetwork && (
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
                        <Text
                          style={{
                            color: newNetwork ? styles.Text.color : "#ccc",
                          }}
                        >
                          {newNetwork || "Select Network"}
                        </Text>
                      </View>
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
                        <ScrollView
                          style={{ maxHeight: 200, borderRadius: 10 }}
                          showsVerticalScrollIndicator={true} // 确保在垂直滚动时显示滚动条
                          showsHorizontalScrollIndicator={false} // 如果不需要水平滚动条可以设置为false
                        >
                          {networks.map((network) => (
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
                          style={[styles.passwordInput]}
                          placeholder="Name Required"
                          placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                          onChangeText={setNewName}
                          value={newName}
                        />
                        <TextInput
                          style={[styles.addressInput]}
                          placeholder="Address Required"
                          placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                          onChangeText={setNewAddress}
                          value={newAddress}
                          multiline
                        />
                      </>
                    )}
                  </View>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      onPress={handleSaveAddress}
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
          </TouchableWithoutFeedback>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default AddressBookModal;
