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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import { useTranslation } from "react-i18next";
import { CryptoContext, DarkModeContext } from "./CryptoContext";
import TransactionsScreenStyles from "../styles/TransactionsScreenStyle";
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import successImage from "../assets/success.png";
import failImage from "../assets/fail.png";
import Constants from "expo-constants";
import base64 from "base64-js";
import { Buffer } from "buffer";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
const serviceUUID = "0000FFE0-0000-1000-8000-00805F9B34FB";
const writeCharacteristicUUID = "0000FFE2-0000-1000-8000-00805F9B34FB";

function TransactionsScreen() {
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const { t } = useTranslation();
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
  } = useContext(CryptoContext);

  const TransactionsScreenStyle = TransactionsScreenStyles(isDarkMode);
  const addressIcon = isDarkMode ? "#ffffff" : "#676776";
  const [modalVisible, setModalVisible] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);
  const [operationType, setOperationType] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [selectedCryptoChain, setSelectedCryptoChain] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedCryptoIcon, setSelectedCryptoIcon] = useState(null);
  const iconColor = isDarkMode ? "#ffffff" : "#24234C";
  const darkColors = ["#24234C", "#101021"];
  const lightColors = ["#FFFFFF", "#EDEBEF"];
  const placeholderColor = isDarkMode ? "#ffffff" : "#24234C";
  const [amount, setAmount] = useState("");
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc"; // 根据 isDarkMode 设置不同的灰色
  const [inputAddress, setInputAddress] = useState("");
  const [amountModalVisible, setAmountModalVisible] = useState(false); // 新增状态
  const [confirmModalVisible, setConfirmModalVisible] = useState(false); // 新增交易确认modal状态
  const [transactionFee, setTransactionFee] = useState("0.001"); // 示例交易手续费
  const [transactionHistory, setTransactionHistory] = useState([]);
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
  const [verificationFailModalVisible, setVerificationFailModalVisible] =
    useState(false);
  const [inputAddressModalVisible, setInputAddressModalVisible] =
    useState(false);
  const [detectedNetwork, setDetectedNetwork] = useState("");
  const bleManagerRef = useRef(null);
  const [paymentAddress, setPaymentAddress] = useState("Your Payment Address");

  // 扫描蓝牙设备的函数
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
            console.log("Scanned device:", device);
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
  // 当蓝牙模态框打开时，开始扫描设备
  useEffect(() => {
    if (bleVisible) {
      scanDevices();
    }
  }, [bleVisible]);

  // 清理蓝牙管理器
  useEffect(() => {
    return () => {
      bleManagerRef.current.destroy();
    };
  }, []);

  const monitorVerificationCode = (device) => {
    const notifyCharacteristicUUID = "0000FFE1-0000-1000-8000-00805F9B34FB";

    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      (error, characteristic) => {
        if (error) {
          console.error("监听验证码时出错:", error.message);
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
  // 显示地址函数
  const showAddressCommand = async (device) => {
    try {
      // 检查 device 是否为一个有效的设备对象
      if (typeof device !== "object" || !device.isConnected) {
        console.error("无效的设备对象：", device);
        return;
      }

      console.log("发送显示地址命令之前的设备对象:", device);

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

      // 总长度（包括命令标识符、TRX 长度、TRX 数据、路径长度、路径数据）
      const totalLength = 1 + 1 + coinTypeLength + 1 + derivationPathLength;

      console.log(`Total Length: ${totalLength}`);

      // 构建命令数据
      const commandData = new Uint8Array([
        0xf9, // 命令标识符
        coinTypeLength, // TRX 的长度
        ...Buffer.from(coinTypeHex, "hex"), // TRX 的16进制表示
        derivationPathLength, // 路径的长度
        ...Buffer.from(derivationPathHex, "hex"), // 路径的16进制表示
        totalLength, // 总长度，包括命令、TRX和路径
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
        `最终命令: ${Array.from(finalCommand)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join(" ")}`
      );

      // 发送显示地址命令
      await device.writeCharacteristicWithResponseForService(
        serviceUUID, // BLE服务的UUID
        writeCharacteristicUUID, // 可写特性的UUID
        base64Command // 最终的命令数据的Base64编码
      );
      console.log("显示地址命令已发送");

      // 提示用户在 LIKKIM 设备上核对地址
      alert("Please verify the address on your LIKKIM device.");
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
        console.error("crypto:", crypto);
        console.error("userAddress:", userAddress);
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

      const contractAddressHex = Buffer.from(contractAddress, "utf-8").toString(
        "hex"
      );
      const cryptoAddressHex = Buffer.from(crypto.address, "utf-8").toString(
        "hex"
      );
      const userAddressHex = Buffer.from(userAddress, "utf-8").toString("hex");
      const amountHex = Buffer.from(amount.toString(), "utf-8").toString("hex");
      const hashHex = Buffer.from(hash, "utf-8").toString("hex");
      const heightHex = parseInt(height, 10).toString(16).padStart(8, "0");
      const blockTimeHex = parseInt(blockTime, 10)
        .toString(16)
        .padStart(16, "0");
      const derivationPathHex = Buffer.from(derivationPath, "utf-8").toString(
        "hex"
      );
      const derivationPathLength = derivationPathHex.length / 2;

      // 打印原始值
      console.log(`Contract Address: ${contractAddress}`);
      console.log(`Crypto Address: ${crypto.address}`);
      console.log(`User Address: ${userAddress}`);
      console.log(`Amount: ${amount}`);
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
      const amountLength = amountHex.length / 2;
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
        1 +
        contractAddressHex.length / 2 +
        1 +
        cryptoAddressHex.length / 2 +
        1 +
        userAddressHex.length / 2 +
        1 +
        amountHex.length / 2 +
        hashHex.length / 2 +
        heightHex.length / 2 +
        blockTimeHex.length / 2 +
        1 +
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
        ...Buffer.from(heightHex, "hex"),
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
        `Final Command (hex): ${finalCommand
          .toString("hex")
          .match(/.{1,2}/g)
          .join(" ")}`
      );

      // 发送命令
      const base64Command = base64.fromByteArray(finalCommand);
      console.log(`Base64 Command: ${base64Command}`);

      await device.writeCharacteristicWithResponseForService(
        serviceUUID,
        writeCharacteristicUUID,
        base64Command
      );

      console.log("签名交易命令已成功发送到设备:", base64Command);
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
        showAddressCommand(device); // 确保这里传递的是完整的设备对象
      } else {
        setAddressModalVisible(false); // 关闭当前的 "Address for" 模态框
        setBleVisible(true);
      }
    } else {
      setAddressModalVisible(false); // 关闭当前的 "Address for" 模态框
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
          }, 1000); // 1秒延迟
        }
      }, true);

      return () => {
        subscription.remove();
        bleManagerRef.current.destroy();
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
    setModalVisible(true);
  };
  const selectCrypto = async (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedCryptoChain(crypto.chain);
    setSelectedAddress(crypto.address);
    setSelectedCryptoIcon(crypto.icon);
    setModalVisible(false);

    if (operationType === "receive") {
      // 直接启动地址模态框，不检查设备 ID
      setAddressModalVisible(true);
    } else if (operationType === "send") {
      // 检查 verifiedDevices 是否包含有效设备
      if (verifiedDevices.length > 0) {
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

  const detectNetwork = (address) => {
    if (/^(1|3|bc1)/.test(address)) {
      return "Bitcoin (BTC)";
    } else if (/^0x/.test(address)) {
      return "Ethereum (ETH) / Binance Smart Chain (BSC) / Chainlink (LINK) / VeChain (VET) / Arbitrum (ARB) / Polygon (MATIC)";
    } else if (/^T/.test(address)) {
      return "Tron (TRX)";
    } else if (/^r/.test(address)) {
      return "Ripple (XRP)";
    } else if (/^(A|D)/.test(address)) {
      return "Cardano (ADA)";
    } else if (/^(1|3|k)/.test(address)) {
      return "Polkadot (DOT)";
    } else if (/^(L|M|ltc1)/.test(address)) {
      return "Litecoin (LTC)";
    } else if (/^G/.test(address)) {
      return "Stellar (XLM)";
    } else if (/^(q|p|bitcoincash:)/.test(address)) {
      return "Bitcoin Cash (BCH)";
    } else if (/^(D|A)/.test(address)) {
      return "Dogecoin (DOGE)";
    } else if (/^tz[1-3]/.test(address)) {
      return "Tezos (XTZ)";
    } else if (/^[a-zA-Z0-9]{12}$/.test(address)) {
      return "EOS (EOS)";
    } else if (/^(4|8)/.test(address)) {
      return "Monero (XMR)";
    } else if (/^X/.test(address)) {
      return "Dash (DASH)";
    } else if (/^(t1|t3|zs)/.test(address)) {
      return "Zcash (ZEC)";
    } else if (/^A/.test(address)) {
      return "NEO (NEO)";
    } else if (address.length === 90) {
      return "IOTA (MIOTA)";
    } else if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
      return "Solana (SOL)";
    } else {
      return "Unknown Network";
    }
  };

  const handleAddressChange = (text) => {
    setInputAddress(text);
    const network = detectNetwork(text);
    setDetectedNetwork(network);
    setIsAddressValid(network !== "Unknown Network"); // Update address validity
  };

  return (
    <LinearGradient
      colors={isDarkMode ? darkColors : lightColors}
      style={TransactionsScreenStyle.bgContainer}
    >
      <View className="w-[100%]" style={TransactionsScreenStyle.container}>
        <View
          style={{
            width: 360,
            height: 170,
            flexDirection: "row",

            gap: 20,
          }}
        >
          <TouchableOpacity
            style={TransactionsScreenStyle.roundButton}
            onPress={handleSendPress}
          >
            <Feather name="send" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Send")}
            </Text>
            <Text style={TransactionsScreenStyle.mainSubButtonText}>
              {t("Send crypto to another wallet")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={TransactionsScreenStyle.roundButton}
            onPress={handleReceivePress}
          >
            <Icon name="vertical-align-bottom" size={24} color={iconColor} />
            <Text style={TransactionsScreenStyle.mainButtonText}>
              {t("Receive")}
            </Text>
            <Text style={TransactionsScreenStyle.mainSubButtonText}>
              {t("Receive crypto from another wallet")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={TransactionsScreenStyle.historyContainer}>
          <Text style={TransactionsScreenStyle.historyTitle}>
            {t("Transaction History")}
          </Text>
          {transactionHistory.length === 0 ? (
            <Text style={TransactionsScreenStyle.noHistoryText}>
              {t("No Histories")}
            </Text>
          ) : (
            transactionHistory.map((transaction, index) => (
              <View key={index} style={TransactionsScreenStyle.historyItem}>
                <Text style={TransactionsScreenStyle.historyItemText}>
                  {transaction.detail}
                </Text>
              </View>
            ))
          )}
        </View>

        {/* 输入地址的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={inputAddressModalVisible}
          onRequestClose={() => setInputAddressModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={TransactionsScreenStyle.centeredView}
          >
            {/* BlurView as the background */}
            <BlurView
              intensity={10}
              style={TransactionsScreenStyle.blurBackground}
            />

            {/* Card container on top */}
            <View style={TransactionsScreenStyle.cardContainer}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                {selectedCryptoIcon && (
                  <Image
                    source={selectedCryptoIcon}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalTitle}>
                  {selectedCrypto} ({selectedCryptoChain})
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Enter the recipient's address:")}
              </Text>
              <View style={{ width: "100%" }}>
                <TextInput
                  style={[
                    TransactionsScreenStyle.input,
                    { color: isDarkMode ? "#ffffff" : "#000" },
                  ]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
                  onChangeText={handleAddressChange}
                  value={inputAddress}
                  autoFocus={true}
                />
                <Text
                  style={{
                    color:
                      detectedNetwork === "Unknown Network"
                        ? "#FF5252"
                        : "#22AA94",
                    minHeight: 36,
                    lineHeight: 36, // 设置与 minHeight 相同的 lineHeight 以实现垂直居中
                    textAlignVertical: "center", // 适用于 Android 的文本垂直居中
                  }}
                >
                  {inputAddress
                    ? detectedNetwork === "Unknown Network"
                      ? t("Invalid address")
                      : `${t("Detected Network")}: ${detectedNetwork}`
                    : ""}
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  TransactionsScreenStyle.optionButton,
                  {
                    backgroundColor: isAddressValid
                      ? buttonBackgroundColor
                      : disabledButtonBackgroundColor, // 动态设置按钮颜色
                  },
                ]}
                onPress={handleNextAfterAddress}
                disabled={!isAddressValid}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Next")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButton}
                onPress={() => setInputAddressModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* 输入金额的 Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={amountModalVisible}
          onRequestClose={() => setAmountModalVisible(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={TransactionsScreenStyle.centeredView}
          >
            <BlurView
              intensity={10}
              style={TransactionsScreenStyle.blurBackground}
            />
            <View style={TransactionsScreenStyle.amountModalView}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                {selectedCryptoIcon && (
                  <Image
                    source={selectedCryptoIcon}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalTitle}>
                  {selectedCrypto} ({selectedCryptoChain})
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Enter the amount to send:")}
              </Text>
              <View style={{ width: "100%" }}>
                <TextInput
                  style={[
                    TransactionsScreenStyle.amountInput,
                    {
                      color: isDarkMode ? "#ffffff" : "#000000", // 字体颜色
                      backgroundColor: "transparent", // 去掉背景颜色
                      fontSize: 30, // 设置大字号
                      textAlign: "center", // 输入的文本居中
                      fontWeight: "bold", // 设置粗体字
                    },
                  ]}
                  placeholder={t("Enter Amount")}
                  placeholderTextColor={isDarkMode ? "#808080" : "#cccccc"}
                  keyboardType="numeric"
                  onChangeText={(text) => setAmount(text)} // 保持输入框不为空，若为空则设为 "0"
                  value={amount}
                  autoFocus={true}
                  caretHidden={true} // 隐藏光标
                />
              </View>
              <View
                style={{
                  flexDirection: "column", // 使用 column 代替 col
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <TouchableOpacity
                  style={TransactionsScreenStyle.optionButton}
                  onPress={handleNextAfterAmount}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Next")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => {
                    setAmountModalVisible(false);
                    setInputAddressModalVisible(true);
                  }}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Back")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>

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

              <View
                style={{
                  width: 280,
                  height: 220, // 将高度增加以容纳新字段
                  justifyContent: "space-between",
                }}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>{t("Amount")}:</Text>
                  {` ${amount} ${selectedCrypto}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Payment Address")}:
                  </Text>
                  {` ${paymentAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Recipient Address")}:
                  </Text>
                  {` ${inputAddress}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Detected Network")}:
                  </Text>
                  {` ${detectedNetwork}`}
                </Text>
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  <Text style={{ fontWeight: "bold" }}>
                    {t("Transaction Fee")}:
                  </Text>
                  {` ${transactionFee} ${selectedCrypto}`}
                </Text>
              </View>

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
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.modalView}>
              <Text style={TransactionsScreenStyle.TransactionModalTitle}>
                {operationType === "send"
                  ? t("Choose the cryptocurrency to send:")
                  : t("Choose the cryptocurrency to receive:")}
              </Text>
              {addedCryptos.length === 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 300,
                  }}
                >
                  <Text style={TransactionsScreenStyle.modalText}>
                    {t(
                      "No cryptocurrencies available. Please add wallet first."
                    )}
                  </Text>
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{ alignItems: "center" }}
                  style={{ maxHeight: 400, width: 280 }}
                >
                  {addedCryptos.map((crypto) => (
                    <TouchableOpacity
                      key={crypto.shortName}
                      style={TransactionsScreenStyle.optionButton}
                      onPress={() => selectCrypto(crypto)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {crypto.icon && (
                          <Image
                            source={crypto.icon}
                            style={{ width: 24, height: 24, marginRight: 8 }}
                          />
                        )}
                        <Text style={TransactionsScreenStyle.optionButtonText}>
                          {crypto.shortName} ({crypto.chain})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButtonReceive}
                onPress={() => setModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* 显示选择的加密货币地址的模态窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={addressModalVisible}
          onRequestClose={() => setAddressModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.receiveModalView}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={TransactionsScreenStyle.modalReceiveTitle}>
                  {t("Address for")}
                </Text>
                {selectedCryptoIcon && (
                  <Image
                    source={selectedCryptoIcon}
                    style={{
                      width: 24,
                      height: 24,
                      marginLeft: 5,
                      marginRight: 5,
                    }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalReceiveTitle}>
                  {selectedCrypto}:
                </Text>
              </View>
              <Text style={TransactionsScreenStyle.subtitleText}>
                {t("Assets can only be sent within the same chain.")}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={TransactionsScreenStyle.addressText}>
                  {selectedAddress}
                </Text>
                <TouchableOpacity
                  onPress={() => copyToClipboard(selectedAddress)}
                >
                  <Icon name="content-copy" size={24} color={addressIcon} />
                </TouchableOpacity>
              </View>
              <View
                style={{
                  backgroundColor: "#fff",
                  height: 220,
                  width: 220,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                }}
              >
                <QRCode value={selectedAddress} size={200} />
              </View>
              <View
                style={{
                  flexDirection: "col",
                  width: "100%",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <TouchableOpacity
                  onPress={handleVerifyAddress}
                  style={TransactionsScreenStyle.optionButton}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Verify Address")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => setAddressModalVisible(false)}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* Bluetooth modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={bleVisible} // Use bleVisible to control this modal
          onRequestClose={() => {
            setBleVisible(!bleVisible); // Toggle visibility
          }}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.bluetoothModalView}>
              <Text style={TransactionsScreenStyle.bluetoothModalTitle}>
                {t("LOOKING FOR DEVICES")}
              </Text>
              {isScanning ? (
                <View style={{ alignItems: "center" }}>
                  <Image
                    source={require("../assets/Bluetooth.gif")}
                    style={TransactionsScreenStyle.bluetoothImg}
                  />
                  <Text style={TransactionsScreenStyle.scanModalSubtitle}>
                    {t("Scanning...")}
                  </Text>
                </View>
              ) : (
                devices.length > 0 && (
                  <FlatList
                    data={devices}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => {
                      const isVerified = verifiedDevices.includes(item.id);

                      return (
                        <TouchableOpacity
                          onPress={() => {
                            if (!isVerified) {
                              handleDevicePress(item); // 确保这里传递的是完整的设备对象
                            }
                          }}
                        >
                          <View
                            style={TransactionsScreenStyle.deviceItemContainer}
                          >
                            <Icon
                              name={
                                isVerified ? "mobile-friendly" : "smartphone"
                              }
                              size={24}
                              color={isVerified ? "#3CDA84" : iconColor}
                              style={TransactionsScreenStyle.deviceIcon}
                            />
                            <Text
                              style={TransactionsScreenStyle.scanModalSubtitle}
                            >
                              {item.name || item.id}
                            </Text>
                            {isVerified && (
                              <TouchableOpacity
                                style={TransactionsScreenStyle.disconnectButton}
                                onPress={() => handleDisconnectDevice(item)}
                              >
                                <Text
                                  style={
                                    TransactionsScreenStyle.disconnectButtonText
                                  }
                                >
                                  {t("Disconnect")}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                  />
                )
              )}
              {!isScanning && devices.length === 0 && (
                <Text style={TransactionsScreenStyle.modalSubtitle}>
                  {t(
                    "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                  )}
                </Text>
              )}
              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButtonLookingFor}
                onPress={() => {
                  setBleVisible(false); // Close Bluetooth modal
                  setSelectedDevice(null); // Reset selected device state
                }}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* PIN码输入modal窗口 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={pinModalVisible}
          onRequestClose={() => setPinModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pinModalView}>
              <View style={{ alignItems: "center" }}>
                <Text style={TransactionsScreenStyle.pinModalTitle}>
                  {t("Enter PIN to Connect")}
                </Text>
                <Text style={TransactionsScreenStyle.modalSubtitle}>
                  {t(
                    "Use the PIN code to establish a secure connection with your LIKKIM hardware."
                  )}
                </Text>
              </View>
              <TextInput
                style={TransactionsScreenStyle.passwordInput}
                placeholder={t("Enter PIN")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                keyboardType="numeric"
                secureTextEntry
                onChangeText={setPinCode}
                value={pinCode}
                autoFocus={true}
              />
              <View style={{ width: "100%" }}>
                <TouchableOpacity
                  style={TransactionsScreenStyle.submitButton}
                  onPress={() => handlePinSubmit(selectedDevice, pinCode)}
                >
                  <Text style={TransactionsScreenStyle.submitButtonText}>
                    {t("Submit")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={TransactionsScreenStyle.cancelButton}
                  onPress={() => setPinModalVisible(false)}
                >
                  <Text style={TransactionsScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>

        {/* 成功验证模态框 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={verificationSuccessModalVisible}
          onRequestClose={() => setVerificationSuccessModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pinModalView}>
              <Image
                source={successImage}
                style={{ width: 60, height: 60, marginTop: 20 }}
              />
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Verification successful!")}
              </Text>
              <Text style={TransactionsScreenStyle.modalSubtitle}>
                {t("You can now safely use the device.")}
              </Text>
              <TouchableOpacity
                style={TransactionsScreenStyle.submitButton}
                onPress={() => setVerificationSuccessModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>

        {/* 失败验证模态框 */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={verificationFailModalVisible}
          onRequestClose={() => setVerificationFailModalVisible(false)}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View style={TransactionsScreenStyle.pinModalView}>
              <Image
                source={failImage}
                style={{ width: 60, height: 60, marginTop: 20 }}
              />
              <Text style={TransactionsScreenStyle.modalTitle}>
                {t("Verification failed!")}
              </Text>
              <Text style={TransactionsScreenStyle.modalSubtitle}>
                {t(
                  "The verification code you entered is incorrect. Please try again."
                )}
              </Text>
              <TouchableOpacity
                style={TransactionsScreenStyle.submitButton}
                onPress={() => setVerificationFailModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default TransactionsScreen;
