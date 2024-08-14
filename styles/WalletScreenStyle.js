// styles/WalletScreenStyle.js
import { StyleSheet } from "react-native";
const WalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#ffffff";
  const BluetoothBtnColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const secondCardTextColor = isDarkMode ? "#fff" : "#fff";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  // const modalBackgroundColor = isDarkMode ? "#24234C" : "#ffffff";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const shadowColor = isDarkMode ? "#101021" : "#101021";
  const cardBackgroundColor = isDarkMode ? "#484692" : "#E5E1E9";
  const currencyUnitColor = isDarkMode ? "#ddd" : "#666";
  const addCryptoButtonBackgroundColor = isDarkMode ? "#1E1D3F" : "#F8F6FE";
  const borderColor = isDarkMode ? "#555" : "#ccc";
  const historyItemBorderColor = isDarkMode ? "#ccc" : "#999";
  const historyContainerBackgroundColor = isDarkMode
    ? "#24234C80"
    : "#FFFFFF80";
  return StyleSheet.create({
    deviceItemContainer: {
      flexDirection: "row", // 横向排列
      alignItems: "center", // 垂直居中
      justifyContent: "center",
      marginTop: 20,
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

    tabButton: {
      padding: 20,
      marginHorizontal: 60,
      zIndex: 11,
    },
    activeTabButton: {
      padding: 20,
      borderBottomWidth: 2,
      borderBottomColor: "#6C6CF4",
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
      height: 60,
      textAlign: "left",
      textAlignVertical: "center", // 文本垂直居中（仅在Android有效）
      lineHeight: 60, // 使文本行高等于容器高度以实现垂直居中
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

    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      width: "100%",
      backgroundColor: isDarkMode ? "#1E1D3F" : "#E5E1E9", // Dark mode and light mode background color
      marginBottom: 20,
    },

    searchInput: {
      width: "100%",
      padding: 10,
      borderRadius: 10,
      color: textColor, // Dark mode and light mode text color
    },

    searchIcon: {
      paddingLeft: 10,
      color: textColor,
    },

    linearGradient: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollViewContent: {
      paddingTop: 20,
      justifyContent: "start",
      alignItems: "center",
    },
    scrollView: {
      width: "100%",
      paddingHorizontal: 0,
    },
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
    addWalletImage: {
      marginTop: -110,
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
      fontSize: 16,
      fontWeight: "bold",
    },
    cardContainer: {
      position: "relative",
      marginBottom: -130, // 重叠效果
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
      fontSize: 16,
      fontWeight: "bold",
      //   textShadowColor: "rgba(0, 0, 0, 0.8)",
      //   textShadowOffset: { width: 0, height: 1 },
      //  textShadowRadius: 3,
    },
    cardShortName: {
      position: "absolute",
      top: 56,
      left: 60,
      color: secondCardTextColor,
      fontSize: 14,
      //   textShadowColor: "rgba(0, 0, 0, 0.8)",
      //   textShadowOffset: { width: 0, height: 1 },
      //   textShadowRadius: 3,
    },
    cardBalance: {
      position: "absolute",
      top: 25,
      right: 15,
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
      //textShadowColor: "rgba(0, 0, 0, 0.8)",
      // textShadowOffset: { width: 0, height: 2 },
      //  textShadowRadius: 3,
    },
    balanceShortName: {
      color: secondCardTextColor,
      fontSize: 14,
      //  textShadowColor: "rgba(0, 0, 0, 0.8)",
      //  textShadowOffset: { width: 0, height: 2 },
      //  textShadowRadius: 3,
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
      //  textShadowColor: "rgba(0, 0, 0, 0.8)",
      //  textShadowOffset: { width: 0, height: 2 },
      //  textShadowRadius: 3,
    },
    cardBalanceCenter: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "bold",
      // textShadowColor: "rgba(0, 0, 0, 0.8)",
      // textShadowOffset: { width: 0, height: 2 },
      // textShadowRadius: 3,
      marginBottom: 8,
    },
    balanceShortNameCenter: {
      color: secondCardTextColor,
      fontSize: 14,
      //  textShadowColor: "rgba(0, 0, 0, 0.8)",
      //  textShadowOffset: { width: 0, height: 2 },
      //  textShadowRadius: 3,
    },
    card: {
      width: 326,
      height: 206,
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
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 10,
    },
    cardOthers: {
      shadowOffset: { width: 0, height: -10 },
      shadowColor: shadowColor,
      shadowOpacity: 0.2,
      shadowRadius: 30,
      elevation: 20,
    },
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
      borderWidth: 3, // 设置边框宽度
      borderColor: buttonBackgroundColor, // 设置边框颜色
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginTop: 20,
    },
    verifyAddressButton: {
      backgroundColor: buttonBackgroundColor, // 设置边框颜色
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
      borderWidth: 3, // 设置边框宽度
      borderColor: buttonBackgroundColor, // 设置边框颜色
      padding: 10,
      width: 326,
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      bottom: 0,
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
      marginTop: 20,
    },

    removeCancelButton: {
      borderWidth: 3, // 设置边框宽度
      borderColor: buttonBackgroundColor, // 设置边框颜色
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

    cardModalView: {
      height: "100%",
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      zIndex: 2,
    },

    modalView: {
      margin: 20,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
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
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 20,
    },
    deleteImg: {
      width: 130,
      height: 130, // 设置固定高度
      resizeMode: "contain", // 确保图片在其容器内完整显示
      marginBottom: 40,
    },
    QRImg: {
      width: 25,
      height: 25, // 设置固定高度
      resizeMode: "contain", // 确保图片在其容器内完整显示
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
    addCardIcon: {
      width: 30, // adjust size as needed
      height: 30, // adjust size as needed
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(108, 108, 244, 0.1)",
    },
    addCryptoOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0)", // 黑色半透明
      borderRadius: 12, // 确保与ImageBackground的borderRadius一致
    },
    addCryptoImageText: {
      marginLeft: 4, // adjust spacing as needed
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
      color: secondTextColor,
      fontWeight: "bold",
      marginRight: 30,
    },
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
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      marginBottom: 20,
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
    dropdown: {
      position: "absolute",
      right: 0,
      top: 30, // 调整以确保下拉菜单位于setting icon正下方
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
    addWalletButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
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
    securityTitle: {
      color: secondTextColor,
      fontSize: 22,
      textAlign: "center",
      marginBottom: 18,
    },
    centeredContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    highlightText: {
      color: "#FF6347", // 红色作为高亮颜色
      fontSize: 14,
      textAlign: "left",
    },
    textInput: {
      width: "100%",
      height: 300,
      borderColor: borderColor,
      borderWidth: 1,
      marginTop: 20,
      padding: 10,
      borderRadius: 5,
      color: textColor,
      backgroundColor: isDarkMode ? "#24234C" : "#E5E1E9",
      textAlignVertical: "top",
    },
  });
};

export default WalletScreenStyles;
