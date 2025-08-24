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
  onColorExtracted, // 新增：色值回调
}) => {
  // 典型色 state
  const [mainColor, setMainColor] = useState("#ffffff");
  const [secondaryColor, setSecondaryColor] = useState("#cccccc");

  const clamp01 = (v) => Math.min(1, Math.max(0, v));

  // 把明度拉到安全区间（过暗提亮，过亮压暗）
  function normalizeLightness(
    hex,
    { minL = 0.45, maxL = 0.85, targetL = 0.58 } = {}
  ) {
    const { h, s, l } = hexToHsl(hex);
    let nl = l;
    if (l < minL) nl = targetL;
    else if (l > maxL) nl = targetL;
    return hslToHex(h, s, nl);
  }

  // 颜色太灰时，给一点最小饱和度
  function ensureSaturation(hex, minS = 0.25) {
    const hsl = hexToHsl(hex);
    if (hsl.s < minS) hsl.s = minS;
    return hslToHex(hsl.h, hsl.s, hsl.l);
  }

  // 简单的 HEX -> HSL -> HEX 转换
  function hexToHsl(hex) {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const rPerc = r / 255;
    const gPerc = g / 255;
    const bPerc = b / 255;

    const max = Math.max(rPerc, gPerc, bPerc);
    const min = Math.min(rPerc, gPerc, bPerc);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // 灰色
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rPerc:
          h = (gPerc - bPerc) / d + (gPerc < bPerc ? 6 : 0);
          break;
        case gPerc:
          h = (bPerc - rPerc) / d + 2;
          break;
        case bPerc:
          h = (rPerc - gPerc) / d + 4;
          break;
      }
      h *= 60;
    }
    return { h, s, l };
  }

  function hslToHex(h, s, l) {
    s = Math.max(0, Math.min(1, s));
    l = Math.max(0, Math.min(1, l));
    h = ((h % 360) + 360) % 360;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r = 0,
      g = 0,
      b = 0;

    if (h < 60) {
      r = c;
      g = x;
    } else if (h < 120) {
      r = x;
      g = c;
    } else if (h < 180) {
      g = c;
      b = x;
    } else if (h < 240) {
      g = x;
      b = c;
    } else if (h < 300) {
      r = x;
      b = c;
    } else {
      r = c;
      b = x;
    }

    const toHex = (v) => {
      const n = Math.round((v + m) * 255);
      return n.toString(16).padStart(2, "0");
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  function generateSecondaryFromMain(mainHex, shift = 120) {
    const { h, s, l } = hexToHsl(mainHex);
    return hslToHex(h + shift, s, l);
  }

  // 若 secondary 与 main 明度太接近，拉开一点
  function separateLightness(mainHex, secondaryHex, minDeltaL = 0.12) {
    const m = hexToHsl(mainHex);
    const s = hexToHsl(secondaryHex);
    if (Math.abs(m.l - s.l) < minDeltaL) {
      // 根据主色的明度，选择提亮或压暗副色
      s.l =
        m.l > 0.5 ? Math.max(0, m.l - minDeltaL) : Math.min(1, m.l + minDeltaL);
    }
    return hslToHex(s.h, s.s, s.l);
  }

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
          let main = "#ffffff";
          let secondary = "#cccccc";

          if (colors.platform === "android" || colors.platform === "ios") {
            // iOS/Android：用 background 更接近整体基调，若没有则回退 primary
            main = colors.background || colors.primary || "#ffffff";
          } else if (colors.platform === "web") {
            // Web：lightVibrant 没有就回 dominant
            main = colors.lightVibrant || colors.dominant || "#ffffff";
          }

          // 关键：暗就提亮、亮就压暗；太灰就加点饱和度
          main = normalizeLightness(main, {
            minL: 0.45,
            maxL: 0.85,
            targetL: 0.58,
          });
          main = ensureSaturation(main, 0.25);
          secondary = generateSecondaryFromMain(main, 15);
          secondary = ensureSaturation(secondary, 0.25);
          secondary = normalizeLightness(secondary, {
            minL: 0.35,
            maxL: 0.9,
            targetL: 0.5,
          });
          secondary = separateLightness(main, secondary, 0.12);

          setMainColor(main);
          setSecondaryColor(secondary);

          if (onColorExtracted && selectedCardIndex === index) {
            onColorExtracted(main, secondary, card, index);
          }
        })

        .catch(() => {
          setMainColor("#ffffff");
          setSecondaryColor("#cccccc");
          if (onColorExtracted && selectedCardIndex === index) {
            onColorExtracted("#ffffff", "#cccccc", card, index);
          }
        });
    }
  }, [card.cardImage, selectedCardIndex]);

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
