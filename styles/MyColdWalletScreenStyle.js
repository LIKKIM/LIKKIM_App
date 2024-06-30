// styles/MyColdWalletScreenStyle.js
import { StyleSheet } from "react-native";

const MyColdWalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#ffffff";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const borderColor = isDarkMode ? "#404040" : "#ccc";
  const BluetoothBtnColor = isDarkMode ? "#484692" : "#8E80F0";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const inputBackgroundColor = isDarkMode ? "#1A1A37" : "#e0e0e0";
  const focusedBorderColor = isDarkMode ? "#6C6CF4" : "#007AFF";

  return StyleSheet.create({
    listContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
    cancelButtonText: {
      color: secondTextColor,
      fontSize: 16,
    },
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 20,
      textAlign: "center",
    },

    scanModalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 200,
      textAlign: "center",
    },
    modalTitle: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 15,
    },
    pinModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 15,
    },
    bluetoothModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
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
    pinModalView: {
      margin: 20,
      height: 500,
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
    bluetoothImg: {
      width: 150,
      height: 150,
      marginBottom: 20,
    },
    centeredView: {
      flex: 1,

      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    Text: {
      color: textColor,
      fontSize: 16,
    },
    buttonText: {
      color: textColor,
      fontSize: 16,
    },
    BluetoothBtnText: {
      color: "#fff",
      fontSize: 16,
    },
    roundButton: {
      backgroundColor: BluetoothBtnColor,
      borderRadius: 30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: "100%",
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    languageCancelButton: {
      borderColor: buttonBackgroundColor,
      borderWidth: 3,
      padding: 10,
      width: "90%",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 30,
      marginTop: 20,
    },
    passwordModalText: {
      color: textColor,
      fontSize: 16,
      marginBottom: 10,
      textAlign: "left",
    },
    languageModalText: {
      color: textColor,
      fontSize: 16,
      marginBottom: 10,
      textAlign: "center",
    },
    languageModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 30,
    },
    passwordModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
    },
    languageList: {
      maxHeight: 300,
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
      borderBottomColor: borderColor,
    },
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    cancelButton: {
      borderColor: buttonBackgroundColor,
      borderWidth: 3,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      //   marginTop: 20,
    },
    Icon: {
      marginRight: 10,
    },
    passwordInput: {
      backgroundColor: inputBackgroundColor,
      borderColor: borderColor,
      borderWidth: 1,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      height: 50,
      marginBottom: 10,
      width: "100%",
      color: textColor,
    },
    focusedInput: {
      borderColor: focusedBorderColor,
      borderWidth: 2,
    },
    submitButton: {
      backgroundColor: buttonBackgroundColor,
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
    buttonContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
  });
};

export default MyColdWalletScreenStyles;
