// src/utils/BleManagerSingleton.js
import { BleManager } from "react-native-ble-plx";

let bleManagerInstance = null;

export default function getBleManager() {
  if (!bleManagerInstance) {
    bleManagerInstance = new BleManager();
  }
  return bleManagerInstance;
}
