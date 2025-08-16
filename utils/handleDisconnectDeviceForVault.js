import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Vault 专用断开设备连接并更新状态
 * @param {Object} params
 * @param {Object} params.device - 设备对象，需有 cancelConnection 方法和 id 属性
 * @param {Array} params.verifiedDevices - 当前已验证设备ID数组
 * @param {Function} params.setVerifiedDevices - 设置已验证设备ID数组的 setState
 * @param {Function} params.setIsVerificationSuccessful - 设置验证状态的 setState
 * @returns {Promise<void>}
 */
export async function handleDisconnectDeviceForVault({
  device,
  verifiedDevices,
  setVerifiedDevices,
  setIsVerificationSuccessful,
}) {
  try {
    await device.cancelConnection();
    console.log(`设备 ${device.id} 已断开连接`);

    // Remove verified device ID
    const updatedVerifiedDevices = verifiedDevices.filter(
      (id) => id !== device.id
    );
    setVerifiedDevices(updatedVerifiedDevices);
    await AsyncStorage.setItem(
      "verifiedDevices",
      JSON.stringify(updatedVerifiedDevices)
    );
    console.log(`设备 ${device.id} 已从已验证设备中移除`);

    // 更新全局状态，表示设备已不再验证成功
    setIsVerificationSuccessful(false);
    console.log("验证状态已更新为 false。");
  } catch (error) {
    console.log("断开设备连接失败:", error);
  }
}
