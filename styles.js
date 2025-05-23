// styles.js
import { StyleSheet } from "react-native";

export const lightTheme = StyleSheet.create({
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#21201E",
  },
  titleText: {
    color: "#21201E",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#ddd",
  },
  headerStyle: {
    backgroundColor: "#fff",
  },
  headerRight: {
    backgroundColor: "#ddd",
  },
  addIconButton: {
    backgroundColor: "#fff",
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 60,
    backgroundColor: "#E5E1E9",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  dropdownButtonText: {
    color: "#000",
    fontSize: 16,
  },
});

export const darkTheme = StyleSheet.create({
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  titleText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  container: {
    backgroundColor: "#121212",
  },
  headerStyle: {
    backgroundColor: "#21201E",
  },
  headerRight: {
    backgroundColor: "#21201E",
  },
  addIconButton: {
    backgroundColor: "#21201E",
  },
  dropdown: {
    position: "absolute",
    right: 20,
    top: 60,
    backgroundColor: "#3F3D3C",
    borderRadius: 5,
    padding: 10,
    zIndex: 1,
  },
  dropdownButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

const styles = StyleSheet.create({
  dropdownButton: {
    padding: 10,
  },
  addIconButtonCommon: {
    marginRight: 16,
    borderRadius: 14,
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
    borderBottomColor: "#404040",
  },
  settingsText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#121212",
  },
  card: {
    width: 300,
    height: 170,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#3F3D3C",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(108, 108, 244, 0.1)",
  },
  cardText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  roundButton: {
    backgroundColor: "#3F3D3C",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#e0e0e0",
    fontSize: 16,
    fontWeight: "bold",
  },
  titleText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subButtonText: {
    color: "#e0e0e0",
    fontSize: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    margin: 20,
    height: 500,
    width: "90%",
    backgroundColor: "#3F3D3C",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalSubtitle: {
    color: "#e0e0e0",
    fontSize: 14,
    marginBottom: 320,
    textAlign: "center",
  },
  languageModalTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 30,
  },
  languageModalText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "center",
  },
  passwordModalText: {
    color: "#ffffff",
    fontSize: 16,
    marginBottom: 10,
    textAlign: "left",
  },
  languageList: {
    maxHeight: 320,
    width: 280,
  },
  languageCancelButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 30,
  },
  historyContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: "#21201E",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    height: 360,
  },
  historyTitle: {
    position: "absolute",
    left: 20,
    top: 20,
    fontSize: 16,
    color: "#ffffff",
  },
  noHistoryText: {
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  historyItemText: {
    fontSize: 16,
    color: "#000",
  },
  modalText: {
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 120,
  },
  optionButtonText: {
    color: "#ffffff",
  },
  optionButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#21201E",
    padding: 10,
    marginTop: 30,
    marginBottom: 60,
    justifyContent: "center",
    borderRadius: 10,
    height: 60,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#CCB68C",
    padding: 10,
    width: "90%",
    justifyContent: "center",
    borderRadius: 30,
    height: 60,
    alignItems: "center",
    position: "absolute",
    bottom: 60,
  },
  submitButtonText: {
    color: "#ffffff",
  },
  cancelButtonText: {
    color: "#ffffff",
  },
});

export default styles;
