# ColdWallet 📱

`ColdWallet` 是一个专注于数字货币交易的移动应用程序，使用 React Native 和 ESP32 设备开发。该应用程序支持发送和接收各种数字货币，保证了交易的安全性和便捷性。

## 核心功能和接口 🚀

### 1. 钱包地址生成接口(接受数字货币)

- 目的： 生成用户的钱包地址，供用户分享以接收数字货币。
- 实现方式： 通过生成密钥对（公钥和私钥）实现。公钥通过特定算法转换成地址，私钥用于后续的签名过程,私钥永久存储在 ESP32 冷钱包中，不离开设备。

这是整理后的 `README.md` 文件内容，详细描述了如何在 React Native 应用中实现接收比特币功能，并通过 ESP32 冷钱包设备管理密钥和地址。

---

# ColdWallet 应用 - 接收数字货币功能 (目标是做到一键转入提升用户使用体验)

ColdWallet 应用通过与 ESP32 冷钱包设备的交互，提供了一种安全的方式来接收比特币。以下是该功能的详细实现和操作步骤。

## 功能详解

### 1. 钱包地址生成接口（接受数字货币）

- 目的：生成用户的钱包地址，供用户分享以接收数字货币。
- 实现方式：通过生成密钥对（公钥和私钥）。公钥通过特定算法转换成地址，私钥用于后续的签名过程，私钥永久存储在 ESP32 冷钱包中，不离开设备。

## 实现步骤

### 步骤一：设备发现与配对

- 设备配对：使用蓝牙或其他无线技术进行设备的发现和配对。
- 安全验证：用户需通过输入密码进行安全握手，确保连接的安全性并验证设备的合法性。
- (在 React Native 应用上完成密码输入
  优势:

用户体验：移动设备通常拥有更友好的用户界面，提供更好的输入体验，如触摸屏键盘和视觉反馈。
易用性：大多数用户已经习惯在手机应用上输入密码和其他凭证，因此从用户习惯角度看更加直观。
灵活性：应用可以更容易地实现多种验证方法，例如集成生物识别验证（指纹或面部识别）作为密码的补充或替代。
劣势:

安全风险：在应用层面，密码可能需要通过网络发送到设备，增加了被拦截的风险。虽然可以通过加密通信减少风险，但这增加了实现的复杂性。
信息泄露：如果移动设备被恶意软件感染，用户输入的密码可能会被记录或窃取。)

- (在 ESP32 设备上完成密码输入
  优势:

安全性：密码验证直接在硬件设备上完成，可以减少通过不安全网络传输敏感信息的需要。
直接控制：设备可以直接控制验证过程和任何错误处理，减少对外部设备的依赖。
劣势:

用户体验：ESP32 设备通常没有丰富的用户界面，如果需要在设备上输入密码，可能需要额外的硬件支持（如键盘或显示屏），这会增加成本和复杂性。
可用性：不是所有的 ESP32 设备都配备有用于输入密码的接口，这限制了其在没有外部设备支持的情况下独立工作的能力。
综合推荐
对于大多数用户场景，推荐在 React Native 应用上完成密码输入，因为它提供了更好的用户体验和更高的灵活性。确保使用安全的通信协议（如 TLS/SSL）来保护密码在网络中的传输，并考虑使用额外的安全措施（如双因素认证），以进一步保护用户数据的安全。)

- (
  双因素认证（2FA）是一种安全措施，要求用户提供两种形式的身份验证，从而增加账户安全性。这通常涉及到两种不同类型的凭证：一种是用户知道的（如密码），另一种是用户拥有的（如手机上的一次性验证码）或用户本人的生物特征（如指纹或面部识别）。下面是一个具体例子，说明如何在与 ESP32 设备交互的应用中实现双因素认证：

示例：React Native 应用与 ESP32 设备的双因素认证流程
假设您正在开发一个使用 React Native 的移动应用，该应用需要与 ESP32 冷钱包设备进行安全交互，以下是实现双因素认证的步骤：

步骤一：密码验证
用户在 React Native 应用上输入密码：用户首先在手机应用上输入他们的密码，这是第一层安全验证。
应用验证密码：应用将密码通过安全的加密通道发送到 ESP32 设备进行验证。
步骤二：一次性验证码（OTP）
生成验证码：在用户设备上的应用生成一次性验证码，或者使用第三方服务（如 Google Authenticator 或 Authy）来生成。此验证码在一定时间后过期，通常是 30 秒或 1 分钟。
用户输入验证码：用户在手机应用上查看并输入这个一次性验证码。
应用验证验证码：应用确认验证码的正确性。这通常涉及到与生成验证码的服务进行比对，或者直接在本地验证。
可选步骤：生物识别验证
使用生物识别技术：作为可选的二次验证，应用可以请求用户进行指纹扫描或面部识别。
设备进行验证：用户的手机或外接的生物识别设备验证用户的生物特征。
安全通信
在整个过程中，所有敏感信息（如密码和验证码）都应通过 SSL/TLS 加密的通道传输，以防止中间人攻击和数据泄露。
这种双因素认证的方法有效增加了安全层次，即使密码被窃取，没有第二因素的验证信息，攻击者也无法访问设备或数据。这在处理敏感信息（如金融交易或个人数据）时尤其重要。)

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
