//WalletScreen.js
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
import { CryptoContext, DarkModeContext, usdtCrypto } from "./CryptoContext";
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
  const [tipModalVisible, setTipModalVisible] = useState(false); // 新增提示 modal 状态
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false); // 二次确认弹窗状态
  const [cryptoCards, setCryptoCards] = useState([]);
  const scrollViewRef = useRef();
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];

  const addDefaultUSDT = () => {
    if (cryptoCards.length === 0) {
      handleAddCrypto(usdtCrypto);
    }
  };

  const handleDeleteCard = () => {
    const updatedCards = cryptoCards.filter(
      (card) => card.name !== selectedCardName
    );
    setCryptoCards(updatedCards);
    setCryptoCount(updatedCards.length);
    setAddedCryptos(updatedCards);
    setDropdownVisible(false);
    setModalVisible(false);
    setDeleteConfirmVisible(false); // 关闭二次确认弹窗
  };

  const handleConfirmDelete = () => {
    setDeleteConfirmVisible(true); // 显示二次确认弹窗
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
    setAddWalletModalVisible(false); // 关闭 addWalletModal
    setTipModalVisible(true); // 显示提示 modal
  };

  const handleImportWallet = () => {
    setAddWalletModalVisible(false); // 关闭 addWalletModal
    setTipModalVisible(true); // 显示提示 modal
  };

  const handleContinue = () => {
    setTipModalVisible(false); // 关闭提示 modal
    setProcessModalVisible(true); // 显示 processModal
  };

  const handleLetsGo = () => {
    setProcessModalVisible(false);
    setAddCryptoVisible(true); // 显示 addCryptoModal
  };

  const calculateTotalBalance = () => {
    return cryptoCards
      .reduce((total, card) => total + parseFloat(card.balance), 0)
      .toFixed(2);
  };

  // 处理Process Modal的消息显示逻辑
  const [processMessages, setProcessMessages] = useState([]);
  const [showLetsGoButton, setShowLetsGoButton] = useState(false);

  useEffect(() => {
    if (processModalVisible) {
      setShowLetsGoButton(false);
      setProcessMessages([t("Creating your wallet")]);
      const timer1 = setTimeout(() => {
        setProcessMessages((prevMessages) => [
          ...prevMessages,
          t("Generating your accounts"),
        ]);
      }, 1000);
      const timer2 = setTimeout(() => {
        setProcessMessages((prevMessages) => [
          ...prevMessages,
          t("Encrypting your data"),
        ]);
      }, 2000);
      const timer3 = setTimeout(() => {
        setProcessMessages((prevMessages) => [
          ...prevMessages,
          t("Your wallet is now ready"),
        ]);
      }, 3000);
      const timer4 = setTimeout(() => {
        setShowLetsGoButton(true);
      }, 4000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
      };
    }
  }, [processModalVisible, t]);

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
          <View style={WalletScreenStyle.centeredContent}>
            <ImageBackground
              source={
                isDarkMode
                  ? require("../assets/AddWallet.png")
                  : require("../assets/Card22.png")
              }
              style={WalletScreenStyle.addWalletImage}
              imageStyle={WalletScreenStyle.addWalletImageBorder}
            >
              <TouchableOpacity
                onPress={() => setAddWalletModalVisible(true)} // 显示 addWalletModal
                style={WalletScreenStyle.addWalletButton}
              >
                <Text style={WalletScreenStyle.addWalletButtonText}>
                  {t("Add Wallet")}
                </Text>
              </TouchableOpacity>
            </ImageBackground>
            <View style={WalletScreenStyle.walletInfoContainer}>
              <Text style={WalletScreenStyle.securityTitle}>
                {t("Security in your hands")}
              </Text>
              <Text style={WalletScreenStyle.walletInfoText}>
                {t(
                  "LIKKIM supports 27 blockchains and over 10,000 cryptocurrencies."
                )}
              </Text>
            </View>
          </View>
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

      {/* Add Wallet Modal */}
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
              <Text style={WalletScreenStyle.ButtonText}>
                {t("Create Wallet")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.modalButton}
              onPress={handleImportWallet}
            >
              <Text style={WalletScreenStyle.ButtonText}>
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

      {/* 提示 Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={tipModalVisible}
        onRequestClose={() => setTipModalVisible(false)}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.modalView}>
            <Text style={WalletScreenStyle.alertModalTitle}>
              {t("Recovery Phrase")}
            </Text>
            <Text style={WalletScreenStyle.alertModalSubtitle}>
              {t("Read the following, then save the phrase securely.")}
            </Text>
            <Text style={WalletScreenStyle.alertModalContent}>
              {`🔑  ${t(
                "The recovery phrase alone gives you full access to your wallets and funds."
              )}\n\n`}
              {`🔒  ${t(
                "If you forget your password, you can use the recovery phrase to get back into your wallet."
              )}\n\n`}
              {`🚫  ${t(
                "LIKKIM will never ask for your recovery phrase."
              )}\n\n`}
              {`🤫  ${t("Never share it with anyone.")}`}
            </Text>
            <TouchableOpacity
              style={WalletScreenStyle.alertModalButton}
              onPress={handleContinue}
            >
              <Text style={WalletScreenStyle.ButtonText}>{t("Continue")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setTipModalVisible(false)}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

      {/* Process Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={processModalVisible}
        onRequestClose={() => setProcessModalVisible(false)}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.processModalView}>
            {processMessages.map((message, index) => (
              <Text key={index} style={WalletScreenStyle.processButtonText}>
                {message}
              </Text>
            ))}
            {showLetsGoButton && (
              <TouchableOpacity
                style={WalletScreenStyle.modalButton}
                onPress={handleLetsGo}
              >
                <Text style={WalletScreenStyle.ButtonText}>
                  {t("Let's Go")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </BlurView>
      </Modal>

      {/* Add Crypto Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addCryptoVisible}
        onRequestClose={() => {
          setAddCryptoVisible(false);
          addDefaultUSDT();
        }}
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
                    <View style={WalletScreenStyle.addCryptoOverlay} />
                    <View style={WalletScreenStyle.iconAndTextContainer}>
                      <Image
                        source={crypto.icon}
                        style={WalletScreenStyle.addCardIcon}
                      />
                      <Text style={WalletScreenStyle.addCryptoImageText}>
                        {crypto.shortName}
                      </Text>
                    </View>
                  </ImageBackground>
                  <Text style={WalletScreenStyle.addCryptoText}>
                    {crypto.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => {
                setAddCryptoVisible(false);
                addDefaultUSDT();
              }}
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
                <Icon name="settings" size={24} color={iconColor} />
              </TouchableOpacity>
            </View>
            {dropdownVisible && (
              <View style={WalletScreenStyle.dropdown}>
                <TouchableOpacity
                  onPress={handleConfirmDelete}
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

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteConfirmVisible}
        onRequestClose={() => setDeleteConfirmVisible(false)}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.modalView}>
            <Text style={WalletScreenStyle.alertModalTitle}>
              {t("Remove Chain Account")}
            </Text>
            <Text style={WalletScreenStyle.modalSubtitle}>
              {t("This chain account will be removed")}
            </Text>
            <TouchableOpacity
              style={WalletScreenStyle.removeModalButton}
              onPress={handleDeleteCard}
            >
              <Text style={WalletScreenStyle.ButtonText}>{t("Remove")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.removeCancelButton}
              onPress={() => setDeleteConfirmVisible(false)}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>
    </LinearGradient>
  );
}

export default WalletScreen;
