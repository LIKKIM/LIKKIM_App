// WalletScreen.js
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  TextInput,
  Animated,
  Easing,
  ScrollView,
  Clipboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import WalletScreenStyles from "../styles/WalletScreenStyle";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CryptoContext, DarkModeContext, usdtCrypto } from "./CryptoContext";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg"; // 确保导入 QRCode 模块
import PriceChartCom from "./PriceChartCom";

function WalletScreen({ route, navigation }) {
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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("History");
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false); // 新增地址模态窗口的状态
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(null);
  const [addIconModalVisible, setAddIconModalVisible] = useState(false);
  const [addWalletModalVisible, setAddWalletModalVisible] = useState(false);
  const [tipModalVisible, setTipModalVisible] = useState(false);
  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [recoveryPhraseModalVisible, setRecoveryPhraseModalVisible] =
    useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [cryptoCards, setCryptoCards] = useState([]);
  const [priceChanges, setPriceChanges] = useState({});
  const scrollViewRef = useRef();
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const darkColorsDown = ["#212146", "#101021"];
  const lightColorsDown = ["#FDFCFD", "#EDEBEF"];
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const placeholderColor = isDarkMode ? "#ffffff" : "#24234C";
  const [selectedWords, setSelectedWords] = useState(Array(12).fill(null));
  const [importPhraseModalVisible, setImportPhraseModalVisible] =
    useState(false);
  const [phrase, setPhrase] = useState("");
  const [animation] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const cardRefs = useRef([]);
  const cardStartPositions = useRef([]);
  const scrollYOffset = useRef(0);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [processMessages, setProcessMessages] = useState([]);
  const [showLetsGoButton, setShowLetsGoButton] = useState(false);
  const [tabOpacity] = useState(new Animated.Value(1));
  const [cardInfoVisible, setCardInfoVisible] = useState(false); // 控制卡片信息显示
  const mnemonic = [
    ["apple", "banana", "cherry"],
    ["dog", "elephant", "frog"],
    ["grape", "honey", "ice"],
    ["jack", "kite", "lemon"],
    ["mango", "nest", "orange"],
    ["peach", "queen", "rabbit"],
    ["sun", "tiger", "umbrella"],
    ["vase", "wolf", "xray"],
    ["yellow", "zebra", "alpha"],
    ["bravo", "charlie", "delta"],
    ["echo", "foxtrot", "golf"],
    ["hotel", "india", "juliet"],
  ];

  const handleWordSelect = (index, word) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords[index] = word;
    setSelectedWords(newSelectedWords);
  };

  const allWordsSelected = selectedWords.every((word) => word !== null);
  // 点击 QR 代码图片时显示地址模态窗口
  const handleQRCodePress = (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedAddress(crypto.address);
    setSelectedCryptoIcon(crypto.icon);
    setAddressModalVisible(true);
  };

  useEffect(() => {
    if (modalVisible) {
      // 重置 tabOpacity 为 1
      Animated.timing(tabOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  useEffect(() => {
    // 根据条件触发动画
    if (cryptoCards.length > 0 && !modalVisible) {
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true,
      }).start();
    }
  }, [cryptoCards.length, modalVisible, opacityAnim]);

  useEffect(() => {
    const loadCryptoCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem("cryptoCards");
        console.log(storedCards);
        if (storedCards !== null) {
          setCryptoCards(JSON.parse(storedCards));
          setAddedCryptos(JSON.parse(storedCards)); // 加载时同步 addedCryptos
        }
      } catch (error) {
        console.error("Error loading crypto cards:", error);
      }
    };
    loadCryptoCards();
  }, []);

  useEffect(() => {
    const saveCryptoCards = async () => {
      try {
        await AsyncStorage.setItem("cryptoCards", JSON.stringify(cryptoCards));
        await AsyncStorage.setItem("addedCryptos", JSON.stringify(cryptoCards)); // 保存时同步 addedCryptos
      } catch (error) {
        console.error("Error saving crypto cards:", error);
      }
    };
    saveCryptoCards();
  }, [cryptoCards]);

  useEffect(() => {
    const fetchPriceChanges = async () => {
      const changes = {};
      for (const card of cryptoCards) {
        try {
          const response = await fetch(
            `https://df.likkim.com/api/market/index-tickers?instId=${card.shortName}-USD`
          );
          const data = await response.json();
          if (data.code === 0 && data.data) {
            changes[card.shortName] = {
              priceChange: data.data.last, // 保存最新价格
              percentageChange: data.data.changePercent, // 直接使用API返回的百分比变化
            };
          }
        } catch (error) {
          console.error(
            `Error fetching price change for ${card.shortName}:`,
            error
          );
        }
      }
      setPriceChanges(changes);
    };
    if (cryptoCards.length > 0) {
      fetchPriceChanges();
    }
  }, [cryptoCards]);

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
    setDeleteConfirmVisible(false);
    setSelectedCardIndex(null);
    animation.setValue(0); // 重置动画
    navigation.setParams({ showDeleteConfirmModal: false });
  };

  const handleConfirmDelete = () => {
    setDeleteConfirmVisible(true);
    setDropdownVisible(false);
  };

  useEffect(() => {
    if (route.params?.showAddModal) {
      setAddCryptoVisible(true);
    }
    if (route.params?.showAddIconModal) {
      setAddIconModalVisible(true);
    }
    if (route.params?.showDeleteConfirmModal) {
      setDeleteConfirmVisible(true);
    } else {
      setDeleteConfirmVisible(false);
    }
  }, [route.params]);

  useEffect(() => {
    setCryptoCount(cryptoCards.length);
  }, [cryptoCards.length]);

  useEffect(() => {
    navigation.setParams({
      isModalVisible: modalVisible,
      showAddModal: addCryptoVisible,
    });
  }, [modalVisible, addCryptoVisible]);

  const animateCard = (index) => {
    setSelectedCardIndex(index);
    cardRefs.current[index]?.measure((fx, fy, width, height, px, py) => {
      cardStartPositions.current[index] = py; // 记录每个卡片的初始位置
      const endPosition = 120 - (scrollYOffset.current || 0); // 考虑 scrollTo 的 Y 偏移量

      // 确保 start 和 end 位置都是有效的数值
      if (isNaN(cardStartPositions.current[index]) || isNaN(endPosition)) {
        console.error("Invalid position values", {
          startPosition: cardStartPositions.current[index],
          endPosition: endPosition,
        });
        return;
      }

      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        stiffness: 250, // 增加刚度
        damping: 25, // 增加阻尼
        mass: 1, // 质量
        overshootClamping: false, // 允许超出目标值
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }).start(() => {
        setModalVisible(true);
        setTimeout(() => {
          setCardInfoVisible(true); // 延迟显示卡片信息
        }, 300); // 根据需求调整延迟时间
      });
    });
  };

  const closeModal = () => {
    scrollViewRef?.current.setNativeProps({ scrollEnabled: true });

    // 动画隐藏顶部标签
    Animated.timing(tabOpacity, {
      toValue: 0, // 透明
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // 在顶部标签隐藏完成后，执行卡片位置还原动画
      cardStartPositions.current[selectedCardIndex] = 0;
      Animated.spring(animation, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
        stiffness: 250, // 增加刚度
        damping: 25, // 增加阻尼
        mass: 1, // 质量
        overshootClamping: false,
        restDisplacementThreshold: 0.01,
        restSpeedThreshold: 0.01,
      }).start(() => {
        setModalVisible(false);
        setCardInfoVisible(false);
        setSelectedCardIndex(null);
      });
    });
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [modalVisible, fadeAnim]);

  const handleCardPress = (cryptoName, index) => {
    const crypto = cryptoCards.find((card) => card.name === cryptoName);
    setSelectedAddress(crypto?.address || "Unknown");
    setSelectedCardName(cryptoName);
    setSelectedCrypto(crypto);
    setActiveTab("Prices");
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
    setTimeout(() => {
      scrollYOffset.current = 0;
      animateCard(index);
    }, 300); // 确保在滚动完成后再设置偏移量并开始动画
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
    setAddWalletModalVisible(false);
    setTipModalVisible(true);
  };

  const handleImportWallet = () => {
    setAddWalletModalVisible(false);
    setImportPhraseModalVisible(true);
  };

  const handleImport = (phrase) => {
    // 处理导入逻辑
    setImportPhraseModalVisible(false);
    setProcessModalVisible(true);
  };

  const handleContinue = () => {
    setTipModalVisible(false);
    setRecoveryPhraseModalVisible(true);
  };

  const handlePhraseSaved = () => {
    setRecoveryPhraseModalVisible(false);
    setProcessModalVisible(true);
  };

  const handleLetsGo = () => {
    setProcessModalVisible(false);
    setAddCryptoVisible(true);
  };

  const calculateTotalBalance = () => {
    return cryptoCards
      .reduce((total, card) => total + parseFloat(card.balance), 0)
      .toFixed(2);
  };

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

  const animatedCardStyle = (index) => {
    const cardStartPosition = cardStartPositions.current[index] || 0;
    const endPosition = 120 - (scrollYOffset.current || 0); // 考虑 scrollTo 的 Y 偏移量
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, endPosition - cardStartPosition],
    });

    return {
      transform: [{ translateY }],
      zIndex: 9,
    };
  };

  useEffect(() => {
    if (modalVisible) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      setTimeout(() => {
        scrollYOffset.current = 0;
      }, 300); // 确保在滚动完成后再设置偏移量
    }
  }, [modalVisible]);

  //fix card 初始化紀錄位置
  const initCardPosition = (_ref, _index) =>
    _ref?.measure(
      (fx, fy, width, height, px, py) =>
        (cardStartPositions.current[_index] = py)
    );

  const renderTabContent = () => {
    switch (activeTab) {
      case "History":
        return (
          <>
            <Text style={WalletScreenStyle.historyTitle}>
              {t("Transaction History")}
            </Text>
            <View style={WalletScreenStyle.historyContainer}>
              {transactionHistory.length === 0 ? (
                <Text style={WalletScreenStyle.noHistoryText}>
                  {t("No Histories")}
                </Text>
              ) : (
                transactionHistory.map((transaction, index) => (
                  <View key={index} style={WalletScreenStyle.historyItem}>
                    <Text style={WalletScreenStyle.historyItemText}>
                      {transaction.detail}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        );
      case "Prices":
        return (
          <>
            {/* TODO K线图表组件 */}

            <View style={WalletScreenStyle.priceContainer}>
              {/* 传入指定的instId&货币符号 */}
              <PriceChartCom
                instId={`${selectedCrypto?.shortName}-USD`}
                priceFla="$"
                parentScrollviewRef={scrollViewRef}
              />
            </View>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={WalletScreenStyle.linearGradient}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ref={scrollViewRef}
        contentContainerStyle={[
          WalletScreenStyle.scrollViewContent,
          modalVisible && { overflow: "hidden", height: "100%" },
          cryptoCards.length !== 0 && !modalVisible && { paddingBottom: 130 },
        ]}
        style={[
          WalletScreenStyle.scrollView,
          modalVisible && { overflow: "hidden" },
        ]}
        onScroll={(event) => {
          if (!modalVisible) {
            scrollYOffset.current = event.nativeEvent.contentOffset.y;
          }
        }}
        scrollEventThrottle={16} // 滚动事件节流，以确保 onScroll 事件不会频繁触发
      >
        <Animated.View
          style={[
            WalletScreenStyle.totalBalanceContainer,
            { opacity: opacityAnim },
          ]}
        >
          {cryptoCards.length > 0 && !modalVisible && (
            <>
              <Text style={WalletScreenStyle.totalBalanceText}>
                {t("Total Balance")}
              </Text>
              <Text style={WalletScreenStyle.totalBalanceAmount}>
                {`${calculateTotalBalance()}`}
                <Text style={WalletScreenStyle.currencyUnit}>
                  {currencyUnit}
                </Text>
              </Text>
            </>
          )}
        </Animated.View>

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
                onPress={() => setAddWalletModalVisible(true)}
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

        {cryptoCards.map((card, index) => {
          const isBlackText =
            card.shortName === "BTC" ||
            card.shortName === "USDT" ||
            card.shortName === "BCH" ||
            card.shortName === "DOT" ||
            card.shortName === "DOGE";
          const priceChange = priceChanges[card.shortName]?.priceChange || "0";
          const percentageChange =
            priceChanges[card.shortName]?.percentageChange || "0";
          return (
            <TouchableOpacity
              key={card.name}
              onPress={() => handleCardPress(card.name, index)}
              ref={(el) => {
                cardRefs.current[index] = el;
                initCardPosition(el, index);
              }}
              style={[
                WalletScreenStyle.cardContainer,
                selectedCardIndex === index && { zIndex: 3 },
              ]}
              disabled={modalVisible} // 禁用卡片点击
            >
              <Animated.View
                style={[
                  WalletScreenStyle.card,
                  index === 0
                    ? WalletScreenStyle.cardFirst
                    : WalletScreenStyle.cardOthers,
                  selectedCardIndex === index && animatedCardStyle(index),
                ]}
              >
                <ImageBackground
                  source={card.cardImage}
                  style={{ width: "100%", height: "100%" }}
                  imageStyle={{ borderRadius: 16 }}
                >
                  <Image
                    source={card.icon}
                    style={WalletScreenStyle.cardIcon}
                  />
                  <Text
                    style={[
                      WalletScreenStyle.cardName,
                      isBlackText && { color: "#121518" },
                    ]}
                  >
                    {card.name}
                  </Text>
                  <Text
                    style={[
                      WalletScreenStyle.cardShortName,
                      //  isBlackText && { color: "#676776" },
                      isBlackText && { color: "#121518" },
                    ]}
                  >
                    {card.shortName}
                  </Text>
                  {!modalVisible && (
                    <>
                      <Text
                        style={[
                          WalletScreenStyle.cardBalance,
                          isBlackText && { color: "#121518" },
                        ]}
                      >
                        {`${card.balance} ${card.shortName}`}
                      </Text>
                      <View style={WalletScreenStyle.priceChangeView}>
                        <Text
                          style={{
                            color: priceChange > 0 ? "#6FFFB0" : "#FF6F61",
                            fontWeight: "bold",
                          }}
                        >
                          {priceChanges[card.shortName]?.percentageChange > 0
                            ? "+"
                            : ""}
                          {priceChanges[card.shortName]?.percentageChange}%
                        </Text>
                        <Text
                          style={[
                            WalletScreenStyle.balanceShortName,
                            //  isBlackText && { color: "#676776" },
                            isBlackText && { color: "#121518" },
                          ]}
                        >
                          {`${card.balance} ${currencyUnit}`}
                        </Text>
                      </View>
                    </>
                  )}
                  {modalVisible && cardInfoVisible && (
                    <View
                      style={{
                        width: 326,
                        height: 206,
                        justifyContent: "center",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => handleQRCodePress(card)}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: 0,
                        }}
                      >
                        <Image
                          source={require("../assets/icon/QR.png")}
                          style={[
                            WalletScreenStyle.QRImg,
                            isBlackText && { tintColor: "#121518" },
                          ]}
                        />
                      </TouchableOpacity>
                      <Text
                        style={[
                          WalletScreenStyle.cardBalanceCenter,
                          isBlackText && { color: "#121518" },
                        ]}
                      >
                        {`${card.balance} ${card.shortName}`}
                      </Text>
                      <Text
                        style={[
                          WalletScreenStyle.balanceShortNameCenter,
                          //  isBlackText && { color: "#676776" },
                          isBlackText && { color: "#121518" },
                        ]}
                      >
                        {`${card.balance} ${currencyUnit}`}
                      </Text>
                    </View>
                  )}
                </ImageBackground>
              </Animated.View>
            </TouchableOpacity>
          );
        })}
        {/* 数字货币弹窗表面层view */}
        {modalVisible && (
          <Animated.View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: 10,
              top: 236,
              opacity: tabOpacity, // 使用 tabOpacity 控制透明度
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <TouchableOpacity
                style={[
                  WalletScreenStyle.tabButton,
                  activeTab === "Prices" && WalletScreenStyle.activeTabButton,
                ]}
                onPress={() => setActiveTab("Prices")}
              >
                <Text
                  style={[
                    WalletScreenStyle.tabButtonText,
                    activeTab === "Prices" &&
                      WalletScreenStyle.activeTabButtonText,
                  ]}
                >
                  {t("Prices")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  WalletScreenStyle.tabButton,
                  activeTab === "History" && WalletScreenStyle.activeTabButton,
                ]}
                onPress={() => setActiveTab("History")}
              >
                <Text
                  style={[
                    WalletScreenStyle.tabButtonText,
                    activeTab === "History" &&
                      WalletScreenStyle.activeTabButtonText,
                  ]}
                >
                  {t("History")}
                </Text>
              </TouchableOpacity>
            </View>

            {renderTabContent()}
            <TouchableOpacity
              style={WalletScreenStyle.cancelButtonCryptoCard}
              onPress={closeModal}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* 数字货币弹窗背景层view */}
        {modalVisible && (
          <Animated.View
            style={[WalletScreenStyle.cardModalView, { opacity: fadeAnim }]}
          >
            <LinearGradient
              colors={isDarkMode ? darkColorsDown : lightColorsDown}
              style={[WalletScreenStyle.cardModalView]}
            ></LinearGradient>
          </Animated.View>
        )}
      </ScrollView>

      {/* 显示选择的加密货币地址的模态窗口 */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addressModalVisible}
        onRequestClose={() => setAddressModalVisible(false)}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.receiveModalView}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={WalletScreenStyle.modalTitle}>
                {t("Address for")}
              </Text>
              {selectedCryptoIcon && (
                <Image
                  source={selectedCryptoIcon}
                  style={{
                    width: 24,
                    height: 24,
                    marginLeft: 5,
                    marginRight: 5,
                  }}
                />
              )}
              <Text style={WalletScreenStyle.modalTitle}>
                {selectedCrypto}:
              </Text>
            </View>
            <Text style={WalletScreenStyle.subtitleText}>
              {t("Assets can only be sent within the same chain.")}
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={WalletScreenStyle.addressText}>
                {selectedAddress}
              </Text>
              <TouchableOpacity
                onPress={() => Clipboard.setString(selectedAddress)}
              >
                <Icon
                  name="content-copy"
                  size={24}
                  color={isDarkMode ? "#ffffff" : "#676776"}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                backgroundColor: "#fff",
                height: 220,
                width: 220,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 12,
              }}
            >
              <QRCode value={selectedAddress} size={200} />
            </View>
            <TouchableOpacity
              style={WalletScreenStyle.cancelAddressButton}
              onPress={() => setAddressModalVisible(false)}
            >
              <Text style={WalletScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Modal>

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

      {/* Import Phrase Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={importPhraseModalVisible}
        onRequestClose={() => setImportPhraseModalVisible(false)}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.modalView}>
            <Text style={WalletScreenStyle.alertModalTitle}>
              {t("Import Recovery Phrase")}
            </Text>
            <TextInput
              style={WalletScreenStyle.textInput}
              value={phrase}
              onChangeText={setPhrase}
              placeholder={t("Use spaces between words")}
              placeholderTextColor={placeholderColor}
              multiline
            />
            <TouchableOpacity
              style={WalletScreenStyle.alertModalButton}
              onPress={() => handleImport(phrase)}
            >
              <Text style={WalletScreenStyle.ButtonText}>
                {t("Import Wallet")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setImportPhraseModalVisible(false)}
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

      {/* Phrase Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={recoveryPhraseModalVisible}
        onRequestClose={() => setRecoveryPhraseModalVisible(false)}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.phraseModalView}>
            <Text style={WalletScreenStyle.alertModalTitle}>
              {t("Never share the recovery phrase.")}
            </Text>
            <Text style={WalletScreenStyle.alertModalSubtitle}>
              {t(
                "Please save the recovery phrase displayed on the LIKKIM hardware wallet screen."
              )}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <Text style={{ color: secondTextColor, marginRight: 10 }}>
                {t("Scroll down to view all words")}
              </Text>
              <Icon name="swipe-vertical" size={26} color={secondTextColor} />
            </View>
            <ScrollView style={{ width: "100%", height: 300 }}>
              {mnemonic.map((words, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Text style={{ marginRight: 10, color: secondTextColor }}>
                    {index + 1}.
                  </Text>
                  {words.map((word) => (
                    <TouchableOpacity
                      key={word}
                      style={{
                        padding: 10,
                        borderWidth: 2,
                        borderColor:
                          selectedWords[index] === word ? "#6C6CF4" : "grey",
                        borderRadius: 5,
                        marginHorizontal: 5,
                      }}
                      onPress={() => handleWordSelect(index, word)}
                    >
                      <Text style={{ color: secondTextColor }}>{word}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
            {!allWordsSelected && (
              <Text
                style={[WalletScreenStyle.highlightText, { marginTop: 10 }]}
              >
                {t("You must select all 12 words before you can proceed.")}
              </Text>
            )}
            <TouchableOpacity
              style={[
                WalletScreenStyle.alertModalButton,
                { opacity: allWordsSelected ? 1 : 0.5 },
              ]}
              onPress={handlePhraseSaved}
              disabled={!allWordsSelected}
            >
              <Text style={WalletScreenStyle.ButtonText}>
                {t("Verify and I've Saved the Phrase")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.cancelButton}
              onPress={() => setRecoveryPhraseModalVisible(false)}
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
            <ScrollView
              style={WalletScreenStyle.addCryptoScrollView}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
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

      {/* Delete Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={deleteConfirmVisible}
        onRequestClose={() => {
          setDeleteConfirmVisible(false);
          navigation.setParams({ showDeleteConfirmModal: false }); // 重置参数
        }}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.deleteModalView}>
            <Text style={WalletScreenStyle.alertModalTitle}>
              {t("Remove Chain Account")}
            </Text>
            <Text style={WalletScreenStyle.modalSubtitle}>
              {t("This chain account will be removed")}
            </Text>
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Image
                source={require("../assets/modal/Delete.png")}
                style={WalletScreenStyle.deleteImg}
              />
            </View>
            <TouchableOpacity
              style={WalletScreenStyle.removeModalButton}
              onPress={handleDeleteCard}
            >
              <Text style={WalletScreenStyle.ButtonText}>{t("Remove")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={WalletScreenStyle.removeCancelButton}
              onPress={() => {
                setDeleteConfirmVisible(false);
                navigation.setParams({ showDeleteConfirmModal: false }); // 重置参数
              }}
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
