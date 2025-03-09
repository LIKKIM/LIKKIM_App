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
} from "react-native";

const WalletContent = (props) => {
  const [nftData, setNftData] = useState(null);

  // 请求 NFT 数据的函数
  const fetchNFTData = async () => {
    const requestBody = {
      chain: "okc",
      address: "0xaba7161a7fb69c88e16ed9f455ce62b791ee4d03",
      protocolType: "token_721",
      tokenContractAddress: null,
      pageSize: "100",
      page: "1",
      type: "okx",
    };

    // 打印请求数据
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

      // 打印整个返回数据
      console.log("返回数据：", json);

      // 如果返回成功且有数据，则打印 total 字段
      if (json.code === "0" && json.data) {
        console.log("Total:", json.data.total);

        // 判断 data.list 是否存在且为数组，然后遍历打印每个对象中的指定字段
        if (Array.isArray(json.data.list)) {
          json.data.list.forEach((item, index) => {
            console.log(`Item ${index + 1}:`);
            console.log("  tokenContractAddress:", item.tokenContractAddress);
            console.log("  tokenId:", item.tokenId);
            console.log("  protocolType:", item.protocolType);
          });
        }
      }

      setNftData(json);
    } catch (error) {
      console.error("Error fetching NFT data", error);
    }
  };

  // 在组件挂载时调用 NFT 数据接口
  useEffect(() => {
    fetchNFTData();
  }, []);

  // 从 props 中解构需要使用的变量和函数
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

  // 格式化余额：根据余额的值保留小数位数
  const formatBalance = (balance) => {
    const num = parseFloat(balance);

    if (num === 0) {
      return "0"; // 如果余额为0，返回0
    }

    if (Number.isInteger(num)) {
      return num.toString(); // 如果余额是整数，返回整数值
    }

    // 计算小数部分的位数，最多保留7位
    const decimalPlaces = Math.min(
      7,
      (num.toString().split(".")[1] || "").length
    );
    return num.toFixed(decimalPlaces); // 保留小数部分
  };

  // 将重复的“All Chain 按钮”部分提取成一个局部函数
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
                              marginBottom: 4, // 增加底部间距
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
                            { marginTop: 4 }, // 增加间距使其上下排列
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
        width: "90%", // 使用总宽度的96%
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
        }}
        style={{
          width: "100%", // 同样使用百分比宽度
          height: 590,
          borderRadius: 8,
        }}
      >
        {nftData &&
        nftData.code === "0" &&
        nftData.data &&
        Array.isArray(nftData.data.list) ? (
          nftData.data.list.map((nft, index) => (
            // 使用 width: "50%" 表示每个卡片占父容器宽度的一半
            <View
              key={index}
              style={{
                width: "50%",
                padding: 4, // 如果需要间距可设置 padding
              }}
            >
              <View
                style={{
                  flex: 1,
                  backgroundColor: isDarkMode ? "#333" : "#fff",
                  borderRadius: 8,
                  padding: 10,
                  // 可添加阴影等其他样式
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text style={{ fontWeight: "bold", marginBottom: 4 }}>
                  {nft.name || "NFT Card"}
                </Text>
                <Text style={{ fontSize: 12, marginBottom: 2 }}>
                  Contract: {nft.tokenContractAddress}
                </Text>
                <Text style={{ fontSize: 12, marginBottom: 2 }}>
                  Token ID: {nft.tokenId}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  Protocol: {nft.protocolType || "N/A"}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text
            style={{
              textAlign: "center",
              color: isDarkMode ? "#fff" : "#000",
              width: "100%",
            }}
          >
            暂无 NFT 数据
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

export default WalletContent;
