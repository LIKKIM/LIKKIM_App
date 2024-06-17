// styles/WalletScreenStyle.js
import { StyleSheet } from "react-native";

const WalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const secondCardTextColor = isDarkMode ? "#ddd" : "#ddd";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#24234C" : "#ffffff";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const shadowColor = isDarkMode ? "#101021" : "#000";
  const cardBackgroundColor = isDarkMode ? "#484692" : "#E5E1E9";
  const currencyUnitColor = isDarkMode ? "#ddd" : "#666";
  const addCryptoButtonBackgroundColor = isDarkMode ? "#1E1D3F" : "#E5E1E9";

  return StyleSheet.create({
    linearGradient: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollViewContent: {
      paddingTop: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    scrollView: {
      width: "100%",
      paddingHorizontal: 0,
    },
    totalBalanceContainer: {
      width: 300,
      marginBottom: 40,
    },
    totalBalanceText: {
      fontSize: 18,
      marginVertical: 10,
      color: secondTextColor,
      textAlign: "left",
    },
    totalBalanceAmount: {
      fontSize: 36,
      fontWeight: "bold",
      color: textColor,
      textAlign: "left",
    },
    currencyUnit: {
      marginLeft: 20,
      fontSize: 18,
      textAlign: "left",
      color: currencyUnitColor,
      fontWeight: "normal",
    },
    addWalletImage: {
      width: 300,
      height: 170,
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: cardBackgroundColor,
      shadowOffset: { width: 0, height: 0 },
      shadowColor: shadowColor,
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    addWalletImageBorder: {
      borderRadius: 20,
    },
    addWalletButton: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    addWalletButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
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
      left: 60,
      color: secondCardTextColor,
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
      width: 300,
      height: 170,
      borderRadius: 20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: cardBackgroundColor,
      marginBottom: 20,
    },
    cardFirst: {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: shadowColor,
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    cardOthers: {
      shadowOffset: { width: 0, height: -10 },
      shadowColor: shadowColor,
      shadowOpacity: 0.8,
      shadowRadius: 30,
      elevation: 20,
    },
    cancelButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      margin: 20,
      width: "80%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    modalButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 20,
    },
    cancelButtonText: {
      color: textColor,
      fontSize: 18,
    },
    addCryptoModalView: {
      margin: 20,
      minHeight: 400,
      width: "80%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    addCryptoScrollView: {
      width: "100%",
      height: 380,
    },
    addCryptoButton: {
      width: "100%",
      padding: 6,
      backgroundColor: addCryptoButtonBackgroundColor,
      marginBottom: 6,
      borderRadius: 16,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    },
    addCryptoImage: {
      width: 100,
      height: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    addCryptoImageText: {
      color: "#fff",
      fontWeight: "bold",
    },
    addCryptoText: {
      color: textColor,
      fontWeight: "bold",
      marginRight: 30,
    },
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    modalTitle: {
      color: textColor,
      fontSize: 18,
      fontWeight: "bold",
    },
    dropdown: {
      position: "absolute",
      right: 10,
      top: 40,
      backgroundColor: cardBackgroundColor,
      borderRadius: 5,
      padding: 10,
      zIndex: 1,
    },
    dropdownButton: {
      padding: 10,
    },
    dropdownButtonText: {
      color: textColor,
      fontSize: 16,
    },
    modalIconContainer: {
      position: "absolute",
      top: 35,
      left: 35,
      flexDirection: "row",
      alignItems: "center",
    },
    modalIcon: {
      width: 24,
      height: 24,
      marginRight: 8,
    },
    modalCryptoName: {
      color: textColor,
      textAlign: "center",
      fontSize: 18,
    },
    modalBalanceLabel: {
      color: textColor,
      textAlign: "center",
      fontSize: 18,
      marginTop: 40,
      marginBottom: 10,
    },
    modalBalance: {
      color: textColor,
      textAlign: "center",
      fontSize: 40,
      marginBottom: 30,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(108, 108, 244, 0.1)",
    },
  });
};

export default WalletScreenStyles;
