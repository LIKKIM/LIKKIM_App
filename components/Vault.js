//Vault.js
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useRef,
  useContext,
} from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
  RefreshControl,
  Clipboard,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
} from "react-native";

// 第三方库
import { LinearGradient } from "expo-linear-gradient";

import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { BleManager } from "react-native-ble-plx";
import Constants from "expo-constants";
import base64 from "base64-js";
import { Buffer } from "buffer";

// 样式和上下文
import VaultScreenStyles from "../styles/VaultScreenStyle";
import {
  DeviceContext,
  DarkModeContext,
  usdtCrypto,
} from "../utils/DeviceContext";

// 自定义组件
import { prefixToShortName } from "../config/chainPrefixes";
import { CHAIN_NAMES } from "../config/chainConfig";
import assetRouteDefs from "../config/assetRouteDefs";
import EmptyWalletView from "./modal/EmptyWalletView";
import AddCryptoModal from "./modal/AddCryptoModal";
import ChainSelectionModal from "./modal/ChainSelectionModal";
import SecureDeviceStatus from "./VaultScreen/SecureDeviceStatus";
import TabModal from "./VaultScreen/TabModal";
import ModalsContainer from "./VaultScreen/ModalsContainer";
import checkAndReqPermission from "../utils/BluetoothPermissions"; //安卓高版本申请蓝牙权限
import displayDeviceAddress from "../utils/displayDeviceAddress"; // 显示地址函数 发送数据写法
import { parseDeviceCode } from "../utils/parseDeviceCode";
import { walletAPI, marketAPI } from "../env/apiEndpoints";
import { bluetoothConfig } from "../env/bluetoothConfig";

const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

function VaultScreen({ route, navigation }) {
  // 使用状态
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const {
    exchangeRates,
    initialAdditionalCryptos,
    setInitialAdditionalCryptos,
    updateCryptoAddress,
    usdtCrypto,
    setUsdtCrypto,
    additionalCryptos,
    cryptoCount,
    setCryptoCount,
    currencyUnit,
    addedCryptos,
    setAddedCryptos,
    isVerificationSuccessful,
    setIsVerificationSuccessful,
    verifiedDevices,
    setVerifiedDevices,
    cryptoCards,
    setCryptoCards,
    handleUpdateCryptoCards,
    updateDevicePubHintKey,
  } = useContext(DeviceContext);
  // First, use dark mode from route params
  let isDarkMode = route.params?.isDarkMode;
  // Then override with the latest value from DarkModeContext
  const { isDarkMode: contextDarkMode } = useContext(DarkModeContext);
  if (contextDarkMode !== undefined) {
    isDarkMode = contextDarkMode;
  }
  const VaultScreenStyle = VaultScreenStyles(isDarkMode);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("History");
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState(null);
  const [selectedCardChainShortName, setSelectedCardChainShortName] =
    useState(null);
  const [addCryptoVisible, setAddCryptoVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState(null); // 已选中的卡片名称
  const [selectedCardChain, setSelectedCardChain] = useState(null); // 已选中的卡片链信息
  const [addIconModalVisible, setAddIconModalVisible] = useState(false);

  const [processModalVisible, setProcessModalVisible] = useState(false);
  const [recoveryPhraseModalVisible, setRecoveryPhraseModalVisible] =
    useState(false);
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [priceChanges, setPriceChanges] = useState({});
  const scrollViewRef = useRef();
  const blueToothColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColorsDown = ["#21201E", "#0E0D0D"];
  const lightColorsDown = ["#ffffff", "#EDEBEF"];
  const [SecurityCodeModalVisible, setSecurityCodeModalVisible] =
    useState(false);
  const [animation] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const cardRefs = useRef([]);
  const cardStartPositions = useRef([]);
  const scrollYOffset = useRef(0);
  const [ActivityLog, setActivityLog] = useState([]);
  const [processMessages, setProcessMessages] = useState([]);
  const [showLetsGoButton, setShowLetsGoButton] = useState(false);
  const [tabOpacity] = useState(new Animated.Value(1));
  const [cardInfoVisible, setCardInfoVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [blueToothStatus, setBlueToothStatus] = useState(null);
  const [createPendingModalVisible, setCreatePendingModalVisible] =
    useState(false);
  useState(false);
  const [addressVerificationMessage, setAddressVerificationMessage] = useState(
    t("Verifying address on your device...")
  );
  const [refreshing, setRefreshing] = useState(false);
  const chainCategories = initialAdditionalCryptos.map((crypto) => ({
    name: crypto.chain,
    chainIcon: crypto.chainIcon,
    ...crypto,
  }));
  const [selectedChainShortName, setSelectedChainShortName] =
    useState(CHAIN_NAMES);
  const [selectedChain, setSelectedChain] = useState("All");
  const chainFilteredCards = (cryptoCards || []).filter((card) =>
    (selectedChainShortName || []).includes(card?.chainShortName)
  );

  const [isChainSelectionModalVisible, setChainSelectionModalVisible] =
    useState(false);

  const [selectedView, setSelectedView] = useState("wallet");
  const { isModalVisible } = route.params || {};

  const [importingModalVisible, setImportingModalVisible] = useState(false);
  const restoreIdentifier = Constants.installationId;
  const [pinCode, setPinCode] = useState("");
  const filteredCryptos = additionalCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /*   useEffect(() => {
    console.log("initialAdditionalCryptosState:", initialAdditionalCryptos);
  }, [initialAdditionalCryptos]); */

  // 定义下拉刷新执行的函数
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    const fetchPriceChanges = async () => {
      if (cryptoCards.length === 0) return; // 没有卡片时不请求

      const instIds = cryptoCards
        .map((card) => `${card.shortName}-USD`)
        .join(",");

      try {
        const response = await fetch(
          `${marketAPI.indexTickers}?instId=${instIds}`
        );
        const data = await response.json();

        if (data.code === 0 && data.data) {
          const changes = {};

          // 解析返回的 'data' 对象，按币种进行更新
          Object.keys(data.data).forEach((key) => {
            const shortName = key.replace("$", "").split("-")[0]; // 提取币种名称
            const ticker = data.data[key];

            changes[shortName] = {
              priceChange: ticker.last || "0", // 最新价格
              percentageChange: ticker.changePercent || "0", // 百分比变化
            };
          });

          setPriceChanges(changes); // 更新状态

          // 更新 cryptoCards 中的 priceUsd
          setCryptoCards((prevCards) => {
            return prevCards.map((card) => {
              // 如果 priceChanges 中有相应的币种价格，更新该卡片的 priceUsd
              if (changes[card.shortName]) {
                return {
                  ...card,
                  priceUsd: changes[card.shortName].priceChange, // 更新价格
                };
              }
              return card;
            });
          });
        }
      } catch (error) {
        console.log("Error fetching price changes:", error);
      } finally {
        setRefreshing(false);
      }
    };

    // 查询数字货币余额 查询余额
    const fetchWalletBalance = async () => {
      try {
        for (let card of cryptoCards) {
          const postData = {
            chain: card.queryChainName,
            address: card.address,
          };

          const response = await fetch(walletAPI.balance, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(postData),
          });
          const data = await response.json();

          if (data.code === "0" && data.data) {
            const { name, balance } = data.data;

            if (name.toLowerCase() === card.queryChainName.toLowerCase()) {
              card.balance = balance;

              setCryptoCards((prevCards) => {
                AsyncStorage.setItem("cryptoCards", JSON.stringify(prevCards));
                return prevCards.map((prevCard) =>
                  prevCard.queryChainName.toLowerCase() ===
                  card.queryChainName.toLowerCase()
                    ? { ...prevCard, balance: balance }
                    : prevCard
                );
              });
            }
          }
        }
      } catch (error) {
        console.log("Error fetching wallet balance:", error);
      }
    };

    fetchPriceChanges();
    fetchWalletBalance();
  }, [cryptoCards]);

  const bleManagerRef = useRef(null);

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      checkAndReqPermission(() => {
        console.log("Scanning started");
        setIsScanning(true);

        bleManagerRef.current.startDeviceScan(
          null,
          { allowDuplicates: true },
          (error, device) => {
            if (error) {
              console.log("BleManager scanning error:", error);
              return;
            }

            if (device.name && device.name.includes("LIKKIM")) {
              setDevices((prevDevices) => {
                if (!prevDevices.find((d) => d.id === device.id)) {
                  return [...prevDevices, device]; // 这里 device 是完整的设备对象
                }
                return prevDevices;
              });
              //  console.log("Scanned device:", device);
            }
          }
        );

        setTimeout(() => {
          console.log("Scanning stopped");
          bleManagerRef.current.stopDeviceScan();
          setIsScanning(false);
        }, 2000);
      });
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };

  const [bleVisible, setBleVisible] = useState(false);

  /*   useEffect(() => {
    console.log("Updated cryptoCards:", cryptoCards);
  }, [cryptoCards]);
 */

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        !isModalVisible && cryptoCards.length > 0 ? (
          <View
            style={{
              flexDirection: "row",
              backgroundColor: isDarkMode ? "#333" : "#eee",
              borderRadius: 20,
              borderWidth: 1,
              borderColor: isDarkMode ? "#333" : "#eee",
            }}
          >
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor:
                  selectedView === "wallet"
                    ? isDarkMode
                      ? "#555"
                      : "#fff"
                    : "transparent",
                borderColor: isDarkMode ? "#333" : "#eee",
                borderWidth: 1,
              }}
              onPress={() => setSelectedView("wallet")}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color:
                    selectedView === "wallet"
                      ? isDarkMode
                        ? "#fff"
                        : "#000"
                      : "#888",
                }}
              >
                {t("Wallet")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor:
                  selectedView === "nft"
                    ? isDarkMode
                      ? "#555"
                      : "#fff"
                    : "transparent",
                borderColor: isDarkMode ? "#333" : "#eee",
                borderWidth: 1,
              }}
              onPress={() => setSelectedView("nft")}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color:
                    selectedView === "nft"
                      ? isDarkMode
                        ? "#fff"
                        : "#000"
                      : "#888",
                }}
              >
                NFTs
              </Text>
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [
    navigation,
    selectedView,
    isDarkMode,
    isModalVisible,
    t,
    cryptoCards.length,
  ]);

  useEffect(() => {
    const loadSelectedChain = async () => {
      try {
        const savedChain = await AsyncStorage.getItem("selectedChain");
        if (savedChain) {
          setSelectedChain(savedChain);
          if (savedChain === "All") {
            setSelectedChainShortName(
              cryptoCards.map((card) => card.chainShortName)
            );
          } else {
            setSelectedChainShortName([savedChain]);
          }
        } else {
          // ✅ 如果没有保存任何 chain，设置为全部
          setSelectedChain("All");
          setSelectedChainShortName(
            cryptoCards.map((card) => card.chainShortName)
          );
        }
      } catch (e) {
        console.error("Error loading selected chain:", e);
        setSelectedChain("All");
        setSelectedChainShortName(
          cryptoCards.map((card) => card.chainShortName)
        );
      }
    };

    loadSelectedChain(); // 🔁 总是执行一次，确保不会卡死在空状态
  }, [cryptoCards]);

  useEffect(() => {
    setAddedCryptos(cryptoCards);
  }, [cryptoCards]);

  // 监听设备数量
  useEffect(() => {
    const loadVerifiedDevices = async () => {
      try {
        // 从 AsyncStorage 加载已验证的设备列表
        const savedDevices = await AsyncStorage.getItem("verifiedDevices");
        if (savedDevices !== null) {
          setVerifiedDevices(JSON.parse(savedDevices));
        }
      } catch (error) {
        console.log("Error loading verified devices: ", error);
      }
    };

    loadVerifiedDevices();
  }, []);
  useEffect(() => {
    if (!bleVisible && selectedDevice) {
      setSecurityCodeModalVisible(true);
    }
  }, [bleVisible, selectedDevice]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      bleManagerRef.current = new BleManager({
        restoreStateIdentifier: restoreIdentifier,
      });

      const subscription = bleManagerRef.current.onStateChange((state) => {
        if (state === "PoweredOn") {
          // 添加短暂延迟以确保蓝牙模块完全准备好
          setTimeout(() => {
            scanDevices();
          }, 2000); // 1秒延迟
        }
      }, true);

      return () => {
        subscription.remove();
        bleManagerRef.current && bleManagerRef.current.destroy();
      };
    }
  }, []);
  useEffect(() => {
    // 当 cryptoCards 状态变化时，更新 route.params
    // console.warn('selectedCardName' + selectedCardName)
    navigation.setParams({ cryptoCards, selectedCardName });
  }, [cryptoCards]);

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
        //  console.log(storedCards);
        if (storedCards !== null) {
          setCryptoCards(JSON.parse(storedCards));
          setAddedCryptos(JSON.parse(storedCards)); // 加载时同步 addedCryptos
        }
      } catch (error) {
        console.log("Error loading crypto cards:", error);
      }
    };
    loadCryptoCards();
  }, []);

  useEffect(() => {
    const saveCryptoCards = async () => {
      try {
        await AsyncStorage.setItem("cryptoCards", JSON.stringify(cryptoCards));
        await AsyncStorage.setItem("addedCryptos", JSON.stringify(cryptoCards)); // 保存时同步 addedCryptos
        //  console.log("Updated addedCryptos wallet page:", cryptoCards); // 打印更新后的 addedCryptos
      } catch (error) {
        console.log("Error saving crypto cards:", error);
      }
    };
    saveCryptoCards();
  }, [cryptoCards]);

  useEffect(() => {
    let intervalId; // 定时器 ID

    const fetchPriceChanges = async () => {
      if (cryptoCards.length === 0) return; // 没有卡片时不请求

      const instIds = cryptoCards
        .map((card) => `${card.shortName}-USD`)
        .join(",");
      //bugging
      try {
        const response = await fetch(`${marketAPI.tickers}?instId=${instIds}`);
        const data = await response.json();

        if (data.code === 0 && data.data) {
          const changes = {};

          // 解析返回的 'data' 对象，按币种进行更新
          Object.keys(data.data).forEach((key) => {
            const shortName = key.replace("$", "").split("-")[0]; // 提取币种名称
            const ticker = data.data[key];

            changes[shortName] = {
              priceChange: ticker.last || "0", // 最新价格
              percentageChange: ticker.changePercent || "0", // 百分比变化
            };
          });

          setPriceChanges(changes); // 更新状态
        }
      } catch (error) {
        console.log("Error fetching price changes:", error);
      }
    };

    // 初次调用
    fetchPriceChanges();

    // 设置定时器，每隔 30 秒刷新一次价格
    intervalId = setInterval(() => {
      fetchPriceChanges();
    }, 60000); // 每 1 分钟刷新一次

    // 清理定时器，防止内存泄漏
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [cryptoCards]);

  // 停止监听
  useEffect(() => {
    if (!SecurityCodeModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [SecurityCodeModalVisible]);

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

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: modalVisible ? 1 : 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: true,
    }).start();
  }, [modalVisible, fadeAnim]);

  useEffect(() => {
    if (processModalVisible) {
      setShowLetsGoButton(false);
      setProcessMessages([t("Creating")]);
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
        setShowLetsGoButton(true);
      }, 4000);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [processModalVisible, t]);

  useEffect(() => {
    console.log("选中的 chainShortName 已更新:", selectedCardChainShortName);
  }, [selectedCardChainShortName]);

  useEffect(() => {
    if (modalVisible) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      setTimeout(() => {
        scrollYOffset.current = 0;
      }, 300); // 确保在滚动完成后再设置偏移量
    }
  }, [modalVisible]);

  // 使用最新的价格来计算最终余额
  const getConvertedBalance = (cardBalance, cardShortName) => {
    const rate = exchangeRates[currencyUnit];
    const cryptoToUsdRate = exchangeRates[cardShortName] || 1;

    const marketPrice = priceChanges[cardShortName]?.priceChange || 1;

    if (!rate) {
      return cardBalance;
    }

    const usdBalance = cardBalance * cryptoToUsdRate * marketPrice;
    const finalBalance = (usdBalance * rate).toFixed(2);

    return finalBalance;
  };

  const handleDevicePress = async (device) => {
    // 检查是否传递了有效的设备对象
    if (typeof device !== "object" || typeof device.connect !== "function") {
      console.log("无效的设备对象，无法连接设备:", device);
      return;
    }

    setSelectedDevice(device);
    setModalVisible(false);
    setBleVisible(false);
    try {
      // 异步连接设备和发现服务
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务和特性");

      // 解密后的值发送给设备
      const sendparseDeviceCodeedValue = async (parseDeviceCodeedValue) => {
        try {
          const message = `ID:${parseDeviceCodeedValue}`;
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");

          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log(`解密后的值已发送: ${message}`);
        } catch (error) {
          console.log("发送解密值时出错:", error);
        }
      };

      // 先启动监听器
      monitorVerificationCode(device, sendparseDeviceCodeedValue);

      // 确保监听器已完全启动后再发送 'request'
      setTimeout(async () => {
        try {
          const requestString = "request";
          const bufferRequestString = Buffer.from(requestString, "utf-8");
          const base64requestString = bufferRequestString.toString("base64");

          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64requestString
          );
          console.log("字符串 'request' 已发送");
        } catch (error) {
          console.log("发送 'request' 时出错:", error);
        }
      }, 200); // 延迟 200ms 确保监听器启动（根据设备响应调整）

      // 显示 PIN 码弹窗
      setSecurityCodeModalVisible(true);
    } catch (error) {
      console.log("设备连接或命令发送错误:", error);
    }
  };
  // 处理断开连接的逻辑
  const handleDisconnectDevice = async (device) => {
    try {
      await device.cancelConnection();
      console.log(`设备 ${device.id} 已断开连接`);

      // Remove verified device ID
      const updatedVerifiedDevices = verifiedDevices.filter(
        (id) => id !== device.id
      );
      setVerifiedDevices(updatedVerifiedDevices);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(updatedVerifiedDevices)
      );
      console.log(`设备 ${device.id} 已从已验证设备中移除`);

      // 更新全局状态，表示设备已不再验证成功
      setIsVerificationSuccessful(false);
      console.log("验证状态已更新为 false。");
    } catch (error) {
      console.log("断开设备连接失败:", error);
    }
  };

  // 停止监听验证码;
  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription) {
      try {
        monitorSubscription.remove();
        monitorSubscription = null;
        console.log("验证码监听已停止");
      } catch (error) {
        console.log("停止监听时发生错误:", error);
      }
    }
  };

  const handleSelectChain = async (chain) => {
    try {
      await AsyncStorage.setItem("selectedChain", chain); // 保存用户选择
    } catch (e) {
      console.error("Error saving chain:", e);
    }

    if (chain === "All") {
      setSelectedChainShortName(cryptoCards.map((card) => card.chainShortName)); // 选择全部
    } else {
      setSelectedChainShortName([chain]); // 选择单个链
    }
    setSelectedChain(chain); // 更新选中的链
    setChainSelectionModalVisible(false); // 关闭modal
  };

  const handleVerifyAddress = (selectedCardChainShortName) => {
    console.log("传入的链短名称是:", selectedCardChainShortName);

    if (verifiedDevices.length > 0) {
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        displayDeviceAddress(
          device,
          selectedCardChainShortName,
          setIsVerifyingAddress,
          setAddressVerificationMessage,
          t
        );
      } else {
        setAddressModalVisible(false);
        setBleVisible(true);
      }
    } else {
      setAddressModalVisible(false);
      setBleVisible(true);
    }
  };

  // 点击 QR 代码图片时显示地址模态窗口
  const handleQRCodePress = (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedAddress(crypto.address);
    setSelectedCryptoIcon(crypto.icon);
    setIsVerifyingAddress(false);
    setAddressModalVisible(true);
  };

  const reconnectDevice = async (device) => {
    try {
      console.log(`正在尝试重新连接设备: ${device.id}`);
      await device.cancelConnection(); // 首先断开连接
      await device.connect(); // 尝试重新连接
      await device.discoverAllServicesAndCharacteristics(); // 重新发现服务和特性
      console.log("设备重新连接成功");
    } catch (error) {
      console.log("设备重新连接失败:", error);
    }
  };

  function hexStringToUint32Array(hexString) {
    // 将16进制字符串拆分为两个32位无符号整数
    return new Uint32Array([
      parseInt(hexString.slice(0, 8), 16),
      parseInt(hexString.slice(8, 16), 16),
    ]);
  }

  function uint32ArrayToHexString(uint32Array) {
    // 将两个32位无符号整数转换回16进制字符串
    return (
      uint32Array[0].toString(16).toUpperCase().padStart(8, "0") +
      uint32Array[1].toString(16).toUpperCase().padStart(8, "0")
    );
  }

  // 假设在组件中定义了状态：
  const [receivedAddresses, setReceivedAddresses] = useState({});
  // verificationStatus 用于表示整体状态
  // 例如：setVerificationStatus("waiting") 或 setVerificationStatus("success")

  let monitorSubscription;

  const monitorVerificationCode = (device, sendparseDeviceCodeedValue) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("Error monitoring device response:", error.message);
          return;
        }
        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        // 检查数据是否以已知前缀开头（例如 "bitcoin:"、"ethereum:" 等）
        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const chainShortName = prefixToShortName[prefix];
          console.log(`Received ${chainShortName} address: `, newAddress);
          updateCryptoAddress(chainShortName, newAddress);

          // 更新 receivedAddresses 状态，并检查是否全部接收
          setReceivedAddresses((prev) => {
            const updated = { ...prev, [chainShortName]: newAddress };
            // 假设预期地址数量与 prefixToShortName 中的条目数一致
            const expectedCount = Object.keys(prefixToShortName).length;
            if (Object.keys(updated).length >= expectedCount) {
              setVerificationStatus("walletReady");
            } else {
              setVerificationStatus("waiting");
            }
            return updated;
          });
        }

        if (receivedDataString.startsWith("pubkeyData:")) {
          const pubkeyData = receivedDataString
            .replace("pubkeyData:", "")
            .trim();
          const [queryChainName, publicKey] = pubkeyData.split(",");
          if (queryChainName && publicKey) {
            console.log(
              `Received public key for ${queryChainName}: ${publicKey}`
            );
            updateDevicePubHintKey(queryChainName, publicKey);
          }
        }

        // Process data containing "ID:"
        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);
          parseDeviceCode(encryptedData, key);
          const parseDeviceCodeedHex = uint32ArrayToHexString(encryptedData);
          console.log("parseDeviceCodeed string:", parseDeviceCodeedHex);
          if (sendparseDeviceCodeedValue) {
            sendparseDeviceCodeedValue(parseDeviceCodeedHex);
          }
        }

        // If data is "VALID", update status and send "validation"
        if (receivedDataString === "VALID") {
          try {
            setVerificationStatus("VALID");
            console.log("Status set to: VALID");
            const validationMessage = "validation";
            const bufferValidationMessage = Buffer.from(
              validationMessage,
              "utf-8"
            );
            const base64ValidationMessage =
              bufferValidationMessage.toString("base64");
            await device.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              base64ValidationMessage
            );
            console.log(`Sent 'validation' to device`);
          } catch (error) {
            console.log("Error sending 'validation':", error);
          }
        }

        // Extract complete PIN data (e.g., PIN:1234,Y or PIN:1234,N)
        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          console.log("Complete PIN data received:", receivedDataString);
        }
      }
    );
  };
  const monitorWalletCreationResult = (device) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          if (error.message.includes("Operation was cancelled")) {
            console.log("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连
          } else if (error.message.includes("Unknown error occurred")) {
            console.log("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.log("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连
          } else {
            console.log("监听设备响应时出错:", error.message);
          }
          //  return;
        }
        // Base64解码接收到的数据
        const receivedData = Buffer.from(characteristic.value, "base64");
      }
    );
  };

  const stopMonitoringWalletAddress = () => {
    if (monitorSubscription) {
      try {
        monitorSubscription.remove();
        monitorSubscription = null;
        console.log("钱包地址监听已停止");
      } catch (error) {
        console.log("停止监听时发生错误:", error);
      }
    }
  };
  // VaultScreen.js handlePinSubmit
  const handlePinSubmit = async () => {
    setSecurityCodeModalVisible(false);
    setCheckStatusModalVisible(false);
    const verificationCodeValue = receivedVerificationCode.trim();
    const pinCodeValue = pinCode.trim();

    console.log(`User PIN: ${pinCodeValue}`);
    console.log(`Received data: ${verificationCodeValue}`);

    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    const [receivedPin, flag] = rest.split(",");
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    console.log(`Extracted PIN: ${receivedPin}`);
    console.log(`Flag: ${flag}`);

    if (pinCodeValue === receivedPin) {
      console.log("PIN verified successfully");
      setVerificationStatus("success");
      setVerifiedDevices([selectedDevice.id]);

      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
      );

      setIsVerificationSuccessful(true);
      console.log("Device verified and saved");

      try {
        const confirmationMessage = "PIN_OK";
        const bufferConfirmation = Buffer.from(confirmationMessage, "utf-8");
        const base64Confirmation = bufferConfirmation.toString("base64");
        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Confirmation
        );
        console.log("Sent confirmation message:", confirmationMessage);
      } catch (error) {
        console.log("Error sending confirmation message:", error);
      }

      if (flag === "Y") {
        console.log("Flag Y received; sending 'address' to device");
        try {
          const addressMessage = "address";
          const bufferAddress = Buffer.from(addressMessage, "utf-8");
          const base64Address = bufferAddress.toString("base64");

          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Address
          );
          console.log("Sent 'address' to device");
          setCheckStatusModalVisible(true);
        } catch (error) {
          console.log("Error sending 'address':", error);
        }

        const pubkeyMessages = [
          "pubkey:cosmos,m/44'/118'/0'/0/0",
          "pubkey:ripple,m/44'/144'/0'/0/0",
          "pubkey:celestia,m/44'/118'/0'/0/0",
          "pubkey:juno,m/44'/118'/0'/0/0",
          "pubkey:osmosis,m/44'/118'/0'/0/0",
        ];

        for (const message of pubkeyMessages) {
          try {
            const bufferMessage = Buffer.from(message, "utf-8");
            const base64Message = bufferMessage.toString("base64");

            await selectedDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              base64Message
            );
            console.log(`Sent message: ${message}`);
          } catch (error) {
            console.log(`Error sending message "${message}":`, error);
          }
        }
      } else if (flag === "N") {
        console.log("Flag N received; no 'address' sent");
        setCheckStatusModalVisible(true);
      }
    } else {
      console.log("PIN verification failed");
      setVerificationStatus("fail");

      if (monitorSubscription) {
        monitorSubscription.remove();
        console.log("Stopped monitoring verification code");
      }

      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("Disconnected device");
      }
    }

    setPinCode("");
  };

  const handleDeleteCard = () => {
    scrollViewRef?.current.setNativeProps({ scrollEnabled: true });

    // 删除指定链和名称的卡片
    const updatedCards = cryptoCards.filter(
      (card) =>
        !(card.name === selectedCardName && card.chain === selectedCardChain)
    );

    console.log("thisthis", selectedCardName);
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

  const animateCard = (index) => {
    setSelectedCardIndex(index);
    cardRefs.current[index]?.measure((fx, fy, width, height, px, py) => {
      cardStartPositions.current[index] = py; // 记录每个卡片的初始位置
      const endPosition = 120 - (scrollYOffset.current || 0); // 考虑 scrollTo 的 Y 偏移量

      // 确保 start 和 end 位置都是有效的数值
      if (isNaN(cardStartPositions.current[index]) || isNaN(endPosition)) {
        console.log("Invalid position values", {
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

  const handleCardPress = (cryptoName, cryptoChain, index) => {
    console.log("click card...");

    const crypto = cryptoCards?.find(
      (card) => card.name === cryptoName && card.chain === cryptoChain
    );
    setSelectedCardChainShortName(crypto.chainShortName);
    setSelectedAddress(crypto?.address || "Unknown");
    setSelectedCardName(cryptoName);
    setSelectedCardChain(cryptoChain);

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

  const handleAddCrypto = (cryptos) => {
    // 将所有选中的卡片添加到 cryptoCards 中
    const newCryptoCards = [
      ...cryptoCards,
      ...cryptos.filter(
        (crypto) =>
          !cryptoCards.find(
            (card) => card.name === crypto.name && card.chain === crypto.chain
          )
      ),
    ];
    setCryptoCards(newCryptoCards);
    setCryptoCount(newCryptoCards.length);
    setAddedCryptos(newCryptoCards);
    setAddCryptoVisible(false);
  };

  const handleWalletTest = () => {
    setProcessModalVisible(true);
  };

  const handleContinue = () => {
    setRecoveryPhraseModalVisible(false);

    if (verifiedDevices.length > 0) {
      // 发送创建钱包命令时，确保传递的是设备对象
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        // 调用监听钱包地址的函数

        setCreatePendingModalVisible(true);
      } else {
        // console.log("未找到与该ID匹配的设备对象");
        setBleVisible(true);
      }
    } else {
      setBleVisible(true);
    }
  };

  const handleLetsGo = () => {
    setProcessModalVisible(false);
    setAddCryptoVisible(true);
  };

  const calculateTotalBalance = () => {
    const totalBalance = cryptoCards.reduce((total, card) => {
      if (!card || typeof card.balance === "undefined") {
        return total; // 跳过无效项
      }

      const convertedBalance = parseFloat(
        getConvertedBalance(card.balance, card.shortName)
      );

      return total + convertedBalance;
    }, 0);

    return totalBalance.toFixed(2);
  };

  const { height } = Dimensions.get("window");

  const isIphoneSE = Platform.OS === "ios" && height < 700;

  const animatedCardStyle = (index) => {
    const cardStartPosition = cardStartPositions.current[index] || 0;
    const endPosition =
      Platform.OS === "android" || isIphoneSE
        ? 65
        : 120 - (scrollYOffset.current || 0);
    const translateY = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, endPosition - cardStartPosition],
    });

    return {
      transform: [{ translateY }],
      zIndex: 9,
    };
  };

  //fix card 初始化紀錄位置
  const initCardPosition = (_ref, _index) =>
    _ref?.measure(
      (fx, fy, width, height, px, py) =>
        (cardStartPositions.current[_index] = py)
    );

  const renderTabModal = () => (
    <TabModal
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      closeModal={closeModal}
      VaultScreenStyle={VaultScreenStyle}
      t={t}
      tabOpacity={tabOpacity}
      ActivityLog={ActivityLog}
      scrollViewRef={scrollViewRef}
      selectedCrypto={selectedCrypto}
      isDarkMode={isDarkMode}
      fadeAnim={fadeAnim}
      darkColorsDown={darkColorsDown}
      lightColorsDown={lightColorsDown}
    />
  );

  return (
    <LinearGradient
      colors={isDarkMode ? ["#21201E", "#0E0D0D"] : ["#FFFFFF", "#EDEBEF"]}
      style={VaultScreenStyle.linearGradient}
    >
      <SecureDeviceStatus
        selectedView={selectedView}
        scrollViewRef={scrollViewRef}
        VaultScreenStyle={VaultScreenStyle}
        modalVisible={modalVisible}
        cryptoCards={cryptoCards}
        refreshing={refreshing}
        onRefresh={onRefresh}
        opacityAnim={opacityAnim}
        calculateTotalBalance={calculateTotalBalance}
        currencyUnit={currencyUnit}
        t={t}
        setChainSelectionModalVisible={setChainSelectionModalVisible}
        selectedChain={selectedChain}
        isDarkMode={isDarkMode}
        chainFilteredCards={chainFilteredCards}
        cardRefs={cardRefs}
        initCardPosition={initCardPosition}
        handleCardPress={handleCardPress}
        animatedCardStyle={animatedCardStyle}
        selectedCardIndex={selectedCardIndex}
        cardInfoVisible={cardInfoVisible}
        priceChanges={priceChanges}
        getConvertedBalance={getConvertedBalance}
        handleQRCodePress={handleQRCodePress}
        renderTabModal={renderTabModal}
        EmptyWalletView={EmptyWalletView}
        scrollYOffset={scrollYOffset}
        handleContinue={handleContinue}
        handleWalletTest={handleWalletTest}
      />
      <ModalsContainer
        selectedCardChainShortName={selectedCardChainShortName}
        addressModalVisible={addressModalVisible}
        setAddressModalVisible={setAddressModalVisible}
        selectedCryptoIcon={selectedCryptoIcon}
        selectedCrypto={selectedCrypto}
        selectedAddress={selectedAddress}
        isVerifyingAddress={isVerifyingAddress}
        addressVerificationMessage={addressVerificationMessage}
        handleVerifyAddress={handleVerifyAddress}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
        handleWalletTest={handleWalletTest}
        processModalVisible={processModalVisible}
        setProcessModalVisible={setProcessModalVisible}
        processMessages={processMessages}
        showLetsGoButton={showLetsGoButton}
        handleLetsGo={handleLetsGo}
        addCryptoVisible={addCryptoVisible}
        setAddCryptoVisible={setAddCryptoVisible}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCryptos={filteredCryptos}
        handleAddCrypto={handleAddCrypto}
        chainCategories={chainCategories}
        isChainSelectionModalVisible={isChainSelectionModalVisible}
        setChainSelectionModalVisible={setChainSelectionModalVisible}
        selectedChain={selectedChain}
        handleSelectChain={handleSelectChain}
        cryptoCards={cryptoCards}
        deleteConfirmVisible={deleteConfirmVisible}
        setDeleteConfirmVisible={setDeleteConfirmVisible}
        handleDeleteCard={handleDeleteCard}
        navigation={navigation}
        bleVisible={bleVisible}
        devices={devices}
        isScanning={isScanning}
        iconColor={iconColor}
        blueToothColor={blueToothColor}
        handleDevicePress={handleDevicePress}
        setBleVisible={setBleVisible}
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
        verifiedDevices={verifiedDevices}
        handleDisconnectDevice={handleDisconnectDevice}
        SecurityCodeModalVisible={SecurityCodeModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        handlePinSubmit={handlePinSubmit}
        setSecurityCodeModalVisible={setSecurityCodeModalVisible}
        verificationStatus={verificationStatus}
        setVerificationStatus={setVerificationStatus}
        blueToothStatus={blueToothStatus}
        setBlueToothStatus={setBlueToothStatus}
        createPendingModalVisible={createPendingModalVisible}
        importingModalVisible={importingModalVisible}
        setCreatePendingModalVisible={setCreatePendingModalVisible}
        setImportingModalVisible={setImportingModalVisible}
        stopMonitoringWalletAddress={stopMonitoringWalletAddress}
      />
    </LinearGradient>
  );
}

export default VaultScreen;
