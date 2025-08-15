// App.js
global.__DEV__ = process.env.NODE_ENV === "development";
import { TextEncoder, TextDecoder } from "text-encoding";
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
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
import { useTranslation } from "react-i18next";
import styles, { darkTheme, lightTheme } from "./styles/styles";
import VaultScreen from "./components/Vault";
import ActivityScreen from "./components/Activity";
import SecureDeviceScreen from "./components/SecureDevice";
import OnboardingScreen from "./utils/OnboardingScreen";
import ScreenLock from "./utils/ScreenLock";
import { parseDeviceCode } from "./utils/parseDeviceCode";
import { createHandlePinSubmit } from "./utils/handlePinSubmit";
import checkAndReqPermission from "./utils/BluetoothPermissions";
import DeviceDisplay from "./components/SecureDeviceScreen/DeviceDisplay";
import SupportPage from "./components/SecureDeviceScreen/SupportPage";
import ConfirmDisconnectModal from "./components/modal/ConfirmDisconnectModal";
import SecurityCodeModal from "./components/modal/SecurityCodeModal";
import BluetoothModal from "./components/modal/BluetoothModal";
import CheckStatusModal from "./components/modal/CheckStatusModal";
import { CryptoProvider, DeviceContext } from "./utils/DeviceContext";
import { prefixToShortName } from "./config/chainPrefixes";
import * as SplashScreen from "expo-splash-screen";
import { bluetoothConfig } from "./env/bluetoothConfig";
import { Svg, Path, G } from "react-native-svg";
import { Buffer } from "buffer";
import FloatingDev from "./utils/dev";
import { hexStringToUint32Array, uint32ArrayToHexString } from "./env/hexUtils";
import { createHandleDevicePress } from "./utils/handleDevicePress";
import { scanDevices } from "./utils/scanDevices";
import { BlurView } from "expo-blur";
const FILE_NAME = "App.js";
const serviceUUID = bluetoothConfig.serviceUUID;
const writeCharacteristicUUID = bluetoothConfig.writeCharacteristicUUID;
const notifyCharacteristicUUID = bluetoothConfig.notifyCharacteristicUUID;

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}
if (__DEV__) {
  require("./utils/dev_fetch");
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
  const { bleManagerRef } = useContext(DeviceContext);
  const restoreIdentifier = Constants.installationId;
  const [devices, setDevices] = useState([]);
  const [bleVisible, setBleVisible] = useState(false);
  const [SecurityCodeModalVisible, setSecurityCodeModalVisible] =
    useState(false);
  const [pinCode, setPinCode] = useState("");
  const [missingChainsForModal, setMissingChainsForModal] = useState([]);
  const [receivedAddresses, setReceivedAddresses] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [CheckStatusModalVisible, setCheckStatusModalVisible] = useState(false);
  const [receivedVerificationCode, setReceivedVerificationCode] = useState("");
  const [deviceToDisconnect, setDeviceToDisconnect] = useState(null);
  const [confirmDisconnectModalVisible, setConfirmDisconnectModalVisible] =
    useState(false);
  const monitorSubscription = useRef(null);

  // 用DeviceContext的verificationStatus和setVerificationStatus
  const { verificationStatus, setVerificationStatus } =
    useContext(DeviceContext);

  const stopMonitoringVerificationCode = () => {
    if (monitorSubscription.current) {
      try {
        monitorSubscription.current.remove(); // 使用 monitorSubscription.current
        monitorSubscription.current = null; // 清除当前订阅
        console.log("Stopped monitoring verification code");
      } catch (error) {
        console.log("Error stopping monitoring:", error);
      }
    }
  };
  useEffect(() => {
    if (verifiedDevices.length === 0) {
      stopMonitoringVerificationCode();
      console.log("No verified devices, stopped BLE monitor.");
    }
  }, [verifiedDevices]);

  useEffect(() => {
    if (Platform.OS !== "web") {
      const subscription = bleManagerRef.current.onStateChange((state) => {
        if (state === "PoweredOn") {
          setTimeout(() => {
            scanDevices({
              isScanning,
              setIsScanning,
              bleManagerRef,
              setDevices,
            });
          }, 2000);
        }
      }, true);

      return () => {
        subscription.remove(); // 清理订阅
        // 新增取消蓝牙监听订阅
        if (monitorSubscription.current) {
          monitorSubscription.current.remove();
          monitorSubscription.current = null;
          console.log(
            "App.js: Cancelled Bluetooth monitor subscription on unmount"
          );
        }
      };
    }
  }, []);

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
    setBleVisible(true);
    setDevices([]);
    scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
  };

  // 用DeviceContext的verificationStatus和setVerificationStatus
  const {
    updateCryptoAddress,
    isAppLaunching,
    cryptoCards,
    verifiedDevices,
    setVerifiedDevices,
    setIsVerificationSuccessful,
    updateDevicePubHintKey,
  } = useContext(DeviceContext);

  // monitorVerificationCode 必须在 handlePinSubmit 之前声明
  const monitorVerificationCode = (device, sendparseDeviceCodeedValue) => {
    // 正确地移除已有监听
    if (monitorSubscription.current) {
      monitorSubscription.current.remove();
      monitorSubscription.current = null;
    }

    monitorSubscription.current = device.monitorCharacteristicForService(
      serviceUUID,
      notifyCharacteristicUUID,
      async (error, characteristic) => {
        if (error) {
          console.log(
            `${FILE_NAME} Error monitoring device response:`,
            error.message
          );
          return;
        }

        const receivedData = Buffer.from(characteristic.value, "base64");
        const receivedDataString = receivedData.toString("utf8");
        console.log("Received data string:", receivedDataString);

        const prefix = Object.keys(prefixToShortName).find((key) =>
          receivedDataString.startsWith(key)
        );
        if (prefix) {
          const newAddress = receivedDataString.replace(prefix, "").trim();
          const chainShortName = prefixToShortName[prefix];
          console.log(`Received ${chainShortName} address: `, newAddress);
          updateCryptoAddress(chainShortName, newAddress);

          setReceivedAddresses((prev) => {
            const updated = { ...prev, [chainShortName]: newAddress };
            const expectedCount = Object.keys(prefixToShortName).length;
            if (Object.keys(updated).length >= expectedCount) {
              setTimeout(() => {
                setVerificationStatus("walletReady");
                console.log("All public keys received, wallet ready.");
              }, 2000);
            } else {
              setVerificationStatus("waiting");
              // 新增打印缺失的区块链地址
              const missingChains = Object.values(prefixToShortName).filter(
                (shortName) => !updated.hasOwnProperty(shortName)
              );
              if (missingChains.length > 0) {
                console.log(
                  "Missing addresses for chains:",
                  missingChains.join(", ")
                );
              }
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
            updateDevicePubHintKey(queryChainName, publicKey);
          }
        }

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
            console.log("发送 'validation' 时出错:", error);
          }
        }

        if (receivedDataString.startsWith("PIN:")) {
          setReceivedVerificationCode(receivedDataString);
          monitorSubscription.current?.remove();
          monitorSubscription.current = null;
        }
      }
    );
  };

  // handlePinSubmit 已迁移至 utils/handlePinSubmit.js
  const handlePinSubmit = React.useMemo(
    () =>
      createHandlePinSubmit({
        setSecurityCodeModalVisible,
        setCheckStatusModalVisible,
        setVerificationStatus,
        setVerifiedDevices,
        setIsVerificationSuccessful,
        setPinCode,
        setReceivedAddresses,
        prefixToShortName,
        monitorVerificationCode,
        serviceUUID,
        writeCharacteristicUUID,
      }),
    [
      setSecurityCodeModalVisible,
      setCheckStatusModalVisible,
      setVerificationStatus,
      setVerifiedDevices,
      setIsVerificationSuccessful,
      setPinCode,
      setReceivedAddresses,
      prefixToShortName,
      monitorVerificationCode,
      serviceUUID,
      writeCharacteristicUUID,
    ]
  );

  // 包装一层，收集依赖参数，适配 SecurityCodeModal 的无参 onSubmit
  const handlePinSubmitProxy = React.useCallback(() => {
    handlePinSubmit({
      receivedVerificationCode,
      pinCode,
      selectedDevice,
      receivedAddresses,
    });
  }, [
    handlePinSubmit,
    receivedVerificationCode,
    pinCode,
    selectedDevice,
    receivedAddresses,
  ]);

  const handlePressIn = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = (onComplete) => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // 动画结束后回调
      onComplete && onComplete();
    });
  };

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
  const theme = isDarkMode ? darkTheme : lightTheme;
  const tabBarActiveTintColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const tabBarInactiveTintColor = isDarkMode ? "#ffffff50" : "#676776";
  const headerTitleColor = isDarkMode ? "#ffffff" : "#333333";
  const tabBarBackgroundColor = isDarkMode ? "#22201F" : "#fff";
  const bottomBackgroundColor = isDarkMode ? "#0E0D0D" : "#EDEBEF";
  const iconColor = isDarkMode ? "#ffffff" : "#000000";
  const navigation = useNavigation();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [screenLockFeatureEnabled, setScreenLockFeatureEnabled] =
    useState(false);
  const [isScreenLockLoaded, setIsScreenLockLoaded] = useState(false);
  useEffect(() => {
    if (verifiedDevices.length === 0) {
      stopMonitoringVerificationCode();
    }
  }, [verifiedDevices]);
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

  const handleDisconnectPress = (device) => {
    setBleVisible(false);
    setDeviceToDisconnect(device);
    setConfirmDisconnectModalVisible(true);
  };

  const handleDisconnectDevice = async (device) => {
    try {
      const isConnected = await device.isConnected();
      if (!isConnected) {
        console.log(`Device ${device.id} already disconnected`);
      } else {
        await device.cancelConnection();
        console.log(`Device ${device.id} disconnected`);
      }
      const updatedVerifiedDevices = verifiedDevices.filter(
        (id) => id !== device.id
      );
      setVerifiedDevices(updatedVerifiedDevices);
      await AsyncStorage.setItem(
        "verifiedDevices",
        JSON.stringify(updatedVerifiedDevices)
      );
      console.log(`Device ${device.id} removed from verified devices`);
      stopMonitoringVerificationCode();
      setIsVerificationSuccessful(false);
      console.log("Verification status updated to false");
    } catch (error) {
      if (error.errorCode === "OperationCancelled") {
        console.log(`Disconnection cancelled for device ${device.id}`);
      } else {
        console.log("Error disconnecting device:", error);
      }
    }
  };
  const confirmDisconnect = async () => {
    if (deviceToDisconnect) {
      await handleDisconnectDevice(deviceToDisconnect);
      setConfirmDisconnectModalVisible(false);
      setDeviceToDisconnect(null);
    }
  };

  const cancelDisconnect = () => {
    setConfirmDisconnectModalVisible(false);
    setBleVisible(true);
  };

  const handleCancel = () => {
    setBleVisible(false);
  };
  const handleConfirmDelete = () => {
    setHeaderDropdownVisible(false);
    navigation.navigate("Assets", {
      showDeleteConfirmModal: true,
      isModalVisible: true,
    });
  };

  // 新增：使用工厂函数生成 handleDevicePress
  const handleDevicePress = createHandleDevicePress({
    setReceivedAddresses,
    setVerificationStatus,
    setSelectedDevice,
    setBleVisible,
    monitorVerificationCode,
    setSecurityCodeModalVisible,
    serviceUUID,
    writeCharacteristicUUID,
    Buffer,
  });

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
            const cryptoCards = route.params?.cryptoCards || [];
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
            onPressOut={() => {
              handlePressOut(() => {
                Vibration.vibrate();
                handleBluetoothPairing();
              });
            }}
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
            <BlurView style={styles.centeredView}>
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
        visible={bleVisible}
        devices={devices}
        isScanning={isScanning}
        onDisconnectPress={handleDisconnectPress}
        handleDevicePress={handleDevicePress}
        onCancel={handleCancel}
        verifiedDevices={verifiedDevices}
        onRefreshPress={() => {
          setDevices([]);
          scanDevices({ isScanning, setIsScanning, bleManagerRef, setDevices });
        }}
      />
      {/* PIN Modal */}
      <SecurityCodeModal
        visible={SecurityCodeModalVisible}
        pinCode={pinCode}
        setPinCode={setPinCode}
        onSubmit={handlePinSubmitProxy}
        onCancel={() => {
          setSecurityCodeModalVisible(false);
          setVerificationStatus(null);
        }}
        status={verificationStatus}
      />
      {/* Verification Modal */}
      <CheckStatusModal
        visible={CheckStatusModalVisible && verificationStatus !== null}
        status={verificationStatus}
        missingChains={missingChainsForModal}
        onClose={() => setCheckStatusModalVisible(false)}
        progress={
          verificationStatus === "waiting"
            ? Object.keys(receivedAddresses).length /
              Object.keys(prefixToShortName).length
            : undefined
        }
      />
      <ConfirmDisconnectModal
        visible={confirmDisconnectModalVisible}
        onConfirm={confirmDisconnect}
        onCancel={cancelDisconnect}
      />
      {__DEV__ && <FloatingDev />}
    </View>
  );
}
