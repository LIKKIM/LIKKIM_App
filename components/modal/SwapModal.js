import React, { useState, useEffect, useRef } from "react";

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
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import ChangellyAPI from "../TransactionScreens/ChangellyAPI";

const SwapModal = ({
  isDarkMode,
  visible,
  setSwapModalVisible,
  // fromValue,
  // setFromValue,
  // toValue,
  // setToValue,
  // selectedFromToken,
  // setSelectedFromToken,
  // selectedToToken,
  // setSelectedToToken,
  fromDropdownVisible,
  setFromDropdownVisible,
  toDropdownVisible,
  setToDropdownVisible,
  initialAdditionalCryptos,
  TransactionsScreenStyle,
}) => {
  const { t } = useTranslation();
  const router = useNavigation();
  const toChainTagsScrollRef = useRef(null);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedFromToken, setSelectedFromToken] = useState("");
  const [selectedToToken, setSelectedToToken] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [searchFromToken, setSearchFromToken] = useState("");
  const [searchToToken, setSearchToToken] = useState("");
  const [selectedChain, setSelectedChain] = useState("All");
  const [selectedToChain, setSelectedToChain] = useState("All");

  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc";

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
    : TransactionsScreenStyle.swapConfirmButton.backgroundColor;

  const chainCategories = initialAdditionalCryptos.map((crypto) => ({
    name: crypto.chain,
    chainIcon: crypto.chainIcon,
    ...crypto,
  }));

  const printedNames = new Set();

  const getTokenDetails = (tokenShortName) => {
    return initialAdditionalCryptos.find(
      (token) => token.shortName === tokenShortName
    );
  };

  const fromCryptoDetails = getTokenDetails(selectedFromToken);
  const toCryptoDetails = getTokenDetails(selectedToToken);

  const displayedFromValue = fromValue || "0.00";
  const displayedToValue = toValue || "0.00";

  const currencySymbol = "$";

  // Function to handle confirm button in SwapModal
  const handleConfirmSwap = () => {
    setSwapModalVisible(false);
  };

  const calcRealPrice = async () => {
    console.log("获取实时价格");
    console.log(selectedFromToken);
    console.log(
      `CALC::FROM:${selectedFromToken}, TO:${selectedToToken}, AMOUNT:${fromValue}`
    );

    const requestBody = {
      chain: selectedFromToken.queryChainName,
      fromTokenAddress: selectedFromToken.contractAddress,
      toTokenAddress: selectedToToken.contractAddress,
      amount: fromValue,
      accountAddress: getTokenDetails(selectedFromToken)?.address,
    };

    try {
      // Make the POST request
      const response = await fetch(
        "https://bt.likkim.com/api/aggregator/queryQuote",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Parse the response data
      const data = await response.json();
      console.log(data); // Log the response data

      // You can use the response data here to update the UI as needed
      console.log("更新数据到UI");
    } catch (error) {
      console.log("Error fetching price:", error);
    }
  };

  useEffect(() => {
    if (selectedFromToken && selectedToToken && !!fromValue) {
      calcRealPrice();
    }
  }, [selectedFromToken, selectedToToken, fromValue]);
  useEffect(() => {
    if (toDropdownVisible && selectedToChain && toChainTagsScrollRef.current) {
      const chainList = [...new Set(chainCategories.map((item) => item.chain))];
      const index = chainList.indexOf(selectedToChain);
      if (index !== -1) {
        const BUTTON_WIDTH = 80; // 每个链按钮的宽度
        const scrollX = index * (BUTTON_WIDTH + 8);
        // 等To模块真正挂载后再scroll
        setTimeout(() => {
          toChainTagsScrollRef.current.scrollTo({ x: scrollX, animated: true });
        }, 0);
      }
    }
  }, [toDropdownVisible, selectedToChain]);

  return (
    <>
      {/* Swap Modal */}
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSwapModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={() => setSwapModalVisible(false)}>
            <BlurView
              intensity={10}
              style={TransactionsScreenStyle.centeredView}
            >
              <View
                style={TransactionsScreenStyle.modalView}
                onStartShouldSetResponder={() => true}
              >
                {/* From Section */}
                <View style={{ zIndex: 20 }}>
                  <View style={{ alignItems: "flex-start", width: "100%" }}>
                    <Text
                      style={[
                        TransactionsScreenStyle.modalTitle,
                        { marginBottom: 6 },
                      ]}
                    >
                      {t("From")}
                    </Text>
                    <View style={TransactionsScreenStyle.swapInputContainer}>
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
                            TransactionsScreenStyle.swapInput,
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
                            TransactionsScreenStyle.subtitleText,
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
                        style={TransactionsScreenStyle.tokenSelect}
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
                            <Text style={TransactionsScreenStyle.subtitleText}>
                              {getTokenDetails(selectedFromToken)?.name}
                            </Text>
                          </>
                        ) : (
                          <Text style={TransactionsScreenStyle.subtitleText}>
                            {t("Select token")}
                          </Text>
                        )}
                        <Icon name="arrow-drop-down" size={24} color="#ccc" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* From Dropdown */}
                  {fromDropdownVisible && (
                    <View style={TransactionsScreenStyle.fromDropdown}>
                      <TextInput
                        style={[
                          TransactionsScreenStyle.searchInput,
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
                            <Text
                              style={[TransactionsScreenStyle.chainTagText]}
                            >
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
                              <Text
                                style={[TransactionsScreenStyle.chainTagText]}
                              >
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
                                TransactionsScreenStyle.chainTag,
                                selectedFromToken === chain.shortName &&
                                  TransactionsScreenStyle.selectedChainTag,
                              ]}
                              onPress={() => {
                                setSelectedFromToken(chain.shortName);
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
                                    TransactionsScreenStyle.chainTagText,
                                    selectedFromToken === chain.shortName &&
                                      TransactionsScreenStyle.selectedChainTagText,
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

                {/* Swap Button */}
                <TouchableOpacity
                  style={TransactionsScreenStyle.swapButton}
                  onPress={() => {
                    // Swap values
                    const tempValue = fromValue;
                    setFromValue(toValue);
                    setToValue(tempValue);

                    // Swap selected tokens
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
                        TransactionsScreenStyle.modalTitle,
                        { marginBottom: 6, marginTop: -32 },
                      ]}
                    >
                      {t("To")}
                    </Text>
                    <View style={TransactionsScreenStyle.swapInputContainer}>
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
                            TransactionsScreenStyle.swapInput,
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
                            TransactionsScreenStyle.subtitleText,
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
                        style={TransactionsScreenStyle.tokenSelect}
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
                            <Text style={TransactionsScreenStyle.subtitleText}>
                              {getTokenDetails(selectedToToken)?.name}
                            </Text>
                          </>
                        ) : (
                          <Text style={TransactionsScreenStyle.subtitleText}>
                            {t("Select token")}
                          </Text>
                        )}
                        <Icon name="arrow-drop-down" size={24} color="#ccc" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* To Dropdown */}
                  {toDropdownVisible && (
                    <View style={TransactionsScreenStyle.toDropdown}>
                      {/* 搜索区域 */}
                      <TextInput
                        style={[
                          TransactionsScreenStyle.searchInput,
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
                                  style={[TransactionsScreenStyle.chainTagText]}
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
                                  style={[TransactionsScreenStyle.chainTagText]}
                                >
                                  {chain}
                                </Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                      </View>

                      <ScrollView>
                        {filteredToTokens
                          .filter(
                            (token) =>
                              selectedToChain === "All" ||
                              token.chain === selectedToChain
                          )
                          .map((chain, index) => (
                            <TouchableOpacity
                              key={`${chain.shortName}-${index}`}
                              style={[
                                TransactionsScreenStyle.chainTag,
                                selectedToToken === chain.shortName &&
                                  TransactionsScreenStyle.selectedChainTag,
                              ]}
                              onPress={() => {
                                setSelectedToToken(chain.shortName);
                                setToDropdownVisible(false);

                                const selectedFrom =
                                  getTokenDetails(selectedFromToken);
                                const selectedTo = getTokenDetails(
                                  chain.shortName
                                );
                                console.log("选择To Token后打印：", {
                                  chain: selectedFrom?.queryChainName,
                                  fromTokenAddress:
                                    selectedFrom?.contractAddress,
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
                                    TransactionsScreenStyle.chainTagText,
                                    selectedToToken === chain.shortName &&
                                      TransactionsScreenStyle.selectedChainTagText,
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

                <View>
                  {/* Confirm Button */}
                  <TouchableOpacity
                    disabled={
                      !(selectedFromToken && selectedToToken && fromValue)
                    }
                    onPress={handleConfirmSwap}
                    style={[
                      TransactionsScreenStyle.swapConfirmButton,
                      {
                        backgroundColor: !(
                          selectedFromToken &&
                          selectedToToken &&
                          fromValue
                        )
                          ? disabledButtonBackgroundColor
                          : TransactionsScreenStyle.swapConfirmButton
                              .backgroundColor,
                        marginBottom: 20,
                      },
                    ]}
                  >
                    <Text style={TransactionsScreenStyle.submitButtonText}>
                      {t("Confirm")}
                    </Text>
                  </TouchableOpacity>

                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={() => setSwapModalVisible(false)}
                    style={[
                      TransactionsScreenStyle.cancelButton,
                      { marginBottom: 10 },
                    ]}
                  >
                    <Text style={TransactionsScreenStyle.cancelButtonText}>
                      {t("Close")}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

export default SwapModal;
