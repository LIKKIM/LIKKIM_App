import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ImageBackground,
  PanResponder,
  TextInput,
  Animated,
  Easing,
  FlatList,
  Platform,
  ScrollView,
  Button,
  RefreshControl,
  Clipboard,
  TouchableWithoutFeedback,
  TouchableHighlight,
  PermissionsAndroid,
} from "react-native";

// 第三方库
import { LinearGradient } from "expo-linear-gradient";
import * as Updates from "expo-updates";
import Icon from "react-native-vector-icons/MaterialIcons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import QRCode from "react-native-qrcode-svg";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import Constants from "expo-constants";
import base64 from "base64-js";
import { Buffer } from "buffer";

// 样式和上下文
import WalletScreenStyles from "../styles/WalletScreenStyle";
import { CryptoContext, DarkModeContext, usdtCrypto } from "./CryptoContext";

// 自定义组件
import PriceChartCom from "./PriceChartCom";
import EmptyWalletView from "./modal/EmptyWalletView";
import AddCryptoModal from "./modal/AddCryptoModal";
import TabModal from "./walletScreen/TabModal";
import ModalsContainer from "./walletScreen/ModalsContainer";
import WalletList from "./CardListCom";

const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function WalletScreen({ route, navigation }) {
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
  } = useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const WalletScreenStyle = WalletScreenStyles(isDarkMode);
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("History");
  const [modalVisible, setModalVisible] = useState(false);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
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
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [priceChanges, setPriceChanges] = useState({});
  const scrollViewRef = useRef();
  const blueToothColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColorsDown = ["#21201E", "#0E0D0D"];
  const lightColorsDown = ["#FDFCFD", "#EDEBEF"];
  const [pinModalVisible, setPinModalVisible] = useState(false);
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
  const [cardInfoVisible, setCardInfoVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [blueToothStatus, setBlueToothStatus] = useState(null);

  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [createPendingModalVisible, setCreatePendingModalVisible] =
    useState(false);
  useState(false);

  const [addressVerificationMessage, setAddressVerificationMessage] = useState(
    t("Verifying Address on LIKKIM...")
  );

  const [refreshing, setRefreshing] = useState(false);
  const chainCategories = initialAdditionalCryptos.map((crypto) => ({
    name: crypto.chain,
    chainIcon: crypto.chainIcon,
    ...crypto, // 这里确保包括所有相关属性
  }));

  const [importingModalVisible, setImportingModalVisible] = useState(false);
  const restoreIdentifier = Constants.installationId;
  const [pinCode, setPinCode] = useState("");
  const filteredCryptos = additionalCryptos.filter(
    (crypto) =>
      crypto.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      crypto.shortName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  // 初始化状态为默认值
  const [walletCreationStatus, setWalletCreationStatus] = useState({
    image: require("../assets/gif/Pending.gif"), // 默认显示 Pending.gif
    title: t("Creating on LIKKIM Hardware..."), // 默认主消息
    subtitle: t("Your device is already verified."), // 默认子消息
  });

  const [importingStatus, setImportingStatus] = useState({
    image: require("../assets/gif/Pending.gif"), // 默认显示 Pending.gif
    title: t("Importing on LIKKIM Hardware..."), // 默认主消息
    subtitle: t("Your device is already verified."), // 默认子消息
  });

  // 定义下拉刷新执行的函数
  const onRefresh = React.useCallback(() => {
    setRefreshing(true); // 显示刷新状态

    // 调用价格刷新函数
    const fetchPriceChanges = async () => {
      if (cryptoCards.length === 0) {
        setRefreshing(false); // 没有卡片时直接停止刷新
        return;
      }

      const instIds = cryptoCards
        .map((card) => `${card.shortName}-USD`)
        .join(",");

      try {
        const response = await fetch(
          `https://df.likkim.com/api/market/index-tickers?instId=${instIds}`
        );
        const data = await response.json();

        if (data.code === 0 && data.data) {
          const changes = {};

          // 更新每个卡片的价格变化数据
          Object.keys(data.data).forEach((key) => {
            const shortName = key.replace("$", "").split("-")[0]; // 提取币种名称
            const ticker = data.data[key];

            changes[shortName] = {
              priceChange: ticker.last || "0", // 最新价格
              percentageChange: ticker.changePercent || "0", // 百分比变化
            };
          });

          setPriceChanges(changes); // 更新状态
          //   console.log("Price changes updated:", changes);
        }
      } catch (error) {
        console.log("Error fetching price changes:", error);
      } finally {
        setRefreshing(false); // 无论成功还是失败，都停止刷新动画
      }
    };

    fetchPriceChanges(); // 调用刷新函数
  }, [cryptoCards]); // 依赖于 cryptoCards 的更新

  const bleManagerRef = useRef(null);

  //安卓高版本申请蓝牙权限
  const checkAndReqPermission = async (cb) => {
    if (Platform.OS === "android" && Platform.Version >= 23) {
      console.log("安卓申请权限");
      // Scanning: Checking permissions...
      const enableds = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      let canRunCb = true;
      for (let permissionItem in enableds) {
        if (enableds[permissionItem] !== "granted") {
          console.warn(permissionItem + "权限未授予");
          canRunCb = false;
        }
      }

      canRunCb && cb();
    }

    if (Platform.OS == "ios") cb();
  };

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

  const [bleVisible, setBleVisible] = useState(false); // New state for Bluetooth modal

  // 函数获取指定卡的余额
  const getCardBalance = (cardShortName) => {
    const card = cryptoCards.find((c) => c.shortName === cardShortName);
    return card ? card.balance : "Card not found";
  };
  const getConvertedBalance = (cardBalance, cardShortName) => {
    // 打印原始卡余额
    console.log(`Original card balance: ${cardBalance}`);

    const rate = exchangeRates[currencyUnit]; // 当前法定货币的汇率
    const cryptoToUsdRate = exchangeRates[cardShortName] || 1; // 加密货币对美元的汇率，默认为1

    // 打印汇率信息
    console.log(`Rate for ${currencyUnit}: ${rate}`);
    console.log(`Crypto to USD rate for ${cardShortName}: ${cryptoToUsdRate}`);

    if (!rate) {
      return cardBalance; // 如果没有找到汇率，返回原始余额
    }

    const usdBalance = cardBalance * cryptoToUsdRate; // 将加密货币余额转换为 USD
    // 打印转换后的 USD 余额
    console.log(`USD Balance: ${usdBalance}`);

    // 计算并返回法定货币的余额，并保留两位小数
    const finalBalance = (usdBalance * rate).toFixed(2);
    // 打印最终转换后的余额
    console.log(`Converted Balance in ${currencyUnit}: ${finalBalance}`);

    return finalBalance;
  };

  useEffect(() => {
    console.log("Updated cryptoCards:", cryptoCards);
  }, [cryptoCards]);

  useEffect(() => {
    // 同步 initialAdditionalCryptos 中的 balance 到 cryptoCards
    const updatedCryptoCards = cryptoCards.map((card) => {
      const matchingCrypto = initialAdditionalCryptos.find(
        (crypto) => crypto.shortName === card.shortName
      );
      if (matchingCrypto) {
        return { ...card, balance: matchingCrypto.balance };
      }
      return card;
    });

    setCryptoCards(updatedCryptoCards);
  }, [initialAdditionalCryptos]);

  useEffect(() => {
    setAddedCryptos(cryptoCards);
  }, [cryptoCards]);
  // 监听 createPendingModalVisible 的变化
  useEffect(() => {
    if (!createPendingModalVisible) {
      // 当模态框关闭时重置状态
      setWalletCreationStatus({
        image: require("../assets/gif/Pending.gif"), // 重置为默认显示 Pending.gif
        title: t("Creating on LIKKIM Hardware..."), // 重置为默认主消息
        subtitle: t("Your device is already verified."), // 重置为默认子消息
      });
      setImportingStatus({
        image: require("../assets/gif/Pending.gif"), // 重置为默认显示 Pending.gif
        title: t("Importing on LIKKIM Hardware..."), // 重置为默认主消息
        subtitle: t("Your device is already verified."), // 重置为默认子消息
      });
    }
  }, [createPendingModalVisible]); // 依赖 createPendingModalVisible

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
  }, []); // 这个依赖空数组确保该代码只在组件挂载时执行一次

  useEffect(() => {
    if (!bleVisible && selectedDevice) {
      setPinModalVisible(true);
    }
  }, [bleVisible, selectedDevice]);
  // Update Bluetooth modal visibility management
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
      const sendDecryptedValue = async (decryptedValue) => {
        try {
          const message = `ID:${decryptedValue}`;
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
      monitorVerificationCode(device, sendDecryptedValue);

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
      setPinModalVisible(true);
    } catch (error) {
      console.log("设备连接或命令发送错误:", error);
    }
  };
  // 处理断开连接的逻辑
  const handleDisconnectDevice = async (device) => {
    try {
      // 停止监听验证码，避免因断开连接导致的错误
      // stopMonitoringVerificationCode();

      await device.cancelConnection(); // 断开设备连接
      console.log(`设备 ${device.id} 已断开连接`);

      // 移除已验证设备的ID
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

  const handleVerifyAddress = () => {
    if (verifiedDevices.length > 0) {
      // 发送显示地址命令时，确保传递的是设备对象
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        showLIKKIMAddressCommand(device); // 确保这里传递的是完整的设备对象
      } else {
        setAddressModalVisible(false);
        setBleVisible(true);
      }
    } else {
      setAddressModalVisible(false);
      setBleVisible(true);
    }
  };

  // 显示地址函数
  const showLIKKIMAddressCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.log("无效的设备对象：", device);
        return;
      }

      // 无论设备是否连接，均重新连接并发现服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.log(
          "设备没有 writeCharacteristicWithResponseForService 方法。"
        );
        return;
      }

      // TRX 和路径的字符串
      const coinType = "TRX";
      const derivationPath = "m/44'/195'/0'/0/0";

      // 转换字符串为16进制格式
      const coinTypeHex = Buffer.from(coinType, "utf-8").toString("hex");
      const derivationPathHex = Buffer.from(derivationPath, "utf-8").toString(
        "hex"
      );

      console.log(`Coin Type Hex: ${coinTypeHex}`);
      console.log(`Derivation Path Hex: ${derivationPathHex}`);

      // 计算长度
      const coinTypeLength = coinTypeHex.length / 2; // 字节长度
      const derivationPathLength = derivationPathHex.length / 2; // 字节长度

      // 总长度（包括命令标识符、标志位、TRX 长度、TRX 数据、路径长度、路径数据）
      const totalLength = 1 + 1 + coinTypeLength + 1 + derivationPathLength;

      console.log(`Total Length: ${totalLength}`);

      // 构建命令数据
      const commandData = new Uint8Array([
        0xf9, // 命令标识符
        0x02, // 添加标志位
        coinTypeLength, // TRX 的长度
        ...Buffer.from(coinTypeHex, "hex"), // TRX 的16进制表示
        derivationPathLength, // 路径的长度
        ...Buffer.from(derivationPathHex, "hex"), // 路径的16进制表示
        totalLength, // 总长度，包括命令、标志位、TRX和路径
      ]);

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

      console.log(
        `显示地址命令: ${Array.from(finalCommand)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")}`
      );

      // 发送显示地址命令
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 最终的命令数据的Base64编码
      );
      // 设置正在验证地址的状态，立即显示文案
      setIsVerifyingAddress(true);
      setAddressVerificationMessage(t("Verifying Address on LIKKIM..."));
      console.log("显示地址命令已发送");

      // 开始监听 BLE 设备的响应
      const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
      const addressMonitorSubscription = device.monitorCharacteristicForService(
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

          // 将接收到的数据解析为16进制字符串
          const receivedDataHex = receivedData.toString("hex").toUpperCase();
          console.log("接收到的16进制数据字符串:", receivedDataHex);

          // 检查是否为指定的数据
          if (receivedDataHex === "A40302B1120D0A") {
            console.log("在LIKKIM上显示地址成功");
            setAddressVerificationMessage(
              t("Address successfully displayed on LIKKIM!")
            );
          }
        }
      );

      // 返回 subscription 用于在其他地方进行清理
      return addressMonitorSubscription;
    } catch (error) {
      console.log("发送显示地址命令失败:", error);
    }
  };

  // 创建钱包命令
  const sendCreateWalletCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.log("无效的设备对象：", device);
        return;
      }

      // 无论设备是否连接，均重新连接并发现服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.log(
          "设备没有 writeCharacteristicWithResponseForService 方法。"
        );
        return;
      }

      // 构建创建钱包命令为字符串 "create:16"
      const createWalletCommand = "create:16";

      // 将字符串转换为 UTF-8 编码的 Buffer
      const bufferCommand = Buffer.from(createWalletCommand, "utf-8");

      // 将 Buffer 转换为 Base64 编码的字符串
      const base64Command = bufferCommand.toString("base64");

      console.log(`创建钱包命令 (字符串): ${createWalletCommand}`);
      console.log(`创建钱包命令 (Base64): ${base64Command}`);

      // 发送 Base64 编码的命令
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // Base64 编码字符串
      );

      console.log("创建钱包命令已发送");

      // 开始监听创建结果
      monitorWalletCreationResult(device);
    } catch (error) {
      console.log("发送创建钱包命令失败:", error);
    }
  };

  // 导入钱包命令
  const sendImportWalletCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.log("无效的设备对象：", device);
        return;
      }

      console.log("发送导入钱包命令之前的设备对象:", device);

      // 无论设备是否连接，均重新连接并发现服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.log(
          "设备没有 writeCharacteristicWithResponseForService 方法。"
        );
        return;
      }

      // 构建导入钱包命令为字符串 "Import"
      const importWalletCommand = "Import";

      // 将字符串转换为 UTF-8 编码的 Buffer
      const bufferCommand = Buffer.from(importWalletCommand, "utf-8");

      // 将 Buffer 转换为 Base64 编码的字符串
      const base64Command = bufferCommand.toString("base64");

      console.log(`导入钱包命令 (字符串): ${importWalletCommand}`);
      console.log(`导入钱包命令 (Base64): ${base64Command}`);

      // 发送 Base64 编码的命令
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // Base64 编码字符串
      );

      console.log("导入钱包命令已发送");

      // 开始监听导入结果
      monitorWalletCreationResult(device);
    } catch (error) {
      console.log("发送导入钱包命令失败:", error);
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

  // 解密算法
  function decrypt(v, k) {
    let v0 = v[0] >>> 0,
      v1 = v[1] >>> 0,
      sum = 0xc6ef3720 >>> 0,
      i;
    const delta = 0x9e3779b9 >>> 0;
    const k0 = k[0] >>> 0,
      k1 = k[1] >>> 0,
      k2 = k[2] >>> 0,
      k3 = k[3] >>> 0;

    for (i = 0; i < 32; i++) {
      v1 -= (((v0 << 4) >>> 0) + k2) ^ (v0 + sum) ^ (((v0 >>> 5) >>> 0) + k3);
      v1 >>>= 0;
      v0 -= (((v1 << 4) >>> 0) + k0) ^ (v1 + sum) ^ (((v1 >>> 5) >>> 0) + k1);
      v0 >>>= 0;
      sum -= delta;
      sum >>>= 0;
    }
    v[0] = v0 >>> 0;
    v[1] = v1 >>> 0;
  }

  let monitorSubscription;
  //监听函数
  const monitorVerificationCode = (device, sendDecryptedValue) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("监听设备响应时出错:", error.message);
          return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("接收到的数据字符串:", receivedDataString);

        // ==========================
        // 映射表: 前缀 -> shortName
        // ==========================
        const prefixToShortName = {
          "ethereum:": "ETH", // Ethereum
          "bitcoin_cash:": "BCH", // Bitcoin Cash
          "optimism:": "OP", // Optimism
          "ethereum_classic:": "ETC", // Ethereum Classic
          "litecoin:": "LTC", // Litecoin
          "ripple:": "XRP", // Ripple
          "solana:": "SOL", // Solana
          "arbitrum:": "ARB", // Arbitrum
          "binance:": "BNB", // Binance Coin (BNB)
          "aurora:": "AURORA", // Aurora
          "avalanche:": "AVAX", // Avalanche
          "bitcoin:": "BTC", // Bitcoin
          "celo:": "CELO", // Celo
          "fantom:": "FTM", // Fantom
          "huobi:": "HTX", // Huobi Token
          "iotex:": "IOTX", // IoTeX
          "okx:": "OKT", // OKT
          "polygon:": "POL", // Polygon
          "ripple:": "XRP", // Ripple
          "tron:": "TRX", // Tron
          "zksync:": "ZKSYNC", // zkSync Era
          "cosmos:": "ATOM", // Cosmos
          "celestia:": "CEL", // Celestia
          "cronos:": "CRO", // Cronos
          "juno:": "JUNO", // Juno
          "osmosis:": "OSMO", // Osmosis
          "gnosis:": "GNO", // Gnosis
          "linea:": "LINEA", // Linea
          "ronin:": "RON", // Ronin
          "aptos:": "APT", // Aptos
          "sui:": "SUI", // SUI
        };

        // 检查是否以某个前缀开头
        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );

        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim(); // 提取地址
          const shortName = prefixToShortName[prefix]; // 获取对应的 shortName

          console.log(`收到的 ${shortName} 地址: `, newAddress);

          // 更新对应加密货币的地址
          updateCryptoAddress(shortName, newAddress);
        }

        // 处理包含 "ID:" 的数据
        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);

          decrypt(encryptedData, key);

          const decryptedHex = uint32ArrayToHexString(encryptedData);
          console.log("解密后的字符串:", decryptedHex);

          // 将解密后的值发送给设备
          if (sendDecryptedValue) {
            sendDecryptedValue(decryptedHex);
          }
        }

        // 如果接收到 "VALID"，改变状态并发送 "validation"
        if (receivedDataString === "VALID") {
          try {
            // 立即更新状态为 "VALID"
            setBlueToothStatus("VALID");
            console.log("状态更新为: VALID");

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
            console.log(`已发送字符串 'validation' 给设备`);
          } catch (error) {
            console.log("发送 'validation' 时出错:", error);
          }
        }

        // 提取完整的 PIN 数据（例如 PIN:1234,Y 或 PIN:1234,N）
        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString); // 保存完整的 PIN 数据
          console.log("接收到的完整数据字符串:", receivedDataString);
        }
      }
    );
  };

  // 监听钱包生成结果
  const monitorWalletCreationResult = (device) => {
    const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

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

        // 将接收到的数据解析为十六进制字符串
        const receivedDataHex = receivedData.toString("hex").toUpperCase();
        /*        console.log(
          "接收到监听钱包生成结果模块的16进制数据字符串:",
          receivedDataHex
        ); */

        if (receivedDataHex === "A40002B1E20D0A") {
          console.log("钱包创建失败");
          // 调用显示地址的函数
        } else if (receivedDataHex === "A40102B0720D0A") {
          console.log("钱包创建成功");
          // 钱包创建成功后的逻辑处理
          // showAddressCommand(device);
          monitorWalletAddress(device);
        }
      }
    );
  };

  // 监听地址监听钱包地址的函数
  const monitorWalletAddress = (device) => {
    const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

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
          //    return;
        }
        // Base64解码接收到的数据
        const receivedData = Buffer.from(characteristic.value, "base64");

        // 将接收到的数据解析为十六进制字符串
        const receivedDataHex = receivedData.toString("hex");
        console.log("接收到监听地址模块的16进制数据字符串:", receivedDataHex);

        // 检查头部标志位是否为 A4
        if (receivedDataHex.startsWith("a4")) {
          // 解析链名长度
          const chainNameLength = parseInt(receivedDataHex.substring(2, 4), 16);
          console.log("链名长度:", chainNameLength);

          // 解析链名
          const chainNameStartIndex = 4;
          const chainNameEndIndex = chainNameStartIndex + chainNameLength * 2;
          const chainNameHex = receivedDataHex.substring(
            chainNameStartIndex,
            chainNameEndIndex
          );
          const chainName = Buffer.from(chainNameHex, "hex").toString("utf-8");
          console.log("链名chainShortName:", chainName);

          // 解析地址长度
          const addressLengthIndex = chainNameEndIndex;
          const addressLength = parseInt(
            receivedDataHex.substring(
              addressLengthIndex,
              addressLengthIndex + 2
            ),
            16
          );
          console.log("地址长度:", addressLength);

          // 解析钱包地址
          const addressStartIndex = addressLengthIndex + 2;
          const addressEndIndex = addressStartIndex + addressLength * 2;
          const walletAddressHex = receivedDataHex.substring(
            addressStartIndex,
            addressEndIndex
          );
          const walletAddress = Buffer.from(walletAddressHex, "hex").toString(
            "utf-8"
          );
          console.log("钱包地址:", walletAddress);

          // 解析总数据长度
          const totalDataLengthIndex = addressEndIndex;
          const totalDataLength = parseInt(
            receivedDataHex.substring(
              totalDataLengthIndex,
              totalDataLengthIndex + 2
            ),
            16
          );
          console.log("总数据长度:", totalDataLength);

          // 解析CRC校验码
          const crcStartIndex = totalDataLengthIndex + 2;
          const receivedCrcLowByte = receivedDataHex.substring(
            crcStartIndex,
            crcStartIndex + 2
          );
          const receivedCrcHighByte = receivedDataHex.substring(
            crcStartIndex + 2,
            crcStartIndex + 4
          );
          const receivedCrc = receivedCrcLowByte + receivedCrcHighByte;
          console.log("接收到的CRC:", receivedCrc);

          // 计算CRC并校验
          const dataToVerifyHex = receivedDataHex.substring(0, crcStartIndex);
          const dataToVerify = Buffer.from(dataToVerifyHex, "hex");
          let calculatedCrc = crc16Modbus(dataToVerify)
            .toString(16)
            .padStart(4, "0");
          calculatedCrc = calculatedCrc.slice(2) + calculatedCrc.slice(0, 2);
          if (calculatedCrc.toLowerCase() === receivedCrc.toLowerCase()) {
            console.log("CRC校验通过，数据有效");

            // 在此处添加接收钱包生成地址成功的日志
            console.log("接收钱包生成地址成功:", walletAddress);

            // 根据 chainShortName 搜索并更新对应的数字货币地址字段
            let isUpdated = false;

            // 更新 initialAdditionalCryptos 中的地址
            setInitialAdditionalCryptos((prevCryptos) =>
              prevCryptos.map((crypto) => {
                if (crypto.chainShortName === chainName) {
                  isUpdated = true;
                  console.log(
                    `更新 ${crypto.chainShortName} 的地址为: ${walletAddress}`
                  );
                  return { ...crypto, address: walletAddress };
                }
                return crypto;
              })
            );

            // 先定义 newCryptos 在外部作用域
            let newCryptos = [];

            setCryptoCards((prevCards) => {
              console.log("Before update: ", prevCards);

              // 查找所有匹配的链信息，并更新外部作用域的 newCryptos
              newCryptos = initialAdditionalCryptos.filter(
                (crypto) => crypto.chainShortName === chainName
              );

              if (newCryptos.length === 0) {
                // 如果没有找到匹配的 crypto，则直接返回当前的卡片列表
                console.log(
                  "No matching cryptos found. Returning previous cards."
                );
                return prevCards;
              }

              const updatedCards = newCryptos.reduce((acc, crypto) => {
                const filteredCards = acc.filter(
                  (card) =>
                    card.key !== `${crypto.shortName}_${crypto.chainShortName}`
                );

                return [
                  ...filteredCards,
                  {
                    key: `${crypto.shortName}_${crypto.chainShortName}`,
                    name: crypto.name,
                    shortName: crypto.shortName,
                    balance: crypto.balance,
                    icon: crypto.icon,
                    cardImage: crypto.cardImage,
                    address: walletAddress,
                    chain: crypto.chain,
                    chainShortName: crypto.chainShortName,
                    chainIcon: crypto.chainIcon,
                  },
                ];
              }, prevCards);

              console.log("After update: ", updatedCards);
              return updatedCards;
            });

            // 在所有卡片更新后，手动调用 handleUpdateCryptoCards
            newCryptos.forEach((crypto) => handleUpdateCryptoCards(crypto));

            // 检查状态更新后的内容
            console.log("Updated cryptoCards: ", cryptoCards);

            // 更新状态，切换图片和文本信息
            setWalletCreationStatus({
              image: require("../assets/gif/Success.gif"),
              title: t("Wallet Creation Successful!"),
              subtitle: t("Your wallet address has been created successfully."),
            });
            // 导入成功时
            setImportingStatus({
              image: require("../assets/gif/Success.gif"),
              title: t("Wallet Import Successful!"),
              subtitle: t("Your wallet has been successfully imported."),
            });
          } else {
            console.log(
              `CRC校验失败，数据可能无效。Received: ${receivedCrc}, Calculated: ${calculatedCrc}`
            );
          }
        } else {
          console.log("收到的数据头部不正确，期望A4");
        }
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

      try {
        const response = await fetch(
          `https://df.likkim.com/api/market/index-tickers?instId=${instIds}`
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
  }, [cryptoCards]); // 依赖于 cryptoCards

  // 停止监听
  useEffect(() => {
    if (!pinModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [pinModalVisible]);

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

  useEffect(() => {
    if (modalVisible) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      setTimeout(() => {
        scrollYOffset.current = 0;
      }, 300); // 确保在滚动完成后再设置偏移量
    }
  }, [modalVisible]);

  const handlePinSubmit = async () => {
    setPinModalVisible(false); // 关闭 PIN 输入模态框

    // 确保完整保留接收到的数据字符串
    const verificationCodeValue = receivedVerificationCode.trim(); // 接收到的完整字符串
    const pinCodeValue = pinCode.trim(); // 用户输入的 PIN

    console.log(`用户输入的 PIN: ${pinCodeValue}`);
    console.log(`接收到的完整数据: ${verificationCodeValue}`);

    // 使用 ':' 分割，提取 PIN 和标志位部分
    const [prefix, rest] = verificationCodeValue.split(":"); // 分割出前缀和其余部分
    if (prefix !== "PIN" || !rest) {
      console.log("接收到的验证码格式不正确:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    // 使用 ',' 分割，提取 PIN 和标志位
    const [receivedPin, flag] = rest.split(","); // 分割出 PIN 值和标志位
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("接收到的验证码格式不正确:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    console.log(`提取到的 PIN 值: ${receivedPin}`);
    console.log(`提取到的标志位: ${flag}`);

    // 验证用户输入的 PIN 是否匹配
    if (pinCodeValue === receivedPin) {
      console.log("PIN 验证成功");
      setVerificationStatus("success");

      // 添加设备 ID 到 verifiedDevices 数组，确保不重复
      const newVerifiedDevices = new Set([
        ...verifiedDevices,
        selectedDevice.id,
      ]);
      setVerifiedDevices([...newVerifiedDevices]);

      // 异步存储更新后的 verifiedDevices 数组
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([...newVerifiedDevices])
      );

      setIsVerificationSuccessful(true);
      console.log("设备验证并存储成功");

      // 如果标志位为 Y，发送字符串 'address'
      if (flag === "Y") {
        console.log("设备返回了 PIN:xxxx,Y，发送字符串 'address' 给嵌入式设备");
        try {
          const message = "address";
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");

          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log("字符串 'address' 已成功发送给设备");
        } catch (error) {
          console.log("发送字符串 'address' 时发生错误:", error);
        }
      } else if (flag === "N") {
        console.log("设备返回了 PIN:xxxx,N，无需发送 'address'");
      }
    } else {
      console.log("PIN 验证失败");
      setVerificationStatus("fail");

      if (monitorSubscription) {
        monitorSubscription.remove();
        console.log("验证码监听已停止");
      }

      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("已断开与设备的连接");
      }
    }

    setPinCode(""); // 清空 PIN 输入框
  };

  const handleDeleteCard = () => {
    scrollViewRef?.current.setNativeProps({ scrollEnabled: true });
    // console.warn(likkim_select_card + ':likkim')
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

  const handleCardPress = (cryptoName, index) => {
    console.log("click card...");

    const crypto = cryptoCards.find((card) => card.name === cryptoName);
    setSelectedAddress(crypto?.address || "Unknown");
    setSelectedCardName(cryptoName);
    // console.warn("设置：likkim_set_select_card" + cryptoName);

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
        (crypto) => !cryptoCards.find((card) => card.name === crypto.name)
      ),
    ];
    setCryptoCards(newCryptoCards);
    setCryptoCount(newCryptoCards.length);
    setAddedCryptos(newCryptoCards);
    setAddCryptoVisible(false);
  };

  const handleCreateWallet = () => {
    setAddWalletModalVisible(false);
    setTipModalVisible(true);
  };

  const handleImportWallet = () => {
    setAddWalletModalVisible(false);

    if (verifiedDevices.length > 0) {
      // 如果有已验证的设备，找到设备并执行导入命令
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        sendImportWalletCommand(device);
        setImportingModalVisible(true);
      } else {
        // 如果找不到与ID匹配的设备对象，则显示蓝牙模态框
        setBleVisible(true);
      }
    } else {
      // 如果没有已验证的设备，显示蓝牙模态框
      setBleVisible(true);
    }
  };

  const handleWalletTest = () => {
    setAddWalletModalVisible(false);
    setProcessModalVisible(true);
  };

  const handleContinue = () => {
    setTipModalVisible(false);
    setRecoveryPhraseModalVisible(false);

    if (verifiedDevices.length > 0) {
      // 发送创建钱包命令时，确保传递的是设备对象
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        // 调用监听钱包地址的函数

        sendCreateWalletCommand(device); // 确保这里传递的是完整的设备对象

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
      const convertedBalance = parseFloat(
        getConvertedBalance(card.balance, card.shortName)
      );
      return total + convertedBalance;
    }, 0);

    return totalBalance.toFixed(2);
  };

  const animatedCardStyle = (index) => {
    const cardStartPosition = cardStartPositions.current[index] || 0;
    const endPosition =
      Platform.OS == "android" ? 60 : 120 - (scrollYOffset.current || 0); // 考虑 scrollTo 的 Y 偏移量
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

  //检查更新
  async function onFetchUpdateAsync() {
    try {
      if (__DEV__) return;

      console.log("检查更新..");
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        console.log("有新版！");

        await Updates.fetchUpdateAsync();
        Alert.alert("The new version is ready. ", "Do you want to update it?", [
          {
            text: "Update now ",
            onPress() {
              Updates.reloadAsync();
            },
          },
          {
            text: "Later",
          },
        ]);
      }
    } catch (error) {
      console.log("更新服务检查失败:");
      console.log(
        error instanceof Error ? error.message : JSON.stringify(error)
      );
    }
  }

  //热更新支持
  useEffect(() => {
    onFetchUpdateAsync();
  }, []);

  return (
    <LinearGradient
      colors={isDarkMode ? ["#21201E", "#0E0D0D"] : ["#FFFFFF", "#EDEBEF"]}
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
        refreshControl={
          cryptoCards.length > 0 && (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          )
        }
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
                {`${calculateTotalBalance()} `}
                <Text style={WalletScreenStyle.currencyUnit}>
                  {currencyUnit}
                </Text>
              </Text>
            </>
          )}
        </Animated.View>

        {cryptoCards.length === 0 && (
          <EmptyWalletView
            isDarkMode={isDarkMode}
            WalletScreenStyle={WalletScreenStyle}
            setAddWalletModalVisible={setAddWalletModalVisible}
            t={t}
          />
        )}

        {/* TODO fix */}
        {/* {<WalletList cards={cryptoCards} priceChanges={priceChanges} WalletScreenStyle={WalletScreenStyle} handleQRCodePress={handleQRCodePress} />} */}

        {/* <Text>{"LIKKIM:" + likkim_select_card}</Text> */}

        {cryptoCards.map((card, index) => {
          const isBlackText = [""].includes(card.shortName);
          const priceChange = priceChanges[card.shortName]?.priceChange || "0";
          const percentageChange =
            priceChanges[card.shortName]?.percentageChange || "0";
          const textColor =
            percentageChange > 0
              ? isBlackText
                ? "#00EE88"
                : "#00EE88"
              : isBlackText
              ? "#F44336"
              : "#F44336";

          return (
            <TouchableHighlight
              underlayColor={"transparent"}
              key={`${card.shortName}_${index}`}
              onPress={() => handleCardPress(card.name, index)}
              ref={(el) => {
                cardRefs.current[index] = el;
                initCardPosition(el, index);
              }}
              style={[
                WalletScreenStyle.cardContainer,
                selectedCardIndex === index && { zIndex: 3 },
              ]}
              disabled={modalVisible}
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
                  {["cardIconContainer", "cardChainIconContainer"].map(
                    (styleKey, i) => (
                      <View key={i} style={WalletScreenStyle[styleKey]}>
                        <Image
                          source={i === 0 ? card.icon : card.chainIcon}
                          style={
                            i === 0
                              ? WalletScreenStyle.cardIcon
                              : WalletScreenStyle.chainIcon
                          }
                        />
                      </View>
                    )
                  )}
                  <View style={{ position: "absolute", top: 25, left: 65 }}>
                    <View style={WalletScreenStyle.cardInfoContainer}>
                      {["cardName", "chainText"].map((textStyle, i) =>
                        i === 0 ? (
                          <Text
                            key={i}
                            style={[
                              WalletScreenStyle[textStyle], // 现有样式
                              {
                                color: isBlackText ? "#333" : "#eee",
                                marginRight: 4,
                                marginBottom: 4,
                              }, // 添加新的 marginRight 属性
                            ]}
                          >
                            {card.name}
                          </Text>
                        ) : (
                          <View
                            key={i}
                            style={[
                              WalletScreenStyle.chainContainer, // 新增按钮样式
                              // 根据主题颜色改变按钮背景色
                            ]}
                          >
                            <Text
                              style={[
                                WalletScreenStyle.chainCardText,
                                { color: isBlackText ? "#333" : "#eee" },
                              ]}
                            >
                              {card.chain}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                    <Image
                      source={require("../assets/CardBg/Logo.png")}
                      style={{
                        left: 50,
                        top: -60,
                        opacity: 0.2,
                        width: 280,
                        height: 280,
                        transform: [{ rotate: "-10deg" }],
                      }}
                    />
                    <Text
                      style={[
                        WalletScreenStyle.cardShortName,
                        isBlackText && { color: "#121518" },
                      ]}
                    >
                      {card.shortName}
                    </Text>
                  </View>
                  {!modalVisible ? (
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
                        <Text style={{ color: textColor, fontWeight: "bold" }}>
                          {percentageChange > 0 ? "+" : ""}
                          {percentageChange}%
                        </Text>
                        <Text
                          style={[
                            WalletScreenStyle.balanceShortName,
                            isBlackText && { color: "#121518" },
                          ]}
                        >
                          {`${getConvertedBalance(
                            card.balance,
                            card.shortName
                          )} ${currencyUnit}`}
                        </Text>
                      </View>
                    </>
                  ) : (
                    cardInfoVisible && (
                      <View style={WalletScreenStyle.cardModalContent}>
                        <TouchableOpacity
                          opacity={1}
                          onPress={() => handleQRCodePress(card)}
                          style={{ position: "absolute", right: 0, top: 0 }}
                        >
                          <Image
                            source={require("../assets/icon/QR.png")}
                            style={[
                              WalletScreenStyle.QRImg,
                              isBlackText && { tintColor: "#121518" },
                            ]}
                          />
                        </TouchableOpacity>
                        {["cardBalanceCenter", "balanceShortNameCenter"].map(
                          (styleKey, i) => (
                            <Text
                              key={i}
                              style={[
                                WalletScreenStyle[styleKey],
                                isBlackText && { color: "#121518" },
                              ]}
                            >
                              {`${
                                i === 0
                                  ? card.balance
                                  : getConvertedBalance(
                                      card.balance,
                                      card.shortName
                                    )
                              } ${i === 0 ? card.shortName : currencyUnit}`}
                            </Text>
                          )
                        )}
                      </View>
                    )
                  )}
                </ImageBackground>
              </Animated.View>
            </TouchableHighlight>
          );
        })}

        {modalVisible && (
          <TabModal
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            closeModal={closeModal}
            WalletScreenStyle={WalletScreenStyle}
            t={t}
            tabOpacity={tabOpacity}
            transactionHistory={transactionHistory} // 传递交易历史记录
            scrollViewRef={scrollViewRef}
            selectedCrypto={selectedCrypto}
            isDarkMode={isDarkMode} // 新增参数，传递当前是否为暗模式
            fadeAnim={fadeAnim} // 新增参数，传递动画效果
            darkColorsDown={darkColorsDown} // 新增参数，传递暗模式下的渐变颜色
            lightColorsDown={lightColorsDown} // 新增参数，传递亮模式下的渐变颜色
          />
        )}
      </ScrollView>
      <ModalsContainer
        addressModalVisible={addressModalVisible}
        setAddressModalVisible={setAddressModalVisible}
        selectedCryptoIcon={selectedCryptoIcon}
        selectedCrypto={selectedCrypto}
        selectedAddress={selectedAddress}
        isVerifyingAddress={isVerifyingAddress}
        addressVerificationMessage={addressVerificationMessage}
        handleVerifyAddress={handleVerifyAddress}
        WalletScreenStyle={WalletScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
        addWalletModalVisible={addWalletModalVisible}
        setAddWalletModalVisible={setAddWalletModalVisible}
        handleCreateWallet={handleCreateWallet}
        handleImportWallet={handleImportWallet}
        handleWalletTest={handleWalletTest}
        tipModalVisible={tipModalVisible}
        setTipModalVisible={setTipModalVisible}
        handleContinue={handleContinue}
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
        pinModalVisible={pinModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        handlePinSubmit={handlePinSubmit}
        setPinModalVisible={setPinModalVisible}
        verificationStatus={verificationStatus}
        setVerificationStatus={setVerificationStatus}
        blueToothStatus={blueToothStatus}
        setBlueToothStatus={setBlueToothStatus}
        createPendingModalVisible={createPendingModalVisible}
        importingModalVisible={importingModalVisible}
        setCreatePendingModalVisible={setCreatePendingModalVisible}
        setImportingModalVisible={setImportingModalVisible}
        stopMonitoringWalletAddress={stopMonitoringWalletAddress}
        walletCreationStatus={walletCreationStatus}
        importingStatus={importingStatus}
      />
      {/* Add Crypto Modal */}
      <AddCryptoModal
        visible={addCryptoVisible}
        onClose={() => {
          setAddCryptoVisible(false);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCryptos={filteredCryptos}
        handleAddCrypto={handleAddCrypto}
        styles={WalletScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
        chainCategories={chainCategories}
        cryptoCards={cryptoCards}
      />
    </LinearGradient>
  );
}

export default WalletScreen;
