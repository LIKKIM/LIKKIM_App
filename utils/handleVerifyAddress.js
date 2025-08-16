/**
 * 处理地址验证逻辑
 * @param {Object} params
 * @param {string} params.chainShortName - 链短名称
 * @param {Array} params.verifiedDevices - 已验证设备ID数组
 * @param {Array} params.devices - 设备对象数组
 * @param {Function} params.setAddressModalVisible - 控制地址Modal显示
 * @param {Function} params.setBleVisible - 控制蓝牙Modal显示
 * @param {Function} params.displayDeviceAddress - 显示设备地址函数
 * @param {Function} params.setIsVerifyingAddress - 设置验证状态
 * @param {Function} params.setAddressVerificationMessage - 设置验证消息
 * @param {Function} params.t - 国际化翻译函数
 */
export function handleVerifyAddress({
  chainShortName,
  verifiedDevices,
  devices,
  setAddressModalVisible,
  setBleVisible,
  displayDeviceAddress,
  setIsVerifyingAddress,
  setAddressVerificationMessage,
  t,
}) {
  if (verifiedDevices.length > 0) {
    const device = devices.find((d) => d.id === verifiedDevices[0]);
    if (device) {
      displayDeviceAddress(
        device,
        chainShortName,
        setIsVerifyingAddress,
        setAddressVerificationMessage,
        t
      );
    } else {
      setAddressModalVisible(false);
      setBleVisible(true);
    }
    setAddressModalVisible(false);
    setBleVisible(true);
  }
}
