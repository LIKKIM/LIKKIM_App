// Activity.js
import React, { useContext, useState, useRef, useEffect } from "react";
import { View, Platform, AppState } from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { LinearGradient } from "expo-linear-gradient";
import { Buffer } from "buffer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useTranslation } from "react-i18next";
import { BleManager } from "react-native-ble-plx";
import { useIsFocused } from "@react-navigation/native";

// 配置与工具
import { prefixToShortName } from "../config/chainPrefixes";
import assetOps from "../config/assetOps";
import { detectNetwork } from "../config/networkUtils";
import checkAndReqPermission from "../utils/BluetoothPermissions";
import { chainGroups, families } from "../config/mappingRegistry";

// 上下文和样式
import { DeviceContext, DarkModeContext } from "../utils/DeviceContext";
import ActivityScreenStyles from "../styles/ActivityScreenStyle";

// Modal 组件
import TransactionConfirmationModal from "./modal/TransactionConfirmationModal";
import ContactFormModal from "./modal/ContactFormModal";
import ActivityProgressModal from "./modal/ActivityProgressModal";
import CheckStatusModal from "./modal/CheckStatusModal";
import BluetoothModal from "./modal/BluetoothModal";
import AmountModal from "./modal/AmountModal";
import SelectCryptoModal from "./modal/SelectCryptoModal";
import ConvertModal from "./modal/ConvertModal";
import ShowReceiveInfoModal from "./modal/ShowReceiveInfoModal";
import SecurityCodeModal from "./modal/SecurityCodeModal";
import ActivityLogComponent from "./ActivityScreen/ActivityLogComponent";
import ActionButtons from "./ActivityScreen/ActionButtons";
// 自定义组件
import displayDeviceAddress from "../utils/displayDeviceAddress";
import { parseDeviceCode } from "../utils/parseDeviceCode";
import { accountAPI, signAPI } from "../env/apiEndpoints";
import signTransaction from "./ActivityScreen/signTransaction";
import { bluetoothConfig } from "../env/bluetoothConfig";
import { createHandleDevicePress } from "../utils/handleDevicePress";
const FILE_NAME = "Activity.js";
// BLE 常量
const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

function ActivityScreen() {
  const [CheckStatusModalVisible, setCheckStatusModalVisible] = useState(false);
  // 工具函数、清理函数放这里
  function isValidAmount(amount) {
    if (amount === null || amount === undefined) return false;
    if (amount === "0" || amount === "" || amount === "null") return false;
    if (Number(amount) === 0 || isNaN(Number(amount))) return false;
    return true;
  }
  function isValidState(state) {
    if (state === 0 || state === "0" || state === null || state === undefined) {
      return false;
    }
    return true;
  }
  async function cleanActivityLog(logs) {
    const filtered = logs.filter(
      (item) => isValidAmount(item.amount) && isValidState(item.state)
    );
    await AsyncStorage.setItem("ActivityLog", JSON.stringify(filtered));
    setActivityLog(filtered);
  }

  // ---------- 状态和上下文 ----------
  const { t } = useTranslation();

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
    ActivityLog,
    setActivityLog,
    updateDevicePubHintKey,
  } = useContext(DeviceContext);
  const isFocused = useIsFocused(); // 🔹判断是否当前页面
  const appState = useRef(AppState.currentState); // 🔹保存当前 App 状态
  const [isLoading, setIsLoading] = useState(true);
  const { isDarkMode } = useContext(DarkModeContext);
  const ActivityScreenStyle = ActivityScreenStyles(isDarkMode);
  const iconColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc";

  // 交易/设备/界面状态
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [swapModalVisible, setConvertModalVisible] = useState(false);
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
  const [EstimatedValue, setEstimatedValue] = useState("");
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
  const [SecurityCodeModalVisible, setSecurityCodeModalVisible] =
    useState(false);
  const [pinCode, setPinCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [verificationSuccessModalVisible, setVerificationSuccessModalVisible] =
    useState(false);
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [ContactFormModalVisible, setContactFormModalVisible] = useState(false);
  const [detectedNetwork, setDetectedNetwork] = useState("");
  const [fee, setFee] = useState("");
  const [rapidFee, setRapidFee] = useState("");
  const [fromDropdownVisible, setFromDropdownVisible] = useState(false);
  const [toDropdownVisible, setToDropdownVisible] = useState(false);
  const [addressVerificationMessage, setAddressVerificationMessage] = useState(
    t("Verifying address on your device...")
  );
  const [pageData, setPageData] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [activityLogPages, setActivityLogPages] = useState({});
  const [selectedFromToken, setSelectedFromToken] = useState("");
  const [selectedToToken, setSelectedToToken] = useState("");
  const [selectedFeeTab, setSelectedFeeTab] = useState("Recommended");
  const [modalStatus, setModalStatus] = useState({
    title: t("Waiting for approval on your device...."),
    subtitle: t("Waiting for approval on your device..."),
    image: require("../assets/gif/Pending.gif"),
  });

  // 费用计算
  const feeValue = isNaN(parseFloat(fee)) ? 0 : parseFloat(fee);
  const rapidFeeVal = isNaN(parseFloat(rapidFee)) ? 0 : parseFloat(rapidFee);
  //  console.log("parseFloat(fee) 的值是:", feeValue);
  // console.log("parseFloat(rapidFee) 的值是:", rapidFeeVal);
  // 直接显示主币单位，不再除以1e9
  const recommendedFee = fee; // 已经是主币单位字符串
  const recommendedValue = (
    feeValue *
    priceUsd *
    exchangeRates[currencyUnit]
  ).toFixed(2);
  const rapidFeeValue = rapidFee; // 已经是主币单位字符串
  const rapidCurrencyValue = (
    rapidFeeVal *
    priceUsd *
    exchangeRates[currencyUnit]
  ).toFixed(2);
  const isAmountValid =
    amount &&
    parseFloat(amount) > 0 &&
    parseFloat(amount) <= parseFloat(balance) + feeValue;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllActivityLog(); // 调用获取交易历史的函数
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

        if (device.name && device.name.includes("LUKKEY")) {
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
      setSelectedFromToken("");
      setSelectedToToken("");
    }
  }, [swapModalVisible]);

  useEffect(() => {
    const loadActivityLog = async () => {
      setIsLoading(true);
      try {
        const historyJson = await AsyncStorage.getItem("ActivityLog");
        if (historyJson !== null) {
          const history = JSON.parse(historyJson);
          setActivityLog(history);
        }
      } catch (error) {
        console.error(
          "Failed to load transaction history from storage:",
          error
        );
      }
      setIsLoading(false);
    };

    loadActivityLog();
  }, []);

  // 新增：获取所有卡片的交易历史记录（包含去重与分页处理）
  const fetchAllActivityLog = async () => {
    if (initialAdditionalCryptos && initialAdditionalCryptos.length > 0) {
      const uniqueCryptos = initialAdditionalCryptos.filter(
        (crypto, index, self) =>
          crypto.address &&
          crypto.address.trim() !== "" &&
          index ===
            self.findIndex(
              (c) =>
                c.queryChainName === crypto.queryChainName &&
                c.address === crypto.address
            )
      );

      // 查第一页
      const requests = uniqueCryptos.map(async (crypto) => {
        const key = `${crypto.queryChainName}:${crypto.address}`;
        const postData = {
          chain: crypto.queryChainName,
          address: crypto.address,
          page: 1,
          pageSize: 10,
        };

        try {
          const response = await fetch(accountAPI.queryTransaction, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          });
          const data = await response.json();

          if (data && data.code === "0" && Array.isArray(data.data)) {
            const processedTransactions = data.data.map((tx) => ({
              ...tx, // 保留所有字段
              chainKey: key,
            }));
            // 标记当前页，是否还有下一页
            setActivityLogPages((prev) => ({
              ...prev,
              [key]: { page: 1, finished: data.data.length < 10 },
            }));
            return processedTransactions;
          } else {
            setActivityLogPages((prev) => ({
              ...prev,
              [key]: { page: 1, finished: true },
            }));
          }
        } catch (err) {
          setActivityLogPages((prev) => ({
            ...prev,
            [key]: { page: 1, finished: true },
          }));
        }
        return [];
      });

      const results = await Promise.all(requests);
      // 合并所有交易记录
      const merged = results.flat();
      setActivityLog(merged);
      cleanActivityLog(merged);
    }
  };
  const fetchNextActivityLogPage = async () => {
    if (!initialAdditionalCryptos || initialAdditionalCryptos.length === 0)
      return;

    let anyLoaded = false;
    const uniqueCryptos = initialAdditionalCryptos.filter(
      (crypto, index, self) =>
        crypto.address &&
        crypto.address.trim() !== "" &&
        index ===
          self.findIndex(
            (c) =>
              c.queryChainName === crypto.queryChainName &&
              c.address === crypto.address
          )
    );

    const requests = uniqueCryptos.map(async (crypto) => {
      const key = `${crypto.queryChainName}:${crypto.address}`;
      const pageState = activityLogPages[key] || { page: 1, finished: false };
      if (pageState.finished) return []; // 当前币已加载完

      const nextPage = (pageState.page || 1) + 1;
      const postData = {
        chain: crypto.queryChainName,
        address: crypto.address,
        page: nextPage,
        pageSize: 10,
      };

      try {
        const response = await fetch(accountAPI.queryTransaction, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        });
        const data = await response.json();

        if (
          data &&
          data.code === "0" &&
          Array.isArray(data.data) &&
          data.data.length > 0
        ) {
          anyLoaded = true;
          setActivityLogPages((prev) => ({
            ...prev,
            [key]: { page: nextPage, finished: data.data.length < 10 },
          }));
          return data.data.map((tx) => ({
            ...tx,
            chainKey: key,
          }));
        } else {
          setActivityLogPages((prev) => ({
            ...prev,
            [key]: { page: nextPage, finished: true },
          }));
        }
      } catch (err) {
        setActivityLogPages((prev) => ({
          ...prev,
          [key]: { page: nextPage, finished: true },
        }));
      }
      return [];
    });

    const results = await Promise.all(requests);
    const newLogs = results.flat();
    if (newLogs.length > 0) {
      const merged = [...ActivityLog, ...newLogs];

      // 过滤函数
      const filtered = merged.filter(
        (item) =>
          item.state !== 0 &&
          item.state !== "0" &&
          item.state !== null &&
          item.state !== undefined &&
          item.amount !== null &&
          item.amount !== undefined &&
          item.amount !== "0" &&
          item.amount !== "" &&
          Number(item.amount) !== 0 &&
          !isNaN(Number(item.amount))
      );

      // 持久化到AsyncStorage
      await AsyncStorage.setItem("ActivityLog", JSON.stringify(filtered));
      setActivityLog(filtered);
    }
    return anyLoaded;
  };

  // ⏱️ 每 30 秒定时刷新，仅当前页面且 App 前台才执行
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (appState.current === "active" && isFocused) {
        fetchAllActivityLog();
      }
    }, 30000);

    const handleAppStateChange = (nextAppState) => {
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      clearInterval(intervalId);
      subscription.remove(); // ✅ 正确移除监听器
    };
  }, [isFocused, initialAdditionalCryptos]);

  // 在 ActivityScreen 组件的 useEffect 或合适位置添加代码来获取手续费
  const fetchTransactionFee = async () => {
    try {
      const postData = {
        chain: selectedQueryChainName,
        type: "",
      };

      // 打印发送的 POST 数据
      console.log("🚀 Sending POST data:", JSON.stringify(postData, null, 2));

      const response = await fetch(accountAPI.blockchainFee, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        console.log("❌ HTTP Error:", response.status, response.statusText);
        return;
      }

      const data = await response.json();

      console.log("✅ Received response data:", JSON.stringify(data, null, 2));

      if (data && data.data) {
        const { rapidFee, recommendedFee } = data.data;

        setFee(recommendedFee);
        console.log("✅ Fee set to:", recommendedFee);

        setRapidFee(rapidFee);
        console.log("✅ Rapid fee set to:", rapidFee);
      }
    } catch (error) {
      console.log("❌ Failed to fetch processing Fee:", error);
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
              card.chain === selectedQueryChainName
            ) {
              console.log("条件满足，准备发送请求...");

              const postData = {
                chain: card.queryChainName,
                address: card.address,
              };

              // 打印发送的 POST 数据
              console.log("发送的 POST 数据:", postData);

              const response = await fetch(accountAPI.balance, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(postData),
              });
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
    selectedQueryChainName, // 每次选择的加密货币链变化时重新查询余额
    setCryptoCards,
  ]);

  // 监听 initialAdditionalCryptos 的变化，更新 Modal 中的数据
  useEffect(() => {
    if (amountModalVisible) {
      // 查找选中的加密货币对象
      const selected = initialAdditionalCryptos.find(
        (crypto) =>
          crypto.chain === selectedQueryChainName &&
          crypto.name === selectedCrypto
      );

      // 打印找到的加密货币对象
      if (selected) {
        console.log("debug找到匹配的加密货币对象:", selected);

        // 设置余额、价格等
        setBalance(selected.balance);
        setPriceUsd(selected.priceUsd);
        setEstimatedValue(selected.EstimatedValue);
        setFee(selected.fee);

        // 打印设置的值
        console.log("已设置以下值:");
        console.log("Balance:", selected.balance);
        console.log("Price in USD:", selected.priceUsd);
        console.log("Estimated value (US$):", selected.EstimatedValue);
        console.log("Processing Fee:", selected.fee);
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
        addressMonitorSubscription = await displayDeviceAddress(selectedDevice);
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
    if (!SecurityCodeModalVisible) {
      stopMonitoringVerificationCode();
    }
  }, [SecurityCodeModalVisible]);

  // 使用 useEffect 监听模态窗口的变化
  useEffect(() => {
    if (!confirmingTransactionModalVisible) {
      stopMonitoringTransactionResponse();
    }
  }, [confirmingTransactionModalVisible]);

  useEffect(() => {
    if (!bleVisible && selectedDevice) {
      setSecurityCodeModalVisible(true);
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
        // 新增取消蓝牙监听订阅，防止订阅泄漏
        if (monitorSubscription.current) {
          try {
            monitorSubscription.current.remove();
            monitorSubscription.current = null;
            console.log(
              "Activity.js: Cancelled Bluetooth monitor subscription on unmount"
            );
          } catch (error) {
            console.log(
              "Activity.js: Error cancelling Bluetooth monitor subscription on unmount",
              error
            );
          }
        }
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
  //监听签名结果
  const monitorSignedResult = (device) => {
    monitorSubscription.current = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        // ---- 错误处理完整展开 ----
        if (error) {
          if (
            error.message &&
            error.message.includes("Operation was cancelled")
          ) {
            console.log("监听操作被取消，正在重新连接...");
            reconnectDevice(device); // 主动重连逻辑
          } else if (
            error.message &&
            error.message.includes("Unknown error occurred")
          ) {
            console.log("未知错误，可能是一个Bug:", error.message);
            if (error.reason) {
              console.log("错误原因:", error.reason);
            }
            reconnectDevice(device); // 主动重连逻辑
          } else {
            console.log("监听设备响应时出错:", error.message);
          }
          return; // 出现错误时终止本次回调
        }

        // ---- BLE 数据解码 ----
        const receivedData = Buffer.from(
          characteristic.value,
          "base64"
        ).toString("utf8");
        console.log("接收到的数据:", receivedData);

        // ---- 处理 PIN 校验命令 ----
        if (receivedData === "PIN_SIGN_READY") {
          setModalStatus({
            title: t("Waiting for approval on your device...."),
            subtitle: t("Waiting for approval on your device..."),
            image: require("../assets/gif/Pending.gif"),
          });
          // 继续后续签名流程（如请求链参数、发送 presign 等）
          proceedToNextStep && proceedToNextStep();
        } else if (receivedData === "PIN_SIGN_FAIL") {
          setModalStatus({
            title: t("Password Incorrect"),
            subtitle: t(
              "The PIN code you entered is incorrect. Transaction has been terminated."
            ),
            image: require("../assets/gif/Fail.gif"),
          });
          // 不自动关闭，等待用户手动关闭Modal
        } else if (receivedData === "PIN_SIGN_CANCEL") {
          setModalStatus({
            title: t("Password Cancelled"),
            subtitle: t(
              "Password entry cancelled by user. Transaction has been terminated."
            ),
            image: require("../assets/gif/Fail.gif"),
          });
          // 不自动关闭，等待用户手动关闭Modal
        } else if (receivedData.startsWith("signResult:")) {
          // ---- 处理签名数据完整流程 ----
          // 提取 signed_data 内容
          const signedData = receivedData.split("signResult:")[1];
          const [chain, hex] = signedData.split(",");
          // 构造广播交易的数据
          const postData = {
            chain: chain.trim(), // 去掉可能的空格
            hex: hex.trim(), // 在签名前加上 0x，并去掉空格
            address: selectedAddress,
          };
          // 打印对象
          console.log("准备发送的 POST 数据:", postData);
          // 输出: 准备发送的 POST 数据: { chain: "ethereum", hex: "F86C..." }

          // 调用广播交易的 API
          try {
            const response = await fetch(accountAPI.broadcastHex, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(postData),
            });

            const responseData = await response.json();

            // 根据返回的 code 字段判断广播是否成功
            if (response.ok && responseData.code === "0") {
              console.log("交易广播成功:", responseData);
              // 向嵌入式返回 BCAST_OK
              try {
                const msg = Buffer.from("BCAST_OK", "utf-8").toString("base64");
                await device.writeCharacteristicWithResponseForService(
                  serviceUUID,
                  writeCharacteristicUUID,
                  msg
                );
                console.log("已向嵌入式发送 BCAST_OK");
              } catch (err) {
                console.log("发送 BCAST_OK 时出错:", err);
              }
              setModalStatus({
                title: t("Transaction Successful"),
                subtitle: t(
                  "Your transaction was successfully broadcasted on the LUKKEY device."
                ),
                image: require("../assets/gif/Success.gif"),
              });
            } else {
              console.log("交易广播失败:", responseData);
              // 向嵌入式返回 BCAST_FAIL
              try {
                const msg = Buffer.from("BCAST_FAIL", "utf-8").toString(
                  "base64"
                );
                await device.writeCharacteristicWithResponseForService(
                  serviceUUID,
                  writeCharacteristicUUID,
                  msg
                );
                console.log("已向嵌入式发送 BCAST_FAIL");
              } catch (err) {
                console.log("发送 BCAST_FAIL 时出错:", err);
              }
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
            // 向嵌入式返回 BCAST_FAIL
            try {
              const msg = Buffer.from("BCAST_FAIL", "utf-8").toString("base64");
              await device.writeCharacteristicWithResponseForService(
                serviceUUID,
                writeCharacteristicUUID,
                msg
              );
              console.log("已向嵌入式发送 BCAST_FAIL");
            } catch (err) {
              console.log("发送 BCAST_FAIL 时出错:", err);
            }
            setModalStatus({
              title: t("Transaction Error"),
              subtitle: t(
                "An error occurred while broadcasting the transaction."
              ),
              image: require("../assets/gif/Fail.gif"),
            });
          }
        } else {
          // ---- 未知数据完整打印 ----
          console.log("签名结果收到未知数据:", receivedData);
        }
      }
    );
  };

  // 停止监听验证码;
  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription.current) {
      try {
        monitorSubscription.current.remove();
        monitorSubscription.current = null;
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

  const handleConvertPress = () => {
    setConvertModalVisible(true);
  };

  // 新增：使用工厂函数生成 handleDevicePress
  const handleDevicePress = createHandleDevicePress({
    setReceivedAddresses,
    setVerificationStatus,
    setSelectedDevice,
    setBleVisible,
    monitorVerificationCode,
    setSecurityCodeModalVisible,
    serviceUUID,
    writeCharacteristicUUID,
    Buffer,
  });

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
    setSecurityCodeModalVisible(false);
    setCheckStatusModalVisible(false);
    const verificationCodeValue = receivedVerificationCode.trim();
    const pinCodeValue = pinCode.trim();

    //  console.log(`User PIN: ${pinCodeValue}`);
    console.log(`Received data: ${verificationCodeValue}`);

    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      setCheckStatusModalVisible(true);
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

    // 新增：无论是否相等，立即发送 pinCodeValue 与 receivedPin 给嵌入式设备
    try {
      const pinData = `pinCodeValue:${pinCodeValue},receivedPin:${receivedPin}`;
      const bufferPinData = Buffer.from(pinData, "utf-8");
      const base64PinData = bufferPinData.toString("base64");
      await selectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64PinData
      );
      console.log("Sent pinCodeValue and receivedPin to device:", pinData);
    } catch (error) {
      console.log("Error sending pin data:", error);
    }

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
        monitorVerificationCode(selectedDevice);

        setCheckStatusModalVisible(true);
        setVerificationStatus("waiting");

        // 1. 依次批量发所有 address:<chainName> 命令
        for (const prefix of Object.keys(prefixToShortName)) {
          const chainName = prefix.replace(":", "");
          const getMessage = `address:${chainName}`;
          const bufferGetMessage = Buffer.from(getMessage, "utf-8");
          const base64GetMessage = bufferGetMessage.toString("base64");
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64GetMessage
          );
          await new Promise((resolve) => setTimeout(resolve, 250));
        }

        // 2. 统一延迟2秒检查所有缺失的链地址，然后自动补发一次
        setTimeout(async () => {
          // 自动补发最多3次（用本地缓存记补发次数）
          const retryCountKey = "bluetoothMissingChainRetryCount";
          let retryCountObj = {};
          try {
            const retryStr = await AsyncStorage.getItem(retryCountKey);
            if (retryStr) retryCountObj = JSON.parse(retryStr);
          } catch (e) {}
          if (!retryCountObj) retryCountObj = {};

          // 检查所有链的地址收集情况
          const addresses = receivedAddresses || {};
          const missingChains = Object.values(prefixToShortName).filter(
            (shortName) => !addresses[shortName]
          );

          if (missingChains.length > 0) {
            console.log(
              "🚨 统一补发缺失链 address 请求:",
              missingChains.join(", ")
            );
            for (let i = 0; i < missingChains.length; i++) {
              const shortName = missingChains[i];
              // 读取补发次数
              if (!retryCountObj[shortName]) retryCountObj[shortName] = 0;
              if (retryCountObj[shortName] >= 3) {
                continue; // 每个链最多补发3次
              }
              retryCountObj[shortName] += 1;

              const prefixEntry = Object.entries(prefixToShortName).find(
                ([k, v]) => v === shortName
              );
              if (prefixEntry) {
                const prefix = prefixEntry[0];
                const chainName = prefix.replace(":", "");
                const getMessage = `address:${chainName}`;
                const bufferGetMessage = Buffer.from(getMessage, "utf-8");
                const base64GetMessage = bufferGetMessage.toString("base64");
                await selectedDevice.writeCharacteristicWithResponseForService(
                  serviceUUID,
                  writeCharacteristicUUID,
                  base64GetMessage
                );
                console.log(
                  `🔁 Retry request address:${chainName} (${retryCountObj[shortName]}/3)`
                );
                await new Promise((resolve) => setTimeout(resolve, 400));
              }
            }
            // 保存补发次数
            await AsyncStorage.setItem(
              retryCountKey,
              JSON.stringify(retryCountObj)
            );
          } else {
            console.log("✅ All addresses received, no missing chains");
          }
        }, 2000);

        // 3. (原有 pubkey 指令)
        setTimeout(async () => {
          const pubkeyMessages = [
            "pubkey:cosmos,m/44'/118'/0'/0/0",
            "pubkey:ripple,m/44'/144'/0'/0/0",
            "pubkey:celestia,m/44'/118'/0'/0/0",
            "pubkey:juno,m/44'/118'/0'/0/0",
            "pubkey:osmosis,m/44'/118'/0'/0/0",
          ];

          for (const message of pubkeyMessages) {
            await new Promise((resolve) => setTimeout(resolve, 250));
            try {
              const messageWithNewline = message + "\n";
              const bufferMessage = Buffer.from(messageWithNewline, "utf-8");
              const base64Message = bufferMessage.toString("base64");
              await selectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                writeCharacteristicUUID,
                base64Message
              );
              console.log(`Sent message: ${messageWithNewline}`);
            } catch (error) {
              console.log(`Error sending message "${message}":`, error);
            }
          }
        }, 750);
        setCheckStatusModalVisible(true);
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

  const handleVerifyAddress = (chainShortName) => {
    console.log("传入的链短名称是:", chainShortName);

    if (verifiedDevices.length > 0) {
      const device = devices.find((d) => d.id === verifiedDevices[0]);
      if (device) {
        displayDeviceAddress(
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
    setOperationType("Send");
    setIsAddressValid(false);
    setModalVisible(true);
  };
  const selectCrypto = async (crypto) => {
    setSelectedCrypto(crypto.shortName);

    setSelectedAddress(crypto.address);
    setSelectedCryptoIcon(crypto.icon);
    setBalance(crypto.balance);
    setEstimatedValue(crypto.EstimatedValue);
    setFee(crypto.fee);
    setPriceUsd(crypto.priceUsd);
    setQueryChainName(crypto.queryChainName);
    setChainShortName(crypto.queryChainShortName);
    setSelectedCryptoName(crypto.name);
    setIsVerifyingAddress(false);
    setModalVisible(false);

    if (operationType === "receive") {
      setAddressModalVisible(true);
    } else if (operationType === "Send") {
      if (verifiedDevices.length > 0) {
        const device = devices.find((d) => d.id === verifiedDevices[0]);
        if (device) {
          setAddressModalVisible(false);
          setInputAddress("");
          setContactFormModalVisible(true);
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
    setContactFormModalVisible(false);
    setAmountModalVisible(true);
  };

  const handleNextAfterAmount = () => {
    setAmountModalVisible(false);
    setConfirmModalVisible(true);
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
      style={ActivityScreenStyle.bgContainer}
    >
      <View className="w-[100%]" style={ActivityScreenStyle.container}>
        <ActionButtons
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
          iconColor={iconColor}
          handleSendPress={handleSendPress}
          handleReceivePress={handleReceivePress}
          handleConvertPress={handleConvertPress}
        />
        {/* 交易历史记录组件 */}
        <ActivityLogComponent
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
          ActivityLog={ActivityLog}
          isLoading={isLoading}
          cryptoCards={cryptoCards}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onLoadMore={fetchNextActivityLogPage}
          hasMore={hasMore}
        />
        {/* 输入地址的 Modal */}
        <ContactFormModal
          visible={ContactFormModalVisible}
          onRequestClose={() => setContactFormModalVisible(false)}
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
          isDarkMode={isDarkMode}
          handleAddressChange={handleAddressChange}
          inputAddress={inputAddress}
          detectedNetwork={detectedNetwork}
          isAddressValid={isAddressValid}
          buttonBackgroundColor={buttonBackgroundColor}
          disabledButtonBackgroundColor={disabledButtonBackgroundColor}
          handleNextAfterAddress={handleNextAfterAddress}
          setContactFormModalVisible={setContactFormModalVisible}
          selectedCrypto={selectedCrypto}
          selectedCryptoChain={selectedQueryChainName}
          selectedCryptoIcon={selectedCryptoIcon}
        />
        {/* 输入金额的 Modal */}
        <AmountModal
          visible={amountModalVisible}
          onRequestClose={() => setAmountModalVisible(false)}
          ActivityScreenStyle={ActivityScreenStyle}
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
          selectedCryptoChain={selectedQueryChainName}
          selectedCryptoIcon={selectedCryptoIcon}
          currencyUnit={currencyUnit}
          exchangeRates={exchangeRates}
          cryptoCards={cryptoCards}
          selectedCryptoName={selectedCryptoName}
          EstimatedValue={EstimatedValue}
          setCryptoCards={setCryptoCards}
          recommendedFee={recommendedFee}
          recommendedValue={recommendedValue}
          rapidFeeValue={rapidFeeValue}
          rapidCurrencyValue={rapidCurrencyValue}
          selectedFeeTab={selectedFeeTab}
          setSelectedFeeTab={setSelectedFeeTab}
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
              // 先显示“请在设备上输入密码”的状态
              setModalStatus({
                title: t("Please enter password on your device"),
                subtitle: t("Please enter password on your device"),
                image: require("../assets/gif/Enter.gif"),
              });
              setConfirmingTransactionModalVisible(true);

              // 2秒后切换到“waiting for approval on your device...”状态并启动签名
              setTimeout(async () => {
                setModalStatus({
                  title: t("Waiting for approval on your device...."),
                  subtitle: t("Waiting for approval on your device..."),
                  image: require("../assets/gif/Pending.gif"),
                });
                await signTransaction(
                  device,
                  amount,
                  selectedCryptoObj.address,
                  inputAddress,
                  selectedCryptoObj.queryChainName,
                  selectedCryptoObj.contractAddress,
                  selectedFeeTab,
                  recommendedFee,
                  rapidFeeValue,
                  setModalStatus,
                  t,
                  monitorSignedResult,
                  monitorSubscription
                );
              }, 2000); // 等2秒进入签名步骤这一步本意是让用户在嵌入式上面输入密码
            } catch (error) {
              console.log("确认交易时出错:", error);
            }
          }}
          onCancel={() => setConfirmModalVisible(false)}
          t={t}
          ActivityScreenStyle={ActivityScreenStyle}
          isDarkMode={isDarkMode}
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCrypto={selectedCrypto}
          selectedCryptoChain={selectedQueryChainName}
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
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
          setModalVisible={setModalVisible}
          isDarkMode={isDarkMode}
        />
        {/* 显示选择的加密货币地址的模态窗口 */}
        <ShowReceiveInfoModal
          visible={addressModalVisible}
          onRequestClose={() => setAddressModalVisible(false)}
          ActivityScreenStyle={ActivityScreenStyle}
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
          handleDevicePress={handleDevicePress}
          onCancel={() => {
            setBleVisible(false);
            setSelectedDevice(null);
          }}
          verifiedDevices={"0"}
          SecureDeviceScreenStyle={ActivityScreenStyle}
          t={t}
          onDisconnectPress={handleDisconnectDevice}
        />
        {/* PIN Modal */}
        <SecurityCodeModal
          visible={SecurityCodeModalVisible}
          pinCode={pinCode}
          setPinCode={setPinCode}
          onSubmit={handlePinSubmit}
          onCancel={() => {
            setSecurityCodeModalVisible(false);
            setPinCode("");
          }}
          styles={ActivityScreenStyle}
          isDarkMode={isDarkMode}
          t={t}
          status={verificationStatus}
        />
        {/* Verification Modal */}
        <CheckStatusModal
          visible={CheckStatusModalVisible && verificationStatus !== null}
          status={verificationStatus}
          missingChains={missingChainsForModal}
          onClose={() => setCheckStatusModalVisible(false)}
          progress={
            verificationStatus === "waiting"
              ? Object.keys(receivedAddresses).length /
                Object.keys(prefixToShortName).length
              : undefined
          }
        />
        {/* Pending Transaction Modal */}
        <ActivityProgressModal
          visible={confirmingTransactionModalVisible}
          onClose={() => setConfirmingTransactionModalVisible(false)}
          modalStatus={modalStatus}
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
        />
        {/* Convert Modal */}
        <ConvertModal
          visible={swapModalVisible}
          setConvertModalVisible={setConvertModalVisible}
          fromDropdownVisible={fromDropdownVisible}
          setFromDropdownVisible={setFromDropdownVisible}
          toDropdownVisible={toDropdownVisible}
          setToDropdownVisible={setToDropdownVisible}
          initialAdditionalCryptos={initialAdditionalCryptos}
          selectedDevice={selectedDevice}
        />
      </View>
    </LinearGradient>
  );
}

export default ActivityScreen;
