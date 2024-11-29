// PinModal.js
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
import Icon from "react-native-vector-icons/MaterialIcons";

const PinModal = ({
  visible,
  pinCode,
  setPinCode,
  onSubmit,
  onCancel,
  styles,
  isDarkMode,
  t,
  status, // 父组件传入的状态
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.pinModalView}>
          <View style={{ alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {status === "VALID" && (
                <Image
                  source={require("../../assets/Authentic.png")} // 替换为实际图片路径
                  style={{
                    width: 40,
                    height: 40,
                    marginRight: 10,
                    marginBottom: 15,
                    resizeMode: "contain", // 保持图片宽高比并适应容器
                  }}
                />
              )}
              <Text style={styles.pinModalTitle}>
                {t("Enter PIN to Connect")}
                {/* 如果状态为 VALID，显示额外的 View */}
              </Text>
            </View>
            <Text style={styles.modalSubtitle}>
              {t(
                "Use the PIN code to establish a secure connection with your LIKKIM hardware."
              )}
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

export default PinModal;
