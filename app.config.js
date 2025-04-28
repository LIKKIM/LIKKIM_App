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
      NSLocationAlwaysUsageDescription:
        "Location access is required for background location updates.",
      NSMotionUsageDescription: "Motion data is used for device interactions.",
      UIBackgroundModes: [
        "bluetooth-central",
        "bluetooth-peripheral",
        "location",
        "fetch",
        "remote-notification",
      ],
      NFCReaderUsageDescription:
        "Allow $(PRODUCT_NAME) to read NFC tags to support secure transactions.",
    },
    supportsTablet: false,
    buildNumber: "16.3.3",
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
    package: "com.likkim.wallet",
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
    [
      "expo-notifications",
      {
        mode: "production",
        icon: "./assets/notification-icon.png",
        color: "#ffffff",
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
