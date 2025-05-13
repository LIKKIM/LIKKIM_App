// App.js
import { TextEncoder, TextDecoder } from "text-encoding";
if (typeof global.TextEncoder === "undefined") global.TextEncoder = TextEncoder;
if (typeof global.TextDecoder === "undefined") global.TextDecoder = TextDecoder;
import "intl-pluralrules";
import React, { useContext, useEffect, useState } from "react";
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
import DeviceDisplay from "./components/SecureDeviceScreen/DeviceDisplay";
import SupportPage from "./components/SecureDeviceScreen/SupportPage";
import { CryptoProvider, DeviceContext } from "./utils/DeviceContext";
import i18n from "./config/i18n";
import * as SplashScreen from "expo-splash-screen";

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
    //  setModalVisible(true);
    // scanDevices();
  };
  // Handle press in animation (scale down)
  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.8, // Scale down to 0.8
      duration: 100, // Duration of the scale animation
      useNativeDriver: true,
    }).start();
  };

  // Handle press out animation (scale back to 1)
  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1, // Scale back to normal
      duration: 100, // Duration of the scale animation
      useNativeDriver: true,
    }).start();
  };

  const { isAppLaunching, cryptoCards } = useContext(DeviceContext);
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

  const theme = isDarkMode ? darkTheme : lightTheme;
  const tabBarActiveTintColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const tabBarInactiveTintColor = isDarkMode ? "#ffffff50" : "#676776";
  const headerTitleColor = isDarkMode ? "#ffffff" : "#333333";
  const tabBarBackgroundColor = isDarkMode ? "#22201F" : "#fff";
  const bottomBackgroundColor = isDarkMode ? "#0E0D0D" : "#EDEBEF";
  const iconColor = isDarkMode ? "#ffffff" : "#000000";

  const handleConfirmDelete = () => {
    setHeaderDropdownVisible(false);
    navigation.navigate("Assets", {
      showDeleteConfirmModal: true,
      isModalVisible: true,
    });
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
    </View>
  );
}
