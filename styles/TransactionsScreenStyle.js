// styles/TransactionsScreenStyle.js
import { StyleSheet } from "react-native";

const TransactionsScreenStyles = (isDarkMode) => {
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const btnBorderColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const btnColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#E5E1E9";
  const historyContainerBackgroundColor = isDarkMode
    ? "#22201F90"
    : "#FFFFFF80";
  const historyItemBorderColor = isDarkMode ? "#ccc" : "#999";
  const inputBackgroundColor = isDarkMode ? "#21201E" : "#e0e0e0";
  const modalBackgroundColor = isDarkMode ? "#3F3D3C" : "#fff";
  const secondBtnTextColor = isDarkMode ? "#ddd" : "#e0e0e0";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const textBtnColor = isDarkMode ? "#fff" : "#fff";
  const textColor = isDarkMode ? "#fff" : "#000";
  const titleColor = isDarkMode ? "#fff" : "#000";
  const dropdownBackgroundColor = isDarkMode ? "#CCB68C" : "#eee";

  return StyleSheet.create({
    // Dropdown Styles
    fromDropdown: {
      position: "absolute",
      top: 100, // 确保下拉菜单显示在按钮下方
      width: "100%",
      maxHeight: 200, // 限制 dropdown 最大高度，超出时可以滚动
      backgroundColor: dropdownBackgroundColor,
      borderRadius: 10,
      padding: 10,
      zIndex: 999, // 提高 zIndex 确保 dropdown 始终在其他组件上方
      overflow: "hidden", // 避免溢出内容被隐藏
    },
    toDropdown: {
      position: "absolute",
      top: 70, // 确保下拉菜单显示在按钮下方
      width: "100%",
      maxHeight: 200, // 限制 dropdown 最大高度，超出时可以滚动
      backgroundColor: dropdownBackgroundColor,
      borderRadius: 10,
      padding: 10,
      zIndex: 999, // 提高 zIndex 确保 dropdown 始终在其他组件上方
      overflow: "hidden", // 避免溢出内容被隐藏
    },
    chainTag: {
      paddingVertical: 10,
      paddingHorizontal: 15,
      /*       borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#555" : "#ddd", */
    },
    selectedChainTag: {
      backgroundColor: isDarkMode ? "#CCB68C" : "#ccc",
    },
    chainTagText: {
      color: isDarkMode ? "#fff" : "#000",
    },
    selectedChainTagText: {
      color: isDarkMode ? "#000" : "#fff",
    },

    container: {
      flex: 1,
      //  justifyContent: "center",
      alignItems: "center",
    },
    roundButton: {
      backgroundColor: "#CCB68C",
      padding: 15,
      borderRadius: 30,
      alignItems: "center",
    },

    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
    },
    swapSection: {
      width: 300,
      padding: 20,
      backgroundColor: "#1c1c1e",
      borderRadius: 10,
      marginVertical: 10,
    },

    swapInputContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderWidth: 2,
      borderColor: btnBorderColor,
      borderRadius: 10,
      padding: 10,
    },
    swapInput: {
      width: "100%", // 确保 TextInput 占满容器宽度
      height: 40,
      paddingHorizontal: 10,
      color: textColor,
    },
    tokenSelect: {
      alignSelf: "stretch", // 高度填充父容器
      flexShrink: 1, // 宽度自适应内容
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // 确保“Select token”和图标两边对齐
      paddingHorizontal: 10, // 可选，调整按钮的内边距
    },
    tokenSelectText: {
      color: "#fff",
      marginRight: 5,
    },
    swapButton: {
      backgroundColor: btnColor,
      padding: 6,
      borderRadius: 50,
      marginTop: -10,
      alignSelf: "flex-end",
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
    amountModalView: {
      margin: 20,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      flex: 0, // 默认值：内部内容会撑开容器高度
    },
    amountSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 20,
    },
    addressText: {
      color: secondTextColor,
      textAlign: "center",
      marginRight: 10,
      flexWrap: "wrap",
      width: 280,
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
    bgContainer: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      padding: 20,
    },
    blurBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: 10,
    },
    blurView: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      borderRadius: 10,
    },
    bluetoothImg: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },
    bluetoothModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
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
    cancelButton: {
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      padding: 10,
      width: 280,
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
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
    cancelButtonText: {
      color: secondTextColor,
      fontSize: 16,
    },
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
    cardContainer: {
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      width: "90%",
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    confirmModalView: {
      margin: 20,
      alignSelf: "center",
      //  flex: 1, // 使用 flex 让 modal 动态填充可用空间
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },

    deviceItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    disconnectButton: {
      marginLeft: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: "#CCB68C",
      borderRadius: 5,
    },
    disconnectButtonText: {
      color: "#FFFFFF",
      fontWeight: "bold",
    },
    historyContainer: {
      marginTop: 22,
      padding: 20,
      paddingTop: 50,
      backgroundColor: historyContainerBackgroundColor,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      width: "96%",
      height: "76%",
    },
    historyItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: historyItemBorderColor,
    },
    historyItemText: {
      fontSize: 16,
      color: textColor,
      marginBottom: 10,
    },
    historyTitle: {
      position: "absolute",
      left: 20,
      top: 16,
      fontSize: 16,
      color: textColor,
      fontWeight: "bold",
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
    inputModelView: {
      margin: 20,
      height: 400,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    mainButtonText: {
      color: titleColor,
      fontSize: 14,
      fontWeight: "bold",
      marginVertical: 10,
    },
    mainSubButtonText: {
      color: historyItemBorderColor,
      fontSize: 12,
      textAlign: "center",
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
    modalText: {
      color: secondTextColor,
      textAlign: "center",
    },
    modalTitle: {
      color: titleColor,
      fontSize: 16,
      fontWeight: "bold",
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
    swapModalView: {
      margin: 20,
      height: 500,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    noHistoryText: {
      fontSize: 16,
      color: secondTextColor,
      textAlign: "center",
    },
    swapConfirmButton: {
      backgroundColor: btnColor,
      padding: 10,
      width: 280,
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
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
    optionButtonText: {
      color: textBtnColor,
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
    roundButton: {
      borderWidth: 2,
      borderColor: btnBorderColor,
      paddingVertical: 10,
      paddingHorizontal: 10,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    scanModalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
    },
    subButtonText: {
      color: secondBtnTextColor,
      fontSize: 12,
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
      color: textBtnColor,
      fontSize: 16,
    },
    subtitleText: {
      fontSize: 14,
      color: secondTextColor,
      textAlign: "center",
      flexWrap: "wrap",
    },
    TransactionModalTitle: {
      fontSize: 16,
      color: titleColor,
      textAlign: "center",
      marginBottom: 20,
      lineHeight: 30,
    },
    transactionText: {
      color: secondTextColor,
      fontSize: 16,
      marginBottom: 10,
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
  });
};

export default TransactionsScreenStyles;
