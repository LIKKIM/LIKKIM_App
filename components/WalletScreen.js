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
import { BlurView } from "expo-blur";

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

  // 新货币选项，用户可以从中选择添加
  const additionalCryptos = [
    { name: "Litecoin", cardImage: require("../assets/Card1.png") },
    { name: "Ripple", cardImage: require("../assets/Card2.png") },
    { name: "Dash", cardImage: require("../assets/Card3.png") },
    // 添加更多货币和卡片
  ];

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
  const handleAddCrypto = (crypto) => {
    console.log(`Adding ${crypto.name}`);
    setAddCryptoVisible(false);
    // 检查是否已经添加了这个货币
    if (!cryptoCards.find((card) => card.name === crypto.name)) {
      const newCryptoCards = [...cryptoCards, { ...crypto, address: "0" }]; // 添加默认地址或其他信息
      setCryptoCards(newCryptoCards);
    } else {
      console.log(`${crypto.name} is already added.`);
    }
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
          visible={addCryptoVisible}
          onRequestClose={() => setAddCryptoVisible(false)}
        >
          <BlurView intensity={10} style={styles.centeredView}>
            <View
              style={{
                margin: 20,
                minHeight: 400, // 高度为500
                width: "80%",
                backgroundColor: "#24234C", // 深灰色背景
                borderRadius: 20, // 圆角为20
                padding: 35, // 内边距为35
                alignItems: "center", // 内容居中对齐
                shadowColor: "#000", // 阴影为黑色
                shadowOffset: { width: 0, height: 2 }, // 阴影偏移
                shadowOpacity: 0.25, // 阴影透明度
                shadowRadius: 3.84, // 阴影扩散范围
                elevation: 5, // 用于Android的材质阴影高度
              }}
            >
              {additionalCryptos.map((crypto) => (
                <TouchableOpacity
                  key={crypto.name}
                  style={{
                    width: "100%",
                    padding: 6,
                    backgroundColor: "#1E1D3F",
                    marginBottom: 6,
                    borderRadius: 16,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                  onPress={() => handleAddCrypto(crypto)}
                >
                  <ImageBackground
                    source={crypto.cardImage}
                    style={{
                      width: 100,
                      height: 100,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <Text style={{ color: "#FFF", fontWeight: "bold" }}>
                      {crypto.name}
                    </Text>
                  </ImageBackground>
                  <Text
                    style={{
                      color: "#FFF",
                      fontWeight: "bold",
                      paddingRight: "30px",
                    }}
                  >
                    {crypto.name}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={{
                  backgroundColor: "#6C6CF4",
                  padding: 10,
                  width: "100%",
                  justifyContent: "center",
                  borderRadius: 30,
                  height: 60,
                  alignItems: "center",
                  marginTop: 20,
                }}
                onPress={() => setAddCryptoVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={10} style={styles.centeredView}>
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
          </BlurView>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default WalletScreen;
