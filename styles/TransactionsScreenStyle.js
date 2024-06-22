// styles/TransactionsScreenStyle.js
import { StyleSheet } from "react-native";

const TransactionsScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#fff";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const inputBackgroundColor = isDarkMode ? "#1A1A37" : "#e0e0e0";
  const historyItemBorderColor = isDarkMode ? "#ccc" : "#999";
  const historyContainerBackgroundColor = isDarkMode ? "#24234C" : "#FFF";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  return StyleSheet.create({
    cancelButtonText: {
      color: secondTextColor,
      fontSize: 18,
    },
    cancelButton: {
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      padding: 10,
      width: "90%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    modalTitle: {
      color: textColor,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
    },
    modalView: {
      margin: 20,
      height: 500,

      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    optionButtonText: {
      color: textColor,
    },
    optionButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "90%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 10,
    },

    submitButtonText: {
      color: textColor,
      fontSize: 18,
    },
    input: {
      backgroundColor: inputBackgroundColor,
      padding: 10,
      marginTop: 30,
      marginBottom: 160,
      justifyContent: "center",
      borderRadius: 10,
      height: 60,
      alignItems: "center",
    },
    historyItemText: {
      fontSize: 16,
      color: textColor,
    },
    historyItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: historyItemBorderColor,
    },
    noHistoryText: {
      fontSize: 16,
      color: secondTextColor,
      textAlign: "center",
    },
    historyTitle: {
      position: "absolute",
      left: 20,
      top: 20,
      fontSize: 18,
      color: textColor,
      fontWeight: "bold",
    },
    historyContainer: {
      marginTop: 20,
      padding: 20,
      backgroundColor: historyContainerBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      height: 360,
    },
    subButtonText: {
      color: secondTextColor,
      fontSize: 12,
    },
    buttonText: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 2,
    },
    roundButton: {
      backgroundColor: buttonBackgroundColor,
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: "100%",
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    modalText: { color: secondTextColor, textAlign: "center" },
    TransactionModalTitle: {
      fontSize: 18,
      color: textColor,
      textAlign: "center",
      marginBottom: 30,
    },
    addressText: {
      color: secondTextColor,
      textAlign: "center",
      marginRight: 10,
    },
  });
};

export default TransactionsScreenStyles;
