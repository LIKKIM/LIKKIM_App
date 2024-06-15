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
    top: 10,
    left: 10,
    width: 30,
    height: 30,
  },
  cardName: {
    position: "absolute",
    top: 10,
    left: 50,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardShortName: {
    position: "absolute",
    top: 30,
    left: 50,
    color: "#fff",
    fontSize: 14,
  },
  cardBalance: {
    position: "absolute",
    top: 10,
    right: 10,
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WalletScreenStyle;
