// styles/MyColdWalletScreenStyle.js
import { StyleSheet } from "react-native";

const MyColdWalletScreenStyles = (isDarkMode) => {
  const textColor = isDarkMode ? "#fff" : "#000";
  const backgroundColor = isDarkMode ? "#121212" : "#f5f5f5";
  const modalBackgroundColor = isDarkMode ? "#484692" : "#ffffff";
  const buttonBackgroundColor = isDarkMode ? "#6C6CF4" : "#E5E1E9";
  const borderColor = isDarkMode ? "#404040" : "#ccc";
  const BluetoothBtnColor = isDarkMode ? "#6C6CF4" : "#8E80F0";
  const secondTextColor = isDarkMode ? "#ddd" : "#676776";
  const inputBackgroundColor = isDarkMode ? "#1A1A37" : "#e0e0e0";
  const focusedBorderColor = isDarkMode ? "#6C6CF4" : "#007AFF";

  return StyleSheet.create({
    // 基本容器样式
    container: {
      flex: 1,
      backgroundColor: backgroundColor,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 10, // 顶部 padding
      paddingLeft: 20, // 左侧 padding
      paddingRight: 20, // 右侧 padding
    },
    contentContainer: {
      flexGrow: 1,
    },
    scrollView: {
      width: "100%",
    },

    // 按钮样式
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
    disconnectButton: {
      marginLeft: 10,
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: "#6C6CF4",
      borderRadius: 5,
    },

    // 文本样式
    Text: {
      color: textColor,
      fontSize: 16,
    },
    buttonText: {
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
    modalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
    },
    disconnectSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
      marginTop: 20,
    },
    scanModalSubtitle: {
      color: secondTextColor,
      fontSize: 14,
      textAlign: "center",
    },
    dropdownButtonText: {
      color: textColor, // 根据模式动态设置文本颜色
      fontSize: 16, // 字体大小
      paddingVertical: 5, // 增加垂直间距
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

    // 输入框样式
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
    addressInput: {
      backgroundColor: inputBackgroundColor,
      padding: 15,
      borderRadius: 10,
      height: 120,
      width: "100%",
      color: textColor,
    },
    passwordInputContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      position: "relative",
    },
    eyeIcon: {
      position: "absolute",
      right: 15,
      top: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    focusedInput: {
      borderColor: focusedBorderColor,
      borderWidth: 2,
    },

    // 下拉菜单样式
    dropdown: {
      position: "absolute",
      right: 20, // 根据需要调整位置
      top: 40, // 调整以确保下拉菜单显示在正确位置
      backgroundColor: modalBackgroundColor, // 根据模式动态设置背景色
      borderRadius: 5, // 圆角
      paddingVertical: 10, // 垂直方向的内边距
      paddingHorizontal: 20, // 水平方向的内边距
      zIndex: 1, // 确保Dropdown在其他元素上方
      shadowColor: "#000", // 阴影颜色
      shadowOffset: { width: 0, height: 2 }, // 阴影偏移
      shadowOpacity: 0.25, // 阴影透明度
      shadowRadius: 3.84, // 阴影扩散范围
      elevation: 5, // 用于Android的材质阴影高度
    },

    // 模态框样式
    modalView: {
      margin: 20,
      height: 500,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
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
    addressModalView: {
      margin: 20,
      height: 480,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      justifyContent: "space-between",
      alignItems: "center",
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
    currencyModalView: {
      margin: 20,
      height: 560,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
    },
    languageModalView: {
      margin: 20,
      height: 560,
      width: "90%",
      backgroundColor: modalBackgroundColor,
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
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
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },

    // 图标样式
    Icon: {
      marginRight: 10,
    },
    deviceIcon: {
      paddingRight: 4,
    },

    // 列表项样式
    listContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    settingsItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: borderColor,
    },
    deviceItemContainer: {
      flexDirection: "row", // 横向排列
      alignItems: "center", // 垂直居中
      justifyContent: "center",
      marginTop: 20,
    },

    // 图片样式
    bluetoothImg: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },

    // 搜索框样式
    searchContainer: {
      height: 50,
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

    // 错误提示文本样式
    errorText: {
      color: "#FF5252",
      fontSize: 14,
      marginBottom: 10,
      alignItems: "left",
      width: 280,
    },
  });
};

export default MyColdWalletScreenStyles;
