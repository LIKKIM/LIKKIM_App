// ReceiveAddressModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Clipboard,
} from "react-native";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import Icon from "react-native-vector-icons/MaterialIcons";

const ReceiveAddressModal = ({
  visible,
  onRequestClose,
  TransactionsScreenStyle,
  t,
  selectedCryptoIcon,
  selectedCrypto,
  selectedAddress,
  isVerifyingAddress,
  addressVerificationMessage,
  handleVerifyAddress,
  isDarkMode,
  chainShortName,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={TransactionsScreenStyle.centeredView}>
        <View style={TransactionsScreenStyle.receiveModalView}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={TransactionsScreenStyle.modalTitle}>
              {t("Address for")}
            </Text>
            {selectedCryptoIcon && (
              <Image
                source={selectedCryptoIcon}
                style={{
                  width: 24,
                  height: 24,
                  marginLeft: 5,
                  marginRight: 5,
                }}
              />
            )}
            <Text style={TransactionsScreenStyle.modalTitle}>
              {selectedCrypto}:
            </Text>
          </View>

          <Text style={TransactionsScreenStyle.subtitleText}>
            {t("Assets can only be sent within the same chain.")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text style={TransactionsScreenStyle.addressText}>
              {selectedAddress}
            </Text>
            <TouchableOpacity
              onPress={() => Clipboard.setString(selectedAddress)}
            >
              <Icon
                name="content-copy"
                size={24}
                color={isDarkMode ? "#ffffff" : "#676776"}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              backgroundColor: "#fff",
              height: 220,
              width: 220,
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
            }}
          >
            <QRCode value={selectedAddress} size={200} />
          </View>

          {isVerifyingAddress && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Pending.gif")}
                style={{ width: 40, height: 40 }}
              />
              <Text
                style={[
                  TransactionsScreenStyle.verifyingAddressText,
                  { color: "#3CDA84" },
                ]}
              >
                {addressVerificationMessage}
              </Text>
            </View>
          )}

          <View
            style={{
              flexDirection: "column",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => handleVerifyAddress(chainShortName)}
              style={TransactionsScreenStyle.verifyAddressButton}
            >
              <Text style={TransactionsScreenStyle.submitButtonText}>
                {t("Verify Address")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={TransactionsScreenStyle.cancelAddressButton}
              onPress={onRequestClose}
            >
              <Text style={TransactionsScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ReceiveAddressModal;
