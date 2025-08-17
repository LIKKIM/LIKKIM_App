/**
 * 工厂函数：生成 selectCrypto 处理函数
 * 依赖全部通过参数传递，适用于 React 组件外部调用
 *
 */

const createSelectCrypto = ({
  setSelectedCrypto,
  setSelectedAddress,
  setSelectedCryptoIcon,
  setBalance,
  setEstimatedValue,
  setFee,
  setPriceUsd,
  setQueryChainName,
  setChainShortName,
  setSelectedCryptoName,
  setIsVerifyingAddress,
  setModalVisible,
  setAddressModalVisible,
  setInputAddress,
  setContactFormModalVisible,
  setBleVisible,
  operationType,
  verifiedDevices,
  devices,
}) => {
  return async (crypto) => {
    setSelectedCrypto(crypto.shortName);
    setSelectedAddress(crypto.address);
    setSelectedCryptoIcon(crypto.icon);
    setBalance(crypto.balance);
    setEstimatedValue(crypto.EstimatedValue);
    setFee(crypto.fee);
    setPriceUsd(crypto.priceUsd);
    setQueryChainName(crypto.queryChainName);
    setChainShortName(crypto.queryChainShortName);
    setSelectedCryptoName(crypto.name);
    setIsVerifyingAddress(false);
    console.log(
      "selectCrypto: setModalVisible(false) before opening BluetoothModal"
    );
    setModalVisible(false);

    if (operationType === "receive") {
      setAddressModalVisible(true);
    } else if (operationType === "Send") {
      if (verifiedDevices.length > 0) {
        const device = devices.find((d) => d.id === verifiedDevices[0]);
        if (device) {
          setAddressModalVisible(false);
          setInputAddress("");
          setContactFormModalVisible(true);
        } else {
          setBleVisible(true);
          setModalVisible(false);
        }
      } else {
        setBleVisible(true);
        setModalVisible(false);
      }
    }
  };
};

export default createSelectCrypto;
