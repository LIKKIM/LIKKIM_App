import React, { useState, useEffect, useContext } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  ActivityIndicator,
} from "react-native";
import * as Location from "expo-location";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { DarkModeContext } from "./CryptoContext";

const styles = StyleSheet.create({
  container: {
    height: "70%",
    // width: 400,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});

/**
 * 寻找LKKIM定位
 * author 2winter
 */
export default function FindMyLkkim() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [status, requestPermission] = Location.useForegroundPermissions();
  //当前定位｜最近一次定位
  useEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: isDarkMode ? "#24234C" : "#FFFFFF", // 动态背景色
      },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000", // 动态文本颜色
    });
  }, [isDarkMode, navigation]);

  const [currentPosition, setPosition] = useState({
    lat: 0, //纬度
    lng: 0, //经度
    unix: 0, //时间戳
    status: false,
  });

  //刷新时间误差
  const unixOffest = 1000 * 60 * 5; //五分钟之内为最新定位
  //是否最新定位
  const [positionUnix, setPositionUnix] = useState(0);
  //经纬度转地址
  const latlngToAddress = async ({ lat, lng }) => {
    let _address = await Location.reverseGeocodeAsync({
      latitude: lat,
      longitude: lng,
    });

    // console.log('地址：')
    // console.log(_address);
    if (_address && _address.length > 0) {
      setAddress(_address[0].formattedAddress);
      syncLocalPosition({
        lat,
        lng,
        unix: Date.now(),
        status: true,
        address: _address,
      }); //本地存储同步
    }
  };

  //获取当前定位
  const getCurrentPoistion = async () => {
    if (!(await Location.hasServicesEnabledAsync()))
      return alert("未开启手机定位功能！");

    console.log("检查定位权限");

    if (!status || !status.granted) {
      // console.log('未授予定位权限，开始请求定位');
      let _pr = await requestPermission();
      console.log(_pr);
      setLoading(false);
      if (!_pr.granted) return alert("申请被拒绝，请重新进入！");
    } else {
      console.log("定位权限授予.");
    }

    console.log("开始获取定位功能");

    setLoading(true);
    let lastPosition = await Location.getLastKnownPositionAsync();
    let _currentPosition = lastPosition;

    //未获取到上次缓存定位，开始获取最新定位
    if (!_currentPosition) {
      console.log("获取最新");
      _currentPosition = await Location.getCurrentPositionAsync();
    } else {
      console.log("获取上一次缓存");
    }

    console.log("获取成功:");
    console.log(_currentPosition);

    if (_currentPosition) {
      console.log("更新View定位");
      //定位成功同步到本地
      setPositionUnix(Date.now()); //刷新最新定位时间
      setPosition({
        lat: _currentPosition.coords.latitude,
        lng: _currentPosition.coords.longitude,
        unix: Date.now(),
        status: true,
      });

      latlngToAddress({
        lat: _currentPosition.coords.latitude,
        lng: _currentPosition.coords.longitude,
      });
    } else {
      alert("定位失败.");
    }

    setLoading(false);
  };

  //保存定位到本地
  const syncLocalPosition = async (_info) => {
    AsyncStorage.setItem("positionInfo", JSON.stringify(_info));
  };

  //从本地恢复定位
  const restorePosition = async () => {
    let _positionInfo = await AsyncStorage.getItem("positionInfo");
    if (_positionInfo) {
      _positionInfo = JSON.parse(_positionInfo);
      console.log("缓存恢复数据：");
      console.log(_positionInfo);
      //TODO 恢复定位
      setPosition({
        lat: _positionInfo.lat,
        lng: _positionInfo.lng,
        unix: _positionInfo.unix,
        status: true,
      });
      //恢复地址
      setAddress(_positionInfo.address);
    } else {
      console.log("本地缓存不存在定位信息.");
    }

    //链接设备,同时重新刷新定位信息
    connectToLkkim();
  };

  //TODO 链接到设备
  const connectToLkkim = async () => {
    // console.log('链接设备...:' + Math.random());
    //链接成功 获取定位保存到本地,更新view定位。

    //TODO connect LKKIM
    if (true) {
      //链接设备成功 更新本地和state位置
      await getCurrentPoistion();
    }
    //else 链接失败，不刷新定位，默认只展示最近一次位置
  };

  useEffect(() => {
    restorePosition(); //最近一次保存的定位信息
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <MapView
          provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined} // remove if not using Google Maps
          style={styles.map}
          zoomEnabled
          zoomTapEnabled
          zoomControlEnabled={true}
          region={{
            latitude: currentPosition.lat,
            longitude: currentPosition.lng,
            latitudeDelta: 0.015,
            longitudeDelta: 0.0121,
          }}
        >
          <Marker
            coordinate={{
              latitude: currentPosition.lat,
              longitude: currentPosition.lng,
            }}
            onPress={() => alert("你的LIKKIM在这里！")}
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
                source={require("../assets/icon/device.png")}
                style={{ height: 40, width: 40 }}
              />
            </View>
          </Marker>
        </MapView>
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
                marginBottom: 5,
                color: isDarkMode ? "#fff" : "#000",
              }}
            >
              Devices
            </Text>
            {!loading && (
              <Text
                style={{ fontSize: 13, color: isDarkMode ? "#ddd" : "#666" }}
              >
                {Date.now() - positionUnix > unixOffest
                  ? "Last time: " + address // 文本描述和格式调整
                  : "Now: " + address}
              </Text>
            )}

            {loading && (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: isDarkMode ? "#ddd" : "#666" }}>
                  {" "}
                  Locating:
                </Text>
                <ActivityIndicator
                  style={{ marginLeft: 5 }}
                  color={isDarkMode ? "#ddd" : "#666"}
                />
              </View>
            )}
          </View>
        </View>
        <Pressable
          style={{
            marginTop: 16,
          }}
        >
          <Text
            style={{
              color: isDarkMode ? "#ddd" : "#666",
              fontWeight: "500",
              marginBottom: 5,
            }}
          >
            Last Day at xxxx
          </Text>
          <Text
            style={{
              color: isDarkMode ? "#ddd" : "#666",
              fontWeight: "500",
              marginBottom: 5,
            }}
          >
            Last Week at xxxx
          </Text>
          <Text
            style={{ color: isDarkMode ? "#ddd" : "#666", fontWeight: "500" }}
          >
            Last Month at xxxx
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
