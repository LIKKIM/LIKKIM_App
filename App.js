import React, { useContext } from "react";
import { View, Text, TouchableOpacity, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";
import WalletScreen from "./components/WalletScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import MyColdWalletScreen from "./components/MyColdWalletScreen";
import { CryptoProvider, CryptoContext } from "./components/CryptoContext"; // 导入 CryptoContext
import i18n from "./config/i18n";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

export default function App() {
  const { t } = useTranslation();
  return (
    <CryptoProvider>
      <View style={styles.safeArea}>
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
                return <Icon name={iconName} size={size} color={color} />;
              },
              tabBarLabel: ({ focused }) => {
                let label;
                if (route.name === "Wallet") {
                  label = t("Wallet");
                } else if (route.name === "Transactions") {
                  label = t("Transactions");
                } else if (route.name === "My Cold Wallet") {
                  label = t("MyColdWallet");
                }
                return (
                  <Text style={{ color: focused ? "#ffffff" : "#ffffff50" }}>
                    {label}
                  </Text>
                );
              },
              tabBarActiveTintColor: "#ffffff",
              tabBarInactiveTintColor: "#ffffff50",
              tabBarStyle: {
                backgroundColor: "#23224D",
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
                backgroundColor: "#24234C",
                borderBottomColor: "#424242",
                borderBottomWidth: 0,
              },
              headerTintColor: "#e0e0e0",
              headerTitleStyle: {
                fontWeight: "bold",
              },
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
                        navigation.navigate("Wallet", { showAddModal: true })
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
            <Tab.Screen name="Transactions" component={TransactionsScreen} />
            <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
          </Tab.Navigator>
        </NavigationContainer>
        <StatusBar style="light" />
      </View>
    </CryptoProvider>
  );
}
