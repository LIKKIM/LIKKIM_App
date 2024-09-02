// ModalsContainer.js
import React from "react";
import AddressModal from "../modal/AddressModal";
import AddWalletModal from "../modal/AddWalletModal";
import TipModal from "../modal/TipModal";
import ProcessModal from "../modal/ProcessModal";
import AddCryptoModal from "../modal/AddCryptoModal";
import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import BluetoothModal from "../modal/BluetoothModal";
import PinModal from "../modal/PinModal";
import VerificationModal from "../modal/VerificationModal";
import PendingModal from "../modal/PendingModal";

const ModalsContainer = ({
  addressModalVisible,
  setAddressModalVisible,
  selectedCryptoIcon,
  selectedCrypto,
  selectedAddress,
  isVerifyingAddress,
  addressVerificationMessage,
  handleVerifyAddress,
  WalletScreenStyle,
  t,
  isDarkMode,
  addWalletModalVisible,
  setAddWalletModalVisible,
  handleCreateWallet,
  handleImportWallet,
  handleWalletTest,
  tipModalVisible,
  setTipModalVisible,
  handleContinue,
  processModalVisible,
  setProcessModalVisible,
  processMessages,
  showLetsGoButton,
  handleLetsGo,
  addCryptoVisible,
  setAddCryptoVisible,
  searchQuery,
  setSearchQuery,
  filteredCryptos,
  handleAddCrypto,
  chainCategories,
  deleteConfirmVisible,
  setDeleteConfirmVisible,
  handleDeleteCard,
  navigation,
  bleVisible,
  devices,
  isScanning,
  iconColor,
  handleDevicePress,
  setBleVisible,
  setSelectedDevice,
  verifiedDevices,
  handleDisconnectDevice,
  pinModalVisible,
  pinCode,
  setPinCode,
  handlePinSubmit,
  setPinModalVisible,
  verificationStatus,
  setVerificationStatus,
  createPendingModalVisible,
  importingModalVisible,
  setCreatePendingModalVisible,
  setImportingModalVisible,
  stopMonitoringWalletAddress,
  walletCreationStatus,
  importingStatus,
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
        isVerifyingAddress={isVerifyingAddress}
        addressVerificationMessage={addressVerificationMessage}
        onVerifyAddress={handleVerifyAddress}
        WalletScreenStyle={WalletScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
      />
      {/* Add Wallet Modal */}
      <AddWalletModal
        visible={addWalletModalVisible}
        onClose={() => setAddWalletModalVisible(false)}
        onCreateWallet={handleCreateWallet}
        onImportWallet={handleImportWallet}
        onWalletTest={handleWalletTest}
        styles={WalletScreenStyle}
        t={t}
      />

      {/* 提示 Modal */}
      <TipModal
        visible={tipModalVisible}
        onClose={() => setTipModalVisible(false)}
        onContinue={handleContinue}
        styles={WalletScreenStyle}
        t={t}
      />
      {/* Process Modal */}
      <ProcessModal
        visible={processModalVisible}
        onClose={() => setProcessModalVisible(false)}
        processMessages={processMessages}
        showLetsGoButton={showLetsGoButton}
        onLetsGo={handleLetsGo}
        styles={WalletScreenStyle}
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
        styles={WalletScreenStyle}
        t={t}
        isDarkMode={isDarkMode}
        chainCategories={chainCategories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={deleteConfirmVisible}
        onClose={() => {
          setDeleteConfirmVisible(false);
          navigation.setParams({ showDeleteConfirmModal: false });
        }}
        onConfirm={handleDeleteCard}
        styles={WalletScreenStyle}
        t={t}
      />

      {/* Bluetooth modal */}
      <BluetoothModal
        visible={bleVisible}
        devices={devices}
        isScanning={isScanning}
        iconColor={iconColor}
        onDevicePress={handleDevicePress}
        onCancel={() => {
          setBleVisible(false);
          setSelectedDevice(null);
        }}
        verifiedDevices={verifiedDevices}
        MyColdWalletScreenStyle={WalletScreenStyle}
        t={t}
        onDisconnectPress={handleDisconnectDevice}
      />

      {/* PIN码输入modal窗口 */}
      <PinModal
        visible={pinModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        onSubmit={() => handlePinSubmit(selectedDevice, pinCode)}
        onCancel={() => setPinModalVisible(false)}
        styles={WalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
      />

      {/* 验证结果模态框 */}
      <VerificationModal
        visible={verificationStatus !== null}
        status={verificationStatus}
        onClose={() => setVerificationStatus(null)}
        styles={WalletScreenStyle}
        t={t}
      />

      {/* 通用的 PendingModal 模态框 */}
      <PendingModal
        visible={createPendingModalVisible || importingModalVisible}
        onRequestClose={() => {
          if (createPendingModalVisible) {
            setCreatePendingModalVisible(false);
          } else if (importingModalVisible) {
            setImportingModalVisible(false);
          }
          stopMonitoringWalletAddress();
        }}
        title={
          createPendingModalVisible
            ? walletCreationStatus.title
            : importingStatus.title
        }
        imageSource={
          createPendingModalVisible
            ? walletCreationStatus.image
            : importingStatus.image
        }
        subtitle={
          createPendingModalVisible
            ? walletCreationStatus.subtitle
            : importingStatus.subtitle
        }
        WalletScreenStyle={WalletScreenStyle}
        t={t}
      />
    </>
  );
};

export default ModalsContainer;
