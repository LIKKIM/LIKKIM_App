// ShowReceiveInfoModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

// 主组件，结构与 AddressModal.js 保持一致，props 保持 ShowReceiveInfoModal 原有风格
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
}) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <BlurView intensity={10} style={ActivityScreenStyle.centeredView}>
      <View style={ActivityScreenStyle.receiveModalView}>
        <Header
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCrypto={selectedCrypto}
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
        />
        <AddressInfo
          selectedAddress={selectedAddress}
          isDarkMode={isDarkMode}
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
        />
        <QRCodeView selectedAddress={selectedAddress} />
        {isVerifyingAddress && (
          <VerifyingStatus
            message={addressVerificationMessage}
            ActivityScreenStyle={ActivityScreenStyle}
          />
        )}
        <ActionButtons
          handleVerifyAddress={handleVerifyAddress}
          onRequestClose={onRequestClose}
          ActivityScreenStyle={ActivityScreenStyle}
          t={t}
          chainShortName={chainShortName}
        />
      </View>
    </BlurView>
  </Modal>
);

const Header = ({
  selectedCryptoIcon,
  selectedCrypto,
  ActivityScreenStyle,
  t,
}) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={ActivityScreenStyle.modalTitle}>{t("Address for")}</Text>
    {selectedCryptoIcon && (
      <Image
        source={selectedCryptoIcon}
        style={{ width: 24, height: 24, marginHorizontal: 5 }}
      />
    )}
    <Text style={ActivityScreenStyle.modalTitle}>{selectedCrypto}:</Text>
  </View>
);

const AddressInfo = ({
  selectedAddress,
  isDarkMode,
  ActivityScreenStyle,
  t,
}) => {
  const safeAddress = (selectedAddress || "").trim();
  const hasValidAddress = safeAddress !== "";

  return (
    <>
      {hasValidAddress && (
        <Text style={ActivityScreenStyle.subtitleText}>
          {t("Assets can only be sent within the same chain.")}
        </Text>
      )}

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
              maxWidth: "100%",
              flexWrap: "nowrap",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                ActivityScreenStyle.addressText,
                {
                  textAlign: "center",
                  marginRight: 8,
                  maxWidth: 200,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {safeAddress}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(safeAddress);
                Alert.alert("", t("Address copied to clipboard"));
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
    </>
  );
};

const QRCodeView = ({ selectedAddress }) => {
  const safeAddress = (selectedAddress || "").trim();
  if (safeAddress === "") {
    return null;
  }

  return (
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
  );
};

const VerifyingStatus = ({ message, ActivityScreenStyle }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image
      source={require("../../assets/gif/Pending.gif")}
      style={{ width: 40, height: 40 }}
    />
    <Text
      style={[ActivityScreenStyle.verifyingAddressText, { color: "#3CDA84" }]}
    >
      {message}
    </Text>
  </View>
);

const ActionButtons = ({
  handleVerifyAddress,
  onRequestClose,
  ActivityScreenStyle,
  t,
  chainShortName,
}) => (
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
      <Text style={ActivityScreenStyle.cancelButtonText}>{t("Close")}</Text>
    </TouchableOpacity>
  </View>
);

export default ShowReceiveInfoModal;
