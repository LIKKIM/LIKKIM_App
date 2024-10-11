import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location"; // 引入expo-location库
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { DarkModeContext } from "./CryptoContext"; // 假设这个文件包含 DarkMode 的上下文

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
});

const simulatedDevices = [
  {
    deviceId: "device1",
    lat: 37.7749, // 纬度
    lng: -122.4194, // 经度
    address: "San Francisco, CA",
    unix: Date.now() - 1000 * 60 * 3, // 3分钟前的时间戳
  },
  {
    deviceId: "device2",
    lat: 34.0522, // 纬度
    lng: -118.2437, // 经度
    address: "Los Angeles, CA",
    unix: Date.now() - 1000 * 60 * 10, // 10分钟前的时间戳
  },
  {
    deviceId: "device3",
    lat: 40.7128, // 纬度
    lng: -74.006, // 经度
    address: "New York, NY",
    unix: Date.now() - 1000 * 60 * 30, // 30分钟前的时间戳
  },
];

// 将设备数据持久化存储到 AsyncStorage
const persistSimulatedDevices = async (devices) => {
  try {
    await AsyncStorage.setItem("simulatedDevices", JSON.stringify(devices));
    console.log("设备数据已保存");
  } catch (error) {
    console.error("设备数据保存失败:", error);
  }
};

// 从 AsyncStorage 中恢复设备数据
const loadSimulatedDevices = async (setDevicesPositions) => {
  try {
    const savedDevices = await AsyncStorage.getItem("simulatedDevices");
    if (savedDevices !== null) {
      setDevicesPositions(JSON.parse(savedDevices));
      console.log("设备数据已恢复");
    } else {
      // 如果没有存储的数据，则存储默认的模拟设备
      setDevicesPositions(simulatedDevices);
      persistSimulatedDevices(simulatedDevices); // 将默认数据持久化
    }
  } catch (error) {
    console.error("加载设备数据失败:", error);
  }
};

export default function FindMyLkkim() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const [devicesPositions, setDevicesPositions] = useState([]); // 保存多个设备的模拟定位
  const [currentPosition, setCurrentPosition] = useState(null); // 保存当前设备的位置
  const mapRef = useRef(null); // 通过 useRef 获取 MapView 的引用

  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#24234C" : "#FFFFFF", // 动态背景色
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000", // 动态文本颜色
    });

    // 请求设备定位权限并获取当前位置
    requestLocationPermission();

    // 模拟多个设备的定位数据
    simulateMultipleDevices();
  }, [isDarkMode, navigation]);

  // 请求定位权限并获取设备当前位置
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

  // 模拟多个设备的定位信息
  const simulateMultipleDevices = () => {
    setDevicesPositions(simulatedDevices); // 设置模拟设备位置
  };

  // 设备列表点击跳转函数
  const handleDevicePress = (device) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion(
        {
          latitude: device.lat,
          longitude: device.lng,
          latitudeDelta: 0.05, // 控制缩放程度
          longitudeDelta: 0.05,
        },
        1000 // 1000 毫秒平滑移动到目标位置
      );
    }
  };

  // 移动到当前设备的位置
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
          ref={mapRef} // 通过 useRef 获取 MapView 实例
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined} // 使用 Google Maps
          style={styles.map}
          zoomEnabled
          showsUserLocation={true} // 显示用户当前位置
          showsMyLocationButton={Platform.OS === "android"} // Android 上显示 "移动到我的位置" 按钮
          region={{
            latitude: currentPosition?.lat || devicesPositions[0]?.lat || 0,
            longitude: currentPosition?.lng || devicesPositions[0]?.lng || 0,
            latitudeDelta: 10, // 控制地图缩放比例
            longitudeDelta: 10,
          }}
        >
          {/* 显示其他设备的位置 */}
          {devicesPositions.map((device, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: device.lat,
                longitude: device.lng,
              }}
              onPress={() =>
                alert(`设备 ${device.deviceId} 在 ${device.address}！`)
              }
            >
              <View
                style={{
                  backgroundColor: isDarkMode ? "#24234C" : "#f5f5f5",
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

        {/* 如果是iOS，自定义按钮 */}
        {Platform.OS === "ios" && (
          <Pressable
            style={{
              position: "absolute",
              bottom: 20,
              right: 20,
              backgroundColor: isDarkMode ? "#24234C" : "#f5f5f5",
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
          flex: 1,
          backgroundColor: isDarkMode ? "#24234C" : "#f5f5f5", // 动态背景颜色
          padding: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
          elevation: 3, // 对Android也应用阴影
        }}
      >
        <View
          style={{
            marginTop: 10,
            height: 50,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View>
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
            {devicesPositions.map((device, index) => (
              <Pressable key={index} onPress={() => handleDevicePress(device)}>
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
                      justifyContent: "center", // 垂直方向居中
                      alignItems: "center", // 水平方向居中
                      borderRadius: 18, // 使容器为圆形
                      backgroundColor: "rgba(0, 0, 0, 0.2)", // 带透明度的背景色
                    }}
                  >
                    <Image
                      source={
                        isDarkMode
                          ? require("../assets/icon/deviceDarkMode.png") // 替换为实际的暗模式图标路径
                          : require("../assets/icon/device.png") // 替换为实际的亮模式图标路径
                      }
                      style={{
                        width: 22,
                        height: 22, // 图标的大小
                      }}
                    />
                  </View>

                  {/* 设备地址和时间部分 */}
                  <View>
                    <Text
                      style={{
                        fontSize: 13,
                        marginBottom: 6,
                        color: isDarkMode ? "#ddd" : "#666",
                      }}
                    >
                      {device.address} {/* 显示设备当前地址 */}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        color: isDarkMode ? "#aaa" : "#999",
                      }}
                    >
                      Last connected: {new Date(device.unix).toLocaleString()}{" "}
                      {/* 显示最后连接的时间 */}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}
