// modal/SecurityCodeModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const SecurityCodeModal = ({
  visible,
  pinCode,
  setPinCode,
  onSubmit,
  onCancel,
  styles,
  isDarkMode,
  t,
  status,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.SecurityCodeModalView}>
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {status === "VALID" && (
                <Image
                  source={require("../../assets/Authentic.png")}
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    marginBottom: 15,
                    resizeMode: "contain",
                  }}
                />
              )}
              <Text style={styles.SecurityCodeModalTitle}>
                {t("Enter PIN to Connect")}
              </Text>
            </View>
            <Text style={styles.modalSubtitle}>
              {t("Use the PIN code to connect securely to your device.")}
            </Text>
          </View>
          <TextInput
            style={styles.passwordInput}
            placeholder={t("Enter PIN")}
            placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
            keyboardType="numeric"
            secureTextEntry
            onChangeText={setPinCode}
            value={pinCode}
            autoFocus={true}
          />
          <View style={{ width: "100%" }}>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default SecurityCodeModal;
