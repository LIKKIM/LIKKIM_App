import { StyleSheet } from "react-native";

// 使用StyleSheet创建并导出应用的样式
const styles = StyleSheet.create({
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
    height: 100, // 高度为100
    borderRadius: 16, // 边角圆润程度为16
    justifyContent: "center", // 内容居中显示
    alignItems: "center", // 内容居中显示
    backgroundColor: "#1e1e1e", // 深灰色背景，比container稍浅
    marginBottom: 20, // 与下一个元素间距20
    shadowColor: "#000", // 阴影颜色为黑色
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.25, // 阴影透明度
    shadowRadius: 3.84, // 阴影扩散范围
    elevation: 5, // 用于Android的材质阴影高度
  },

  // cardText: 卡片内的文字样式
  cardText: {
    color: "white", // 白色文字
    fontSize: 16, // 文字大小为16
  },

  // roundButton: 圆形按钮的样式
  roundButton: {
    backgroundColor: "#373737", // 按钮背景为灰色
    borderRadius: 30, // 圆角为30
    paddingVertical: 10, // 垂直内边距为10
    paddingHorizontal: 20, // 水平内边距为20
    width: 250, // 宽度为250
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

  // titleText: 标题文字样式
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
    backgroundColor: "rgba(0, 0, 0, 0.8)", // 半透明背景
  },

  // modalView: 模态视窗的样式
  modalView: {
    margin: 20,
    height: 500, // 高度为500
    backgroundColor: "#222222", // 深灰色背景
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
    fontSize: 18, // 字体大小为18
    fontWeight: "bold", // 字体加粗
    marginBottom: 15, // 与下一个元素间距15
  },
  modalSubtitle: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 14, // 字体大小为14
    marginBottom: 320, // 与下一个元素间距320
    textAlign: "center", // 文本居中对齐
  },
  modalText: {
    color: "#ffffff", // 白色文字
    marginBottom: 320, // 与下一个元素间距320
    textAlign: "center", // 文本居中对齐
  },

  // optionButton, cancelButton: 选项按钮和取消按钮的样式
  optionButton: {
    backgroundColor: "#373737", // 按钮背景为灰色
    padding: 10, // 内边距为10
    width: 300, // 宽度为300
    marginBottom: 10, // 与下一个元素间距10
    alignItems: "center", // 文本居中对齐
    borderRadius: 20, // 圆角为20
  },
  cancelButton: {
    backgroundColor: "#373737", // 按钮背景为灰色
    padding: 10, // 内边距为10
    width: 300, // 宽度为300
    alignItems: "center", // 文本居中对齐
    borderRadius: 20, // 圆角为20
  },
  cancelButtonText: {
    color: "#ffffff", // 白色文字
  },
});

export default styles; // 导出styles以供其他文件使用
