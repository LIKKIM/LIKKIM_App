// MyColdWalletScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../styles"; // 确保路径正确

function MyColdWalletScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const settingsOptions = [
    { title: "Settings", icon: "settings", onPress: () => {} },
    { title: "Help & Support", icon: "help-outline", onPress: () => {} },
    { title: "Privacy & Data", icon: "privacy-tip", onPress: () => {} },
    { title: "About", icon: "info", onPress: () => {} },
    { title: "Language", icon: "language", onPress: () => {} },
    {
      title: "Dark Mode",
      icon: "dark-mode",
      onPress: () => setIsDarkMode(!isDarkMode), // 用于切换暗黑模式状态
      toggle: (
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsDarkMode(!isDarkMode)}
          value={isDarkMode}
        />
      ),
    },
  ];

  return (
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
          {/* Settings Options */}
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.title}
              style={styles.settingsItem}
              onPress={option.onPress}
            >
              {/* 显示图标和标题 */}
              <View
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
              >
                <Icon name={option.icon} size={24} color="#ffffff" />
                <Text
                  style={[
                    styles.settingsText,
                    option.title === "Dark Mode" ? { flex: 1 } : null,
                  ]}
                >
                  {option.title}
                </Text>
              </View>
              {/* 对于Dark Mode选项，添加一个toggle按钮 */}
              {option.title === "Dark Mode" && option.toggle}
            </TouchableOpacity>
          ))}

          {/* Bluetooth Btn */}
          <View className="mt-10">
            <Text style={styles.titleText}>Bluetooth</Text>
            <View style={{ alignItems: "center" }}>
              <TouchableOpacity
                style={styles.roundButton}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.buttonText}>Pair with Bluetooth</Text>
              </TouchableOpacity>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>LOOKING FOR DEVICES</Text>
                  <Text style={styles.modalSubtitle}>
                    Please make sure your Cold Wallet is unlocked and Bluetooth
                    is enabled.
                  </Text>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
