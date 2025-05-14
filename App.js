// App.js
import { TextEncoder, TextDecoder } from "text-encoding";
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
import "intl-pluralrules";
import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Vibration,
  Platform,
} from "react-native";
import Constants from "expo-constants";
import { BleManager, BleErrorCode } from "react-native-ble-plx";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import styles, { darkTheme, lightTheme } from "./styles";
import VaultScreen from "./components/Vault";
import ActivityScreen from "./components/Activity";
import SecureDeviceScreen from "./components/SecureDevice";
import OnboardingScreen from "./utils/OnboardingScreen";
import ScreenLock from "./utils/ScreenLock";
import { parseDeviceCode } from "./utils/parseDeviceCode";
import checkAndReqPermission from "./utils/BluetoothPermissions";
import DeviceDisplay from "./components/SecureDeviceScreen/DeviceDisplay";
import SupportPage from "./components/SecureDeviceScreen/SupportPage";
import SecurityCodeModal from "./components/modal/SecurityCodeModal";
import BluetoothModal from "./components/modal/BluetoothModal";
import CheckStatusModal from "./components/modal/CheckStatusModal";
import { CryptoProvider, DeviceContext } from "./utils/DeviceContext";
import { prefixToShortName } from "./config/chainPrefixes";
import * as SplashScreen from "expo-splash-screen";
import { bluetoothConfig } from "./env/bluetoothConfig";
import { Svg, Path, G } from "react-native-svg";
import { Buffer } from "buffer";
const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

//by will: 阻止自动隐藏 splash screen
SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [headerDropdownVisible, setHeaderDropdownVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState("");

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1300);
  }, []);

  // Check if the app is launched for the first time
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value === null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  const handleOnboardingDone = () => {
    setIsFirstLaunch(false);
  };

  if (isFirstLaunch === null) return null;
  if (isFirstLaunch === true)
    return (
      <CryptoProvider>
        <OnboardingApp onDone={handleOnboardingDone} />
      </CryptoProvider>
    );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar backgroundColor={"#fff"} barStyle="dark-content" />
      <CryptoProvider>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="Back" options={{ headerShown: false }}>
              {(props) => (
                <AppContent
                  {...props}
                  t={t}
                  headerDropdownVisible={headerDropdownVisible}
                  setHeaderDropdownVisible={setHeaderDropdownVisible}
                  selectedCardName={selectedCardName}
                  setSelectedCardName={setSelectedCardName}
                />
              )}
            </Stack.Screen>
            <Stack.Screen
              name="Secure Device Status"
              component={DeviceDisplay}
              options={{ title: t("Secure Device Status") }}
            />
            <Stack.Screen
              name="Support"
              component={SupportPage}
              options={{
                title: t("Help & Support"),
                headerShadowVisible: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CryptoProvider>
    </GestureHandlerRootView>
  );
}

/**
 * OnboardingApp displays the onboarding screen for first-time users.
 */
function OnboardingApp({ onDone }) {
  return (
    <>
      <OnboardingScreen onDone={onDone} />
    </>
  );
}

/**
 * AppContent holds the main application content including the bottom Tab Navigator.
 * It includes a refreshDarkMode function to update the dark mode state.
 */
function AppContent({
  t,
  headerDropdownVisible,
  setHeaderDropdownVisible,
  selectedCardName,
  setSelectedCardName,
}) {
  const [scale] = useState(new Animated.Value(1)); // Animated scale value
  const [isScanning, setIsScanning] = useState(false);
  const bleManagerRef = useRef(null);
  const restoreIdentifier = Constants.installationId;
  const [devices, setDevices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [SecurityCodeModalVisible, setSecurityCodeModalVisible] =
    useState(false);
  const [pinCode, setPinCode] = useState("");
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [receivedAddresses, setReceivedAddresses] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const theme = isDarkMode ? darkTheme : lightTheme;
  const tabBarActiveTintColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const tabBarInactiveTintColor = isDarkMode ? "#ffffff50" : "#676776";
  const headerTitleColor = isDarkMode ? "#ffffff" : "#333333";
  const tabBarBackgroundColor = isDarkMode ? "#22201F" : "#fff";
  const bottomBackgroundColor = isDarkMode ? "#0E0D0D" : "#EDEBEF";
  const iconColor = isDarkMode ? "#ffffff" : "#000000";
  const [CheckStatusModalVisible, setCheckStatusModalVisible] = useState(false);
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  useEffect(() => {
    if (Platform.OS !== "web") {
      bleManagerRef.current = new BleManager({
        restoreStateIdentifier: restoreIdentifier,
      });

      const subscription = bleManagerRef.current.onStateChange((state) => {
        if (state === "PoweredOn") {
          setTimeout(() => {
            scanDevices();
          }, 2000);
        }
      }, true);

      return () => {
        subscription.remove();
        bleManagerRef.current && bleManagerRef.current.destroy();
      };
    }
  }, []);
  const scanDevices = () => {
    if (Platform.OS !== "web" && !isScanning) {
      checkAndReqPermission(() => {
        console.log("Scanning started");
        setIsScanning(true);
        const scanOptions = { allowDuplicates: true };
        const scanFilter = null;
        bleManagerRef.current.startDeviceScan(
          scanFilter,
          scanOptions,
          (error, device) => {
            if (error) {
              console.log("BleManager scanning error:", error);
              if (error.errorCode === BleErrorCode.BluetoothUnsupported) {
                // Bluetooth LE unsupported on device
              }
            } else if (device.name && device.name.includes("LIKKIM")) {
              setDevices((prevDevices) => {
                if (!prevDevices.find((d) => d.id === device.id)) {
                  return [...prevDevices, device];
                }
                return prevDevices;
              });
            }
          }
        );
        setTimeout(() => {
          console.log("Scanning stopped");
          bleManagerRef.current.stopDeviceScan();
          setIsScanning(false);
        }, 2000);
      });
    } else {
      console.log("Attempt to scan while already scanning");
    }
  };
  function hexStringToUint32Array(hexString) {
    return new Uint32Array([
      parseInt(hexString.slice(0, 8), 16),
      parseInt(hexString.slice(8, 16), 16),
    ]);
  }

  function uint32ArrayToHexString(uint32Array) {
    return (
      uint32Array[0].toString(16).toUpperCase().padStart(8, "0") +
      uint32Array[1].toString(16).toUpperCase().padStart(8, "0")
    );
  }
  const handleBluetoothPairing = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: t("Location Permission"),
          message: t("We need access to your location to use Bluetooth."),
          buttonNeutral: t("Ask Me Later"),
          buttonNegative: t("Cancel"),
          buttonPositive: t("OK"),
        }
      );
      if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Location permission denied");
        return;
      }
    }
    setModalVisible(true);
    scanDevices();
  };
  const handlePinSubmit = async () => {
    setSecurityCodeModalVisible(false);
    setCheckStatusModalVisible(false);
    const verificationCodeValue = receivedVerificationCode.trim();
    const pinCodeValue = pinCode.trim();

    console.log(`User PIN: ${pinCodeValue}`);
    console.log(`Received data: ${verificationCodeValue}`);

    const [prefix, rest] = verificationCodeValue.split(":");
    if (prefix !== "PIN" || !rest) {
      console.log("Invalid verification format:", verificationCodeValue);
      setCheckStatusModalVisible(true);
      setVerificationStatus("fail");
      return;
    }

    const [receivedPin, flag] = rest.split(",");
    if (!receivedPin || (flag !== "Y" && flag !== "N")) {
      console.log("Invalid verification format:", verificationCodeValue);
      setVerificationStatus("fail");
      return;
    }

    console.log(`Extracted PIN: ${receivedPin}`);
    console.log(`Flag: ${flag}`);

    if (pinCodeValue === receivedPin) {
      console.log("PIN verified successfully");
      setVerificationStatus("success");
      setVerifiedDevices([selectedDevice.id]);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify([selectedDevice.id])
      );
      setIsVerificationSuccessful(true);
      console.log("Device verified and saved");

      try {
        const confirmationMessage = "PIN_OK";
        const bufferConfirmation = Buffer.from(confirmationMessage, "utf-8");
        const base64Confirmation = bufferConfirmation.toString("base64");
        await selectedDevice.writeCharacteristicWithResponseForService(
          serviceUUID,
          writeCharacteristicUUID,
          base64Confirmation
        );
        console.log("Sent confirmation message:", confirmationMessage);
      } catch (error) {
        console.log("Error sending confirmation message:", error);
      }

      if (flag === "Y") {
        console.log("Flag Y received; sending 'address' to device");
        try {
          const addressMessage = "address";
          const bufferAddress = Buffer.from(addressMessage, "utf-8");
          const base64Address = bufferAddress.toString("base64");
          await selectedDevice.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Address
          );
          console.log("Sent 'address' to device");
          setCheckStatusModalVisible(true);
        } catch (error) {
          console.log("Error sending 'address':", error);
        }

        const pubkeyMessages = [
          "pubkey:cosmos,m/44'/118'/0'/0/0",
          "pubkey:ripple,m/44'/144'/0'/0/0",
          "pubkey:celestia,m/44'/118'/0'/0/0",
          "pubkey:juno,m/44'/118'/0'/0/0",
          "pubkey:osmosis,m/44'/118'/0'/0/0",
        ];

        for (const message of pubkeyMessages) {
          try {
            const bufferMessage = Buffer.from(message, "utf-8");
            const base64Message = bufferMessage.toString("base64");
            await selectedDevice.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              base64Message
            );
            console.log(`Sent message: ${message}`);
          } catch (error) {
            console.log(`Error sending message "${message}":`, error);
          }
        }
      } else if (flag === "N") {
        console.log("Flag N received; no 'address' sent");
        setCheckStatusModalVisible(true);
      }
    } else {
      console.log("PIN verification failed");
      setVerificationStatus("fail");
      if (monitorSubscription) {
        monitorSubscription.remove();
        console.log("Stopped monitoring verification code");
      }
      if (selectedDevice) {
        await selectedDevice.cancelConnection();
        console.log("Disconnected device");
      }
    }
    setPinCode("");
  };

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8, // Scale down to 0.8
      duration: 100, // Duration of the scale animation
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1, // Scale back to normal
      duration: 100, // Duration of the scale animation
      useNativeDriver: true,
    }).start();
  };

  const { isAppLaunching, cryptoCards, verifiedDevices, setVerifiedDevices } =
    useContext(DeviceContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("darkMode")
      .then((value) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsDarkMode(parsedValue);
        }
      })
      .catch((error) => console.error("Failed to read darkMode", error));
  }, []);

  const refreshDarkMode = () => {
    AsyncStorage.getItem("darkMode")
      .then((value) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsDarkMode(parsedValue);
        }
      })
      .catch((error) => console.error("Failed to refresh darkMode", error));
  };

  const navigation = useNavigation();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [screenLockFeatureEnabled, setScreenLockFeatureEnabled] =
    useState(false);
  const [isScreenLockLoaded, setIsScreenLockLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      const rootRoutes = e.data.state?.routes;
      const backRoute = rootRoutes?.find((route) => route.name === "Back");
      if (backRoute && backRoute.state) {
        const tabRoutes = backRoute.state.routes;
        const walletRoute = tabRoutes.find((route) => route.name === "Assets");
        if (walletRoute?.params?.isModalVisible !== undefined) {
          setWalletModalVisible(walletRoute.params.isModalVisible);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    AsyncStorage.getItem("screenLockFeatureEnabled")
      .then((value) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setScreenLockFeatureEnabled(parsedValue);
        }
      })
      .catch((error) =>
        console.error("Failed to load screenLockFeatureEnabled", error)
      )
      .finally(() => {
        setIsScreenLockLoaded(true);
      });
  }, []);

  if (!isScreenLockLoaded) return null;
  if (screenLockFeatureEnabled && isAppLaunching) return <ScreenLock />;

  let monitorSubscription;

  const monitorVerificationCode = (device, sendparseDeviceCodeedValue) => {
    monitorSubscription = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log("Error monitoring device response:", error.message);
          return;
        }
        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        // 检查数据是否以已知前缀开头（例如 "bitcoin:"、"ethereum:" 等）
        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const chainShortName = prefixToShortName[prefix];
          console.log(`Received ${chainShortName} address: `, newAddress);
          updateCryptoAddress(chainShortName, newAddress);

          // 更新 receivedAddresses 状态，并检查是否全部接收
          setReceivedAddresses((prev) => {
            const updated = { ...prev, [chainShortName]: newAddress };
            // 假设预期地址数量与 prefixToShortName 中的条目数一致
            const expectedCount = Object.keys(prefixToShortName).length;
            if (Object.keys(updated).length >= expectedCount) {
              setVerificationStatus("walletReady");
            } else {
              setVerificationStatus("waiting");
            }
            return updated;
          });
        }

        if (receivedDataString.startsWith("pubkeyData:")) {
          const pubkeyData = receivedDataString
            .replace("pubkeyData:", "")
            .trim();
          const [queryChainName, publicKey] = pubkeyData.split(",");
          if (queryChainName && publicKey) {
            console.log(
              `Received public key for ${queryChainName}: ${publicKey}`
            );
            updateDevicePubHintKey(queryChainName, publicKey);
          }
        }

        // Process data containing "ID:"
        if (receivedDataString.includes("ID:")) {
          const encryptedHex = receivedDataString.split("ID:")[1];
          const encryptedData = hexStringToUint32Array(encryptedHex);
          const key = new Uint32Array([0x1234, 0x1234, 0x1234, 0x1234]);
          parseDeviceCode(encryptedData, key);
          const parseDeviceCodeedHex = uint32ArrayToHexString(encryptedData);
          console.log("parseDeviceCodeed string:", parseDeviceCodeedHex);
          if (sendparseDeviceCodeedValue) {
            sendparseDeviceCodeedValue(parseDeviceCodeedHex);
          }
        }

        // If data is "VALID", update status and send "validation"
        if (receivedDataString === "VALID") {
          try {
            setVerificationStatus("VALID");
            console.log("Status set to: VALID");
            const validationMessage = "validation";
            const bufferValidationMessage = Buffer.from(
              validationMessage,
              "utf-8"
            );
            const base64ValidationMessage =
              bufferValidationMessage.toString("base64");
            await device.writeCharacteristicWithResponseForService(
              serviceUUID,
              writeCharacteristicUUID,
              base64ValidationMessage
            );
            console.log(`Sent 'validation' to device`);
          } catch (error) {
            console.log("Error sending 'validation':", error);
          }
        }

        // Extract complete PIN data (e.g., PIN:1234,Y or PIN:1234,N)
        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          console.log("Complete PIN data received:", receivedDataString);
        }
      }
    );
  };

  const handleCancel = () => {
    setModalVisible(false);
  };
  const handleConfirmDelete = () => {
    setHeaderDropdownVisible(false);
    navigation.navigate("Assets", {
      showDeleteConfirmModal: true,
      isModalVisible: true,
    });
  };
  const handleDevicePress = async (device) => {
    setReceivedAddresses({});
    setVerificationStatus(null);
    setSelectedDevice(device);
    setModalVisible(false);
    try {
      await device.connect();
      await device.discoverAllServicesAndCharacteristics();
      console.log("Device connected and services discovered");

      const sendparseDeviceCodeedValue = async (parseDeviceCodeedValue) => {
        try {
          const message = `ID:${parseDeviceCodeedValue}`;
          const bufferMessage = Buffer.from(message, "utf-8");
          const base64Message = bufferMessage.toString("base64");
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64Message
          );
          console.log(`Sent parseDeviceCodeed value: ${message}`);
        } catch (error) {
          console.log("Error sending parseDeviceCodeed value:", error);
        }
      };

      monitorVerificationCode(device, sendparseDeviceCodeedValue);

      setTimeout(async () => {
        try {
          const requestString = "request";
          const bufferRequestString = Buffer.from(requestString, "utf-8");
          const base64requestString = bufferRequestString.toString("base64");
          await device.writeCharacteristicWithResponseForService(
            serviceUUID,
            writeCharacteristicUUID,
            base64requestString
          );
          console.log("Sent 'request'");
        } catch (error) {
          console.log("Error sending 'request':", error);
        }
      }, 200);
      setSecurityCodeModalVisible(true);
    } catch (error) {
      console.log("Error connecting or sending command to device:", error);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: bottomBackgroundColor }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          lazy: false,
          tabBarIcon: ({ focused, size }) => {
            let iconName;
            if (route.name === "Assets") {
              iconName = "account-balance-wallet";
            } else if (route.name === "Activity") {
              iconName = "swap-horiz";
            } else if (route.name === "General") {
              iconName = "smartphone";
            }
            return (
              <Icon
                name={iconName}
                size={size}
                color={
                  focused ? tabBarActiveTintColor : tabBarInactiveTintColor
                }
              />
            );
          },
          tabBarLabel: ({ focused }) => {
            let label;
            if (route.name === "Assets") label = t("Assets");
            else if (route.name === "Activity") label = t("Activity");
            else if (route.name === "General") label = t("General");
            return (
              <Text
                style={{
                  color: focused
                    ? tabBarActiveTintColor
                    : tabBarInactiveTintColor,
                }}
              >
                {label}
              </Text>
            );
          },
          tabBarActiveTintColor,
          tabBarInactiveTintColor,
          tabBarStyle: {
            backgroundColor: tabBarBackgroundColor,
            borderTopWidth: 0,
            height: walletModalVisible ? 0 : 100,
            paddingBottom: walletModalVisible ? 0 : 30,
            borderTopLeftRadius: 22,
            borderTopRightRadius: 22,
            display: walletModalVisible ? "none" : "flex",
          },
          tabBarLabelStyle: { fontSize: 12 },
          headerStyle: {
            backgroundColor: theme.headerStyle.backgroundColor,
            borderBottomColor: theme.headerStyle.borderBottomColor,
            borderBottomWidth: 0,
          },
          headerTintColor: theme.headerTintColor,
          headerTitleStyle: { fontWeight: "bold", color: headerTitleColor },
          headerTitle: t(route.name),
          headerShadowVisible: false,
        })}
      >
        <Tab.Screen
          name="Assets"
          component={VaultScreen}
          initialParams={{ isDarkMode }}
          options={({ route, navigation }) => {
            const cryptoCards = route.params?.cryptoCards || [{}];
            return {
              headerRight: () => (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {route.params?.isModalVisible ? (
                    <TouchableOpacity
                      style={{ paddingRight: 30 }}
                      onPress={() => {
                        setHeaderDropdownVisible(true);
                        setSelectedCardName(route.params?.selectedCardName);
                      }}
                    >
                      <Icon name="settings" size={24} color={iconColor} />
                    </TouchableOpacity>
                  ) : (
                    cryptoCards.length > 0 && (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Assets", { showAddModal: true })
                        }
                        style={{ paddingRight: 28 }}
                      >
                        <Icon name="add" size={24} color={iconColor} />
                      </TouchableOpacity>
                    )
                  )}
                </View>
              ),
            };
          }}
        />
        {cryptoCards.length > 0 && (
          <Tab.Screen name="Activity" component={ActivityScreen} />
        )}

        <Tab.Screen name="General">
          {(props) => (
            <SecureDeviceScreen {...props} onDarkModeChange={refreshDarkMode} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {cryptoCards.length === 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 70, // Position it above the tab bar
            left: "50%",
            transform: [{ translateX: -35 }], // Adjust to center the button horizontally
            zIndex: 10, // Make sure the button is above the tab bar
          }}
        >
          <Svg
            width={156}
            height={45}
            viewBox="0 0 156 44.5"
            preserveAspectRatio="none"
            style={{
              left: "50%",
              transform: [{ translateX: -78 }], // Adjust to center the button horizontally
              position: "absolute",
              bottom: -15,
            }}
          >
            <Path
              d="M155.999998,0 C155.960048,5.2271426e-05 155.920029,0 155.879998,0 C138.607292,0 123.607522,9.73159464 116.064456,24.011016 L116.072109,24.0008284 C108.100611,36.6193737 94.0290043,45 77.9999979,45 C61.9756639,45 47.9075891,36.6242589 39.9348591,24.0118622 C32.3924733,9.73159464 17.3927034,0 0.119997873,0 L0,0.001 L155.999998,0 Z"
              fill={bottomBackgroundColor}
            />
          </Svg>
          <TouchableWithoutFeedback
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={() => {
              Vibration.vibrate();
              handleBluetoothPairing();
            }}
            //     onPress={() => alert("Button Pressed!")}
          >
            <Animated.View
              style={{
                width: 70,
                height: 70,
                borderRadius: 35,
                backgroundColor: tabBarActiveTintColor,
                justifyContent: "center",
                alignItems: "center",
                transform: [{ scale }],
              }}
            >
              <Icon name="bluetooth" size={24} color="#fff" />
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      )}

      <StatusBar
        backgroundColor={isDarkMode ? "#21201E" : "#FFFFFF"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {headerDropdownVisible && (
        <Modal
          animationType="fade"
          transparent
          visible={headerDropdownVisible}
          onRequestClose={() => setHeaderDropdownVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPressOut={() => setHeaderDropdownVisible(false)}
          >
            <BlurView intensity={10} style={styles.centeredView}>
              <View style={theme.dropdown}>
                <TouchableOpacity
                  onPress={handleConfirmDelete}
                  style={styles.dropdownButton}
                >
                  <Text style={theme.dropdownButtonText}>
                    {t("Delete Card")}
                  </Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </TouchableOpacity>
        </Modal>
      )}
      {/* Bluetooth Modal */}
      <BluetoothModal
        visible={modalVisible}
        devices={devices}
        isScanning={isScanning}
        handleDevicePress={handleDevicePress}
        onCancel={handleCancel}
        verifiedDevices={verifiedDevices}
      />

      {/* PIN Modal */}
      <SecurityCodeModal
        visible={SecurityCodeModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        onSubmit={handlePinSubmit}
        onCancel={() => setSecurityCodeModalVisible(false)}
        status={verificationStatus}
      />

      {/* Verification Modal */}
      <CheckStatusModal
        visible={CheckStatusModalVisible && verificationStatus !== null}
        status={verificationStatus}
        onClose={() => setCheckStatusModalVisible(false)}
      />
    </View>
  );
}
