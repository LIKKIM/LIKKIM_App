import { Platform } from "react-native";
import checkAndReqPermission from "./BluetoothPermissions";
import { BleErrorCode } from "react-native-ble-plx";

/**
 * 通用蓝牙设备扫描函数
 * @param {boolean} isScanning - 当前是否正在扫描
 * @param {function} setIsScanning - 设置扫描状态的函数
 * @param {object} bleManagerRef - 蓝牙管理器ref（需传入.current）
 * @param {function} setDevices - 设置设备列表的函数
 * @param {number} [scanDuration=2000] - 扫描时长（毫秒），默认2000ms
 */
export function scanDevices({
  isScanning,
  setIsScanning,
  bleManagerRef,
  setDevices,
  scanDuration = 2000,
}) {
  if (Platform.OS !== "web" && !isScanning) {
    checkAndReqPermission(() => {
      console.log("Scanning started");
      setIsScanning(true);
      const scanOptions = { allowDuplicates: true };
      const scanFilter = null;
      bleManagerRef.current.startDeviceScan(
        scanFilter,
        scanOptions,
        (error, device) => {
          if (error) {
            console.log("BleManager scanning error:", error);
            if (error.errorCode === BleErrorCode.BluetoothUnsupported) {
              // Bluetooth LE unsupported on device
            }
          } else if (device.name && device.name.includes("LUKKEY")) {
            setDevices((prevDevices) => {
              if (!prevDevices.find((d) => d.id === device.id)) {
                return [...prevDevices, device];
              }
              return prevDevices;
            });
          }
        }
      );
      setTimeout(() => {
        console.log("Scanning stopped");
        bleManagerRef.current.stopDeviceScan();
        setIsScanning(false);
      }, scanDuration);
    });
  } else {
    console.log("Attempt to scan while already scanning");
  }
}
