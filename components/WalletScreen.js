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
  Button,
  RefreshControl,
  Clipboard,
} from "react-native";

// 第三方库
import { LinearGradient } from "expo-linear-gradient";
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
import TabModal from "./walletScreen/TabModal";
import ModalsContainer from "./walletScreen/ModalsContainer";

const serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB";
const writeCharacteristicUUID = "0000FFE2-0000-1000-8000-00805F9B34FB";

function WalletScreen({ route, navigation }) {
  // 使用状态
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const {
    exchangeRates,
    initialAdditionalCryptos,
    setInitialAdditionalCryptos,
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
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColorsDown = ["#212146", "#101021"];
  const lightColorsDown = ["#FDFCFD", "#EDEBEF"];
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const placeholderColor = isDarkMode ? "#ffffff" : "#24234C";
  const [importPhraseModalVisible, setImportPhraseModalVisible] =
    useState(false);
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
  const chainCategories = Array.from(
    new Set(initialAdditionalCryptos.map((crypto) => crypto.chain))
  );
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
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  const bleManagerRef = useRef(null);

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      console.log("Scanning started");
      setIsScanning(true);

      bleManagerRef.current.startDeviceScan(
        null,
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            console.error("BleManager scanning error:", error);
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
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };

  const [bleVisible, setBleVisible] = useState(false); // New state for Bluetooth modal

  const getConvertedBalance = (cardBalance, cardShortName) => {
    // 从汇率中获取目标货币的汇率
    const rate = exchangeRates[currencyUnit];
    const cryptoToUsdRate = exchangeRates[cardShortName] || 1;

    if (!rate) {
      return cardBalance; // 如果找不到汇率，则返回原始余额
    }

    // 计算转换后的余额：首先将加密货币转换为 USD，再乘以汇率
    const usdBalance = cardBalance * cryptoToUsdRate;
    return (usdBalance * rate).toFixed(2); // 转换为目标货币并保留两位小数
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
        console.error("Error loading verified devices: ", error);
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
        bleManagerRef.current.destroy();
      };
    }
  }, []);
  useEffect(() => {
    // 当 cryptoCards 状态变化时，更新 route.params
    navigation.setParams({ cryptoCards });
  }, [cryptoCards]);

  const handleDevicePress = async (device) => {
    // 检查是否传递了有效的设备对象
    if (typeof device !== "object" || typeof device.connect !== "function") {
      console.error("无效的设备对象，无法连接设备:", device);
      return;
    }

    setSelectedDevice(device);

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
        0x0d, // 结束符
        0x0a, // 结束符
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

      // 延迟 5 毫秒
      await new Promise((resolve) => setTimeout(resolve, 5));

      // 发送第二条命令 F1 01 02
      await sendStartCommand(device);

      // 开始监听嵌入式设备的返回信息
      monitorVerificationCode(device);

      // 关闭设备扫描模态框
      setBleVisible(false);

      // 显示 PIN 码输入模态框
      setPinModalVisible(true);
    } catch (error) {
      console.error("设备连接或命令发送错误:", error);
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
      console.error("断开设备连接失败:", error);
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
        console.error("停止监听时发生错误:", error);
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
        console.error("无效的设备对象：", device);
        return;
      }

      // 无论设备是否连接，均重新连接并发现服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.error(
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
      const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";
      const addressMonitorSubscription = device.monitorCharacteristicForService(
        serviceUUID,
        notifyCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            if (error.message.includes("Operation was cancelled")) {
              console.error("监听操作被取消，正在重新连接...");
              reconnectDevice(device); // 主动重连
            } else if (error.message.includes("Unknown error occurred")) {
              console.error("未知错误，可能是一个Bug:", error.message);
              if (error.reason) {
                console.error("错误原因:", error.reason);
              }
              reconnectDevice(device); // 主动重连
            } else {
              console.error("监听设备响应时出错:", error.message);
            }
            return;
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
      console.error("发送显示地址命令失败:", error);
    }
  };
  // 请求地址函数
  const showAddressCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.error("无效的设备对象：", device);
        return;
      }

      // 无论设备是否连接，均重新连接并发现服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.error(
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
      const totalLength = 1 + 1 + 1 + coinTypeLength + 1 + derivationPathLength;

      console.log(`Total Length: ${totalLength}`);

      // 构建命令数据
      const commandData = new Uint8Array([
        0xf9, // 命令标识符
        0x01, // 固定的标志位
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

      setIsVerifyingAddress(true); // 显示提示
      console.log("显示地址命令已发送");
    } catch (error) {
      console.error("发送显示地址命令失败:", error);
    }
  };

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
  // 创建钱包命令
  const sendCreateWalletCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.error("无效的设备对象：", device);
        return;
      }
      //   console.log("发送创建钱包命令之前的设备对象:", device);
      // 无论设备是否连接，均重新连接并发现服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.error(
          "设备没有 writeCharacteristicWithResponseForService 方法。"
        );
        return;
      }

      // 构建命令数据，未包含CRC校验码
      const commandData = new Uint8Array([0xf4, 0x01, 0x10, 0x00, 0x04]);

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
        `创建钱包命令: ${Array.from(finalCommand)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")}`
      );

      // 发送创建钱包命令
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 最终的命令数据的Base64编码
      );
      console.log("创建钱包命令已发送");
      // 开始监听创建结果
      monitorWalletCreationResult(device);
      // monitorGeneratedWalletAddress(device);
    } catch (error) {
      console.error("发送创建钱包命令失败:", error);
    }
  };

  // 导入钱包命令
  const sendImportWalletCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.error("无效的设备对象：", device);
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
        console.error(
          "设备没有 writeCharacteristicWithResponseForService 方法。"
        );
        return;
      }

      // 构建命令数据，未包含CRC校验码
      const commandData = new Uint8Array([0xf4, 0x02, 0x10, 0x00, 0x04]);

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
        `导入钱包命令: ${Array.from(finalCommand)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")}`
      );

      // 发送导入钱包命令
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 最终的命令数据的Base64编码
      );
      console.log("导入钱包命令已发送");
      // 开始监听导入结果
      monitorWalletCreationResult(device);
      // monitorGeneratedWalletAddress(device);
    } catch (error) {
      console.error("发送导入钱包命令失败:", error);
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
      console.error("设备重新连接失败:", error);
    }
  };

  let monitorSubscription;

  const monitorVerificationCode = (device) => {
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          if (error.message.includes("Operation was cancelled")) {
            console.error("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连
          } else if (error.message.includes("Unknown error occurred")) {
            console.error("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.error("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连
          } else {
            console.error("监听设备响应时出错:", error.message);
          }
          return;
        }

        // Base64解码接收到的数据
        const receivedData = Buffer.from(characteristic.value, "base64");

        // 将接收到的数据解析为16进制字符串
        const receivedDataHex = receivedData.toString("hex");
        console.log("接收到的验证码模块16进制数据字符串:", receivedDataHex);

        // 示例：检查接收到的数据的前缀是否正确（例如，预期为 "a1"）
        if (receivedDataHex.startsWith("a1")) {
          // 提取接收到的验证码（根据你的协议调整具体的截取方式）
          const verificationCode = receivedDataHex.substring(2, 6); // 获取从第2个字符开始的4个字符（例如 "a1 04 D2" 中的 "04D2"）
          console.log("接收到的验证码:", verificationCode);

          // 将验证码存储到状态中，或进行进一步的处理
          setReceivedVerificationCode(verificationCode);
        } else {
          console.log("验证码模块接收到的数据:", receivedDataHex);
        }
      }
    );
  };
  // 监听钱包生成结果
  const monitorWalletCreationResult = (device) => {
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          if (error.message.includes("Operation was cancelled")) {
            console.error("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连
          } else if (error.message.includes("Unknown error occurred")) {
            console.error("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.error("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连
          } else {
            console.error("监听设备响应时出错:", error.message);
          }
          return;
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
          showAddressCommand(device);
          monitorWalletAddress(device);
        }
      }
    );
  };

  // 监听地址监听钱包地址的函数
  const monitorWalletAddress = (device) => {
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          if (error.message.includes("Operation was cancelled")) {
            console.error("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连
          } else if (error.message.includes("Unknown error occurred")) {
            console.error("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.error("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连
          } else {
            console.error("监听设备响应时出错:", error.message);
          }
          return;
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
            console.error(
              `CRC校验失败，数据可能无效。Received: ${receivedCrc}, Calculated: ${calculatedCrc}`
            );
          }
        } else {
          console.error("收到的数据头部不正确，期望A4");
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
        console.error("停止监听时发生错误:", error);
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
        //  console.log("Updated addedCryptos wallet page:", cryptoCards); // 打印更新后的 addedCryptos
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

  const handlePinSubmit = async () => {
    // 首先关闭 "Enter PIN to Connect" 的模态框
    setPinModalVisible(false);

    // 将用户输入的 PIN 转换为数字
    const pinCodeValue = parseInt(pinCode, 10); // 将 "1234" 转换为数字 1234

    // 将接收到的验证码转换为数字
    const verificationCodeValue = parseInt(
      receivedVerificationCode.replace(" ", ""),
      16
    );

    console.log(`用户输入的 PIN 数值: ${pinCodeValue}`);
    console.log(`接收到的验证码数值: ${verificationCodeValue}`);

    if (pinCodeValue === verificationCodeValue) {
      console.log("PIN 验证成功");
      setVerificationStatus("success"); // 显示成功提示

      // 更新全局状态为成功，并在终端打印消息
      setIsVerificationSuccessful(true);
      console.log("验证成功！验证状态已更新。");

      // 将已验证的设备ID添加到verifiedDevices状态中并持久化到本地存储
      const newVerifiedDevices = [...verifiedDevices, selectedDevice.id];
      setVerifiedDevices(newVerifiedDevices);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(newVerifiedDevices)
      );

      // 发送成功命令 F4 03 10 00 04 95 97 0D 0A
      const successCommand = new Uint8Array([
        0xf4, 0x03, 0x10, 0x00, 0x04, 0x95, 0x97, 0x0d, 0x0a,
      ]);
      const base64SuccessCommand = base64.fromByteArray(successCommand);

      try {
        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64SuccessCommand
        );
        console.log("Success command has been sent");
      } catch (error) {
        console.error("Failed to send success command", error);
      }
    } else {
      console.log("PIN 验证失败");

      // 停止监听验证码
      if (monitorSubscription) {
        try {
          monitorSubscription.remove();
          console.log("验证码监听已停止");
        } catch (error) {
          console.error("停止监听时发生错误:", error);
        }
      }

      // 主动断开与嵌入式设备的连接
      if (selectedDevice) {
        try {
          await selectedDevice.cancelConnection();
          console.log("已断开与设备的连接");
        } catch (error) {
          console.error("断开连接时发生错误:", error);
        }
      }

      setVerificationStatus("fail"); // 显示失败提示
    }

    // 清空 PIN 输入框
    setPinCode("");
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
        // console.error("未找到与该ID匹配的设备对象");
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
    return cryptoCards
      .reduce((total, card) => total + parseFloat(card.balance), 0)
      .toFixed(2);
  };

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

  //fix card 初始化紀錄位置
  const initCardPosition = (_ref, _index) =>
    _ref?.measure(
      (fx, fy, width, height, px, py) =>
        (cardStartPositions.current[_index] = py)
    );

  return (
    <LinearGradient
      colors={isDarkMode ? ["#24234C", "#101021"] : ["#FFFFFF", "#EDEBEF"]}
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
        {cryptoCards.map((card, index) => {
          const isBlackText = ["BTC", "USDT", "BCH", "DOT", "DOGE"].includes(
            card.shortName
          );
          const priceChange = priceChanges[card.shortName]?.priceChange || "0";
          const percentageChange =
            priceChanges[card.shortName]?.percentageChange || "0";
          const textColor =
            priceChange > 0
              ? isBlackText
                ? "#FF5252"
                : "#F23645"
              : isBlackText
              ? "#22AA94"
              : "#0C9981";

          return (
            <TouchableOpacity
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

                  <View style={WalletScreenStyle.cardInfoContainer}>
                    {["cardName", "chainText"].map((textStyle, i) => (
                      <Text
                        key={i}
                        style={[
                          WalletScreenStyle[textStyle],
                          { color: isBlackText ? "#333" : "#eee" },
                        ]}
                      >
                        {i === 0 ? card.name : card.chain}
                      </Text>
                    ))}
                  </View>

                  <Text
                    style={[
                      WalletScreenStyle.cardShortName,
                      isBlackText && { color: "#121518" },
                    ]}
                  >
                    {card.shortName}
                  </Text>

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
            </TouchableOpacity>
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
        handleDevicePress={handleDevicePress}
        setBleVisible={setBleVisible}
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
        createPendingModalVisible={createPendingModalVisible}
        importingModalVisible={importingModalVisible}
        setCreatePendingModalVisible={setCreatePendingModalVisible}
        setImportingModalVisible={setImportingModalVisible}
        stopMonitoringWalletAddress={stopMonitoringWalletAddress}
        walletCreationStatus={walletCreationStatus}
        importingStatus={importingStatus}
      />
    </LinearGradient>
  );
}

export default WalletScreen;
