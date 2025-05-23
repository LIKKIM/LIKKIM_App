// SelectCryptoModal.js
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

const SelectCryptoModal = ({
  visible,
  onRequestClose,
  addedCryptos,
  operationType,
  selectCrypto,
  TransactionsScreenStyle,
  t,
  setModalVisible,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCryptos = addedCryptos.filter((crypto) =>
    `${crypto.shortName} ${crypto.chain}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
            <View
              style={TransactionsScreenStyle.modalView}
              onStartShouldSetResponder={() => true}
            >
              <Text style={TransactionsScreenStyle.TransactionModalTitle}>
                {addedCryptos.length === 0
                  ? t("No cryptocurrencies available. Please add wallet first.")
                  : operationType === "send"
                  ? t("Choose the cryptocurrency to send:")
                  : t("Choose the cryptocurrency to receive:")}
              </Text>

              {addedCryptos.length > 0 && (
                <View style={TransactionsScreenStyle.searchContainer}>
                  <Icon
                    name="search"
                    size={20}
                    style={TransactionsScreenStyle.searchIcon}
                  />
                  <TextInput
                    style={TransactionsScreenStyle.searchInput}
                    placeholder={t("Search Cryptocurrency")}
                    placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                  />
                </View>
              )}

              {addedCryptos.length === 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 260,
                  }}
                >
                  <Image
                    source={require("../../assets/gif/Empty.gif")}
                    style={{
                      width: 200,
                      height: 200,
                      marginBottom: 40,
                    }}
                  />
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{ alignItems: "center" }}
                  style={{ maxHeight: 400, width: 320, paddingHorizontal: 20 }}
                >
                  {filteredCryptos.map((crypto) => (
                    <TouchableOpacity
                      key={`${crypto.shortName}_${crypto.chain}`}
                      style={TransactionsScreenStyle.optionButton}
                      onPress={() => selectCrypto(crypto)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {crypto.icon && (
                          <Image
                            source={crypto.icon}
                            style={{
                              width: 24,
                              height: 24,
                              marginRight: 8,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 12,
                            }}
                          />
                        )}
                        <Text style={TransactionsScreenStyle.optionButtonText}>
                          {crypto.shortName} ({crypto.chain})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={TransactionsScreenStyle.cancelButtonReceive}
                onPress={() => setModalVisible(false)}
              >
                <Text style={TransactionsScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectCryptoModal;
