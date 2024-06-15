// WalletScreen.js
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
import WalletScreenStyle from "../styles/WalletScreenStyle";
import { BlurView } from "expo-blur";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import { useTranslation } from "react-i18next";

function WalletScreen({ route }) {
  const { isDarkMode } = useContext(DarkModeContext);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const { t } = useTranslation();
  const { currencyUnit } = useContext(CryptoContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [addIconModalVisible, setAddIconModalVisible] = useState(false);
  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false);
  const scrollViewRef = useRef();
  const { cryptoCount, setCryptoCount } = useContext(CryptoContext);
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#E0E0E0"];

  const handleDeleteCard = () => {
    setCryptoCards(
      cryptoCards.filter((card) => card.name !== selectedCardName)
    );
    setDropdownVisible(false);
    setModalVisible(false);
    setCryptoCount(cryptoCards.length - 1);
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
    setCryptoCount(cryptoCards.length);
  }, [cryptoCards.length]);

  const additionalCryptos = [
    {
      name: "Bitcoin",
      shortName: "BTC",
      balance: "0.0",
      icon: require("../assets/BitcoinIcon.png"),
      cardImage: require("../assets/Card3.png"),
    },
    {
      name: "Ethereum",
      shortName: "ETH",
      balance: "0.0",
      icon: require("../assets/EthereumIcon.png"),
      cardImage: require("../assets/Card54.png"),
    },
    {
      name: "USDT",
      shortName: "USDT",
      balance: "0.0",
      icon: require("../assets/USDTIcon.png"),
      cardImage: require("../assets/Card43.png"),
    },
    {
      name: "Litecoin",
      shortName: "LTC",
      balance: "0.0",
      icon: require("../assets/LitecoinIcon.png"),
      cardImage: require("../assets/Card1.png"),
    },
    {
      name: "Bitcoin Cash",
      shortName: "BCH",
      balance: "0.0",
      icon: require("../assets/BitcoinCashIcon.png"),
      cardImage: require("../assets/Card2.png"),
    },
    {
      name: "Dash",
      shortName: "DASH",
      balance: "0.0",
      icon: require("../assets/DashIcon.png"),
      cardImage: require("../assets/Card3.png"),
    },
    {
      name: "Cardano",
      shortName: "ADA",
      balance: "0.0",
      icon: require("../assets/CardanoIcon.png"),
      cardImage: require("../assets/Card5.png"),
    },
    {
      name: "Polkadot",
      shortName: "DOT",
      balance: "0.0",
      icon: require("../assets/PolkadotIcon.png"),
      cardImage: require("../assets/Card6.png"),
    },
    {
      name: "Chainlink",
      shortName: "LINK",
      balance: "0.0",
      icon: require("../assets/ChainlinkIcon.png"),
      cardImage: require("../assets/Card7.png"),
    },
    {
      name: "Stellar",
      shortName: "XLM",
      balance: "0.0",
      icon: require("../assets/StellarIcon.png"),
      cardImage: require("../assets/Card8.png"),
    },
    {
      name: "Dogecoin",
      shortName: "DOGE",
      balance: "0.0",
      icon: require("../assets/DogecoinIcon.png"),
      cardImage: require("../assets/Card9.png"),
    },
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
      setCryptoCount(newCryptoCards.length);
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
        paddingTop: 20,
        backgroundColor: "#121212",
        alignItems: "center",
        justifyContent: "center",
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
                color: "#fff",
                textAlign: "left", // Ensure left alignment
              }}
            >
              {t("Total balance")}
            </Text>
            <Text
              style={{
                fontSize: 36,
                fontWeight: "bold",
                color: "#fff",
                textAlign: "left", // Ensure left alignment
              }}
            >
              {`${calculateTotalBalance()} `}
              <Text
                style={{
                  fontSize: 18, // Smaller font size for the unit
                  textAlign: "left", // Ensure left alignment
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
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
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
              style={styles.card}
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
                fontSize: 40,
                marginBottom: 30,
              }}
            >
              {selectedAddress}
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
