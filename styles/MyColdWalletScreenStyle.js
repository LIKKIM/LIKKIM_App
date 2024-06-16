// styles/MyColdWalletScreenStyle.js
import { StyleSheet } from "react-native";

const MyColdWalletScreenStyles = (isDarkMode) => {
  return StyleSheet.create({
    cancelButtonText: {
      color: "#ffffff", // 白色文字
    },
    modalSubtitle: {
      color: "#e0e0e0", // 浅灰色文字
      fontSize: 14, // 字体大小为14
      marginBottom: 320, // 与下一个元素间距320
      textAlign: "center", // 文本居中对齐
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
    languageCancelButton: {
      backgroundColor: "#6C6CF4",
      padding: 10,
      width: "80%",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 30,
    },
    passwordModalText: {
      color: "#ffffff", // 白色文字
      fontSize: 16, // 增加字体大小为16
      marginBottom: 10, // 调整间距
      textAlign: "left", // 文本居中对齐
    },
    languageModalText: {
      color: "#ffffff", // 白色文字
      fontSize: 16, // 增加字体大小为16
      marginBottom: 10, // 调整间距
      textAlign: "center", // 文本居中对齐
    },
    languageModalTitle: {
      color: "#ffffff", // 白色文字
      fontSize: 20, // 增加字体大小为20
      fontWeight: "bold", // 字体加粗
      marginBottom: 30, // 与下一个元素间距15
    },
    languageList: {
      maxHeight: 320, // 限制最大高度，根据实际需求调整
      width: 280,
    },
    contentContainer: {
      flexGrow: 1,
    },
    scrollView: {
      width: "100%",
    },
    settingsItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#404040",
    },
    container: {
      flex: 1,
      backgroundColor: "#121212", // 深灰色背景，适用于暗模式
      alignItems: "center", // 子元素沿着主轴（即垂直轴）居中对齐
      justifyContent: "center", // 子元素沿着交叉轴（即水平轴）居中对齐
      padding: 20, // 内边距为20
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
  });
};

export default MyColdWalletScreenStyles;
