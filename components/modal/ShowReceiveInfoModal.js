// ShowReceiveInfoModal.js
import React from "react";
import ReceiveAddressModal from "./ReceiveAddressModal";

/**
 * 兼容旧用法的包装，参数映射到通用组件
 */
const ShowReceiveInfoModal = (props) => {
  const {
    visible,
    onRequestClose,
    ActivityScreenStyle,
    selectedCryptoIcon,
    selectedCrypto,
    selectedAddress,
    isVerifyingAddress,
    addressVerificationMessage,
    handleVerifyAddress,
    isDarkMode,
    chainShortName,
  } = props;

  return (
    <ReceiveAddressModal
      visible={visible}
      onClose={onRequestClose}
      styleObj={ActivityScreenStyle}
      cryptoIcon={selectedCryptoIcon}
      cryptoName={selectedCrypto}
      address={selectedAddress}
      isVerifying={isVerifyingAddress}
      verifyMsg={addressVerificationMessage}
      handleVerify={handleVerifyAddress}
      isDarkMode={isDarkMode}
      chainShortName={chainShortName}
    />
  );
};

export default ShowReceiveInfoModal;
