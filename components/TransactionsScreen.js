// TransactionsScreen.js
import React, { useContext, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Clipboard,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { ethers } from "ethers";
import { BleManager } from "react-native-ble-plx";
import "react-native-get-random-values";
import "@ethersproject/shims";

// 配置与工具
import { prefixToShortName } from "../config/chainPrefixes";
import cryptoPathMapping from "../config/cryptoPathMapping";
import coinCommandMapping from "../config/coinCommandMapping";
import { detectNetwork } from "../config/networkUtils";
import checkAndReqPermission from "../utils/BluetoothPermissions";
import {
  btcChainMapping,
  evmChainMapping,
  tronChainMapping,
  aptosChainMapping,
  cosmosChainMapping,
  solChainMapping,
  suiChainMapping,
  xrpChainMapping,
} from "../config/chainMapping";

// 上下文和样式
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import TransactionsScreenStyles from "../styles/TransactionsScreenStyle";

// Modal 组件
import TransactionConfirmationModal from "./modal/TransactionConfirmationModal";
import InputAddressModal from "./modal/InputAddressModal";
import PendingTransactionModal from "./modal/PendingTransactionModal";
import VerificationModal from "./modal/VerificationModal";
import BluetoothModal from "./modal/BluetoothModal";
import AmountModal from "./modal/AmountModal";
import SelectCryptoModal from "./modal/SelectCryptoModal";
import SwapModal from "./modal/SwapModal";
import ReceiveAddressModal from "./modal/ReceiveAddressModal";
import PinModal from "./modal/PinModal";

// BLE 常量
const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function TransactionsScreen() {
  // ---------- 状态和上下文 ----------
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const {
    updateCryptoAddress,
    initialAdditionalCryptos,
    exchangeRates,
    currencyUnit,
    addedCryptos,
    setAddedCryptos,
    isVerificationSuccessful,
    setIsVerificationSuccessful,
    verifiedDevices,
    setVerifiedDevices,
    cryptoCards,
    setCryptoCards,
    transactionHistory,
    setTransactionHistory,
  } = useContext(CryptoContext);

  const TransactionsScreenStyle = TransactionsScreenStyles(isDarkMode);
  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc";

  // 交易/设备/界面状态
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [
    confirmingTransactionModalVisible,
    setConfirmingTransactionModalVisible,
  ] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [selectedCryptoChain, setSelectedCryptoChain] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [valueUsd, setValueUsd] = useState("");
  const [selectedCryptoName, setSelectedCryptoName] = useState("");
  const [queryChainShortName, setQueryChainShortName] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const [amount, setAmount] = useState("");
  const [inputAddress, setInputAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [chainShortName, setChainShortName] = useState("");
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [hasFetchedBalance, setHasFetchedBalance] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [bleVisible, setBleVisible] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [inputAddressModalVisible, setInputAddressModalVisible] =
    useState(false);
  const [detectedNetwork, setDetectedNetwork] = useState("");
  const [fee, setFee] = useState("");
  const [rapidFee, setRapidFee] = useState("");
  const [fromDropdownVisible, setFromDropdownVisible] = useState(false);
  const [toDropdownVisible, setToDropdownVisible] = useState(false);
  const [selectedFromToken, setSelectedFromToken] = useState("");
  const [selectedFromChain, setSelectedFromChain] = useState("");
  const [selectedToToken, setSelectedToToken] = useState("");
  const [selectedToChain, setSelectedToChain] = useState("");
  const [paymentAddress, setPaymentAddress] = useState("Your Payment Address");
  const [addressVerificationMessage, setAddressVerificationMessage] = useState(
    t("Verifying Address on LIKKIM...")
  );
  const [selectedFeeTab, setSelectedFeeTab] = useState("Recommended");
  const [modalStatus, setModalStatus] = useState({
    title: t("Confirming Transaction on LIKKIM Device..."),
    subtitle: t("Please confirm the transaction on your LIKKIM device."),
    image: require("../assets/gif/Pending.gif"),
  });

  // 费用计算
  const recommendedFee = (parseFloat(fee) / 1e9).toFixed(9);
  const recommendedValue = (
    (parseFloat(fee) / 1e9) *
    priceUsd *
    exchangeRates[currencyUnit]
  ).toFixed(2);
  const rapidFeeValue = (parseFloat(rapidFee) / 1e9).toFixed(9);
  const rapidCurrencyValue = (
    (parseFloat(rapidFee) / 1e9) *
    priceUsd *
    exchangeRates[currencyUnit]
  ).toFixed(2);
  const isAmountValid =
    amount &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= parseFloat(balance) + parseFloat(fee);

  // ---------- 扫描设备 ----------
  const bleManagerRef = useRef(null);

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

  // 在 TransactionsScreen 组件的 useEffect 或合适位置添加代码来获取手续费
  const fetchTransactionFee = async () => {
    try {
      const postData = {
        chain: selectedCryptoChain, // 使用 selectedCryptoChain 或其他相应字段
      };

      // 打印发送的 POST 数据
      console.log("Sending POST data:", postData);

      const response = await fetch(
        "https://bt.likkim.com/api/chain/blockchain-fee",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        }
      );

      const data = await response.json();

      // 打印返回的数据
      console.log("Received response data:", data);

      if (data && data.data) {
        // 检查 data.data 是否存在
        const { rapidGasPrice, recommendedGasPrice } = data.data; // 从 data.data 获取值

        setFee(recommendedGasPrice); // 设置 fee
        console.log("Fee set to:", recommendedGasPrice); // 调试用日志

        setRapidFee(rapidGasPrice); // 设置 rapidFee
        console.log("Rapid fee set to:", rapidGasPrice); // 调试用日志
      }
    } catch (error) {
      console.error("Failed to fetch transaction fee:", error);
    }
  };

  useEffect(() => {
    if (amountModalVisible) {
      fetchTransactionFee();
    }
  }, [amountModalVisible]);

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
        console.log(
          " 监听 initialAdditionalCryptos 的变化未找到匹配的加密货币对象"
        );
      }
    }
  }, [initialAdditionalCryptos, amountModalVisible]);

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

          // 构造广播交易的数据
          const postData = {
            chain: chain.trim(), // 去掉可能的空格
            hex: hex.trim(), // 在签名前加上 0x，并去掉空格
          };

          // 打印对象
          console.log("准备发送的 POST 数据:", postData);
          // 输出: 准备发送的 POST 数据: { chain: "ethereum", hex: "F86C..." }

          // 调用广播交易的 API
          try {
            const response = await fetch(
              "https://bt.likkim.com/api/wallet/broadcastHex",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
              }
            );

            const responseData = await response.json();

            // 根据返回的 code 字段判断广播是否成功
            if (response.ok && responseData.code === "0") {
              console.log("交易广播成功:", responseData);
              setModalStatus({
                title: t("Transaction Successful"),
                subtitle: t(
                  "Your transaction was successfully broadcasted on the LIKKIM device."
                ),
                image: require("../assets/gif/Success.gif"),
              });
            } else {
              console.log("交易广播失败:", responseData);
              setModalStatus({
                title: t("Transaction Failed"),
                subtitle: t(
                  "The transaction broadcast failed. Please check your device and try again."
                ),
                image: require("../assets/gif/Fail.gif"),
              });
            }
          } catch (broadcastError) {
            console.log("交易广播时出错:", broadcastError.message);
            setModalStatus({
              title: t("Transaction Error"),
              subtitle: t(
                "An error occurred while broadcasting the transaction."
              ),
              image: require("../assets/gif/Fail.gif"),
            });
          }
        } else {
          console.log("签名结果收到未知数据:", receivedData);
        }
      }
    );

    // console.log("已启动对 signed_data 的监听");
  };

  // 签名函数
  const signTransaction = async (
    device,
    amount,
    paymentAddress,
    inputAddress,
    selectedCrypto
  ) => {
    try {
      if (!device?.isConnected) {
        console.log("设备无效");
        return;
      }

      // 连接设备并发现服务
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();

      // ---------------------------
      // 第1步：确定币种对应的链标识和支付路径 （使用以太坊的签名方法）
      // ---------------------------

      const selectedCryptoUpper = selectedCrypto.toUpperCase();
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

      const path = cryptoPathMapping[chainKey];
      if (!path) {
        console.log(`不支持的路径: ${chainKey}`);
        return;
      }
      console.log("选择的路径:", path);

      // ---------------------------
      // 第2步：构造并发送第一步交易信息给设备
      // ---------------------------
      const senderAddress = paymentAddress;
      const destinationAddress = inputAddress;
      // 交易费用依赖外部变量：selectedFeeTab、recommendedFee、rapidFeeValue
      const transactionFee =
        selectedFeeTab === "Recommended" ? recommendedFee : rapidFeeValue;
      const firstTradeMsg = `destinationAddress:${senderAddress},${destinationAddress},${transactionFee},${chainKey}`;
      console.log("第一步交易信息发送:", firstTradeMsg);
      const firstTradeBuffer = Buffer.from(firstTradeMsg, "utf-8");
      const firstTradeBase64 = firstTradeBuffer.toString("base64");

      try {
        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          firstTradeBase64
        );
        console.log("第一步交易信息已成功发送给设备");
      } catch (error) {
        console.log("发送第一步交易信息给设备时发生错误:", error);
      }

      // ---------------------------
      // 第3步：持续监听嵌入式设备的 "Signed_OK" 命令
      // ---------------------------
      console.log("等待设备发送 Signed_OK 命令...");
      const signedOkPromise = new Promise((resolve) => {
        let isResolved = false;
        const subscription = device.monitorCharacteristicForService(
          serviceUUID,
          notifyCharacteristicUUID,
          (error, characteristic) => {
            if (error) {
              console.log("监听 Signed_OK 时出错:", error.message);
              return;
            }
            // 对接收到的字符串进行 trim 处理
            const received = Buffer.from(characteristic.value, "base64")
              .toString("utf8")
              .trim();
            console.log("收到设备响应:", received);
            if (received === "Signed_OK" && !isResolved) {
              isResolved = true;
              subscription.remove(); // 移除监听
              // 更新 modalStatus 状态，表示设备已确认签名
              setModalStatus({
                title: t("Device Confirmed"),
                subtitle: t(
                  "The device has confirmed the transaction signature."
                ),
                image: require("../assets/gif/Pending.gif"),
              });
              resolve(); // resolve 这个 Promise
            }
          }
        );
      });
      await signedOkPromise;
      console.log("设备确认回复: Signed_OK");

      // ---------------------------
      // 第4步：获取 nonce 和 gasPrice 等参数，真正开启签名流程
      // ---------------------------
      const walletParamsResponse = await fetch(
        "https://bt.likkim.com/api/wallet/getSignParam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chain: selectedCrypto,
            address: paymentAddress,
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
      console.log("获取到的 gasPrice:", gasPrice, "nonce:", nonce);

      // ---------------------------
      // 第5步：构造 POST 请求数据并调用签名编码接口
      // ---------------------------
      const getChainMappingMethod = (chainKey) => {
        if (evmChainMapping[chainKey]) {
          return "evm";
        } else if (btcChainMapping[chainKey]) {
          return "btc";
        } else if (tronChainMapping[chainKey]) {
          return "tron";
        } else if (aptosChainMapping[chainKey]) {
          return "aptos";
        } else if (cosmosChainMapping[chainKey]) {
          return "cosmos";
        } else if (solChainMapping[chainKey]) {
          return "solana";
        } else if (suiChainMapping[chainKey]) {
          return "sui";
        } else if (xrpChainMapping[chainKey]) {
          return "xrp";
        }
        return null; // 默认返回 null
      };

      const chainMethod = getChainMappingMethod(chainKey);
      let requestData = null;

      if (chainMethod === "evm") {
        requestData = {
          chainKey,
          nonce,
          gasLimit: 53000,
          gasPrice,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
          contractValue: 0,
        };
      } else if (chainMethod === "btc") {
        requestData = {
          chainKey,
          nonce,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "tron") {
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "aptos") {
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "cosmos") {
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "solana") {
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "sui") {
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "xrp") {
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      }

      console.log("构造的请求数据:", JSON.stringify(requestData, null, 2));

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
      console.log("交易请求返回的数据:", responseData);

      monitorSignedResult(device);

      // ---------------------------
      // 第6步：构造并发送 sign 消息
      // ---------------------------
      if (responseData?.data?.data) {
        const signMessage = `sign:${chainKey},${path},${responseData.data.data}`;
        console.log("构造的 sign 消息:", signMessage);
        const signBuffer = Buffer.from(signMessage, "utf-8");
        const signBase64 = signBuffer.toString("base64");
        try {
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            signBase64
          );
          console.log("sign消息已成功发送给设备");
        } catch (error) {
          console.log("发送sign消息时发生错误:", error);
        }
      } else {
        console.log("返回的数据不包含sign消息的data_从服务器获得");
      }

      return responseData;
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
      const commandString = coinCommandMapping[coinType];
      // 【新增】检查 commandString 是否存在
      if (!commandString) {
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

      // 监听设备的响应 - bugging
      const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";
      const addressMonitorSubscription = device.monitorCharacteristicForService(
        serviceUUID,
        notifyCharacteristicUUID,
        (error, characteristic) => {
          if (error) {
            console.log("监听设备响应时出错:", error);
            return;
          }
          // 【新增】检查 characteristic 是否有效
          if (!characteristic || !characteristic.value) {
            console.log("未收到有效数据");
            return;
          }
          const receivedDataHex = Buffer.from(characteristic.value, "base64")
            .toString("hex")
            .toUpperCase();
          console.log("接收到的十六进制数据字符串:", receivedDataHex);

          // 检查接收到的数据是否为预期的响应
          if (receivedDataString === "Address_OK") {
            console.log("在 LIKKIM 上成功显示地址");
            setAddressVerificationMessage(t("addressShown")); // 假设 'addressShown' 是国际化文件中的 key
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
    console.log("传入的链短名称是:", chainShortName);

    if (verifiedDevices.length > 0) {
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        showLIKKIMAddressCommand(device, chainShortName);
      } else {
        setAddressModalVisible(false);
        setBleVisible(true);
      }
    } else {
      setAddressModalVisible(false);
      setBleVisible(true);
    }
  };

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
          balance={balance}
          fee={fee}
          rapidFee={rapidFee}
          setFee={setFee}
          isAmountValid={isAmountValid}
          buttonBackgroundColor={buttonBackgroundColor}
          disabledButtonBackgroundColor={disabledButtonBackgroundColor}
          handleNextAfterAmount={handleNextAfterAmount}
          selectedCrypto={selectedCrypto}
          selectedCryptoChain={selectedCryptoChain}
          selectedCryptoIcon={selectedCryptoIcon}
          currencyUnit={currencyUnit}
          exchangeRates={exchangeRates}
          cryptoCards={cryptoCards}
          selectedCryptoName={selectedCryptoName}
          valueUsd={valueUsd}
          setCryptoCards={setCryptoCards}
        />

        {/* 交易确认的 Modal */}
        <TransactionConfirmationModal
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
          onConfirm={async () => {
            try {
              if (!chainShortName)
                throw new Error("未选择链或未设置 chainShortName");
              if (verifiedDevices.length === 0) throw new Error("未验证设备");

              const device = devices.find((d) => d.id === verifiedDevices[0]);
              if (!device) throw new Error("未找到匹配的设备");

              const selectedCryptoObj = initialAdditionalCryptos.find(
                (crypto) => crypto.shortName === selectedCrypto
              );
              if (!selectedCryptoObj) {
                throw new Error(`未找到加密货币：${selectedCrypto}`);
              }

              setConfirmModalVisible(false);
              setConfirmingTransactionModalVisible(true);
              await signTransaction(
                device,
                amount,
                selectedCryptoObj.address,
                inputAddress,
                selectedCryptoObj.shortName
              );
            } catch (error) {
              console.log("确认交易时出错:", error);
            }
          }}
          onCancel={() => setConfirmModalVisible(false)}
          t={t}
          TransactionsScreenStyle={TransactionsScreenStyle}
          isDarkMode={isDarkMode}
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCrypto={selectedCrypto}
          selectedCryptoChain={selectedCryptoChain}
          amount={amount}
          priceUsd={priceUsd}
          exchangeRates={exchangeRates}
          currencyUnit={currencyUnit}
          recommendedFee={recommendedFee}
          recommendedValue={recommendedValue}
          rapidFeeValue={rapidFeeValue}
          rapidCurrencyValue={rapidCurrencyValue}
          selectedFeeTab={selectedFeeTab}
          setSelectedFeeTab={setSelectedFeeTab}
          detectedNetwork={detectedNetwork}
          selectedAddress={selectedAddress}
          inputAddress={inputAddress}
        />

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
        <PendingTransactionModal
          visible={confirmingTransactionModalVisible}
          onClose={() => setConfirmingTransactionModalVisible(false)}
          modalStatus={modalStatus}
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
        />

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
