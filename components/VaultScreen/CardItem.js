import React, { useState, useEffect } from "react";
import {
  TouchableHighlight,
  Animated,
  ImageBackground,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import { getColors as getImageColors } from "react-native-image-colors";

/**
 * 卡片组件，负责渲染单个资产卡片
 * @param {object} props
 * @param {object} props.card - 当前卡片数据
 * @param {number} props.index - 当前卡片索引
 * @param {boolean} props.modalVisible - 是否显示模态框
 * @param {number} props.selectedCardIndex - 选中的卡片索引
 * @param {any} props.selectCardOffsetOpenAni - 选中卡片动画
 * @param {any} props.selectCardOffsetCloseAni - 未选中卡片动画
 * @param {object} props.VaultScreenStyle - 样式对象
 * @param {boolean} props.isBlackText - 是否黑色文字
 * @param {function} props.animatedCardStyle - 动画样式函数
 * @param {object} props.cardRefs - 卡片ref集合
 * @param {function} props.initCardPosition - 初始化卡片位置
 * @param {function} props.handleCardPress - 卡片点击处理
 * @param {boolean} props.cardInfoVisible - 卡片信息可见
 * @param {function} props.formatBalance - 格式化余额
 * @param {string} props.currencyUnit - 货币单位
 * @param {string} props.textColor - 涨跌颜色
 * @param {string|number} props.percentageChange - 涨跌幅
 * @param {function} props.getConvertedBalance - 获取法币余额
 * @param {function} props.handleQRCodePress - 二维码点击处理
 */
const CardItem = ({
  card,
  index,
  modalVisible,
  selectedCardIndex,
  selectCardOffsetOpenAni,
  selectCardOffsetCloseAni,
  VaultScreenStyle,
  isBlackText,
  animatedCardStyle,
  cardRefs,
  initCardPosition,
  handleCardPress,
  cardInfoVisible,
  formatBalance,
  currencyUnit,
  textColor,
  percentageChange,
  getConvertedBalance,
  handleQRCodePress,
}) => {
  // 典型色 state
  const [mainColor, setMainColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#cccccc");

  useEffect(() => {
    let imageUri = null;
    if (card.cardImage) {
      if (typeof card.cardImage === "number") {
        // require 本地图片
        const resolved = Image.resolveAssetSource(card.cardImage);
        imageUri = resolved?.uri;
      } else if (card.cardImage.uri) {
        imageUri = card.cardImage.uri;
      }
    }
    if (imageUri) {
      getImageColors(imageUri, {
        fallback: "#ffffff",
        cache: true,
        key: imageUri,
      })
        .then((colors) => {
          // 兼容不同平台返回
          if (colors.platform === "android" || colors.platform === "ios") {
            setMainColor(colors.primary || "#ffffff");
            setSecondaryColor(colors.secondary || "#cccccc");
          } else if (colors.platform === "web") {
            setMainColor(colors.lightVibrant || "#ffffff");
            setSecondaryColor(colors.darkVibrant || "#cccccc");
          }
        })
        .catch(() => {
          setMainColor("#ffffff");
          setSecondaryColor("#cccccc");
        });
    }
  }, [card.cardImage]);

  return (
    <TouchableHighlight
      underlayColor={"transparent"}
      key={`${card.shortName}_${index}`}
      onPress={() => handleCardPress(card.name, card.queryChainName, index)}
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
          {/* 显示主色和副色 */}
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              flexDirection: "row",
              zIndex: 10,
            }}
          >
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: mainColor,
                marginRight: 8,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            />
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                backgroundColor: secondaryColor,
                borderWidth: 1,
                borderColor: "#fff",
              }}
            />
          </View>
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
                    style={[VaultScreenStyle.chainContainer, { marginTop: 4 }]}
                  >
                    <Text
                      style={[
                        VaultScreenStyle.chainCardText,
                        { color: isBlackText ? "#333" : "#eee" },
                      ]}
                    >
                      {card.queryChainName
                        ? card.queryChainName.charAt(0).toUpperCase() +
                          card.queryChainName.slice(1)
                        : ""}
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
                    getConvertedBalance(card.balance, card.shortName)
                  ).toFixed(2)} ${currencyUnit}`}
                </Text>
              </View>
            </>
          ) : (
            cardInfoVisible && (
              <View style={VaultScreenStyle.cardModalContent}>
                <TouchableOpacity
                  opacity={1}
                  onPress={() => handleQRCodePress(card)}
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
                          : getConvertedBalance(card.balance, card.shortName)
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
};

export default CardItem;
