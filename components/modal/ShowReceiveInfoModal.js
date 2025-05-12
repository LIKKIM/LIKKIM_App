// ShowReceiveInfoModal.js
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={ActivityScreenStyle.centeredView}>
        <View style={ActivityScreenStyle.receiveModalView}>
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
                  marginLeft: 5,
                  marginRight: 5,
                }}
              />
            )}
            <Text style={ActivityScreenStyle.modalTitle}>
              {selectedCrypto}:
            </Text>
          </View>

          <Text style={ActivityScreenStyle.subtitleText}>
            {t("Assets can only be sent within the same chain.")}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingVertical: 10,
            }}
          >
            {typeof selectedAddress === "string" &&
            selectedAddress.trim() !== "" ? (
              <>
                <Text style={ActivityScreenStyle.addressText}>
                  {selectedAddress}
                </Text>
                <TouchableOpacity
                  onPress={() => Clipboard.setString(selectedAddress)}
                >
                  <Icon
                    name="content-copy"
                    size={24}
                    color={isDarkMode ? "#ffffff" : "#676776"}
                    style={{ marginLeft: 8 }}
                  />
                </TouchableOpacity>
              </>
            ) : (
              <Text style={ActivityScreenStyle.addressText}>
                {t("Click the Verify Address Button.")}
              </Text>
            )}
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
                  ActivityScreenStyle.verifyingAddressText,
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
