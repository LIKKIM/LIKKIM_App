// styles/WalletScreenStyle.js
import { StyleSheet, Dimensions } from "react-native";

/**
 * Returns a stylesheet object for the Wallet Screen.
 *
 * @param {boolean} isDarkMode - Indicates whether dark mode is enabled.
 * @returns {object} - A StyleSheet object for the Wallet Screen.
 */
const WalletScreenStyles = (isDarkMode) => {
  // Color definitions based on theme mode
  const textColor = isDarkMode ? "#fff" : "#000";
  const modalBackgroundColor = isDarkMode ? "#3F3D3C" : "#ffffff";
  const BluetoothBtnColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const secondCardTextColor = isDarkMode ? "#fff" : "#fff";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const tagColor = isDarkMode ? "#CFAB9540" : "#CFAB9540";
  const buttonBackgroundColor = isDarkMode ? "#CCB68C" : "#E5E1E9";
  const shadowColor = isDarkMode ? "#0E0D0D" : "#0E0D0D";
  const cardBackgroundColor = isDarkMode ? "#3F3D3C" : "#E5E1E9";
  const currencyUnitColor = isDarkMode ? "#ddd" : "#666";
  const addCryptoButtonBackgroundColor = isDarkMode ? "#21201E" : "#F8F6FE";
  const borderColor = isDarkMode ? "#555" : "#ccc";
  const historyItemBorderColor = isDarkMode ? "#ccc" : "#999";
  const inputBackgroundColor = isDarkMode ? "#21201E" : "#e0e0e0";

  // Background color for the history container with opacity adjustments
  const historyContainerBackgroundColor = isDarkMode
    ? "#22201F90"
    : "#FFFFFF80";

  // Get device height for dynamic layout calculations
  const { height } = Dimensions.get("window");
  const containerHeight = height - 360; // Calculated container height

  return StyleSheet.create({
    // Animated container for tabs positioned over content
    animatedTabContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      zIndex: 10,
      top: 236,
      height: containerHeight,
    },
    // Content container for the card modal
    cardModalContent: {
      width: 326,
      height: 206,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    // Container for card information with wrapping support
    cardInfoContainer: {
      flexDirection: "column", // 修改为 column 使得它们上下排列
      width: 156,
      flex: 1,
      alignItems: "flex-start", // 确保子元素左对齐
      marginBottom: 8,
    },

    // Container for the card icon positioned at the top left
    cardIconContainer: {
      position: "absolute",
      top: 28,
      left: 10,
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 21,
      backgroundColor: "#ffffff50",
      overflow: "hidden",
    },
    // Container for the chain icon positioned relative to the card icon
    cardChainIconContainer: {
      position: "absolute",
      top: 54,
      left: 38,
      width: 16,
      height: 16,
      borderWidth: 1,
      borderColor: "#ffffff80",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 15,
      backgroundColor: "#ffffff80",
      overflow: "hidden",
    },

    // Tag styles
    TagChainIcon: {
      width: 14,
      height: 14,
      backgroundColor: "#CFAB9540",
      marginRight: 8,
      resizeMode: "contain",
      borderRadius: 10,
    },
    chainScrollView: {
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    chainTag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginRight: 8,
      borderRadius: 6,
      backgroundColor: addCryptoButtonBackgroundColor,
    },
    selectedChainTag: {
      backgroundColor: buttonBackgroundColor,
    },
    chainTagText: {
      fontSize: 14,
      color: textColor,
    },
    selectedChainTagText: {
      color: textColor,
    },

    // Card styles
    cardName: {
      fontSize: 16,
      fontWeight: "bold",
    },
    chainContainer: {
      backgroundColor: tagColor,
      alignSelf: "flex-start",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginTop: 3,
    },
    chainText: {
      fontSize: 12,
      fontWeight: "bold",
    },
    chainCardText: {
      color: textColor,
      fontSize: 12,
      fontWeight: "bold",
    },

    // Button styles
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
    submitButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    submitButtonText: {
      color: textColor,
      fontSize: 16,
    },
    mainButtonText: {
      color: "#FFF",
      fontSize: 16,
    },

    // Modal styles
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

    // Input field styles
    passwordInput: {
      backgroundColor: inputBackgroundColor,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: 10,
      height: 50,
      width: "100%",
      color: textColor,
    },

    // Device item styles
    deviceItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    deviceIcon: {
      paddingRight: 4,
    },

    // Cancel button style for "Looking For" modal
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

    // Bluetooth modal styles
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

    sendNftText: {
      fontSize: 14,
      color: secondTextColor,
      textAlign: "center",
      marginBottom: 20,
      flexWrap: "wrap",
    },

    // Subtitle text styles
    subtitleText: {
      fontSize: 14,
      color: secondTextColor,
      textAlign: "center",
      marginBottom: 20,
      flexWrap: "wrap",
      width: 326,
    },
    addressText: {
      color: secondTextColor,
      textAlign: "center",
      marginRight: 10,
      flexWrap: "wrap",
      width: 280,
    },

    // Cancel button text style
    cancelButtonText: {
      color: textColor,
      fontSize: 16,
    },

    // Receive modal styles
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

    // Tab button styles
    tabButton: {
      padding: 20,
      marginHorizontal: 60,
      zIndex: 11,
    },
    activeTabButton: {
      padding: 20,
      borderBottomWidth: 2,
      borderBottomColor: "#CCB68C",
      marginHorizontal: 60,
    },
    activeTabButtonText: {
      fontSize: 16,
      color: textColor,
    },
    tabButtonText: {
      fontSize: 16,
      color: secondTextColor,
    },

    // History item styles
    historyItemText: {
      fontSize: 16,
      color: textColor,
      marginBottom: 10,
    },
    historyList: {
      width: 326,
      marginBottom: 20,
    },
    historyItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: historyItemBorderColor,
    },
    noHistoryText: {
      fontSize: 16,
      color: secondTextColor,
      textAlign: "center",
    },
    historyTitle: {
      height: 60,
      textAlign: "left",
      textAlignVertical: "center",
      lineHeight: 60,
      width: 326,
      fontSize: 16,
      color: textColor,
      fontWeight: "bold",
    },
    historyContainer: {
      width: "100%",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      height: 300,
    },
    priceContainer: {
      width: "100%",
      paddingHorizontal: 20,
      height: 360,
    },

    // Search box styles
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      width: "100%",
      backgroundColor: isDarkMode ? "#21201E" : "#E5E1E9",
      marginBottom: 20,
    },
    searchInput: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      color: textColor,
    },
    searchIcon: {
      paddingLeft: 10,
      color: textColor,
    },

    // Linear gradient background style
    linearGradient: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollViewContent: {
      justifyContent: "start",
      alignItems: "center",
    },
    scrollView: {
      width: "100%",
      paddingHorizontal: 0,
    },

    // Total balance container styles
    totalBalanceContainer: {
      width: 326,
      height: 80,
      marginBottom: 20,
    },
    totalBalanceText: {
      fontSize: 16,
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
      fontSize: 16,
      textAlign: "left",
      color: currencyUnitColor,
      fontWeight: "normal",
    },

    // Add wallet image styles
    addWalletImage: {
      marginTop: -110,
      width: 326,
      height: 206,
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
      fontSize: 20,
      fontWeight: "bold",
    },

    // Card container styles
    cardContainer: {
      position: "relative",
      marginBottom: -130,
    },
    cardIcon: {
      width: 42,
      height: 42,
    },
    chainIcon: {
      width: 14,
      height: 14,
    },
    cardShortName: {
      color: secondCardTextColor,
      fontSize: 14,
    },
    cardBalance: {
      position: "absolute",
      top: 25,
      right: 15,
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    balanceShortName: {
      color: secondCardTextColor,
      fontSize: 14,
    },
    priceChangeView: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      top: 56,
      right: 20,
      color: secondCardTextColor,
      fontSize: 14,
    },
    cardBalanceCenter: {
      color: "#fff",
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 8,
    },
    balanceShortNameCenter: {
      color: secondCardTextColor,
      fontSize: 14,
    },
    card: {
      width: 326,
      height: 206,
      borderRadius: 18,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: cardBackgroundColor,
      marginBottom: 20,
    },
    cardFirst: {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: shadowColor,
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 5,
    },
    cardOthers: {
      shadowOffset: { width: 0, height: -10 },
      shadowColor: shadowColor,
      shadowOpacity: 0.2,
      shadowRadius: 30,
      elevation: 5,
    },

    // General button styles
    Button: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
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
      marginTop: 20,
    },
    verifyAddressButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    cancelButtonCryptoCard: {
      zIndex: 10,
      borderWidth: 3,
      borderColor: buttonBackgroundColor,
      padding: 10,
      width: 326,
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      bottom: 0,
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
      marginTop: 20,
    },
    removeCancelButton: {
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

    // Centered view style (e.g., for modals)
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },
    cardModalView: {
      height: "100%",
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      zIndex: 2,
    },
    // General modal view style
    modalView: {
      margin: 20,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },

    NFTmodalView: {
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 30,
      flex: 1,
      justifyContent: "space-between",
      minHeight: 300,
      maxHeight: 620,
    },

    inputAddressModal: {
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 30,
      flex: 1,
      justifyContent: "space-between",

      maxHeight: 400,
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
    deleteModalView: {
      margin: 20,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    phraseModalView: {
      margin: 20,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    processModalView: {
      margin: 20,
      width: "90%",
      height: 400,
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    modalButton: {
      backgroundColor: BluetoothBtnColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 20,
    },
    addModalButton: {
      backgroundColor: BluetoothBtnColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    disabledButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    confirmText: {
      color: "#ffffff",
      fontSize: 16,
    },
    disabledText: {
      color: "#ccc",
      fontSize: 16,
    },
    QRImg: {
      width: 25,
      height: 25,
      resizeMode: "contain",
      position: "absolute",
      right: 0,
      top: 0,
      margin: 25,
    },
    removeModalButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
    },
    alertModalButton: {
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },

    // Button text style
    ButtonText: {
      color: textColor,
      fontSize: 16,
    },
    processButtonText: {
      color: secondTextColor,
      fontSize: 16,
      marginBottom: 45,
      fontWeight: "bold",
    },

    // Add crypto modal styles
    addCryptoModalView: {
      margin: 20,
      minHeight: 400,
      width: "90%",
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
      alignItems: "center",
      flexDirection: "row",
    },
    addCryptoImage: {
      width: 100,
      height: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    addCardIcon: {
      width: 30,
      height: 30,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(108, 108, 244, 0.1)",
    },
    addCryptoOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderRadius: 12,
    },
    addCryptoImageText: {
      marginLeft: 4,
      color: "#fff",
      fontWeight: "bold",
      textShadowColor: "rgba(0, 0, 0, 0.8)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    iconAndTextContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    addCryptoText: {
      marginTop: 6,
      marginRight: 4,
      color: secondTextColor,
      fontWeight: "bold",
      textAlign: "center",
    },

    // Modal header styles
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalTitle: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
    },
    NFTtext: {
      color: secondTextColor,
      fontSize: 16,
    },
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
    },
    scanModalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
    },
    alertModalTitle: {
      color: textColor,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    alertModalSubtitle: {
      width: "100%",
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 10,
      lineHeight: 20,
    },
    alertModalContent: {
      color: secondTextColor,
      fontSize: 16,
      fontWeight: "bold",
    },

    // Dropdown menu styles
    dropdown: {
      position: "absolute",
      right: 0,
      top: 30,
      backgroundColor: cardBackgroundColor,
      borderRadius: 5,
      padding: 10,
      zIndex: 3,
    },
    dropdownButton: {
      padding: 10,
    },
    dropdownButtonText: {
      color: textColor,
      fontSize: 16,
    },

    // Modal icon styles
    modalIconContainer: {
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
      fontSize: 16,
    },

    // Balance view styles
    BalanceView: {
      paddingBottom: 200,
    },
    modalBalanceLabel: {
      color: textColor,
      textAlign: "center",
      fontSize: 16,
      marginTop: 40,
      marginBottom: 10,
    },
    modalBalance: {
      color: textColor,
      textAlign: "center",
      fontSize: 40,
      marginBottom: 30,
    },

    // Wallet information styles
    walletInfoText: {
      color: "#676776",
      fontSize: 16,
      textAlign: "center",
      lineHeight: 22,
    },
    walletInfoContainer: {
      height: 400,
      justifyContent: "center",
      paddingHorizontal: 20,
    },

    // Security title style
    securityTitle: {
      color: secondTextColor,
      fontSize: 22,
      textAlign: "center",
      marginBottom: 18,
    },

    // Centered content style
    centeredContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },

    // Highlight text style
    highlightText: {
      color: "#FF6347",
      textAlign: "left",
    },

    // Multi-line text input styles
    textInput: {
      width: "100%",
      height: 300,
      borderColor: borderColor,
      borderWidth: 1,
      marginTop: 20,
      padding: 10,
      borderRadius: 5,
      color: textColor,
      backgroundColor: isDarkMode ? "#21201E" : "#E5E1E9",
      textAlignVertical: "top",
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
  });
};

export default WalletScreenStyles;
