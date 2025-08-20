/*
本文件用到的主要函数和钩子说明：

1. useState, useEffect, useRef, useContext（React钩子）—— 用于状态管理、生命周期、副作用、引用等。
2. useTranslation —— 国际化翻译钩子。
3. useNavigation, useRoute —— React Navigation 导航相关钩子。
4. getTokenDetails —— 获取代币详细信息的自定义函数。
5. handleConfirmConvert —— 处理“确认兑换”逻辑的自定义异步函数。
6. calcRealPrice —— 实时获取兑换汇率的自定义异步函数。
7. setXXX（如 setFromValue、setToValue 等）—— 用于更新对应状态。
8. onPress、onChangeText、onRequestClose、onConfirm、onCancel —— 事件处理函数。
9. fetch —— 用于网络请求。
10. Buffer —— 用于处理二进制数据和Base64编码。
11. console.log —— 控制台日志输出。
12. InteractionManager.runAfterInteractions —— 优化UI交互的异步操作。
13. ConfirmConvertModal —— 兑换确认弹窗组件，onConfirm/onCancel为回调函数。

如需了解具体实现，请查阅对应函数定义和调用处。
*/

import React, { useState, useEffect, useRef, useContext } from "react";
import ConfirmConvertModal from "./ConfirmConvertModal";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Platform,
  TouchableWithoutFeedback,
  InteractionManager,
} from "react-native";
import { Buffer } from "buffer";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import { convertAPI } from "../../env/apiEndpoints";
import { bluetoothConfig } from "../../env/bluetoothConfig";
import { DeviceContext, DarkModeContext } from "../../utils/DeviceContext";
import ActivityScreenStyles from "../../styles/ActivityScreenStyle";
import { handleConfirmConvert } from "../../utils/handleConfirmConvert";
const ConvertModal = ({
  visible,
  setConvertModalVisible,
  fromDropdownVisible,
  setFromDropdownVisible,
  toDropdownVisible,
  setToDropdownVisible,
  initialAdditionalCryptos,
  selectedDevice,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const ActivityScreenStyle = ActivityScreenStyles(isDarkMode);
  const router = useNavigation();
  const toChainTagsScrollRef = useRef(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [exchangeRate, setConvertRate] = useState("");
  const [selectedFromToken, setSelectedFromToken] = useState(null);
  const [selectedToToken, setSelectedToToken] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [searchFromToken, setSearchFromToken] = useState("");
  const [searchToToken, setSearchToToken] = useState("");
  const [selectedChain, setSelectedChain] = useState("All");
  const [selectedToChain, setSelectedToChain] = useState("All");
  const [chainLayouts, setChainLayouts] = useState({});
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc";
  const serviceUUID = bluetoothConfig.serviceUUID;
  const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
  const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;
  const filteredFromTokens = initialAdditionalCryptos.filter((chain) =>
    chain.name.toLowerCase().includes(searchFromToken.toLowerCase())
  );

  const filteredToTokens = initialAdditionalCryptos.filter((chain) =>
    chain.name.toLowerCase().includes(searchToToken.toLowerCase())
  );

  const isConfirmDisabled =
    !fromValue || !toValue || !selectedFromToken || !selectedToToken;

  const confirmButtonBackgroundColor = isConfirmDisabled
    ? disabledButtonBackgroundColor
    : ActivityScreenStyle.swapConfirmButton.backgroundColor;

  const chainCategories = initialAdditionalCryptos.map((crypto) => ({
    name: crypto.chain,
    chainIcon: crypto.chainIcon,
    ...crypto,
  }));

  const printedNames = new Set();

  const getTokenDetails = (token) => {
    if (!token) return null;
    return initialAdditionalCryptos.find(
      (item) => item.shortName === token.shortName && item.chain === token.chain
    );
  };

  const fromCryptoDetails = getTokenDetails(selectedFromToken);
  const toCryptoDetails = getTokenDetails(selectedToToken);

  const displayedFromValue = fromValue || "0.00";
  const displayedToValue = toValue || "0.00";

  const currencySymbol = "$";
  const visibleToTokens = initialAdditionalCryptos
    .filter((token) => {
      if (!selectedFromToken) return true;
      return token.chain === selectedFromToken.chain;
    })
    .filter((token) => {
      return (token.name + token.shortName)
        .toLowerCase()
        .includes(searchToToken.toLowerCase());
    });

  const calcRealPrice = async () => {
    console.log("获取实时价格");
    console.log(selectedFromToken);
    console.log(
      `CALC::FROM:${JSON.stringify(selectedFromToken)}, TO:${JSON.stringify(
        selectedToToken
      )}, AMOUNT:${fromValue}`
    );

    if (!selectedFromToken || !selectedToToken || !fromValue) {
      console.log("参数不完整，停止请求");
      return;
    }

    /*     const requestBody = {
      chain: selectedFromToken.queryChainName,
      fromTokenAddress: selectedFromToken.contractAddress,
      toTokenAddress: selectedToToken.contractAddress,
      amount: fromValue,
      accountAddress: getTokenDetails(selectedFromToken)?.address,
    }; */
    const requestBody = {
      chain: "ethereum",
      fromTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      amount: 1,
      accountAddress: "0x36F06561b946801DCa606842C9701EA3Fe850Ca2",
    };

    try {
      const response = await fetch(convertAPI.queryQuote, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const responseData = await response.json();
      console.log("API返回结果：", responseData);

      if (responseData?.code === "0" && responseData?.data?.length > 0) {
        const result = responseData.data[0];

        const rate = result.instantRate;

        setConvertRate(rate);

        console.log("即时汇率是：", rate);

        if (fromValue && rate) {
          const calculatedToValue = (
            parseFloat(fromValue) * parseFloat(rate)
          ).toFixed(6);
          setToValue(calculatedToValue);
        }
      } else {
        console.log("接口返回异常或无数据");
      }
    } catch (error) {
      console.log("Error fetching price:", error);
    }
  };

  useEffect(() => {
    console.log("[ConvertModal] useEffect触发了");
    console.log("selectedFromToken:", selectedFromToken);
    console.log("selectedToToken:", selectedToToken);
    console.log("fromValue:", fromValue);

    if (selectedFromToken && selectedToToken && !!fromValue) {
      console.log("[ConvertModal] 条件满足，调用 calcRealPrice");
      calcRealPrice();
    } else {
      console.log("[ConvertModal] 条件不满足，暂时不请求价格");
    }
  }, [selectedFromToken, selectedToToken, fromValue]);

  useEffect(() => {
    if (!toDropdownVisible || !selectedFromToken) return;

    InteractionManager.runAfterInteractions(() => {
      const chainName = selectedFromToken.chain;
      const layout = chainLayouts[chainName];

      if (toChainTagsScrollRef.current && layout) {
        toChainTagsScrollRef.current.scrollTo({
          x: layout.x - 20,
          animated: false,
        });
      } else {
        //  console.log("⛔ scrollRef 或 layout not ready");
      }
    });
  }, [toDropdownVisible, selectedFromToken, chainLayouts]);
  useEffect(() => {
    if (visible) {
      // 清空所有输入和选择
      setSelectedFromToken(null);
      setSelectedToToken(null);
      setFromValue("");
      setToValue("");
      setSearchFromToken("");
      setSearchToToken("");
      setSelectedChain("All");
      setSelectedToChain("All");
      setConvertRate("");
      setChainLayouts({});
    }
  }, [visible]);
  return (
    <>
      {/* Convert Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setConvertModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={ActivityScreenStyle.convertModalFlex1}
        >
          <TouchableWithoutFeedback
            onPress={() => setConvertModalVisible(false)}
          >
            <BlurView intensity={20} style={ActivityScreenStyle.centeredView}>
              <View
                style={ActivityScreenStyle.ConvertModalView}
                onStartShouldSetResponder={() => true}
              >
                {/* From Section */}
                <View style={ActivityScreenStyle.convertModalSection}>
                  <View style={ActivityScreenStyle.convertModalAlignStart}>
                    <View style={ActivityScreenStyle.swapInputContainer}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                      >
                        <TextInput
                          style={[
                            ActivityScreenStyle.swapInput,
                            ActivityScreenStyle.convertModalTextInput,
                          ]}
                          value={fromValue}
                          onChangeText={setFromValue}
                          placeholder={t("0.0")}
                          placeholderTextColor="#aaa"
                          keyboardType="numeric"
                          multiline={true}
                        />
                        <Text
                          style={[
                            ActivityScreenStyle.subtitleText,
                            ActivityScreenStyle.convertModalSubtitleText,
                          ]}
                        >
                          {`${currencySymbol}${displayedFromValue}`}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            ActivityScreenStyle.modalTitle,
                            ActivityScreenStyle.convertModalModalTitle,
                          ]}
                        >
                          {t("From")}
                        </Text>
                        <TouchableOpacity
                          style={ActivityScreenStyle.tokenSelect}
                          onPress={() => {
                            setFromDropdownVisible(!fromDropdownVisible);
                            setToDropdownVisible(false);
                          }}
                        >
                          {/* Display token icon and name */}
                          {selectedFromToken ? (
                            <>
                              <Image
                                source={
                                  getTokenDetails(selectedFromToken)?.chainIcon
                                }
                                style={
                                  ActivityScreenStyle.convertModalTokenIcon
                                }
                              />

                              <Text style={ActivityScreenStyle.subtitleText}>
                                {getTokenDetails(selectedFromToken)?.name}
                              </Text>
                            </>
                          ) : (
                            <Text style={ActivityScreenStyle.subtitleText}>
                              {t("Select token")}
                            </Text>
                          )}
                          <Icon name="arrow-drop-down" size={24} color="#ccc" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* From Dropdown */}
                  {fromDropdownVisible && (
                    <View style={ActivityScreenStyle.fromDropdown}>
                      <TextInput
                        style={[
                          ActivityScreenStyle.searchInput,
                          {
                            marginBottom: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 5,
                          },
                        ]}
                        placeholder={t("Enter cryptocurrency name...")}
                        placeholderTextColor="#aaa"
                        onChangeText={(text) => setSearchFromToken(text)}
                      />
                      <View
                        style={{
                          marginBottom: 6,
                        }}
                      >
                        <ScrollView
                          horizontal
                          style={{
                            height: 34,
                            paddingHorizontal: 10,
                          }}
                          showsHorizontalScrollIndicator={false}
                        >
                          <TouchableOpacity
                            key="All"
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              paddingVertical: 5,
                              paddingHorizontal: 10,
                              marginRight: 8,
                              borderRadius: 6,
                              backgroundColor: isDarkMode
                                ? selectedChain === "All"
                                  ? "#3F3D3C"
                                  : "#CCB68C"
                                : selectedChain === "All"
                                ? "#E5E1E9"
                                : "#e0e0e0",
                            }}
                            onPress={() => setSelectedChain("All")}
                          >
                            <Text style={[ActivityScreenStyle.chainTagText]}>
                              {t("All")}
                            </Text>
                          </TouchableOpacity>

                          {[
                            ...new Set(
                              chainCategories.map((chain) => chain.chain)
                            ),
                          ].map((chain) => (
                            <TouchableOpacity
                              key={chain}
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                                paddingVertical: 5,
                                paddingHorizontal: 10,
                                marginRight: 8,
                                borderRadius: 6,
                                backgroundColor: isDarkMode
                                  ? selectedChain === chain
                                    ? "#3F3D3C"
                                    : "#CCB68C"
                                  : selectedChain === chain
                                  ? "#E5E1E9"
                                  : "#e0e0e0",
                              }}
                              onPress={() => setSelectedChain(chain)}
                            >
                              <Image
                                source={
                                  chainCategories.find(
                                    (category) => category.chain === chain
                                  )?.chainIcon
                                }
                                style={
                                  ActivityScreenStyle.convertModalTokenIconSmall
                                }
                              />
                              <Text style={[ActivityScreenStyle.chainTagText]}>
                                {chain}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      </View>

                      <ScrollView>
                        {filteredFromTokens
                          .filter(
                            (token) =>
                              selectedChain === "All" ||
                              token.chain === selectedChain
                          ) // 重点筛选逻辑
                          .map((chain, index) => (
                            <TouchableOpacity
                              key={`${chain.shortName}-${index}`}
                              style={[
                                ActivityScreenStyle.chainTag,
                                selectedFromToken === chain.shortName &&
                                  ActivityScreenStyle.selectedChainTag,
                              ]}
                              onPress={() => {
                                setSelectedFromToken({
                                  shortName: chain.shortName,
                                  chain: chain.chain, // 🔥这里把chain也记下来
                                });
                                setFromDropdownVisible(false);

                                const selectedFrom = getTokenDetails(
                                  chain.shortName
                                );
                                const selectedTo =
                                  getTokenDetails(selectedToToken);

                                console.log("选择From Token后打印：", {
                                  chain: selectedFrom?.queryChainName,
                                  fromTokenAddress:
                                    selectedFrom?.contractAddress,
                                  toTokenAddress: selectedTo?.contractAddress,
                                  amount: fromValue,
                                  accountAddress: selectedFrom?.address,
                                });

                                const chainName = selectedFrom?.chain;
                                if (!chainName) return;

                                setSelectedToChain(chainName);

                                const chainList = [
                                  ...new Set(
                                    chainCategories.map((item) => item.chain)
                                  ),
                                ];
                                const index = chainList.indexOf(chainName);
                                if (
                                  toChainTagsScrollRef.current &&
                                  index !== -1
                                ) {
                                  setTimeout(() => {
                                    // 🔥加setTimeout确保scrollView已经渲染完
                                    const BUTTON_WIDTH = 80;
                                    const scrollX = index * (BUTTON_WIDTH + 8);
                                    toChainTagsScrollRef.current.scrollTo({
                                      x: scrollX,
                                      animated: true,
                                    });
                                  }, 0);
                                }
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  source={chain.chainIcon}
                                  style={{
                                    width: 24,
                                    height: 24,
                                    marginRight: 8,
                                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                                    borderRadius: 12,
                                  }}
                                />
                                <Text
                                  style={[
                                    ActivityScreenStyle.chainTagText,
                                    selectedFromToken === chain.shortName &&
                                      ActivityScreenStyle.selectedChainTagText,
                                  ]}
                                >
                                  {chain.name}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {/* Convert Button */}
                <View style={ActivityScreenStyle.convertModalButtonSwap}>
                  <TouchableOpacity
                    style={ActivityScreenStyle.swapButton}
                    onPress={() => {
                      const tempValue = fromValue;
                      setFromValue(toValue);
                      setToValue(tempValue);

                      const tempToken = selectedFromToken;
                      setSelectedFromToken(selectedToToken);
                      setSelectedToToken(tempToken);
                    }}
                  >
                    <Icon name="swap-vert" size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
                {/* To Section */}
                <View style={ActivityScreenStyle.convertModalSection2}>
                  <View style={ActivityScreenStyle.convertModalAlignStart}>
                    <View style={ActivityScreenStyle.swapInputContainer}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "column",
                          alignItems: "flex-start",
                          width: "100%",
                        }}
                      >
                        <TextInput
                          editable={false}
                          style={[
                            ActivityScreenStyle.swapInput,
                            {
                              fontSize: 26,
                              fontWeight: "bold",
                              textAlign: "left",
                            },
                          ]}
                          value={toValue}
                          // onChangeText={setToValue}
                          placeholder={t("0.0")}
                          placeholderTextColor="#aaa"
                          keyboardType="numeric"
                          multiline={true}
                        />
                        <Text
                          style={[
                            ActivityScreenStyle.subtitleText,
                            {
                              textAlign: "left",
                              width: "100%",
                              marginLeft: 12,
                            },
                          ]}
                        >
                          {`${currencySymbol}${displayedToValue}`}
                        </Text>
                      </View>
                      <View>
                        <Text
                          style={[
                            ActivityScreenStyle.modalTitle,
                            { marginBottom: 6 },
                          ]}
                        >
                          {t("To")}
                        </Text>
                        <TouchableOpacity
                          style={ActivityScreenStyle.tokenSelect}
                          onPress={() => {
                            setToDropdownVisible(!toDropdownVisible);
                            setFromDropdownVisible(false);
                          }}
                        >
                          {/* Display token icon and name */}
                          {selectedToToken ? (
                            <>
                              <Image
                                source={
                                  getTokenDetails(selectedToToken)?.chainIcon
                                }
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 10,
                                  marginRight: 8,
                                }}
                              />
                              <Text style={ActivityScreenStyle.subtitleText}>
                                {getTokenDetails(selectedToToken)?.name}
                              </Text>
                            </>
                          ) : (
                            <Text style={ActivityScreenStyle.subtitleText}>
                              {t("Select token")}
                            </Text>
                          )}
                          <Icon name="arrow-drop-down" size={24} color="#ccc" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* To Dropdown */}
                  {toDropdownVisible && (
                    <View style={ActivityScreenStyle.toDropdown}>
                      {/* 搜索区域 */}
                      <TextInput
                        style={[
                          ActivityScreenStyle.searchInput,
                          {
                            marginBottom: 10,
                            paddingHorizontal: 8,
                            paddingVertical: 5,
                          },
                        ]}
                        placeholder={t("Enter cryptocurrency name...")}
                        placeholderTextColor="#aaa"
                        onChangeText={(text) => setSearchToToken(text)}
                      />
                      <View
                        style={ActivityScreenStyle.convertModalMarginBottom6}
                      >
                        <ScrollView
                          ref={toChainTagsScrollRef}
                          horizontal
                          style={{
                            height: 34,
                            paddingHorizontal: 10,
                          }}
                          showsHorizontalScrollIndicator={false}
                        >
                          {/* All按钮处理 */}
                          {(() => {
                            const fromTokenDetails =
                              getTokenDetails(selectedFromToken);
                            const fromTokenChain = fromTokenDetails?.chain;
                            const isAllDisabled = !!selectedFromToken; // 有selectedFromToken就禁用All

                            return (
                              <TouchableOpacity
                                key="All"
                                disabled={isAllDisabled}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingVertical: 5,
                                  paddingHorizontal: 10,
                                  marginRight: 8,
                                  borderRadius: 6,
                                  backgroundColor: isDarkMode
                                    ? selectedToChain === "All"
                                      ? "#6B5F5B"
                                      : "#3F3D3C"
                                    : selectedToChain === "All"
                                    ? "#DADADA"
                                    : "#F0F0F0",
                                  opacity: isAllDisabled ? 0.4 : 1, // 🔥禁用All，半透明
                                }}
                                onPress={() => {
                                  if (!isAllDisabled) {
                                    setSelectedToChain("All");
                                  }
                                }}
                              >
                                <Text
                                  style={[ActivityScreenStyle.chainTagText]}
                                >
                                  {t("All")}
                                </Text>
                              </TouchableOpacity>
                            );
                          })()}

                          {/* 其他链按钮处理 */}
                          {[
                            ...new Set(
                              chainCategories.map((chain) => chain.chain)
                            ),
                          ].map((chain) => {
                            const fromTokenDetails =
                              getTokenDetails(selectedFromToken);
                            const fromTokenChain = fromTokenDetails?.chain;
                            const isDisabled =
                              selectedFromToken && fromTokenChain !== chain; // 🔥这里判断

                            return (
                              <TouchableOpacity
                                key={chain}
                                disabled={isDisabled}
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  paddingVertical: 5,
                                  paddingHorizontal: 10,
                                  marginRight: 8,
                                  borderRadius: 6,
                                  backgroundColor: isDarkMode
                                    ? selectedToChain === chain
                                      ? "#3F3D3C"
                                      : "#CCB68C"
                                    : selectedToChain === chain
                                    ? "#E5E1E9"
                                    : "#e0e0e0",
                                  opacity: isDisabled ? 0.4 : 1,
                                }}
                                onLayout={(event) => {
                                  const layout = event.nativeEvent.layout;
                                  setChainLayouts((prev) => ({
                                    ...prev,
                                    [chain]: layout, // 把当前这个链的布局信息保存
                                  }));
                                }}
                                onPress={() => {
                                  if (!isDisabled) {
                                    setSelectedToChain(chain);
                                  }
                                }}
                              >
                                <Image
                                  source={
                                    chainCategories.find(
                                      (category) => category.chain === chain
                                    )?.chainIcon
                                  }
                                  style={
                                    ActivityScreenStyle.convertModalTokenIconTo
                                  }
                                />
                                <Text
                                  style={[ActivityScreenStyle.chainTagText]}
                                >
                                  {chain}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>

                      <ScrollView>
                        {visibleToTokens.map((chain, index) => (
                          <TouchableOpacity
                            key={`${chain.shortName}-${index}`}
                            style={[
                              ActivityScreenStyle.chainTag,
                              selectedToToken === chain.shortName &&
                                ActivityScreenStyle.selectedChainTag,
                            ]}
                            onPress={() => {
                              setSelectedToToken({
                                shortName: chain.shortName,
                                chain: chain.chain, // 🔥同样记下来chain
                              });
                              setToDropdownVisible(false);

                              const selectedFrom =
                                getTokenDetails(selectedFromToken);
                              const selectedTo = getTokenDetails(chain);

                              console.log("选择To Token后打印：", {
                                chain: selectedFrom?.queryChainName,
                                fromTokenAddress: selectedFrom?.contractAddress,
                                toTokenAddress: selectedTo?.contractAddress,
                                amount: fromValue,
                                accountAddress: selectedFrom?.address,
                              });
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                alignItems: "center",
                              }}
                            >
                              <Image
                                source={chain.chainIcon}
                                style={
                                  ActivityScreenStyle.convertModalTokenIconToLarge
                                }
                              />
                              <Text
                                style={[
                                  ActivityScreenStyle.chainTagText,
                                  selectedToToken === chain.shortName &&
                                    ActivityScreenStyle.selectedChainTagText,
                                ]}
                              >
                                {chain.name}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>
                {exchangeRate && (
                  <Text
                    style={{
                      textAlign: "center",
                      color: isDarkMode ? "#ccc" : "#333",
                      textAlign: "left",
                      fontSize: 14,
                      width: "100%",
                      fontSize: 14,
                    }}
                  >
                    1 {getTokenDetails(selectedFromToken)?.symbol} ≈{" "}
                    {exchangeRate} {getTokenDetails(selectedToToken)?.symbol}
                  </Text>
                )}
                <View style={ActivityScreenStyle.convertModalButtonRow}>
                  <TouchableOpacity
                    onPress={() => setConvertModalVisible(false)}
                    style={[
                      ActivityScreenStyle.cancelButton,
                      {
                        flex: 1,
                        marginRight: 10,
                        borderRadius: 15,
                      },
                    ]}
                  >
                    <Text style={ActivityScreenStyle.cancelButtonText}>
                      {t("Close")}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    disabled={
                      !(selectedFromToken && selectedToToken && fromValue)
                    }
                    onPress={() => {
                      setConvertModalVisible(false);
                      setConfirmModalVisible(true);
                    }}
                    style={[
                      ActivityScreenStyle.swapConfirmButton,
                      {
                        flex: 1,
                        marginLeft: 10,
                        borderRadius: 15,
                        backgroundColor: !(
                          selectedFromToken &&
                          selectedToToken &&
                          fromValue
                        )
                          ? disabledButtonBackgroundColor
                          : ActivityScreenStyle.swapConfirmButton
                              .backgroundColor,
                      },
                    ]}
                  >
                    <Text style={ActivityScreenStyle.submitButtonText}>
                      {t("Confirm")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      <ConfirmConvertModal
        visible={confirmModalVisible}
        onConfirm={async () => {
          setConfirmModalVisible(false);
          await handleConfirmConvert({
            selectedFromToken,
            selectedToToken,
            fromValue,
            setConvertModalVisible,
            setConfirmModalVisible,
            getTokenDetails,
            selectedDevice,
            convertAPI,
            bluetoothConfig,
          });
        }}
        onCancel={() => setConfirmModalVisible(false)}
        ActivityScreenStyle={ActivityScreenStyle}
        t={t}
        getTokenDetails={getTokenDetails}
        selectedFromToken={selectedFromToken}
        selectedToToken={selectedToToken}
        fromValue={fromValue}
        toValue={toValue}
        exchangeRate={exchangeRate}
      />
    </>
  );
};

export default ConvertModal;
