# 样式文件目录说明

本目录包含项目中所有样式相关的 JavaScript 文件，以下是每个文件的简要说明：

- **ActivityScreenStyle.js**  
  定义"交易"页面（Activity Screen）相关的样式，包含深色模式和浅色模式的颜色令牌，按钮、输入框、模态框等组件的样式。

- **baseStyles.js**  
  提供基础样式和通用样式片段，供其他样式文件复用，如按钮基础样式、模态面板基础样式等。

- **constants.js**  
  定义全局样式常量，如字体大小、圆角半径等，方便统一管理和调用。

- **SecureDeviceScreenStyle.js**  
  定义"通用"页面（Secure Device Screen）相关的样式，支持深色和浅色主题，涵盖布局、按钮、文本等样式。

- **styles.js**  
  项目通用样式文件，包含全局通用样式规则，可能用于多个页面和组件。

- **VaultScreenStyle.js**  
  定义"资产"页面（Vault Screen）相关的样式，支持深色和浅色主题，包含卡片、模态框、按钮、动画等样式。

---

以上样式文件均支持深色模式和浅色模式切换，采用 React Native 的 StyleSheet 创建，结合项目中的颜色令牌和基础样式实现统一风格。

如需了解具体样式实现，请查看对应文件源码。
