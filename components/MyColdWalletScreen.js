// MyColdWalletScreen.js

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Platform,
  Switch,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../styles"; // 确保路径正确
import { BlurView } from "expo-blur";
import { BleManager } from "react-native-ble-plx";

function MyColdWalletScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);

  // 判断当前平台，如果不是Web，则初始化和使用蓝牙相关功能
  let bleManager;
  if (Platform.OS !== "web") {
    bleManager = new BleManager();
  }

  useEffect(() => {
    if (Platform.OS !== "web") {
      const subscription = bleManager.onStateChange((state) => {
        if (state === "PoweredOn") {
          scanDevices();
          subscription.remove();
        }
      }, true);
      return () => bleManager.destroy();
    }
  }, [bleManager]);

  const scanDevices = () => {
    if (Platform.OS !== "web") {
      setIsScanning(true);
      bleManager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.error(error);
          return;
        }
        setDevices((prevDevices) => {
          if (prevDevices.every((d) => d.id !== device.id)) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      });

      setTimeout(() => {
        bleManager.stopDeviceScan();
        setIsScanning(false);
      }, 10000); // Stop scanning after 10 seconds
    }
  };
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
          //thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          thumbColor={isDarkMode ? "#fff" : "#f4f3f4"}
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
          <View style={{ marginTop: 40 }}>
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
              <BlurView intensity={10} style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Text style={styles.modalTitle}>LOOKING FOR DEVICES</Text>
                  {isScanning ? (
                    <Text style={styles.modalSubtitle}>Scanning...</Text>
                  ) : (
                    <FlatList
                      data={devices}
                      keyExtractor={(item) => item.id}
                      renderItem={({ item }) => (
                        <Text style={styles.modalSubtitle}>
                          {item.name || "Unknown Device"}
                        </Text>
                      )}
                    />
                  )}
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
              </BlurView>
            </Modal>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
