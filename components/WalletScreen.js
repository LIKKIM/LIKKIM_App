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
  FlatList,
  Platform,
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
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import Constants from "expo-constants";
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
  const [searchQuery, setSearchQuery] = useState("");
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const restoreIdentifier = Constants.installationId;

  const filteredCryptos = additionalCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  const bleManagerRef = useRef(null);

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      console.log("Scanning started");
      setIsScanning(true);
      const scanOptions = { allowDuplicates: true };
      const scanFilter = null;

      bleManagerRef.current.startDeviceScan(
        scanFilter,
        scanOptions,
        (error, device) => {
          if (error) {
            console.error("BleManager scanning error:", error);
            if (error.errorCode === BleErrorCode.BluetoothUnsupported) {
              console.error("Bluetooth LE is unsupported on this device");
              setIsScanning(false);
              return;
            }
          } else if (device.name && device.name.includes("LIKKIM")) {
            setDevices((prevDevices) => {
              if (!prevDevices.find((d) => d.id === device.id)) {
                return [...prevDevices, device];
              }
              return prevDevices;
            });
            console.log("Scanned device:", device);
          }
        }
      );

      setTimeout(() => {
        console.log("Scanning stopped");
        bleManagerRef.current.stopDeviceScan();
        setIsScanning(false);
      }, 2000);
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };

  useEffect(() => {
    if (Platform.OS !== "web") {
      bleManagerRef.current = new BleManager({
        restoreStateIdentifier: restoreIdentifier,
      });

      const subscription = bleManagerRef.current.onStateChange((state) => {
        if (state === "PoweredOn") {
          scanDevices();
        }
      }, true);

      return () => {
        subscription.remove();
        bleManagerRef.current.destroy();
      };
    }
  }, []);

  const handleWordSelect = (index, word) => {
    const newSelectedWords = [...selectedWords];
    newSelectedWords[index] = word;
    setSelectedWords(newSelectedWords);
  };

  const handleDevicePress = async (device) => {
    setSelectedDevice(device);
    setModalVisible(false);

    try {
      // 连接设备
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务和特性");

      // 发送第一条命令 F0 01 02
      const connectionCommandData = new Uint8Array([0xf0, 0x01, 0x02]);
      const connectionCrc = crc16Modbus(connectionCommandData);
      const connectionCrcHighByte = (connectionCrc >> 8) & 0xff;
      const connectionCrcLowByte = connectionCrc & 0xff;
      const finalConnectionCommand = new Uint8Array([
        ...connectionCommandData,
        connectionCrcLowByte,
        connectionCrcHighByte,
        0x0d,
        0x0a,
      ]);
      const base64ConnectionCommand = base64.fromByteArray(
        finalConnectionCommand
      );

      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64ConnectionCommand
      );
      console.log("第一条蓝牙连接命令已发送: F0 01 02");

      // 延迟5毫秒
      await new Promise((resolve) => setTimeout(resolve, 5));

      // 发送第二条命令 F1 01 02
      await sendStartCommand(device);

      // 开始监听嵌入式设备的返回信息
      monitorVerificationCode(device);
    } catch (error) {
      console.error("设备连接或命令发送错误:", error);
    }
  };

  function crc16Modbus(arr) {
    let crc = 0xffff; // 初始值为0xFFFF
    for (let byte of arr) {
      crc ^= byte; // 按位异或
      for (let i = 0; i < 8; i++) {
        // 处理每一个字节的8位
        if (crc & 0x0001) {
          crc = (crc >> 1) ^ 0xa001; // 多项式为0xA001
        } else {
          crc = crc >> 1;
        }
      }
    }
    return crc & 0xffff; // 确保CRC值是16位
  }

  const sendStartCommand = async (device) => {
    // 命令数据，未包含CRC校验码
    const commandData = new Uint8Array([0xf1, 0x01, 0x02]);

    // 使用CRC-16-Modbus算法计算CRC校验码
    const crc = crc16Modbus(commandData);

    // 将CRC校验码转换为高位在前，低位在后的格式
    const crcHighByte = (crc >> 8) & 0xff;
    const crcLowByte = crc & 0xff;

    // 将原始命令数据、CRC校验码以及结束符组合成最终的命令
    const finalCommand = new Uint8Array([
      ...commandData,
      crcLowByte,
      crcHighByte,
      0x0d, // 结束符
      0x0a, // 结束符
    ]);

    // 将最终的命令转换为Base64编码
    const base64Command = base64.fromByteArray(finalCommand);

    // 打印最终的命令数据（十六进制表示）
    console.log(
      `Final command: ${Array.from(finalCommand)
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join(" ")}`
    );

    try {
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 最终的命令数据的Base64编码
      );
      console.log("启动验证命令已发送");
    } catch (error) {
      console.error("发送启动命令失败", error);
    }
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

    // 设置两个动画的持续时间相同
    const animationDuration = 200; // 动画持续时间为200ms

    // 同时启动淡出余额部分和淡入背景层动画
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0, // 总余额部分完全透明
        duration: animationDuration,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1, // 弹窗背景完全可见
        duration: animationDuration,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 等待动画完成后再启动卡片动画
      scrollYOffset.current = 0;
      animateCard(index);
    });

    // 同时设置 modalVisible 为 true，确保背景层可见
    setModalVisible(true);
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
    setRecoveryPhraseModalVisible(false);

    // 显示 Bluetooth 模态框
    setModalVisible(true);
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
            { opacity: opacityAnim }, // 使用动画控制透明度
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

          // 根据卡牌类型设置文字颜色
          const textColor =
            priceChange > 0
              ? isBlackText
                ? "#FF5252"
                : "#F23645"
              : isBlackText
              ? "#22AA94"
              : "#0C9981";
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
                            color: textColor,
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
            <View
              style={{
                flexDirection: "col",
                width: "100%",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity
                style={WalletScreenStyle.verifyAddressButton}
                onPress={() => setAddressModalVisible(false)}
              >
                <Text style={WalletScreenStyle.cancelButtonText}>
                  {t("Verify Address")}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={WalletScreenStyle.cancelAddressButton}
                onPress={() => setAddressModalVisible(false)}
              >
                <Text style={WalletScreenStyle.cancelButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
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
            {/* 搜索输入框 */}
            <View style={WalletScreenStyle.searchContainer}>
              <Icon
                name="search"
                size={20}
                style={WalletScreenStyle.searchIcon}
              />
              <TextInput
                style={WalletScreenStyle.searchInput}
                placeholder={t("Search Cryptocurrency")}
                placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
                onChangeText={(text) => setSearchQuery(text)}
                value={searchQuery}
              />
            </View>

            <ScrollView
              style={WalletScreenStyle.addCryptoScrollView}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
            >
              {/* 使用搜索关键字过滤后的加密货币列表 */}
              {filteredCryptos.map((crypto) => (
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

      {/* Bluetooth modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
          <View style={WalletScreenStyle.bluetoothModalView}>
            <Text style={WalletScreenStyle.bluetoothModalTitle}>
              {t("LOOKING FOR DEVICES")}
            </Text>
            {isScanning ? (
              <View style={{ alignItems: "center" }}>
                <Image
                  source={require("../assets/Bluetooth.gif")}
                  style={WalletScreenStyle.bluetoothImg}
                />
                <Text style={WalletScreenStyle.scanModalSubtitle}>
                  {t("Scanning...")}
                </Text>
              </View>
            ) : (
              devices.length > 0 && (
                <FlatList
                  data={devices}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => handleDevicePress(item)}>
                      <View style={WalletScreenStyle.deviceItemContainer}>
                        <Icon
                          name="smartphone"
                          size={24}
                          color={iconColor}
                          style={WalletScreenStyle.deviceIcon}
                        />
                        <Text style={WalletScreenStyle.scanModalSubtitle}>
                          {item.name || item.id}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              )
            )}
            {!isScanning && devices.length === 0 && (
              <Text style={WalletScreenStyle.modalSubtitle}>
                {t(
                  "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                )}
              </Text>
            )}
            <TouchableOpacity
              style={WalletScreenStyle.cancelButtonLookingFor}
              onPress={() => {
                setModalVisible(false);
                setSelectedDevice(null); // 重置 selectedDevice 状态
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
