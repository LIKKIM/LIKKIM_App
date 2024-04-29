import React, { useState, useEffect, useRef } from "react";
import {
  ImageBackground,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles";
import { BlurView } from "expo-blur";

function WalletScreen({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const scrollViewRef = useRef(); // 创建ScrollView的引用

  const [cryptoCards, setCryptoCards] = useState([
    {
      name: "Bitcoin",
      address: "10,000,00",
      cardImage: require("../assets/Card3.png"),
    },
    {
      name: "Ethereum",
      address: "10,000,00",
      cardImage: require("../assets/Card54.png"),
    },
    {
      name: "USDT",
      address: "10,000,00",
      cardImage: require("../assets/Card43.png"),
    },
  ]);

  useEffect(() => {
    if (route.params?.showAddModal) {
      setAddCryptoVisible(true);
    }
  }, [route.params]);

  const additionalCryptos = [
    { name: "Litecoin", cardImage: require("../assets/Card1.png") },
    { name: "Ripple", cardImage: require("../assets/Card2.png") },
    { name: "Dash", cardImage: require("../assets/Card3.png") },
  ];

  const handleCardPress = (cryptoName, index) => {
    if (selectedCardName === cryptoName) {
      // 如果当前卡片已选中，显示模态窗口
      setModalVisible(true);
    } else {
      // 如果当前卡片未选中，更新选中状态，并滚动到该卡片
      setSelectedAddress(
        cryptoCards.find((card) => card.name === cryptoName)?.address ||
          "Unknown"
      );
      setSelectedCardName(cryptoName);

      // 卡片高度180px
      const cardHeight = 180; // 每张卡片的实际高度
      const topOffset = 160; // 屏幕顶部到卡片顶部的距离
      const yOffset = Math.max(0, cardHeight * index - topOffset); // 计算滚动的偏移量，使得卡片顶部对齐至屏幕顶部180px
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const handleAddCrypto = (crypto) => {
    if (!cryptoCards.find((card) => card.name === crypto.name)) {
      const newCryptoCards = [...cryptoCards, { ...crypto, address: "0" }];
      setCryptoCards(newCryptoCards);
    }
    setAddCryptoVisible(false);
  };

  return (
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ paddingBottom: 20 }}
        style={{
          width: "100%",
          paddingHorizontal: 0,
        }}
      >
        {cryptoCards.map((card, index) => (
          <TouchableOpacity
            style={{
              alignItems: "center",
              marginBottom: selectedCardName === card.name ? 10 : -60,
            }}
            key={card.name}
            onPress={() => handleCardPress(card.name, index)}
          >
            <ImageBackground
              source={card.cardImage}
              style={styles.card}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.overlay} />
              <Text style={styles.cardText}>{card.name}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
                    marginRight: 30,
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
          <View
            style={{
              margin: 20,
              width: "80%",
              backgroundColor: "#484692", // 深灰色背景
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
            <Text style={styles.modalTitle}>Value:</Text>
            <Text
              style={{
                color: "#ffffff", // 白色文字
                textAlign: "center", // 文本居中对齐
                fontSize: 40,
                marginBottom: 30, // 与下一个元素间距320
              }}
            >
              {selectedAddress}
            </Text>
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
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

export default WalletScreen;
