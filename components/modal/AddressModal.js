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
import Icon from "react-native-vector-icons/MaterialIcons";
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
  WalletScreenStyle,
  t,
  isDarkMode,
}) => (
  <Modal
    animationType="slide"
    transparent
    visible={visible}
    onRequestClose={onClose}
  >
    <BlurView intensity={10} style={WalletScreenStyle.centeredView}>
      <View style={WalletScreenStyle.receiveModalView}>
        <AddressHeader
          selectedCryptoIcon={selectedCryptoIcon}
          selectedCrypto={selectedCrypto}
          WalletScreenStyle={WalletScreenStyle}
          t={t}
        />
        <AddressInfo
          selectedAddress={selectedAddress}
          isDarkMode={isDarkMode}
          WalletScreenStyle={WalletScreenStyle}
          t={t}
        />
        <QRCodeView selectedAddress={selectedAddress} />
        {isVerifyingAddress && (
          <VerifyingStatus
            message={addressVerificationMessage}
            WalletScreenStyle={WalletScreenStyle}
          />
        )}
        <ActionButtons
          handleVerifyAddress={handleVerifyAddress}
          onClose={onClose}
          WalletScreenStyle={WalletScreenStyle}
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
  WalletScreenStyle,
  t,
}) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={WalletScreenStyle.modalTitle}>{t("Address for")}</Text>
    {selectedCryptoIcon && (
      <Image
        source={selectedCryptoIcon}
        style={{ width: 24, height: 24, marginHorizontal: 5 }}
      />
    )}
    <Text style={WalletScreenStyle.modalTitle}>{selectedCrypto}:</Text>
  </View>
);

const AddressInfo = ({ selectedAddress, isDarkMode, WalletScreenStyle, t }) => (
  <>
    <Text style={WalletScreenStyle.subtitleText}>
      {t("Assets can only be sent within the same chain.")}
    </Text>
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={WalletScreenStyle.addressText}>{selectedAddress}</Text>
      <TouchableOpacity onPress={() => Clipboard.setString(selectedAddress)}>
        <Icon
          name="content-copy"
          size={24}
          color={isDarkMode ? "#ffffff" : "#676776"}
        />
      </TouchableOpacity>
    </View>
  </>
);

const QRCodeView = ({ selectedAddress }) => (
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

const VerifyingStatus = ({ message, WalletScreenStyle }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image
      source={require("../../assets/gif/Pending.gif")}
      style={{ width: 40, height: 40 }}
    />
    <Text
      style={[WalletScreenStyle.verifyingAddressText, { color: "#3CDA84" }]}
    >
      {message}
    </Text>
  </View>
);

const ActionButtons = ({
  handleVerifyAddress,
  onClose,
  WalletScreenStyle,
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
      style={WalletScreenStyle.verifyAddressButton}
    >
      <Text style={WalletScreenStyle.submitButtonText}>
        {t("Verify Address")}
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={WalletScreenStyle.cancelAddressButton}
      onPress={onClose}
    >
      <Text style={WalletScreenStyle.cancelButtonText}>{t("Close")}</Text>
    </TouchableOpacity>
  </View>
);

export default AddressModal;
