// styles/TransactionsScreenStyle.js
import { StyleSheet } from "react-native";

const TransactionsScreenStyles = (isDarkMode) => {
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
    cancelAddressButton: {
      borderWidth: 3, // 设置边框宽度
      borderColor: buttonBackgroundColor, // 设置边框颜色
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
    disconnectButton: {
      marginLeft: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: "#6C6CF4",
      borderRadius: 5,
    },

    disconnectButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
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
    submitButtonText: {
      color: textColor,
      fontSize: 16,
    },

    pinModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
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
    passwordInput: {
      backgroundColor: inputBackgroundColor,

      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      height: 50,
      width: "100%",
      color: textColor,
    },
    deviceItemContainer: {
      flexDirection: "row", // 横向排列
      alignItems: "center", // 垂直居中
      justifyContent: "center",
      marginTop: 20,
    },
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 20,
    },
    cancelButtonLookingFor: {
      borderColor: buttonBackgroundColor,
      borderWidth: 3,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    cancelButtonText: {
      color: secondTextColor,
      fontSize: 16,
    },
    scanModalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
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
    bluetoothImg: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },
    BluetoothBtnText: {
      color: "#fff",
      fontSize: 16,
    },
    bluetoothModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
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
    cancelButton: {
      borderWidth: 3, // 设置边框宽度
      borderColor: buttonBackgroundColor, // 设置边框颜色
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    cancelButtonReceive: {
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
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
      height: 600,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },

    addressText: {
      color: secondTextColor,
      textAlign: "center",
      marginRight: 10,
      flexWrap: "wrap",
      width: 280,
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
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    optionButtonText: {
      color: textBtnColor,
    },
    optionButton: {
      backgroundColor: btnColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 16,
    },

    submitButtonText: {
      color: textBtnColor,
      fontSize: 16,
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
      marginBottom: 20,
      justifyContent: "center",
      borderRadius: 10,
      height: 60,
      alignItems: "center",
    },
    amountModalView: {
      margin: 20,
      height: 360,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    /*  History */
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
      marginTop: 20,
      padding: 20,
      backgroundColor: historyContainerBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: 360,
      height: 360,
    },
    /*  blurView */
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
    buttonText: {
      color: textBtnColor,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 2,
    },
    mainButtonText: {
      color: titleColor,
      fontSize: 16,
      fontWeight: "bold",
      marginVertical: 10,
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

    bgContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    container: {
      alignItems: "center",
    },
    modalText: { color: secondTextColor, textAlign: "center" },
    TransactionModalTitle: {
      fontSize: 16,
      color: titleColor,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 30,
    },
  });
};

export default TransactionsScreenStyles;
