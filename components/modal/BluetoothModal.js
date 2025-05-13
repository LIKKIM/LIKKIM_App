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
  PermissionsAndroid,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import * as Location from "expo-location";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTranslation } from "react-i18next";
import checkAndReqPermission from "../../utils/BluetoothPermissions";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import { DarkModeContext, DeviceContext } from "../../utils/DeviceContext";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";

const BluetoothModal = ({
  visible,
  handleDevicePress,
  onCancel,
  verifiedDevices,
  onDisconnectPress,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useContext(DarkModeContext);
  const styles = SecureDeviceScreenStyles(isDarkMode);
  const iconColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const [devices, setDevices] = useState([]);
  const [isScanning, setIsScanning] = useState(false);
  const bleManagerRef = useRef(new BleManager());
  const scanTimeoutRef = useRef(null);

  const restoreIdentifier = Constants.installationId;

  useEffect(() => {
    if (Platform.OS === "web") return;
    bleManagerRef.current = new BleManager({
      restoreStateIdentifier: restoreIdentifier,
    });
    const subscription = bleManagerRef.current.onStateChange((state) => {
      if (state === "PoweredOn" && visible) {
        setTimeout(startScanning, 2000);
      }
    }, true);

    return () => {
      subscription.remove();
      bleManagerRef.current.destroy();
    };
  }, []);

  const startScanning = () => {
    if (Platform.OS === "web" || isScanning) return;
    setDevices([]);
    setIsScanning(true);
    checkAndReqPermission(() => {
      bleManagerRef.current.startDeviceScan(
        null,
        { allowDuplicates: true },
        (error, device) => {
          if (error) {
            console.log("BleManager scanning error:", error);
            return;
          }
          if (device.name && device.name.includes("LIKKIM")) {
            setDevices((prev) =>
              prev.find((d) => d.id === device.id) ? prev : [...prev, device]
            );
          }
        }
      );
    });

    setTimeout(() => {
      bleManagerRef.current.stopDeviceScan();
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    if (visible) {
      startScanning();
    } else {
      bleManagerRef.current.stopDeviceScan();
      setIsScanning(false);
    }
  }, [visible]);

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
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.bluetoothModalView}>
          <Text style={styles.bluetoothModalTitle}>
            {t("LOOKING FOR DEVICES")}
          </Text>
          {isScanning ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Bluetooth.gif")}
                style={styles.bluetoothImg}
              />
              <Text style={styles.scanModalSubtitle}>{t("Scanning...")}</Text>
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
                      <View style={styles.deviceItemContainer}>
                        <Icon
                          name={isVerified ? "mobile-friendly" : "smartphone"}
                          size={24}
                          color={isVerified ? "#3CDA84" : iconColor}
                          style={styles.deviceIcon}
                        />
                        <Text style={styles.modalSubtitle}>
                          {item.name || item.id}
                        </Text>
                        {isVerified && (
                          <TouchableOpacity
                            style={styles.disconnectButton}
                            onPress={() => onDisconnectPress(item)}
                          >
                            <Text style={styles.disconnectButtonText}>
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
              <Text style={styles.modalSubtitle}>
                {t(
                  "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                )}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.cancelButtonLookingFor}
            onPress={onCancel}
          >
            <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BluetoothModal;
