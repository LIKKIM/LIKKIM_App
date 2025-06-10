// ./VaultScreen/SecureDeviceStatus.js
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  RefreshControl,
  TouchableHighlight,
  ImageBackground,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import AddressBookModal from "./../modal/AddressBookModal";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";
import { WebView } from "react-native-webview";
import { galleryAPI } from "../../env/apiEndpoints";
import ImageResizer from "react-native-image-resizer";

import { bluetoothConfig } from "../../env/bluetoothConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BleManager } from "react-native-ble-plx";
import * as FileSystem from "expo-file-system";
const bleManager = new BleManager();

const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;
const SkeletonImage = ({ source, style, resizeMode }) => {
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [verifiedDevices, setVerifiedDevices] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const skeletonOpacity = useState(new Animated.Value(1))[0];
  const imageOpacity = useState(new Animated.Value(0))[0];
  // 用于控制闪烁渐变的水平平移动画
  const shimmerTranslate = useState(new Animated.Value(-200))[0];
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
  }, []);

  // 当组件挂载且图片未加载时启动循环动画
  useEffect(() => {
    if (!loaded) {
      Animated.loop(
        Animated.timing(shimmerTranslate, {
          toValue: 200,
          duration: 1500, // 放慢动画速度
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loaded]);

  const handleLoad = () => {
    setLoaded(true);
    // 淡出骨架图动画
    Animated.timing(skeletonOpacity, {
      toValue: 0,
      duration: 500, // 放慢淡出动画
      useNativeDriver: true,
    }).start();
    // 图片淡入动画
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={style}>
      {/* 骨架图层 */}
      {!loaded && (
        <Animated.View
          style={[
            styles.skeletonWrapper,
            { opacity: skeletonOpacity, borderRadius: style.borderRadius || 0 },
          ]}
        >
          {/* 闪烁效果：利用 Animated.View 搭配 LinearGradient 实现从左到右的流动渐变 */}
          <Animated.View
            style={[
              styles.shimmer,
              { transform: [{ translateX: shimmerTranslate }] },
            ]}
          >
            <LinearGradient
              colors={[
                "#bbbbbb50",
                "#cccccc50",
                "#dddddd50",
                "#cccccc50",
                "#bbbbbb50",
              ]}
              locations={[0, 0.25, 0.5, 0.75, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[StyleSheet.absoluteFill]}
            />
          </Animated.View>
        </Animated.View>
      )}
      {/* gallery Image bugging */}
      {/*       <Animated.Image
        source={source}
        style={[
          {
            width: "100%",
            height: "100%",
            borderRadius: style.borderRadius || 0,
          },
          { opacity: imageOpacity },
        ]}
        resizeMode={resizeMode}
        onLoad={handleLoad}
      /> */}
      <Animated.View
        style={{
          opacity: imageOpacity,
          borderRadius: 8,
          overflow: "hidden",
          flex: 1,
        }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{
            html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>body,html{margin:0;padding:0;}</style>
        </head>
        <body>
          <img src="${source.uri}" style="
            width:100%;
            height:auto;
            object-fit:contain;
            display:block;
          "/>
        </body>
      </html>
    `,
          }}
          scrollEnabled={false}
          style={{ flex: 1 }}
          onLoadEnd={handleLoad}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  skeletonWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "#aaaaaa",
    overflow: "hidden",
  },
  shimmer: {
    width: "30%",
    height: "100%",
  },
});

const SecureDeviceStatus = (props) => {
  const [isAddressBookVisible, setAddressBookVisible] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [NFTmodalVisible, setNFTModalVisible] = useState(false); // 正确的命名
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [galleryRefreshing, setGalleryRefreshing] = useState(false);
  const styles = SecureDeviceScreenStyles(isDarkMode);
  const [dataUrl, setDataUrl] = useState(null);

  const handleSaveToDevice = async () => {
    console.log("Save to Cold Wallet clicked");

    if (selectedNFT?.logoUrl) {
      try {
        // 使用 fetch 获取图片数据
        const response = await fetch(selectedNFT.logoUrl);
        const imageBlob = await response.blob();

        // 生成 420x420 和 210x210 两种尺寸的 JPEG 图片
        const resizedImage420 = await ImageResizer.createResizedImage(
          URL.createObjectURL(imageBlob),
          420,
          420,
          "JPEG",
          80
        );
        const resizedImage210 = await ImageResizer.createResizedImage(
          URL.createObjectURL(imageBlob),
          210,
          210,
          "JPEG",
          80
        );

        console.log(
          "Converted JPG images:",
          resizedImage420.uri,
          resizedImage210.uri
        );

        // 读取转换后的 JPEG 文件为 base64 编码字符串
        const fileData420 = await FileSystem.readAsStringAsync(
          resizedImage420.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        const fileData210 = await FileSystem.readAsStringAsync(
          resizedImage210.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );

        // 写入 .bin 文件，路径为应用文档目录下的 image_420.bin 和 image_210.bin
        const binFileUri420 = FileSystem.documentDirectory + "image_420.bin";
        const binFileUri210 = FileSystem.documentDirectory + "image_210.bin";
        await FileSystem.writeAsStringAsync(binFileUri420, fileData420, {
          encoding: FileSystem.EncodingType.Base64,
        });
        await FileSystem.writeAsStringAsync(binFileUri210, fileData210, {
          encoding: FileSystem.EncodingType.Base64,
        });

        console.log(
          "JPEG images saved as .bin files at:",
          binFileUri420,
          binFileUri210
        );

        // 保存 base64 数据到状态（如果需要）
        setDataUrl(fileData420);

        // 读取 bin 文件内容并拆包发送给 BLE 设备
        if (!selectedDevice) {
          console.log("没有选择设备，无法发送数据");
          return;
        }

        try {
          // 确保设备已连接，并发现所有服务和特性
          await selectedDevice.connect();
          await selectedDevice.discoverAllServicesAndCharacteristics();

          // 读取 bin 文件的 base64 内容
          const binData420 = await FileSystem.readAsStringAsync(binFileUri420, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const binData210 = await FileSystem.readAsStringAsync(binFileUri210, {
            encoding: FileSystem.EncodingType.Base64,
          });

          // 发送 420 尺寸图片数据，前面加开头标志 "IMG_BIN_BEGIN_420"
          const header420 = "IMG_BIN_BEGIN_420";
          const delay = 250; // 发送间隔，单位毫秒

          // 先发送 420 头部标志
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            header420
          );

          const chunkSize = 240; // 每包最大字节数限制

          // 拆分 420 数据并按顺序发送
          for (let i = 0; i < binData420.length; i += chunkSize) {
            const chunk = binData420.substring(i, i + chunkSize);
            await selectedDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              chunk
            );
            // 等待 250 毫秒再发送下一包
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          console.log("420 bin 文件已拆包成功发送到设备");

          // 发送 210 尺寸图片数据，前面加开头标志 "IMG_BIN_BEGIN_210"
          const header210 = "IMG_BIN_BEGIN_210";

          // 先发送 210 头部标志
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            header210
          );

          // 拆分 210 数据并按顺序发送
          for (let i = 0; i < binData210.length; i += chunkSize) {
            const chunk = binData210.substring(i, i + chunkSize);
            await selectedDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              chunk
            );
            // 等待 250 毫秒再发送下一包
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          console.log("210 bin 文件已拆包成功发送到设备");

          // 发送 nft 的 collectionName，带头部标志 "COLLECTION_NAME_BEGIN"
          if (selectedNFT?.name) {
            const collectionNameHeader = "COLLECTION_NAME_BEGIN";
            const collectionName = selectedNFT.name;
            // 先发送头部标志
            await selectedDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              collectionNameHeader
            );

            // 发送 collectionName 内容，拆包发送，分包大小同样为 240
            for (let i = 0; i < collectionName.length; i += chunkSize) {
              const chunk = collectionName.substring(i, i + chunkSize);
              await selectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                writeCharacteristicUUID,
                chunk
              );
              await new Promise((resolve) => setTimeout(resolve, 250));
            }
            console.log("collectionName 已拆包成功发送到设备");
          }
        } catch (error) {
          console.log("发送 bin 文件时出错:", error);
        }
      } catch (error) {
        console.log("Error fetching image or converting to JPEG .bin:", error);
      }
    }
  };
  // 使用 FileReader 将 Blob 转换为 ArrayBuffer
  const blobToArrayBuffer = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result); // 读取成功后返回 ArrayBuffer
      };
      reader.onerror = reject; // 错误处理
      reader.readAsArrayBuffer(blob); // 将 Blob 读为 ArrayBuffer
    });
  };
  // 处理 "Next" 按钮，打开预览 Modal
  const handlePreview = () => {
    if (!selectedNFT || !recipientAddress) {
      console.log("NFT 或地址为空，不能预览");
      return;
    }

    console.log("Opening Preview Modal...");
    setSendModalVisible(false); // 先关闭 `sendModal`
    setTimeout(() => {
      setPreviewModalVisible(true); // 打开 `previewModal`
    }, 300);
  };

  const handleOpenAddressBook = () => {
    setSendModalVisible(false); // 先关闭 sendModal
    setTimeout(() => {
      setAddressBookVisible(true); // 延迟打开 AddressBookModal，防止 UI 闪烁
    }, 300);
  };

  const handleAddressSelect = (selectedItem) => {
    console.log("Selected Address Object:", selectedItem); // 确保选中的是对象
    setRecipientAddress(selectedItem.address); // 只提取 address 字段
    setAddressBookVisible(false); // 关闭 AddressBookModal
    setTimeout(() => {
      setSendModalVisible(true); // 重新打开 sendModal
    }, 300);
  };

  const toggleModal = () => {
    setNFTModalVisible(!NFTmodalVisible); // 正确的使用
  };

  // 请求 NFT 数据的函数
  const fetchNFTData = async () => {
    const requestBody = {
      chain: "okc",
      address: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03",
      tokenContractAddress: null,
      pageSize: "100",
      page: "1",
      type: "",
    };

    console.log("POST 请求数据：", requestBody);

    try {
      const response = await fetch(galleryAPI.queryNFTBalance, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const json = await response.json();
      console.log("返回数据：", json);
      if (json.code === "0" && Array.isArray(json.data)) {
        console.log("Total:", json.total);
        json.data.forEach((item, index) => {
          console.log(`Item ${index + 1}:`);
          console.log("  tokenContractAddress:", item.tokenContractAddress);
          console.log("  tokenId:", item.tokenId);
          console.log("  protocolType:", item.protocolType);
        });
      }

      setNftData(json);
    } catch (error) {
      console.log("Error fetching NFT data", error);
    }
  };

  useEffect(() => {
    if (cryptoCards && cryptoCards.length > 0) {
      fetchNFTData();
    }
  }, [cryptoCards]);

  /*   useEffect(() => {
    fetchNFTData();
  }, []); */

  // 查询 NFT 详情的函数
  const queryNFTDetail = async (chain, tokenContractAddress, tokenId) => {
    const detailRequestBody = {
      chain,
      tokenContractAddress,
      tokenId,
      type: "okx",
    };

    console.log("Query NFT Details Request:", detailRequestBody);

    try {
      const response = await fetch(galleryAPI.queryNFTDetails, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(detailRequestBody),
      });
      const responseText = await response.text();
      if (!responseText) {
        console.error("Empty response for NFT details", detailRequestBody);
        return null;
      }
      const json = JSON.parse(responseText);
      console.log("NFT Detail Response:", json);
      // 如果返回的 data 是数组且至少有一项，则返回第一项
      if (
        json.code === "0" &&
        Array.isArray(json.data) &&
        json.data.length > 0
      ) {
        return json.data[0];
      }
      return json;
    } catch (error) {
      console.error("Error querying NFT details", error);
      return null;
    }
  };

  const formatBytes = (bytes) => {
    if (!bytes) return "Unknown size";
    const kb = bytes / 1024;
    if (kb < 1024) return `${kb.toFixed(2)} KB`;
    return `${(kb / 1024).toFixed(2)} MB`;
  };

  useEffect(() => {
    if (nftData?.code === "0" && Array.isArray(nftData.data.list)) {
      nftData.data.list.forEach(async (nft) => {
        // 1️⃣ 先查询详情
        queryNFTDetail("okc", nft.tokenContractAddress, nft.tokenId);

        // 2️⃣ 再打印图片大小
        if (nft.logoUrl) {
          try {
            const resp = await fetch(nft.logoUrl, { method: "HEAD" });
            const length = resp.headers.get("Content-Length");
            const sizeBytes = length ? parseInt(length, 10) : 0;
            console.log(
              `Image for tokenId ${nft.tokenId} size: ${formatBytes(sizeBytes)}`
            );
          } catch (err) {
            console.error(`Failed to get size for ${nft.logoUrl}`, err);
          }
        }
      });
    }
  }, [nftData]);

  const {
    selectedView,
    scrollViewRef,
    VaultScreenStyle,
    modalVisible,
    cryptoCards,
    refreshing,
    onRefresh,
    opacityAnim,
    calculateTotalBalance,
    currencyUnit,
    t,
    setChainSelectionModalVisible,
    selectedChain,
    isDarkMode,
    chainFilteredCards,
    cardRefs,
    initCardPosition,
    handleCardPress,
    animatedCardStyle,
    selectedCardIndex,
    cardInfoVisible,
    handleContinue,
    handleWalletTest,
  } = props;

  const handleGalleryelect = (nft) => {
    setSelectedNFT(nft);
    setNFTModalVisible(true);
  };

  const formatBalance = (balance) => {
    const num = parseFloat(balance);
    if (num === 0) return "0";
    if (Number.isInteger(num)) return num.toString();
    const decimalPlaces = Math.min(
      7,
      (num.toString().split(".")[1] || "").length
    );
    return num.toFixed(decimalPlaces);
  };

  const renderChainButton = () => {
    return (
      <TouchableOpacity
        onPress={() => setChainSelectionModalVisible(true)}
        style={{
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        {selectedChain === "All" ? (
          <Image
            source={require("../../assets/VaultScreenLogo.png")}
            style={{
              width: 24,
              height: 24,
              marginRight: 8,
              backgroundColor: "rgba(0, 0, 0, 0.05)",
              borderRadius: 12,
            }}
          />
        ) : (
          cryptoCards.length > 0 &&
          (() => {
            const uniqueChainIcons = new Set();
            return cryptoCards
              .filter((card) => {
                if (
                  selectedChain === card.chainShortName &&
                  card.chainIcon &&
                  !uniqueChainIcons.has(card.chainShortName)
                ) {
                  uniqueChainIcons.add(card.chainShortName);
                  return true;
                }
                return false;
              })
              .map((card, index) => (
                <Image
                  key={`${card.chainShortName}-${index}`}
                  source={card.chainIcon}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    borderRadius: 12,
                  }}
                />
              ));
          })()
        )}
        <Text style={{ color: isDarkMode ? "#FFFFFF" : "#000000" }}>
          {selectedChain === "All"
            ? t("All Chains")
            : cryptoCards.find((card) => card.chainShortName === selectedChain)
                ?.chain}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSendPress = async () => {
    console.log("handleSendPress");

    // 检查是否选择了设备
    if (!selectedDevice) {
      console.log("没有选择设备");
      return;
    }

    // 获取合约地址和链名称
    const contractAddress = selectedNFT?.tokenContractAddress;
    const chainName = selectedNFT?.chain;

    if (!contractAddress || !chainName) {
      console.log("合约地址或链名称为空");
      return;
    }

    // 将合约地址和链名称转换为 Base64
    const base64ContractAddress = Buffer.from(
      contractAddress,
      "utf-8"
    ).toString("base64");
    const base64ChainName = Buffer.from(chainName, "utf-8").toString("base64");

    console.log("转换后的 Base64 合约地址:", base64ContractAddress);
    console.log("转换后的 Base64 链名称:", base64ChainName);

    // 准备要发送的消息（合约地址和链名称的 Base64 编码）
    const message = {
      contractAddress: base64ContractAddress,
      chainName: base64ChainName,
    };

    try {
      // 确保设备已连接，并发现所有服务和特性
      await selectedDevice.connect();
      await selectedDevice.discoverAllServicesAndCharacteristics();

      // 将合约地址和链名称的 Base64 编码消息发送到设备
      await selectedDevice.writeCharacteristicWithResponseForService(
        serviceUUID, // 服务UUID
        writeCharacteristicUUID, // 写入特性UUID
        JSON.stringify(message) // 将消息对象转化为 JSON 字符串并发送
      );

      console.log("合约地址和链名称（Base64）已成功发送到设备");
    } catch (error) {
      console.log("发送数据时出错:", error);
    }
  };

  return selectedView === "wallet" ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ref={scrollViewRef}
      contentContainerStyle={[
        VaultScreenStyle.scrollViewContent,
        modalVisible && { overflow: "hidden", height: "100%" },
        cryptoCards.length !== 0 && !modalVisible && { paddingBottom: 130 },
      ]}
      style={[
        VaultScreenStyle.scrollView,
        modalVisible && { overflow: "hidden" },
      ]}
      onScroll={(event) => {
        if (!modalVisible) {
          props.scrollYOffset.current = event.nativeEvent.contentOffset.y;
        }
      }}
      scrollEventThrottle={16}
      refreshControl={
        cryptoCards.length > 0 && (
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        )
      }
    >
      <Animated.View
        style={[
          VaultScreenStyle.totalBalanceContainer,
          { opacity: opacityAnim },
        ]}
      >
        {cryptoCards.length > 0 && !modalVisible && (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View>
              <Text style={VaultScreenStyle.totalBalanceText}>
                {t("Total Value")}
              </Text>
              <Text style={VaultScreenStyle.totalBalanceAmount}>
                {`${calculateTotalBalance()} `}
                <Text style={VaultScreenStyle.currencyUnit}>
                  {currencyUnit}
                </Text>
              </Text>
            </View>
            {renderChainButton()}
          </View>
        )}
      </Animated.View>

      {cryptoCards.length === 0 &&
        (props.EmptyWalletView ? (
          <props.EmptyWalletView
            isDarkMode={isDarkMode}
            VaultScreenStyle={VaultScreenStyle}
            handleContinue={handleContinue}
            handleWalletTest={handleWalletTest}
            t={t}
          />
        ) : null)}

      {chainFilteredCards.map((card, index) => {
        const isBlackText = [""].includes(card.shortName);
        const priceChange =
          props.priceChanges[card.shortName]?.priceChange || "0";
        const percentageChange =
          props.priceChanges[card.shortName]?.percentageChange || "0";
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
            onPress={() => handleCardPress(card.name, card.chain, index)}
            ref={(el) => {
              cardRefs.current[index] = el;
              initCardPosition(el, index);
            }}
            style={[
              VaultScreenStyle.cardContainer,
              selectedCardIndex === index && { zIndex: 3 },
            ]}
            disabled={modalVisible}
          >
            <Animated.View
              style={[
                VaultScreenStyle.card,
                index === 0
                  ? VaultScreenStyle.cardFirst
                  : VaultScreenStyle.cardOthers,
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
                    <View key={i} style={VaultScreenStyle[styleKey]}>
                      <Image
                        source={i === 0 ? card.icon : card.chainIcon}
                        style={
                          i === 0
                            ? VaultScreenStyle.cardIcon
                            : VaultScreenStyle.chainIcon
                        }
                      />
                    </View>
                  )
                )}
                <View style={{ position: "absolute", top: 25, left: 65 }}>
                  <View style={VaultScreenStyle.cardInfoContainer}>
                    {["cardName", "chainText"].map((textStyle, i) =>
                      i === 0 ? (
                        <Text
                          key={i}
                          style={[
                            VaultScreenStyle[textStyle],
                            {
                              color: isBlackText ? "#333" : "#eee",
                              marginRight: 4,
                              marginBottom: 4,
                            },
                          ]}
                        >
                          {card.name}
                        </Text>
                      ) : (
                        <View
                          key={i}
                          style={[
                            VaultScreenStyle.chainContainer,
                            { marginTop: 4 },
                          ]}
                        >
                          <Text
                            style={[
                              VaultScreenStyle.chainCardText,
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
                    source={require("../../assets/CardBg/Logo.png")}
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
                      VaultScreenStyle.cardShortName,
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
                        VaultScreenStyle.cardBalance,
                        isBlackText && { color: "#121518" },
                      ]}
                    >
                      {`${formatBalance(card.balance)}  ${card.shortName}`}
                    </Text>
                    <View style={VaultScreenStyle.priceChangeView}>
                      <Text style={{ color: textColor, fontWeight: "bold" }}>
                        {percentageChange > 0 ? "+" : ""}
                        {percentageChange}%
                      </Text>
                      <Text
                        style={[
                          VaultScreenStyle.balanceShortNameCenter,
                          isBlackText && { color: "#121518" },
                        ]}
                      >
                        {`${Number(
                          props.getConvertedBalance(
                            card.balance,
                            card.shortName
                          )
                        ).toFixed(2)} ${currencyUnit}`}
                      </Text>
                    </View>
                  </>
                ) : (
                  cardInfoVisible && (
                    <View style={VaultScreenStyle.cardModalContent}>
                      <TouchableOpacity
                        opacity={1}
                        onPress={() => props.handleQRCodePress(card)}
                        style={{ position: "absolute", right: 0, top: 0 }}
                      >
                        <Image
                          source={require("../../assets/icon/QR.png")}
                          style={[
                            VaultScreenStyle.QRImg,
                            isBlackText && { tintColor: "#121518" },
                          ]}
                        />
                      </TouchableOpacity>
                      {["cardBalanceCenter", "balanceShortNameCenter"].map(
                        (styleKey, i) => (
                          <Text
                            key={i}
                            style={[
                              VaultScreenStyle[styleKey],
                              isBlackText && { color: "#121518" },
                            ]}
                          >
                            {`${
                              i === 0
                                ? formatBalance(card.balance)
                                : props.getConvertedBalance(
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

      {modalVisible && props.renderTabModal && props.renderTabModal()}
    </ScrollView>
  ) : (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        width: "90%",
      }}
    >
      {cryptoCards.length > 0 && !modalVisible && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            marginBottom: 10,
          }}
        >
          {renderChainButton()}
        </View>
      )}
      {/* Gallery view */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 10,
        }}
        style={{
          width: "100%",
          borderRadius: 8,
        }}
        refreshControl={
          <RefreshControl
            refreshing={galleryRefreshing}
            onRefresh={() => {
              setGalleryRefreshing(true);
              fetchNFTData().finally(() => setGalleryRefreshing(false));
            }}
          />
        }
      >
        {nftData && nftData.code === "0" && Array.isArray(nftData.data) ? (
          nftData.data.map((nft, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleGalleryelect(nft)}
              style={{ width: "50%", padding: 4 }}
            >
              <View
                style={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  borderRadius: 8,
                  padding: 10,
                  aspectRatio: 2 / 3,
                  position: "relative",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                {nft.logoUrl ? (
                  <SkeletonImage
                    source={{ uri: nft.logoUrl }}
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      borderRadius: 8,
                      marginBottom: 8,
                    }}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={{
                      width: "100%",
                      aspectRatio: 1,
                      borderRadius: 8,
                      backgroundColor: "#ccc",
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={[
                        VaultScreenStyle.modalSubtitle,
                        { color: "#666" },
                      ]}
                    >
                      {t("No Image")}
                    </Text>
                  </View>
                )}
                <Text
                  style={VaultScreenStyle.modalTitle}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {nft.name || "NFT Card"}
                </Text>

                <View
                  style={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    right: 10,
                  }}
                >
                  <View style={{ flexDirection: "column" }}>
                    <Text
                      style={[
                        VaultScreenStyle.chainCardText,
                        { marginBottom: 4 },
                      ]}
                    >
                      {t("Price")}: {nft.lastPrice}{" "}
                      {nft.lastPriceUnit || t("N/A")}
                    </Text>
                    <Text
                      style={[
                        VaultScreenStyle.chainCardText,
                        { marginBottom: 4 },
                      ]}
                    >
                      {t("Chain")}: {nft.chain || t("N/A")}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              height: 590,
            }}
          >
            <Text
              style={{
                textAlign: "center",
                color: isDarkMode ? "#fff" : "#000",
                width: "100%",
              }}
            >
              {t("No NFT Data")}
            </Text>
          </View>
        )}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={NFTmodalVisible}
        onRequestClose={toggleModal}
      >
        <TouchableWithoutFeedback onPress={toggleModal}>
          <BlurView intensity={10} style={VaultScreenStyle.centeredView}>
            <View
              style={VaultScreenStyle.NFTmodalView}
              onStartShouldSetResponder={(e) => e.stopPropagation()}
            >
              {selectedNFT ? (
                <View>
                  {selectedNFT.logoUrl ? (
                    <SkeletonImage
                      source={{ uri: selectedNFT.logoUrl }}
                      style={{
                        width: "100%",

                        aspectRatio: 1,
                        borderRadius: 8,
                        marginBottom: 8,
                      }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View
                      style={{
                        width: "100%",
                        aspectRatio: 1,
                        borderRadius: 8,
                        backgroundColor: "#ccc",
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text
                        style={[
                          VaultScreenStyle.modalSubtitle,
                          { color: "#666" },
                        ]}
                      >
                        {t("No Image")}
                      </Text>
                    </View>
                  )}
                  <ScrollView
                    style={{
                      height: 120,
                      marginVertical: 20,
                    }}
                    contentContainerStyle={{
                      flexGrow: 1,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      {/* NFT 名称 */}
                      <Text
                        style={[
                          VaultScreenStyle.modalTitle,
                          { marginBottom: 4 },
                        ]}
                      >
                        {selectedNFT.name || t("NFT Card")}
                      </Text>

                      {/* 合约地址 */}
                      <Text
                        style={[
                          VaultScreenStyle.chainCardText,
                          { marginBottom: 2 },
                        ]}
                      >
                        {t("Contract")}: {selectedNFT.tokenContractAddress}
                      </Text>

                      {/* Token ID */}
                      <Text
                        style={[
                          VaultScreenStyle.chainCardText,
                          { marginBottom: 2 },
                        ]}
                      >
                        {t("Token ID")}: {selectedNFT.tokenId}
                      </Text>

                      {/* 协议类型 */}
                      <Text style={VaultScreenStyle.chainCardText}>
                        {t("Protocol")}: {selectedNFT.protocolType || t("N/A")}
                      </Text>

                      {/* 价格信息，如果存在 */}
                      {selectedNFT.lastPrice && (
                        <Text
                          style={[
                            VaultScreenStyle.modalTitle,
                            { marginTop: 8 },
                          ]}
                        >
                          {t("Price")}: {selectedNFT.lastPrice}{" "}
                          {selectedNFT.lastPriceUnit || t("N/A")}
                        </Text>
                      )}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <Text
                  style={[
                    VaultScreenStyle.modalSubtitle,
                    { textAlign: "center" },
                  ]}
                >
                  {t("No NFT Data")}
                </Text>
              )}

              {/* Add Send and 收藏到冷钱包 buttons */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={[
                    VaultScreenStyle.NFTButton,
                    { flex: 1, marginRight: 8 },
                  ]}
                  onPress={() => {
                    setNFTModalVisible(false);
                    setRecipientAddress("");
                    setSendModalVisible(true);
                  }}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Send")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    VaultScreenStyle.NFTButton,

                    { flex: 1, marginLeft: 8 },
                  ]}
                  onPress={handleSaveToDevice}
                >
                  <Text style={VaultScreenStyle.NFTButtonText}>
                    {t("Save to Device")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={sendModalVisible}
        onRequestClose={() => setSendModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => setSendModalVisible(false)}>
            <BlurView intensity={10} style={VaultScreenStyle.centeredView}>
              <View
                style={VaultScreenStyle.ContactFormModal}
                onStartShouldSetResponder={(e) => e.stopPropagation()}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[VaultScreenStyle.modalTitle, { marginBottom: 10 }]}
                  >
                    {t("Send NFT")}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                  }}
                >
                  {selectedNFT?.logoUrl && (
                    <Image
                      source={{ uri: selectedNFT.logoUrl }}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 4,
                        marginRight: 8,
                      }}
                    />
                  )}
                  <ScrollView
                    style={{ flexDirection: "column", flex: 1, height: 60 }}
                  >
                    <Text
                      style={[
                        VaultScreenStyle.modalTitle,
                        { flexWrap: "wrap" },
                      ]}
                    >
                      {selectedNFT?.name || "NFT Name"}
                    </Text>
                    <Text style={VaultScreenStyle.NFTtext}>
                      {t("Token ID")}: {selectedNFT?.tokenId || "N/A"}
                    </Text>
                  </ScrollView>
                </View>

                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <TextInput
                    style={[
                      VaultScreenStyle.input,
                      { flex: 1, color: isDarkMode ? "#ffffff" : "#000" },
                    ]}
                    placeholder={t("Enter Address")}
                    placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
                    onChangeText={(text) => setRecipientAddress(text)} // 允许手动输入
                    value={recipientAddress} // 让 TextInput 反映选中的地址
                    autoFocus={true}
                  />

                  <Icon
                    name="portrait"
                    size={28}
                    color={isDarkMode ? "#ffffff" : "#000"}
                    style={{ marginLeft: 6, alignSelf: "center", top: 10 }}
                    onPress={handleOpenAddressBook} // 绑定点击事件
                  />
                </View>
                <TouchableOpacity
                  style={[VaultScreenStyle.submitButton]}
                  disabled={!recipientAddress}
                  onPress={handlePreview}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Next")}</Text>
                </TouchableOpacity>

                {/* 关闭按钮 */}
                <TouchableOpacity
                  style={[VaultScreenStyle.Button]}
                  onPress={() => setSendModalVisible(false)}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Close")}</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      <AddressBookModal
        visible={isAddressBookVisible}
        onClose={() => setAddressBookVisible(false)}
        onSelect={handleAddressSelect}
        styles={styles}
        isDarkMode={isDarkMode}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={previewModalVisible}
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setPreviewModalVisible(false)}>
          <BlurView intensity={10} style={VaultScreenStyle.centeredView}>
            <View
              style={VaultScreenStyle.ContactFormModal}
              onStartShouldSetResponder={(e) => e.stopPropagation()}
            >
              {/* 标题栏 */}
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text style={VaultScreenStyle.modalTitle}>
                  {props.t("Preview Transaction")}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                {selectedNFT?.logoUrl && (
                  <Image
                    source={{ uri: selectedNFT.logoUrl }}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 4,
                      marginRight: 8,
                    }}
                  />
                )}
                <View style={{ flexDirection: "column", flex: 1 }}>
                  <Text style={{ flexWrap: "wrap" }}>
                    {selectedNFT?.name || "NFT Name"}
                  </Text>
                  <Text style={{ flexWrap: "wrap" }}>
                    {t("Token ID")}: {selectedNFT?.tokenId || "N/A"}
                  </Text>
                </View>
              </View>

              <Text style={VaultScreenStyle.label}>
                {props.t("Recipient Address")}
              </Text>

              <Text>{recipientAddress || props.t("No Address Selected")}</Text>
              <View>
                <TouchableOpacity
                  style={VaultScreenStyle.submitButton}
                  disabled={!recipientAddress}
                  onPress={() => {
                    onPress = { handleSendPress };
                    setPreviewModalVisible(false);
                  }}
                >
                  <Text style={VaultScreenStyle.ButtonText}>
                    {props.t("Send")}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={VaultScreenStyle.cancelButton}
                  onPress={() => setPreviewModalVisible(false)}
                >
                  <Text style={VaultScreenStyle.ButtonText}>
                    {props.t("Close")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default SecureDeviceStatus;
