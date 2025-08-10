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
  Dimensions,
  TouchableWithoutFeedback,
  TouchableHighlight,
  InteractionManager,
  useAnimatedValue,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
// 第三方库
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { BleManager } from "react-native-ble-plx";
import Constants from "expo-constants";
import base64 from "base64-js";
import { Buffer } from "buffer";

// 样式和上下文
import VaultScreenStyles from "../styles/VaultScreenStyle";
import { DeviceContext, DarkModeContext } from "../utils/DeviceContext";

// 自定义组件
import { prefixToShortName } from "../config/chainPrefixes";
import { CHAIN_NAMES } from "../config/chainConfig";
import { createHandlePinSubmit } from "../utils/handlePinSubmit";
import EmptyWalletView from "./modal/EmptyWalletView";
import SecureDeviceStatus from "./VaultScreen/SecureDeviceStatus";
import TabModal from "./VaultScreen/TabModal";
import ModalsContainer from "./VaultScreen/ModalsContainer";
import checkAndReqPermission from "../utils/BluetoothPermissions"; //安卓高版本申请蓝牙权限
import displayDeviceAddress from "../utils/displayDeviceAddress"; // 显示地址函数 发送数据写法
import { parseDeviceCode } from "../utils/parseDeviceCode";
import { accountAPI, metricsAPII } from "../env/apiEndpoints";
import { bluetoothConfig } from "../env/bluetoothConfig";
import {
  fetchPriceChanges,
  fetchWalletBalance,
} from "./VaultScreen/AssetsDataFetcher";
import { createHandleDevicePress } from "../utils/handleDevicePress";
const FILE_NAME = "Vault.js";
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
  const [CheckStatusModalVisible, setCheckStatusModalVisible] = useState(false);
  const VaultScreenStyle = VaultScreenStyles(isDarkMode);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("Prices");
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
  const modalAnim = useAnimatedValue(0); //弹窗淡入淡出动画
  const backgroundAnim = useAnimatedValue(0); //背景淡入淡出动画
  const balanceAnim = useAnimatedValue(1); //余额淡出动画
  const [selectedCardIndex, setSelectedCardIndex] = useState(null);
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const cardRefs = useRef([]);
  const cardStartPositions = useRef([]);
  const scrollYOffset = useRef(0);
  const [ActivityLog, setActivityLog] = useState([]);
  const [processMessages, setProcessMessages] = useState([]);
  const [showLetsGoButton, setShowLetsGoButton] = useState(false);
  const [tabOpacity] = useState(new Animated.Value(0));
  const [cardInfoVisible, setCardInfoVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { verificationStatus, setVerificationStatus } =
    useContext(DeviceContext);
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

  //计算 cardStartPositions导致卡片移动卡顿
  //TODO 测量卡片位置需要时间，Splas要延迟关闭:不再使用该方案，会造成UI block
  // useEffect(() => {
  //   cardRefs.current.forEach((ref, idx) => {
  //     if (ref && typeof ref.measure === "function") {

  //       ref.measure((fx, fy, width, height, px, py) => {
  //         setCardsOffset((prev) => ({
  //           ...prev,
  //           [idx]: py,
  //         }));
  //         cardStartPositions.current[idx] = py;
  //       });
  //     }
  //   });

  // }, [cryptoCards]);

  useEffect(() => {
    cryptoCards.forEach((_, idx) => {
      //每个卡片固定差距76+(20 margin)
      setCardsOffset((prev) => ({
        ...prev,
        [idx]: idx * 96 + 150,
      }));
    });
  }, [cryptoCards]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchPriceChanges(
      cryptoCards,
      setPriceChanges,
      setCryptoCards,
      setRefreshing
    );
    fetchWalletBalance(cryptoCards, setCryptoCards);
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

            if (device.name && device.name.includes("LUKKEY")) {
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
    if (cryptoCards.length === 0) {
      setSelectedView("wallet");
    }
    navigation.setOptions({
      headerTitleAlign: "center",
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
                {t("Assets")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor:
                  selectedView === "gallery"
                    ? isDarkMode
                      ? "#555"
                      : "#fff"
                    : "transparent",
                borderColor: isDarkMode ? "#333" : "#eee",
                borderWidth: 1,
              }}
              onPress={() => setSelectedView("gallery")}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color:
                    selectedView === "gallery"
                      ? isDarkMode
                        ? "#fff"
                        : "#000"
                      : "#888",
                }}
              >
                {t("Gallery")}
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
        // 新增取消蓝牙监听订阅，防止订阅泄漏
        if (monitorSubscription.current) {
          monitorSubscription.current.remove();
          monitorSubscription.current = null;
          console.log(
            "Vault.js: Cancelled Bluetooth monitor subscription on unmount"
          );
        }
      };
    }
  }, []);

  useEffect(() => {
    // 当 cryptoCards 状态变化时，更新 route.params
    // console.warn('selectedCardName' + selectedCardName)
    navigation.setParams({ cryptoCards, selectedCardName });
  }, [cryptoCards]);

  useEffect(() => {
    Animated.timing(tabOpacity, {
      toValue: modalVisible ? 1 : 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [modalVisible]);

  // useEffect(() => {
  // 根据条件触发动画
  // if (cryptoCards.length > 0 && !modalVisible) {
  //   Animated.timing(opacityAnim, {
  //     toValue: 1,
  //     duration: 200,
  //     easing: Easing.ease,
  //     useNativeDriver: true,
  //   }).start();
  // } else {
  //   Animated.timing(opacityAnim, {
  //     toValue: 0,
  //     duration: 200,
  //     easing: Easing.ease,
  //     useNativeDriver: true,
  //   }).start();
  // }
  // }, [cryptoCards.length, modalVisible, balanceAnim]);

  useEffect(() => {
    const loadCryptoCards = async () => {
      try {
        const storedCards = await AsyncStorage.getItem("cryptoCards");
        //  console.log(storedCards);
        if (storedCards !== null) {
          const parsedCards = JSON.parse(storedCards);
          setCryptoCards(parsedCards);
          setAddedCryptos(parsedCards); // 加载时同步 addedCryptos
          if (parsedCards.length > 0) {
            fetchWalletBalance(parsedCards, setCryptoCards);
          }
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

    fetchPriceChanges(
      cryptoCards,
      setPriceChanges,
      setCryptoCards,
      setRefreshing
    );

    // 设置定时器，每隔 30 秒刷新一次价格
    intervalId = setInterval(() => {
      fetchPriceChanges(
        cryptoCards,
        setPriceChanges,
        setCryptoCards,
        setRefreshing
      );
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

  // 新增：监听 verificationStatus，walletReady 时自动刷新余额
  useEffect(() => {
    if (verificationStatus === "walletReady") {
      fetchWalletBalance(cryptoCards, setCryptoCards);
    }
  }, [verificationStatus]);

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

  // useEffect(() => {
  //   Animated.timing(backgroundAnim, {
  //     toValue: modalVisible ? 1 : 0,
  //     duration: 300,
  //     easing: Easing.ease,
  //     useNativeDriver: true,
  //   }).start();
  // }, [modalVisible, backgroundAnim]);

  // useEffect(() => {
  //   console.log("选中的 chainShortName 已更新:", selectedCardChainShortName);
  // }, [selectedCardChainShortName]);

  // useEffect(() => {
  // if (modalVisible) {
  // scrollViewRef.current.scrollTo({ y: 0, animated: true });
  // setTimeout(() => {
  //   scrollYOffset.current = 0;
  // }, 300); // 确保在滚动完成后再设置偏移量
  // }
  // }, [modalVisible]);

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

  // 新增：使用工厂函数生成 handleDevicePress
  const handleDevicePress = createHandleDevicePress({
    setReceivedAddresses: () => {},
    setVerificationStatus: () => {},
    setSelectedDevice,
    setBleVisible,
    monitorVerificationCode,
    setSecurityCodeModalVisible,
    serviceUUID,
    writeCharacteristicUUID,
    Buffer,
    setModalVisible,
  });

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

  const monitorSubscription = useRef(null);

  const monitorVerificationCode = (device, sendparseDeviceCodeedValue) => {
    // 正确地移除已有监听
    if (monitorSubscription.current) {
      monitorSubscription.current.remove();
      monitorSubscription.current = null;
    }

    monitorSubscription.current = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log(
            `${FILE_NAME} Error monitoring device response:`,
            error.message
          );
          return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const chainShortName = prefixToShortName[prefix];
          console.log(`Received ${chainShortName} address: `, newAddress);
          updateCryptoAddress(chainShortName, newAddress);

          setReceivedAddresses((prev) => {
            const updated = { ...prev, [chainShortName]: newAddress };
            const expectedCount = Object.keys(prefixToShortName).length;
            if (Object.keys(updated).length >= expectedCount) {
              setTimeout(() => {
                setVerificationStatus("walletReady");
                console.log("All public keys received, wallet ready.");
              }, 5000);
            } else {
              setVerificationStatus("waiting");
              // 新增打印缺失的区块链地址
              const missingChains = Object.values(prefixToShortName).filter(
                (shortName) => !updated.hasOwnProperty(shortName)
              );
              if (missingChains.length > 0) {
                console.log(
                  "Missing addresses for chains:",
                  missingChains.join(", ")
                );
              }
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
            //console.log(
            //  `Received public key for ${queryChainName}: ${publicKey}`
            //);
            updateDevicePubHintKey(queryChainName, publicKey);
          }
        }

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
            console.log("发送 'validation' 时出错:", error);
          }
        }

        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          monitorSubscription.current?.remove();
          monitorSubscription.current = null;
        }
      }
    );
  };

  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription.current) {
      try {
        monitorSubscription.current.remove(); // 使用 monitorSubscription.current
        monitorSubscription.current = null; // 清除当前订阅
        console.log("Stopped monitoring verification code");
      } catch (error) {
        console.log("Error stopping monitoring:", error);
      }
    }
  };
  // handlePinSubmit 已迁移至 utils/handlePinSubmit.js
  const handlePinSubmit = React.useMemo(
    () =>
      createHandlePinSubmit({
        setSecurityCodeModalVisible,
        setCheckStatusModalVisible,
        setVerificationStatus,
        setVerifiedDevices,
        setIsVerificationSuccessful,
        setPinCode,
        setReceivedAddresses,
        prefixToShortName,
        monitorVerificationCode,
        serviceUUID,
        writeCharacteristicUUID,
      }),
    [
      setSecurityCodeModalVisible,
      setCheckStatusModalVisible,
      setVerificationStatus,
      setVerifiedDevices,
      setIsVerificationSuccessful,
      setPinCode,
      setReceivedAddresses,
      prefixToShortName,
      monitorVerificationCode,
      serviceUUID,
      writeCharacteristicUUID,
    ]
  );

  // 包装一层，收集依赖参数，适配 ModalsContainer 的 handlePinSubmit
  const handlePinSubmitProxy = React.useCallback(() => {
    handlePinSubmit({
      receivedVerificationCode,
      pinCode,
      selectedDevice,
      receivedAddresses,
    });
  }, [
    handlePinSubmit,
    receivedVerificationCode,
    pinCode,
    selectedDevice,
    receivedAddresses,
  ]);

  const handleDeleteCard = () => {
    scrollViewRef?.current?.setNativeProps({ scrollEnabled: true });

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
    modalAnim.setValue(0);
    balanceAnim.setValue(1);
    navigation.setParams({ showDeleteConfirmModal: false });
  };

  //记录点击前的滚动位置：TODO 后续如果需要自动滚回去，可以使用。
  const [lastScrollYOffset, setLastScrollYOffset] = useState(0);
  //提前测量每个卡片的偏移，避免点击动画重新测量导致延迟
  const [cardsOffset, setCardsOffset] = useState([]);
  const selectCardOffsetOpenAni = useAnimatedValue(0);
  const selectCardOffsetCloseAni = useAnimatedValue(0);

  //计算弹簧参数，模仿iPhone Wallet点击卡片归位动画
  const computeSpringConfig = (index, total = 30) => {
    const raw = Math.min(index / total, 1);
    const t = 1 - Math.pow(1 - raw, 2);

    return {
      stiffness: 200 - (1 - t) * 20, // 170 → 200，底部卡片刚性更高，归位更慢
      damping: 50 + (1 - t) * 30, // 70 → 50，底部卡片阻尼更低，归位更慢
      mass: 1, // 质量固定为1，保持动画自然
    };
  };
  const closeModal = () => {
    setCardInfoVisible(false);
    cardRefs.current[selectedCardIndex]?.setNativeProps({
      style: { zIndex: 0 },
    });
    const { stiffness, damping, mass } = computeSpringConfig(
      selectedCardIndex,
      cryptoCards.length
    );
    // console.log(stiffness, damping, mass)
    setModalVisible(false);
    Animated.spring(balanceAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();

    if (selectedCardIndex >= 5) {
      Animated.spring(selectCardOffsetOpenAni, {
        toValue: 0,
        stiffness: stiffness,
        damping: damping,
        mass: mass,
        restSpeedThreshold: 0.01, // 控制动画停止时的速度阈值，越小越平滑
        restDisplacementThreshold: 0.01, // 控制动画停止时的位移阈值，越小越平滑
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(selectCardOffsetOpenAni, {
        toValue: 0,
        bounciness: 3,
        speed: 10,
        restSpeedThreshold: 0.01,
        restDisplacementThreshold: 0.01,
        useNativeDriver: true,
      }).start();
    }

    Animated.spring(modalAnim, {
      toValue: 0,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      setSelectedCardIndex(null);
    }, 0);
  };

  //动画分成了：背景，弹窗，卡片，余额四部分
  const handleCardPress = (cryptoName, cryptoChain, index) => {
    console.log(cardsOffset);
    if (cardsOffset[index] === undefined) {
      console.log("卡片偏移未测量完成过早点击，需要处理");
      return;
    }

    // 查到这张卡片的数据
    const crypto = cryptoCards.find(
      (card) => card.name === cryptoName && card.chain === cryptoChain
    );

    // 先把动画值复位到 0，避免上一次动画遗留的值
    selectCardOffsetOpenAni.setValue(0);

    // 更新状态
    setSelectedCardChainShortName(crypto.chainShortName);
    setLastScrollYOffset(scrollYOffset.current);
    setSelectedAddress(crypto.address);
    setSelectedCardName(cryptoName);
    setSelectedCardChain(cryptoChain);
    setSelectedCrypto(crypto);

    // 打开 Modal，并标记当前选中的卡片索引
    setModalVisible(true);
    setSelectedCardIndex(index);

    // 记录初始位置
    const py = cardsOffset[index];
    cardStartPositions.current[index] = py;

    // 确保这张卡在最上层
    setCardInfoVisible(true);
    cardRefs.current[index]?.setNativeProps({ style: { zIndex: 3 } });

    // 弹性动画：从 0 → 目标偏移
    const baseOffset = Platform.OS === "ios" ? 76 : 56;
    Animated.spring(selectCardOffsetOpenAni, {
      toValue: -py + baseOffset,
      useNativeDriver: true,
      bounciness: py > 500 ? 4 : 7,
      speed: py > 500 ? 5 : 8,
    }).start();

    // 其它并行动画
    Animated.parallel([
      Animated.timing(modalAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300,
      }),
      Animated.timing(balanceAnim, {
        toValue: 0,
        useNativeDriver: true,
        duration: 300,
      }),
      Animated.timing(backgroundAnim, {
        toValue: 1,
        useNativeDriver: true,
        duration: 300,
      }),
    ]).start();
  };

  const handleAddCrypto = (cryptos) => {
    // 将所有选中的卡片添加到 cryptoCards 中，并同步 initialAdditionalCryptos 中对应的地址，匹配使用 queryChainShortName
    const newCryptoCards = [
      ...cryptoCards,
      ...cryptos
        .filter(
          (crypto) =>
            !cryptoCards.find(
              (card) => card.name === crypto.name && card.chain === crypto.chain
            )
        )
        .map((crypto) => {
          // 查找 initialAdditionalCryptos 中对应的地址，使用 queryChainShortName 匹配
          const matchedCrypto = initialAdditionalCryptos.find(
            (item) => item.queryChainShortName === crypto.queryChainShortName
          );
          return {
            ...crypto,
            address: matchedCrypto ? matchedCrypto.address : "",
          };
        }),
    ];
    setCryptoCards(newCryptoCards);
    setCryptoCount(newCryptoCards.length);
    setAddedCryptos(newCryptoCards);
    setAddCryptoVisible(false);
    fetchPriceChanges(
      newCryptoCards,
      setPriceChanges,
      setCryptoCards,
      setRefreshing
    );
    fetchWalletBalance(newCryptoCards, setCryptoCards);
  };

  const handleContinue = () => {
    console.log("检查是否有已验证设备，数量:", verifiedDevices.length);

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
    setAddCryptoVisible(true);
  };

  const handleWalletTest = () => {
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

    // const endPosition =
    //   Platform.OS === "android" || isIphoneSE
    //     ? 0
    //     : 0 - (scrollYOffset.current || 0);
    //     console.log('endPosition', endPosition)
    //TODO TEST
    const translateY = modalAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -cardStartPosition + (Platform.OS === "ios" ? 100 : 60)],
    });

    return {
      transform: [{ translateY }],
    };
  };

  // const calcCar dOffsetY = (index, event) => {
  //   const { y } = event.nativeEvent.layout;
  //   setCardsOffset((prev) => {
  //     prev[index] = y;
  //     return [...prev];
  //   });
  // };

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
      backgroundAnim={backgroundAnim}
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
        selectCardOffsetOpenAni={selectCardOffsetOpenAni}
        selectCardOffsetCloseAni={selectCardOffsetCloseAni}
        selectedView={selectedView}
        scrollViewRef={scrollViewRef}
        VaultScreenStyle={VaultScreenStyle}
        modalVisible={modalVisible}
        cryptoCards={cryptoCards}
        refreshing={refreshing}
        onRefresh={onRefresh}
        opacityAnim={balanceAnim}
        calculateTotalBalance={calculateTotalBalance}
        currencyUnit={currencyUnit}
        t={t}
        setChainSelectionModalVisible={setChainSelectionModalVisible}
        selectedChain={selectedChain}
        isDarkMode={isDarkMode}
        chainFilteredCards={chainFilteredCards}
        cardRefs={cardRefs}
        // calcCardOffsetY={calcCardOffsetY}
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
        device={devices.find((d) => d.id === verifiedDevices[0])}
        onOpenBluetoothModal={() => setBleVisible(true)}
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
        handlePinSubmit={handlePinSubmitProxy}
        setSecurityCodeModalVisible={setSecurityCodeModalVisible}
        verificationStatus={verificationStatus}
        setVerificationStatus={setVerificationStatus}
        blueToothStatus={blueToothStatus}
        setBlueToothStatus={setBlueToothStatus}
        createPendingModalVisible={createPendingModalVisible}
        importingModalVisible={importingModalVisible}
        setCreatePendingModalVisible={setCreatePendingModalVisible}
        setImportingModalVisible={setImportingModalVisible}
        stopMonitoringVerificationCode={stopMonitoringVerificationCode}
      />
    </LinearGradient>
  );
}

export default VaultScreen;
