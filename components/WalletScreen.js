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
  const [cryptoCards, setCryptoCards] = useState([]);
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
    setAddedCryptos(updatedCards);
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
      setAddedCryptos(newCryptoCards);
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
      style={WalletScreenStyle.linearGradient}
    >
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={WalletScreenStyle.scrollViewContent}
        style={WalletScreenStyle.scrollView}
      >
        {cryptoCards.length > 0 && (
          <View style={WalletScreenStyle.totalBalanceContainer}>
            <Text style={WalletScreenStyle.totalBalanceText}>
              {t("Total Balance")}
            </Text>
            <Text style={WalletScreenStyle.totalBalanceAmount}>
              {`${calculateTotalBalance()}`}
              <Text style={WalletScreenStyle.currencyUnit}>{currencyUnit}</Text>
            </Text>
          </View>
        )}

        {cryptoCards.length === 0 && (
          <ImageBackground
            source={require("../assets/AddWallet.png")}
            style={WalletScreenStyle.addWalletImage}
            imageStyle={WalletScreenStyle.addWalletImageBorder}
          >
            <TouchableOpacity
              onPress={() => setAddWalletModalVisible(true)}
              style={WalletScreenStyle.addWalletButton}
            >
              <Text style={WalletScreenStyle.addWalletButtonText}>
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
              <View style={WalletScreenStyle.overlay} />
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
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.modalView}>
            <TouchableOpacity
              style={WalletScreenStyle.modalButton}
              onPress={handleCreateWallet}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Create Wallet")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.modalButton}
              onPress={handleImportWallet}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Import Wallet")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setAddWalletModalVisible(false)}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
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
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.addCryptoModalView}>
            <ScrollView style={WalletScreenStyle.addCryptoScrollView}>
              {additionalCryptos.map((crypto) => (
                <TouchableOpacity
                  key={crypto.name}
                  style={WalletScreenStyle.addCryptoButton}
                  onPress={() => handleAddCrypto(crypto)}
                >
                  <ImageBackground
                    source={crypto.cardImage}
                    style={WalletScreenStyle.addCryptoImage}
                    imageStyle={{ borderRadius: 12 }}
                  >
                    <Text style={WalletScreenStyle.addCryptoImageText}>
                      {crypto.name}
                    </Text>
                  </ImageBackground>
                  <Text style={WalletScreenStyle.addCryptoText}>
                    {crypto.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setAddCryptoVisible(false)}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
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
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.modalView}>
            <View style={WalletScreenStyle.modalHeader}>
              <Text style={WalletScreenStyle.modalTitle}>{t("Value:")}</Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(!dropdownVisible)}
              >
                <Icon name="settings" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
            {dropdownVisible && (
              <View style={WalletScreenStyle.dropdown}>
                <TouchableOpacity
                  onPress={handleDeleteCard}
                  style={WalletScreenStyle.dropdownButton}
                >
                  <Text style={WalletScreenStyle.dropdownButtonText}>
                    {t("Delete Card")}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            <View style={WalletScreenStyle.modalIconContainer}>
              <Image
                source={selectedCrypto?.icon}
                style={WalletScreenStyle.modalIcon}
              />
              <Text style={WalletScreenStyle.modalCryptoName}>
                {selectedCrypto?.name}
              </Text>
            </View>
            <Text style={WalletScreenStyle.modalBalanceLabel}>
              {t("Balance")}
            </Text>
            <Text style={WalletScreenStyle.modalBalance}>
              {selectedCrypto?.balance || "0.0"} {currencyUnit}
            </Text>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

export default WalletScreen;
