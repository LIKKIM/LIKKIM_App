import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

const ChangePasswordModal = ({
  visible,
  onClose,
  onSubmit,
  styles,
  isDarkMode,
  t,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true);

  const handleNextForChangePassword = () => {
    // 调用父组件的提交处理函数
    onSubmit(currentPassword);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.changePasswordModalView}>
          <Text style={styles.passwordModalTitle}>{t("Change Password")}</Text>
          <View style={{ marginVertical: 10, width: "100%" }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, styles.focusedInput]}
                placeholder={t("Enter current password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isCurrentPasswordHidden}
                onChangeText={setCurrentPassword}
                value={currentPassword}
                autoFocus={true}
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
              onPress={handleNextForChangePassword}
            >
              <Text style={styles.submitButtonText}>{t("Next")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ChangePasswordModal;
