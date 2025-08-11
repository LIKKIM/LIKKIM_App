// styles.js
import { StyleSheet } from "react-native";
import {
  FONT_SIZE_12,
  FONT_SIZE_15,
  FONT_SIZE_16,
  FONT_SIZE_20,
  FONT_SIZE_22,
  RADIUS_5,
  RADIUS_10,
  RADIUS_14,
  RADIUS_20,
  RADIUS_30,
  TRANSPARENT_BLUE_10,
  TRANSPARENT_BLACK_20,
  lightColors,
  darkColors,
} from "./constants";

export const lightTheme = StyleSheet.create({
  settingsText: {
    marginLeft: 10,
    fontSize: FONT_SIZE_16,
    color: lightColors.textColor,
  },
  titleText: {
    color: lightColors.textColor,
    fontSize: FONT_SIZE_22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    backgroundColor: lightColors.backgroundColor,
  },
  headerStyle: {
    backgroundColor: lightColors.modalBackgroundColor,
  },
  headerRight: {
    backgroundColor: lightColors.backgroundColor,
  },
  addIconButton: {
    backgroundColor: lightColors.modalBackgroundColor,
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 60,
    backgroundColor: lightColors.buttonBackgroundColor,
    borderRadius: RADIUS_5,
    padding: 10,
    zIndex: 1,
  },
  dropdownButtonText: {
    color: lightColors.textColor,
    fontSize: FONT_SIZE_16,
  },
});

export const darkTheme = StyleSheet.create({
  settingsText: {
    marginLeft: 10,
    fontSize: FONT_SIZE_16,
    color: darkColors.textColor,
  },
  titleText: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    backgroundColor: darkColors.backgroundColor,
  },
  headerStyle: {
    backgroundColor: darkColors.dropdownBackgroundColor,
  },
  headerRight: {
    backgroundColor: darkColors.dropdownBackgroundColor,
  },
  addIconButton: {
    backgroundColor: darkColors.dropdownBackgroundColor,
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 60,
    backgroundColor: darkColors.cardBackgroundColor,
    borderRadius: RADIUS_5,
    padding: 10,
    zIndex: 1,
  },
  dropdownButtonText: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_16,
  },
});

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
  },
  addIconButtonCommon: {
    marginRight: 16,
    borderRadius: RADIUS_14,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    width: "100%",
  },
  contentContainer: {
    flexGrow: 1,
  },
  settingsItem: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.borderColor,
  },
  settingsText: {
    marginLeft: 10,
    fontSize: FONT_SIZE_16,
    color: darkColors.textColor,
  },
  container: {
    flex: 1,
    backgroundColor: darkColors.backgroundColor,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: darkColors.backgroundColor,
  },
  card: {
    width: 300,
    height: 170,
    borderRadius: RADIUS_20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: darkColors.cardBackgroundColor,
    marginBottom: 20,
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TRANSPARENT_BLUE_10,
  },
  cardText: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_16,
    fontWeight: "bold",
  },
  roundButton: {
    backgroundColor: darkColors.cardBackgroundColor,
    borderRadius: RADIUS_30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: darkColors.secondBtnTextColor,
    fontSize: FONT_SIZE_16,
    fontWeight: "bold",
  },
  titleText: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subButtonText: {
    color: darkColors.secondBtnTextColor,
    fontSize: FONT_SIZE_12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: TRANSPARENT_BLACK_20,
  },
  modalView: {
    margin: 20,
    height: 500,
    width: "90%",
    backgroundColor: darkColors.cardBackgroundColor,
    borderRadius: RADIUS_20,
    padding: 30,
    alignItems: "center",
    shadowColor: darkColors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalSubtitle: {
    color: darkColors.secondBtnTextColor,
    fontSize: FONT_SIZE_15,
    marginBottom: 320,
    textAlign: "center",
  },
  languageModalTitle: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  languageModalText: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_16,
    marginBottom: 10,
    textAlign: "center",
  },
  LockCodeModalText: {
    color: darkColors.textColor,
    fontSize: FONT_SIZE_16,
    marginBottom: 10,
    textAlign: "left",
  },
  languageList: {
    maxHeight: 320,
    width: 280,
  },
  languageCancelButton: {
    backgroundColor: darkColors.buttonBackgroundColor,
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
    backgroundColor: darkColors.dropdownBackgroundColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS_10,
    height: 360,
  },
  historyTitle: {
    position: "absolute",
    left: 20,
    top: 20,
    fontSize: FONT_SIZE_16,
    color: darkColors.textColor,
  },
  noHistoryText: {
    fontSize: FONT_SIZE_16,
    color: darkColors.textColor,
    textAlign: "center",
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: darkColors.historyItemBorderColor,
  },
  historyItemText: {
    fontSize: FONT_SIZE_16,
    color: lightColors.textColor,
  },
  modalText: {
    color: darkColors.textColor,
    textAlign: "center",
    marginBottom: 120,
  },
  optionButtonText: {
    color: darkColors.textColor,
  },
  optionButton: {
    backgroundColor: darkColors.buttonBackgroundColor,
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: RADIUS_30,
    height: 60,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: darkColors.inputBackgroundColor,
    padding: 10,
    marginTop: 30,
    marginBottom: 60,
    justifyContent: "center",
    borderRadius: RADIUS_10,
    height: 60,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: darkColors.buttonBackgroundColor,
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: RADIUS_30,
    height: 60,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: darkColors.buttonBackgroundColor,
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: RADIUS_30,
    height: 60,
    alignItems: "center",
    position: "absolute",
    bottom: 60,
  },
  submitButtonText: {
    color: darkColors.textColor,
  },
  cancelButtonText: {
    color: darkColors.textColor,
  },
});

export default styles;
