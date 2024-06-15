// styles/WalletScreenStyle.js
import { StyleSheet } from "react-native";

const WalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";

  return StyleSheet.create({
    cancelButton: {
      backgroundColor: "#6C6CF4",
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    cardIcon: {
      position: "absolute",
      top: 25,
      left: 15,
      width: 30,
      height: 30,
    },
    cardName: {
      position: "absolute",
      top: 25,
      left: 60,
      color: textColor,
      fontSize: 18,
      fontWeight: "bold",
    },
    cardShortName: {
      position: "absolute",
      top: 60,
      left: 60,
      color: textColor,
      fontSize: 14,
    },
    cardBalance: {
      position: "absolute",
      top: 25,
      right: 15,
      color: textColor,
      fontSize: 18,
      fontWeight: "bold",
    },
    card: {
      width: 300, // 宽度为300
      height: 170, // 高度为170
      borderRadius: 20, // 边角圆润程度为20
      overflow: "hidden",
      justifyContent: "center", // 内容居中显示
      alignItems: "center", // 内容居中显示
      backgroundColor: "#484692", // 深灰色背景，比container稍浅
      marginBottom: 20, // 与下一个元素间距20
    },
    cardFirst: {
      shadowOffset: { width: 0, height: 0 }, // 第一张卡片的阴影偏移
      shadowColor: "#101021", // 阴影颜色为黑色
      shadowOpacity: 0.3, // 增加阴影透明度
      shadowRadius: 30, // 增大阴影扩散范围使阴影更加宽
      elevation: 20, // 增加用于Android的材质阴影高度
    },
    cardOthers: {
      shadowOffset: { width: 0, height: -10 }, // 其他卡片向上偏移阴影
      shadowColor: "#101021", // 阴影颜色为黑色
      shadowOpacity: 0.8, // 增加阴影透明度
      shadowRadius: 30, // 增大阴影扩散范围使阴影更加宽
      elevation: 20, // 增加用于Android的材质阴影高度
    },
  });
};

export default WalletScreenStyles;
