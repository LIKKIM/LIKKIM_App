// App.js
import "intl-pluralrules";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { darkTheme, lightTheme } from "./styles";
import WalletScreen from "./components/WalletScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import MyColdWalletScreen from "./components/MyColdWalletScreen";
import OnboardingScreen from "./components/OnboardingScreen";
import {
  CryptoProvider,
  CryptoContext,
  DarkModeContext,
} from "./components/CryptoContext"; // 导入 DarkModeContext
import i18n from "./config/i18n";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem("alreadyLaunched").then((value) => {
      if (value == null) {
        AsyncStorage.setItem("alreadyLaunched", "true"); // No need to wait for `setItem` to finish, although you might want to handle errors
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    }); // Add some error handling, also you can simply do setIsFirstLaunch(!value) if you want to play safe
  }, []);

  const handleOnboardingDone = () => {
    setIsFirstLaunch(false);
  };

  if (isFirstLaunch === null) {
    return null; // Render nothing until the state is set
  } else if (isFirstLaunch === true) {
    return <OnboardingScreen onDone={handleOnboardingDone} />;
  }

  return (
    <CryptoProvider>
      <View style={styles.safeArea}>
        <DarkModeContext.Consumer>
          {({ isDarkMode }) => {
            const theme = isDarkMode ? darkTheme : lightTheme;
            const tabBarActiveTintColor = isDarkMode ? "#ffffff" : "#8E80F0";
            const tabBarInactiveTintColor = isDarkMode
              ? "#ffffff50"
              : "#676776";
            const headerTitleColor = isDarkMode ? "#ffffff" : "#333333"; // 根据模式设置标题颜色
            const tabBarBackgroundColor = isDarkMode ? "#23224D" : "#fff"; // 根据模式设置底部tab栏背景颜色
            const bottomBackgroundColor = isDarkMode ? "#101021" : "#EDEBEF"; // 底部背景颜色根据模式变化
            const iconColor = isDarkMode ? "#ffffff" : "#000000";
            const addIconButtonStyle = isDarkMode
              ? [styles.addIconButtonCommon, styles.addIconButton]
              : [styles.addIconButtonCommon, styles.addIconButton];

            return (
              <View style={{ flex: 1, backgroundColor: bottomBackgroundColor }}>
                <NavigationContainer>
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
                              focused
                                ? tabBarActiveTintColor
                                : tabBarInactiveTintColor
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
                        height: 100,
                        paddingBottom: 30,
                        borderTopLeftRadius: 22,
                        borderTopRightRadius: 22,
                      },
                      tabBarLabelStyle: {
                        fontSize: 12,
                      },
                      headerStyle: {
                        backgroundColor: theme.headerStyle.backgroundColor,
                        borderBottomColor: theme.headerStyle.borderBottomColor,
                        borderBottomWidth: 0,
                      },
                      headerTintColor: theme.headerTintColor,
                      headerTitleStyle: {
                        fontWeight: "bold",
                        color: headerTitleColor, // 动态设置标题颜色
                      },
                      headerTitle: t(route.name),
                      headerShadowVisible: false, // 隐藏顶部栏下方的阴影
                    })}
                  >
                    <Tab.Screen
                      name="Wallet"
                      component={WalletScreen}
                      options={({ navigation }) => ({
                        headerRight: () => {
                          const { cryptoCount } = useContext(CryptoContext);
                          return cryptoCount > 0 ? (
                            <TouchableOpacity
                              onPress={() =>
                                navigation.navigate("Wallet", {
                                  showAddModal: true,
                                })
                              }
                              style={addIconButtonStyle}
                            >
                              <Icon name="add" size={24} color={iconColor} />
                            </TouchableOpacity>
                          ) : null;
                        },
                      })}
                    />
                    <Tab.Screen
                      name="Transactions"
                      component={TransactionsScreen}
                    />
                    <Tab.Screen
                      name="My Cold Wallet"
                      component={MyColdWalletScreen}
                    />
                  </Tab.Navigator>
                </NavigationContainer>
                <StatusBar
                  backgroundColor={isDarkMode ? "#101021" : "#FFFFFF"}
                  style={isDarkMode ? "light" : "dark"}
                />
              </View>
            );
          }}
        </DarkModeContext.Consumer>
      </View>
    </CryptoProvider>
  );
}
