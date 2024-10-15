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
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next";
import { useNavigation, useRoute } from "@react-navigation/native";
import ChangellyAPI from "../transactionScreens/ChangellyAPI";

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
  const { t } = useTranslation(); // i18n translation hook
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const disabledButtonBackgroundColor = isDarkMode ? "#6c6c6c" : "#ccc"; // 根据 isDarkMode

  const [selectedFromToken, setSelectedFromToken] = useState('');
  const [selectedToToken, setSelectedToToken] = useState('');
  const [toValue, setToValue] = useState('');
  const [fromValue, setFromValue] = useState('');

  // 确定是否禁用按钮
  const isConfirmDisabled =
    !fromValue || !toValue || !selectedFromToken || !selectedToToken;

  // 按钮背景色动态设置
  const confirmButtonBackgroundColor = isConfirmDisabled
    ? disabledButtonBackgroundColor // 如果禁用，则使用灰色
    : TransactionsScreenStyle.swapConfirmButton.backgroundColor; // 正常状态下使用默认颜色

  // Helper function to get the token details including the icon and name
  const getTokenDetails = (tokenShortName) => {
    return initialAdditionalCryptos.find(
      (token) => token.shortName === tokenShortName
    );
  };

  // Get the selected crypto details for "From" and "To" tokens
  const fromCryptoDetails = getTokenDetails(selectedFromToken);
  const toCryptoDetails = getTokenDetails(selectedToToken);
  // 动态获取用户输入的值（保持原样）
  const displayedFromValue = fromValue || "0.00"; // 如果没有输入，显示 "0.00"
  const displayedToValue = toValue || "0.00"; // 如果没有输入，显示 "0.00"

  // 获取货币单位符号
  const currencySymbol = "$"; // 根据需要替换为你项目中实际使用的货币符号


  const router = useNavigation()

  // Function to handle confirm button in SwapModal
  const handleConfirmSwap = () => {

    if (!selectedFromToken || !selectedToToken || !fromValue) return alert('输入完整数据.')

    // Close SwapModal first
    setSwapModalVisible(false);

    // Open the transaction confirmation modal after SwapModal is closed
    setTimeout(() => {



      router.navigate('Request Wallet Auth', { fromValue, from: selectedFromToken, to: selectedToToken, toValue, fromAddress: '0x198198219821982', toAddress: '0x11212121212', dapp: '', data: { 'text': "放入API请求完整数据包" } })

      // setConfirmModalVisible(true);
    }, 500); // Adding a delay to ensure SwapModal is completely closed before showing the next modal
  };


  //计算实时价格
  const calcRealPrice = async () => {


    console.log('获取实时价格')
    console.log(selectedFromToken)
    console.warn(`CALC::FROM:${selectedFromToken}, TO:${selectedToToken}, AMOUNT:${fromValue}}`);
    let calcPrice = await ChangellyAPI.getExchangeAmount(selectedFromToken, selectedToToken, fromValue);
    console.warn(calcPrice);
    console.warn('更新数据到UI');

  }


  useEffect(() => {


    //实时刷新数据
    if (selectedFromToken && selectedToToken && !!fromValue) {

      calcRealPrice();
    }


  }, [selectedFromToken, selectedToToken, fromValue])



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
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
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
                      onPress={() =>
                        setFromDropdownVisible(!fromDropdownVisible)
                      }
                    >
                      {/* Display token icon and name */}
                      {selectedFromToken ? (
                        <>
                          <Image
                            source={
                              getTokenDetails(selectedFromToken)?.chainIcon
                            }
                            style={{
                              width: 20,
                              height: 20,
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
                  <ScrollView style={TransactionsScreenStyle.fromDropdown}>
                    {initialAdditionalCryptos.map((chain, index) => (
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
                              width: 20,
                              height: 20,
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
                      onPress={() => setToDropdownVisible(!toDropdownVisible)}
                    >
                      {/* Display token icon and name */}
                      {selectedToToken ? (
                        <>
                          <Image
                            source={getTokenDetails(selectedToToken)?.chainIcon}
                            style={{
                              width: 20,
                              height: 20,
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
                  <ScrollView style={TransactionsScreenStyle.toDropdown}>
                    {initialAdditionalCryptos.map((chain, index) => (
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
                              width: 20,
                              height: 20,
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
                )}
              </View>

              <View>
                {/* Confirm Button */}
                <TouchableOpacity
                  disabled={!(selectedFromToken && selectedToToken && fromValue)} // 根据状态禁用按钮
                  onPress={handleConfirmSwap}
                  style={[
                    TransactionsScreenStyle.swapConfirmButton,
                    {
                      backgroundColor: !(selectedFromToken && selectedToToken && fromValue) ? disabledButtonBackgroundColor // 如果禁用，则使用灰色
                        : TransactionsScreenStyle.swapConfirmButton.backgroundColor,
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
        </KeyboardAvoidingView>
      </Modal>


    </>
  );
};

export default SwapModal;
