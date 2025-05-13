// modal/BluetoothModal.js
import React, { useEffect, useState, useContext, useRef } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import { DarkModeContext, DeviceContext } from "../../utils/DeviceContext";
import checkAndReqPermission from "../../utils/BluetoothPermissions";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
const BluetoothModal = ({
  visible,
  handleDevicePress,
  onCancel,
  verifiedDevices,
  SecureDeviceScreenStyle,
  onDisconnectPress,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const iconColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const bleManagerRef = useRef(new BleManager());
  const scanTimeoutRef = useRef(null);

  const startScanning = () => {
    if (Platform.OS === "web" || isScanning) return;
    checkAndReqPermission(() => {
      setDevices([]);
      setIsScanning(true);
      bleManagerRef.current.startDeviceScan(
        null,
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            console.log("BleManager scanning error:", error);
          } else if (device.name && device.name.includes("LIKKIM")) {
            setDevices((prev) => {
              if (!prev.find((d) => d.id === device.id)) {
                return [...prev, device];
              }
              return prev;
            });
          }
        }
      );
      scanTimeoutRef.current = setTimeout(() => {
        stopScanning();
      }, 2000);
    });
  };

  const stopScanning = () => {
    if (!isScanning) return;
    bleManagerRef.current.stopDeviceScan();
    setIsScanning(false);
    clearTimeout(scanTimeoutRef.current);
  };

  useEffect(() => {
    if (visible) {
      startScanning();
    } else {
      stopScanning();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      stopScanning();
      bleManagerRef.current.destroy();
    };
  }, []);

  useEffect(
    () => () => {
      // cleanup
      stopScanning();
      bleManagerRef.current.destroy();
    },
    []
  );
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
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

  const getDeviceLocation = async () => {
    if (!locationPermissionGranted) {
      console.warn("Location permission not granted");
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

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={10} style={SecureDeviceScreenStyle.centeredView}>
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
                  const isVerified = verifiedDevices.includes(item.id);
                  return (
                    <TouchableOpacity
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
                          color={isVerified ? "#3CDA84" : iconColor}
                          style={SecureDeviceScreenStyle.deviceIcon}
                        />
                        <Text style={SecureDeviceScreenStyle.modalSubtitle}>
                          {item.name || item.id}
                        </Text>
                        {isVerified && (
                          <TouchableOpacity
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
              <Text style={SecureDeviceScreenStyle.modalSubtitle}>
                {t(
                  "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                )}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={SecureDeviceScreenStyle.cancelButtonLookingFor}
            onPress={onCancel}
          >
            <Text style={SecureDeviceScreenStyle.cancelButtonText}>
              {t("Cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BluetoothModal;
