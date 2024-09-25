// SwapModal.js
import React from "react";
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

const SwapModal = ({
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
  // Helper function to get the token details including the icon and name
  const getTokenDetails = (tokenShortName) => {
    return initialAdditionalCryptos.find(
      (token) => token.shortName === tokenShortName
    );
  };

  return (
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
                  From
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
                      placeholder="0.0"
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
                      $0.00
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={TransactionsScreenStyle.tokenSelect}
                    onPress={() => setFromDropdownVisible(!fromDropdownVisible)}
                  >
                    {/* Display token icon and name */}
                    {selectedFromToken ? (
                      <>
                        <Image
                          source={getTokenDetails(selectedFromToken)?.chainIcon}
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
                        Select token
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
                  To
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
                      placeholder="0.0"
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
                      $0.00
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
                        Select token
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
                        setSelectedToToken(chain.shortName); // 修改为 setSelectedToToken
                        setToDropdownVisible(false); // 关闭 To 下拉列表
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
                onPress={() => setSwapModalVisible(false)}
                style={[
                  TransactionsScreenStyle.swapConfirmButton,
                  { marginBottom: 20 },
                ]}
              >
                <Text style={TransactionsScreenStyle.submitButtonText}>
                  Confirm
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
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SwapModal;
