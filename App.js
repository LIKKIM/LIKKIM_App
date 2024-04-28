import React, { useState } from "react";
import {
  Modal,
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "./styles";
import WalletScreen from "./components/WalletScreen";
import TransactionsScreen from "./components/TransactionsScreen";
import MyColdWalletScreen from "./components/MyColdWalletScreen";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
// 页面组件

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
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
              const label =
                route.name === "Wallet"
                  ? "Wallet"
                  : route.name === "Transactions"
                  ? "Transactions"
                  : "My Cold Wallet";
              return (
                <Text style={{ color: focused ? "#ffffff" : "#ffffff50" }}>
                  {label}
                </Text>
              );
            },
            tabBarActiveTintColor: "#ffffff",
            tabBarInactiveTintColor: "#ffffff50",
            tabBarStyle: {
              // backgroundColor: "transparent",
              backgroundColor: "#23224D",
              //  borderTopColor: "#373737",
              borderTopWidth: 0,
              height: 60,
              borderTopLeftRadius: 22, // 设置左上角圆角
              borderTopRightRadius: 22, // 设置右上角圆角
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
            headerStyle: {
              backgroundColor: "#24234C", // 设置头部的背景颜色
              borderBottomColor: "#424242", // 设置边框颜色为深灰色
              borderBottomWidth: 0, // 确保边框宽度为1，如果原来没有边框需要添加这一行
            },
            headerTintColor: "#e0e0e0", // 设置头部标题和按钮的颜色
            headerTitleStyle: {
              fontWeight: "bold", // 设置头部标题的字体加粗
            },
          })}
        >
          <Tab.Screen
            name="Wallet"
            component={WalletScreen}
            options={{
              headerRight: () => (
                <TouchableOpacity
                  onPress={() => console.log("Add new item")}
                  style={{
                    marginRight: 16, // 添加适当的外边距
                    borderRadius: 14, // 设置圆形边框的半径
                    width: 28, // 按钮宽度
                    height: 28, // 按钮高度
                    justifyContent: "center", // 垂直居中图标
                    alignItems: "center", // 水平居中图标
                    backgroundColor: "#24234C", // 按钮背景色
                  }}
                >
                  <Icon name="add" size={24} color="#ffffff" />
                </TouchableOpacity>
              ),
            }}
          />
          <Tab.Screen name="Transactions" component={TransactionsScreen} />
          <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}
