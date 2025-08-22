# Modal 组件模块

本模块包含项目中所有模态框（Modal）相关的 React Native 组件及其样式和测试文件。

## 文件功能说明

- **BluetoothModal.js**  
  负责蓝牙设备的扫描、显示和连接管理，支持设备列表刷新、断开连接和设备点击操作，包含蓝牙信号强度显示和设备地理位置保存功能。

- **ActivityProgressModal.js**  
  显示活动进度的模态框，带有动画效果，展示当前操作状态和关闭按钮。

- **AddressBookModal.js**  
  地址簿模态框，支持地址搜索、添加、编辑、删除和复制功能，包含网络选择和本地存储管理。

- **ChangeLockCodeModal.js**  
  修改锁屏密码的模态框，支持输入当前密码，带有密码显示/隐藏切换和动画效果。

- **AddCryptoModal.js**  
  资产添加模态框，支持资产搜索、按链分类筛选、多选资产并确认添加，带有动画和暗黑模式支持。

- **AmountModal.js**  
  金额输入模态框，支持输入金额、显示余额、手续费选择、价格转换和下一步操作，带有暗黑模式和动画效果。

- **ChainSelectionModal.js**  
  链选择模态框，支持显示所有链和按链名称排序的链列表，带有暗黑模式和动画效果。

- **CheckStatusModal.js**  
  状态检查模态框，支持显示不同状态（成功、失败、等待等）的动画和提示信息，带有进度条和关闭按钮。

- **ConfirmConvertModal.js**  
  确认兑换模态框，显示兑换详情和确认、取消按钮，带有动画效果。

- **ConfirmDisconnectModal.js**  
  确认断开连接模态框，显示确认提示和确认、取消按钮，带有动画效果。

- **ContactFormModal.js**  
  联系人表单模态框，支持输入收件人地址、地址有效性检测、打开地址簿选择地址，带有暗黑模式和动画效果。

- **ConvertModal.js**  
  兑换模态框，支持选择兑换代币、输入兑换金额、显示兑换汇率、确认兑换操作，带有暗黑模式和动画效果。

- **CurrencyModal.js**  
  货币选择模态框，支持货币搜索、显示国家国旗、选择货币，带有暗黑模式和动画效果。

- **DeleteConfirmationModal.js**  
  删除确认模态框，提示用户确认移除资产卡，带有动画效果和取消按钮。

- **DeleteWalletConfirmationModal.js**  
  删除钱包确认模态框，显示警告信息和删除、取消按钮，带有动画效果。

- **DisableLockScreenModal.js**  
  禁用锁屏模态框，支持输入密码、密码显示/隐藏切换、提交和取消操作。

- **EmptyWalletView.js**  
  空钱包视图，带有背景视频和动画效果，支持点击开始或测试钱包功能。

- **EnterLockCodeModal.js**  
  输入锁屏密码模态框，支持密码输入、密码显示/隐藏切换、提交和取消操作。

- **ErrorModal.js**  
  错误提示模态框，显示错误信息和关闭按钮，带有动画效果。

- **LanguageModal.js**  
  语言选择模态框，支持语言搜索和选择，带有暗黑模式和动画效果。

- **LockCodeModal.js**  
  锁屏密码设置模态框，支持输入新密码、确认密码、密码显示/隐藏切换、错误提示、提交和取消操作。

- **NFTDetailModal.js**  
  NFT 详情模态框，支持显示 NFT 图片、名称、合约地址、Token ID、协议类型、描述和价格信息，带有保存到设备和发送功能。

- **PendingModal.js**  
  简单的等待模态框，带有关闭按钮。

- **PreviewSendModal.js**  
  发送预览模态框，显示 NFT 信息、收件人地址，支持关闭和发送操作，带有暗黑模式支持。

- **ReceiveAddressModal.js**  
  通用收款地址模态框，支持显示地址、二维码、复制地址、验证地址状态和关闭操作，带有暗黑模式和动画效果。

- **SecurityCodeModal.js**  
  PIN 码输入模态框，支持 PIN 码输入、提交和取消操作，带有状态显示和暗黑模式支持。

- **SelectAssetModal.js**  
  加密资产选择模态框，支持资产搜索、显示资产列表、选择资产和取消操作，带有暗黑模式和动画效果。

- **SendItemModal.js**  
  发送 Item 模态框，显示 NFT 信息、收件人地址，支持关闭和发送操作，带有暗黑模式支持。

- **SuccessModal.js**  
  成功提示模态框，显示成功动画、消息和关闭按钮，带有动画效果。

- **TransactionChainFilterModal.js**  
  交易链过滤模态框，支持选择链过滤交易，带有暗黑模式和动画效果。

- **TransactionConfirmationModal.js**  
  交易确认模态框，显示交易详情，包括金额、支付地址、收款地址、手续费、检测到的网络等信息，支持确认和取消操作。
