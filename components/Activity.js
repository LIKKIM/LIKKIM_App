/**
 * 本文件用到的主要函数和钩子说明（补全版）：
 *
 * 【React钩子】
 * useState, useEffect, useContext, useRef, useMemo, useCallback —— 用于状态管理、生命周期、副作用、引用、记忆化等。
 * useTranslation —— 国际化翻译钩子。
 * useIsFocused —— 判断页面是否聚焦的导航钩子。
 *
 * 【自定义校验函数】
 * isValidAmount —— 校验金额有效性。
 * isValidState —— 校验状态有效性。
 *
 * 【交易历史相关异步函数】
 * fetchAllActivityLog —— 获取所有交易历史。
 * fetchNextActivityLogPage —— 分页获取交易历史。
 * fetchTransactionFee —— 获取链上手续费。
 *
 * 【按钮点击处理函数】
 * handleSendPress —— 处理发送按钮点击。
 * handleReceivePress —— 处理接收按钮点击。
 * handleConvertPress —— 处理兑换按钮点击。
 *
 * 【设备管理相关函数】
 * handleDevicePress —— 设备点击处理。
 * handleDisconnectDevice —— 断开设备连接。
 * reconnectDevice —— 设备重连。
 *
 * 【PIN码处理函数】
 * handlePinSubmit —— PIN码提交处理。
 * handlePinSubmitProxy —— PIN码提交代理。
 *
 * 【地址验证相关】
 * handleVerifyAddress —— 地址验证处理。
 *
 * 【加密货币选择相关】
 * selectCrypto —— 选择加密货币处理。
 *
 * 【步骤切换处理函数】
 * handleNextAfterAddress —— 地址输入后下一步处理。
 * handleNextAfterAmount —— 金额输入后下一步处理。
 *
 * 【地址输入处理】
 * handleAddressChange —— 地址输入变更处理。
 *
 * 【监听相关函数】
 * monitorVerificationCode —— 监听验证码。
 * monitorSignedResult —— 监听签名结果。
 * stopMonitoringVerificationCode —— 停止监听验证码。
 * stopMonitoringTransactionResponse —— 停止监听交易反馈。
 *
 * 【工具函数】
 * signTransaction —— 交易签名处理。
 * Clipboard, Buffer, AsyncStorage, fetch —— 剪贴板、二进制、存储、网络请求等工具。
 * detectNetwork —— 检测地址网络类型。
 * scanDevices —— 扫描蓝牙设备。
 * displayDeviceAddress —— 显示设备地址。
 * createHandlePinSubmit, createHandleDevicePress, createMonitorVerificationCode —— 工厂函数生成处理器。
 *
 * 【事件处理函数】
 * onPress, onRequestClose, onConfirm, onCancel, onRefresh, onLoadMore, onChangeText —— 传递给组件和Modal的事件处理。
 *
 * 【其他自定义函数】
 * cleanActivityLog —— 清理交易历史日志。
 * onRefresh —— 刷新交易历史。
 * reconnectDevice —— 设备重连。
 *
 * 如需了解具体实现，请查阅对应函数定义和调用处。
 */

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
import SelectAssetModal from "./modal/SelectAssetModal";
import ConvertModal from "./modal/ConvertModal";
import ReceiveAddressModal from "./modal/ReceiveAddressModal";
import SecurityCodeModal from "./modal/SecurityCodeModal";
import ActivityLogComponent from "./ActivityScreen/ActivityLogComponent";
import ActionButtons from "./ActivityScreen/ActionButtons";
// 自定义组件
import displayDeviceAddress from "../utils/displayDeviceAddress";
import { parseDeviceCode } from "../utils/parseDeviceCode";
import { createHandlePinSubmit } from "../utils/handlePinSubmit";
import { accountAPI, signAPI } from "../env/apiEndpoints";
import signTransaction from "./ActivityScreen/signTransaction";
import { bluetoothConfig } from "../env/bluetoothConfig";
import { createHandleDevicePress } from "../utils/handleDevicePress";
// 公共工厂函数
import createMonitorVerificationCode from "../utils/monitorVerificationCode";
import { scanDevices } from "../utils/scanDevices";
import {
  fetchAllActivityLog,
  fetchNextActivityLogPage,
} from "../utils/activityLog";
import { fetchTransactionFee } from "../utils/fetchTransactionFee";
import { handleDisconnectDevice } from "../utils/handleDisconnectDevice";
import { handleVerifyAddress } from "../utils/handleVerifyAddress";
import createSelectCrypto from "../utils/selectCrypto";
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
  const [missingChainsForModal, setMissingChainsForModal] = useState([]);
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
  const [isVerifyingAddress, setIsVerifyingAddress] = useState(false);
  const [receivedAddresses, setReceivedAddresses] = useState({});
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
    await fetchAllActivityLog({
      initialAdditionalCryptos,
      setActivityLog,
      setActivityLogPages,
      accountAPI,
    });
    setRefreshing(false);
  };

  // ---------- 扫描设备 ----------
  const { bleManagerRef } = useContext(DeviceContext);

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

  // ⏱️ 每 30 秒定时刷新，仅当前页面且 App 前台才执行
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (appState.current === "active" && isFocused) {
        fetchAllActivityLog({
          initialAdditionalCryptos,
          setActivityLog,
          setActivityLogPages,
          accountAPI,
        });
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

  useEffect(() => {
    if (amountModalVisible) {
      fetchTransactionFee({
        selectedQueryChainName,
        setFee,
        setRapidFee,
        accountAPI,
      });
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
              card.queryChainShortName?.toLowerCase() ===
                selectedCryptoObj.queryChainShortName?.toLowerCase() &&
              card.queryChainName?.toLowerCase() ===
                selectedQueryChainName?.toLowerCase()
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
                `卡片名称和链名称不匹配，跳过查询: ${card.name} - ${card.queryChainName}`
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
      const selected = cryptoCards.find(
        (crypto) =>
          crypto.queryChainName.toLowerCase() ===
            selectedQueryChainName.toLowerCase() &&
          crypto.queryChainShortName.toLowerCase() ===
            selectedCrypto.toLowerCase()
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
  // 已移除蓝牙 onStateChange 监听，统一由 App.js 管理
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

  // verificationStatus 用于表示整体状态
  // 例如：setVerificationStatus("waiting") 或 setVerificationStatus("success")

  const monitorSubscription = useRef(null);

  const monitorVerificationCode = createMonitorVerificationCode({
    serviceUUID,
    notifyCharacteristicUUID,
    prefixToShortName,
    updateCryptoAddress,
    setReceivedAddresses,
    setVerificationStatus,
    updateDevicePubHintKey,
    parseDeviceCode,
    setReceivedVerificationCode,
    Buffer,
    writeCharacteristicUUID,
  });
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
                const msg = Buffer.from("BCAST_OK\r\n", "utf-8").toString(
                  "base64"
                );
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
                const msg = Buffer.from("BCAST_FAIL\r\n", "utf-8").toString(
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
              const msg = Buffer.from("BCAST_FAIL\r\n", "utf-8").toString(
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

  // 包装一层，收集依赖参数，适配 SecurityCodeModal 的无参 onSubmit
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

  const handleReceivePress = () => {
    scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
    setOperationType("receive");
    setModalVisible(true);
  };

  const handleSendPress = () => {
    scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
    setOperationType("Send");
    setIsAddressValid(false);
    setModalVisible(true);
  };

  const selectCrypto = React.useCallback(
    createSelectCrypto({
      setSelectedCrypto,
      setSelectedAddress,
      setSelectedCryptoIcon,
      setBalance,
      setEstimatedValue,
      setFee,
      setPriceUsd,
      setQueryChainName,
      setChainShortName,
      setSelectedCryptoName,
      setIsVerifyingAddress,
      setModalVisible,
      setAddressModalVisible,
      setInputAddress,
      setContactFormModalVisible,
      setBleVisible,
      operationType,
      verifiedDevices,
      devices,
    }),
    [
      setSelectedCrypto,
      setSelectedAddress,
      setSelectedCryptoIcon,
      setBalance,
      setEstimatedValue,
      setFee,
      setPriceUsd,
      setQueryChainName,
      setChainShortName,
      setSelectedCryptoName,
      setIsVerifyingAddress,
      setModalVisible,
      setAddressModalVisible,
      setInputAddress,
      setContactFormModalVisible,
      setBleVisible,
      operationType,
      verifiedDevices,
      devices,
    ]
  );

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
          onLoadMore={async () => {
            await fetchNextActivityLogPage({
              initialAdditionalCryptos,
              activityLogPages,
              ActivityLog,
              setActivityLog,
              setActivityLogPages,
              accountAPI,
            });
          }}
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
        <SelectAssetModal
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
        <ReceiveAddressModal
          visible={addressModalVisible}
          onClose={() => setAddressModalVisible(false)}
          styleObj={ActivityScreenStyle}
          cryptoIcon={selectedCryptoIcon}
          cryptoName={selectedCrypto}
          address={selectedAddress}
          isVerifying={isVerifyingAddress}
          verifyMsg={addressVerificationMessage}
          handleVerify={(chainShortName) =>
            handleVerifyAddress({
              chainShortName,
              verifiedDevices,
              devices,
              setAddressModalVisible,
              setBleVisible,
              displayDeviceAddress,
              setIsVerifyingAddress,
              setAddressVerificationMessage,
              t,
            })
          }
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
          onDisconnectPress={async (device) => {
            await handleDisconnectDevice({
              device,
              verifiedDevices,
              setVerifiedDevices,
              setIsVerificationSuccessful,
            });
          }}
        />
        {/* PIN Modal */}
        <SecurityCodeModal
          visible={SecurityCodeModalVisible}
          pinCode={pinCode}
          setPinCode={setPinCode}
          onSubmit={handlePinSubmitProxy}
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
