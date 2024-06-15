// styles/WalletScreenStyle.js
import { StyleSheet } from "react-native";

const WalletScreenStyle = StyleSheet.create({
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
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cardShortName: {
    position: "absolute",
    top: 60,
    left: 50,
    color: "#fff",
    left: 60,
    fontSize: 14,
  },
  cardBalance: {
    position: "absolute",
    top: 25,
    right: 15,
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    width: 300, // 宽度为300
    height: 170, // 高度为100
    borderRadius: 20, // 边角圆润程度为16
    overflow: "hidden",
    justifyContent: "center", // 内容居中显示
    alignItems: "center", // 内容居中显示
    backgroundColor: "#484692", // 深灰色背景，比container稍浅
    marginBottom: 20, // 与下一个元素间距20
    shadowColor: "#000", // 阴影颜色为黑色
    shadowOffset: { width: 0, height: 2 }, // 阴影偏移
    shadowOpacity: 0.25, // 阴影透明度
    shadowRadius: 3.84, // 阴影扩散范围
    elevation: 5, // 用于Android的材质阴影高度
  },
});

export default WalletScreenStyle;
