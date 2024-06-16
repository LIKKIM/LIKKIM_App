// styles/TransactionsScreenStyle.js
import { StyleSheet } from "react-native";

const TransactionsScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  return StyleSheet.create({
    cancelButtonText: {
      color: "#ffffff", // 白色文字
    },
    cancelButton: {
      backgroundColor: "#6C6CF4",
      padding: 10,
      width: "80%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      position: "absolute",
      bottom: 60,
    },
    modalTitle: {
      color: "#ffffff", // 白色文字
      fontSize: 18, // 字体大小为18
      fontWeight: "bold", // 字体加粗
      marginBottom: 15, // 与下一个元素间距15
    },
    modalView: {
      margin: 20,
      height: 500, // 高度为500
      width: "80%",
      backgroundColor: "#484692", // 深灰色背景
      borderRadius: 20, // 圆角为20
      padding: 35, // 内边距为35
      alignItems: "center", // 内容居中对齐
      shadowColor: "#000", // 阴影为黑色
      shadowOffset: { width: 0, height: 2 }, // 阴影偏移
      shadowOpacity: 0.25, // 阴影透明度
      shadowRadius: 3.84, // 阴影扩散范围
      elevation: 5, // 用于Android的材质阴影高度
    },
    centeredView: {
      flex: 1,
      justifyContent: "center", // 内容居中
      alignItems: "center", // 内容居中
      backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
    },
    optionButtonText: {
      color: "#ffffff",
    },
    optionButton: {
      backgroundColor: "#6C6CF4",
      padding: 10,
      width: "80%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center", // 内容居中
      alignItems: "center", // 内容居中
      backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
    },
    submitButtonText: {
      color: "#ffffff", // 白色文字
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
    modalTitle: {
      color: "#ffffff", // 白色文字
      fontSize: 18, // 字体大小为18
      fontWeight: "bold", // 字体加粗
      marginBottom: 15, // 与下一个元素间距15
    },
    centeredView: {
      flex: 1,
      justifyContent: "center", // 内容居中
      alignItems: "center", // 内容居中
      backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
    },
    historyItemText: {
      fontSize: 16,
      color: "#000", // 根据你的主题调整
    },
    historyItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc", // 根据你的主题调整
    },
    noHistoryText: {
      fontSize: 16,
      color: "#ffffff", // 白色文字
      textAlign: "center",
    },
    historyTitle: {
      position: "absolute",
      left: 20,
      top: 20,
      fontSize: 18,
      color: "#ffffff", // 白色文字
    },
    historyContainer: {
      marginTop: 20,
      padding: 20,
      backgroundColor: "#24234C", // 深灰色背景
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      height: 360,
    },
    subButtonText: {
      color: "#e0e0e0", // 浅灰色文字
      fontSize: 12, // 字体大小为12
    },
    buttonText: {
      color: "#e0e0e0", // 浅灰色文字
      fontSize: 16, // 文字大小为16
      fontWeight: "bold", // 文字加粗
    },
    roundButton: {
      backgroundColor: "#484692", // 按钮背景为灰色
      borderRadius: 30, // 圆角为30
      paddingVertical: 10, // 垂直内边距为10
      paddingHorizontal: 20, // 水平内边距为20
      width: "100%",
      height: 60,
      alignItems: "center", // 文本居中对齐
      justifyContent: "center", // 文本居中对齐
      marginBottom: 20, // 与下一个元素间距20
    },
    container: {
      flex: 1,
      backgroundColor: "#121212", // 深灰色背景，适用于暗模式
      alignItems: "center", // 子元素沿着主轴（即垂直轴）居中对齐
      justifyContent: "center", // 子元素沿着交叉轴（即水平轴）居中对齐
      padding: 20, // 内边距为20
    },
  });
};

export default TransactionsScreenStyles;
