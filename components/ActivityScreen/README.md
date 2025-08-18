# ActivityScreen 目录说明

本目录包含与交易页面相关的多个 React Native 组件集合，负责实现交易相关的界面和交互逻辑。

## 交易流程概述

交易流程涉及多个环节，主要包括：

- 交易发起：用户通过界面提交交易请求。
- 交易签名（signTransaction.js 和 components/Activity.js 中相关函数）：处理交易的签名逻辑，确保交易的合法性和安全性。主要函数包括：
  - `signTransaction`（signTransaction.js）：主签名函数，负责连接设备、发送交易信息、监听设备响应、获取预签名参数、构造签名请求并发送签名数据。
  - `getChainMappingMethod`（signTransaction.js）：根据链名称映射对应的签名方法。
  - `getPublicKeyByChain`（signTransaction.js）：根据链名称获取对应的公钥。
  - `monitorSignedResult`（components/Activity.js）：监听 LUKKEY 嵌入式设备的签名结果并广播交易的函数。
  - `monitorVerificationCode`（components/Activity.js）：监听验证码的函数。
  - `stopMonitoringVerificationCode`（components/Activity.js）：停止监听验证码的函数。
  - `stopMonitoringTransactionResponse`（components/Activity.js）：停止监听交易反馈的函数。
- 交易广播：将签名后的交易发送到区块链网络。
- 交易确认：监听交易状态，更新交易记录和界面显示。

本目录中的组件协同支持上述流程的实现，确保交易操作的完整性和用户体验。

## 目录结构及主要内容

- `TransactionList.js`：交易列表组件，展示用户的交易记录。
- `TransactionDetail.js`：交易详情组件，显示单笔交易的详细信息。
- `TransactionActions.js`：交易操作组件，提供发送、取消等交易相关操作。
- 其他辅助交易相关组件，支持交易页面的完整功能实现。

## 组件职责

- 实现交易页面的 UI 渲染和用户交互
- 管理交易数据的展示和操作流程
- 与上层组件和状态管理进行数据交互

## 维护建议

- 组件应保持单一职责，便于维护和测试
- 代码风格应统一，遵循项目规范
- 及时更新文档，确保功能说明准确

---
