// AddressModal.js
import React from "react";
import ReceiveAddressModal from "./ReceiveAddressModal";

/**
 * 兼容旧用法的包装，参数映射到通用组件
 */
const AddressModal = (props) => {
  const {
    visible,
    onClose,
    VaultScreenStyle,
    t,
    selectedCryptoIcon,
    selectedCrypto,
    selectedAddress,
    selectedCardChainShortName,
    isVerifyingAddress,
    addressVerificationMessage,
    handleVerifyAddress,
    isDarkMode,
  } = props;

  return (
    <ReceiveAddressModal
      visible={visible}
      onClose={onClose}
      styleObj={VaultScreenStyle}
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
