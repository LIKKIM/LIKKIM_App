# ColdWallet 📱

`ColdWallet` 是一个专注于数字货币交易的移动应用程序，使用 React Native 和 ESP32 设备开发。该应用程序支持发送和接收各种数字货币，保证了交易的安全性和便捷性。

## 核心功能和接口 🚀

### 1. 钱包地址生成接口(接受数字货币)

- 目的： 生成用户的钱包地址，供用户分享以接收数字货币。
- 实现方式： 通过生成密钥对（公钥和私钥）实现。公钥通过特定算法转换成地址，私钥用于后续的签名过程,私钥永久存储在 ESP32 冷钱包中，不离开设备。

这是整理后的 `README.md` 文件内容，详细描述了如何在 React Native 应用中实现接收比特币功能，并通过 ESP32 冷钱包设备管理密钥和地址。

---

# ColdWallet 应用 - 接收数字货币功能

ColdWallet 应用通过与 ESP32 冷钱包设备的交互，提供了一种安全的方式来接收比特币。以下是该功能的详细实现和操作步骤。

## 功能详解

### 1. 钱包地址生成接口（接受数字货币）

- 目的：生成用户的钱包地址，供用户分享以接收数字货币。
- 实现方式：通过生成密钥对（公钥和私钥）。公钥通过特定算法转换成地址，私钥用于后续的签名过程，私钥永久存储在 ESP32 冷钱包中，不离开设备。

## 实现步骤

### 步骤一：设备发现与配对

- 设备配对：使用蓝牙或其他无线技术进行设备的发现和配对。
- 安全验证：用户需通过输入密码进行安全握手，确保连接的安全性并验证设备的合法性。

### 步骤二：建立安全通信

- 密钥交换：设备配对成功后，使用诸如 Diffie-Hellman 协议的方法进行公钥密钥交换。公钥交换：在 Diffie-Hellman 密钥交换中，每一方都生成自己的公钥和私钥。公钥被发送给对方，而私钥则保持不被分享。
- 加密通道：建立加密通信通道，确保所有传输数据的安全性。

### 步骤三：请求钱包地址

- 发送请求：通过已建立的安全通道，从 ESP32 冷钱包设备请求获取钱包地址。
- 接收地址：冷钱包设备响应请求并返回钱包地址。

### 步骤四：显示钱包地址

- 展示地址：在 React Native 应用的用户界面中清晰地显示接收到的钱包地址。
- 用户指示：提供操作指示和错误处理信息，帮助用户理解如何使用地址接收比特币。

### 2. 交易签名接口

- 目的： 确保交易请求由合法的发送方发起，保护交易不被篡改。
- 实现方式： 使用私钥对交易信息进行加密，生成数字签名。这个签名与交易信息一起发送到区块链网络，网络节点将使用公钥验证签名的有效性。

### 3. 发送交易接口

- 目的： 实现数字货币从一个钱包发送到另一个钱包。
- 实现方式： 构造交易数据，包括接收方地址、发送金额、手续费等信息，使用交易签名接口进行签名后通过区块链网络广播。

### 4. 余额查询接口

- 目的： 查询指定钱包地址中的货币余额。
- 实现方式： 通过区块链网络 API 查询钱包地址的当前余额。

### 5. 交易记录接口

- 目的： 查看钱包地址的交易历史，包括接收和发送的记录。
- 实现方式： 使用区块链网络 API 查询与钱包地址相关的所有交易记录。

### 6. 验证接口

- 目的： 验证交易的真实性和钱包的有效性。
- 实现方式： 通过区块链网络提供的服务验证交易和钱包的合法性及状态。

### 7. 安全措施

- 目的： 保护用户的私钥，防止私钥外泄导致资产损失。
- 实现方式： 私钥应在设备内部安全地存储，不应在网络中传输或在设备外部存储，使用硬件钱包或安全的密钥存储解决方案管理私钥。

## 技术选型建议 🔧

- 区块链交互： 可以使用如 `web3.js` 或 `ethers.js` 等库进行以太坊等区块链的交互。
- 移动端与硬件设备通信： 根据安全需求选择合适的通信方式，如蓝牙（BLE）、WiFi 等。

请确保在开发和部署过程中严格遵守安全最佳实践，以防止任何形式的安全威胁。

# Setup

This is the `ColdWallet` mobile app, developed using React Native and Expo. The following steps will guide you through setting up and running the project on an iOS simulator.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- Node.js
- npm (usually comes with Node.js)
- Xcode (for iOS development)
- CocoaPods (for managing iOS dependencies)

## Setup

To set up the project, follow these steps:

1. Create a New Expo App

   ```bash
   npx create-expo-app ColdWallet
   ```

   This command creates a new Expo app in the `ColdWallet` directory.

2. Navigate to the Project Directory

   ```bash
   cd ColdWallet
   ```

3. Install Dependencies

   ```bash
   npm i
   ```

   This command installs all the necessary dependencies for the project.

4. Prebuild the Expo Project

   ```bash
   npx expo prebuild
   ```

   This step prepares the project for building with native code modifications.

5. Install iOS Dependencies
   Navigate to the iOS directory and install CocoaPods dependencies:

   ```bash
   cd ios
   pod install
   cd ../
   ```

   This step is necessary for iOS development to ensure all native dependencies are correctly linked.

6. Run the App on iOS Simulator
   ```bash
   npm run ios
   ```
   This command will start the iOS simulator and launch your app. Ensure that Xcode is correctly set up and that you have an iOS simulator installed.

## Additional Commands

- Start the Expo Developer Tools in the Browser

  ```bash
  expo start
  ```

  This command runs the Expo CLI server and lets you open the app on a physical device or simulator.

- Run the App on an Android Simulator
  ```bash
  npm run android
  ```
  Make sure you have an Android simulator set up or a device connected before running this command.

## Troubleshooting

If you encounter issues with `pod install`, ensure your CocoaPods installation is up to date. You can update CocoaPods using:

```bash
sudo gem install cocoapods
```

For other issues, refer to the [Expo documentation](https://docs.expo.dev/) or check the community forums for similar problems and solutions.
