import React, { useState, useEffect } from "react";
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
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc";

  const [selectedFromToken, setSelectedFromToken] = useState("");
  const [selectedToToken, setSelectedToToken] = useState("");
  const [toValue, setToValue] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [searchFromToken, setSearchFromToken] = useState("");
  const [searchToToken, setSearchToToken] = useState("");

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

  // Helper function to get the token details including the icon and name
  const getTokenDetails = (tokenShortName) => {
    return initialAdditionalCryptos.find(
      (token) => token.shortName === tokenShortName
    );
  };

  // Get the selected crypto details for "From" and "To" tokens
  const fromCryptoDetails = getTokenDetails(selectedFromToken);
  const toCryptoDetails = getTokenDetails(selectedToToken);

  const displayedFromValue = fromValue || "0.00";
  const displayedToValue = toValue || "0.00";

  const currencySymbol = "$";

  const router = useNavigation();

  // Function to handle confirm button in SwapModal
  const handleConfirmSwap = () => {
    if (!selectedFromToken || !selectedToToken || !fromValue)
      return alert("输入完整数据.");

    // Close SwapModal first
    setSwapModalVisible(false);

    // Open the transaction confirmation modal after SwapModal is closed
    setTimeout(() => {
      router.navigate("Request Wallet Auth", {
        fromValue,
        from: selectedFromToken,
        to: selectedToToken,
        toValue,
        fromAddress: "0x198198219821982",
        toAddress: "0x11212121212",
        dapp: "",
        data: { text: "放入API请求完整数据包" },
      });

      // setConfirmModalVisible(true);
    }, 500); // Adding a delay to ensure SwapModal is completely closed before showing the next modal
  };

  const calcRealPrice = async () => {
    console.log("获取实时价格");
    console.log(selectedFromToken);
    console.warn(
      `CALC::FROM:${selectedFromToken}, TO:${selectedToToken}, AMOUNT:${fromValue}`
    );

    // Define the request body for the POST request
    const requestBody = {
      chain: "ethereum", // Replace with the actual chain if needed
      fromTokenAddress: selectedFromToken, // Replace with the actual token address
      toTokenAddress: selectedToToken, // Replace with the actual token address
      amount: fromValue, // Ensure the amount is in the correct format (e.g., wei for ETH)
      accountAddress: "0xaF872D2dAae0DE52F6951dD3d32812553DF15f34", // Replace with the actual account address
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
      console.warn(data); // Log the response data

      // You can use the response data here to update the UI as needed
      console.warn("更新数据到UI");
    } catch (error) {
      console.error("Error fetching price:", error);
    }
  };

  useEffect(() => {
    if (selectedFromToken && selectedToToken && !!fromValue) {
      calcRealPrice();
    }
  }, [selectedFromToken, selectedToToken, fromValue]);

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
          style={TransactionsScreenStyle.centeredView}
        >
          <TouchableWithoutFeedback onPress={() => setSwapModalVisible(false)}>
            <BlurView
              intensity={10}
              style={TransactionsScreenStyle.centeredView}
            >
              <View style={TransactionsScreenStyle.swapModalView}>
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

                      <ScrollView>
                        {filteredFromTokens.map((chain, index) => (
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
                      {/* 滚动区域 */}
                      <ScrollView>
                        {filteredToTokens.map((chain, index) => (
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
