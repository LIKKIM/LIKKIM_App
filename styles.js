// styles.js
import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#21201E",
  },
  titleText: {
    color: "#21201E",
    fontSize: 24, // 字体大小为24
    fontWeight: "bold", // 字体加粗
    marginBottom: 20, // 与下一个元素间距20
  },
  container: {
    backgroundColor: "#ddd",
  },

  headerStyle: {
    backgroundColor: "#fff",
  },
  headerRight: {
    backgroundColor: "#ddd",
  },
  addIconButton: {
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 60, // 调整以确保下拉菜单位于setting icon正下方
    backgroundColor: "#E5E1E9",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },

  dropdownButtonText: {
    color: "#000",
    fontSize: 16,
  },
  // 更多的样式定义...
});

export const darkTheme = StyleSheet.create({
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  titleText: {
    color: "#fff",
    fontSize: 24, // 字体大小为24
    fontWeight: "bold", // 字体加粗
    marginBottom: 20, // 与下一个元素间距20
  },
  container: {
    backgroundColor: "#121212",
  },

  headerStyle: {
    backgroundColor: "#21201E",
  },
  headerRight: {
    backgroundColor: "#21201E",
  },
  addIconButton: {
    backgroundColor: "#21201E",
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 60, // 调整以确保下拉菜单位于setting icon正下方
    backgroundColor: "#3F3D3C",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },

  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  // 更多的样式定义...
});

// 使用StyleSheet创建并导出应用的样式
const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
  },
  addIconButtonCommon: {
    marginRight: 16,
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#404040",
  },
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  // container: 定义了应用的主容器样式
  container: {
    flex: 1,
    backgroundColor: "#121212", // 深灰色背景，适用于暗模式
    alignItems: "center", // 子元素沿着主轴（即垂直轴）居中对齐
    justifyContent: "center", // 子元素沿着交叉轴（即水平轴）居中对齐
    padding: 20, // 内边距为20
  },
  // safeArea: 用于处理屏幕顶部安全区域
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // 保持背景色一致
  },
  // card: 定义了一个卡片样式
  card: {
    width: 300, // 宽度为300
    height: 170, // 高度为100
    borderRadius: 20, // 边角圆润程度为16
    overflow: "hidden",
    justifyContent: "center", // 内容居中显示
    alignItems: "center", // 内容居中显示
    backgroundColor: "#3F3D3C", // 深灰色背景，比container稍浅
    marginBottom: 20, // 与下一个元素间距20
    shadowColor: "#000", // 阴影颜色为黑色
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.25, // 阴影透明度
    shadowRadius: 3.84, // 阴影扩散范围
    elevation: 5, // 用于Android的材质阴影高度
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // 使遮罩层填充整个父容器
    backgroundColor: "rgba(108, 108, 244, 0.1)",
  },
  // cardText: 卡片内的文字样式
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  // roundButton: 圆形按钮的样式
  roundButton: {
    backgroundColor: "#3F3D3C", // 按钮背景为灰色
    borderRadius: 30, // 圆角为30
    paddingVertical: 10, // 垂直内边距为10
    paddingHorizontal: 20, // 水平内边距为20
    width: "100%",
    height: 60,
    alignItems: "center", // 文本居中对齐
    justifyContent: "center", // 文本居中对齐
    marginBottom: 20, // 与下一个元素间距20
  },

  // buttonText: 按钮内文字样式
  buttonText: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 16, // 文字大小为16
    fontWeight: "bold", // 文字加粗
  },

  titleText: {
    color: "white", // 白色文字
    fontSize: 24, // 字体大小为24
    fontWeight: "bold", // 字体加粗
    marginBottom: 20, // 与下一个元素间距20
  },

  // subButtonText: 子按钮文字样式
  subButtonText: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 12, // 字体大小为12
  },

  // centeredView: 用于模态视图居中的样式
  centeredView: {
    flex: 1,
    justifyContent: "center", // 内容居中
    alignItems: "center", // 内容居中
    backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
  },

  // modalView: 模态视窗的样式
  modalView: {
    margin: 20,
    height: 500, // 高度为500
    width: "90%",
    backgroundColor: "#3F3D3C", // 深灰色背景
    borderRadius: 20, // 圆角为20
    padding: 35, // 内边距为35
    alignItems: "center", // 内容居中对齐
    shadowColor: "#000", // 阴影为黑色
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.25, // 阴影透明度
    shadowRadius: 3.84, // 阴影扩散范围
    elevation: 5, // 用于Android的材质阴影高度
  },

  // modalTitle, modalSubtitle, modalText: 模态窗口内的标题、副标题和文本样式
  modalTitle: {
    color: "#ffffff", // 白色文字
    fontSize: 16, // 字体大小为18
    fontWeight: "bold", // 字体加粗
    marginBottom: 15, // 与下一个元素间距15
  },
  modalSubtitle: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 14, // 字体大小为14
    marginBottom: 320, // 与下一个元素间距320
    textAlign: "center", // 文本居中对齐
  },
  languageModalTitle: {
    color: "#ffffff", // 白色文字
    fontSize: 20, // 增加字体大小为20
    fontWeight: "bold", // 字体加粗
    marginBottom: 30, // 与下一个元素间距15
  },
  languageModalText: {
    color: "#ffffff", // 白色文字
    fontSize: 16, // 增加字体大小为16
    marginBottom: 10, // 调整间距
    textAlign: "center", // 文本居中对齐
  },
  passwordModalText: {
    color: "#ffffff", // 白色文字
    fontSize: 16, // 增加字体大小为16
    marginBottom: 10, // 调整间距
    textAlign: "left", // 文本居中对齐
  },
  languageList: {
    maxHeight: 320, // 限制最大高度，根据实际需求调整
    width: 280,
  },
  languageCancelButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
  },
  historyContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#21201E", // 深灰色背景
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 360,
  },
  historyTitle: {
    position: "absolute",
    left: 20,
    top: 20,
    fontSize: 16,
    color: "#ffffff", // 白色文字
  },
  noHistoryText: {
    fontSize: 16,
    color: "#ffffff", // 白色文字
    textAlign: "center",
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc", // 根据你的主题调整
  },
  historyItemText: {
    fontSize: 16,
    color: "#000", // 根据你的主题调整
  },
  modalText: {
    color: "#ffffff", // 白色文字
    textAlign: "center", // 文本居中对齐
    marginBottom: 120, // 与下一个元素间距320
  },

  optionButtonText: {
    color: "#ffffff",
  },
  // optionButton, cancelButton: 选项按钮和取消按钮的样式
  optionButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1A1A37",
    padding: 10,
    marginTop: 30,
    marginBottom: 60,
    justifyContent: "center",
    borderRadius: 10,
    height: 60,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    position: "absolute",
    bottom: 60,
  },

  submitButtonText: {
    color: "#ffffff", // 白色文字
  },
  cancelButtonText: {
    color: "#ffffff", // 白色文字
  },
});

export default styles; // 导出styles以供其他文件使用
