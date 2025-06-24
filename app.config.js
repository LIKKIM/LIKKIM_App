const mapKeys = require("./env/mapKeys");

export default {
  owner: "likkimteam", // ✅ 新 Expo 账号（避免使用曾被封账号）   owner: "secureteam", //❌
  name: "Lukkey Vault", // ✅
  slug: "likkim", //  新 slug，用于 OTA、缓存等路径  slug: "securewallet",
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
        "Allow $(PRODUCT_NAME) to communicate with your device via NFC.",
      NSAppTransportSecurity: {
        NSExceptionDomains: {
          "bt.likkim.com": {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSRequiresCertificateTransparency: false,
          },
          "swap.likkim.com": {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSRequiresCertificateTransparency: false,
          },
          "df.likkim.com": {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSRequiresCertificateTransparency: false,
          },
          "file.likkim.com": {
            NSIncludesSubdomains: true,
            NSExceptionAllowsInsecureHTTPLoads: false,
            NSExceptionRequiresForwardSecrecy: true,
            NSRequiresCertificateTransparency: false,
          },
        },
      },
    },
    supportsTablet: false,
    buildNumber: "1.0.05",
    bundleIdentifier: "com.secnet.vaultapp",
    icon: "./assets/icon.png", //❌
  },
  android: {
    runtimeVersion: "1.0.0",
    config: {
      googleMaps: {
        apiKey: mapKeys.GOOGLE_MAPS_API_KEY,
      },
    },
    versionCode: 5,
    package: "com.likkim.wallet", //❌
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
      projectId: "fdfad2e7-7bed-4bcd-ae6d-ca6c74643d63", //❌
    },
  },
};
