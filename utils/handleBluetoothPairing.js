/**
 * 通用蓝牙配对处理函数
 * @param {Object} params
 * @param {function} params.t - 国际化函数
 * @param {function} params.scanDevices - 扫描设备函数
 * @param {boolean} params.isScanning - 是否正在扫描
 * @param {function} params.setIsScanning - 设置扫描状态
 * @param {object} params.bleManagerRef - 蓝牙管理器引用
 * @param {function} params.setDevices - 设置设备列表
 * @param {function} params.setBleVisible - 设置蓝牙模态框可见性
 * @param {object} [params.PermissionsAndroid] - 安卓权限API（可选，默认自动require）
 * @param {object} [params.Platform] - 平台对象（可选，默认自动require）
 */
export async function handleBluetoothPairing({
  t,
  scanDevices,
  isScanning,
  setIsScanning,
  bleManagerRef,
  setDevices,
  setBleVisible,
  PermissionsAndroid,
  Platform,
}) {
  if (!Platform) {
    Platform = require("react-native").Platform;
  }
  if (Platform.OS === "android") {
    if (!PermissionsAndroid) {
      PermissionsAndroid = require("react-native").PermissionsAndroid;
    }
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: t("Location Permission"),
        message: t("We need access to your location to use Bluetooth."),
        buttonNeutral: t("Ask Me Later"),
        buttonNegative: t("Cancel"),
        buttonPositive: t("OK"),
      }
    );
    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      console.log("Location permission denied");
      return;
    }
  }
  scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
  setBleVisible(true);
}
