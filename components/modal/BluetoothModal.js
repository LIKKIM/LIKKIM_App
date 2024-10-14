// BluetoothModal.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as Location from "expo-location"; // 导入地理位置模块
import AsyncStorage from "@react-native-async-storage/async-storage"; // 导入异步存储模块

const BluetoothModal = ({
  visible,
  devices,
  isScanning,
  iconColor,
  onDevicePress, // 从外部传入的设备按下处理函数
  onCancel,
  verifiedDevices,
  MyColdWalletScreenStyle,
  t,
  onDisconnectPress,
}) => {
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  // 在组件挂载时预先请求地理位置权限
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermissionGranted(true);
      } else {
        console.warn("定位权限被拒绝");
      }
    };

    // 请求权限
    requestLocationPermission();
  }, []); // 仅在组件首次渲染时执行

  // 获取设备的位置信息
  const getDeviceLocation = async () => {
    if (!locationPermissionGranted) {
      console.warn("定位权限未授予");
      return null;
    }

    try {
      const location = await Location.getCurrentPositionAsync({});
      return { lat: location.coords.latitude, lng: location.coords.longitude };
    } catch (error) {
      console.error("获取位置失败：", error);
      return null;
    }
  };

  // 保存已连接设备及其地理位置信息
  const saveConnectedDevice = async (device, lat, lng) => {
    try {
      const savedDevices = await AsyncStorage.getItem("connectedDevices");
      let devices = savedDevices ? JSON.parse(savedDevices) : [];

      const newDeviceData = {
        id: device.id,
        name: device.name,
        lat: lat,
        lng: lng,
        connectedAt: Date.now(),
      };

      const existingDeviceIndex = devices.findIndex((d) => d.id === device.id);
      if (existingDeviceIndex !== -1) {
        devices[existingDeviceIndex] = newDeviceData;
      } else {
        devices.push(newDeviceData);
      }

      await AsyncStorage.setItem("connectedDevices", JSON.stringify(devices));
      console.log("设备信息已保存:", newDeviceData);
    } catch (error) {
      console.error("保存设备信息失败:", error);
    }
  };

  // 处理设备点击，同时保存地理信息
  const handleDeviceWithLocationPress = async (device) => {
    // 立即调用外部传入的 onDevicePress，确保弹窗立即显示
    onDevicePress(device);

    // 异步获取地理位置信息和保存设备信息，不阻塞弹窗显示
    const location = await getDeviceLocation();
    if (!location) return;

    // 保存设备和位置信息
    saveConnectedDevice(device, location.lat, location.lng);
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
        <View style={MyColdWalletScreenStyle.bluetoothModalView}>
          <Text style={MyColdWalletScreenStyle.bluetoothModalTitle}>
            {t("LOOKING FOR DEVICES")}
          </Text>
          {isScanning ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Bluetooth.gif")}
                style={MyColdWalletScreenStyle.bluetoothImg}
              />
              <Text style={MyColdWalletScreenStyle.scanModalSubtitle}>
                {t("Scanning...")}
              </Text>
            </View>
          ) : (
            devices.length > 0 && (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isVerified = verifiedDevices.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (!isVerified) {
                          handleDeviceWithLocationPress(item); // 使用包装后的函数
                        }
                      }}
                    >
                      <View style={MyColdWalletScreenStyle.deviceItemContainer}>
                        <Icon
                          name={isVerified ? "mobile-friendly" : "smartphone"}
                          size={24}
                          color={isVerified ? "#3CDA84" : iconColor}
                          style={MyColdWalletScreenStyle.deviceIcon}
                        />
                        <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                          {item.name || item.id}
                        </Text>
                        {isVerified && (
                          <TouchableOpacity
                            style={MyColdWalletScreenStyle.disconnectButton}
                            onPress={() => onDisconnectPress(item)}
                          >
                            <Text
                              style={
                                MyColdWalletScreenStyle.disconnectButtonText
                              }
                            >
                              {t("Disconnect")}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )
          )}
          {!isScanning && devices.length === 0 && (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Search.gif")}
                style={{ width: 180, height: 180, margin: 30 }}
              />
              <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                {t(
                  "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                )}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={MyColdWalletScreenStyle.cancelButtonLookingFor}
            onPress={onCancel}
          >
            <Text style={MyColdWalletScreenStyle.cancelButtonText}>
              {t("Cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BluetoothModal;
