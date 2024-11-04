//FindMyLkkim.js
import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useLayoutEffect,
} from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  Alert,
  Pressable,
  Clipboard,
  ScrollView,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { DarkModeContext } from "./CryptoContext";
import { Swipeable } from "react-native-gesture-handler"; // 引入Swipeable组件

const GOOGLE_MAPS_API_KEY = "AIzaSyAaLPaHuHj_vT7cHsA99HZeuAH_Z1p3Xbg";

const styles = StyleSheet.create({
  container: {
    height: "70%",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  buttonIcon: {
    width: 26,
    height: 26,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
    justifyContent: "center",
    alignItems: "center",
    width: 70,
    height: "100%",
  },
  deleteText: {
    color: "white",
    fontWeight: "600",
  },
});

// 使用 Google Maps Geocoding API 获取地址
const getAddressFromLatLng = async (lat, lng) => {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    } else {
      return "Address not found";
    }
  } catch (error) {
    console.error("Error getting address:", error);
    return "Error fetching address";
  }
};

// 从 AsyncStorage 中恢复设备数据
const loadConnectedDevices = async (
  setDevicesPositions,
  setDeviceAddresses
) => {
  try {
    const savedDevices = await AsyncStorage.getItem("connectedDevices");
    if (savedDevices !== null) {
      const devices = JSON.parse(savedDevices);
      const devicesWithAddresses = await Promise.all(
        devices.map(async (device) => {
          const address = await getAddressFromLatLng(device.lat, device.lng);
          setDeviceAddresses((prev) => ({
            ...prev,
            [device.id]: address,
          }));
          return { ...device, address };
        })
      );
      setDevicesPositions(devicesWithAddresses);
      console.log("设备数据已恢复:", devicesWithAddresses);
    } else {
      console.log("没有已保存的设备数据");
    }
  } catch (error) {
    console.error("加载设备数据失败:", error);
  }
};

export default function FindMyLkkim() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);
  const [devicesPositions, setDevicesPositions] = useState([]);
  const [deviceAddresses, setDeviceAddresses] = useState({});
  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
  const listHeight = screenHeight * 0.3;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF",
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
    });
  }, [isDarkMode, navigation]);

  useEffect(() => {
    requestLocationPermission();
    loadConnectedDevices(setDevicesPositions, setDeviceAddresses);
  }, [isDarkMode, navigation]);

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("权限被拒绝，无法获取设备位置");
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setCurrentPosition({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  };

  const handleMarkerPress = (device) => {
    const address = deviceAddresses[device.id] || "Address not found";
    Clipboard.setString(address);
    Alert.alert(
      "Address Copied to Clipboard",
      `The address of device ${device.name} is:\n${address}\n\nThe address has been copied to your clipboard.`,
      [{ text: "OK" }]
    );
  };

  const moveToDeviceLocation = (device) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: device.lat,
          longitude: device.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  const handleDeleteDevice = async (deviceId) => {
    try {
      const savedDevices = await AsyncStorage.getItem("connectedDevices");
      const devices = savedDevices ? JSON.parse(savedDevices) : [];
      const updatedDevices = devices.filter((device) => device.id !== deviceId);
      await AsyncStorage.setItem(
        "connectedDevices",
        JSON.stringify(updatedDevices)
      );
      setDevicesPositions(updatedDevices);
      console.log(`设备 ${deviceId} 已删除`);
    } catch (error) {
      console.error("删除设备失败:", error);
    }
  };

  const confirmDeleteDevice = (deviceId) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this device?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: () => handleDeleteDevice(deviceId),
          style: "destructive",
        },
      ]
    );
  };

  const renderRightActions = (device) => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => confirmDeleteDevice(device.id)}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  const moveToCurrentLocation = () => {
    if (currentPosition && mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: currentPosition.lat,
          longitude: currentPosition.lng,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          ref={mapRef}
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
          style={styles.map}
          zoomEnabled
          showsUserLocation={true}
          region={{
            latitude: currentPosition?.lat || devicesPositions[0]?.lat || 0,
            longitude: currentPosition?.lng || devicesPositions[0]?.lng || 0,
            latitudeDelta: 10,
            longitudeDelta: 10,
          }}
        >
          {devicesPositions.map((device, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: device.lat,
                longitude: device.lng,
              }}
              onPress={() => handleMarkerPress(device)}
            >
              <View
                style={{
                  backgroundColor: isDarkMode ? "#21201E" : "#f5f5f5",
                  height: 50,
                  width: 50,
                  borderRadius: 25,
                  margin: 15,
                  alignItems: "center",
                  justifyContent: "center",
                  ...(Platform.OS === "ios"
                    ? {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 0 },
                        shadowOpacity: 0.5,
                        shadowRadius: 5,
                      }
                    : {
                        elevation: 5,
                      }),
                }}
              >
                <Image
                  source={
                    isDarkMode
                      ? require("../assets/icon/deviceDarkMode.png")
                      : require("../assets/icon/device.png")
                  }
                  style={{ height: 38, width: 38 }}
                />
              </View>
            </Marker>
          ))}
        </MapView>

        {Platform.OS === "ios" && (
          <Pressable
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: isDarkMode ? "#21201E" : "#f5f5f5",
              borderRadius: 30,
              width: 50,
              height: 50,
              justifyContent: "center",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 5,
            }}
            onPress={moveToCurrentLocation}
          >
            <Image
              source={
                isDarkMode
                  ? require("../assets/icon/location.png")
                  : require("../assets/icon/locationBlack.png")
              }
              style={styles.buttonIcon}
            />
          </Pressable>
        )}
      </View>

      <View
        style={{
          height: listHeight,
          backgroundColor: isDarkMode ? "#21201E" : "#f5f5f5",
          paddingTop: 20,
          paddingLeft: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
          elevation: 3,
        }}
      >
        <Text
          style={{
            fontWeight: "600",
            fontSize: 16,
            marginBottom: 15,
            color: isDarkMode ? "#fff" : "#000",
          }}
        >
          Devices
        </Text>

        {/* 如果设备列表为空，显示提示信息 */}
        {devicesPositions.length === 0 ? (
          <View
            style={{
              height: "50%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: isDarkMode ? "#ddd" : "#666",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              No devices found. Please pair a device to see it here.
            </Text>
          </View>
        ) : (
          <ScrollView>
            {devicesPositions.map((device, index) => (
              <Swipeable
                key={device.id}
                renderRightActions={() => renderRightActions(device)}
              >
                <Pressable onPress={() => moveToDeviceLocation(device)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 10,
                    }}
                  >
                    <View
                      style={{
                        width: 35,
                        height: 35,
                        marginRight: 10,
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 18,
                        backgroundColor: "rgba(0, 0, 0, 0.2)",
                      }}
                    >
                      <Image
                        source={
                          isDarkMode
                            ? require("../assets/icon/deviceDarkMode.png")
                            : require("../assets/icon/device.png")
                        }
                        style={{ width: 22, height: 22 }}
                      />
                    </View>

                    {/* 设备地址和时间部分 */}
                    <View style={{ flex: 1 }}>
                      {/* 限制地址的显示行数，超出部分使用省略号 */}
                      <Text
                        style={{
                          fontSize: 13,
                          marginBottom: 6,
                          color: isDarkMode ? "#ddd" : "#666",
                          flexWrap: "wrap", // 确保文本换行
                          lineHeight: 18,
                        }}
                      >
                        {deviceAddresses[device.id] || "Fetching address..."}
                      </Text>

                      <Text
                        style={{
                          fontSize: 12,
                          color: isDarkMode ? "#aaa" : "#999",
                        }}
                      >
                        Last connected:{" "}
                        {new Date(device.connectedAt).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Swipeable>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
