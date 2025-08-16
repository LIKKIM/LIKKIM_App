// ./VaultScreen/DeviceStatus.js
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
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import AddressBookModal from "./../modal/AddressBookModal";
import NFTDetailModal from "../modal/NFTDetailModal";
import SendItemModal from "../modal/SendItemModal";
import PreviewSendModal from "../modal/PreviewSendModal";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";
import { WebView } from "react-native-webview";
import { galleryAPI } from "../../env/apiEndpoints";
import ImageResizer from "react-native-image-resizer";
import { Buffer } from "buffer";
import { bluetoothConfig } from "../../env/bluetoothConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BleManager } from "react-native-ble-plx";
import * as FileSystem from "expo-file-system";
import { queryNFTDetail } from "../../utils/queryNFTDetail";
import { handleSaveToDevice } from "../../utils/handleSaveToDevice";
const bleManager = new BleManager();

const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;
const SkeletonImage = ({ source, style, resizeMode, VaultScreenStyle }) => {
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
            VaultScreenStyle.placeholderWrapper,
            { opacity: skeletonOpacity, borderRadius: style.borderRadius || 0 },
          ]}
        >
          {/* 闪烁效果：利用 Animated.View 搭配 LinearGradient 实现从左到右的流动渐变 */}
          <Animated.View
            style={[
              VaultScreenStyle.shimmerBar,
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

/* 样式已迁移到 VaultScreenStyle.js */

const DeviceStatus = ({
  setBleVisible,
  devices = [],
  verifiedDevices = [],
  ...props
}) => {
  // NFT卡片动画相关
  const scaleAnimsRef = React.useRef([]);
  // 动画参数
  const PRESS_IN_SCALE = 0.95;
  const ANIMATION_DURATION = 200;
  // 动画函数
  const animatePressIn = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: PRESS_IN_SCALE,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };
  const animatePressOut = (animatedValue, callback) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (typeof callback === "function") callback();
    });
  };
  // NFT数据变化时同步动画数组长度
  useEffect(() => {
    if (nftData && nftData.code === "0" && Array.isArray(nftData.data)) {
      if (!scaleAnimsRef.current) scaleAnimsRef.current = [];
      const targetLen = nftData.data.length;
      // 扩展
      for (let i = scaleAnimsRef.current.length; i < targetLen; i++) {
        scaleAnimsRef.current[i] = new Animated.Value(1);
      }
      // 截断
      if (scaleAnimsRef.current.length > targetLen) {
        scaleAnimsRef.current.length = targetLen;
      }
    }
  }, [nftData]);
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
  useEffect(() => {
    const loadNftData = async () => {
      try {
        const savedNftData = await AsyncStorage.getItem("nftData");
        if (savedNftData !== null) {
          setNftData(JSON.parse(savedNftData));
        } else {
          fetchNFTData();
        }
      } catch (e) {
        console.error("Error loading nftData from AsyncStorage", e);
        fetchNFTData();
      }
    };
    loadNftData();
  }, []);

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
      // 持久化 nftData
      try {
        await AsyncStorage.setItem("nftData", JSON.stringify(json));
      } catch (e) {
        console.error("Error saving nftData to AsyncStorage", e);
      }
    } catch (error) {
      console.log("Error fetching NFT data", error);
    }
  };

  useEffect(() => {
    if (cryptoCards && cryptoCards.length > 0) {
      fetchNFTData();
    }
  }, [cryptoCards]);

  /*  useEffect(() => {
    fetchNFTData();
  }, []); */

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
    selectCardOffsetOpenAni,
    selectCardOffsetCloseAni,
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
            style={VaultScreenStyle.chainAllIcon}
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
                  style={VaultScreenStyle.chainSelectedIcon}
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
    if (!props.device) {
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
      await props.device.connect();
      await props.device.discoverAllServicesAndCharacteristics();

      await props.device.writeCharacteristicWithResponseForService(
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
      scrollEnabled={!modalVisible}
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            progressViewOffset={-20}
          />
        )
      }
    >
      <View style={VaultScreenStyle.refreshTipView}>
        <Text style={VaultScreenStyle.refreshTipText}>
          {refreshing ? t("Refreshing…") : t("Pull down to refresh")}
        </Text>
      </View>
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
            style={[VaultScreenStyle.cardContainer]}
            disabled={modalVisible}
          >
            <Animated.View
              style={[
                VaultScreenStyle.card,
                index === 0
                  ? VaultScreenStyle.cardFirst
                  : VaultScreenStyle.cardOthers,
                {
                  transform: [
                    {
                      translateY:
                        selectedCardIndex === index
                          ? selectCardOffsetOpenAni
                          : selectCardOffsetCloseAni,
                    },
                  ],
                },
                // selectedCardIndex === index && animatedCardStyle(index),
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
            position: "absolute",
            top: 0,
            width: 326,
            left: "50%",
            transform: [{ translateX: -163 }],
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "flex-start",
            marginBottom: 10,
            zIndex: 10,
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
          zIndex: 0,
          marginTop: 40,
        }}
        refreshControl={
          <RefreshControl
            refreshing={galleryRefreshing}
            onRefresh={() => {
              setGalleryRefreshing(true);
              Promise.race([
                fetchNFTData(),
                new Promise((resolve) => setTimeout(resolve, 3000)),
              ]).finally(() => setGalleryRefreshing(false));
            }}
            progressViewOffset={-20}
          />
        }
      >
        <View
          style={{
            position: "absolute",
            top: -30,
            left: 0,
            right: 0,
            alignItems: "center",
          }}
        >
          <Text style={{ color: isDarkMode ? "#fff" : "#888" }}>
            {refreshing ? t("Refreshing…") : t("Pull down to refresh")}
          </Text>
        </View>
        {nftData && nftData.code === "0" && Array.isArray(nftData.data) ? (
          nftData.data.map((nft, index) =>
            // 防御性兜底，确保每个 index 都有 Animated.Value
            (() => {
              if (!scaleAnimsRef.current[index]) {
                scaleAnimsRef.current[index] = new Animated.Value(1);
              }
              return (
                <Animated.View
                  key={index}
                  style={[
                    VaultScreenStyle.galleryItem,
                    { transform: [{ scale: scaleAnimsRef.current[index] }] },
                  ]}
                >
                  <TouchableOpacity
                    onPressIn={() =>
                      animatePressIn(scaleAnimsRef.current[index])
                    }
                    onPressOut={() =>
                      animatePressOut(scaleAnimsRef.current[index])
                    }
                    onPress={() => handleGalleryelect(nft)}
                    activeOpacity={1}
                    style={{ width: "100%" }}
                  >
                    <View style={VaultScreenStyle.galleryCard}>
                      <View>
                        {nft.logoUrl ? (
                          <SkeletonImage
                            source={{ uri: nft.logoUrl }}
                            style={VaultScreenStyle.galleryImage}
                            resizeMode="cover"
                            VaultScreenStyle={VaultScreenStyle}
                          />
                        ) : (
                          <View
                            style={VaultScreenStyle.galleryNoImageContainer}
                          >
                            <Image
                              source={require("../../assets/Logo@500.png")}
                              style={VaultScreenStyle.galleryNoImageLogo}
                            />
                            <Text
                              style={[
                                VaultScreenStyle.modalSubtitle,
                                VaultScreenStyle.galleryNoImageText,
                              ]}
                            >
                              {t("No Image")}
                            </Text>
                          </View>
                        )}
                      </View>

                      <View style={VaultScreenStyle.galleryCardBottom}>
                        <Text
                          style={VaultScreenStyle.galleryCardTitle}
                          numberOfLines={3}
                          ellipsizeMode="tail"
                        >
                          {nft.name || "NFT Card"}
                        </Text>
                        <View style={VaultScreenStyle.galleryCardBottomCol}>
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
                </Animated.View>
              );
            })()
          )
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
      <NFTDetailModal
        visible={NFTmodalVisible}
        onClose={toggleModal}
        selectedNFT={selectedNFT}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
        handleSaveToDevice={async () => {
          await handleSaveToDevice({
            selectedNFT,
            devices,
            verifiedDevices,
            setBleVisible,
            device: props.device,
            Alert,
            ImageResizer,
            FileSystem,
            Buffer,
            serviceUUID,
            writeCharacteristicUUID,
            notifyCharacteristicUUID,
          });
        }}
        setRecipientAddress={setRecipientAddress}
        setSendModalVisible={setSendModalVisible}
      />
      {/*  发送NFTModal */}
      <SendItemModal
        visible={sendModalVisible}
        onClose={() => setSendModalVisible(false)}
        selectedNFT={selectedNFT}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
        setRecipientAddress={setRecipientAddress}
        recipientAddress={recipientAddress}
        setSendModalVisible={setSendModalVisible}
        handlePreview={handlePreview}
        handleOpenAddressBook={handleOpenAddressBook}
        isDarkMode={isDarkMode}
      />
      {/*   地址簿Modal */}
      <AddressBookModal
        visible={isAddressBookVisible}
        onClose={() => setAddressBookVisible(false)}
        onSelect={handleAddressSelect}
        styles={styles}
        isDarkMode={isDarkMode}
      />
      {/*   发送预览Modal */}
      <PreviewSendModal
        visible={previewModalVisible}
        onClose={() => setPreviewModalVisible(false)}
        selectedNFT={selectedNFT}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
        recipientAddress={recipientAddress}
        handleSendPress={handleSendPress}
        isDarkMode={isDarkMode}
      />
    </View>
  );
};

export default DeviceStatus;
