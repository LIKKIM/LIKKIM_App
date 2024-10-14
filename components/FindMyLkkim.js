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
  Alert, // 引入 Alert 模块
  Pressable,
  Clipboard,
  ScrollView, // 引入 ScrollView
  Dimensions, // 引入 Dimensions 获取屏幕高度
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location"; // 引入expo-location库
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { DarkModeContext } from "./CryptoContext"; // 假设这个文件包含 DarkMode 的上下文

const GOOGLE_MAPS_API_KEY = "AIzaSyAaLPaHuHj_vT7cHsA99HZeuAH_Z1p3Xbg"; // 使用你的 Google Maps API Key

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
      // 获取每个设备的地址
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
  const [loading, setLoading] = useState(false);
  const [devicesPositions, setDevicesPositions] = useState([]); // 保存多个设备的模拟定位
  const [currentPosition, setCurrentPosition] = useState(null); // 保存当前设备的位置
  const mapRef = useRef(null); // 通过 useRef 获取 MapView 的引用
  const [deviceAddresses, setDeviceAddresses] = useState({}); // 保存设备地址

  const screenHeight = Dimensions.get("window").height; // 获取屏幕高度
  const listHeight = screenHeight * 0.3; // 列表的高度占屏幕的30%

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#24234C" : "#FFFFFF", // 动态背景色
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000", // 动态文本和返回按钮颜色
    });
  }, [isDarkMode, navigation]);

  useEffect(() => {
    // 请求设备定位权限并获取当前位置
    requestLocationPermission();

    // 从 AsyncStorage 中加载已保存的设备数据并获取其地址
    loadConnectedDevices(setDevicesPositions, setDeviceAddresses);
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

  // 地图上点击设备的函数
  const handleMarkerPress = (device) => {
    const address = deviceAddresses[device.id] || "Address not found";

    // 复制地址到剪切板
    Clipboard.setString(address);

    // 显示 Alert 提示
    Alert.alert(
      "Address Copied to Clipboard",
      `The address of device ${device.name} is:\n${address}\n\nThe address has been copied to your clipboard.`,
      [{ text: "OK" }]
    );
  };

  // 列表中点击设备时移动到该设备的位置
  const moveToDeviceLocation = (device) => {
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
              onPress={() => handleMarkerPress(device)} // 点击地图上的设备时调用
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

      {/* 设备列表区域，限制高度为屏幕的 30% */}
      <View
        style={{
          height: listHeight, // 限制列表区域高度
          backgroundColor: isDarkMode ? "#24234C" : "#f5f5f5", // 动态背景颜色
          padding: 15,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.2,
          shadowRadius: 1,
          elevation: 3, // 对Android也应用阴影
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

        {/* 如果设备太多，使用 ScrollView，否则正常显示 */}
        {devicesPositions.length > 3 ? (
          <ScrollView
            style={{
              marginBottom: 50,
            }}
          >
            {devicesPositions.map((device, index) => (
              <Pressable
                key={index}
                onPress={() => moveToDeviceLocation(device)}
              >
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
                  <View
                    style={{
                      width: "86%",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 13,
                        marginBottom: 6,
                        color: isDarkMode ? "#ddd" : "#666",
                        flexWrap: "wrap",
                        lineHeight: 18,
                      }}
                    >
                      {deviceAddresses[device.id] || "Fetching address..."}
                      {/* 动态显示地址 */}
                    </Text>

                    <Text
                      style={{
                        fontSize: 12,
                        color: isDarkMode ? "#aaa" : "#999",
                      }}
                    >
                      Last connected:{" "}
                      {new Date(device.connectedAt).toLocaleString()}{" "}
                      {/* 显示最后连接的时间 */}
                    </Text>
                  </View>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          devicesPositions.map((device, index) => (
            <Pressable key={index} onPress={() => moveToDeviceLocation(device)}>
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
                    {deviceAddresses[device.id] || "Fetching address..."}{" "}
                    {/* 动态显示地址 */}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: isDarkMode ? "#aaa" : "#999",
                    }}
                  >
                    Last connected:{" "}
                    {new Date(device.connectedAt).toLocaleString()}{" "}
                    {/* 显示最后连接的时间 */}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>
    </View>
  );
}
