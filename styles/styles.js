import { StyleSheet } from "react-native";
import {
  FONT_SIZE_12,
  FONT_SIZE_15,
  FONT_SIZE_16,
  FONT_SIZE_20,
  FONT_SIZE_22,
  FONT_SIZE_28,
  FONT_SIZE_34,
  RADIUS_8,
  RADIUS_10,
  RADIUS_12,
  RADIUS_16,
  RADIUS_20,
  RADIUS_30,
} from "./constants";

import { buttonBase, modalPanelBase } from "./baseStyles";

// tokens
const makeTokens = (isDarkMode) => ({
  text: isDarkMode ? "#fff" : "#21201E",
  mainBg: isDarkMode ? "#21201E" : "#fff",
  modalBg: isDarkMode ? "#3F3D3C" : "#fff",
  inputBg: isDarkMode ? "#21201E" : "#ddd",
  mutedText: isDarkMode ? "#ddd" : "#676776",
  overlay: "rgba(108, 108, 244, 0.1)",
  historyItemText: "#000",
  roundBtnBg: "#3F3D3C",
  lightTheme: "#CCB68C",
  historyItemBorder: "#ccc",
  subtitleText: "#e0e0e0",
  white: "#ffffff",
});

const stylesFactory = (isDarkMode) => {
  const c = makeTokens(isDarkMode);
  return StyleSheet.create({
    settingsText: { marginLeft: 10, fontSize: FONT_SIZE_16, color: c.text },
    titleText: {
      color: c.text,
      fontSize: FONT_SIZE_28,
      fontWeight: "bold",
      marginBottom: 20,
    },
    container: {
      flex: 1,
      backgroundColor: c.inputBg,
      alignItems: "center",
      justifyContent: "center",
      padding: 20,
    },
    headerStyle: { backgroundColor: c.mainBg },
    headerRight: { backgroundColor: c.inputBg },
    addIconButton: { backgroundColor: c.mainBg },
    addIconButtonCommon: {
      marginRight: 16,
      borderRadius: RADIUS_16,
      width: 28,
      height: 28,
      justifyContent: "center",
      alignItems: "center",
    },
    dropdown: {
      position: "absolute",
      right: 20,
      top: 60,
      backgroundColor: c.modalBg,
      borderRadius: RADIUS_8,
      padding: 10,
      zIndex: 1,
    },
    dropdownButton: { padding: 10 },
    dropdownButtonText: { color: c.text, fontSize: FONT_SIZE_16 },
    scrollView: { width: "100%" },
    contentContainer: { flexGrow: 1 },
    settingsItem: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: "#404040",
    },
    safeArea: { flex: 1, backgroundColor: c.inputBg },
    card: {
      width: 300,
      height: 170,
      borderRadius: RADIUS_20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: c.modalBg,
      marginBottom: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: c.overlay,
    },
    text: { color: c.text, fontSize: FONT_SIZE_16, fontWeight: "bold" },
    roundButton: {
      backgroundColor: c.roundBtnBg,
      borderRadius: RADIUS_30,
      paddingVertical: 10,
      paddingHorizontal: 20,
      width: "100%",
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 20,
    },
    subtitleText: {
      color: c.subtitleText,
      fontSize: FONT_SIZE_16,
      fontWeight: "bold",
    },
    subButtonText: { color: c.subtitleText, fontSize: 12 },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    modalView: { ...modalPanelBase, backgroundColor: c.modalBg, height: 500 },
    white: {
      color: c.white,
      fontSize: FONT_SIZE_16,
      fontWeight: "bold",
      marginBottom: 15,
    },
    subtitleText: {
      color: c.subtitleText,
      fontSize: FONT_SIZE_16,
      marginBottom: 320,
      textAlign: "center",
    },
    languageModalTitle: {
      color: c.white,
      fontSize: FONT_SIZE_20,
      fontWeight: "bold",
      marginBottom: 30,
    },
    white: {
      color: c.white,
      fontSize: FONT_SIZE_16,
      marginBottom: 10,
      textAlign: "center",
    },
    LockCodeModalText: {
      color: c.white,
      fontSize: FONT_SIZE_16,
      marginBottom: 10,
      textAlign: "left",
    },
    languageList: { maxHeight: 320, width: 280 },
    languageCancelButton: {
      backgroundColor: c.lightTheme,
      padding: 10,
      width: "90%",
      borderRadius: RADIUS_30,
      height: 60,
      alignItems: "center",
      justifyContent: "center",
      position: "absolute",
      bottom: 30,
    },
    historyContainer: {
      marginTop: 20,
      padding: 20,
      backgroundColor: c.inputBg,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: RADIUS_10,
      height: 360,
    },
    white: {
      position: "absolute",
      left: 20,
      top: 20,
      fontSize: FONT_SIZE_16,
      color: c.white,
    },
    white: {
      fontSize: FONT_SIZE_16,
      color: c.white,
      textAlign: "center",
    },
    historyItem: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.historyItemBorder,
    },
    historyItemText: { fontSize: FONT_SIZE_16, color: c.historyItemText },
    modalText: { color: c.white, textAlign: "center", marginBottom: 120 },
    optionButton: {
      ...buttonBase,
      backgroundColor: c.lightTheme,
      marginBottom: 10,
    },
    optionButtonText: { color: c.white },
    input: {
      backgroundColor: c.inputBg,
      padding: 10,
      marginTop: 30,
      marginBottom: 60,
      justifyContent: "center",
      borderRadius: RADIUS_10,
      height: 60,
      alignItems: "center",
    },
    submitButton: {
      ...buttonBase,
      backgroundColor: c.lightTheme,
      marginBottom: 0,
    },
    cancelButton: {
      ...buttonBase,
      backgroundColor: c.lightTheme,
      position: "absolute",
      bottom: 60,
    },
    submitButtonText: { color: c.white },
    cancelButtonText: { color: c.white },
  });
};

export const lightTheme = stylesFactory(false);
export const darkTheme = stylesFactory(true);
export default stylesFactory;

// ====== 以下为ScreenLock专用样式 ======
import { StyleSheet as RNStyleSheet } from "react-native";
export const screenLockStyles = RNStyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subTitle: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 50,
    marginBottom: 20,
    fontSize: 18,
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
    top: 25,
    transform: [{ translateY: -12 }],
    alignItems: "center",
    justifyContent: "center",
  },
  button: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  lostPasswordContainer: {
    marginTop: 30,
    alignItems: "center",
  },
  lostPasswordText: {
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    width: "80%",
  },
  white: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },
  closeButton: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
});

export const screenLockLightStyles = RNStyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  title: {
    color: "#333",
  },
  subTitle: {
    color: "#999",
  },
  input: {
    color: "#000",
    backgroundColor: "#f1f1f1",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#CFAB95",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
  subtitleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  lostPasswordText: {
    color: "#CFAB95",
  },
  modalView: {
    backgroundColor: "#fff",
  },
  white: {
    color: "#333",
  },
  modalText: {
    color: "#666",
  },
  closeButton: {
    backgroundColor: "#CFAB95",
  },
});

export const screenLockDarkStyles = RNStyleSheet.create({
  container: {
    backgroundColor: "#21201E",
  },
  title: {
    color: "#f5f5f5",
  },
  subTitle: {
    color: "#ccc",
  },
  input: {
    color: "#fff",
    backgroundColor: "#121212",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#CCB68C",
  },
  subtitleText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  lostPasswordText: {
    color: "#CCB68C",
  },
  modalView: {
    backgroundColor: "#21201E",
  },
  white: {
    color: "#f5f5f5",
  },
  modalText: {
    color: "#ccc",
  },
  closeButton: {
    backgroundColor: "#CCB68C",
  },
});
