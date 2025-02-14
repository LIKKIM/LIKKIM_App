// App.js
import "intl-pluralrules";
import React, { useContext, useEffect, useState } from "react";
import {
  Vibration,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Modal,
} from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { darkTheme, lightTheme } from "./styles";
import WalletScreen from "./components/WalletScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import MyColdWalletScreen from "./components/MyColdWalletScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import ScreenLock from "./components/ScreenLock";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import FindMyLkkim from "./components/FindMyLkkim";
import SupportPage from "./components/SupportPage";
import {
  CryptoProvider,
  CryptoContext,
  DarkModeContext,
} from "./components/CryptoContext";
import i18n from "./config/i18n";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import ConnectLIKKIMAuth from "./components/transactionScreens/ConnectLIKKIMAuth";

// Configure Reactotron in development mode
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

  // Check if the app is launched for the first time using AsyncStorage
  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true");
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    });
  }, []);

  // Callback to handle when onboarding is completed
  const handleOnboardingDone = () => {
    setIsFirstLaunch(false);
  };

  // Render nothing until we know if this is the first launch
  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return (
      <CryptoProvider>
        <OnboardingApp handleOnboardingDone={handleOnboardingDone} />
      </CryptoProvider>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CryptoProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {/* Main application content is wrapped in a Stack screen called "Back" */}
            <Stack.Screen name="Back" options={{ headerShown: false }}>
              {(props) => (
                <AppContent
                  {...props}
                  t={t} // Pass the i18n translation function
                  headerDropdownVisible={headerDropdownVisible}
                  setHeaderDropdownVisible={setHeaderDropdownVisible}
                  selectedCardName={selectedCardName}
                  setSelectedCardName={setSelectedCardName}
                />
              )}
            </Stack.Screen>

            {/* Screen for finding a LIKKIM device */}
            <Stack.Screen
              name="Find My LIKKIM"
              component={FindMyLkkim}
              options={{
                title: t("Find My LIKKIM"), // Internationalized title
              }}
            />

            {/* Screen for wallet authentication */}
            <Stack.Screen
              name="Request Wallet Auth"
              options={{
                title: "Transaction Confirmation",
                headerShadowVisible: false,
              }}
              component={ConnectLIKKIMAuth}
            />

            {/* Support page screen */}
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
 * OnboardingApp component that shows the onboarding screen.
 * It is rendered only when the app is launched for the first time.
 */
function OnboardingApp({ handleOnboardingDone }) {
  const { isDarkMode } = useContext(DarkModeContext);

  // TODO: Remove debug code for intro screen if not needed.
  return (
    <>
      <StatusBar backgroundColor="#21201E" barStyle="light-content" />
      <OnboardingScreen onDone={handleOnboardingDone} />
    </>
  );
}

/**
 * AppContent component holds the main content of the app (Tabs and screens).
 */
function AppContent({
  t,
  headerDropdownVisible,
  setHeaderDropdownVisible,
  selectedCardName,
  setSelectedCardName,
}) {
  const { isScreenLockEnabled, isAppLaunching } = useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const [walletModalVisible, setWalletModalVisible] = useState(false);

  /*   // Log the screen lock status when it changes
  useEffect(() => {
    console.log("isScreenLockEnabled:", isScreenLockEnabled);
  }, [isScreenLockEnabled]); */

  // Function to handle card deletion confirmation
  const handleConfirmDelete = () => {
    setHeaderDropdownVisible(false);
    navigation.navigate("Wallet", {
      showDeleteConfirmModal: true,
      isModalVisible: true, // Set modal visibility to true
    });
  };

  // Set up theme and styling based on dark mode
  const theme = isDarkMode ? darkTheme : lightTheme;
  const tabBarActiveTintColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const tabBarInactiveTintColor = isDarkMode ? "#ffffff50" : "#676776";
  const headerTitleColor = isDarkMode ? "#ffffff" : "#333333";
  const tabBarBackgroundColor = isDarkMode ? "#22201F" : "#fff";
  const bottomBackgroundColor = isDarkMode ? "#0E0D0D" : "#EDEBEF";
  const iconColor = isDarkMode ? "#ffffff" : "#000000";

  // Listen for navigation state changes to update wallet modal visibility
  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      // Get the routes from the navigation state
      const rootRoutes = e.data.state?.routes;

      // Find the "Back" route and check its nested routes
      const backRoute = rootRoutes?.find((route) => route.name === "Back");
      if (backRoute && backRoute.state) {
        const tabRoutes = backRoute.state.routes;
        const walletRoute = tabRoutes.find((route) => route.name === "Wallet");
        if (walletRoute?.params?.isModalVisible !== undefined) {
          /*           console.log(
            "isModalVisible parameter:",
            walletRoute.params.isModalVisible
          ); */
          setWalletModalVisible(walletRoute.params.isModalVisible);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  // Conditionally render the ScreenLock component during app launch if enabled
  if (isScreenLockEnabled && isAppLaunching) {
    return <ScreenLock />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: bottomBackgroundColor }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          lazy: false,
          tabBarIcon: ({ focused, color, size }) => {
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
            if (route.name === "Wallet") {
              label = t("Wallet");
            } else if (route.name === "Transactions") {
              label = t("Transactions");
            } else if (route.name === "My Cold Wallet") {
              label = t("My Cold Wallet");
            }
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
          tabBarActiveTintColor: tabBarActiveTintColor,
          tabBarInactiveTintColor: tabBarInactiveTintColor,
          tabBarStyle: {
            backgroundColor: tabBarBackgroundColor,
            borderTopWidth: 0,
            height: walletModalVisible ? 0 : 100, // Hide tab bar if wallet modal is visible
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
        {/* Wallet Screen */}
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={({ route, navigation }) => {
            const cryptoCards = route.params?.cryptoCards || [{}];
            return {
              headerRight: () => {
                // Retrieve modal visibility from route parameters
                const isModalVisible = route.params?.isModalVisible;
                return (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {isModalVisible ? (
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
                            navigation.navigate("Wallet", {
                              showAddModal: true,
                            })
                          }
                          style={{ paddingRight: 28 }}
                        >
                          <Icon name="add" size={24} color={iconColor} />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                );
              },
            };
          }}
        />

        {/* Transactions Screen */}
        <Tab.Screen name="Transactions" component={TransactionsScreen} />

        {/* My Cold Wallet Screen */}
        <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
      </Tab.Navigator>

      <StatusBar
        backgroundColor={isDarkMode ? "#21201E" : "#FFFFFF"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* Header dropdown modal for additional settings/actions */}
      {headerDropdownVisible && (
        <Modal
          animationType="fade"
          transparent={true}
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
