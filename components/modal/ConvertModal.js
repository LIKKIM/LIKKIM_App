import React, { useState, useEffect, useRef, useContext } from "react";
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

  const handleConfirmConvert = async () => {
    if (!selectedFromToken || !selectedToToken || !fromValue) {
      console.log("缺少必要参数，无法执行Convert");
      return;
    }

    setConvertModalVisible(false);
    setConfirmModalVisible(true);
    try {
      const fromDetails = getTokenDetails(selectedFromToken);
      const toDetails = getTokenDetails(selectedToToken);

      if (!fromDetails || !toDetails) {
        console.log("找不到代币详情");
        return;
      }
      /* 
      const requestBody = {
        chain: fromDetails.queryChainName || "ethereum",
        fromTokenAddress: fromDetails.contractAddress,
        toTokenAddress: toDetails.contractAddress,
        amount: fromValue.toString(),
        userWalletAddress: fromDetails.address,
        slippage: "1",
        provider: "openocean",
      };
 */

      const requestBody = {
        chain: "ethereum",
        fromTokenAddress: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        toTokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
        amount: fromValue.toString(),
        userWalletAddress: "0x36F06561b946801DCa606842C9701EA3Fe850Ca2",
        slippage: "1",
        provider: "openocean",
      };

      console.log("准备发起Convert请求：", requestBody);

      const response = await fetch(convertAPI.executeConvert, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error("网络请求失败");

      const responseData = await response.json();
      //console.log("Convert API返回：", responseData);

      if (responseData?.code === "0") {
        console.log("Convert成功");
        console.log("交易签名Data：", responseData.data?.data);

        // 👉 新增：把Convert返回的data封装成sign消息发给设备
        const hexToSign = responseData.data.data;
        const chainKey = "ethereum"; // 这里先固定，如果以后支持其他链，记得做成动态
        const path = "m/44'/60'/0'/0/0"; // 你的默认BIP44路径

        const signMessage = `sign:${chainKey},${path},${hexToSign}`;
        const signBuffer = Buffer.from(signMessage, "utf-8");
        const signBase64 = signBuffer.toString("base64");

        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          signBase64
        );
        console.log("Convert的sign消息已发送给设备等待签名...");
      } else {
        console.log("Convert失败", responseData?.message || "未知错误");
      }
    } catch (error) {
      console.log("发送Convert请求异常:", error);
    }
  };

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
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback
            onPress={() => setConvertModalVisible(false)}
          >
            <BlurView intensity={10} style={ActivityScreenStyle.centeredView}>
              <View
                style={ActivityScreenStyle.modalView}
                onStartShouldSetResponder={() => true}
              >
                {/* From Section */}
                <View style={{ zIndex: 20 }}>
                  <View style={{ alignItems: "flex-start", width: "100%" }}>
                    <Text
                      style={[
                        ActivityScreenStyle.modalTitle,
                        { marginBottom: 6 },
                      ]}
                    >
                      {t("From")}
                    </Text>
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
                            {
                              fontSize: 30,
                              fontWeight: "bold",
                              textAlign: "left",
                            },
                          ]}
                          value={fromValue}
                          onChangeText={setFromValue}
                          placeholder={t("0.0")}
                          placeholderTextColor="#aaa"
                          keyboardType="numeric"
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
                          {`${currencySymbol}${displayedFromValue}`}
                        </Text>
                      </View>
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
                              style={{
                                width: 30,
                                height: 30,
                                borderRadius: 10,
                                marginRight: 8,
                              }}
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
                                style={{
                                  width: 14,
                                  height: 14,
                                  backgroundColor: "#CFAB9540",
                                  marginRight: 8,
                                  resizeMode: "contain",
                                  borderRadius: 10,
                                }}
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
                                    width: 30,
                                    height: 30,
                                    borderRadius: 15,
                                    marginRight: 10,
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
                <TouchableOpacity
                  style={ActivityScreenStyle.swapButton}
                  onPress={() => {
                    // Convert values
                    const tempValue = fromValue;
                    setFromValue(toValue);
                    setToValue(tempValue);

                    // Convert selected tokens
                    const tempToken = selectedFromToken;
                    setSelectedFromToken(selectedToToken);
                    setSelectedToToken(tempToken);
                  }}
                >
                  <Icon name="swap-vert" size={24} color="#fff" />
                </TouchableOpacity>

                {/* To Section */}
                <View style={{ zIndex: 10 }}>
                  <View style={{ alignItems: "flex-start", width: "100%" }}>
                    <Text
                      style={[
                        ActivityScreenStyle.modalTitle,
                        { marginBottom: 6, marginTop: -32 },
                      ]}
                    >
                      {t("To")}
                    </Text>
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
                              fontSize: 30,
                              fontWeight: "bold",
                              textAlign: "left",
                            },
                          ]}
                          value={toValue}
                          // onChangeText={setToValue}
                          placeholder={t("0.0")}
                          // placeholderTextColor="#aaa"
                          keyboardType="numeric"
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
                      <View style={{ marginBottom: 6 }}>
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
                                  style={{
                                    width: 14,
                                    height: 14,
                                    backgroundColor: "#CFAB9540",
                                    marginRight: 8,
                                    resizeMode: "contain",
                                    borderRadius: 10,
                                  }}
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
                                style={{
                                  width: 30,
                                  height: 30,
                                  borderRadius: 15,
                                  marginRight: 10,
                                }}
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
                <View>
                  {/* Confirm Button */}
                  <TouchableOpacity
                    disabled={
                      !(selectedFromToken && selectedToToken && fromValue)
                    }
                    onPress={() => {
                      setConvertModalVisible(false); // ✅先关闭主Modal
                      setConfirmModalVisible(true); // ✅打开二次确认Modal
                    }}
                    style={[
                      ActivityScreenStyle.swapConfirmButton,
                      {
                        backgroundColor: !(
                          selectedFromToken &&
                          selectedToToken &&
                          fromValue
                        )
                          ? disabledButtonBackgroundColor
                          : ActivityScreenStyle.swapConfirmButton
                              .backgroundColor,
                        marginBottom: 20,
                      },
                    ]}
                  >
                    <Text style={ActivityScreenStyle.submitButtonText}>
                      {t("Confirm")}
                    </Text>
                  </TouchableOpacity>
                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={() => setConvertModalVisible(false)}
                    style={[ActivityScreenStyle.cancelButton]}
                  >
                    <Text style={ActivityScreenStyle.cancelButtonText}>
                      {t("Close")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      {confirmModalVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={confirmModalVisible}
          onRequestClose={() => setConfirmModalVisible(false)}
        >
          <BlurView intensity={10} style={ActivityScreenStyle.centeredView}>
            <View style={ActivityScreenStyle.confirmModalView}>
              <Text style={ActivityScreenStyle.modalTitle}>
                {t("Waiting for Confirmation")}
              </Text>

              {/* 基本信息 */}
              <View style={{ marginTop: 20 }}>
                {/* 网络信息 */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Image
                    source={getTokenDetails(selectedFromToken)?.chainIcon}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                      marginBottom: 10,
                      borderRadius: 12,
                    }}
                  />
                  <Text style={ActivityScreenStyle.transactionText}>
                    {getTokenDetails(selectedFromToken)?.chain}
                  </Text>
                </View>

                {/* From -> To 信息 */}
                <Text style={ActivityScreenStyle.transactionText}>
                  {t("From")}: {getTokenDetails(selectedFromToken)?.name} (
                  {fromValue})
                </Text>
                <Text style={ActivityScreenStyle.transactionText}>
                  {t("To")}: {getTokenDetails(selectedToToken)?.name} ({toValue}
                  )
                </Text>
                <Text style={ActivityScreenStyle.transactionText}>
                  {t("Convert Rate")}: 1{" "}
                  {getTokenDetails(selectedFromToken)?.symbol} ≈ {exchangeRate}{" "}
                  {getTokenDetails(selectedToToken)?.symbol}
                </Text>

                {/* 支付合约 */}
                <Text
                  style={[
                    ActivityScreenStyle.transactionText,
                    { marginTop: 10 },
                  ]}
                >
                  {t("From Token Address")}:{" "}
                  {getTokenDetails(selectedFromToken)?.contractAddress || "-"}
                </Text>

                {/* 接收合约 */}
                <Text style={ActivityScreenStyle.transactionText}>
                  {t("To Token Address")}:{" "}
                  {getTokenDetails(selectedToToken)?.contractAddress || "-"}
                </Text>

                {/* 账户地址 */}
                <Text style={ActivityScreenStyle.transactionText}>
                  {t("Account Address")}:{" "}
                  {getTokenDetails(selectedFromToken)?.address || "-"}
                </Text>
              </View>

              {/* 确认/取消按钮 */}
              <View style={{ marginTop: 20, width: "100%" }}>
                <TouchableOpacity
                  style={ActivityScreenStyle.optionButton}
                  onPress={async () => {
                    setConfirmModalVisible(false);
                    await handleConfirmConvert(); // 🔥这里才真正去发起交易
                  }}
                >
                  <Text style={ActivityScreenStyle.submitButtonText}>
                    {t("Confirm")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={ActivityScreenStyle.cancelButton}
                  onPress={() => setConfirmModalVisible(false)}
                >
                  <Text style={ActivityScreenStyle.cancelButtonText}>
                    {t("Cancel")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </BlurView>
        </Modal>
      )}
    </>
  );
};

export default ConvertModal;
