import React, { useState, useEffect, useRef, useContext } from "react";
import {
  ImageBackground,
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { lightTheme, darkTheme } from "../styles";
import { BlurView } from "expo-blur";
import { CryptoContext } from "./CryptoContext"; // 导入 CryptoContext

function WalletScreen({ route }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [addIconModalVisible, setAddIconModalVisible] = useState(false); // 新增的弹窗状态
  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false); // 新增钱包弹窗状态
  const scrollViewRef = useRef(); // 创建ScrollView的引用
  const [isDarkMode, setIsDarkMode] = useState(true);
  const { cryptoCount, setCryptoCount } = useContext(CryptoContext); // 使用 CryptoContext
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"]; // 暗黑模式颜色
  const lightColors = ["#FFFFFF", "#E0E0E0"]; // 明亮模式颜色

  const handleDeleteCard = () => {
    setCryptoCards(
      cryptoCards.filter((card) => card.name !== selectedCardName)
    );
    setDropdownVisible(false); // Close the dropdown after action
    setModalVisible(false); // Optionally close the modal as well
    setCryptoCount(cryptoCards.length - 1); // 更新 cryptoCount
  };

  const [cryptoCards, setCryptoCards] = useState([]);

  useEffect(() => {
    if (route.params?.showAddModal) {
      setAddCryptoVisible(true);
    }
    if (route.params?.showAddIconModal) {
      setAddIconModalVisible(true);
    }
  }, [route.params]);

  useEffect(() => {
    setCryptoCount(cryptoCards.length); // 初始化时设置 cryptoCount
  }, [cryptoCards.length]);

  const additionalCryptos = [
    { name: "Bitcoin", cardImage: require("../assets/Card3.png") },
    { name: "Ethereum", cardImage: require("../assets/Card54.png") },
    { name: "USDT", cardImage: require("../assets/Card43.png") },
    { name: "Litecoin", cardImage: require("../assets/Card1.png") },
    { name: "Ripple", cardImage: require("../assets/Card2.png") },
    { name: "Dash", cardImage: require("../assets/Card3.png") },
    { name: "Cardano", cardImage: require("../assets/Card5.png") },
    { name: "Polkadot", cardImage: require("../assets/Card6.png") },
    { name: "Chainlink", cardImage: require("../assets/Card7.png") },
    { name: "Stellar", cardImage: require("../assets/Card8.png") },
    { name: "Dogecoin", cardImage: require("../assets/Card9.png") },
  ];

  const handleCardPress = (cryptoName, index) => {
    if (selectedCardName === cryptoName) {
      setModalVisible(true);
    } else {
      setSelectedAddress(
        cryptoCards.find((card) => card.name === cryptoName)?.address ||
          "Unknown"
      );
      setSelectedCardName(cryptoName);

      const cardHeight = 180;
      const topOffset = 160;
      const yOffset = Math.max(0, cardHeight * index - topOffset);
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };
  const handleAddCrypto = (crypto) => {
    if (!cryptoCards.find((card) => card.name === crypto.name)) {
      const newCryptoCards = [...cryptoCards, { ...crypto, address: "0" }];
      setCryptoCards(newCryptoCards);
      setCryptoCount(newCryptoCards.length); // 更新 cryptoCount
    }
    setAddCryptoVisible(false);
  };

  const handleCreateWallet = () => {
    // 处理创建钱包逻辑
    setAddCryptoVisible(true); // 直接打开添加数字货币卡片的弹窗
    setAddWalletModalVisible(false); // 关闭选择创建或导入的弹窗
  };

  const handleImportWallet = () => {
    // 处理导入钱包逻辑
    setAddCryptoVisible(true); // 直接打开添加数字货币卡片的弹窗
    setAddWalletModalVisible(false); // 关闭选择创建或导入的弹窗
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={{
        flex: 1,
        paddingTop: 20,
        backgroundColor: "#121212", // 深灰色背景，适用于暗模式
        alignItems: "center", // 子元素沿着主轴（即垂直轴）居中对齐
        justifyContent: "center", // 子元素沿着交叉轴（即水平轴）居中对齐
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingBottom: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{
          width: "100%",
          paddingHorizontal: 0,
        }}
      >
        {cryptoCards.length === 0 && (
          <TouchableOpacity
            onPress={() => setAddWalletModalVisible(true)}
            style={{
              width: 300, // 宽度为300
              height: 170, // 高度为100
              borderRadius: 20, // 边角圆润程度为16
              overflow: "hidden",
              justifyContent: "center", // 内容居中显示
              alignItems: "center", // 内容居中显示
              backgroundColor: "#484692", // 深灰色背景，比container稍浅
              marginBottom: 20, // 与下一个元素间距20
              shadowColor: "#000", // 阴影颜色为黑色
              shadowOffset: { width: 0, height: 2 }, // 阴影偏移
              shadowOpacity: 0.25, // 阴影透明度
              shadowRadius: 3.84, // 阴影扩散范围
              elevation: 5, // 用于Android的材质阴影高度
            }}
          >
            <Text style={{ color: "#ffffff" }}>Add Wallet</Text>
          </TouchableOpacity>
        )}
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
        visible={addWalletModalVisible}
        onRequestClose={() => setAddWalletModalVisible(false)}
      >
        <BlurView intensity={10} style={styles.centeredView}>
          <View
            style={{
              margin: 20,
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
            <Text style={{ color: "#FFF", fontSize: 18, marginBottom: 20 }}>
              Choose an option
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "#6C6CF4",
                padding: 10,
                width: "100%",
                justifyContent: "center",
                borderRadius: 30,
                height: 60,
                alignItems: "center",
                marginBottom: 20,
              }}
              onPress={handleCreateWallet}
            >
              <Text style={styles.cancelButtonText}>Create Wallet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: "#6C6CF4",
                padding: 10,
                width: "100%",
                justifyContent: "center",
                borderRadius: 30,
                height: 60,
                alignItems: "center",
              }}
              onPress={handleImportWallet}
            >
              <Text style={styles.cancelButtonText}>Import Wallet</Text>
            </TouchableOpacity>
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
              onPress={() => setAddWalletModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

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
            <ScrollView
              style={{
                width: "100%",
                height: 380,
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
            </ScrollView>
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
              backgroundColor: "#484692", // Consistent dark background
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text style={styles.modalTitle}>Value:</Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Icon name="settings" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            {dropdownVisible && (
              <View
                style={{
                  position: "absolute",
                  right: 10,
                  top: 40, // Adjusted to show above the content
                  backgroundColor: "#24234C",
                  borderRadius: 5,
                  padding: 10,
                  zIndex: 1, // Ensure it overlays other content
                }}
              >
                <TouchableOpacity
                  onPress={handleDeleteCard}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: "#FFF", fontSize: 16 }}>
                    Delete Card
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: 40,
                marginBottom: 30,
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
