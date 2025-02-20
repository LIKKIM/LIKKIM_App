// modal/NewPasswordModal.js
import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * NewPasswordModal 组件
 *
 * Props:
 * - visible: 控制 Modal 显示/隐藏
 * - onRequestClose: 点击取消或返回时调用的函数（关闭 Modal）
 * - onSubmit: 点击提交时调用的函数（处理密码提交）
 * - password: 当前新密码值
 * - setPassword: 设置新密码的函数
 * - confirmPassword: 确认密码的值
 * - setConfirmPassword: 设置确认密码的函数
 * - passwordError: 密码错误提示文本
 * - setPasswordError: 清空或设置密码错误提示的函数
 * - isPasswordHidden: 控制密码是否隐藏（布尔值）
 * - setIsPasswordHidden: 切换密码显示状态的函数
 * - isConfirmPasswordHidden: 控制确认密码是否隐藏的布尔值
 * - setIsConfirmPasswordHidden: 切换确认密码显示状态的函数
 * - t: 国际化函数
 * - isDarkMode: 是否为暗黑模式（布尔值）
 * - styles: 样式对象（例如 MyColdWalletScreenStyle）
 */
const NewPasswordModal = ({
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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.setPasswordModalView}>
          <Text style={styles.passwordModalTitle}>{t("Set New Password")}</Text>
          <View style={{ marginVertical: 10, width: "100%" }}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={[styles.passwordInput, styles.focusedInput]}
                placeholder={t("Enter new password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isPasswordHidden}
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
                style={[styles.passwordInput, styles.focusedInput]}
                placeholder={t("Confirm new password")}
                placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                secureTextEntry={isConfirmPasswordHidden}
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

export default NewPasswordModal;
