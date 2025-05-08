// modal/NewLockCodeModal.js
import React, { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

const NewLockCodeModal = ({
  visible,
  onRequestClose,
  onSubmit,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  passwordError,
  setPasswordError,
  isPasswordHidden,
  setIsPasswordHidden,
  isConfirmPasswordHidden,
  setIsConfirmPasswordHidden,
  t,
  isDarkMode,
  styles,
}) => {
  const [isNewPasswordFocused, setIsNewPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.setLockCodeModalView}>
          <Text style={styles.LockCodeModalTitle}>{t("Set New Password")}</Text>
          <View style={{ marginVertical: 10, width: "100%" }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  isNewPasswordFocused && styles.focusedInput,
                ]}
                placeholder={t("Enter new password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isPasswordHidden}
                onFocus={() => setIsNewPasswordFocused(true)}
                onBlur={() => setIsNewPasswordFocused(false)}
                onChangeText={(text) => {
                  setPassword(text);
                  setPasswordError("");
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
          </View>
          <View style={{ marginVertical: 10, width: "100%" }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[
                  styles.passwordInput,
                  isConfirmPasswordFocused && styles.focusedInput,
                ]}
                placeholder={t("Confirm new password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isConfirmPasswordHidden}
                onFocus={() => setIsConfirmPasswordFocused(true)}
                onBlur={() => setIsConfirmPasswordFocused(false)}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  setPasswordError("");
                }}
                value={confirmPassword}
              />
              <TouchableOpacity
                onPress={() =>
                  setIsConfirmPasswordHidden(!isConfirmPasswordHidden)
                }
                style={styles.eyeIcon}
              >
                <Icon
                  name={
                    isConfirmPasswordHidden ? "visibility-off" : "visibility"
                  }
                  size={24}
                  color={isDarkMode ? "#ccc" : "#666"}
                />
              </TouchableOpacity>
            </View>
          </View>
          {passwordError ? (
            <Text style={[styles.errorText, { marginLeft: 10 }]}>
              {passwordError}
            </Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
              <Text style={styles.submitButtonText}>{t("Submit")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onRequestClose}
            >
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default NewLockCodeModal;
