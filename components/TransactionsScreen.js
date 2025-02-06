// TransactionsScreen.js
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Clipboard,
  KeyboardAvoidingView,
  Platform,
  Image,
  PermissionsAndroid,
} from "react-native";
import InputAddressModal from "./modal/InputAddressModal";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { prefixToShortName } from "../config/chainPrefixes";
import { useTranslation } from "react-i18next";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import TransactionsScreenStyles from "../styles/TransactionsScreenStyle";
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { detectNetwork } from "../config/networkUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import base64 from "base64-js";
import { Buffer } from "buffer";
import VerificationModal from "./modal/VerificationModal";
import BluetoothModal from "./modal/BluetoothModal";
import AmountModal from "./modal/AmountModal";
import SelectCryptoModal from "./modal/SelectCryptoModal";
import SwapModal from "./modal/SwapModal";
import ReceiveAddressModal from "./modal/ReceiveAddressModal";
import PinModal from "./modal/PinModal";
import "react-native-get-random-values";
import "@ethersproject/shims";
// 导入 ethers 库
import { ethers, Transaction } from "ethers";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import checkAndReqPermission from "../utils/BluetoothPermissions"; //安卓高版本申请蓝牙权限

const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function TransactionsScreen() {
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const { t } = useTranslation();
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);
  const {
    updateCryptoAddress,
    usdtCrypto,
    initialAdditionalCryptos,
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
    updateCryptoData,
    cryptoCards,
    setCryptoCards,
    transactionHistory,
    setTransactionHistory,
  } = useContext(CryptoContext);

  const [
    confirmingTransactionModalVisible,
    setConfirmingTransactionModalVisible,
  ] = useState(false);
  const TransactionsScreenStyle = TransactionsScreenStyles(isDarkMode);
  const addressIcon = isDarkMode ? "#ffffff" : "#676776";
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [selectedCryptoChain, setSelectedCryptoChain] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [valueUsd, setValueUsd] = useState("");
  const [selectedCryptoName, setSelectedCryptoName] = useState(""); // 定义 selectedCryptoName 状态
  const [fee, setFee] = useState("");
  const [queryChainShortName, setQueryChainShortName] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const iconColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const [amount, setAmount] = useState("");
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc"; // 根据 isDarkMode 设置不同的灰色
  const [inputAddress, setInputAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [chainShortName, setChainShortName] = useState(""); // 设置链的简称，例如 TRX
  const [amountModalVisible, setAmountModalVisible] = useState(false); // 新增状态
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 新增交易确认modal状态
  const [transactionFee, setTransactionFee] = useState(""); // 示例交易手续费
  const [hasFetchedBalance, setHasFetchedBalance] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [bleVisible, setBleVisible] = useState(false); // New state for Bluetooth modal
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const restoreIdentifier = Constants.installationId;
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [inputAddressModalVisible, setInputAddressModalVisible] =
    useState(false);
  const [detectedNetwork, setDetectedNetwork] = useState("");
  const bleManagerRef = useRef(null);
  const [selectedToken, setSelectedToken] = useState(""); // 用于存储选中的token
  const [selectedChain, setSelectedChain] = useState(""); // 新增状态
  const [fromDropdownVisible, setFromDropdownVisible] = useState(false);
  const [toDropdownVisible, setToDropdownVisible] = useState(false);
  const [selectedFromToken, setSelectedFromToken] = useState(""); // "From" token state
  const [selectedFromChain, setSelectedFromChain] = useState(""); // "From" chain state
  const [selectedToToken, setSelectedToToken] = useState(""); // "To" token state
  const [selectedToChain, setSelectedToChain] = useState(""); // "To" chain state
  const [paymentAddress, setPaymentAddress] = useState("Your Payment Address");
  const [addressVerificationMessage, setAddressVerificationMessage] = useState(
    t("Verifying Address on LIKKIM...")
  );
  const isAmountValid =
    amount &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= parseFloat(balance) + parseFloat(fee);

  const [modalStatus, setModalStatus] = useState({
    title: t("Confirming Transaction on LIKKIM Device..."),
    subtitle: t("Please confirm the transaction on your LIKKIM device."),
    image: require("../assets/gif/Pending.gif"),
  });

  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      if (Platform.OS === "android") {
        // 在安卓平台上检查和请求权限
        checkAndReqPermission(startScanning);
      } else {
        // 对于非安卓平台，直接开始扫描
        startScanning();
      }
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };

  const startScanning = () => {
    console.log("扫描设备 Scanning started");
    setIsScanning(true);

    bleManagerRef.current.startDeviceScan(
      null,
      { allowDuplicates: true },
      async (error, device) => {
        if (error) {
          console.log("BleManager scanning error:", error);
          return;
        }

        if (device.name && device.name.includes("LIKKIM")) {
          // 存储新设备到设备列表
          setDevices((prevDevices) => {
            if (!prevDevices.find((d) => d.id === device.id)) {
              return [...prevDevices, device];
            }
            return prevDevices;
          });

          /*        if (verifiedDevices[0] && device.id === verifiedDevices[0]) {

            try {
              console.log(`设备 ${device.name} 已验证，准备发送 'ping' 消息`);

              await device.connect();
              await device.discoverAllServicesAndCharacteristics();


              const pingMessage = "ping"; // 要发送的消息
              const bufferPingMessage = Buffer.from(pingMessage, "utf-8");
              const base64PingMessage = bufferPingMessage.toString("base64");

              // 发送 Base64 编码的消息

              await device.writeCharacteristicWithResponseForService(
                serviceUUID,
                writeCharacteristicUUID,
                base64PingMessage
              );
              console.log("发送 'ping' 消息给设备:", base64PingMessage);
            } catch (connectError) {
              console.log(
                `连接设备 ${device.name} 时发生错误:`,
                connectError.message
              );
            }
          } */
        }
      }
    );

    setTimeout(() => {
      console.log("Scanning stopped");
      bleManagerRef.current.stopDeviceScan();
      setIsScanning(false);
    }, 2000);
  };

  // Clear values when opening the modal
  useEffect(() => {
    if (swapModalVisible) {
      // Reset values when the modal opens
      setFromValue("");
      setToValue("");
      setSelectedFromToken("");
      setSelectedToToken("");
    }
  }, [swapModalVisible]);

  useEffect(() => {
    const loadTransactionHistory = async () => {
      try {
        const historyJson = await AsyncStorage.getItem("transactionHistory");
        if (historyJson !== null) {
          // 如果之前保存过交易历史，则将其解析后设置到状态中
          const history = JSON.parse(historyJson);
          setTransactionHistory(history);
        }
      } catch (error) {
        console.log("Failed to load transaction history:", error);
      }
    };

    loadTransactionHistory();
  }, []); // 依赖数组为空，确保此操作仅在组件挂载时执行一次
  // 查询数字货币余额 查询余额
  useEffect(() => {
    if (amountModalVisible && !hasFetchedBalance) {
      const fetchWalletBalance = async () => {
        try {
          // 找到选中的加密货币对象
          const selectedCryptoObj = initialAdditionalCryptos.find(
            (crypto) => crypto.shortName === selectedCrypto
          );

          if (!selectedCryptoObj) {
            console.log("未找到匹配的加密货币对象");
            return;
          }

          // 循环遍历 cryptoCards，为选择的加密货币查询余额
          for (let card of cryptoCards) {
            // 打印 card.name 和 selectedCrypto
            console.log(
              `当前卡片的名称: ${card.name}, 选择的加密货币: ${selectedCrypto}`
            );
            // 打印 card.chain 和 selectedCryptoChain
            console.log(
              `当前卡片的链名称: ${card.chain}, 选择的链名称: ${selectedCryptoChain}`
            );

            // 只查询匹配的加密货币和链
            if (
              card.name === selectedCryptoObj.name &&
              card.chain === selectedCryptoChain
            ) {
              console.log("条件满足，准备发送请求...");

              const postData = {
                chain: card.queryChainName,
                address: card.address,
              };

              // 打印发送的 POST 数据
              console.log("发送的 POST 数据:", postData);

              const response = await fetch(
                "https://bt.likkim.com/api/wallet/balance",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(postData),
                }
              );
              const data = await response.json();

              // 打印收到的响应数据
              console.log("收到的响应数据:", data);

              if (data.code === "0" && data.data) {
                const { name, balance } = data.data;

                // 打印响应数据中的名称和余额
                console.log(`响应数据中的名称: ${name}, 余额: ${balance}`);

                // 更新选择的加密货币余额
                if (name.toLowerCase() === card.queryChainName.toLowerCase()) {
                  card.balance = balance;

                  setCryptoCards((prevCards) => {
                    AsyncStorage.setItem(
                      "cryptoCards",
                      JSON.stringify(prevCards)
                    );
                    return prevCards.map((prevCard) =>
                      prevCard.queryChainName.toLowerCase() ===
                      card.queryChainName.toLowerCase()
                        ? { ...prevCard, balance: balance }
                        : prevCard
                    );
                  });
                }
              } else {
                console.log("响应数据无效或错误代码:", data.code);
              }
              break; // 只查询匹配的卡片，查询完毕后跳出循环
            } else {
              console.log(
                `卡片名称和链名称不匹配，跳过查询: ${card.name} - ${card.chain}`
              );
            }
          }
        } catch (error) {
          console.log("查询余额时发生错误:", error);
        }
      };

      fetchWalletBalance();
      setHasFetchedBalance(true); // 标记为已查询余额，防止重复查询
    }
  }, [
    amountModalVisible, // 确保在 amountModalVisible 变化时触发查询
    hasFetchedBalance, // 确保余额只查询一次
    cryptoCards, // 监听 cryptoCards 变化
    selectedCrypto, // 每次选择的加密货币变化时重新查询余额
    selectedCryptoChain, // 每次选择的加密货币链变化时重新查询余额
    setCryptoCards,
  ]);

  // 监听 initialAdditionalCryptos 的变化，更新 Modal 中的数据
  useEffect(() => {
    if (amountModalVisible) {
      console.log("Amount Modal is visible, checking selected crypto...");

      // 查找选中的加密货币对象
      const selected = initialAdditionalCryptos.find(
        (crypto) =>
          crypto.chain === selectedCryptoChain && crypto.name === selectedCrypto
      );

      // 打印找到的加密货币对象
      if (selected) {
        console.log("debug找到匹配的加密货币对象:", selected);

        // 设置余额、价格等
        setBalance(selected.balance);
        setPriceUsd(selected.priceUsd);
        setValueUsd(selected.valueUsd);
        setFee(selected.fee);

        // 打印设置的值
        console.log("已设置以下值:");
        console.log("Balance:", selected.balance);
        console.log("Price in USD:", selected.priceUsd);
        console.log("Value in USD:", selected.valueUsd);
        console.log("Transaction Fee:", selected.fee);
      } else {
        console.log("未找到匹配的加密货币对象");
      }
    }
  }, [initialAdditionalCryptos, amountModalVisible]);

  /*   useEffect(() => {
    if (bleVisible) {
      scanDevices();
    }
  }, [bleVisible]); */

  // 清理蓝牙管理器
  useEffect(() => {
    return () => {
      bleManagerRef.current && bleManagerRef.current.destroy();
    };
  }, []);

  useEffect(() => {
    let addressMonitorSubscription;
    const startMonitoring = async () => {
      if (addressModalVisible && selectedDevice) {
        addressMonitorSubscription = await showLIKKIMAddressCommand(
          selectedDevice
        );
      }
    };

    startMonitoring();

    // 清理函数，关闭模态框时停止监听
    return () => {
      if (addressMonitorSubscription) {
        addressMonitorSubscription.remove();
        console.log("显示地址监听已停止");
      }
    };
  }, [addressModalVisible, selectedDevice]);

  const handleSwapPress = () => {
    setSwapModalVisible(true);
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
  //监听函数 监听信息 监听方法
  const monitorVerificationCode = (device, sendDecryptedValue) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("监听设备响应时出错:", error.message);
          //      return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("接收到的数据字符串:", receivedDataString);

        // ==========================
        // 映射表: 前缀 -> shortName
        // ==========================

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
            setVerificationStatus("VALID");
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

        // 提取并处理 "signed_data:" 开头的数据
        if (receivedDataString.startsWith("signed_data:")) {
          // 从 receivedDataString 中提取 chain 和 hex 值
          const signedData = receivedDataString.split("signed_data:")[1];
          const [chain, hex] = signedData.split(",");
          // 打印 chain 和 hex 以确认它们的值
          console.log("Chain:", chain.trim());
          console.log("Hex:", hex.trim());
          // 构造 JSON 数据
          const postData = {
            chain: chain.trim(), // 去掉可能的空格
            hex: hex.trim(), // 去掉可能的空格
          };

          console.log("准备发送的 JSON 数据:", postData);

          try {
            // 发送 POST 请求到指定的 URL
            const response = await fetch(
              "https://bt.likkim.com/api/wallet/broadcastHex",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData), // 将数据转换为 JSON 字符串
              }
            );

            // 监听并处理返回结果
            const responseData = await response.json();
            console.log("API 返回的数据:", responseData);

            if (responseData.success) {
              console.log("成功广播交易:", responseData);
            } else {
              console.log("广播交易失败:", responseData.message);
            }
          } catch (error) {
            console.log("发送请求时出错:", error);
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
  //监听签名结果
  const monitorSignedResult = (device) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          // 错误处理
          if (error.message.includes("Operation was cancelled")) {
            console.log("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连逻辑
          } else if (error.message.includes("Unknown error occurred")) {
            console.log("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.log("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连逻辑
          } else {
            console.log("监听设备响应时出错:", error.message);
          }
          return; // 直接返回，避免后续处理
        }

        // 解码 Base64 数据
        const receivedData = Buffer.from(
          characteristic.value,
          "base64"
        ).toString("utf8");
        console.log("接收到的数据:", receivedData);

        // 处理 signed_data 响应
        if (receivedData.startsWith("signed_data:")) {
          // 提取 signed_data 内容
          const signedData = receivedData.split("signed_data:")[1];
          const [chain, hex] = signedData.split(",");
          //    console.log("签名结果 - Chain:", chain.trim());
          //   console.log("签名结果 - Hex:", hex.trim());

          // 构造广播交易的数据
          const postData = {
            chain: chain.trim(), // 去掉可能的空格
            hex: hex.trim(), // 去掉可能的空格
          };

          // 打印对象
          console.log("准备发送的 POST 数据:", postData);
          // 输出: 准备发送的 POST 数据: { chain: "ethereum", hex: "F86C..." }

          // 打印 JSON 字符串
          console.log("POST 数据的 JSON 字符串:", JSON.stringify(postData));

          // 调用广播交易的 API
          try {
            const response = await fetch(
              "https://bt.likkim.com/api/wallet/broadcastHex",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData), // 将数据转换为 JSON 字符串
              }
            );

            const responseData = await response.json();

            if (response.ok && responseData.success) {
              console.log("交易广播成功:", responseData);
            } else {
              console.log("交易广播失败:", responseData);
            }
          } catch (broadcastError) {
            console.log("交易广播时出错:", broadcastError.message);
          }
        } else {
          console.log("签名结果收到未知数据:", receivedData);
        }
      }
    );

    console.log("已启动对 signed_data 的监听");
  };

  // 签名函数
  const signTransaction = async (
    device,
    amount, // 转账金额
    paymentAddress, // 传递 selectedCryptoObj.address
    inputAddress, // 收款地址
    selectedCrypto // 选择的加密货币
  ) => {
    try {
      if (!device?.isConnected) return console.log("设备无效");

      // 连接设备（如果需要）
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();

      // 打印所选币种
      console.log("选择的币种:", selectedCrypto);

      // EVM 区块链映射
      const evmChainMapping = {
        arbitrum: "ARB",
        aurora: "AURORA",
        avalanche: "AVAX",
        binance: "BSC",
        celo: "CELO",
        ethereum: ["ETH", "TEST"], // ETH 和 TEST 映射到 ethereum
        ethereum_classic: "ETC",
        fantom: "FTM",
        gnosis: "GNO",
        huobi: "HTX",
        iotext: "IOTX",
        lina: "LINEA",
        OKT: "OKT",
        optimism: "OP",
        polygon: "POL",
        ronin: "RON",
        zksync: "ZKSYNC",
      };

      // 支付路径映射
      const cryptoPathMapping = {
        bitcoin: "m/49'/0'/0'/0/0",
        ethereum: "m/44'/60'/0'/0/0",
        tron: "m/44'/195'/0'/0/0",
        bitcoin_cash: "m/44'/145'/0'/0/0",
        binance: "m/44'/60'/0'/0/0",
        optimism: "m/44'/60'/0'/0/0",
        ethereum_classic: "m/44'/60'/0'/0/0",
        litecoin: "m/49'/2'/0'/0/0",
        ripple: "m/44'/144'/0'/0/0",
        solana: "m/44'/501'/0'/0/0",
        arbitrum: "m/44'/60'/0'/0/0",
        cosmos: "m/44'/118'/0'/0/0",
        celestia: "m/44'/118'/0'/0/0",
        cronos: "m/44'/60'/0'/0/0",
        juno: "m/44'/118'/0'/0/0",
        osmosis: "m/44'/118'/0'/0/0",
        aurora: "m/44'/60'/0'/0/0",
        avalanche: "m/44'/60'/0'/0/0",
        celo: "m/44'/60'/0'/0/0",
        fantom: "m/44'/60'/0'/0/0",
        gnosis: "m/44'/60'/0'/0/0",
        huobi: "m/44'/60'/0'/0/0",
        iotex: "m/44'/60'/0'/0/0",
        okx: "m/44'/60'/0'/0/0",
        polygon: "m/44'/60'/0'/0/0",
        zksync: "m/44'/60'/0'/0/0",
        aptos: "m/44'/637'/0'/0'/0",
        sui: "m/44'/784'/0'/0'/0",
        cardano: "m/1852'/1815'/0'/0/0",
        linea: "m/44'/60'/0'/0/0",
        ronin: "m/44'/60'/0'/0/0",
      };

      // 将 selectedCrypto 转换为大写，确保一致性
      const selectedCryptoUpper = selectedCrypto.toUpperCase();

      // 查找哪个链标识包含 selectedCrypto
      const chainKey = Object.keys(evmChainMapping).find((key) => {
        const value = evmChainMapping[key];
        return Array.isArray(value)
          ? value.includes(selectedCryptoUpper)
          : value === selectedCryptoUpper;
      });

      if (!chainKey) {
        console.log(`不支持的币种: ${selectedCrypto}`);
        return;
      }

      console.log("选择的链标识:", chainKey);

      // 使用 chainKey 查找对应的路径
      const path = cryptoPathMapping[chainKey];

      if (!path) {
        console.log(`不支持的路径: ${chainKey}`);
        return;
      }

      console.log("选择的路径:", path); // 打印选择的路径

      // 第一步：获取 nonce 和 gasPrice
      const walletParamsResponse = await fetch(
        "https://bt.likkim.com/api/wallet/getSignParam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chain: selectedCrypto, // 使用 selectedCrypto 作为 chain
            address: paymentAddress, // 使用 paymentAddress 参数
          }),
        }
      );

      if (!walletParamsResponse.ok) {
        console.log(
          "获取 nonce 和 gasPrice 失败:",
          walletParamsResponse.status
        );
        return;
      }

      // 获取接口返回数据
      const walletParamsData = await walletParamsResponse.json();
      console.log("getSignParam 返回的数据:", walletParamsData);

      if (
        !walletParamsData.data?.gasPrice ||
        walletParamsData.data?.nonce == null
      ) {
        console.log("接口返回数据不完整:", walletParamsData);
        return;
      }

      const { gasPrice, nonce } = walletParamsData.data;

      // 第二步：构造 POST 请求数据
      const requestData = {
        chainKey: selectedCrypto, // 使用 selectedCrypto 作为链标识
        nonce: nonce, // 使用原始的 nonce 值
        gasLimit: 53000, // 更新的 gas 限制为 53000
        gasPrice: gasPrice, // 不进行任何转换，直接使用返回的 gasPrice
        value: Number(amount), // 确保金额为数字类型
        to: inputAddress, // 目标地址
        contractAddress: "", // 没有合约调用
        contractValue: 0,
      };

      console.log("构造的请求数据:", JSON.stringify(requestData, null, 2));

      // 第三步：发送交易请求
      const response = await fetch(
        "https://bt.likkim.com/api/sign/encode_evm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      const responseData = await response.json();

      monitorSignedResult(device);
      // 打印返回的数据
      if (responseData?.data?.data) {
        console.log("返回的数据:", responseData.data.data);

        // 构建要发送的第一个字符串
        const signMessage = `sign:${chainKey},${path},${responseData.data.data}`;
        console.log("构建的发送消息:", signMessage);

        // 将构建的第一个字符串转换为 Base64 编码
        const bufferMessage = Buffer.from(signMessage, "utf-8");
        const base64Message = bufferMessage.toString("base64");

        // 发送 Base64 编码的数据给设备
        try {
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log("数据已成功发送给设备");
        } catch (error) {
          console.log("发送数据给设备时发生错误:", error);
        }

        // 构建要发送的第二组数据
        const destinationAddress = inputAddress;
        const transactionFee = "0.0001"; // 替换为实际交易手续费
        const secondMessage = `destinationAddress:${destinationAddress},${transactionFee},${chainKey},${path}`;
        console.log("构建的第二组发送消息:", secondMessage);

        // 将第二组消息转换为 Base64 编码
        const bufferSecondMessage = Buffer.from(secondMessage, "utf-8");
        const base64SecondMessage = bufferSecondMessage.toString("base64");

        // 发送第二组数据给设备
        try {
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64SecondMessage
          );
          console.log("第二组数据已成功发送给设备");
        } catch (error) {
          console.log("发送第二组数据给设备时发生错误:", error);
        }
      } else {
        console.log("返回的数据不包含 'data' 字段");
      }

      return responseData; // 返回签名结果
    } catch (error) {
      console.log("处理交易失败:", error.message || error);
    }
  };

  const handleDevicePress = async (device) => {
    // 检查是否传递了有效的设备对象
    if (typeof device !== "object" || typeof device.connect !== "function") {
      console.log("无效的设备对象，无法连接设备:", device);
      return;
    }

    setSelectedDevice(device);
    // setModalVisible(false);
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
          //在这里可以发送ping
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
  // 显示地址函数 发送数据写法
  const showLIKKIMAddressCommand = async (device, coinType) => {
    try {
      // 检查设备对象是否有效
      if (typeof device !== "object" || !device.isConnected) {
        console.log("设备对象无效:", device);
        return;
      }

      // 连接设备并发现所有服务
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("设备已连接并发现所有服务。");

      // 检查设备是否具有 writeCharacteristicWithResponseForService 方法
      if (
        typeof device.writeCharacteristicWithResponseForService !== "function"
      ) {
        console.log(
          "设备不支持 writeCharacteristicWithResponseForService 方法。"
        );
        return;
      }

      // 根据 coinType 匹配对应的字符串
      let commandString;

      switch (coinType) {
        case "BTC":
          commandString = `address:bitcoin`; // Bitcoin
          break;
        case "ETH":
          commandString = `address:ethereum`; // Ethereum
          break;
        case "TRX":
          commandString = `address:tron`; // Tron
          break;
        case "BCH":
          commandString = `address:bitcoin_cash`; // Bitcoin Cash
          break;
        case "BSC":
          commandString = `address:binance`; // BNB
          break;
        case "OP":
          commandString = `address:optimism`; // Optimism
          break;
        case "ETC":
          commandString = `address:ethereum_classic`; // Ethereum Classic
          break;
        case "LTC":
          commandString = `address:litecoin`; // Litecoin
          break;
        case "XRP":
          commandString = `address:ripple`; // Ripple
          break;
        case "SOL":
          commandString = `address:solana`; // Solana
          break;
        case "ARB":
          commandString = `address:arbitrum`; // Arbitrum
          break;
        case "AURORA":
          commandString = `address:aurora`; // Aurora
          break;
        case "AVAX":
          commandString = `address:avalanche`; // Avalanche
          break;
        case "CELO":
          commandString = `address:celo`; // Celo
          break;
        case "FTM":
          commandString = `address:fantom`; // Fantom
          break;
        case "HTX":
          commandString = `address:huobi`; // Huobi ECO Chain
          break;
        case "IOTX":
          commandString = `address:iote`; // IoTeX
          break;
        case "OKT":
          commandString = `address:okx`; // OKX Chain
          break;
        case "POL":
          commandString = `address:polygon`; // Polygon
          break;
        case "ZKSYNC":
          commandString = `address:zksync`; // zkSync Era
          break;
        case "APT":
          commandString = `address:aptos`; // Aptos
          break;
        case "SUI":
          commandString = `address:sui`; // SUI
          break;
        case "COSMOS":
          commandString = `address:cosmos`; // Cosmos
          break;
        case "Celestia":
          commandString = `address:celestia`; // Celestia
          break;
        case "Cronos":
          commandString = `address:cronos`; // Cronos
          break;
        case "Juno":
          commandString = `address:juno`; // Juno
          break;
        case "Osmosis":
          commandString = `address:osmosis`; // Osmosis
          break;
        case "Gnosis":
          commandString = `address:gnosis`; // Gnosis
          break;
        default:
          console.log("不支持的币种:", coinType);
          return;
      }
      // 将命令字符串转换为 Base64 编码
      const encodedCommand = Buffer.from(commandString, "utf-8").toString(
        "base64"
      );

      // 向服务写入命令字符串（确保使用 Base64 编码）
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        encodedCommand
      );

      // 设置验证地址的状态
      setIsVerifyingAddress(true);
      setAddressVerificationMessage("正在 LIKKIM 上验证地址...");
      console.log("地址显示命令已发送:", commandString);

      // 监听设备的响应
      const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
      const addressMonitorSubscription = device.monitorCharacteristicForService(
        serviceUUID,
        notifyCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.log("监听设备响应时出错:", error);
            //    return;
          }
          const receivedDataHex = Buffer.from(characteristic.value, "base64")
            .toString("hex")
            .toUpperCase();
          console.log("接收到的十六进制数据字符串:", receivedDataHex);

          // 检查接收到的数据是否为预期的响应
          if (receivedDataHex === "A40302B1120D0A") {
            console.log("在 LIKKIM 上成功显示地址");
            setAddressVerificationMessage("地址已成功在 LIKKIM 上显示！");
          }
        }
      );

      return addressMonitorSubscription;
    } catch (error) {
      console.log("发送显示地址命令失败:", error);
    }
  };

  // 提交验证码
  const handlePinSubmit = async () => {
    // 首先关闭 "Enter PIN to Connect" 的模态框
    setPinModalVisible(false);

    // 去除用户输入的 PIN 和接收到的验证码的空格
    const pinCodeValue = pinCode.trim(); // 去除多余空格
    const verificationCodeValue = receivedVerificationCode.trim(); // 去除多余空格

    console.log(`用户输入的 PIN: ${pinCodeValue}`);
    console.log(`接收到的验证码: ${verificationCodeValue}`);

    // 检查验证码格式是否正确
    const [prefix, rest] = verificationCodeValue.split(":"); // 分割出前缀和其余部分
    if (prefix !== "PIN" || !rest) {
      console.log("接收到的验证码格式不正确:", verificationCodeValue);
      setVerificationFailModalVisible(true); // 显示失败提示
      return;
    }

    // 使用 ',' 分割，提取 PIN 和标志位
    const [receivedPin, flag] = rest.split(","); // 分割出 PIN 值和标志位
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("接收到的验证码格式不正确:", verificationCodeValue);
      setVerificationFailModalVisible(true); // 显示失败提示
      return;
    }

    console.log(`提取到的 PIN 值: ${receivedPin}`);
    console.log(`提取到的标志位: ${flag}`);

    // 验证用户输入的 PIN 是否匹配
    if (pinCodeValue === receivedPin) {
      console.log("PIN 验证成功");
      setVerificationSuccessModalVisible(true); // 显示成功提示

      setVerifiedDevices([selectedDevice.id]);

      // 异步存储更新后的 verifiedDevices 数组（只存一个设备ID）
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
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
      setVerificationFailModalVisible(true); // 显示失败提示

      if (monitorSubscription) {
        try {
          monitorSubscription.remove();
          console.log("验证码监听已停止");
        } catch (error) {
          console.log("停止监听时发生错误:", error);
        }
      }

      if (selectedDevice) {
        try {
          await selectedDevice.cancelConnection();
          console.log("已断开与设备的连接");
        } catch (error) {
          console.log("断开连接时发生错误:", error);
        }
      }
    }

    // 清空 PIN 输入框
    setPinCode("");
  };

  const handleVerifyAddress = (chainShortName) => {
    console.log("传入的链短名称是:", chainShortName); // 打印传入的链短名称

    if (verifiedDevices.length > 0) {
      // 在已验证设备列表中查找设备
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        showLIKKIMAddressCommand(device, chainShortName); // 将链短名称传递给函数
      } else {
        setAddressModalVisible(false); // 如果没有找到设备，关闭地址模态框
        setBleVisible(true); // 并显示蓝牙模态框
      }
    } else {
      setAddressModalVisible(false); // 如果没有已验证设备，关闭地址模态框
      setBleVisible(true); // 并显示蓝牙模态框
    }
  };

  // 计算CRC-16-Modbus校验码的函数
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

  // 停止监听
  useEffect(() => {
    if (!pinModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [pinModalVisible]);

  let transactionMonitorSubscription;
  // 停止监听交易反馈
  const stopMonitoringTransactionResponse = () => {
    if (transactionMonitorSubscription) {
      transactionMonitorSubscription.remove();
      transactionMonitorSubscription = null;
      console.log("交易反馈监听已停止");
    }
  };

  // 使用 useEffect 监听模态窗口的变化
  useEffect(() => {
    if (!confirmingTransactionModalVisible) {
      stopMonitoringTransactionResponse();
    }
  }, [confirmingTransactionModalVisible]);

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
    // 从 AsyncStorage 加载 addedCryptos 数据
    const loadAddedCryptos = async () => {
      try {
        const savedCryptos = await AsyncStorage.getItem("addedCryptos");
        if (savedCryptos !== null) {
          setAddedCryptos(JSON.parse(savedCryptos));
        }
      } catch (error) {
        console.log("Error loading addedCryptos: ", error);
      }
    };
    loadAddedCryptos();
  }, []);

  const handleReceivePress = () => {
    scanDevices();
    setOperationType("receive");
    setModalVisible(true);
  };

  const handleSendPress = () => {
    scanDevices();
    setOperationType("send");
    setIsAddressValid(false);
    setModalVisible(true);
  };
  const selectCrypto = async (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedCryptoChain(crypto.chain);
    setSelectedAddress(crypto.address);
    setSelectedCryptoIcon(crypto.icon);
    setBalance(crypto.balance); // 确保设置正确的 balance
    setValueUsd(crypto.valueUsd);
    setFee(crypto.fee);
    setPriceUsd(crypto.priceUsd);
    setQueryChainShortName(crypto.queryChainShortName);
    setChainShortName(crypto.chainShortName);
    setSelectedCryptoName(crypto.name);
    setIsVerifyingAddress(false);
    setModalVisible(false);

    if (operationType === "receive") {
      setAddressModalVisible(true);
    } else if (operationType === "send") {
      if (verifiedDevices.length > 0) {
        const device = devices.find((d) => d.id === verifiedDevices[0]);
        if (device) {
          setAddressModalVisible(false);
          setInputAddress("");
          setInputAddressModalVisible(true);
        } else {
          setBleVisible(true);
          setModalVisible(false);
        }
      } else {
        setBleVisible(true);
        setModalVisible(false);
      }
    }
  };

  const handleNextAfterAddress = () => {
    setAmount("");
    setInputAddressModalVisible(false);
    setAmountModalVisible(true);
  };

  const handleNextAfterAmount = () => {
    setAmountModalVisible(false);
    setConfirmModalVisible(true);
  };
  const copyToClipboard = (address) => {
    Clipboard.setString(address);
    alert(t("Address copied to clipboard!"));
  };

  const handleAddressChange = (text) => {
    setInputAddress(text);
    const network = detectNetwork(text);
    setDetectedNetwork(network);
    setIsAddressValid(network !== "Invalid address"); // Update address validity
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={TransactionsScreenStyle.bgContainer}
    >
      <View className="w-[100%]" style={TransactionsScreenStyle.container}>
        <View
          style={{
            width: "100%", // 使用100%的宽度来确保自适应
            height: 130,
            flexDirection: "row",
            justifyContent: "space-between", // 确保按钮均匀分布
            gap: 10, // 设置按钮之间的间距
          }}
        >
          {/* Send 按钮 */}
          <TouchableOpacity
            style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 每个按钮占据均等的宽度
            onPress={handleSendPress}
          >
            <Feather name="send" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Send")}
            </Text>
          </TouchableOpacity>

          {/* Receive 按钮 */}
          <TouchableOpacity
            style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 均等宽度
            onPress={handleReceivePress}
          >
            <Icon name="vertical-align-bottom" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Receive")}
            </Text>
          </TouchableOpacity>

          {/* Swap 按钮 */}
          {/*           <TouchableOpacity
            style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 均等宽度
            onPress={handleSwapPress}
          >
            <Icon name="swap-horiz" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Swap")}
            </Text>
          </TouchableOpacity> */}
        </View>

        <View style={TransactionsScreenStyle.historyContainer}>
          <Text style={TransactionsScreenStyle.historyTitle}>
            {t("Transaction History")}
          </Text>
          <ScrollView
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          >
            {transactionHistory.length === 0 ? (
              <Text style={TransactionsScreenStyle.noHistoryText}>
                {t("No Histories")}
              </Text>
            ) : (
              transactionHistory.map((transaction, index) => (
                <View key={index} style={TransactionsScreenStyle.historyItem}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={[
                        TransactionsScreenStyle.historyItemText,
                        { fontSize: 18, fontWeight: "bold" },
                      ]}
                    >
                      {transaction.transactionType === "Send"
                        ? t("Send")
                        : t("Receive")}
                    </Text>

                    <Text
                      style={[
                        TransactionsScreenStyle.historyItemText,
                        { fontSize: 18, fontWeight: "bold" },
                      ]}
                    >
                      {transaction.amount} {`${transaction.transactionSymbol}`}
                    </Text>
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text style={TransactionsScreenStyle.historyItemText}>
                      <Text style={{ fontWeight: "bold" }}>{`State: `}</Text>
                      <Text
                        style={{
                          color:
                            transaction.state === "success"
                              ? "#47B480"
                              : "inherit",
                        }}
                      >
                        {transaction.state}
                      </Text>
                    </Text>
                  </View>

                  <Text style={TransactionsScreenStyle.historyItemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`Transaction Time: `}</Text>
                    {`${new Date(
                      transaction.transactionTime * 1000
                    ).toLocaleString()}`}
                  </Text>

                  <Text
                    style={[
                      TransactionsScreenStyle.historyItemText,
                      { lineHeight: 24 },
                    ]}
                  >
                    <Text style={{ fontWeight: "bold" }}>{`From: `}</Text>
                    {transaction.from}
                  </Text>
                  <Text
                    style={[
                      TransactionsScreenStyle.historyItemText,
                      { lineHeight: 24 },
                    ]}
                  >
                    <Text style={{ fontWeight: "bold" }}>{`To: `}</Text>
                    {transaction.to}
                  </Text>

                  <Text
                    style={[
                      TransactionsScreenStyle.historyItemText,
                      { lineHeight: 24 },
                    ]}
                  >
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`Transaction hash: `}</Text>
                    {transaction.txid}
                  </Text>

                  <Text style={TransactionsScreenStyle.historyItemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`Network Fee: `}</Text>
                    {transaction.txFee}
                  </Text>

                  <Text style={TransactionsScreenStyle.historyItemText}>
                    <Text
                      style={{ fontWeight: "bold" }}
                    >{`Block Height: `}</Text>
                    {transaction.height}
                  </Text>
                </View>
              ))
            )}
          </ScrollView>
        </View>

        {/* 输入地址的 Modal */}
        <InputAddressModal
          visible={inputAddressModalVisible}
          onRequestClose={() => setInputAddressModalVisible(false)}
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
          isDarkMode={isDarkMode}
          handleAddressChange={handleAddressChange}
          inputAddress={inputAddress}
          detectedNetwork={detectedNetwork}
          isAddressValid={isAddressValid}
          buttonBackgroundColor={buttonBackgroundColor}
          disabledButtonBackgroundColor={disabledButtonBackgroundColor}
          handleNextAfterAddress={handleNextAfterAddress}
          setInputAddressModalVisible={setInputAddressModalVisible}
          selectedCrypto={selectedCrypto}
          selectedCryptoChain={selectedCryptoChain}
          selectedCryptoIcon={selectedCryptoIcon}
        />

        {/* 输入金额的 Modal */}
        <AmountModal
          visible={amountModalVisible}
          onRequestClose={() => setAmountModalVisible(false)}
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
          isDarkMode={isDarkMode}
          amount={amount}
          setAmount={setAmount}
          balance={balance} // 使用 balance 而不是 selectedCryptoBalance
          fee={fee}
          valueUsd={valueUsd}
          isAmountValid={isAmountValid}
          buttonBackgroundColor={buttonBackgroundColor}
          disabledButtonBackgroundColor={disabledButtonBackgroundColor}
          handleNextAfterAmount={handleNextAfterAmount}
          selectedCrypto={selectedCrypto}
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCryptoChain={selectedCryptoChain}
          currencyUnit={currencyUnit}
        />

        {/* 交易确认的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.confirmModalView}>
              {/* 添加国际化标题 */}
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Transaction Confirmation")}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 6,
                  marginBottom: 16,
                }}
              >
                {selectedCryptoIcon && (
                  <Image
                    source={selectedCryptoIcon}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalTitle}>
                  {`${selectedCrypto} (${selectedCryptoChain})`}{" "}
                  {/* 添加链名称 */}
                </Text>
              </View>
              <ScrollView
                style={{ maxHeight: 320 }} // 设置最大高度，当内容超过时启用滚动
                contentContainerStyle={{ paddingHorizontal: 0 }}
              >
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>{t("Amount")}:</Text>
                  {"\n"}
                  {` ${amount} ${selectedCrypto}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Payment Address")}:
                  </Text>
                  {"\n"}
                  {` ${selectedAddress}`}
                </Text>

                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Recipient Address")}:
                  </Text>
                  {/*  {"\n"} */}
                  {` ${inputAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Detected Network")}:
                  </Text>
                  {"\n"}
                  {` ${detectedNetwork}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Transaction Fee")}:
                  </Text>
                  {"\n"}
                  {` ${transactionFee} ${selectedCrypto}`}
                </Text>
              </ScrollView>

              <View style={{ marginTop: 20, width: "100%" }}>
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={async () => {
                    try {
                      if (!chainShortName)
                        throw new Error("未选择链或未设置 chainShortName");

                      // 确保 verifiedDevices 非空并从中获取设备
                      if (verifiedDevices.length === 0)
                        throw new Error("未验证设备");

                      // 查找匹配的设备
                      const device = devices.find(
                        (d) => d.id === verifiedDevices[0]
                      );
                      if (!device) throw new Error("未找到匹配的设备");

                      // 获取 selectedCryptoObj
                      const selectedCryptoObj = initialAdditionalCryptos.find(
                        (crypto) => crypto.shortName === selectedCrypto
                      );

                      if (!selectedCryptoObj) {
                        throw new Error(`未找到加密货币：${selectedCrypto}`);
                      }

                      console.log(
                        "选择的加密货币:",
                        selectedCryptoObj.shortName
                      );

                      // 调用签名函数
                      await signTransaction(
                        device,
                        amount, // 传递金额
                        selectedCryptoObj.address, // 传递 selectedCryptoObj.address 作为 paymentAddress
                        inputAddress, // 传递收款地址
                        selectedCryptoObj.shortName // 传递 selectedCryptoObj.shortName 作为 selectedCrypto
                      );

                      setConfirmModalVisible(false);
                      setConfirmingTransactionModalVisible(true);
                    } catch (error) {
                      console.log("确认交易时出错:", error);
                    }
                  }}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Confirm")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* 选择接收的加密货币模态窗口 */}
        <SelectCryptoModal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          addedCryptos={addedCryptos}
          operationType={operationType}
          selectCrypto={selectCrypto}
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
          setModalVisible={setModalVisible}
          isDarkMode={isDarkMode}
        />

        {/* 显示选择的加密货币地址的模态窗口 */}
        <ReceiveAddressModal
          visible={addressModalVisible}
          onRequestClose={() => setAddressModalVisible(false)}
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCrypto={selectedCrypto}
          selectedAddress={selectedAddress}
          isVerifyingAddress={isVerifyingAddress}
          addressVerificationMessage={addressVerificationMessage}
          handleVerifyAddress={handleVerifyAddress}
          isDarkMode={isDarkMode}
          chainShortName={chainShortName}
        />

        {/* Bluetooth modal */}
        <BluetoothModal
          visible={bleVisible} // 控制模态框的显示状态
          devices={devices} // 设备列表
          isScanning={isScanning} // 扫描状态
          iconColor={iconColor} // 图标颜色
          onDevicePress={handleDevicePress} // 设备点击处理函数
          onCancel={() => {
            setBleVisible(false); // 关闭蓝牙模态框
            setSelectedDevice(null); // 重置选中的设备状态
          }}
          verifiedDevices={"0"} // 这里是避免这个页面有设备管理disconnect的功能
          MyColdWalletScreenStyle={TransactionsScreenStyle} // 样式
          t={t} // 国际化函数
          onDisconnectPress={handleDisconnectDevice} // 断开连接处理函数
        />

        {/* PIN码输入modal窗口 */}
        <PinModal
          visible={pinModalVisible} // 控制 PIN 模态框的可见性
          pinCode={pinCode} // 绑定 PIN 输入的状态
          setPinCode={setPinCode} // 设置 PIN 的状态函数
          onSubmit={handlePinSubmit} // PIN 提交后的逻辑
          onCancel={() => {
            setPinModalVisible(false); // 关闭 PIN 模态框
            setPinCode(""); // 清空 PIN 输入框
          }}
          styles={TransactionsScreenStyle}
          isDarkMode={isDarkMode}
          t={t}
          status={verificationStatus} // 传递状态
        />

        {/* 验证模态框 */}
        <VerificationModal
          visible={
            verificationSuccessModalVisible || verificationFailModalVisible
          }
          status={verificationSuccessModalVisible ? "success" : "fail"}
          onClose={() => {
            setVerificationSuccessModalVisible(false);
            setVerificationFailModalVisible(false);
          }}
          styles={TransactionsScreenStyle}
          t={t}
        />

        {/* Pending Transaction Modal */}
        <Modal
          visible={confirmingTransactionModalVisible}
          onRequestClose={() => setConfirmingTransactionModalVisible(false)}
          transparent={true}
          animationType="slide"
        >
          <View style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pendingModalView}>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {modalStatus.title}
              </Text>
              <Image
                source={modalStatus.image}
                style={{ width: 120, height: 120 }}
              />
              <Text
                style={[
                  TransactionsScreenStyle.modalSubtitle,
                  { marginBottom: 20 },
                ]}
              >
                {modalStatus.subtitle}
              </Text>
              <TouchableOpacity
                style={TransactionsScreenStyle.submitButton}
                onPress={() => setConfirmingTransactionModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Swap 模态框 */}
        <SwapModal
          isDarkMode={isDarkMode}
          visible={swapModalVisible}
          setSwapModalVisible={setSwapModalVisible}
          fromValue={fromValue}
          setFromValue={setFromValue}
          toValue={toValue}
          setToValue={setToValue}
          selectedFromToken={selectedFromToken}
          setSelectedFromToken={setSelectedFromToken}
          selectedToToken={selectedToToken}
          setSelectedToToken={setSelectedToToken}
          fromDropdownVisible={fromDropdownVisible}
          setFromDropdownVisible={setFromDropdownVisible}
          toDropdownVisible={toDropdownVisible}
          setToDropdownVisible={setToDropdownVisible}
          initialAdditionalCryptos={initialAdditionalCryptos}
          TransactionsScreenStyle={TransactionsScreenStyle}
        />
      </View>
    </LinearGradient>
  );
}

export default TransactionsScreen;
