# Secure Hardware Interface Companion App

**This project** is a cross-platform mobile application designed as a visual interface companion to a secure external hardware module. It provides users with access to view device-generated data, confirm external prompts, and operate through Bluetooth-based interaction.

> **Note:** This repository contains only UI and device communication logic. No cryptographic operations or financial workflows are implemented within this codebase.

---

## Key Capabilities

- View addresses or data from the external secure device
- Initiate device-assisted actions
- Retrieve and display public data (e.g., history, status) via API
- Connect and communicate with hardware modules via BLE
- Support for iOS and Android native environments

---

## Technology Stack

- React Native (with Expo)
- BLE (Bluetooth Low Energy) support
- iOS and Android native integration

---

## Setup Instructions

### Prerequisites

- Node.js
- npm or yarn
- Expo CLI
- Xcode (macOS, for iOS)
- CocoaPods (for native dependencies)

### Installation

```bash
yarn install
npx expo prebuild
cd ios && pod install && cd ..
```

### Running the App

```bash
# iOS
npm run ios

# Android
npm run android
```

---

## iOS BLE Configuration

To enable BLE background support on iOS, update `ios/Info.plist`:

```xml
<key>UIBackgroundModes</key>
<array>
  <string>bluetooth-central</string>
</array>
```

Also activate: `Background Modes > Uses Bluetooth LE accessories` in Xcode.

---

## Security Notes

- The app **does not process or expose sensitive data**
- All secure operations occur externally on dedicated hardware
- The mobile client only facilitates display and communication
- Credentials, authorization, or financial data are **not stored or transmitted**

---

## Maintenance Tips

### Clear Cache and Rebuild

```bash
npx react-native start --reset-cache
```

### Reinstall iOS Native Modules

```bash
cd ios && pod install && cd ..
```

---

## License & Usage

This codebase is open for community use and UI integration purposes only. It excludes device internals, firmware logic, or cryptographic designs to maintain secure boundaries.

---

## Disclaimer

This software is a part of a secure interaction system. No financial transactions, private data handling, or blockchain operations are performed in this application. For questions or collaborations, please contact the maintainers through verified channels.

---
