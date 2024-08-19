/**
 * LIKKIM 动态Config
 * @param {*} param0
 * @returns
 */

export default {
  owner: "likkimteam",
  name: "LIKKIM",
  slug: "likkim",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSBluetoothAlwaysUsageDescription: "获取蓝牙权限连接钱包设备",
      NSBluetoothPeripheralUsageDescription: "获取蓝牙权限连接钱包设备",
      NSLocationWhenInUseUsageDescription: "获取定位权限以进行蓝牙扫描",
      UIBackgroundModes: ["bluetooth-central", "bluetooth-peripheral"],
    },
    supportsTablet: true,
    buildNumber: "15.7.01",
    bundleIdentifier: "RN.LKKIM",
    icon: "./assets/icon.png",
  },
  android: {
    versionCode: 1,
    package: "com.anonymous.likkim",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: ["expo-localization"],
  extra: {
    eas: {
      projectId: "fdfad2e7-7bed-4bcd-ae6d-ca6c74643d63",
    },
  },
};
