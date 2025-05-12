// modal/AddressModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Clipboard,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

const AddressModal = ({
  visible,
  onClose,
  selectedCryptoIcon,
  selectedCrypto,
  selectedAddress,
  selectedCardChainShortName,
  isVerifyingAddress,
  addressVerificationMessage,
  handleVerifyAddress,
  VaultScreenStyle,
  t,
  isDarkMode,
}) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <BlurView intensity={10} style={VaultScreenStyle.centeredView}>
      <View style={VaultScreenStyle.receiveModalView}>
        <AddressHeader
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCrypto={selectedCrypto}
          VaultScreenStyle={VaultScreenStyle}
          t={t}
        />
        <AddressInfo
          selectedAddress={selectedAddress}
          isDarkMode={isDarkMode}
          VaultScreenStyle={VaultScreenStyle}
          t={t}
        />
        <QRCodeView selectedAddress={selectedAddress} />
        {isVerifyingAddress && (
          <VerifyingStatus
            message={addressVerificationMessage}
            VaultScreenStyle={VaultScreenStyle}
          />
        )}
        <ActionButtons
          handleVerifyAddress={handleVerifyAddress}
          onClose={onClose}
          VaultScreenStyle={VaultScreenStyle}
          t={t}
          selectedCardChainShortName={selectedCardChainShortName}
        />
      </View>
    </BlurView>
  </Modal>
);

const AddressHeader = ({
  selectedCryptoIcon,
  selectedCrypto,
  VaultScreenStyle,
  t,
}) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={VaultScreenStyle.modalTitle}>{t("Address for")}</Text>
    {selectedCryptoIcon && (
      <Image
        source={selectedCryptoIcon}
        style={{ width: 24, height: 24, marginHorizontal: 5 }}
      />
    )}
    <Text style={VaultScreenStyle.modalTitle}>{selectedCrypto}:</Text>
  </View>
);

const AddressInfo = ({ selectedAddress, isDarkMode, VaultScreenStyle, t }) => {
  const safeAddress = (selectedAddress || "").trim();
  const hasValidAddress = safeAddress !== "";

  return (
    <>
      {hasValidAddress && (
        <Text style={VaultScreenStyle.subtitleText}>
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
              maxWidth: "100%", // 确保最大宽度不超出父容器
              flexWrap: "nowrap",
            }}
          >
            <Text
              style={[
                VaultScreenStyle.addressText,
                {
                  textAlign: "center", // 保持文字居中
                  marginRight: 8,
                  maxWidth: 200, // 限制宽度，防止占据过多空间
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
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
        ) : (
          <Text
            style={[
              VaultScreenStyle.addressText,
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
  if (typeof selectedAddress !== "string" || selectedAddress.trim() === "") {
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
      <QRCode value={selectedAddress} size={200} />
    </View>
  );
};

const VerifyingStatus = ({ message, VaultScreenStyle }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image
      source={require("../../assets/gif/Pending.gif")}
      style={{ width: 40, height: 40 }}
    />
    <Text style={[VaultScreenStyle.verifyingAddressText, { color: "#3CDA84" }]}>
      {message}
    </Text>
  </View>
);

const ActionButtons = ({
  handleVerifyAddress,
  onClose,
  VaultScreenStyle,
  t,
  selectedCardChainShortName,
}) => (
  <View
    style={{
      flexDirection: "column",
      width: "100%",
      justifyContent: "space-between",
    }}
  >
    <TouchableOpacity
      onPress={() => handleVerifyAddress(selectedCardChainShortName)}
      style={VaultScreenStyle.verifyAddressButton}
    >
      <Text style={VaultScreenStyle.submitButtonText}>
        {t("Verify Address")}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={VaultScreenStyle.cancelAddressButton}
      onPress={onClose}
    >
      <Text style={VaultScreenStyle.cancelButtonText}>{t("Close")}</Text>
    </TouchableOpacity>
  </View>
);

export default AddressModal;
