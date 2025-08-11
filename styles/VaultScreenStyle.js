import { StyleSheet, Dimensions } from "react-native";
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
  RADIUS_14,
  RADIUS_15,
  RADIUS_16,
  RADIUS_18,
  RADIUS_20,
  RADIUS_21,
  RADIUS_30,
  RADIUS_50,
} from "./constants";

// ---- tokens & helpers -------------------------------------------------------
const makeTokens = (isDarkMode) => ({
  text: isDarkMode ? "#fff" : "#000",
  mutedText: isDarkMode ? "#ddd" : "#676776",
  cardText: "#fff",
  bg: isDarkMode ? "#121212" : "#f5f5f5",
  modalBg: isDarkMode ? "#3F3D3C" : "#ffffff",
  btnBg: isDarkMode ? "#CCB68C" : "#E5E1E9",
  bluetoothBtn: isDarkMode ? "#CCB68C" : "#CFAB95",
  tagBg: "#CFAB9540",
  shadow: "#0E0D0D",
  cardBg: isDarkMode ? "#3F3D3C" : "#E5E1E9",
  currencyUnit: isDarkMode ? "#ddd" : "#666",
  border: isDarkMode ? "#555" : "#ccc",
  historyBorder: isDarkMode ? "#ccc" : "#999",
  inputBg: isDarkMode ? "#21201E" : "#e0e0e0",
});

const { height, width } = Dimensions.get("window");
const containerHeight = height < 700 ? height - 280 : height - 360;

// base blocks
const buttonBase = {
  padding: 10,
  width: "100%",
  justifyContent: "center",
  borderRadius: RADIUS_30,
  height: 60,
  alignItems: "center",
};

const modalPanelBase = {
  width: "90%",
  backgroundColor: undefined, // set from tokens
  borderRadius: RADIUS_20,
  padding: 30,
  alignItems: "center",
};

const titleBase = {
  fontSize: FONT_SIZE_20,
  fontWeight: "bold",
};

const textCenterMuted = (colors) => ({
  fontSize: FONT_SIZE_15,
  color: colors.mutedText,
  textAlign: "center",
});

// ---- styles -----------------------------------------------------------------
const VaultScreenStyles = (isDarkMode) => {
  const c = makeTokens(isDarkMode);

  return StyleSheet.create({
    // layout
    animatedTabContainer: {
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      position: "absolute",
      zIndex: 10,
      top: 236,
      height: containerHeight,
    },
    linearGradient: {
      flex: 1,
      height,
      backgroundColor: c.bg,
      alignItems: "center",
      justifyContent: "center",
    },
    scrollView: { width: "100%", paddingHorizontal: 0 },
    scrollViewContent: { justifyContent: "start", alignItems: "center" },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    },

    // cards
    cardContainer: { position: "relative", marginBottom: -130 },
    card: {
      width: 326,
      height: 206,
      borderRadius: RADIUS_18,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: c.cardBg,
      marginBottom: 20,
    },
    cardFirst: {
      shadowOffset: { width: 0, height: 0 },
      shadowColor: c.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 20,
      elevation: 5,
    },
    cardOthers: {
      shadowOffset: { width: 0, height: -10 },
      shadowColor: c.shadow,
      shadowOpacity: 0.2,
      shadowRadius: 30,
      elevation: 5,
    },
    addWalletImage: {
      width: 326,
      height: 206,
      borderRadius: RADIUS_20,
      overflow: "hidden",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: c.cardBg,
      shadowOffset: { width: 0, height: 0 },
      shadowColor: c.shadow,
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 10,
    },
    addWalletImageBorder: { borderRadius: RADIUS_20 },
    addWalletButton: {
      width: "100%",
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    addWalletButtonText: {
      color: "#fff",
      fontSize: FONT_SIZE_20,
      fontWeight: "bold",
    },

    // icons on card
    cardIcon: { width: 42, height: 42 },
    chainIcon: { width: 14, height: 14 },
    cardIconContainer: {
      position: "absolute",
      top: 28,
      left: 10,
      width: 42,
      height: 42,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: RADIUS_21,
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
      borderRadius: RADIUS_15,
      backgroundColor: "#ffffff80",
      overflow: "hidden",
    },
    TagChainIcon: {
      width: 14,
      height: 14,
      backgroundColor: c.tagBg,
      marginRight: 8,
      resizeMode: "contain",
      borderRadius: RADIUS_10,
    },

    // card texts
    cardShortName: { color: c.cardText, fontSize: FONT_SIZE_15 },
    balanceShortName: { color: c.cardText, fontSize: FONT_SIZE_15 },
    priceChangeView: {
      position: "absolute",
      display: "flex",
      flexDirection: "row",
      gap: 10,
      top: 56,
      right: 20,
      color: c.cardText,
      fontSize: FONT_SIZE_15,
    },
    cardBalance: {
      position: "absolute",
      top: 25,
      right: 15,
      color: "#fff",
      fontSize: FONT_SIZE_16,
      fontWeight: "bold",
    },
    cardBalanceCenter: {
      color: "#fff",
      fontSize: FONT_SIZE_28,
      fontWeight: "bold",
      marginBottom: 8,
    },
    balanceShortNameCenter: { color: c.cardText, fontSize: FONT_SIZE_15 },

    // chain tags
    chainScrollView: { marginBottom: 10, height: 34, paddingHorizontal: 10 },
    chainTag: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 5,
      paddingHorizontal: 10,
      marginRight: 8,
      borderRadius: RADIUS_8,
      backgroundColor: isDarkMode ? "#21201E" : "#F8F6FE",
    },
    selectedChainTag: { backgroundColor: c.btnBg },
    chainTagText: { fontSize: FONT_SIZE_15, color: c.text },
    selectedChainTagText: { color: c.text },
    chainContainer: {
      backgroundColor: c.tagBg,
      alignSelf: "flex-start",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: RADIUS_8,
      marginTop: 3,
    },
    chainText: { fontSize: FONT_SIZE_12, fontWeight: "bold" },
    chainCardText: {
      color: c.text,
      fontSize: FONT_SIZE_12,
      fontWeight: "bold",
    },
    cardName: { fontSize: FONT_SIZE_16, fontWeight: "bold" },

    // totals
    totalBalanceContainer: { width: 326, height: 80, marginBottom: 20 },
    totalBalanceText: {
      fontSize: FONT_SIZE_16,
      marginVertical: 10,
      color: c.mutedText,
      textAlign: "left",
    },
    totalBalanceAmount: {
      fontSize: FONT_SIZE_34,
      fontWeight: "bold",
      color: c.text,
      textAlign: "left",
    },
    currencyUnit: {
      marginLeft: 20,
      fontSize: FONT_SIZE_16,
      textAlign: "left",
      color: c.currencyUnit,
      fontWeight: "normal",
    },

    // history
    historyList: { width: 326, marginBottom: 20 },
    historyItem: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: c.historyBorder,
    },
    historyItemText: {
      fontSize: FONT_SIZE_16,
      color: c.text,
      marginBottom: 10,
    },
    noHistoryText: {
      fontSize: FONT_SIZE_16,
      color: c.mutedText,
      textAlign: "center",
    },
    historyTitle: {
      height: 60,
      textAlign: "left",
      textAlignVertical: "center",
      lineHeight: 60,
      width: 326,
      fontSize: FONT_SIZE_16,
      color: c.text,
      fontWeight: "bold",
    },
    historyContainer: {
      width: "100%",
      padding: 20,
      alignItems: "center",
      justifyContent: "center",
      height: 300,
    },

    // search & price
    priceContainer: { width: "100%", paddingHorizontal: 20, height: "100%" },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderRadius: RADIUS_10,
      width: "100%",
      backgroundColor: c.inputBg,
      marginBottom: 20,
    },
    searchInput: {
      flex: 1,
      padding: 10,
      borderRadius: RADIUS_10,
      color: c.text,
    },
    searchIcon: { paddingLeft: 10, color: c.text },

    // buttons (shared base)
    Button: { ...buttonBase, backgroundColor: c.btnBg, marginTop: 20 },
    submitButton: { ...buttonBase, backgroundColor: c.btnBg, marginTop: 20 },
    verifyAddressButton: {
      ...buttonBase,
      backgroundColor: c.btnBg,
      marginTop: 20,
    },
    alertModalButton: {
      ...buttonBase,
      backgroundColor: c.btnBg,
      marginTop: 20,
    },
    disabledButton: { ...buttonBase, backgroundColor: c.btnBg, marginTop: 20 },
    modalButton: {
      ...buttonBase,
      backgroundColor: c.bluetoothBtn,
      marginBottom: 20,
    },
    addModalButton: {
      ...buttonBase,
      backgroundColor: c.bluetoothBtn,
      marginTop: 20,
    },
    NFTButton: {
      ...buttonBase,
      backgroundColor: c.btnBg,
      borderRadius: RADIUS_15,
    },
    GallerySendBtn: {
      ...buttonBase,
      borderWidth: 3,
      borderColor: c.btnBg,
      borderRadius: RADIUS_15,
    },
    cancelAddressButton: {
      ...buttonBase,
      borderWidth: 3,
      borderColor: c.btnBg,
    },
    cancelButtonCryptoCard: {
      ...buttonBase,
      borderWidth: 3,
      borderColor: c.btnBg,
      width: 326,
      position: "relative",
      bottom: 0,
    },
    cancelButton: {
      ...buttonBase,
      borderWidth: 3,
      borderColor: c.btnBg,
      marginTop: 20,
    },
    removeModalButton: { ...buttonBase, backgroundColor: c.btnBg },
    removeCancelButton: {
      ...buttonBase,
      borderWidth: 3,
      borderColor: c.btnBg,
      marginTop: 20,
    },
    cancelButtonLookingFor: {
      ...buttonBase,
      borderWidth: 3,
      borderColor: c.btnBg,
      marginTop: 20,
    },
    disconnectButton: {
      paddingVertical: 5,
      paddingHorizontal: 10,
      backgroundColor: c.btnBg,
      borderRadius: RADIUS_8,
      marginLeft: 10,
    },
    disconnectButtonText: { color: "#FFFFFF", fontWeight: "bold" },

    // button texts
    submitButtonText: { color: c.text, fontSize: FONT_SIZE_16 },
    mainButtonText: { color: "#FFF", fontSize: FONT_SIZE_16 },
    cancelButtonText: { color: c.text, fontSize: FONT_SIZE_16 },
    ButtonText: { color: c.text, fontSize: FONT_SIZE_16 },
    NFTButtonText: {
      color: c.text,
      fontSize: FONT_SIZE_16,
      textAlign: "center",
    },
    confirmText: { color: "#ffffff", fontSize: FONT_SIZE_16 },
    disabledText: { color: "#ccc", fontSize: FONT_SIZE_16 },
    BluetoothBtnText: { color: "#fff", fontSize: FONT_SIZE_16 },

    // modals (shared panels)
    cardModalView: {
      height: "100%",
      width: "100%",
      justifyContent: "flex-end",
      alignItems: "center",
      position: "absolute",
      bottom: 0,
      zIndex: 2,
    },
    modalView: { ...modalPanelBase, backgroundColor: c.modalBg },
    deleteModalView: { ...modalPanelBase, backgroundColor: c.modalBg },
    phraseModalView: { ...modalPanelBase, backgroundColor: c.modalBg },
    receiveModalView: {
      ...modalPanelBase,
      backgroundColor: c.modalBg,
      height: 600,
      justifyContent: "space-between",
    },
    bluetoothModalView: {
      ...modalPanelBase,
      backgroundColor: c.modalBg,
      height: 500,
      justifyContent: "space-between",
    },
    pendingModalView: {
      ...modalPanelBase,
      backgroundColor: c.modalBg,
      height: 340,
      justifyContent: "space-between",
    },
    addCryptoModalView: {
      ...modalPanelBase,
      backgroundColor: c.modalBg,
      maxHeight: "86%",
    },
    NFTmodalView: {
      ...modalPanelBase,
      backgroundColor: c.modalBg,
      aspectRatio: 9 / 16,
      justifyContent: "space-between",
    },
    ContactFormModal: {
      ...modalPanelBase,
      backgroundColor: c.modalBg,
      justifyContent: "space-between",
    },
    cardModalContent: {
      width: 326,
      height: 206,
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    },

    // modal headers & text
    modalHeader: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
    },
    modalTitle: { color: c.text, fontSize: FONT_SIZE_16, fontWeight: "bold" },
    bluetoothModalTitle: { ...titleBase, color: c.text, marginBottom: 10 },
    SecurityCodeModalTitle: { ...titleBase, color: c.text, marginBottom: 15 },
    modalSubtitle: { ...textCenterMuted(c) },
    scanModalSubtitle: { color: c.mutedText, fontSize: FONT_SIZE_15 },
    alertModalTitle: {
      color: c.text,
      fontSize: FONT_SIZE_16,
      fontWeight: "bold",
      marginBottom: 10,
      textAlign: "center",
    },
    alertModalSubtitle: {
      width: "100%",
      color: c.mutedText,
      fontSize: FONT_SIZE_15,
      marginBottom: 10,
      lineHeight: 20,
    },
    alertModalContent: {
      color: c.mutedText,
      fontSize: FONT_SIZE_16,
      fontWeight: "bold",
    },
    modalIconContainer: { flexDirection: "row", alignItems: "center" },
    modalIcon: { width: 24, height: 24, marginRight: 8 },
    modalCryptoName: {
      color: c.text,
      textAlign: "center",
      fontSize: FONT_SIZE_16,
    },

    // specific modal pieces
    SecurityCodeModalView: {
      position: "absolute",
      top: 100,
      margin: 20,
      height: 400,
      width: "90%",
      backgroundColor: c.modalBg,
      borderRadius: RADIUS_20,
      padding: 30,
      justifyContent: "space-between",
      alignItems: "center",
    },
    passwordInput: {
      backgroundColor: c.inputBg,
      paddingHorizontal: 15,
      paddingVertical: 10,
      borderRadius: RADIUS_10,
      height: 50,
      width: "100%",
      color: c.text,
    },
    bluetoothImg: { width: 150, height: 150, marginBottom: 30 },
    sendNftText: { ...textCenterMuted(c), marginBottom: 20, flexWrap: "wrap" },
    subtitleText: {
      ...textCenterMuted(c),
      marginBottom: 20,
      flexWrap: "wrap",
      width: 326,
    },
    addressText: {
      color: c.mutedText,
      flexWrap: "nowrap",
      fontSize: FONT_SIZE_15,
    },

    // lists / tabs
    tabButton: { padding: 20, marginHorizontal: 60, zIndex: 11 },
    activeTabButton: {
      padding: 20,
      borderBottomWidth: 2,
      borderBottomColor: c.btnBg,
      marginHorizontal: 60,
    },
    activeTabButtonText: { fontSize: FONT_SIZE_16, color: c.text },
    tabButtonText: { fontSize: FONT_SIZE_16, color: c.mutedText },

    // device rows
    deviceItemContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
    },
    deviceIcon: { paddingRight: 4 },

    // QR / dropdown
    QRImg: {
      width: 25,
      height: 25,
      resizeMode: "contain",
      position: "absolute",
      right: 0,
      top: 0,
      margin: 25,
    },
    dropdown: {
      position: "absolute",
      right: 0,
      top: 30,
      backgroundColor: c.cardBg,
      borderRadius: RADIUS_8,
      padding: 10,
      zIndex: 3,
    },
    dropdownButton: { padding: 10 },
    dropdownButtonText: { color: c.text, fontSize: FONT_SIZE_16 },

    // add crypto list
    addCryptoScrollView: { width: "100%", height: 380 },
    addCryptoButton: {
      width: "100%",
      padding: 6,
      backgroundColor: isDarkMode ? "#21201E" : "#F8F6FE",
      marginBottom: 6,
      borderRadius: RADIUS_16,
      display: "flex",
      alignItems: "center",
      flexDirection: "row",
    },
    iconAndTextContainer: { flexDirection: "row", alignItems: "center" },
    addCryptoImage: {
      width: 100,
      height: 100,
      justifyContent: "center",
      alignItems: "center",
    },
    addCardIcon: { width: 30, height: 30 },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(108, 108, 244, 0.1)",
    },
    addCryptoOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0)",
      borderRadius: RADIUS_12,
    },
    addCryptoImageText: {
      marginLeft: 4,
      color: "#fff",
      fontWeight: "bold",
      textShadowColor: "rgba(0, 0, 0, 0.8)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 3,
    },
    addCryptoText: {
      marginTop: 6,
      marginRight: 4,
      color: c.mutedText,
      fontWeight: "bold",
      textAlign: "center",
    },

    // balance modal
    BalanceView: { paddingBottom: 200 },
    modalBalanceLabel: {
      color: c.text,
      textAlign: "center",
      fontSize: FONT_SIZE_16,
      marginTop: 40,
      marginBottom: 10,
    },
    modalBalance: {
      color: c.text,
      textAlign: "center",
      fontSize: FONT_SIZE_34,
      marginBottom: 30,
    },

    // wallet info
    walletInfoText: {
      color: "#676776",
      fontSize: FONT_SIZE_16,
      textAlign: "center",
      lineHeight: 22,
    },
    walletInfoContainer: {
      height: "100%",
      justifyContent: "center",
      paddingHorizontal: 20,
    },

    // misc text / inputs
    securityTitle: {
      color: c.mutedText,
      fontSize: FONT_SIZE_22,
      textAlign: "center",
      marginBottom: 18,
    },
    centeredContent: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 20,
    },
    highlightText: { color: "#FF6347", textAlign: "left" },
    textInput: {
      width: "100%",
      height: 300,
      borderColor: c.border,
      borderWidth: 1,
      marginTop: 20,
      padding: 10,
      borderRadius: RADIUS_8,
      color: c.text,
      backgroundColor: c.inputBg,
      textAlignVertical: "top",
    },
    input: {
      backgroundColor: c.inputBg,
      padding: 10,
      marginTop: 20,
      justifyContent: "center",
      borderRadius: RADIUS_10,
      height: 60,
      alignItems: "center",
    },
  });
};

export default VaultScreenStyles;
