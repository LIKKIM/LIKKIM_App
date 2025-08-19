// modal/BluetoothModal.js
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  Animated,
} from "react-native";

import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { DarkModeContext } from "../../utils/DeviceContext";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);
const BluetoothModal = ({
  visible,
  devices,
  isScanning,
  handleDevicePress,
  onCancel,
  verifiedDevices,
  onDisconnectPress,
  onRefreshPress,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const SecureDeviceScreenStyle = SecureDeviceScreenStyles(isDarkMode);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  const blueToothColor = isDarkMode ? "#CCB68C" : "#CFAB95";

  // 内部状态控制真正的 Modal 显示
  const [showModal, setShowModal] = useState(visible);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 显示 Modal 并执行进入动画
      setShowModal(true);
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(intensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (showModal) {
      setShowModal(false);
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      });
    }
  }, [visible]);

  const getSignalBars = (rssi) => {
    if (rssi >= -60) return 4;
    if (rssi >= -70) return 3;
    if (rssi >= -80) return 2;
    if (rssi >= -90) return 1;
    return 0;
  };
  /* 如果需要定位权限，请取消注释
  useEffect(() => {
    const requestLocationPermission = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        setLocationPermissionGranted(true);
      } else {
        console.warn("Location permission denied");
      }
    };
    requestLocationPermission();
  }, []);
  */

  const getDeviceLocation = async () => {
    if (!locationPermissionGranted) {
      console.log("Location permission not granted");
      return null;
    }
    try {
      const location = await Location.getCurrentPositionAsync({});
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    } catch (error) {
      console.error("Failed to get location:", error);
      return null;
    }
  };

  const saveConnectedDevice = async (device, lat, lng) => {
    try {
      const savedDevices = await AsyncStorage.getItem("connectedDevices");
      const devicesArray = savedDevices ? JSON.parse(savedDevices) : [];

      const newDeviceData = {
        id: device.id,
        name: device.name,
        lat,
        lng,
        connectedAt: Date.now(),
      };

      const existingDeviceIndex = devicesArray.findIndex(
        (d) => d.id === device.id
      );
      if (existingDeviceIndex !== -1) {
        devicesArray[existingDeviceIndex] = newDeviceData;
      } else {
        devicesArray.push(newDeviceData);
      }

      await AsyncStorage.setItem(
        "connectedDevices",
        JSON.stringify(devicesArray)
      );
      console.log("Device saved:", newDeviceData);
    } catch (error) {
      console.error("Failed to save device:", error);
    }
  };

  const handleDeviceWithLocationPress = async (device) => {
    handleDevicePress(device);
    const location = await getDeviceLocation();
    if (location) {
      saveConnectedDevice(device, location.lat, location.lng);
    }
  };

  if (!showModal) return null; // 动画完成后才移除 Modal

  const AnimatedTouchableWithScale = (props) => {
    const scaleAnim = React.useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start();
    };

    return (
      <AnimatedTouchable
        {...props}
        onPressIn={(e) => {
          onPressIn();
          if (props.onPressIn) props.onPressIn(e);
        }}
        onPressOut={(e) => {
          onPressOut();
          if (props.onPressOut) props.onPressOut(e);
        }}
        style={[props.style, { transform: [{ scale: scaleAnim }] }]}
      >
        {props.children}
      </AnimatedTouchable>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={showModal}
      onRequestClose={onCancel}
    >
      <AnimatedBlurView
        intensity={intensityAnim}
        style={SecureDeviceScreenStyle.centeredView}
      >
        <View style={SecureDeviceScreenStyle.bluetoothModalView}>
          <Text style={SecureDeviceScreenStyle.bluetoothModalTitle}>
            {t("LOOKING FOR DEVICES")}
          </Text>

          {isScanning ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Bluetooth.gif")}
                style={SecureDeviceScreenStyle.bluetoothImg}
              />
              <Text style={SecureDeviceScreenStyle.scanModalSubtitle}>
                {t("Scanning...")}
              </Text>
            </View>
          ) : (
            devices.length > 0 && (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isConnectableColor = item.isConnectable
                    ? "\x1b[32m"
                    : "\x1b[31m";
                  console.log(
                    `\n设备信息:\n` +
                      `id: ${item.id}\n` +
                      `name: ${item.name}\n` +
                      `localName: ${item.localName}\n` +
                      `${isConnectableColor}isConnectable: ${item.isConnectable}\x1b[0m\n` +
                      `RSSI: ${item.rssi}\n` +
                      `MTU: ${item.mtu}\n`
                  );

                  const isVerified = verifiedDevices.includes(item.id);
                  const signalBars = getSignalBars(item.rssi);

                  return (
                    <AnimatedTouchableWithScale
                      onPress={() => {
                        if (!isVerified) {
                          handleDeviceWithLocationPress(item);
                        }
                      }}
                    >
                      <View style={SecureDeviceScreenStyle.deviceItemContainer}>
                        <Icon
                          name={isVerified ? "mobile-friendly" : "smartphone"}
                          size={24}
                          color={isVerified ? "#3CDA84" : blueToothColor}
                          style={SecureDeviceScreenStyle.deviceIcon}
                        />
                        <Text style={SecureDeviceScreenStyle.modalSubtitle}>
                          {item.name || item.id}
                          {"  "}
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "flex-end",
                              height: 14,
                            }}
                          >
                            {Array.from({ length: 4 }).map((_, i) => {
                              const barHeights = [4, 8, 11, 14];
                              return (
                                <View
                                  key={i}
                                  style={{
                                    width: 4,
                                    height: barHeights[i],
                                    marginHorizontal: 1,
                                    backgroundColor:
                                      i < signalBars ? "#3CDA84" : "#ccc",
                                    borderRadius: 1,
                                  }}
                                />
                              );
                            })}
                          </View>
                        </Text>
                        {isVerified && (
                          <AnimatedTouchableWithScale
                            style={SecureDeviceScreenStyle.disconnectButton}
                            onPress={() => onDisconnectPress(item)}
                          >
                            <Text
                              style={
                                SecureDeviceScreenStyle.disconnectButtonText
                              }
                            >
                              {t("Disconnect")}
                            </Text>
                          </AnimatedTouchableWithScale>
                        )}
                      </View>
                    </AnimatedTouchableWithScale>
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
              <Text style={SecureDeviceScreenStyle.modalSubtitle}>
                {t(
                  "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                )}
              </Text>
            </View>
          )}

          {!isScanning ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginTop: 20,
              }}
            >
              <AnimatedTouchableWithScale
                style={[
                  SecureDeviceScreenStyle.cancelButton,
                  { flex: 1, borderRadius: 15, marginRight: 10 },
                ]}
                onPress={onCancel}
              >
                <Text style={SecureDeviceScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </AnimatedTouchableWithScale>

              <AnimatedTouchableWithScale
                style={[
                  SecureDeviceScreenStyle.confirmButton,
                  { flex: 1, borderRadius: 15 },
                ]}
                onPress={onRefreshPress}
              >
                <Text style={SecureDeviceScreenStyle.cancelButtonText}>
                  {t("Refresh")}
                </Text>
              </AnimatedTouchableWithScale>
            </View>
          ) : (
            <AnimatedTouchableWithScale
              style={SecureDeviceScreenStyle.cancelButtonLookingFor}
              onPress={onCancel}
            >
              <Text style={SecureDeviceScreenStyle.cancelButtonText}>
                {t("Cancel")}
              </Text>
            </AnimatedTouchableWithScale>
          )}
        </View>
      </AnimatedBlurView>
    </Modal>
  );
};

export default BluetoothModal;
