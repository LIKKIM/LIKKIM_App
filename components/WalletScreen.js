// WalletScreen.js
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles"; // 确保路径正确

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

  const handleAddPress = () => {
    console.log("Add button pressed");
    // 这里可以添加点击+号按钮后的逻辑
  };
  return (
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.container}>
      <View>
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
    </LinearGradient>
  );
}

export default WalletScreen;
