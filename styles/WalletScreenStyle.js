// styles/WalletScreenStyle.js
import { StyleSheet } from "react-native";

const WalletScreenStyles = (isDarkMode) => {
  // 色彩定义
  const textColor = isDarkMode ? "#fff" : "#000";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#ffffff";
  const BluetoothBtnColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const secondCardTextColor = isDarkMode ? "#fff" : "#fff";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const tagColor = isDarkMode ? "#8E80F040" : "#8E80F040";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const shadowColor = isDarkMode ? "#101021" : "#101021";
  const cardBackgroundColor = isDarkMode ? "#484692" : "#E5E1E9";
  const currencyUnitColor = isDarkMode ? "#ddd" : "#666";
  const addCryptoButtonBackgroundColor = isDarkMode ? "#1E1D3F" : "#F8F6FE";
  const borderColor = isDarkMode ? "#555" : "#ccc";
  const historyItemBorderColor = isDarkMode ? "#ccc" : "#999";
  const inputBackgroundColor = isDarkMode ? "#1A1A37" : "#e0e0e0";
  const historyContainerBackgroundColor = isDarkMode
    ? "#24234C80"
    : "#FFFFFF80";

  return StyleSheet.create({
    animatedTabContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      position: "absolute",
      zIndex: 10,
      top: 236,
    },
    cardModalContent: {
      width: 326,
      height: 206,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },
    cardInfoContainer: {
      position: "absolute",
      top: 25,
      left: 65,
      flexDirection: "row",
      alignItems: "center",
    },

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

    // 标签样式

    TagChainIcon: {
      width: 14,
      height: 14,
      backgroundColor: "#8E80F040",
      marginRight: 8,
      borderRadius: 10,
    },

    chainScrollView: {
      marginBottom: 10,
      paddingHorizontal: 10,
    },

    chainTag: {
      flexDirection: "row", // 图标和文本在一行显示
      alignItems: "center", // 垂直居中对齐
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

    // 卡片样式
    cardName: {
      fontSize: 16,
      fontWeight: "bold",
    },

    chainContainer: {
      backgroundColor: tagColor,
      alignSelf: "flex-start", // 自动适应内容宽度
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 6,
      marginLeft: 4,
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

    // 按钮样式
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

    // 模态框样式
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

    // 设备项样式
    deviceItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },

    deviceIcon: {
      paddingRight: 4,
    },

    // 取消按钮样式
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

    // 蓝牙模态框样式
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

    // 副标题样式
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

    // 取消按钮文本样式
    cancelButtonText: {
      color: textColor,
      fontSize: 16,
    },

    // 收款模态框样式
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

    // Tab按钮样式
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

    // 历史记录项样式
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

    // 搜索框样式
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 10,
      width: "100%",
      backgroundColor: isDarkMode ? "#1E1D3F" : "#E5E1E9",
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

    // 渐变背景样式
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

    // 总余额容器样式
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

    // 添加钱包图片样式
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

    // 卡片容器样式
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
      position: "absolute",
      top: 56,
      left: 65,
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
      fontSize: 28,
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

    // 通用按钮样式
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

    // 居中视图样式
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

    // 通用模态框样式
    modalView: {
      margin: 20,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
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
      backgroundColor: buttonBackgroundColor,
      padding: 10,
      width: "100%",
      justifyContent: "center",
      borderRadius: 30,
      height: 60,
      alignItems: "center",
      marginBottom: 20,
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

    // 按钮文本样式
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

    // 添加加密货币模态框样式
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
      color: secondTextColor,
      fontWeight: "bold",
      textAlign: "center",
    },

    // 模态框头部样式
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

    // 下拉菜单样式
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

    // 模态框图标样式
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

    // 余额视图样式
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

    // 钱包信息样式
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

    // 安全标题样式
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

    // 高亮文本样式
    highlightText: {
      color: "#FF6347", // 红色作为高亮颜色
      fontSize: 14,
      textAlign: "left",
    },

    // 输入框样式
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
