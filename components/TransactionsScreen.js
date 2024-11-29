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
import "react-native-get-random-values";
import "@ethersproject/shims";
// 导入 ethers 库
import { ethers, Transaction } from "ethers";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
const serviceUUID = "6E400001-B5A3-F393-E0A9-E50E24DCCA9E";
const writeCharacteristicUUID = "6E400002-B5A3-F393-E0A9-E50E24DCCA9E";
const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

function TransactionsScreen() {
  /**
   * Test Start by RF
   */
  /*   const testSign = () => {
    console.log("test start");
    const toDecimalString = (num) => num.toString(10);

    // 写死的交易数据
    const amount = 0.1; // 转账金额，单位 ETH
    const paymentAddress = "0x63a9975ba31b0b9626b34300f3c8e0634a7a3f26"; // 收款地址
    const inputAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // 转账地址
    const selectedCrypto = "ETH"; // 选择的加密货币（这里只考虑 ETH）
    // 签名函数
    try {
      if (selectedCrypto === "ETH") {
        // 构建 ETH 交易的 JSON 数据
        const transactionData = {
          nonce: toDecimalString(1), // 假设 nonce 是 1，实际情况下需要从 provider 获取
          gasPrice: ethers.parseUnits("20", "gwei"), // gas 价格
          gasLimit: toDecimalString(10000), // gas 限制
          to: paymentAddress, // 目标地址
          value: ethers.parseEther(amount.toString()), // 转账金额（单位是 ETH）
          data: `0xa9059cbb000000000000000000000000${inputAddress.slice(
            2
          )}0000000000000000000000000000000000000000000000000000000000000000`, // transfer 函数的编码数据
        };

        // 使用 ethers.js v6 序列化交易
        const unsignedTx = Transaction.from(transactionData).unsignedSerialized;

        console.log("待签名的命令 raw :" + unsignedTx);
        // 转换为 Base64 编码
        const commandString = Buffer.from(unsignedTx, "utf-8").toString(
          "base64"
        );

        console.warn("待签名的命令 base64 :", commandString);
      } else {
        // 对于其他币种，仍然使用之前的方式构建命令
        const commandString = `1|${toDecimalString(
          amount
        )}|${paymentAddress}|${inputAddress}|${selectedCrypto}`;
        console.warn("命令:", commandString);
      }
    } catch (error) {
      console.warn("生成待签名数据失败:", error);
    }
  };

  useEffect(() => {
    testSign();
  }, []);
 */
  /**
   * Test End
   */

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
  const iconColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const darkColors = ["#21201E", "#0E0D0D"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const placeholderColor = isDarkMode ? "#ffffff" : "#21201E";
  const [amount, setAmount] = useState("");
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc"; // 根据 isDarkMode 设置不同的灰色
  const [inputAddress, setInputAddress] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [chainShortName, setChainShortName] = useState(""); // 设置链的简称，例如 TRX
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
          console.log("Error:", error);
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

  const monitorVerificationCode = (device, sendDecryptedValue) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("监听设备响应时出错:", error.message);
          // return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("接收到的数据字符串:", receivedDataString);

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

        // 提取 PIN:XXXX,N 的验证码
        if (receivedDataString.startsWith("PIN:")) {
          const pin = receivedDataString.split(":")[1].split(",")[0]; // 提取 PIN 值
          setReceivedVerificationCode(pin); // 保存接收到的 PIN
          console.log("接收到的验证码:", pin);
        }
      }
    );
  };
  // 监听交易反馈函数  监听签名返回函数
  const monitorTransactionResponse = (device) => {
    const notifyCharacteristicUUID = "6E400003-B5A3-F393-E0A9-E50E24DCCA9E";

    // 用于存储拼接的完整数据
    let dataBuffer = "";
    console.log("签名反馈监听器启动成功");
    transactionMonitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("监听交易反馈时出错:", error.message);
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
                console.log("发送签名数据时出错:", error);
              }
            } else {
              console.log("CRC校验失败");
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
  // 显示地址函数
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
      /*       switch (coinType) {
        case "BTC":
          commandString = `address:bitcoin,m/49'/0'/0'/0/0`; // Bitcoin
          break;
        case "ETH":
          commandString = `address:ethereum,m/44'/60'/0'/0/0`; // Ethereum
          break;
        case "TRX":
          commandString = `address:tron,m/44'/195'/0'/0/0`; // Tron
          break;
        case "BCH":
          commandString = `address:bitcoin_cash,m/44'/145'/0'/0/0`; // Bitcoin Cash
          break;
        case "BNB":
          commandString = `address:binance,m/44'/60'/0'/0/0`; // BNB
          break;
        case "OP":
          commandString = `address:optimism,m/44'/60'/0'/0/0`; // Optimism
          break;
        case "ETC":
          commandString = `address:ethereum_classic,m/44'/60'/0'/0/0`; // Ethereum Classic
          break;
        case "LTC":
          commandString = `address:litecoin,m/49'/2'/0'/0/0`; // Litecoin
          break;
        case "XRP":
          commandString = `address:ripple,m/44'/144'/0'/0/0`; // Ripple
          break;
        case "SOL":
          commandString = `address:solana,m/44'/501'/0'/0/0`; // Solana
          break;
        case "ARB":
          commandString = `address:arbitrum,m/44'/60'/0'/0/0`; // Arbitrum
          break;
        case "AURORA":
          commandString = `address:aurora,m/44'/60'/0'/0/0`; // Aurora
          break;
        case "AVAX":
          commandString = `address:avalanche,m/44'/60'/0'/0/0`; // Avalanche
          break;
        case "CELO":
          commandString = `address:celo,m/44'/60'/0'/0/0`; // Celo
          break;
        case "FTM":
          commandString = `address:fantom,m/44'/60'/0'/0/0`; // Fantom
          break;
        case "HTX":
          commandString = `address:huobi,m/44'/60'/0'/0/0`; // Huobi ECO Chain
          break;
        case "IOTX":
          commandString = `address:iotex,m/44'/60'/0'/0/0`; // IoTeX
          break;
        case "OKB":
          commandString = `address:okx,m/44'/60'/0'/0/0`; // OKX Chain
          break;
        case "POL":
          commandString = `address:polygon,m/44'/60'/0'/0/0`; // Polygon
          break;
        case "ZKSYNC":
          commandString = `address:zksync,m/44'/60'/0'/0/0`; // zkSync Era
          break;
        case "APT":
          commandString = `address:aptos,m/44'/637'/0'/0'/0`; // Aptos
          break;
        case "SUI":
          commandString = `address:sui,m/44'/784'/0'/0'/0`; // SUI
          break;
        case "COSMOS":
          commandString = `address:cosmos,m/44'/118'/0'/0/0`; // Cosmos
          break;
        case "Celestia":
          commandString = `address:celestia,m/44'/118'/0'/0/0`; // Celestia
          break;
        case "Cronos":
          commandString = `address:cronos,m/44'/60'/0'/0/0`; // Cronos
          break;
        case "Juno":
          commandString = `address:juno,m/44'/118'/0'/0/0`; // Juno
          break;
        case "Osmosis":
          commandString = `address:osmosis,m/44'/118'/0'/0/0`; // Osmosis
          break;
        case "Gnosis":
          commandString = `address:gnosis,m/44'/60'/0'/0/0`; // Gnosis
          break;
        default:
          console.log("不支持的币种:", coinType);
          return;
      } */

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
        case "BNB":
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
        case "OKB":
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
            return;
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

  // 签名函数 11月29号 修改新增部分 for 如风
  const signTransaction = async (
    device,
    amount, // 如果不需要支付地址，可以移除这个参数
    inputAddress,
    selectedCrypto
  ) => {
    try {
      if (!device?.isConnected) return console.log("设备无效");

      await device.connect();
      await device.discoverAllServicesAndCharacteristics();

      // 打印 selectedCrypto 的值
      console.log("选择的币种:", selectedCrypto);

      let commandString = "";

      if (selectedCrypto === "ETH") {
        // 构建交易数据，nonce 固定为 1
        const transactionData = {
          nonce: 1, // 使用数字 1
          gasPrice: ethers.utils.parseUnits("20", "gwei").toString(), // gas 价格，单位是 wei
          gasLimit: "10000", // gas 限制，通常是一个固定值或者估算值
          to: inputAddress, // 目标地址
          value: ethers.utils.parseEther(amount.toString()).toString(), // 转账金额，单位是 ETH，转换为 wei
          data: "0x", // 附加数据
          chainId: 1, // 以太坊主网链 ID
        };

        // 使用 ethers.js 进行序列化
        const tx = new ethers.utils.Transaction(transactionData);
        const unsignedTx = tx.serialize(); // 序列化为十六进制字符串

        commandString = unsignedTx;
      } else {
        // 对于其他币种，仍然使用之前的方式构建命令
        commandString = `1|${toDecimalString(
          amount
        )}|${paymentAddress}|${inputAddress}|${selectedCrypto}`;
      }

      // 将命令数据发送到设备
      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        commandString
      );

      console.log("命令已发送:", commandString);
    } catch (error) {
      console.log("发送命令失败:", error);
    }
  };

  // 你也需要一个函数来序列化交易
  async function serializeTransaction(txData) {
    const tx = new ethers.utils.Transaction(txData);
    return ethers.utils.serializeTransaction(tx).substr(2); // 去掉前导的 '0x'
  }

  // 转换为 10 进制字符串的函数
  const toDecimalString = (value) => {
    if (typeof value === "number") {
      return value.toString(10); // 将数字转为10进制字符串
    } else if (typeof value === "string" && !isNaN(Number(value))) {
      return parseInt(value, 10).toString(10); // 将字符串数字解析为整数后再转为10进制字符串
    } else {
      throw new Error("Invalid value for decimal conversion");
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
      console.log("发送启动命令失败", error);
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

    // 检查 PIN 是否匹配
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
    } else {
      console.log("PIN 验证失败");

      // 停止监听验证码
      if (monitorSubscription) {
        try {
          monitorSubscription.remove();
          console.log("验证码监听已停止");
        } catch (error) {
          console.log("停止监听时发生错误:", error);
        }
      }

      // 主动断开与嵌入式设备的连接
      if (selectedDevice) {
        try {
          await selectedDevice.cancelConnection();
          console.log("已断开与设备的连接");
        } catch (error) {
          console.log("断开连接时发生错误:", error);
        }
      }

      setVerificationFailModalVisible(true); // 显示失败提示
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
          console.log(permissionItem + "权限未授予");
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
        console.log("Error loading addedCryptos: ", error);
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
    setChainShortName(crypto.chainShortName);
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
                  {paymentAddress}
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

                      // 传递 amount, paymentAddress, inputAddress, selectedCrypto 给签名函数
                      await signTransaction(
                        device,
                        amount, // 传递金额
                        inputAddress, // 收款地址
                        selectedCrypto // 币种
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
          verifiedDevices={verifiedDevices} // 已验证的设备列表
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
          onCancel={() => setPinModalVisible(false)} // 关闭 PIN 模态框
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
