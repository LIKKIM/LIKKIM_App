# Secure Hardware Interface Companion App

**项目简介**  
本项目是一个跨平台的移动应用，作为安全外部硬件模块的可视化界面伴侣。用户可以通过该应用查看设备生成的数据，确认外部提示，并通过蓝牙进行交互操作。

> **注意：** 本仓库仅包含 UI 和设备通信逻辑，不包含任何加密操作或金融工作流。

---

## 技术栈

- React Native（基于 Expo）
- 蓝牙低功耗（BLE）支持
- iOS 和 Android 原生集成

---

## 技术栈

- React Native（基于 Expo）
- 蓝牙低功耗（BLE）支持
- iOS 和 Android 原生集成

---

## 项目结构

- `android/`：Android 原生项目代码和配置
- `ios/`：iOS 原生项目代码和配置
- `assets/`：应用使用的图片、视频、图标等静态资源
- `components/`：React Native 组件代码
- `config/`：项目配置文件，如资产信息、链配置、语言等
- `docs/`：项目相关文档
- `patches/`：第三方依赖的补丁文件
- `store/`：状态管理相关代码
- `styles/`：样式文件
- `utils/`：工具函数和辅助代码
- 根目录下的配置文件如 `app.config.js`、`babel.config.js`、`metro.config.js`、`package.json` 等，分别负责项目配置、构建和依赖管理

---

## 安装与运行

### 环境准备

- Node.js
- npm 或 yarn
- Expo CLI
- Xcode（macOS，iOS 开发必备）
- CocoaPods（iOS 原生依赖管理）

### 安装步骤

1. **Step1_installlegacy:** 安装所有依赖

   ```bash
   yarn install
   ```

2. **Step2_updateNative:** 生成 iOS 和 Android 原生项目

   ```bash
   expo prebuild
   ```

3. **Step3_podinstall:** iOS 平台安装 CocoaPods 依赖

   ```bash
   cd ios && pod install && cd ..
   ```

4. **Step4.1_ios:** 在 iOS 模拟器或真机上运行应用

   ```bash
   expo run:ios
   ```

5. **Step4.2_android:** 在 Android 模拟器或真机上运行应用

   ```bash
   expo run:android
   ```

### 常见问题及解决方案

- 清理缓存并重启

  ```bash
  npx react-native start --reset-cache
  ```

- 重新安装 iOS 原生依赖

  ```bash
  cd ios && pod install && cd ..
  ```

---

## 配置说明

### iOS BLE 配置

为支持 iOS 后台蓝牙功能，请在 `ios/Info.plist` 中添加：

```xml
<key>UIBackgroundModes</key>
<array>
  <string>bluetooth-central</string>
</array>
```

并在 Xcode 中启用 `Background Modes > Uses Bluetooth LE accessories`。

---

## 使用指南

本应用主要功能包括：

- 通过蓝牙连接安全硬件设备
- 查看设备生成的地址和数据
- 确认设备发出的操作提示
- 显示设备相关的历史和状态信息

---

## 项目结构

- `android/`：Android 原生项目代码和配置
- `ios/`：iOS 原生项目代码和配置
- `assets/`：应用使用的图片、视频、图标等静态资源
- `components/`：React Native 组件代码
- `config/`：项目配置文件，如资产信息、链配置、语言等
- `docs/`：项目相关文档
- `patches/`：第三方依赖的补丁文件
- `store/`：状态管理相关代码
- `styles/`：样式文件
- `utils/`：工具函数和辅助代码
- 根目录下的配置文件如 `app.config.js`、`babel.config.js`、`metro.config.js`、`package.json` 等，分别负责项目配置、构建和依赖管理

---
