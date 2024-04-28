import React, { useState } from "react";
import {
  Modal,
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";

// 页面组件
function WalletScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");

  const cryptoAddresses = {
    Bitcoin: "10,000,00",
    Ethereum: "10,000,00",
    USDT: "10,000,00",
  };

  const handleCardPress = (cryptoName) => {
    setSelectedAddress(cryptoAddresses[cryptoName]);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {Object.entries(cryptoAddresses).map(([name, address]) => (
        <TouchableOpacity key={name} onPress={() => handleCardPress(name)}>
          <View style={styles.card}>
            <Text style={styles.cardText}>{name}</Text>
          </View>
        </TouchableOpacity>
      ))}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Value:</Text>
            <Text style={styles.modalText}>{selectedAddress}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function TransactionsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");

  const cryptoAddresses = {
    BTC: "1BoatSLRHtKNngkdXEeobR76b53LETtpyT",
    ETH: "0xde0B295669a9FD93d5F28D9Ec85E40f4cb697BAe",
    USDT: "1KAt6STtisWMMVo5XGdos9P7DBNNsFfjx7",
  };

  const handleReceivePress = () => {
    setModalVisible(true); // 打开接收加密货币的选择模态窗口
  };

  const selectCrypto = (crypto) => {
    console.log(`Receive ${crypto} Pressed`);
    setSelectedCrypto(crypto);
    setSelectedAddress(cryptoAddresses[crypto]); // 设置所选加密货币的地址
    setModalVisible(false); // 关闭选择模态窗口
    setAddressModalVisible(true); // 打开地址显示模态窗口
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Send Pressed")}
      >
        <Text style={styles.buttonText}>Send</Text>
        <Text style={styles.subButtonText}>Send crypto to another wallet</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.roundButton} onPress={handleReceivePress}>
        <Text style={styles.buttonText}>Receive</Text>
        <Text style={styles.subButtonText}>
          Receive crypto from another wallet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Buy Pressed")}
      >
        <Text style={styles.buttonText}>Buy</Text>
        <Text style={styles.subButtonText}>Buy crypto securely with cash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Sell Pressed")}
      >
        <Text style={styles.buttonText}>Sell</Text>
        <Text style={styles.subButtonText}>Sell crypto securely for cash</Text>
      </TouchableOpacity>

      {/* 选择接收的加密货币模态窗口 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Choose the cryptocurrency to receive:
            </Text>
            {["BTC", "ETH", "USDT"].map((crypto) => (
              <TouchableOpacity
                key={crypto}
                style={styles.optionButton}
                onPress={() => selectCrypto(crypto)}
              >
                <Text style={styles.optionButtonText}>{crypto}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 显示选择的加密货币地址的模态窗口 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Address for {selectedCrypto}:</Text>
            <Text style={styles.modalText}>{selectedAddress}</Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function MyColdWalletScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Bluetooth</Text>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Pair with Bluetooth</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>LOOKING FOR DEVICES</Text>
            <Text style={styles.modalSubtitle}>
              Please make sure your Cold Wallet is unlocked and Bluetooth is
              enabled.
            </Text>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Wallet") {
                iconName = "account-balance-wallet";
              } else if (route.name === "Transactions") {
                iconName = "swap-horiz";
              } else if (route.name === "My Cold Wallet") {
                iconName = "bluetooth";
              }
              return <Icon name={iconName} size={size} color={color} />;
            },
            tabBarLabel: ({ focused }) => {
              const label =
                route.name === "Wallet"
                  ? "Wallet"
                  : route.name === "Transactions"
                  ? "Transactions"
                  : "My Cold Wallet";
              return (
                <Text style={{ color: focused ? "#e0e0e0" : "gray" }}>
                  {label}
                </Text>
              );
            },
            tabBarActiveTintColor: "#e0e0e0",
            tabBarInactiveTintColor: "gray",
            tabBarStyle: {
              backgroundColor: "#121212",
              borderTopColor: "#373737",
              borderTopWidth: 1,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            headerStyle: {
              backgroundColor: "#121212", // 设置头部的背景颜色
              borderBottomColor: "#424242", // 设置边框颜色为深灰色
              borderBottomWidth: 1, // 确保边框宽度为1，如果原来没有边框需要添加这一行
            },
            headerTintColor: "#e0e0e0", // 设置头部标题和按钮的颜色
            headerTitleStyle: {
              fontWeight: "bold", // 设置头部标题的字体加粗
            },
          })}
        >
          <Tab.Screen name="Wallet" component={WalletScreen} />
          <Tab.Screen name="Transactions" component={TransactionsScreen} />
          <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
