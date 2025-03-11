// ./walletScreen/WalletContent.js
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
import Icon from "react-native-vector-icons/MaterialIcons";
import AddressBookModal from "./../modal/AddressBookModal";
import MyColdWalletScreenStyles from "../../styles/MyColdWalletScreenStyle";

const SkeletonImage = ({ source, style, resizeMode }) => {
  const [loaded, setLoaded] = useState(false);
  const skeletonOpacity = useState(new Animated.Value(1))[0];
  const imageOpacity = useState(new Animated.Value(0))[0];
  // 用于控制闪烁渐变的水平平移动画
  const shimmerTranslate = useState(new Animated.Value(-200))[0];

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
      {/* 实际图片 */}
      <Animated.Image
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
      />
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
    width: "30%", // 渐变块宽度，可根据需要调整
    height: "100%",
  },
});

const WalletContent = (props) => {
  const [isAddressBookVisible, setAddressBookVisible] = useState(false);
  const [nftData, setNftData] = useState(null);
  const [NFTmodalVisible, setNFTModalVisible] = useState(false); // 正确的命名
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [sendModalVisible, setSendModalVisible] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState("");
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const styles = MyColdWalletScreenStyles(isDarkMode);

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
      const response = await fetch(
        "https://bt.likkim.com/api/nfts/query-address-balance-fills",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );
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
      console.error("Error fetching NFT data", error);
    }
  };

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
      const response = await fetch(
        "https://bt.likkim.com/api/nfts/query-nft-details",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(detailRequestBody),
        }
      );
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

  useEffect(() => {
    fetchNFTData();
  }, []);

  useEffect(() => {
    if (
      nftData &&
      nftData.code === "0" &&
      nftData.data &&
      Array.isArray(nftData.data.list)
    ) {
      nftData.data.list.forEach((nft) => {
        queryNFTDetail("okc", nft.tokenContractAddress, nft.tokenId);
      });
    }
  }, [nftData]);

  const {
    selectedView,
    scrollViewRef,
    WalletScreenStyle,
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
  } = props;

  const handleNFTSelect = (nft) => {
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
            source={require("../../assets/WalletScreenLogo.png")}
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

  return selectedView === "wallet" ? (
    <ScrollView
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      ref={scrollViewRef}
      contentContainerStyle={[
        WalletScreenStyle.scrollViewContent,
        modalVisible && { overflow: "hidden", height: "100%" },
        cryptoCards.length !== 0 && !modalVisible && { paddingBottom: 130 },
      ]}
      style={[
        WalletScreenStyle.scrollView,
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
          WalletScreenStyle.totalBalanceContainer,
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
              <Text style={WalletScreenStyle.totalBalanceText}>
                {t("Total Balance")}
              </Text>
              <Text style={WalletScreenStyle.totalBalanceAmount}>
                {`${calculateTotalBalance()} `}
                <Text style={WalletScreenStyle.currencyUnit}>
                  {currencyUnit}
                </Text>
              </Text>
            </View>
            {renderChainButton()}
          </View>
        )}
      </Animated.View>

      {cryptoCards.length === 0 &&
        (props.EmptyWalletViewComponent ? (
          <props.EmptyWalletViewComponent
            isDarkMode={isDarkMode}
            WalletScreenStyle={WalletScreenStyle}
            setAddWalletModalVisible={props.setAddWalletModalVisible}
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
              WalletScreenStyle.cardContainer,
              selectedCardIndex === index && { zIndex: 3 },
            ]}
            disabled={modalVisible}
          >
            <Animated.View
              style={[
                WalletScreenStyle.card,
                index === 0
                  ? WalletScreenStyle.cardFirst
                  : WalletScreenStyle.cardOthers,
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
                    <View key={i} style={WalletScreenStyle[styleKey]}>
                      <Image
                        source={i === 0 ? card.icon : card.chainIcon}
                        style={
                          i === 0
                            ? WalletScreenStyle.cardIcon
                            : WalletScreenStyle.chainIcon
                        }
                      />
                    </View>
                  )
                )}
                <View style={{ position: "absolute", top: 25, left: 65 }}>
                  <View style={WalletScreenStyle.cardInfoContainer}>
                    {["cardName", "chainText"].map((textStyle, i) =>
                      i === 0 ? (
                        <Text
                          key={i}
                          style={[
                            WalletScreenStyle[textStyle],
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
                            WalletScreenStyle.chainContainer,
                            { marginTop: 4 },
                          ]}
                        >
                          <Text
                            style={[
                              WalletScreenStyle.chainCardText,
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
                      WalletScreenStyle.cardShortName,
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
                        WalletScreenStyle.cardBalance,
                        isBlackText && { color: "#121518" },
                      ]}
                    >
                      {`${formatBalance(card.balance)}  ${card.shortName}`}
                    </Text>
                    <View style={WalletScreenStyle.priceChangeView}>
                      <Text style={{ color: textColor, fontWeight: "bold" }}>
                        {percentageChange > 0 ? "+" : ""}
                        {percentageChange}%
                      </Text>
                      <Text
                        style={[
                          WalletScreenStyle.balanceShortNameCenter,
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
                    <View style={WalletScreenStyle.cardModalContent}>
                      <TouchableOpacity
                        opacity={1}
                        onPress={() => props.handleQRCodePress(card)}
                        style={{ position: "absolute", right: 0, top: 0 }}
                      >
                        <Image
                          source={require("../../assets/icon/QR.png")}
                          style={[
                            WalletScreenStyle.QRImg,
                            isBlackText && { tintColor: "#121518" },
                          ]}
                        />
                      </TouchableOpacity>
                      {["cardBalanceCenter", "balanceShortNameCenter"].map(
                        (styleKey, i) => (
                          <Text
                            key={i}
                            style={[
                              WalletScreenStyle[styleKey],
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
        width: 326,
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
      {/* NFTs view */}
      <ScrollView
        contentContainerStyle={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
        }}
        style={{
          width: "100%",
          height: 590,
          borderRadius: 8,
        }}
      >
        {nftData && nftData.code === "0" && Array.isArray(nftData.data) ? (
          nftData.data.map((nft, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleNFTSelect(nft)}
              style={{ width: "50%", padding: 4 }}
            >
              <View
                style={{
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  borderRadius: 8,
                  padding: 10,
                  height: 250,
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
                        WalletScreenStyle.modalSubtitle,
                        { color: "#666" },
                      ]}
                    >
                      {t("No Image")}
                    </Text>
                  </View>
                )}
                <Text style={WalletScreenStyle.modalTitle}>
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
                        WalletScreenStyle.chainCardText,
                        { marginBottom: 4 },
                      ]}
                    >
                      {t("Price")}: {nft.lastPrice}{" "}
                      {nft.lastPriceUnit || t("N/A")}
                    </Text>
                    <Text
                      style={[
                        WalletScreenStyle.chainCardText,
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
          <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
            <View
              style={WalletScreenStyle.NFTmodalView}
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
                          WalletScreenStyle.modalSubtitle,
                          { color: "#666" },
                        ]}
                      >
                        {t("No Image")}
                      </Text>
                    </View>
                  )}
                  <ScrollView
                    style={{
                      height: 140,
                      marginTop: 20,
                    }}
                  >
                    <Text
                      style={[
                        WalletScreenStyle.modalTitle,
                        { marginBottom: 4 },
                      ]}
                    >
                      {selectedNFT.name || t("NFT Card")}
                    </Text>
                    <Text
                      style={[
                        WalletScreenStyle.chainCardText,
                        { marginBottom: 2 },
                      ]}
                    >
                      {t("Contract")}: {selectedNFT.tokenContractAddress}
                    </Text>
                    <Text
                      style={[
                        WalletScreenStyle.chainCardText,
                        { marginBottom: 2 },
                      ]}
                    >
                      {t("Token ID")}: {selectedNFT.tokenId}
                    </Text>
                    <Text style={[WalletScreenStyle.chainCardText]}>
                      {t("Protocol")}: {selectedNFT.protocolType || t("N/A")}
                    </Text>

                    {selectedNFT.lastPrice && (
                      <Text
                        style={[WalletScreenStyle.modalTitle, { marginTop: 8 }]}
                      >
                        {t("Price")}: {selectedNFT.lastPrice}{" "}
                        {selectedNFT.lastPriceUnit || t("N/A")}
                      </Text>
                    )}
                  </ScrollView>
                </View>
              ) : (
                <Text
                  style={[
                    WalletScreenStyle.modalSubtitle,
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
                  marginTop: 16,
                }}
              >
                <TouchableOpacity
                  style={[
                    WalletScreenStyle.Button,
                    { flex: 1, marginRight: 8 },
                  ]}
                  onPress={() => {
                    setNFTModalVisible(false); // 先关闭当前 NFT modal

                    setSendModalVisible(true);
                  }}
                >
                  <Text style={WalletScreenStyle.ButtonText}>{t("Send")}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[WalletScreenStyle.Button, { flex: 1, marginLeft: 8 }]}
                  onPress={() => {
                    console.log("Save to Cold Wallet clicked");
                  }}
                >
                  <Text style={WalletScreenStyle.ButtonText}>
                    {t("Save To ColdWallet")}
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
            <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
              <View
                style={WalletScreenStyle.inputAddressModal}
                onStartShouldSetResponder={(e) => e.stopPropagation()}
              >
                <View
                  style={{
                    width: "100%",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={[WalletScreenStyle.modalTitle, { marginBottom: 10 }]}
                  >
                    {t("Send NFT")}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
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
                  <View style={{ flexDirection: "column" }}>
                    <Text style={WalletScreenStyle.modalTitle}>
                      {selectedNFT?.name || "NFT Name"}
                    </Text>
                    <Text style={WalletScreenStyle.NFTtext}>
                      {t("Token ID")}: {selectedNFT?.tokenId || "N/A"}
                    </Text>
                  </View>
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
                      WalletScreenStyle.input,
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
                  style={[WalletScreenStyle.submitButton]}
                  disabled={!recipientAddress}
                  onPress={handlePreview}
                >
                  <Text style={WalletScreenStyle.ButtonText}>{t("Next")}</Text>
                </TouchableOpacity>

                {/* 关闭按钮 */}
                <TouchableOpacity
                  style={[WalletScreenStyle.Button]}
                  onPress={() => setSendModalVisible(false)}
                >
                  <Text style={WalletScreenStyle.ButtonText}>{t("Close")}</Text>
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
          <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
            <View
              style={WalletScreenStyle.inputAddressModal}
              onStartShouldSetResponder={(e) => e.stopPropagation()}
            >
              {/* 标题栏 */}
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text style={WalletScreenStyle.modalTitle}>
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

              {/* 收款地址 */}
              <Text style={WalletScreenStyle.label}>
                {props.t("Recipient Address")}
              </Text>

              <Text>{recipientAddress || props.t("No Address Selected")}</Text>

              {/* 确认发送按钮 */}
              <TouchableOpacity
                style={WalletScreenStyle.submitButton}
                disabled={!recipientAddress}
                onPress={() => {
                  console.log("Confirming Transaction...");
                  setPreviewModalVisible(false);
                }}
              >
                <Text style={WalletScreenStyle.ButtonText}>
                  {props.t("Send")}
                </Text>
              </TouchableOpacity>

              {/* 关闭按钮 */}
              <TouchableOpacity
                style={WalletScreenStyle.Button}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Text style={WalletScreenStyle.ButtonText}>
                  {props.t("Close")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default WalletContent;
