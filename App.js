// App.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles, { darkTheme, lightTheme } from "./styles";
import WalletScreen from "./components/WalletScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import MyColdWalletScreen from "./components/MyColdWalletScreen";
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

  return (
    <CryptoProvider>
      <View style={styles.safeArea}>
        <DarkModeContext.Consumer>
          {({ isDarkMode }) => {
            const theme = isDarkMode ? darkTheme : lightTheme;
            const tabBarActiveTintColor = isDarkMode ? "#ffffff" : "#000000";
            const tabBarInactiveTintColor = isDarkMode
              ? "#ffffff50"
              : "#666666";
            const headerTitleColor = isDarkMode ? "#ffffff" : "#333333"; // 根据模式设置标题颜色
            const tabBarBackgroundColor = isDarkMode ? "#23224D" : "#ddd"; // 根据模式设置底部tab栏背景颜色
            const bottomBackgroundColor = isDarkMode ? "#101021" : "#E0E0E0"; // 底部背景颜色根据模式变化

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
                              style={{
                                marginRight: 16,
                                borderRadius: 14,
                                width: 28,
                                height: 28,
                                justifyContent: "center",
                                alignItems: "center",
                                backgroundColor: "#24234C",
                              }}
                            >
                              <Icon name="add" size={24} color="#ffffff" />
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
                <StatusBar style="light" />
              </View>
            );
          }}
        </DarkModeContext.Consumer>
      </View>
    </CryptoProvider>
  );
}
