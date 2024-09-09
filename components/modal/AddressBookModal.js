//AddressBookModal.js
import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Clipboard,
  TouchableWithoutFeedback, // 导入 TouchableWithoutFeedback 组件
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
  const [dropdownVisible, setDropdownVisible] = useState(null); // 控制哪个地址显示Dropdown
  const [savedAddresses, setSavedAddresses] = useState([]); // 保存地址的状态

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

  // 更新后的搜索逻辑，支持 network, name 和 address
  const filteredAddresses = savedAddresses.filter(
    (address) =>
      address.network.toLowerCase().includes(searchAddress.toLowerCase()) ||
      address.name.toLowerCase().includes(searchAddress.toLowerCase()) ||
      address.address.toLowerCase().includes(searchAddress.toLowerCase())
  );

  const toggleDropdown = (id) => {
    setDropdownVisible(dropdownVisible === id ? null : id); // 切换Dropdown显示状态
  };

  const handleCopy = (address) => {
    Clipboard.setString(address);
    console.log("Address copied to clipboard:", address);
    setDropdownVisible(null); // 隐藏Dropdown
  };

  const handleDelete = (id) => {
    const updatedAddresses = savedAddresses.filter((item) => item.id !== id);
    setSavedAddresses(updatedAddresses);
    saveAddressesToStorage(updatedAddresses);
    setDropdownVisible(null); // 隐藏Dropdown
  };

  const handleEdit = (id) => {
    const addressToEdit = savedAddresses.find((item) => item.id === id);
    if (addressToEdit) {
      setNewNetwork(addressToEdit.network);
      setNewName(addressToEdit.name);
      setNewAddress(addressToEdit.address);
      setIsAddingAddress(true); // 切换到添加/编辑视图
      setDropdownVisible(null);
      handleDelete(id); // 删除旧条目，准备替换为新条目
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
      const updatedAddresses = [...savedAddresses, newEntry];
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

  const networks = [
    "Akash",
    "Algorand",
    "Aptos",
    "Arbitrum",
    "Astar",
    "Aurora",
    "Avalanche",
    "Base",
    "Bitcoin",
    "Bitcoin Cash",
    "Blast",
    "BNB Smart Chain",
    "Boba Network",
    "Celo",
    "Celestia / Lightning Network",
    "Conflux",
    "Conflux eSpace",
    "Cosmos",
    "Cronos",
    "Crypto.org",
    "DIS CHAIN",
    "Dogecoin",
    "Dynex",
    "Ethereum",
    "Ethereum Classic",
    "EthereumPoW",
    "Fantom",
    "Fetch.ai",
    "Filecoin",
    "Filecoin FEVM",
    "Gnosis Chain",
    "Huobi ECO Chain",
    "IoTeX Network Mainnet",
    "Juno",
    "Joystream",
    "Kaspa",
    "Kusama",
    "Linea",
    "Litecoin",
    "Manta Atlantic",
    "Manta Pacific Mainnet",
    "Mantle",
    "Mixin Virtual Machine",
    "Monero",
    "Near",
    "Nervos",
    "Neurai",
    "Nexa",
    "OctaSpace",
    "OKX Chain",
    "Optimism",
    "Polygon",
    "Ripple",
    "Secret Network",
    "Solana",
    "Starcoin",
    "SUI",
    "Tron",
    "zkSync Era Mainnet",
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
          <TouchableWithoutFeedback
            onPress={() => setDropdownVisible(null)} // 点击非 dropdown 区域关闭 dropdown
          >
            <View
              style={[
                styles.addressModalView,
                { justifyContent: "space-between" },
              ]}
            >
              {!isAddingAddress ? (
                <>
                  <Text style={styles.modalTitle}>Address Book</Text>

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
                        <View>
                          <TouchableOpacity
                            onPress={() => {
                              onSelect(item); // 将选中的地址返回给 InputAddressModal
                            }}
                            style={{
                              width: 280,
                              paddingVertical: 10,
                              alignItems: "center",
                              flexDirection: "row",
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
                                  marginBottom: 5,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Text
                                  style={[styles.Text, { marginRight: 10 }]}
                                >
                                  Network:&nbsp;
                                  <Text style={[styles.modalSubtitle]}>
                                    {item.network}
                                  </Text>
                                </Text>
                                <Text
                                  style={[styles.Text, { marginRight: 10 }]}
                                >
                                  Name:&nbsp;
                                  <Text style={[styles.modalSubtitle]}>
                                    {item.name}
                                  </Text>
                                </Text>
                              </View>
                              <Text
                                style={[
                                  styles.Text,
                                  { marginRight: 10 },
                                  { flexShrink: 1 },
                                ]} // 允许文本在需要时缩小
                                numberOfLines={1} // 限制为一行
                                ellipsizeMode="middle" // 在中间截断文本并添加省略号
                              >
                                Address:&nbsp;
                                <Text style={[styles.modalSubtitle]}>
                                  {item.address}
                                </Text>
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={() => toggleDropdown(item.id)}
                              style={{ marginLeft: 10 }} // 给图标和文字间一些间距
                            >
                              <Icon
                                name="more-vert"
                                size={24}
                                color={isDarkMode ? "#fff" : "#000"} // 根据模式动态设置颜色
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
                </>
              ) : (
                <>
                  {/* 包裹三个输入框的视图 */}
                  <View style={{ marginBottom: 10, width: "100%" }}>
                    {/* Network 选择窗口 */}

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
                        style={{
                          color: newNetwork ? styles.Text.color : "#ccc",
                        }}
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
                        <ScrollView style={{ maxHeight: 200 }}>
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

                  {/* 包裹两个按钮的视图 */}
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
