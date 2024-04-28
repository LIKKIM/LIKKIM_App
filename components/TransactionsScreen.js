// TransactionsScreen.js
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles"; // 确保路径正确
import { BlurView } from "expo-blur";

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
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.container}>
      <View className="w-[100%]">
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => console.log("Send Pressed")}
        >
          <Text style={styles.buttonText}>Send</Text>
          <Text style={styles.subButtonText}>
            Send crypto to another wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton}
          onPress={handleReceivePress}
        >
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
          <Text style={styles.subButtonText}>
            Buy crypto securely with cash
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => console.log("Sell Pressed")}
        >
          <Text style={styles.buttonText}>Sell</Text>
          <Text style={styles.subButtonText}>
            Sell crypto securely for cash
          </Text>
        </TouchableOpacity>

        {/* 选择接收的加密货币模态窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={10} style={styles.centeredView}>
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
                style={{
                  backgroundColor: "#6C6CF4",
                  padding: 10,
                  width: "80%",
                  justifyContent: "center",
                  borderRadius: 30,
                  height: 60,
                  alignItems: "center",
                }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
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
              <Text style={styles.modalTitle}>
                Address for {selectedCrypto}:
              </Text>
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
    </LinearGradient>
  );
}

export default TransactionsScreen;
