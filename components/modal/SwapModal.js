import React, { useState } from "react";
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

const SwapModal = ({
  isDarkMode,
  visible,
  setSwapModalVisible,
  fromValue,
  setFromValue,
  toValue,
  setToValue,
  selectedFromToken,
  setSelectedFromToken,
  selectedToToken,
  setSelectedToToken,
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

  // Function to handle confirm button in SwapModal
  const handleConfirmSwap = () => {
    // Close SwapModal first
    setSwapModalVisible(false);

    // Open the transaction confirmation modal after SwapModal is closed
    setTimeout(() => {
      setConfirmModalVisible(true);
    }, 500); // Adding a delay to ensure SwapModal is completely closed before showing the next modal
  };

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
                        {t("$0.00")}
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
                        style={[
                          TransactionsScreenStyle.swapInput,
                          {
                            fontSize: 30,
                            fontWeight: "bold",
                            textAlign: "left",
                          },
                        ]}
                        value={toValue}
                        onChangeText={setToValue}
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
                        {t("$0.00")}
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
                  disabled={isConfirmDisabled} // 根据状态禁用按钮
                  onPress={handleConfirmSwap}
                  style={[
                    TransactionsScreenStyle.swapConfirmButton,
                    {
                      backgroundColor: confirmButtonBackgroundColor,
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

      {/* Transaction Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={confirmModalVisible}
        onRequestClose={() => setConfirmModalVisible(false)}
      >
        <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
          <View style={TransactionsScreenStyle.confirmModalView}>
            {/* 添加国际化标题 */}
            <Text style={TransactionsScreenStyle.modalTitle}>
              {t("Transaction Confirmation")}
            </Text>

            {/* From and To Sections in the same row */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between", // 确保左右两边分布
                alignItems: "center",
                width: "90%",
                marginTop: 6,
                marginBottom: 16,
              }}
            >
              {/* From Section */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {fromCryptoDetails?.chainIcon && (
                  <Image
                    source={fromCryptoDetails.chainIcon}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalTitle}>
                  {`- ${fromCryptoDetails?.name} ${fromValue}`}
                </Text>
              </View>

              {/* To Section */}
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {toCryptoDetails?.chainIcon && (
                  <Image
                    source={toCryptoDetails.chainIcon}
                    style={{ width: 24, height: 24, marginRight: 8 }}
                  />
                )}
                <Text style={TransactionsScreenStyle.modalTitle}>
                  {`+ ${toCryptoDetails?.name} ${toValue}`}
                </Text>
              </View>
            </View>

            <ScrollView
              style={{ maxHeight: 320 }} // 设置最大高度，当内容超过时启用滚动
              contentContainerStyle={{ paddingHorizontal: 16 }}
            >
              {/* 交互地址（至） */}
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold" }}>
                  {t("Interaction Address (To)")}:
                </Text>
              </Text>
              <Text style={TransactionsScreenStyle.transactionText}>
                {`Some Placeholder Address`} {/* 这是占位符 */}
              </Text>

              {/* 发送地址 */}
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold" }}>
                  {t("Sending Address")}:
                </Text>
              </Text>
              <Text style={TransactionsScreenStyle.transactionText}>
                {` ${fromCryptoDetails?.address}`}
              </Text>

              {/* 接收地址 */}
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold" }}>
                  {t("Receiving Address")}:
                </Text>
              </Text>
              <Text style={TransactionsScreenStyle.transactionText}>
                {` ${toCryptoDetails?.address}`}
              </Text>

              {/* 网络 */}
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold" }}>{t("Network")}:</Text>
              </Text>
              <Text style={TransactionsScreenStyle.transactionText}>
                {` ${fromCryptoDetails?.chain}`}
              </Text>

              {/* dApp */}
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold" }}>{t("dApp")}:</Text>
                {` Changelly`}
              </Text>

              {/* 预估网络费用 */}
              <Text style={TransactionsScreenStyle.transactionText}>
                <Text style={{ fontWeight: "bold" }}>
                  {t("Estimated Network Fee")}:
                </Text>
                {` ${fromCryptoDetails?.fee}`}
              </Text>
            </ScrollView>

            <View
              style={{ marginTop: 20, width: "100%", alignItems: "center" }}
            >
              {/* 确认交易按钮 */}
              <TouchableOpacity
                style={[
                  TransactionsScreenStyle.optionButton,
                  { marginBottom: 10, width: "100%" }, // 添加宽度以确保按钮居中
                ]}
                onPress={async () => {
                  try {
                    const response = await fetch(
                      "https://bt.likkim.com/meridian/address/queryBlockList",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          chainShortName: fromCryptoDetails?.chain,
                        }),
                      }
                    );
                    const data = await response.json();

                    if (data.code === "0" && Array.isArray(data.data)) {
                      const block = data.data[0].blockList[0];
                      const { hash, height, blockTime } = block;

                      // 执行签名
                      await signTransaction(
                        verifiedDevices,
                        hash,
                        height,
                        blockTime,
                        fromValue,
                        toCryptoDetails?.address
                      );
                    }

                    setConfirmModalVisible(false);
                  } catch (error) {
                    console.error("确认交易时出错:", error);
                  }
                }}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  {t("Confirm")}
                </Text>
              </TouchableOpacity>

              {/* 取消按钮 */}
              <TouchableOpacity
                style={[
                  TransactionsScreenStyle.cancelButton,
                  { width: "100%" }, // 添加宽度以确保按钮居中
                ]}
                onPress={() => setConfirmModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </Modal>
    </>
  );
};

export default SwapModal;
