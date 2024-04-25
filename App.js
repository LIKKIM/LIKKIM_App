import React from "react";
import { StatusBar } from "expo-status-bar";
import {
  Button,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

// 页面组件
function WalletScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.cardText}>Bitcoin</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>Ethereum</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardText}>USDT</Text>
      </View>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Add Account Pressed")}
      >
        <Text style={styles.buttonText}>Add Account</Text>
      </TouchableOpacity>
    </View>
  );
}
function TransactionsScreen() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Receive Pressed")}
      >
        <Text style={styles.buttonText}>Receive</Text>
        <Text style={styles.subButtonText}>
          Receive crypto from another wallet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Buy Pressed")}
      >
        <Text style={styles.buttonText}>Buy</Text>
        <Text style={styles.subButtonText}>Buy crypto securely with cash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Sell Pressed")}
      >
        <Text style={styles.buttonText}>Sell</Text>
        <Text style={styles.subButtonText}>Sell crypto securely for cash</Text>
      </TouchableOpacity>
    </View>
  );
}

function MyColdWalletScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.titleText}>Bluetooth</Text>
      <TouchableOpacity
        style={styles.roundButton}
        onPress={() => console.log("Pairing with Bluetooth")}
      >
        <Text style={styles.buttonText}>Pair with Bluetooth</Text>
      </TouchableOpacity>
    </View>
  );
}

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
                iconName = focused
                  ? "account-balance-wallet"
                  : "account-balance-wallet";
              } else if (route.name === "Transactions") {
                iconName = focused ? "swap-horiz" : "swap-horiz";
              } else if (route.name === "My Cold Wallet") {
                iconName = focused ? "bluetooth" : "bluetooth";
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
                <Text style={{ color: focused ? "#e0e0e0" : "gray" }}>
                  {label}
                </Text>
              );
            },
          })}
          tabBarOptions={{
            activeTintColor: "#e0e0e0", // 设置活动标签的文字颜色为浅灰色
            inactiveTintColor: "gray", // 设置非活动标签的文字颜色为灰色
            style: {
              backgroundColor: "#121212", // 设置底部导航栏的背景颜色为深色
              borderTopColor: "#373737", // 设置顶部边界颜色
              borderTopWidth: 1, // 确保边界线可见
              height: 60, // 可以调整tab栏的高度
            },
            labelStyle: {
              fontSize: 12, // 设置标签字体大小
            },
          }}
        >
          <Tab.Screen name="Wallet" component={WalletScreen} />
          <Tab.Screen name="Transactions" component={TransactionsScreen} />
          <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212", // 深灰色背景
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#121212", // 深灰色背景
  },
  card: {
    width: 300,
    height: 100,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e1e1e", // 较浅的灰色
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: "white", // 白色文字
    fontSize: 16, // 可以设置需要的文字大小
  },
  roundButton: {
    backgroundColor: "#373737", // 灰色按钮
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: 250, // 调整宽度以适应文本
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 16,
    fontWeight: "bold",
  },
  titleText: {
    color: "white", // 白色文字
    fontSize: 24, // 增加字体大小
    fontWeight: "bold", // 加粗文字
    marginBottom: 20,
  },
  subButtonText: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 12,
  },
  buttonText: {
    color: "#e0e0e0", // 浅灰色文字
    fontSize: 16,
  },
  button: {
    marginBottom: 20,
    alignItems: "center",
  },
});
