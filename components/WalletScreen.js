import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { lightTheme, darkTheme } from "../styles";
import WalletScreenStyles from "../styles/WalletScreenStyle";
import { BlurView } from "expo-blur";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import { useTranslation } from "react-i18next";

function WalletScreen({ route }) {
  const {
    additionalCryptos,
    cryptoCount,
    setCryptoCount,
    currencyUnit,
    addedCryptos,
    setAddedCryptos,
  } = useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const WalletScreenStyle = WalletScreenStyles(isDarkMode);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { t } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [addIconModalVisible, setAddIconModalVisible] = useState(false);
  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false);
  const [cryptoCards, setCryptoCards] = useState([]); // 初始化为空数组
  const scrollViewRef = useRef();
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#E0E0E0"];

  const handleDeleteCard = () => {
    const updatedCards = cryptoCards.filter(
      (card) => card.name !== selectedCardName
    );
    setCryptoCards(updatedCards);
    setCryptoCount(updatedCards.length);
    setAddedCryptos(updatedCards); // 同步更新 addedCryptos
    setDropdownVisible(false);
    setModalVisible(false);
  };

  useEffect(() => {
    if (route.params?.showAddModal) {
      setAddCryptoVisible(true);
    }
    if (route.params?.showAddIconModal) {
      setAddIconModalVisible(true);
    }
  }, [route.params]);

  useEffect(() => {
    setCryptoCount(cryptoCards.length);
  }, [cryptoCards.length]);

  const handleCardPress = (cryptoName, index) => {
    const crypto = cryptoCards.find((card) => card.name === cryptoName);
    if (selectedCardName === cryptoName) {
      setSelectedCrypto(crypto);
      setModalVisible(true);
    } else {
      setSelectedAddress(crypto?.address || "Unknown");
      setSelectedCardName(cryptoName);
      setSelectedCrypto(crypto);

      const cardHeight = 180;
      const topOffset = 160;
      const yOffset = Math.max(0, cardHeight * index - topOffset);
      scrollViewRef.current.scrollTo({ y: yOffset, animated: true });
    }
  };

  const handleAddCrypto = (crypto) => {
    if (!cryptoCards.find((card) => card.name === crypto.name)) {
      const newCryptoCards = [...cryptoCards, crypto];
      setCryptoCards(newCryptoCards);
      setCryptoCount(newCryptoCards.length);
      setAddedCryptos(newCryptoCards); // 更新已添加的加密货币
    }
    setAddCryptoVisible(false);
  };

  const handleCreateWallet = () => {
    setAddCryptoVisible(true);
    setAddWalletModalVisible(false);
  };

  const handleImportWallet = () => {
    setAddCryptoVisible(true);
    setAddWalletModalVisible(false);
  };

  const calculateTotalBalance = () => {
    return cryptoCards
      .reduce((total, card) => total + parseFloat(card.balance), 0)
      .toFixed(2);
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={{
        flex: 1,
        backgroundColor: "#121212",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{
          paddingTop: 20,
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{
          width: "100%",
          paddingHorizontal: 0,
        }}
      >
        {cryptoCards.length > 0 && (
          <View
            style={{
              width: 300,
              marginBottom: 40,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                marginVertical: 10,
                color: isDarkMode ? "#fff" : "#000",
                textAlign: "left",
              }}
            >
              {t("Total Balance")}
            </Text>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: isDarkMode ? "#fff" : "#000",
                textAlign: "left",
              }}
            >
              {`${calculateTotalBalance()}`}
              <Text
                style={{
                  marginLeft: 20,
                  fontSize: 18,
                  textAlign: "left",
                  color: "#ccc",
                  fontWeight: "normal",
                }}
              >
                {currencyUnit}
              </Text>
            </Text>
          </View>
        )}

        {cryptoCards.length === 0 && (
          <ImageBackground
            source={require("../assets/AddWallet.png")}
            style={{
              width: 300,
              height: 170,
              borderRadius: 20,
              overflow: "hidden",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#484692",
              shadowOffset: { width: 0, height: 0 },
              shadowColor: "#101021",
              shadowOpacity: 0.3,
              shadowRadius: 30,
              elevation: 20,
            }}
            imageStyle={{ borderRadius: 20 }}
          >
            <TouchableOpacity
              onPress={() => setAddWalletModalVisible(true)}
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#FFF", fontSize: 18, fontWeight: "bold" }}>
                {t("Add Wallet")}
              </Text>
            </TouchableOpacity>
          </ImageBackground>
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
              style={[
                WalletScreenStyle.card,
                index === 0
                  ? WalletScreenStyle.cardFirst
                  : WalletScreenStyle.cardOthers,
              ]}
              imageStyle={{ borderRadius: 16 }}
            >
              <View style={styles.overlay} />
              <Image source={card.icon} style={WalletScreenStyle.cardIcon} />
              <Text style={WalletScreenStyle.cardName}>{card.name}</Text>
              <Text style={WalletScreenStyle.cardShortName}>
                {card.shortName}
              </Text>
              <Text
                style={WalletScreenStyle.cardBalance}
              >{`${currencyUnit} ${card.balance}`}</Text>
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
              backgroundColor: "#24234C",
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
              <Text style={styles.cancelButtonText}>{t("Create Wallet")}</Text>
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
              <Text style={styles.cancelButtonText}>{t("Import Wallet")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setAddWalletModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t("Close")}</Text>
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
              minHeight: 400,
              width: "80%",
              backgroundColor: "#24234C",
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
              style={WalletScreenStyle.cancelButton}
              onPress={() => setAddCryptoVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t("Close")}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
      {/* 查看余额 */}
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
              backgroundColor: "#484692",
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
              <Text style={styles.modalTitle}>{t("Value:")}</Text>
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
                  top: 40,
                  backgroundColor: "#24234C",
                  borderRadius: 5,
                  padding: 10,
                  zIndex: 1,
                }}
              >
                <TouchableOpacity
                  onPress={handleDeleteCard}
                  style={{ padding: 10 }}
                >
                  <Text style={{ color: "#FFF", fontSize: 16 }}>
                    {t("Delete Card")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: 18,
                marginBottom: 10,
              }}
            >
              {t("Balance")}
            </Text>
            <Text
              style={{
                color: "#ffffff",
                textAlign: "center",
                fontSize: 40,
                marginBottom: 30,
              }}
            >
              {selectedCrypto?.balance || "0.0"} {currencyUnit}
            </Text>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>{t("Close")}</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

export default WalletScreen;
