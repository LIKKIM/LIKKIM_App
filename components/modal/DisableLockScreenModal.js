// modal/DisableLockScreenModal.js
import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

/**
 * DisableLockScreenModal 组件
 *
 * Props:
 * - visible: 控制 Modal 显示/隐藏
 * - onRequestClose: 点击取消或返回时调用的函数（关闭 Modal）
 * - onSubmit: 点击提交时调用的函数（验证密码）
 * - currentPassword: 当前输入的密码值
 * - setCurrentPassword: 设置密码值的函数
 * - isCurrentPasswordHidden: 控制密码是否隐藏的布尔值
 * - setIsCurrentPasswordHidden: 切换密码显示状态的函数
 * - t: 国际化函数
 * - isDarkMode: 是否为暗黑模式
 * - styles: 包含样式的对象（例如 MyColdWalletScreenStyle）
 */
const DisableLockScreenModal = ({
  visible,
  onRequestClose,
  onSubmit,
  currentPassword,
  setCurrentPassword,
  isCurrentPasswordHidden,
  setIsCurrentPasswordHidden,
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

export default DisableLockScreenModal;
