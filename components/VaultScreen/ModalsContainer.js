// ModalsContainer.js
import React from "react";
import AddressModal from "../modal/AddressModal";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import BluetoothModal from "../modal/BluetoothModal";
import SecurityCodeModal from "../modal/SecurityCodeModal";
import CheckStatusModal from "../modal/CheckStatusModal";
import PendingModal from "../modal/PendingModal";

// 新增引入
import AddCryptoModal from "../modal/AddCryptoModal";
import ChainSelectionModal from "../modal/ChainSelectionModal";

const ModalsContainer = ({
  selectedCardChainShortName,
  addressModalVisible,
  setAddressModalVisible,
  selectedCryptoIcon,
  selectedCrypto,
  selectedAddress,
  isVerifyingAddress,
  addressVerificationMessage,
  handleVerifyAddress,
  VaultScreenStyle,
  t,
  isDarkMode,
  handleWalletTest,
  handleContinue,
  processMessages,
  showLetsGoButton,
  handleLetsGo,
  // 新增传入 AddCryptoModal 所需参数
  addCryptoVisible,
  setAddCryptoVisible,
  searchQuery,
  setSearchQuery,
  filteredCryptos,
  handleAddCrypto,
  chainCategories,
  // 新增传入 ChainSelectionModal 所需参数
  isChainSelectionModalVisible,
  setChainSelectionModalVisible,
  selectedChain,
  handleSelectChain,
  cryptoCards,
  //
  deleteConfirmVisible,
  setDeleteConfirmVisible,
  handleDeleteCard,
  navigation,
  bleVisible,
  devices,
  isScanning,
  iconColor,
  blueToothColor,
  handleDevicePress,
  setBleVisible,
  selectedDevice,
  setSelectedDevice,
  verifiedDevices,
  handleDisconnectDevice,
  SecurityCodeModalVisible,
  pinCode,
  setPinCode,
  handlePinSubmit,
  setSecurityCodeModalVisible,
  verificationStatus,
  setVerificationStatus,
  createPendingModalVisible,
  importingModalVisible,
  setCreatePendingModalVisible,
  setImportingModalVisible,
  stopMonitoringVerificationCode,
  blueToothStatus,
}) => {
  return (
    <>
      {/* 显示选择的加密货币地址的模态窗口 */}
      <AddressModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        selectedCryptoIcon={selectedCryptoIcon}
        selectedCrypto={selectedCrypto}
        selectedAddress={selectedAddress}
        selectedCardChainShortName={selectedCardChainShortName}
        isVerifyingAddress={isVerifyingAddress}
        addressVerificationMessage={addressVerificationMessage}
        handleVerifyAddress={handleVerifyAddress}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
      />
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={deleteConfirmVisible}
        onClose={() => {
          setDeleteConfirmVisible(false);
          navigation.setParams({ showDeleteConfirmModal: false });
        }}
        onConfirm={handleDeleteCard}
        styles={VaultScreenStyle}
        t={t}
      />
      {/* Bluetooth Modal */}
      <BluetoothModal
        visible={bleVisible}
        devices={devices}
        isScanning={isScanning}
        iconColor={blueToothColor}
        handleDevicePress={handleDevicePress}
        onCancel={() => {
          setBleVisible(false);
          setSelectedDevice(null);
        }}
        verifiedDevices={"0"} // 这里避免该页面具备设备管理断开功能
        SecureDeviceScreenStyle={VaultScreenStyle}
        t={t}
        onDisconnectPress={handleDisconnectDevice}
      />
      {/* PIN码输入 Modal */}
      <SecurityCodeModal
        visible={SecurityCodeModalVisible} // 控制 PIN 模态框的可见性
        pinCode={pinCode} // 绑定 PIN 输入的状态
        setPinCode={setPinCode} // 设置 PIN 的状态函数
        onSubmit={handlePinSubmit} // PIN 提交后的逻辑
        onCancel={() => setSecurityCodeModalVisible(false)} // 关闭 PIN 模态框
        styles={VaultScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
        status={blueToothStatus}
      />
      {/* 验证结果 Modal */}
      <CheckStatusModal
        visible={verificationStatus !== null}
        status={verificationStatus}
        onClose={() => setVerificationStatus(null)}
        styles={VaultScreenStyle}
        t={t}
      />
      {/* 通用 Pending Modal */}
      <PendingModal
        visible={createPendingModalVisible || importingModalVisible}
        onRequestClose={() => {
          if (createPendingModalVisible) {
            setCreatePendingModalVisible(false);
          } else if (importingModalVisible) {
            setImportingModalVisible(false);
          }
          stopMonitoringVerificationCode();
        }}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
      />

      {/* Add Crypto Modal */}
      <AddCryptoModal
        visible={addCryptoVisible}
        onClose={() => {
          setAddCryptoVisible(false);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredCryptos={filteredCryptos}
        handleAddCrypto={handleAddCrypto}
        VaultScreenStyle={VaultScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
        chainCategories={chainCategories}
        cryptoCards={cryptoCards}
      />

      {/* 选择链的 Modal */}
      <ChainSelectionModal
        isVisible={isChainSelectionModalVisible}
        onClose={() => setChainSelectionModalVisible(false)}
        selectedChain={selectedChain}
        handleSelectChain={handleSelectChain}
        cryptoCards={cryptoCards}
        isDarkMode={isDarkMode}
        t={t}
      />
    </>
  );
};

export default ModalsContainer;
