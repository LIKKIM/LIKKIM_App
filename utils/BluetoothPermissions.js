// src/utils/BluetoothPermissions.js
import { Platform, PermissionsAndroid } from "react-native";

const checkAndReqPermission = async (callback) => {
  if (Platform.OS === "android" && Platform.Version >= 23) {
    console.log("Requesting Android permissions");
    const permissions = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_ADVERTISE,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ]);

    let allPermissionsGranted = true;
    for (let permission in permissions) {
      if (permissions[permission] !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log(`${permission} permission not granted`);
        allPermissionsGranted = false;
      }
    }

    if (allPermissionsGranted && callback) {
      callback();
    }
  } else if (Platform.OS === "ios" && callback) {
    // iOS platform directly invokes the callback
    callback();
  }
};

export default checkAndReqPermission;
