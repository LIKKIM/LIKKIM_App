// styles/TransactionsScreenStyle.js
import { StyleSheet } from "react-native";

const TransactionsScreenStyles = (isDarkMode) => {
  // 颜色定义
  const titleColor = isDarkMode ? "#fff" : "#000";
  const textColor = isDarkMode ? "#fff" : "#000";
  const textBtnColor = isDarkMode ? "#fff" : "#fff";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#fff";
  const btnBorderColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const btnColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const inputBackgroundColor = isDarkMode ? "#1A1A37" : "#e0e0e0";
  const historyItemBorderColor = isDarkMode ? "#ccc" : "#999";
  const historyContainerBackgroundColor = isDarkMode
    ? "#24234C80"
    : "#FFFFFF80";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const secondBtnTextColor = isDarkMode ? "#ddd" : "#e0e0e0";

  return StyleSheet.create({
    // 按钮样式
    cancelAddressButton: {
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    verifyAddressButton: {
      backgroundColor: btnColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 16,
    },
    disconnectButton: {
      marginLeft: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: "#6C6CF4",
      borderRadius: 5,
    },
    cancelButton: {
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    submitButton: {
      backgroundColor: btnColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 20,
    },
    roundButton: {
      borderWidth: 2,
      borderColor: btnBorderColor,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: 170,
      height: 170,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },

    // 按钮文本样式
    submitButtonText: {
      color: textColor,
      fontSize: 16,
    },
    cancelButtonText: {
      color: secondTextColor,
      fontSize: 16,
    },
    BluetoothBtnText: {
      color: "#fff",
      fontSize: 16,
    },
    buttonText: {
      color: textBtnColor,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 2,
    },
    optionButtonText: {
      color: textBtnColor,
    },

    // 模态框样式
    blurBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 10,
    },
    cardContainer: {
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      width: "90%",
    },
    pendingModalView: {
      margin: 20,
      width: "90%",
      height: 340,
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    pinModalView: {
      position: "absolute",
      top: 100,
      margin: 20,
      height: 400,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalView: {
      margin: 20,
      height: 500,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    inputModelView: {
      margin: 20,
      height: 400,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    confirmModalView: {
      margin: 20,
      alignSelf: "center",
      maxHeight: "90%",
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    receiveModalView: {
      margin: 20,
      height: 600,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      justifyContent: "space-between",
      alignItems: "center",
    },
    bluetoothModalView: {
      margin: 20,
      height: 500,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      justifyContent: "space-between",
      alignItems: "center",
    },

    // 文本样式
    pinModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
    },
    modalTitle: {
      color: titleColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    modalReceiveTitle: {
      color: titleColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
    },
    amountSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 20,
    },
    balanceModalSubtitle: {
      marginTop: 6,
      color: textColor,
      fontSize: 16,
      marginBottom: 20,
    },
    balanceSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 6,
    },
    subtitleText: {
      fontSize: 14,
      color: secondTextColor,
      textAlign: "center",
      marginBottom: 20,
      flexWrap: "wrap",
      width: 326,
    },
    cancelButtonText: {
      color: secondTextColor,
      fontSize: 16,
    },
    transactionText: {
      color: secondTextColor,
      fontSize: 16,
      marginBottom: 10,
    },
    addressText: {
      color: secondTextColor,
      textAlign: "center",
      marginRight: 10,
      flexWrap: "wrap",
      width: 280,
    },
    disconnectButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    TransactionModalTitle: {
      fontSize: 16,
      color: titleColor,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 30,
    },

    // 输入框样式
    passwordInput: {
      backgroundColor: inputBackgroundColor,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      height: 50,
      width: "100%",
      color: textColor,
    },
    input: {
      backgroundColor: inputBackgroundColor,
      padding: 10,
      marginTop: 20,
      justifyContent: "center",
      borderRadius: 10,
      height: 60,
      alignItems: "center",
    },
    amountInput: {
      backgroundColor: inputBackgroundColor,
      padding: 10,
      marginTop: 20,
      justifyContent: "center",
      borderRadius: 10,
      height: 60,
      alignItems: "center",
    },

    // 历史记录样式
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
      fontSize: 16,
      color: textColor,
      fontWeight: "bold",
    },
    historyContainer: {
      marginTop: 22,
      padding: 20,
      backgroundColor: historyContainerBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: 360,
      height: 360,
    },

    // 其他样式
    bgContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      padding: 20,
    },
    container: {
      alignItems: "center",
    },
    blurView: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 10,
    },
    subButtonText: {
      color: secondBtnTextColor,
      fontSize: 12,
    },
    mainSubButtonText: {
      color: historyItemBorderColor,
      fontSize: 12,
      textAlign: "center",
    },
    mainButtonText: {
      color: titleColor,
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 10,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    bluetoothImg: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },
    modalText: {
      color: secondTextColor,
      textAlign: "center",
    },
  });
};

export default TransactionsScreenStyles;
