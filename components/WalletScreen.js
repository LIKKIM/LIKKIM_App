// WalletScreen.js
import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  Image,
  View,
  Text,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles"; // 确保路径正确

function WalletScreen({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);

  // 监听从App.js传来的参数
  useEffect(() => {
    console.log("Received params:", route.params);
    if (route.params?.showAddModal) {
      setAddCryptoVisible(true);
    }
  }, [route.params]);

  const cryptoCard = {
    Bitcoin: "10,000,00",
    Ethereum: "10,000,00",
    USDT: "10,000,00",
  };

  const getImageForCrypto = (cryptoName) => {
    switch (cryptoName) {
      case "Bitcoin":
        return require("../assets/Card3.png");
      case "Ethereum":
        return require("../assets/Card54.png");
      case "USDT":
        return require("../assets/Card43.png");
      default:
        return require("../assets/Card4.png"); // 默认图片，如果没有匹配
    }
  };

  const handleCardPress = (cryptoName) => {
    setSelectedAddress(cryptoCard[cryptoName]);
    setModalVisible(true);
  };

  const handleAddPress = () => {
    console.log("Add button pressed");
    // 这里可以添加点击+号按钮后的逻辑
  };
  return (
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.container}>
      <View>
        {Object.entries(cryptoCard).map(([name, address]) => (
          <TouchableOpacity key={name} onPress={() => handleCardPress(name)}>
            <ImageBackground
              source={getImageForCrypto(name)}
              style={styles.card}
              imageStyle={{ borderRadius: 16 }}
            >
              {/* 添加遮罩层 */}
              <View style={styles.overlay} />
              <Text style={styles.cardText}>{name}</Text>
            </ImageBackground>
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
              <Text
                style={{
                  color: "#ffffff", // 白色文字
                  textAlign: "center",
                  fontSize: 44,
                }}
                Text
              >
                {selectedAddress}
              </Text>
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
