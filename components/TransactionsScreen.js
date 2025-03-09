// TransactionsScreen.js
import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Clipboard, Platform } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { ethers } from "ethers";
import { BleManager } from "react-native-ble-plx";
import "react-native-get-random-values";
import "@ethersproject/shims";

// 配置与工具
import { prefixToShortName } from "../config/chainPrefixes";
import cryptoPathMapping from "../config/cryptoPathMapping";
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
  chainGroups,
} from "../config/chainMapping";

// 上下文和样式
import { CryptoContext, DarkModeContext } from "../utils/CryptoContext";
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
import TransactionHistory from "./transactionScreens/TransactionHistory";
import ActionButtons from "./transactionScreens/ActionButtons";

// 自定义组件
import showLIKKIMAddressCommand from "../utils/showLIKKIMAddressCommand";
import { decrypt } from "../utils/decrypt";
import { handleDevicePress } from "../utils/handleDevicePress";
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
    updateCryptoPublicKey,
  } = useContext(CryptoContext);
  const [isLoading, setIsLoading] = useState(true);
  const TransactionsScreenStyle = TransactionsScreenStyles(isDarkMode);
  const iconColor = isDarkMode ? "#CCB68C" : "#CFAB95";
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
  const restoreIdentifier = Constants.installationId;
  const [selectedAddress, setSelectedAddress] = useState("");
  const [balance, setBalance] = useState("");
  const [valueUsd, setValueUsd] = useState("");
  const [selectedCryptoChain, setSelectedCryptoChain] = useState("");
  const [selectedCryptoName, setSelectedCryptoName] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const [selectedQueryChainName, setQueryChainName] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [amount, setAmount] = useState("");
  const [inputAddress, setInputAddress] = useState("");
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
  const [contractAddress, setContractAddress] = useState("");
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
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllTransactionHistory(); // 调用获取交易历史的函数
    setRefreshing(false);
  };

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
      setIsLoading(true);
      try {
        const historyJson = await AsyncStorage.getItem("transactionHistory");
        if (historyJson !== null) {
          const history = JSON.parse(historyJson);
          setTransactionHistory(history);
        }
      } catch (error) {
        console.error(
          "Failed to load transaction history from storage:",
          error
        );
      }
      setIsLoading(false);
    };

    loadTransactionHistory();
  }, []);
  const onDevicePressHandler = async (device) => {
    await handleDevicePress(device, {
      setReceivedAddresses,
      setVerificationStatus,
      setSelectedDevice,
      setModalVisible,
      setBleVisible,
      setPinModalVisible,
      monitorVerificationCode,
    });
  };
  // 新增：获取所有卡片的交易历史记录（包含去重与分页处理）
  const fetchAllTransactionHistory = async () => {
    if (initialAdditionalCryptos && initialAdditionalCryptos.length > 0) {
      // 去重：确保每个 { queryChainName, address } 组合只处理一次
      const uniqueCryptos = initialAdditionalCryptos.filter(
        (crypto, index, self) =>
          index ===
          self.findIndex(
            (c) =>
              c.queryChainName === crypto.queryChainName &&
              c.address === crypto.address
          )
      );

      // 对每个唯一卡片发起交易历史查询
      const requests = uniqueCryptos.map(async (crypto) => {
        let pageNumber = 1;
        let allTransactions = [];
        let continueFetching = true;
        while (continueFetching) {
          const postData = {
            chain: crypto.queryChainName, // 使用卡片中的 queryChainName
            address: crypto.address, // 使用卡片中的 address
            page: pageNumber,
            pageSize: 10,
          };

          // 打印发出的值
          /*           console.log(
            `发送请求 for ${crypto.queryChainName} ${crypto.address}, page ${pageNumber}:`,
            postData
          );
 */
          try {
            const response = await fetch(
              "https://bt.likkim.com/api/wallet/queryTransaction",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
              }
            );
            const data = await response.json();

            // 打印返回的值
            /*          console.log(
              `返回数据 for ${crypto.queryChainName} ${crypto.address}, page ${pageNumber}:`,
              data
            ); */

            if (
              data &&
              data.code === "0" &&
              data.data &&
              data.data.length > 0
            ) {
              // 只保留你关心的字段
              const processedTransactions = data.data.map((tx) => ({
                state: tx.state,
                amount: tx.amount,
                address: tx.address,
                fromAddress: tx.fromAddress,
                toAddress: tx.toAddress,
                symbol: tx.symbol,
                transactionTime: tx.transactionTime,
              }));
              // 打印当前卡片处理后的返回结果
              /*               console.log(
                `处理后的返回结果 for ${crypto.queryChainName} ${crypto.address}:`,
                processedTransactions
              ); */
              allTransactions = allTransactions.concat(processedTransactions);
              pageNumber++;
            } else {
              continueFetching = false;
            }
          } catch (error) {
            /*          console.log(
              "查询交易历史失败, chain:",
              crypto.queryChainName,
              "address:",
              crypto.address,
              error
            ); */
            continueFetching = false;
          }
        }
        return allTransactions;
      });

      // 等待所有请求完成，并合并所有交易记录
      const results = await Promise.all(requests);
      const mergedTransactions = results.reduce(
        (acc, transactions) => acc.concat(transactions),
        []
      );
      //  console.log("所有卡片的交易历史结果:", mergedTransactions);
      setTransactionHistory(mergedTransactions);
    }
  };

  // 使用 useEffect 在组件挂载或 initialAdditionalCryptos 变化时加载交易历史
  useEffect(() => {
    fetchAllTransactionHistory();
  }, [initialAdditionalCryptos]);

  // 在 TransactionsScreen 组件的 useEffect 或合适位置添加代码来获取手续费
  const fetchTransactionFee = async () => {
    try {
      const postData = {
        chain: selectedCryptoChain,
      };

      // 打印发送的 POST 数据
      console.log("🚀 Sending POST data:", JSON.stringify(postData, null, 2));

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

      if (!response.ok) {
        console.error("❌ HTTP Error:", response.status, response.statusText);
        return;
      }

      const data = await response.json();

      console.log("✅ Received response data:", JSON.stringify(data, null, 2));

      if (data && data.data) {
        const { rapidGasPrice, recommendedGasPrice } = data.data;

        setFee(recommendedGasPrice);
        console.log("✅ Fee set to:", recommendedGasPrice);

        setRapidFee(rapidGasPrice);
        console.log("✅ Rapid fee set to:", rapidGasPrice);
      }
    } catch (error) {
      console.log("❌ Failed to fetch transaction fee:", error);
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

  const monitorVerificationCode = (device, sendDecryptedValue) => {
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
            updateCryptoPublicKey(queryChainName, publicKey);
          }
        }

        // Process data containing "ID:"
        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);
          decrypt(encryptedData, key);
          const decryptedHex = uint32ArrayToHexString(encryptedData);
          console.log("Decrypted string:", decryptedHex);
          if (sendDecryptedValue) {
            sendDecryptedValue(decryptedHex);
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

  let transactionMonitorSubscription;
  // 停止监听交易反馈
  const stopMonitoringTransactionResponse = () => {
    if (transactionMonitorSubscription) {
      transactionMonitorSubscription.remove();
      transactionMonitorSubscription = null;
      console.log("交易反馈监听已停止");
    }
  };

  // 签名函数
  const signTransaction = async (
    device,
    amount,
    paymentAddress,
    inputAddress,
    selectedCrypto,
    selectedQueryChainName,
    contractAddress
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
      let postChain = selectedQueryChainName;
      for (const [defaultChain, chains] of Object.entries(chainGroups)) {
        if (chains.includes(selectedQueryChainName)) {
          postChain = defaultChain;
          break;
        }
      }

      const walletParamsResponse = await fetch(
        "https://bt.likkim.com/api/wallet/getSignParam",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chain: postChain,
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
      // ---------------------------
      // 处理返回的结果
      // ---------------------------
      const walletParamsData = await walletParamsResponse.json();
      console.log("getSignParam 返回的数据:", walletParamsData);

      if (
        !walletParamsData.data?.gasPrice ||
        walletParamsData.data?.nonce == null
      ) {
        console.log("接口返回数据不完整:", walletParamsData);
        return;
      }

      if (postChain === "ethereum") {
        const { gasPrice, nonce } = walletParamsData.data;
        console.log("Ethereum 返回的数据:", { gasPrice, nonce });
      } else if (postChain === "bitcoin") {
        const { gasPrice, nonce, utxoList } = walletParamsData.data;

        console.log("bitcoin 返回的数据:", {
          gasPrice,
          nonce,
          utxoList,
        });
      } else if (postChain === "aptos") {
        const { gasPrice, nonce, sequence, maxGasAmount, typeArg } =
          walletParamsData.data;
        console.log("Aptos 返回的数据:", {
          gasPrice,
          nonce,
          sequence,
          maxGasAmount,
          typeArg,
        });
      } else if (postChain === "cosmos") {
        const {
          gasPrice,
          nonce,
          heigh,
          sequence,
          maxGasAmount,
          accountNumber,
          feeAmount,
        } = walletParamsData.data;
        const effectiveFeeAmount = feeAmount ? feeAmount : 3000;
        console.log("cosmos 返回的数据:", {
          gasPrice,
          nonce,
          sequence,
          maxGasAmount,
          accountNumber,
          feeAmount: effectiveFeeAmount,
        });
      }
      if (postChain === "solana") {
        const { gasPrice, nonce, blockHash } = walletParamsData.data;
        console.log("solana 返回的数据:", { gasPrice, nonce, blockHash });
      } else if (postChain === "sui") {
        const { gasPrice, nonce, maxGasAmount, suiObjects, epoch } =
          walletParamsData.data;

        console.log("提取的 sui 数据:", {
          gasPrice,
          nonce,
          maxGasAmount,
          suiObjects,
          epoch,
        });
      } else if (postChain === "ripple") {
        const { gasPrice, nonce } = walletParamsData.data;
        console.log("ripple 返回的数据:", { gasPrice, nonce });
      } else {
        const { gasPrice, nonce, sequence } = walletParamsData.data;
        console.log("其他链返回的数据:", { gasPrice, nonce, sequence });
      }

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
          return "ripple";
        }
        return null; // 默认返回 null
      };

      const chainMethod = getChainMappingMethod(chainKey);
      let requestData = null;

      if (chainMethod === "evm") {
        // evm:  构造待签名hex请求数据（例如 Ethereum）
        requestData = {
          chainKey: chainKey,
          nonce: nonce,
          gasLimit: 53000,
          gasPrice: gasPrice,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
          contractValue: 0,
        };
      } else if (chainMethod === "btc") {
        // btc:  构造待签名hex请求数据（比特币）
        requestData = {
          chainKey: "bitcoin",
          inputs: utxoList,
          feeRate: gasPrice,
          receiveAddress: inputAddress,
          receiveAmount: Number(amount),
          changeAddress: paymentAddress,
        };
      } else if (chainMethod === "tron") {
        // tron:  构造待签名hex请求数据（波场）
        requestData = {
          chainKey,
          value: Number(amount),
          to: inputAddress,
          contractAddress: "",
        };
      } else if (chainMethod === "aptos") {
        // aptos:  构造待签名hex请求数据（Aptos 链）
        requestData = {
          from: paymentAddress,
          sequenceNumber: sequence,
          maxGasAmount: maxGasAmount,
          gasUnitPrice: gasPrice,
          receiveAddress: inputAddress,
          receiveAmount: Number(amount),
          typeArg: typeArg,
          expiration: 600,
        };
      } else if (chainMethod === "cosmos") {
        // cosmos:  构造待签名hex请求数据（Cosmos 链）
        requestData = {
          from: paymentAddress,
          to: inputAddress,
          amount: Number(amount),
          sequence: sequence,
          chainKey: "cosmos",
          accountNumber: accountNumber,
          feeAmount: effectiveFeeAmount,
          gasLimit: maxGasAmount,
          memo: "", //这个是备注
          timeoutHeight: heigh,
          publicKey:
            "xpub6FmpQ9cxRXYYUNic6AtESRfMq2dfBm4hcAMgrLxm95NbmfC6ZFXmvRarzmfASdpwXjqR9BxsMLEWxNhVXjkxbQDkxMhpj4256ySt3wEuxdQ",
        };
      } else if (chainMethod === "solana") {
        // solana:  构造待签名hex请求数据（Solana 链）
        requestData = {
          from: paymentAddress,
          to: inputAddress,
          hash: blockHash,
          mint: contractAddress,
          amount: Number(amount) * 1000000000,
        };
      } else if (chainMethod === "sui") {
        // sui:  构造待签名hex请求数据（Sui 链）
        requestData = {
          objects: suiObjects,
          from: paymentAddress,
          to: inputAddress,
          amount: Number(amount),
          gasPrice: gasPrice,
          gasBudget: maxGasAmount,
          epoch: epoch,
        };
      } else if (chainMethod === "ripple") {
        // ripple:  构造待签名hex请求数据（Ripple）
        requestData = {
          from: paymentAddress,
          to: inputAddress,
          amount: Number(amount),
          fee: gasPrice,
          sequence: sequence,
          publicKey:
            "xpub6Cev2GgWsGScABSqE3orVzNVbkNMm3AZ7PPopEjZjjZamQKN289XRFUzFau31vhpyMEdzJXywosaKXQHTqDjgjEPjK7Hxp5zGSvhQTDAwjW",
        };
      }

      console.log(
        " 构造待签名hex请求数据:",
        JSON.stringify(requestData, null, 2)
      );

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

  const handleSwapPress = () => {
    setSwapModalVisible(true);
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

  // 提交验证码
  const handlePinSubmit = async () => {
    setPinModalVisible(false);

    const pinCodeValue = pinCode.trim();
    const verificationCodeValue = receivedVerificationCode.trim();

    console.log(`User-entered PIN: ${pinCodeValue}`);
    console.log(`Received verification code: ${verificationCodeValue}`);

    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      console.log(
        "Received verification code format is incorrect:",
        verificationCodeValue
      );
      setVerificationFailModalVisible(true);
      return;
    }

    const [receivedPin, flag] = rest.split(",");
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log(
        "Received verification code format is incorrect:",
        verificationCodeValue
      );
      setVerificationFailModalVisible(true);
      return;
    }

    console.log(`Extracted PIN value: ${receivedPin}`);
    console.log(`Extracted flag: ${flag}`);

    if (pinCodeValue === receivedPin) {
      console.log("PIN verification succeeded");
      setVerificationSuccessModalVisible(true);

      setVerifiedDevices([selectedDevice.id]);

      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
      );

      setIsVerificationSuccessful(true);
      console.log("Device verified and stored successfully");

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
        try {
          const addressMessage = "address";
          const bufferAddress = Buffer.from(addressMessage, "utf-8");
          const base64Address = bufferAddress.toString("base64");

          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Address
          );
          console.log("String 'address' sent to device successfully");
        } catch (error) {
          console.log("Error sending string 'address':", error);
        }

        const pubkeyMessages = [
          "pubkey:cosmos,m/44'/118'/0'/0/0",
          "pubkey:ripple,m/44'/144'/0'/0/0",
          "pubkey:celestia,m/44'/118'/0'/0/0",
          "pubkey:juno,m/44'/118'/0'/0/0",
          "pubkey:osmosis,m/44'/118'/0'/0/0",
        ];

        for (const pubkeyMessage of pubkeyMessages) {
          try {
            const bufferMessage = Buffer.from(pubkeyMessage, "utf-8");
            const base64Message = bufferMessage.toString("base64");
            await selectedDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              base64Message
            );
            console.log(
              `String '${pubkeyMessage}' sent to device successfully`
            );
          } catch (error) {
            console.log(`Error sending string '${pubkeyMessage}':`, error);
          }
        }
      } else if (flag === "N") {
        console.log(
          "Device returned PIN:xxxx,N, no need to send 'address' and pubkey strings"
        );
      }
    } else {
      console.log("PIN verification failed");
      setVerificationFailModalVisible(true);

      if (monitorSubscription) {
        try {
          monitorSubscription.remove();
          console.log("Stopped monitoring verification code");
        } catch (error) {
          console.log("Error occurred while stopping monitoring:", error);
        }
      }

      if (selectedDevice) {
        try {
          await selectedDevice.cancelConnection();
          console.log("Disconnected from device");
        } catch (error) {
          console.log("Error occurred while disconnecting:", error);
        }
      }
    }

    setPinCode("");
  };

  const handleVerifyAddress = (chainShortName) => {
    console.log("传入的链短名称是:", chainShortName);

    if (verifiedDevices.length > 0) {
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        showLIKKIMAddressCommand(
          device,
          chainShortName,
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
    setBalance(crypto.balance);
    setValueUsd(crypto.valueUsd);
    setFee(crypto.fee);
    setPriceUsd(crypto.priceUsd);
    setQueryChainName(crypto.queryChainName);
    setChainShortName(crypto.chainShortName);
    setSelectedCryptoName(crypto.name);
    setIsVerifyingAddress(false);
    setModalVisible(false);
    setContractAddress(crypto.contractAddress);

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
        <ActionButtons
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
          iconColor={iconColor}
          handleSendPress={handleSendPress}
          handleReceivePress={handleReceivePress}
          handleSwapPress={handleSwapPress}
        />
        {/* 交易历史记录组件 */}
        <TransactionHistory
          TransactionsScreenStyle={TransactionsScreenStyle}
          t={t}
          transactionHistory={transactionHistory}
          isLoading={isLoading}
          cryptoCards={cryptoCards}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />

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
        {/* Bluetooth Modal */}
        <BluetoothModal
          visible={bleVisible}
          devices={devices}
          isScanning={isScanning}
          iconColor={iconColor}
          handleDevicePress={onDevicePressHandler}
          onCancel={() => {
            setBleVisible(false);
            setSelectedDevice(null);
          }}
          verifiedDevices={"0"}
          MyColdWalletScreenStyle={TransactionsScreenStyle}
          t={t}
          onDisconnectPress={handleDisconnectDevice}
        />

        {/* PIN Modal */}
        <PinModal
          visible={pinModalVisible}
          pinCode={pinCode}
          setPinCode={setPinCode}
          onSubmit={handlePinSubmit}
          onCancel={() => {
            setPinModalVisible(false);
            setPinCode("");
          }}
          styles={TransactionsScreenStyle}
          isDarkMode={isDarkMode}
          t={t}
          status={verificationStatus}
        />

        {/* Verification Modal */}
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

        {/* Swap Modal */}
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
