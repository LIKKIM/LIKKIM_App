/**
 * LIKKIM Dynamic Config
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
    runtimeVersion: {
      policy: "appVersion",
    },
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSBluetoothAlwaysUsageDescription:
        "Access to Bluetooth is required to connect to the wallet device",
      NSBluetoothPeripheralUsageDescription:
        "Access to Bluetooth is required to connect to the wallet device",
      NSLocationWhenInUseUsageDescription:
        "Location access is needed for Bluetooth scanning",
      UIBackgroundModes: ["bluetooth-central", "bluetooth-peripheral"],
    },
    supportsTablet: false,
    buildNumber: "16.3.0",
    bundleIdentifier: "RN.LKKIM",
    icon: "./assets/icon.png",
  },
  android: {
    runtimeVersion: "1.0.0",
    config: {
      googleMaps: {
        apiKey: "AIzaSyAaLPaHuHj_vT7cHsA99HZeuAH_Z1p3Xbg",
      },
    },
    versionCode: 5,
    package: "com.app.likkim",
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  plugins: [
    "expo-localization",
    [
      "expo-local-authentication",
      {
        faceIDPermission: "Allow $(PRODUCT_NAME) to use Face ID.",
      },
    ],
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
  ],
  extra: {
    eas: {
      projectId: "fdfad2e7-7bed-4bcd-ae6d-ca6c74643d63",
    },
  },
  updates: {
    url: "https://u.expo.dev/fdfad2e7-7bed-4bcd-ae6d-ca6c74643d63",
  },
};
