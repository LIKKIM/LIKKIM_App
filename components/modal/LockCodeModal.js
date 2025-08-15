// modal/LockCodeModal.js
import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

function LockCodeModal({
  visible,
  onClose,
  onSubmit,
  isDarkMode,
  styles,
  t,
  LockCodeModalVisible,
  closeLockCodeModal,
  handleSetPassword,
  password,
  setPassword,
  passwordError,
  setPasswordError,
  confirmPassword,
  setConfirmPassword,
  isPasswordHidden,
  setIsPasswordHidden,
  isConfirmPasswordHidden,
  setIsConfirmPasswordHidden,
}) {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.enableLockModalView}>
          <Text style={styles.LockCodeModalTitle}>
            {t("Enable Screen Lock")}
          </Text>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={t("Enter new password")}
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              secureTextEntry={isPasswordHidden}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError("");
              }}
              value={password}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => setIsPasswordHidden(!isPasswordHidden)}
              style={styles.eyeIcon}
            >
              <Icon
                name={isPasswordHidden ? "visibility-off" : "visibility"}
                size={24}
                color={isDarkMode ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder={t("Confirm new password")}
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              secureTextEntry={isConfirmPasswordHidden}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity
              onPress={() =>
                setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
              }
              style={styles.eyeIcon}
            >
              <Icon
                name={isConfirmPasswordHidden ? "visibility-off" : "visibility"}
                size={24}
                color={isDarkMode ? "#ccc" : "#666"}
              />
            </TouchableOpacity>
          </View>

          {passwordError && (
            <Text style={[styles.errorText, { marginLeft: 10 }]}>
              {passwordError}
            </Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSetPassword}
            >
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

export default LockCodeModal;
