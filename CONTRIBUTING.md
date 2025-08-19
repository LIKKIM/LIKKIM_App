# 贡献指南

感谢您对本开源项目的关注和贡献！为了帮助您顺利参与项目开发，请仔细阅读以下贡献流程和规范。

## 1. 环境搭建

请确保您已安装以下环境：

- Node.js（建议使用 LTS 版本）
- yarn 或 npm
- Expo CLI
- Xcode（macOS 用户，iOS 开发必备）
- CocoaPods（iOS 依赖管理）

安装依赖：

```bash
yarn install
```

生成原生项目：

```bash
expo prebuild
```

安装 iOS 依赖：

```bash
cd ios && pod install && cd ..
```

## 2. 代码规范

- 使用 JavaScript/TypeScript 标准编码风格
- 遵循项目中已有的代码风格和结构
- 变量命名清晰，函数职责单一
- 提交信息请简洁明了，遵循 [Conventional Commits](https://www.conventionalcommits.org/zh-hans/v1.0.0/)

## 3. 开发流程

1. Fork 本仓库到您的账户
2. 新建分支，命名规范如 `feature/xxx` 或 `fix/xxx`
3. 在本地完成开发和测试
4. 提交代码并推送到您的远程分支
5. 提交 Pull Request，描述您的改动内容和目的

## 4. 代码审查

- PR 会由维护者进行代码审查
- 可能会要求您修改代码以符合项目规范
- 通过审查后，PR 将被合并

## 5. 测试要求

- 请确保您的代码通过现有测试
- 新增功能请补充相应测试用例
- 运行测试命令：

```bash
yarn test
```

## 6. 报告问题

- 请在 Issue 中详细描述问题
- 提供复现步骤和相关日志
- 如果可能，附上截图或代码片段

## 7. 其他

- 欢迎提出改进建议和新功能需求
- 参与社区讨论，帮助其他开发者

感谢您的贡献，让我们一起打造更好的项目！
