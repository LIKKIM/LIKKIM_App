// AddressModal.js
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
    <ReceiveAddressModal
      visible={visible}
      onClose={onClose}
      styleObj={VaultScreenStyle}
      t={t}
      cryptoIcon={selectedCryptoIcon}
      cryptoName={selectedCrypto}
      address={selectedAddress}
      isVerifying={isVerifyingAddress}
      verifyMsg={addressVerificationMessage}
      handleVerify={handleVerifyAddress}
      isDarkMode={isDarkMode}
      chainShortName={selectedCardChainShortName}
    />
  );
};

export default AddressModal;
