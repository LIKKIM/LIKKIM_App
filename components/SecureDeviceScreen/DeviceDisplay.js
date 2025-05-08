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
  ActivityIndicator,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import { DarkModeContext } from "../../utils/DeviceContext";
import { Swipeable } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";
import { useLocales } from "expo-localization";
import mapKeys from "../../env/mapKeys";

const GOOGLE_MAPS_API_KEY = mapKeys.GOOGLE_MAPS_API_KEY;
const GAODE_MAP_API_KEY = mapKeys.GAODE_MAP_API_KEY;

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
  loadingButtonIcon: {
    width: 26,
    height: 26,
    opacity: 0.5,
  },
});

// Retrieves an address from Google Maps using latitude and longitude.
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
    console.log("Error getting address:", error);
    return "Error fetching address";
  }
};

// AMap reverse geocoding: Retrieves an address from AMap using latitude and longitude.
const getAddressFromLatLngGD = async (lat, lng) => {
  console.log(`AMap coordinates: ${lat}, ${lng}`);
  const geoData = await fetch(
    `https://restapi.amap.com/v3/geocode/regeo?key=${GAODE_MAP_API_KEY}&location=${lng},${lat}&extensions=all`
  ).then((res) => res.json());
  if (
    geoData.status == 1 &&
    geoData.regeocode.addressComponent.adcode.length > 0
  ) {
    console.log("AMap reverse geocoding successful");
    const comp = geoData.regeocode.addressComponent;
    const address = `${comp.city}${comp.district}${comp.township}${
      comp.streetNumber.street
    }${comp.streetNumber.number} (${
      geoData.regeocode.pois.length > 0 ? geoData.regeocode.pois[0].name : ""
    })`;
    console.log("AMap address:", address);
    return address;
  } else {
    console.log("AMap reverse geocoding failed", geoData.regeocode);
    return "Address Fetch Failed.";
  }
};

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
          setDeviceAddresses((prev) => ({ ...prev, [device.id]: address }));
          return { ...device, address };
        })
      );
      setDevicesPositions(devicesWithAddresses);
      console.log("Restored device data:", devicesWithAddresses);
    } else {
      console.log("No saved device data found");
    }
  } catch (error) {
    console.log("Failed to load device data:", error);
  }
};

export default function DeviceDisplay() {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);
  const { t } = useTranslation();
  const [devicesPositions, setDevicesPositions] = useState([]);
  const [deviceAddresses, setDeviceAddresses] = useState({});
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const mapRef = useRef(null);
  const screenHeight = Dimensions.get("window").height;
  const listHeight = screenHeight * 0.3;
  const locales = useLocales();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF" },
      headerTintColor: isDarkMode ? "#FFFFFF" : "#000000",
    });
  }, [isDarkMode, navigation]);

  useEffect(() => {
    navigation.setOptions({
      headerBackTitle: t("Back"),
    });
  }, [navigation, t]);

  useEffect(() => {
    requestLocationPermission();
    loadConnectedDevices(setDevicesPositions, setDeviceAddresses);
  }, [isDarkMode, navigation]);

  const requestLocationPermission = async () => {
    setIsLoadingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert(t("Permission denied, unable to access device location"));
      setIsLoadingLocation(false);
      return;
    }
    const location = await Location.getCurrentPositionAsync({});
    setCurrentPosition({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
    setIsLoadingLocation(false);
  };

  const handleMarkerPress = (device) => {
    const address = deviceAddresses[device.id] || t("Address not found");
    Clipboard.setString(address);
    Alert.alert(
      t("Address Copied to Clipboard"),
      `${t("The address of device")} ${device.name} ${t(
        "is"
      )}: \n${address}\n\n${t(
        "The address has been copied to your clipboard."
      )}`,
      [{ text: t("OK") }]
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
      console.log(`Device ${deviceId} deleted`);
    } catch (error) {
      console.log("Failed to delete device:", error);
    }
  };

  const confirmDeleteDevice = (deviceId) => {
    Alert.alert(
      t("Confirm Deletion"),
      t("Are you sure you want to delete this device?"),
      [
        { text: t("Cancel"), style: "cancel" },
        {
          text: t("Delete"),
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
      <Text style={styles.deleteText}>{t("Delete")}</Text>
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
              coordinate={{ latitude: device.lat, longitude: device.lng }}
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
                    : { elevation: 5 }),
                }}
              >
                <Image
                  source={
                    isDarkMode
                      ? require("../../assets/icon/deviceDarkMode.png")
                      : require("../../assets/icon/device.png")
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
            {isLoadingLocation ? (
              <ActivityIndicator
                size="small"
                color={isDarkMode ? "#FFF" : "#000"}
              />
            ) : (
              <Image
                source={
                  isDarkMode
                    ? require("../../assets/icon/location.png")
                    : require("../../assets/icon/locationBlack.png")
                }
                style={styles.buttonIcon}
              />
            )}
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
          {t("Devices")}
        </Text>
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
              {t("No devices found")}
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ maxHeight: 140 }}
            scrollIndicatorInsets={{ right: 4 }}
            showsVerticalScrollIndicator={true}
          >
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
                            ? require("../../assets/icon/deviceDarkMode.png")
                            : require("../../assets/icon/device.png")
                        }
                        style={{ width: 22, height: 22 }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontSize: 13,
                          marginBottom: 6,
                          color: isDarkMode ? "#ddd" : "#666",
                          flexWrap: "wrap",
                          lineHeight: 18,
                        }}
                      >
                        {deviceAddresses[device.id] || t("Fetching address...")}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: isDarkMode ? "#aaa" : "#999",
                        }}
                      >
                        {t("Last connected")}:{" "}
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
