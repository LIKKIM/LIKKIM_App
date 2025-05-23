// App.js
import "intl-pluralrules";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Modal } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

import styles, { darkTheme, lightTheme } from "./styles";
import WalletScreen from "./components/WalletScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import MyColdWalletScreen from "./components/MyColdWalletScreen";
import OnboardingScreen from "./utils/OnboardingScreen";
import ScreenLock from "./utils/ScreenLock";
import FindMyLikkim from "./components/MyColdWalletScreen/FindMyLikkim";
import SupportPage from "./components/MyColdWalletScreen/SupportPage";
import ConnectLIKKIMAuth from "./components/TransactionScreens/ConnectLIKKIMAuth";
import { CryptoProvider, CryptoContext } from "./utils/CryptoContext";
import i18n from "./config/i18n";

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [headerDropdownVisible, setHeaderDropdownVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState("");

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

  // Handle completion of onboarding
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
              name="Find My LIKKIM"
              component={FindMyLikkim}
              options={{ title: t("Find My LIKKIM") }}
            />
            <Stack.Screen
              name="Request Wallet Auth"
              component={ConnectLIKKIMAuth}
              options={{
                title: "Transaction Confirmation",
                headerShadowVisible: false,
              }}
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
      <StatusBar backgroundColor="#21201E" barStyle="light-content" />
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
  const { isAppLaunching } = useContext(CryptoContext);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load dark mode value on mount
  useEffect(() => {
    AsyncStorage.getItem("darkMode")
      .then((value) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsDarkMode(parsedValue);
          console.log("Loaded darkMode value:", parsedValue);
        }
      })
      .catch((error) => console.error("Failed to read darkMode", error));
  }, []);

  // Refresh dark mode value from AsyncStorage
  const refreshDarkMode = () => {
    AsyncStorage.getItem("darkMode")
      .then((value) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setIsDarkMode(parsedValue);
          console.log("Refreshed darkMode:", parsedValue);
        }
      })
      .catch((error) => console.error("Failed to refresh darkMode", error));
  };

  const navigation = useNavigation();
  const [walletModalVisible, setWalletModalVisible] = useState(false);
  const [screenLockFeatureEnabled, setScreenLockFeatureEnabled] =
    useState(false);
  const [isScreenLockLoaded, setIsScreenLockLoaded] = useState(false);

  // Listen for navigation state changes to update wallet modal visibility
  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      const rootRoutes = e.data.state?.routes;
      const backRoute = rootRoutes?.find((route) => route.name === "Back");
      if (backRoute && backRoute.state) {
        const tabRoutes = backRoute.state.routes;
        const walletRoute = tabRoutes.find((route) => route.name === "Wallet");
        if (walletRoute?.params?.isModalVisible !== undefined) {
          setWalletModalVisible(walletRoute.params.isModalVisible);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Load screen lock feature flag from AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("screenLockFeatureEnabled")
      .then((value) => {
        if (value !== null) {
          const parsedValue = JSON.parse(value);
          setScreenLockFeatureEnabled(parsedValue);
          console.log("Loaded screenLockFeatureEnabled:", parsedValue);
        } else {
          console.log("screenLockFeatureEnabled is not set in AsyncStorage");
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
    navigation.navigate("Wallet", {
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
            if (route.name === "Wallet") {
              iconName = "account-balance-wallet";
            } else if (route.name === "Transactions") {
              iconName = "swap-horiz";
            } else if (route.name === "My Cold Wallet") {
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
            if (route.name === "Wallet") label = t("Wallet");
            else if (route.name === "Transactions") label = t("Transactions");
            else if (route.name === "My Cold Wallet")
              label = t("My Cold Wallet");
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
          name="Wallet"
          component={WalletScreen}
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
                          navigation.navigate("Wallet", { showAddModal: true })
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
        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="My Cold Wallet">
          {(props) => (
            <MyColdWalletScreen {...props} onDarkModeChange={refreshDarkMode} />
          )}
        </Tab.Screen>
      </Tab.Navigator>
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
