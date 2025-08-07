## 从 App 接到蓝牙配对命令 🚀

### 🟧 设备正品认证流程

| 步骤 | 方向             | 📨 数据内容    | ✍️ 用途          | ⚙️ 说明                    |
| ---- | ---------------- | -------------- | ---------------- | -------------------------- |
| 1️⃣   | 🔐→📱 Device→App | `ID:<HEX>`     | 设备发起加密认证 | 连接后立即推送，HEX 字符串 |
| 2️⃣   | 📱→🔐 App→Device | `ID:<解密HEX>` | 回传解密 ID      | utf-8→base64 编码          |
| 3️⃣   | 🔐→📱 Device→App | `VALID`        | 正品认证通过     | 明文                       |
| 4️⃣   | 📱→🔐 App→Device | `"validation"` | 响应认证通过     | utf-8→base64 编码          |

---

### 🟦 PIN 配对及钱包操作命令

| 步骤 | 方向             | 📨 数据内容                                    | ✍️ 用途             | ⚙️ 说明                                                                             |
| ---- | ---------------- | ---------------------------------------------- | ------------------- | ----------------------------------------------------------------------------------- |
| 5️⃣   | 📱→🔐 App→Device | `"request"`                                    | 请求 PIN 校验       | utf-8→base64 编码                                                                   |
| 6️⃣   | 🔐→📱 Device→App | `PIN:<pin>,<flag>`                             | 下发 PIN 与处理标志 | 明文                                                                                |
| 7️⃣   | 📱→🔐 App→Device | `pinCodeValue:<输入PIN>,receivedPin:<设备PIN>` | 用户 PIN 输入验证   | utf-8→base64 编码                                                                   |
| 8️⃣   | 📱→🔐 App→Device | `"PIN_OK"`                                     | 验证成功确认        | utf-8→base64 编码                                                                   |
| 9️⃣   | 📱→🔐 App→Device | `address:<chainName>`                          | 获取各链区块链地址  | utf-8→base64 编码，分多次发送，间隔 250ms；如发现缺失，可单独补发该命令请求缺失地址 |
| 🔟   | 🔐→📱 Device→App | `<prefix><address>`                            | 返回链地址          | 明文，如`ETH:0x...`                                                                 |
| 1️⃣1️⃣ | 📱→🔐 App→Device | `pubkey:<chain>,<hdpath>\n`                    | 获取部分链的公钥    | utf-8→base64 编码，结尾`\n`                                                         |
| 1️⃣2️⃣ | 🔐→📱 Device→App | `pubkeyData:<chain>,<pubkey>`                  | 返回链公钥          | 明文                                                                                |

---

### 📌 关键说明

- **📦 所有 App → Device 的数据，均先 utf-8，再 base64 编码发送**
- **⏳ 连续命令建议间隔 ≥ 200ms，避免设备处理拥堵**
- **🔓 数据明文传递，未做加密，仅用 base64 做数据包装**
- **💡 每次写入请使用 writeCharacteristicWithResponseForService 保证响应**

---

## 从 App 接到确认签名对命令 📝🔏

### 🟧 BLE 交易签名协议流程

| 步骤         | 方向             | 📨 数据内容                                                  | ✍️ 用途                           | ⚙️ 说明                                                                                                               |
| ------------ | ---------------- | ------------------------------------------------------------ | --------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| 1️⃣           | 📱→🔐 App→Device | `destinationAddress:<付款地址>,<收款地址>,<手续费>,<链标识>` | 下发交易主要参数（第一步）        | 例如：`destinationAddress:0x123abc...,0x456def...,100000,ethereum` 所有字段直接拼接，无空格；utf-8 编码后 base64 发送 |
| 2️⃣（待开发） | 🔐→📱 Device→App | `PIN_SIGN_READY/PIN_SIGN_FAIL/PIN_SIGN_CANCEL`               | 用户密码验证结果                  | 明文，表示用户在设备端 PIN 校验的结果：OK 通过，FAIL 错误，CANCEL 主动取消                                            |
| 3️⃣           | 🔐→📱 Device→App | `Signed_OK / Signed_REJECT`                                  | 设备确认交易参数                  | 明文：`Signed_OK` 表示设备已收到并同意处理交易；`Signed_REJECT` 表示用户在设备端拒绝该交易，App 应立即终止签名流程数  |
| 4️⃣           | 📱→🌐 App→Server | POST 请求：`{chain, from, to, txAmount, ...}`                | 获取 nonce、gasPrice 等预签名参数 | App 向后端 API 发 POST 请求，获取当前链的参数                                                                         |
| 5️⃣           | 📱→🌐 App→Server | POST 请求：encode 接口请求体                                 | 获取 presign 数据（hex/json）     | 返回链对应预签名数据，用于冷钱包签名                                                                                  |
| 6️⃣           | 📱→🔐 App→Device | `sign:<链标识>,<BIP44路径>,<presign数据>`                    | 下发预签名数据                    | 例如：`sign:ethereum,m/44'/60'/0'/0/0,0xabc...` utf-8 编码后 base64 发送                                              |
| 7️⃣           | 🔐→📱 Device→App | `signResult:<签名数据>` 或 `signResult:ERROR`                | 返回最终签名结果或错误            | 明文，如`signResult:0xf86b...`为签名数据，如失败返回 ERROR                                                            |
| 8️⃣           | 📱→🔐 App→Device | `BCAST_OK` 或 `BCAST_FAIL`                                   | 通知设备广播结果                  | utf-8→base64 编码发送，`BCAST_OK` 表示广播成功；`BCAST_FAIL` 表示广播失败                                             |

---

## 从 App 接到收藏 NFT 命令 🖼️🔗

### 🟩 BLE 收藏 NFT 到冷钱包通讯协议

| 步骤 | 方向             | 📨 数据内容            | ✍️ 用途                     | ⚙️ 说明                                          |
| ---- | ---------------- | ---------------------- | --------------------------- | ------------------------------------------------ |
| 1️⃣   | 📱→🔐 App→Device | `DATA_NFT_TEXT<n>SIZE` | NFT 名称传输头（标志+长度） | n 为 NFT 名称 utf-8 字节数。utf-8 转 base64 发送 |
| 2️⃣   | 🔐→📱 Device→App | `GET1`, `GET2`, ...    | 请求下一个 NFT 名称分包     | 设备每次请求一包（最多 200 字节）                |
| 3️⃣   | 📱→🔐 App→Device | NFT 名称分包，base64   | 分包发送 NFT 名称正文       | 按 200 字节/包，utf-8→base64                     |
| 4️⃣   | 🔐→📱 Device→App | `FINISH`               | NFT 名称传输结束            | 明文，收完全部分包后通知 App 继续发图片          |
| 5️⃣   | 📱→🔐 App→Device | `DATA_NFT_IMG<m>SIZE`  | NFT 图片传输头              | m 为图片 base64 字节数。utf-8 转 base64 发送     |
| 6️⃣   | 🔐→📱 Device→App | `GET1`, `GET2`, ...    | 请求下一个 NFT 图片分包     | 每次最多 200 字节                                |
| 7️⃣   | 📱→🔐 App→Device | NFT 图片分包，base64   | 分包发送 NFT 图片           | 200 字节/包，图片原始 base64                     |
| 8️⃣   | 🔐→📱 Device→App | `FINISH`               | NFT 图片传输结束            | 明文，收完所有图片包后发送                       |

#### 补充说明

- 每部分先发头，设备收到后通过 GET 分多包索取正文
- 每包最多 200 字节，App 按序逐包应答
- NFT 名称正文 utf-8→base64，图片部分本身就是 base64
- 如设备多次请求同一包，App 需能重发

---

## 从 App 接到 OTA 固件升级命令 ⚙️⬆️

### 🟧 BLE OTA 固件升级协议流程

| 步骤 | 方向             | 📨 数据内容                             | ✍️ 用途            | ⚙️ 说明                                                       |
| ---- | ---------------- | --------------------------------------- | ------------------ | ------------------------------------------------------------- |
| 1️⃣   | 📱→🔐 App→Device | `DATA_OTA<文件字节数>SIZE`              | 固件头部           | 例：`DATA_OTA163840SIZE`，utf-8→base64 发送，通知设备准备接收 |
| 2️⃣   | 📱→🔐 App→Device | 固件内容分包，每包 200 字节，HEX 字符串 | 固件分包数据       | 每包 HEX 字符串（200 字节），utf-8→base64，无需等待应答       |
| 3️⃣   | 🔐→📱 Device→App | 可扩展为`OTA_OK`/`OTA_FAIL`             | 设备确认接收或异常 | 升级完成或异常时设备回包反馈，建议支持                        |

#### 补充说明

- 固件头示例：`DATA_OTA12032SIZE`→base64
- 固件每包 HEX 字符串长度=400，循环 offset 分包下发
- 无需等设备 GET，可顺序连续写入

---

## 从 App 接到“确认地址”命令 🏦🔎

### 🟦 BLE 硬件钱包显示/确认地址协议

| 步骤 | 方向             | 📨 数据内容          | ✍️ 用途          | ⚙️ 说明                            |
| ---- | ---------------- | -------------------- | ---------------- | ---------------------------------- |
| 1️⃣   | 📱→🔐 App→Device | `verify:<chainName>` | 显示地址请求命令 | 如：`verify:bitcoin`，utf-8→base64 |
| 2️⃣   | 🔐→📱 Device→App | `Address_OK`         | 地址显示完成反馈 | 明文，用户校验无误后设备回包       |
| 3️⃣   | 🔐→📱 Device→App | 其他提示/错误码      | 异常/扩展命令    | 如遇异常可扩展`Address_FAIL`等命令 |

---

### 命令与链类型映射举例

| 币种       | 显示命令              |
| ---------- | --------------------- |
| BTC 比特币 | `verify:bitcoin`      |
| ETH 以太坊 | `verify:ethereum`     |
| TRX 波场   | `verify:tron`         |
| SOL 索拉纳 | `verify:solana`       |
| COSMOS     | `verify:cosmos`       |
| ...        | 其他见 assetRouteDefs |

---

### 💡 说明与建议

- App 发送命令，设备屏幕弹窗展示收款地址，用户校验无误点确认，设备回`Address_OK`
- 建议 App 同步弹窗提示用户核对收款地址
- 建议设备端有“确认/取消”按钮，App 端支持异常码、断开等容错
