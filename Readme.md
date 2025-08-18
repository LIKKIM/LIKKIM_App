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

### Setup & Run

1. **Step1_installlegacy:** Run the following command to install all dependencies:

   ```bash
   yarn install
   ```

2. **Step2_updateNative:** Generate native iOS and Android projects:

   ```bash
   expo prebuild
   ```

3. **Step3_podinstall:** For iOS, install CocoaPods dependencies:

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Step4.1_ios:** Run the app on iOS simulator or device:

   ```bash
   expo run:ios
   ```

5. **Step4.2_android:** Run the app on Android emulator or device:

   ```bash
   expo run:android
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
