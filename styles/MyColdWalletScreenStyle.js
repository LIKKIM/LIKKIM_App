// styles/MyColdWalletScreenStyle.js
import { StyleSheet } from "react-native";

const MyColdWalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#ffffff";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#ccc";
  const borderColor = isDarkMode ? "#404040" : "#ccc";

  return StyleSheet.create({
    cancelButtonText: {
      color: textColor,
    },
    modalSubtitle: {
      color: textColor,
      fontSize: 14,
      marginBottom: 320,
      textAlign: "center",
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
      width: "80%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    buttonText: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    roundButton: {
      backgroundColor: modalBackgroundColor,
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
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "80%",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 30,
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
    languageList: {
      maxHeight: 320,
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
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "80%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      position: "absolute",
      bottom: 60,
    },
    Icon: {
      marginRight: 10,
    },
  });
};

export default MyColdWalletScreenStyles;
