// styles/MyColdWalletScreenStyle.js
import { StyleSheet } from "react-native";

const MyColdWalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#3F3D3C" : "#ffffff";
  const currencyModalBgColor = isDarkMode ? "#3F3D3C" : "#f7f7f7";
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#E5E1E9";
  const borderColor = isDarkMode ? "#404040" : "#ccc";
  const BluetoothBtnColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const inputBackgroundColor = isDarkMode ? "#21201E" : "#e0e0e0";
  const focusedBorderColor = isDarkMode ? "#CCB68C" : "#007AFF";

  return StyleSheet.create({
    addressInput: {
      backgroundColor: inputBackgroundColor,
      padding: 15,
      paddingTop: 15,
      borderRadius: 10,
      height: 120,
      width: "100%",
      color: textColor,
    },
    addressModalView: {
      margin: 20,

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
    buttonContainer: {
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    },
    AddressBookContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",

      gap: 10,
    },
    buttonText: {
      color: textColor,
      fontSize: 16,
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
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    changePasswordModalView: {
      position: "absolute",
      top: 60,
      margin: 20,
      height: 330,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      justifyContent: "space-between",
      alignItems: "center",
    },
    closeButton: {
      borderColor: buttonBackgroundColor,
      borderWidth: 3,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    backButton: {
      borderColor: buttonBackgroundColor,
      borderWidth: 3,
      padding: 10,
      flex: 1,
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    container: {
      flex: 1,
      backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 10,
      paddingLeft: 20,
      paddingRight: 20,
    },
    contentContainer: {
      flexGrow: 1,
    },
    currencyModalView: {
      margin: 20,
      height: 420,
      width: "90%",
      backgroundColor: currencyModalBgColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    deviceIcon: {
      paddingRight: 4,
    },
    deviceItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    disableLockModalView: {
      position: "absolute",
      top: 60,
      margin: 20,
      height: 320,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
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
    disconnectModalView: {
      margin: 20,
      height: 340,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    disconnectSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
      marginTop: 20,
    },
    dropdown: {
      position: "absolute",
      right: 20,
      top: 2,
      backgroundColor: modalBackgroundColor,
      borderRadius: 5,
      paddingVertical: 8,
      paddingHorizontal: 16,
      zIndex: 101,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    dropdownButtonText: {
      color: textColor,
      fontSize: 14,
      paddingVertical: 5,
    },
    enableLockModalView: {
      position: "absolute",
      top: 60,
      margin: 20,
      height: 400,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    EnterPasswordModalView: {
      position: "absolute",
      top: 100,
      justifyContent: "space-between",
      margin: 20,
      height: 360,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    errorText: {
      color: "#FF5252",
      fontSize: 14,
      marginBottom: 10,
      width: 280,
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    Icon: {
      marginRight: 6,
    },
    focusedInput: {
      borderColor: focusedBorderColor,
      borderWidth: 2,
    },
    focusedSearchContainer: {
      borderColor: focusedBorderColor,
      borderWidth: 2,
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
    languageList: {
      maxHeight: 290,
      width: 280,
    },
    languageModalText: {
      color: textColor,
      fontSize: 16,
      marginBottom: 10,
      textAlign: "center",
    },
    currencyModalText: {
      color: textColor,
      fontSize: 16,
      textAlign: "center",
    },
    languageModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 30,
    },
    languageModalView: {
      margin: 20,
      height: 420,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    listContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
    },
    modalTitle: {
      color: textColor,
      fontSize: 16,
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
    passwordInput: {
      backgroundColor: inputBackgroundColor,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      height: 50,
      width: "100%",
      color: textColor,
      marginBottom: 10,
    },
    passwordInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      position: "relative",
    },
    passwordModalText: {
      color: textColor,
      fontSize: 16,
      marginBottom: 10,
      textAlign: "left",
    },
    passwordModalTitle: {
      color: textColor,
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 10,
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
    scanModalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      width: "100%",
      backgroundColor: isDarkMode ? "#21201E" : "#E5E1E9",
      marginBottom: 20,
    },
    searchIcon: {
      paddingLeft: 10,
      color: textColor,
    },
    searchInput: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      color: textColor,
    },
    setPasswordModalView: {
      position: "absolute",
      top: 60,
      margin: 20,
      height: 420,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      justifyContent: "space-between",
    },
    settingsItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    scrollView: {
      width: "100%",
    },
    submitButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 15,
    },
    saveButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      flex: 1,
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    submitButtonText: {
      color: textColor,
      fontSize: 16,
    },
    Text: {
      color: textColor,
      fontSize: 16,
    },
  });
};

export default MyColdWalletScreenStyles;
