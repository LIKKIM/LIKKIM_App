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
import QRCode from "react-native-qrcode-svg";
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
import { BleManager, BleErrorCode } from "react-native-ble-plx";
const serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB";
const writeCharacteristicUUID = "0000FFE2-0000-1000-8000-00805F9B34FB";

function TransactionsScreen() {
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const { t } = useTranslation();
  const [swapModalVisible, setSwapModalVisible] = useState(false);
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const { isDarkMode } = useContext(DarkModeContext);
  const {
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
  const [fee, setFee] = useState("");
  const [queryChainShortName, setQueryChainShortName] = useState("");
  const [priceUsd, setPriceUsd] = useState("");
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const iconColor = isDarkMode ? "#ffffff" : "#676776";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const placeholderColor = isDarkMode ? "#ffffff" : "#24234C";
  const [amount, setAmount] = useState("");
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc"; // 根据 isDarkMode 设置不同的灰色
  const [inputAddress, setInputAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amountModalVisible, setAmountModalVisible] = useState(false); // 新增状态
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 新增交易确认modal状态
  const [transactionFee, setTransactionFee] = useState(""); // 示例交易手续费
  // const [transactionHistory, setTransactionHistory] = useState([]);
  const [hasFetchedBalance, setHasFetchedBalance] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [bleVisible, setBleVisible] = useState(false); // New state for Bluetooth modal
  const isScanningRef = useRef(false);
  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinCode, setPinCode] = useState("");

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

  /*   useEffect(() => {
    console.log("Initial Cryptos:", initialAdditionalCryptos);
  }, []); */

  // 在 amountModalVisible 状态变为 true 时发送 POST 请求

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
        console.error("Failed to load transaction history:", error);
      }
    };

    loadTransactionHistory();
  }, []); // 依赖数组为空，确保此操作仅在组件挂载时执行一次

  useEffect(() => {
    if (amountModalVisible && !hasFetchedBalance) {
      const fetchTokenBalanceAndFee = async () => {
        try {
          // 根据 selectedCrypto 查找对应的加密货币对象
          const selectedCryptoObj = initialAdditionalCryptos.find(
            (crypto) => crypto.shortName === selectedCrypto
          );

          if (!selectedCryptoObj) {
            throw new Error(`Crypto ${selectedCrypto} not found`);
          }

          // 打印 selectedCryptoObj 的相关信息
          console.log(`Selected Crypto: ${selectedCrypto}`);
          console.log(
            `chainShortName: ${selectedCryptoObj.queryChainShortName}`
          );
          console.log(`address: ${selectedCryptoObj.address}`);

          // 查询代币余额
          const balanceResponse = await fetch(
            "https://bt.likkim.com/meridian/address/queryTokenBalance",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chainShortName: selectedCrypto.shortName,
                address: selectedCrypto.address,
                protocolType: "token_20",
              }),
            }
          );

          if (!balanceResponse.ok) {
            throw new Error(`HTTP error! status: ${balanceResponse.status}`);
          }

          const balanceData = await balanceResponse.json();
          console.log("Transaction 余额查询 Response Data:", balanceData);

          if (
            balanceData &&
            balanceData.data &&
            balanceData.data.length > 0 &&
            balanceData.data[0].tokenList
          ) {
            const tokenList = balanceData.data[0].tokenList;

            // 循环遍历并打印每个 token 的详细信息
            tokenList.forEach((token, index) => {
              console.log(`Token ${index + 1}:`);
              console.log(
                `  - holdingAmount: ${token.holdingAmount} // 持有的数量`
              );
              console.log(
                `  - priceUsd: ${token.priceUsd} // 每个代币的美元价格`
              );
              console.log(`  - symbol: ${token.symbol} // 代币的符号`);
              console.log(
                `  - tokenContractAddress: ${token.tokenContractAddress} // 代币合约地址`
              );
              console.log(
                `  - tokenId: ${token.tokenId} // NFT ID，若为空表示非NFT代币`
              );
              console.log(
                `  - tokenType: ${token.tokenType} // 代币类型，例如 TRC20`
              );
              console.log(
                `  - valueUsd: ${token.valueUsd} // 该地址持有的总美元价值`
              );
            });

            console.table(tokenList);

            tokenList.forEach((token) => {
              updateCryptoData(token.symbol, {
                balance: token.holdingAmount,
                priceUsd: token.priceUsd,
                valueUsd: token.valueUsd,
              });
            });

            // 在此打印检查更新后的数据
            //  console.log('Updated initialAdditionalCryptos:', initialAdditionalCryptos);
          } else {
            console.log("No tokenList found in response data.");
          }

          // 查询手续费
          const feeResponse = await fetch(
            "https://bt.likkim.com/meridian/transaction/queryFee",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chainShortName: selectedCryptoObj.queryChainShortName,
              }),
            }
          );

          if (!feeResponse.ok) {
            throw new Error(`HTTP error! status: ${feeResponse.status}`);
          }

          const feeData = await feeResponse.json();
          console.log("Transaction 手续费查询 Response Data:", feeData);
          if (feeData && feeData.data && feeData.data.length > 0) {
            const feeInfo = feeData.data[0];
            const transactionFeeValue = feeInfo.bestTransactionFee;

            setTransactionFee(transactionFeeValue); // 设置查询到的交易手续费
          } else {
            console.log("No fee data found in response data.");
            setTransactionFee(selectedCryptoObj.fee); // 如果查询失败，使用 initialAdditionalCryptos 中的 fee 值
          }
        } catch (error) {
          console.error("Error:", error);
          setTransactionFee(selectedCryptoObj.fee); // 如果请求出错，使用 initialAdditionalCryptos 中的 fee 值
        } finally {
          setHasFetchedBalance(true);
        }
      };

      fetchTokenBalanceAndFee();
    }
  }, [
    amountModalVisible,
    hasFetchedBalance,
    selectedCrypto,
    initialAdditionalCryptos,
    updateCryptoData,
  ]);

  // 监听 initialAdditionalCryptos 的变化，更新 Modal 中的数据
  useEffect(() => {
    if (amountModalVisible) {
      const selected = initialAdditionalCryptos.find(
        (crypto) => crypto.shortName === selectedCrypto
      );
      if (selected) {
        setBalance(selected.balance);
        setPriceUsd(selected.priceUsd);
        setValueUsd(selected.valueUsd);
        setFee(selected.fee);
      }
    }
  }, [initialAdditionalCryptos, amountModalVisible]);
  /*   useEffect(() => {
    console.log("Current initialAdditionalCryptos:", initialAdditionalCryptos);
  }, [initialAdditionalCryptos]); */
  // 当蓝牙模态框打开时，开始扫描设备
  useEffect(() => {
    if (bleVisible) {
      scanDevices();
    }
  }, [bleVisible]);

  // 清理蓝牙管理器
  useEffect(() => {
    return () => {
      bleManagerRef.current && bleManagerRef.current.destroy();
    };
  }, []);
  /*   useEffect(() => {
    console.log("Added Cryptos in TransactionsScreen:", addedCryptos);
  }, [addedCryptos]); */

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
  let monitorSubscription;

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
      console.error("设备重新连接失败:", error);
    }
  };

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
        console.log("接收到的16进制数据字符串:", receivedDataHex);

        // 示例：检查接收到的数据的前缀是否正确（例如，预期为 "a1"）
        if (receivedDataHex.startsWith("a1")) {
          // 提取接收到的验证码（根据你的协议调整具体的截取方式）
          const verificationCode = receivedDataHex.substring(2, 6); // 获取从第2个字符开始的4个字符（例如 "a1 04 D2" 中的 "04D2"）
          console.log("接收到的验证码:", verificationCode);

          // 将验证码存储到状态中，或进行进一步的处理
          setReceivedVerificationCode(verificationCode);
        } else {
          console.warn("接收到的不是预期的验证码数据");
        }
      }
    );
  };

  // 监听交易反馈函数
  const monitorTransactionResponse = (device) => {
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    // 用于存储拼接的完整数据
    let dataBuffer = "";
    console.log("签名反馈监听器启动成功");
    transactionMonitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.error("监听交易反馈时出错:", error.message);
          return;
        }

        // Base64解码接收到的数据
        const receivedData = Buffer.from(characteristic.value, "base64");

        // 将接收到的数据解析为16进制字符串
        const receivedDataHex = receivedData.toString("hex").toUpperCase();
        console.log("接收到的16进制数据字符串:", receivedDataHex);

        // 将接收到的分段数据拼接到数据缓冲区
        dataBuffer += receivedDataHex;

        // 检查数据缓冲区是否包含结束符 (0D0A)
        if (dataBuffer.endsWith("0D0A")) {
          console.log("拼接后的完整数据:", dataBuffer);

          // 此时，dataBuffer 包含了完整的签名数据，开始处理

          // 检查接收到的头部字节是否为签名数据 (例如: A3)
          if (dataBuffer.startsWith("A3")) {
            // 解析签名数据的长度 (第二和第三个字节，高位在前低位在后)
            const signatureDataLength = parseInt(dataBuffer.substr(2, 4), 16);
            console.log("解析出的签名数据长度:", signatureDataLength);

            // 提取签名数据内容
            const signatureData = dataBuffer.substr(6, signatureDataLength * 2);
            console.log("接收到的签名数据:", signatureData);

            // 解析总长度（假设在倒数第6个字节和倒数第5个字节）
            const totalLengthHex = dataBuffer.substr(-12, 4); // 调整偏移量以提取 `011F`
            const totalLength = parseInt(totalLengthHex, 16);

            // 打印出用于解析的数据总长度的字节值和解析结果
            console.log(`数据总长度 (HEX): ${totalLengthHex}`);
            console.log(`数据总长度 (Decimal): ${totalLength}`);

            // 提取CRC (倒数第五和倒数第四个字节)
            const crcReceived = dataBuffer.substr(-8, 4);
            console.log("接收到的CRC:", crcReceived);

            // 计算预期的CRC
            const expectedCrc = crc16Modbus(
              Buffer.from(dataBuffer.slice(0, -8), "hex")
            );

            // 处理字节顺序确保与 crcReceived 顺序一致
            const expectedCrcHex = expectedCrc
              .toString(16)
              .toUpperCase()
              .padStart(4, "0");
            const swappedExpectedCrc =
              expectedCrcHex.substr(2, 2) + expectedCrcHex.substr(0, 2);
            console.log("计算的CRC:", swappedExpectedCrc);

            // CRC校验
            if (crcReceived.toUpperCase() === swappedExpectedCrc) {
              console.log("CRC校验通过");

              // CRC校验通过后，发送签名数据到指定的URL
              const url =
                "https://bt.likkim.com/meridian/transaction/publishTx";
              const requestBody = {
                signedTx: signatureData,
                chainShortName: "TRON",
              };

              try {
                const response = await fetch(url, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(requestBody),
                });

                const result = await response.json();

                // 打印返回结果的结构
                console.log("签名请求结果:");
                console.log(`Code: ${result.code}`);
                console.log(`Message: ${result.msg}`);
                console.log(`Code 类型: ${typeof result.code}`); // 打印类型
                console.log(`Message 类型: ${typeof result.msg}`);

                // 在这里检查 result.code 的值并打印相应的消息
                if (result.code === "0" && result.msg === "success") {
                  console.log("签名广播成功");

                  // 更新模态框文案和 GIF
                  setModalStatus({
                    title: t("Transaction Successful"),
                    subtitle: t(
                      "Your transaction has been successfully processed."
                    ),
                    image: require("../assets/gif/Success.gif"),
                  });

                  // 发送广播成功的命令 FA 01 02 D1 A0 0D 0A
                  const successCommand = new Uint8Array([
                    0xfa, 0x01, 0x02, 0xd1, 0xa0, 0x0d, 0x0a,
                  ]);
                  const base64SuccessCommand =
                    base64.fromByteArray(successCommand);

                  await device.writeCharacteristicWithResponseForService(
                    serviceUUID,
                    writeCharacteristicUUID,
                    base64SuccessCommand
                  );
                } else if (result.code === "-1") {
                  console.log("签名广播失败");

                  // 更新模态框文案和 GIF
                  setModalStatus({
                    title: t("Transaction Failed"),
                    subtitle: t(
                      "The transaction could not be processed. Please try again."
                    ),
                    image: require("../assets/gif/Fail.gif"),
                  });

                  // 发送广播失败的命令 FA 00 02 D0 30 0D 0A
                  const failCommand = new Uint8Array([
                    0xfa, 0x00, 0x02, 0xd0, 0x30, 0x0d, 0x0a,
                  ]);
                  const base64FailCommand = base64.fromByteArray(failCommand);

                  await device.writeCharacteristicWithResponseForService(
                    serviceUUID,
                    writeCharacteristicUUID,
                    base64FailCommand
                  );
                }

                if (Array.isArray(result.data)) {
                  result.data.forEach((item, index) => {
                    console.log(`Item ${index + 1}:`);
                    console.log(`Chain Full Name: ${item.chainFullName}`);
                    console.log(`Chain Short Name: ${item.chainShortName}`);
                    console.log(`TxID: ${item.txid}`);
                  });
                }
              } catch (error) {
                console.error("发送签名数据时出错:", error);
              }
            } else {
              console.error("CRC校验失败");
            }
          } else if (dataBuffer === "FA000230D00D0A") {
            console.log("拒绝签名");
          } else if (dataBuffer === "FA0102A0D10D0A") {
            console.log("同意签名");
          } else {
            console.warn("接收到的不是预期的交易反馈数据");
          }

          // 处理完成后清空缓冲区
          dataBuffer = "";
        }
      }
    );
  };

  const handleDevicePress = async (device) => {
    // 检查是否传递了有效的设备对象
    if (typeof device !== "object" || typeof device.connect !== "function") {
      console.error("无效的设备对象，无法连接设备:", device);
      return;
    }

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

      // 设置正在验证地址的状态
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

  // 签名函数
  const signTransaction = async (
    verifiedDevices,
    hash,
    height,
    blockTime,
    amount,
    userAddress,
    cryptoName = "USDT"
  ) => {
    try {
      if (verifiedDevices.length === 0) {
        console.error("未找到已验证的设备");
        return;
      }

      const deviceID = verifiedDevices[0];
      const device = await bleManagerRef.current.connectToDevice(deviceID);

      // 确保设备已连接并发现所有服务和特性
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      if (!device.isConnected) {
        console.error("设备未连接，无法发送交易命令");
        return;
      }

      // 让设备准备好
      await new Promise((resolve) => setTimeout(resolve, 500));

      let crypto = initialAdditionalCryptos.find(
        (c) => c.name === cryptoName || c.shortName === cryptoName
      );

      if (!crypto && usdtCrypto.shortName === cryptoName) {
        crypto = usdtCrypto;
      }

      if (!crypto || !crypto.address) {
        console.error("未找到有效的加密货币或地址缺失");
        return;
      }

      const contractAddress = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
      const derivationPath = "m/44'/195'/0'/0/0";

      if (
        !contractAddress ||
        !crypto.address ||
        !userAddress ||
        !amount ||
        !hash ||
        !height ||
        !blockTime ||
        !derivationPath
      ) {
        console.error("参数缺失：", {
          contractAddress,
          cryptoAddress: crypto.address,
          userAddress,
          amount,
          hash,
          height,
          blockTime,
          derivationPath,
        });
        return;
      }

      // 将 amount 乘以 1000000
      const adjustedAmount = BigInt(Math.round(parseFloat(amount) * 1000000));
      console.log(`Adjusted Amount (in smallest unit): ${adjustedAmount}`);

      // 将调整后的金额转换为 ASCII 的十六进制表示
      const amountHex = Buffer.from(adjustedAmount.toString(), "ascii")
        .toString("hex")
        .toUpperCase();
      console.log(`Amount Hex (ASCII after adjustment): ${amountHex}`);

      // 将字符串转换为 ASCII 码的十六进制表示
      function toAsciiHex(str) {
        return Buffer.from(str, "ascii").toString("hex").toUpperCase();
      }

      // 继续处理其他参数
      const contractAddressHex = Buffer.from(contractAddress, "utf-8").toString(
        "hex"
      );
      const cryptoAddressHex = Buffer.from(crypto.address, "utf-8").toString(
        "hex"
      );
      const userAddressHex = Buffer.from(userAddress, "utf-8").toString("hex");
      const hashHex = Buffer.from(hash, "utf-8").toString("hex");
      const heightHex = toAsciiHex(height.toString()).padStart(8, "0");
      const blockTimeHex = toAsciiHex(blockTime.toString()).padStart(16, "0");
      const derivationPathHex = Buffer.from(derivationPath, "utf-8").toString(
        "hex"
      );
      const derivationPathLength = derivationPathHex.length / 2;

      // 打印其他参数
      console.log(`Contract Address: ${contractAddress}`);
      console.log(`Crypto Address: ${crypto.address}`);
      console.log(`User Address: ${userAddress}`);
      console.log(`Amount (Original): ${amount}`);
      console.log(`Hash: ${hash}`);
      console.log(`Height: ${height}`);
      console.log(`Block Time: ${blockTime}`);
      console.log(`Derivation Path: ${derivationPath}`);

      // 打印十六进制值
      console.log(`Contract Address Hex: ${contractAddressHex}`);
      console.log(`Crypto Address Hex: ${cryptoAddressHex}`);
      console.log(`User Address Hex: ${userAddressHex}`);
      console.log(`Amount Hex: ${amountHex}`);
      console.log(`Hash Hex: ${hashHex}`);
      console.log(`Height Hex: ${heightHex}`);
      console.log(`Block Time Hex: ${blockTimeHex}`);
      console.log(`Derivation Path Hex: ${derivationPathHex}`);

      // 计算并打印各部分长度
      const contractAddressLength = contractAddress.length;
      const cryptoAddressLength = crypto.address.length;
      const userAddressLength = userAddress.length;
      const amountLength = amountHex.length / 2; // ASCII 十六进制表示的长度
      const hashLength = hashHex.length / 2;
      const heightLength = heightHex.length / 2;
      const blockTimeLength = blockTimeHex.length / 2;

      console.log(`Contract Address Length: ${contractAddressLength}`);
      console.log(`Crypto Address Length: ${cryptoAddressLength}`);
      console.log(`User Address Length: ${userAddressLength}`);
      console.log(`Amount Length: ${amountLength}`);
      console.log(`Hash Length: ${hashLength}`);
      console.log(`Height Length: ${heightLength}`);
      console.log(`Block Time Length: ${blockTimeLength}`);
      console.log(`Derivation Path Length: ${derivationPathLength}`);

      // 计算总数据长度
      const totalDataLength =
        1 + // 头字节
        1 + // contractAddress 长度
        contractAddressHex.length / 2 +
        1 + // cryptoAddress 长度
        cryptoAddressHex.length / 2 +
        1 + // userAddress 长度
        userAddressHex.length / 2 +
        1 + // amountHex 长度
        amountHex.length / 2 +
        1 + // hashHex 长度
        hashHex.length / 2 +
        1 + // heightHex 长度
        heightHex.length / 2 +
        1 + // blockTimeHex 长度
        blockTimeHex.length / 2 +
        1 + // derivationPath 长度
        derivationPathLength;

      console.log(`Total Data Length: ${totalDataLength}`);

      // 构建命令数据
      const commandData = new Uint8Array([
        0xf8, // 头字节
        contractAddressHex.length / 2,
        ...Buffer.from(contractAddressHex, "hex"),
        cryptoAddressHex.length / 2,
        ...Buffer.from(cryptoAddressHex, "hex"),
        userAddressHex.length / 2,
        ...Buffer.from(userAddressHex, "hex"),
        amountHex.length / 2,
        ...Buffer.from(amountHex, "hex"),
        hashHex.length / 2,
        ...Buffer.from(hashHex, "hex"),
        heightHex.length / 2,
        ...Buffer.from(heightHex, "hex"),
        blockTimeHex.length / 2,
        ...Buffer.from(blockTimeHex, "hex"),
        derivationPathLength,
        ...Buffer.from(derivationPathHex, "hex"),
        totalDataLength, // 总长度
      ]);

      // 打印命令数据
      console.log(
        `Command Data (bytes): ${Array.from(commandData)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")}`
      );

      // 计算CRC并添加到命令末尾
      const crc = crc16Modbus(commandData);
      const crcHighByte = (crc >> 8) & 0xff;
      const crcLowByte = crc & 0xff;

      const finalCommand = Buffer.concat([
        commandData,
        Buffer.from([crcLowByte, crcHighByte, 0x0d, 0x0a]),
      ]);

      console.log(
        `签名交易命令: ${finalCommand
          .toString("hex")
          .match(/.{1,2}/g)
          .join(" ")}`
      );
      // 提示用户在 LIKKIM 设备上确认交易签名
      setConfirmModalVisible(false);
      setConfirmingTransactionModalVisible(true);
      // 分割命令到多个小包
      const chunkSize = 20; // 20 字节是常见的 BLE 数据包大小限制
      for (let i = 0; i < finalCommand.length; i += chunkSize) {
        const chunk = finalCommand.slice(i, i + chunkSize);
        const base64Chunk = base64.fromByteArray(chunk);

        console.log(`Sending chunk (base64): ${base64Chunk}`);

        // 逐个发送每个包
        await device.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Chunk
        );

        // 让设备有时间处理每个包
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      // 监听交易反馈
      monitorTransactionResponse(device);
      console.log("签名交易命令已成功发送到设备");
    } catch (error) {
      console.error("发送交易数据到 BLE 设备时出错:", error);

      // 检查是否设备断开连接或其他问题
      if (error.message.includes("is not connected")) {
        console.error("设备可能已断开连接，或未正确连接。");
      }
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
  // 提交验证码
  const handlePinSubmit = async () => {
    // 首先关闭 "Enter PIN to Connect" 的模态框
    setPinModalVisible(false);

    // 关闭所有其他可能打开的模态框
    setVerificationSuccessModalVisible(false);
    setVerificationFailModalVisible(false);

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
      setVerificationSuccessModalVisible(true);

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

      setVerificationFailModalVisible(true); // 显示失败提示
    }

    // 清空 PIN 输入框
    setPinCode("");
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
        console.error("Error loading verified devices: ", error);
      }
    };

    loadVerifiedDevices();
  }, []); // 这个依赖空数组确保该代码只在组件挂载时执行一次
  // 打印设备数量
  /*   useEffect(() => {
    console.log(
      "Transaction Page Verified Devices Count:",
      verifiedDevices.length
    );
  }, [verifiedDevices]); */

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
        console.error("Error loading addedCryptos: ", error);
      }
    };
    loadAddedCryptos();
  }, []);

  const handleReceivePress = () => {
    setOperationType("receive");
    setModalVisible(true);
  };

  const handleSendPress = () => {
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
    setQueryChainShortName(crypto.queryChainShortName);
    setIsVerifyingAddress(false);
    setModalVisible(false);

    if (operationType === "receive") {
      // 直接启动地址模态框，不检查设备 ID
      setAddressModalVisible(true);
    } else if (operationType === "send") {
      // 检查 verifiedDevices 是否包含有效设备
      if (verifiedDevices.length > 0) {
        console.log("Transation Verified Device ID:", verifiedDevices[0]);
        const device = devices.find((d) => d.id === verifiedDevices[0]);
        if (device) {
          setAddressModalVisible(false);
          setInputAddress("");
          setInputAddressModalVisible(true);
        } else {
          setBleVisible(true); // 设备不正确时显示蓝牙模态框
          setModalVisible(false); // 关闭当前的模态框
        }
      } else {
        setBleVisible(true); // 没有已验证设备时显示蓝牙模态框
        setModalVisible(false); // 关闭当前的模态框
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
          <TouchableOpacity
            style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 均等宽度
            onPress={handleSwapPress}
          >
            <Icon name="swap-horiz" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Swap")}
            </Text>
          </TouchableOpacity>
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
          visible={amountModalVisible} // 控制模态框是否可见
          onRequestClose={() => setAmountModalVisible(false)} // 关闭模态框的回调函数
          TransactionsScreenStyle={TransactionsScreenStyle} // 样式对象
          t={t} // 翻译函数，用于国际化
          isDarkMode={isDarkMode} // 暗黑模式状态
          amount={amount} // 当前输入的金额
          setAmount={setAmount} // 更新金额的回调函数
          balance={balance} // 用户的加密货币余额
          fee={fee} // 交易费用
          valueUsd={valueUsd} // 输入金额对应的美元价值
          isAmountValid={isAmountValid} // 检查输入金额是否有效的状态
          buttonBackgroundColor={buttonBackgroundColor} // 按钮背景色
          disabledButtonBackgroundColor={disabledButtonBackgroundColor} // 禁用按钮时的背景色
          handleNextAfterAmount={handleNextAfterAmount} // 处理用户点击"Next"后的逻辑
          selectedCrypto={selectedCrypto} // 当前选择的加密货币
          selectedCryptoIcon={selectedCryptoIcon} // 当前加密货币的图标
          selectedCryptoChain={selectedCryptoChain} // 传递当前加密货币的链名称
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
                contentContainerStyle={{ paddingHorizontal: 16 }}
              >
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>{t("Amount")}:</Text>
                  {` ${amount} ${selectedCrypto}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Payment Address")}:
                  </Text>
                  {` ${paymentAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Recipient Address")}:
                  </Text>
                  {` ${inputAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Detected Network")}:
                  </Text>
                  {` ${detectedNetwork}`}
                </Text>
                <Text style={TransactionsScreenStyle.transactionText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Transaction Fee")}:
                  </Text>
                  {` ${transactionFee} ${selectedCrypto}`}
                </Text>
              </ScrollView>

              <View style={{ marginTop: 20, width: "100%" }}>
                {/* 确认交易按钮 */}
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={async () => {
                    try {
                      const response = await fetch(
                        "https://bt.likkim.com/meridian/address/queryBlockList",
                        {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ chainShortName: "TRON" }),
                        }
                      );
                      const data = await response.json();

                      if (data.code === "0" && Array.isArray(data.data)) {
                        const block = data.data[0].blockList[0];
                        const { hash, height, blockTime } = block;

                        // 执行签名
                        await signTransaction(
                          verifiedDevices,
                          hash,
                          height,
                          blockTime,
                          amount,
                          inputAddress
                        );
                      }

                      setConfirmModalVisible(false);
                    } catch (error) {
                      console.error("确认交易时出错:", error);
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
          verifiedDevices={verifiedDevices} // 已验证的设备列表
          MyColdWalletScreenStyle={TransactionsScreenStyle} // 样式
          t={t} // 国际化函数
          onDisconnectPress={handleDisconnectDevice} // 断开连接处理函数
        />

        {/* PIN码输入modal窗口 */}
        <PinModal
          visible={pinModalVisible}
          pinCode={pinCode}
          setPinCode={setPinCode}
          onSubmit={handlePinSubmit}
          onCancel={() => setPinModalVisible(false)}
          styles={TransactionsScreenStyle}
          isDarkMode={isDarkMode}
          t={t}
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

        {/* Confirming Transaction Modal */}
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
