# Utils 目录说明

本目录包含项目中的工具函数和辅助代码，这些代码为项目的各个模块提供通用功能支持，帮助简化业务逻辑和提高代码复用性。

## 目录结构及主要内容

- `activityLog.js`：活动日志相关的工具函数。
- `BluetoothPermissions.js`：蓝牙权限管理相关工具。
- `dev_fetch.ts`、`dev.tsx`：开发环境辅助工具。
- `DeviceContext.js`：设备上下文管理工具。
- `displayDeviceAddress.js`：设备地址显示相关工具。
- `fetchTransactionFee.js`：交易费用获取工具。
- `handleDevicePress.js`、`handleDisconnectDevice.js`、`handlePinSubmit.js` 等：设备操作相关辅助函数。
- `monitorVerificationCode.js`：验证码监控工具。
- `OnboardingScreen.js`：引导页面相关工具。
- `handleSendDigital.js`：数字资产发送相关辅助函数。
- `handleSaveToDevice.js`：保存数据到设备的辅助函数。
- `handleVerifyAddress.js`：地址验证相关工具函数。
- `queryNFTDetail.js`：NFT 详情查询工具。
- `scanDevices.js`：设备扫描相关工具。
- `ScreenLock.js`：屏幕锁定管理工具。
- `selectCrypto.js`：加密货币选择辅助函数。

## 代码职责

- 提供通用的功能函数，减少重复代码
- 支持业务逻辑的实现，提升代码可维护性
- 处理与设备交互、权限管理、数据格式化等相关操作

## 维护建议

- 工具函数应保持通用和独立，避免与具体业务逻辑耦合
- 新增工具函数时请编写相应的注释和测试用例
- 定期整理和优化工具代码，确保性能和可读性

---
