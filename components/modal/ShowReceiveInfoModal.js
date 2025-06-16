// ShowReceiveInfoModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { BlurView } from "expo-blur";
import QRCode from "react-native-qrcode-svg";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const ShowReceiveInfoModal = ({
  visible,
  onRequestClose,
  ActivityScreenStyle,
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
  const safeAddress = (selectedAddress || "").trim();
  const hasValidAddress = safeAddress !== "";

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={ActivityScreenStyle.centeredView}>
        <View style={ActivityScreenStyle.receiveModalView}>
          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={ActivityScreenStyle.modalTitle}>
              {t("Address for")}
            </Text>
            {selectedCryptoIcon && (
              <Image
                source={selectedCryptoIcon}
                style={{
                  width: 24,
                  height: 24,
                  marginHorizontal: 5,
                }}
              />
            )}
            <Text style={ActivityScreenStyle.modalTitle}>
              {selectedCrypto}:
            </Text>
          </View>

          {/* Notice */}
          {hasValidAddress && (
            <Text style={ActivityScreenStyle.subtitleText}>
              {t("Assets can only be sent within the same chain.")}
            </Text>
          )}

          {/* Address Display */}
          <View
            style={{
              flexDirection: hasValidAddress ? "row" : "column",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            {hasValidAddress ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  maxWidth: "100%",
                }}
              >
                <Text
                  style={[
                    ActivityScreenStyle.addressText,
                    {
                      textAlign: "center",
                      maxWidth: 200, // ✅ 限制最大宽度
                      marginRight: 8,
                    },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {safeAddress}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    Clipboard.setString(selectedAddress);
                    Alert.alert("", t("Address copied to clipboard!"));
                  }}
                >
                  <Icon
                    name="content-copy"
                    size={24}
                    color={isDarkMode ? "#ffffff" : "#676776"}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <Text
                style={[
                  ActivityScreenStyle.addressText,
                  { textAlign: "center", width: "100%" },
                ]}
              >
                {t("Click the Verify Address Button.")}
              </Text>
            )}
          </View>

          {/* QR Code */}
          {hasValidAddress && (
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
              <QRCode value={safeAddress} size={200} />
            </View>
          )}

          {/* Verification Status */}
          {isVerifyingAddress && (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Pending.gif")}
                style={{ width: 40, height: 40 }}
              />
              <Text
                style={[
                  ActivityScreenStyle.verifyingAddressText,
                  { color: "#3CDA84" },
                ]}
              >
                {addressVerificationMessage}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View
            style={{
              flexDirection: "column",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => handleVerifyAddress(chainShortName)}
              style={ActivityScreenStyle.verifyAddressButton}
            >
              <Text style={ActivityScreenStyle.submitButtonText}>
                {t("Verify Address")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ActivityScreenStyle.cancelAddressButton}
              onPress={onRequestClose}
            >
              <Text style={ActivityScreenStyle.cancelButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ShowReceiveInfoModal;
