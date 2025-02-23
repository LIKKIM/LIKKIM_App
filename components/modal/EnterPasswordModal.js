// EnterPasswordModal.js
import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

function EnterPasswordModal({
  visible,
  onClose,
  handleConfirmPassword,
  closeEnterPasswordModal,
  isDarkMode,
  styles,
  t,
  currentPassword,
  setCurrentPassword,
  isCurrentPasswordHidden,
  setIsCurrentPasswordHidden,
}) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.disableLockModalView}>
          <Text style={styles.passwordModalTitle}>
            {t("Disable Lock Screen")}
          </Text>
          <View style={{ marginVertical: 10, width: "100%" }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder={t("Enter your password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isCurrentPasswordHidden}
                onChangeText={setCurrentPassword}
                value={currentPassword}
                autoFocus
              />
              <TouchableOpacity
                onPress={() =>
                  setIsCurrentPasswordHidden(!isCurrentPasswordHidden)
                }
                style={styles.eyeIcon}
              >
                <Icon
                  name={
                    isCurrentPasswordHidden ? "visibility-off" : "visibility"
                  }
                  size={24}
                  color={isDarkMode ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleConfirmPassword}
            >
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={closeEnterPasswordModal}
            >
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

export default EnterPasswordModal;
