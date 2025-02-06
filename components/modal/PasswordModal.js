import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useTranslation } from "react-i18next"; // 导入 useTranslation

function PasswordModal({
  visible,
  onClose,
  onSubmit,
  isDarkMode,
  styles,
  t,
  passwordModalVisible,
  closePasswordModal,
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
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.enableLockModalView}>
          <Text style={styles.passwordModalTitle}>
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
                setPasswordError(""); // 清除错误信息
              }}
              value={password}
              autoFocus={true}
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

          {/* 错误提示 */}
          {passwordError ? (
            <Text style={[styles.errorText, { marginLeft: 10 }]}>
              {passwordError}
            </Text>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSetPassword}
            >
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose} // 关闭模态框
            >
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
}

export default PasswordModal;
