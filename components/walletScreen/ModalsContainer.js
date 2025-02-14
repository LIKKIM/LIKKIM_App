// ModalsContainer.js
import React from "react";
import AddressModal from "../modal/AddressModal";
import AddWalletModal from "../modal/AddWalletModal";
import TipModal from "../modal/TipModal";
import ProcessModal from "../modal/ProcessModal";

import DeleteConfirmationModal from "../modal/DeleteConfirmationModal";
import BluetoothModal from "../modal/BluetoothModal";
import PinModal from "../modal/PinModal";
import VerificationModal from "../modal/VerificationModal";
import PendingModal from "../modal/PendingModal";

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
  blueToothColor,
  handleDevicePress,
  setBleVisible,
  selectedDevice,
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
        iconColor={blueToothColor}
        onDevicePress={handleDevicePress}
        onCancel={() => {
          setBleVisible(false);
          setSelectedDevice(null);
        }}
        verifiedDevices={"0"} // 这里是避免这个页面有设备管理disconnect的功能
        MyColdWalletScreenStyle={WalletScreenStyle}
        t={t}
        onDisconnectPress={handleDisconnectDevice}
      />

      {/* PIN码输入modal窗口 */}

      <PinModal
        visible={pinModalVisible} // 控制 PIN 模态框的可见性
        pinCode={pinCode} // 绑定 PIN 输入的状态
        setPinCode={setPinCode} // 设置 PIN 的状态函数
        onSubmit={handlePinSubmit} // PIN 提交后的逻辑
        onCancel={() => setPinModalVisible(false)} // 关闭 PIN 模态框
        styles={WalletScreenStyle}
        isDarkMode={isDarkMode}
        t={t}
        status={blueToothStatus}
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
