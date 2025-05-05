# LIKKIM Cold Wallet Mobile App

**LIKKIM** is a cross-platform mobile application designed to interact with a secure cold wallet hardware device. It allows users to manage digital assets through secure operations such as address display, transaction requests, and blockchain balance queries.

> **Important:** This repository includes only the mobile client logic. All cryptographic processes, key management, and signing operations are strictly handled by the external hardware device and are not exposed in this codebase.

---

## Features

- Display wallet address for receiving assets
- Send transaction requests via secure device interaction
- Retrieve balance and transaction history via blockchain APIs
- Device pairing and user authentication
- Secure communication interface (abstracted)

---

## Tech Stack

- React Native (with Expo)
- Bluetooth Low Energy (BLE) communication
- Blockchain API integration (e.g., ethers.js or web3.js)
- iOS / Android native support

---

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Xcode (for iOS)
- CocoaPods (for iOS native dependencies)

### Installation

```bash
npm install
npx expo prebuild
cd ios && pod install && cd ..
```

### Run the App

```bash
# For iOS
npm run ios

# For Android
npm run android
```

---

## iOS Configuration

To enable background BLE communication on iOS, update `ios/Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>bluetooth-central</string>
</array>
```

Also enable "Background Modes" > "Uses Bluetooth LE accessories" in Xcode project settings.

---

## Security Guidelines

- Do **not** log or expose sensitive device data or user input.
- Do **not** modify the internal device communication or authentication flows.
- Private keys are **never stored** or handled in the app.
- The hardware device performs all sensitive operations securely and offline.

---

## Troubleshooting

### Clear Cache and Rebuild

```bash
npx react-native start --reset-cache
```

### Reinstall iOS Dependencies

```bash
cd ios && pod install && cd ..
```

---

## License

This project is distributed under a permissive license for integration and community contribution. It does **not** include firmware, hardware specifications, or cryptographic implementation details for security reasons.

---

## Disclaimer

This software is part of a security-critical ecosystem. All interactions with the hardware device are abstracted and protected. Unauthorized analysis or reverse engineering of communication protocols is strictly prohibited.

For contributions or support, please contact the project maintainers through official channels.

---
