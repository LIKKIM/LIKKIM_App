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
});

export default WalletScreenStyle;
