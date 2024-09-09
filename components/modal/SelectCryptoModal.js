import React from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";

const SelectCryptoModal = ({
  visible,
  onRequestClose,
  addedCryptos,
  operationType,
  selectCrypto,
  TransactionsScreenStyle,
  t,
  setModalVisible,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
        <View style={TransactionsScreenStyle.modalView}>
          <Text style={TransactionsScreenStyle.TransactionModalTitle}>
            {addedCryptos.length === 0
              ? t("No cryptocurrencies available. Please add wallet first.")
              : operationType === "send"
              ? t("Choose the cryptocurrency to send:")
              : t("Choose the cryptocurrency to receive:")}
          </Text>
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
                style={{ width: 200, height: 200, marginBottom: 40 }}
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ alignItems: "center" }}
              style={{ maxHeight: 400, width: 320, paddingHorizontal: 20 }}
            >
              {addedCryptos.map((crypto) => (
                <TouchableOpacity
                  key={crypto.shortName}
                  style={TransactionsScreenStyle.optionButton}
                  onPress={() => selectCrypto(crypto)}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {crypto.icon && (
                      <Image
                        source={crypto.icon}
                        style={{ width: 24, height: 24, marginRight: 8 }}
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
    </Modal>
  );
};

export default SelectCryptoModal;
