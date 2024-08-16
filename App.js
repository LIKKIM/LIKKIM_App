// App.js
import "intl-pluralrules";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar, Modal } from "react-native";
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
import {
  CryptoProvider,
  CryptoContext,
  DarkModeContext,
} from "./components/CryptoContext";
import i18n from "./config/i18n";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";

if (__DEV__) {
  import("./ReactotronConfig").then(() => console.log("Reactotron Configured"));
}

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);
  const [headerDropdownVisible, setHeaderDropdownVisible] = useState(false);
  const [selectedCardName, setSelectedCardName] = useState("");

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

  const handleOnboardingDone = () => {
    setIsFirstLaunch(false);
  };

  if (isFirstLaunch === null) {
    return null;
  } else if (isFirstLaunch === true) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  return (
    <CryptoProvider>
      <NavigationContainer>
        <AppContent
          t={t}
          headerDropdownVisible={headerDropdownVisible}
          setHeaderDropdownVisible={setHeaderDropdownVisible}
          selectedCardName={selectedCardName}
          setSelectedCardName={setSelectedCardName}
        />
      </NavigationContainer>
    </CryptoProvider>
  );
}

function AppContent({
  t,
  headerDropdownVisible,
  setHeaderDropdownVisible,
  selectedCardName,
  setSelectedCardName,
}) {
  const {
    cryptoCount,
    setCryptoCount,
    addedCryptos,
    setAddedCryptos,
    isScreenLockEnabled,
  } = useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const [walletModalVisible, setWalletModalVisible] = useState(false);

  // 在这里打印 isScreenLockEnabled 的值
  useEffect(() => {
    console.log("isScreenLockEnabled:", isScreenLockEnabled);
  }, [isScreenLockEnabled]); // 当 isScreenLockEnabled 改变时，打印新值

  const handleConfirmDelete = () => {
    setHeaderDropdownVisible(false);
    navigation.navigate("Wallet", { showDeleteConfirmModal: true });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  const tabBarActiveTintColor = isDarkMode ? "#ffffff" : "#8E80F0";
  const tabBarInactiveTintColor = isDarkMode ? "#ffffff50" : "#676776";
  const headerTitleColor = isDarkMode ? "#ffffff" : "#333333";
  const tabBarBackgroundColor = isDarkMode ? "#23224D" : "#fff";
  const bottomBackgroundColor = isDarkMode ? "#101021" : "#EDEBEF";
  const iconColor = isDarkMode ? "#ffffff" : "#000000";

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      if (e.data.state) {
        const currentRoute = e.data.state.routes.find(
          (route) => route.name === "Wallet"
        );
        if (currentRoute?.params?.isModalVisible !== undefined) {
          setWalletModalVisible(currentRoute.params.isModalVisible);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: bottomBackgroundColor }}>
      {isScreenLockEnabled ? (
        <ScreenLock /> // 条件渲染 ScreenLock 页面
      ) : (
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === "Wallet") {
                iconName = "account-balance-wallet";
              } else if (route.name === "Transactions") {
                iconName = "swap-horiz";
              } else if (route.name === "My Cold Wallet") {
                iconName = "bluetooth";
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
              height: walletModalVisible ? 0 : 100, // 根据 walletModalVisible 控制 tabBar 的高度
              paddingBottom: walletModalVisible ? 0 : 30,
              borderTopLeftRadius: 22,
              borderTopRightRadius: 22,
              display: walletModalVisible ? "none" : "flex", // 根据 walletModalVisible 显示或隐藏 tabBar
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
            options={({ route, navigation }) => ({
              headerRight: () => {
                const isModalVisible = route.params?.isModalVisible;
                const showAddModal = route.params?.showAddModal;
                return (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {isModalVisible ? (
                      <TouchableOpacity
                        style={{ paddingRight: 20 }}
                        onPress={() => {
                          setHeaderDropdownVisible(true);
                          setSelectedCardName(route.params?.selectedCardName);
                        }}
                      >
                        <Icon name="settings" size={24} color={iconColor} />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate("Wallet", { showAddModal: true })
                        }
                        style={{ paddingRight: 20 }}
                      >
                        <Icon name="add" size={24} color={iconColor} />
                      </TouchableOpacity>
                    )}
                  </View>
                );
              },
            })}
          />
          <Tab.Screen name="Transactions" component={TransactionsScreen} />
          <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
        </Tab.Navigator>
      )}

      <StatusBar
        backgroundColor={isDarkMode ? "#101021" : "#FFFFFF"}
        style={isDarkMode ? "light" : "dark"}
      />

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
