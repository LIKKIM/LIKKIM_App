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
  Button,
  ScrollView,
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
import {
  CryptoProvider,
  CryptoContext,
  DarkModeContext,
} from "./components/CryptoContext";
import i18n from "./config/i18n";
import { useTranslation } from "react-i18next";
import { BlurView } from "expo-blur";
import ConnectLIKKIMAuth from "./components/transactionScreens/ConnectLIKKIMAuth";

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
            <Stack.Screen name="Back" options={{ headerShown: false }}>
              {(props) => (
                <AppContent
                  {...props}
                  t={t} // 传递 i18n 的 t 函数
                  headerDropdownVisible={headerDropdownVisible}
                  setHeaderDropdownVisible={setHeaderDropdownVisible}
                  selectedCardName={selectedCardName}
                  setSelectedCardName={setSelectedCardName}
                />
              )}
            </Stack.Screen>

            <Stack.Screen
              name="Find My LIKKIM"
              component={FindMyLkkim}
              options={{
                title: t("Find My LIKKIM"), // 使用 i18n 进行国际化处理
              }}
            />
            <Stack.Screen
              name="Request Wallet Auth"
              options={{
                title: "Transaction Confirmation",
                headerShadowVisible: false,
              }}
              component={ConnectLIKKIMAuth}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </CryptoProvider>
    </GestureHandlerRootView>
  );
}

function OnboardingApp({ handleOnboardingDone }) {
  const { isDarkMode } = useContext(DarkModeContext); // 获取 isDarkMode

  return (
    <>
      <StatusBar backgroundColor="#21201E" barStyle="light-content" />
      <OnboardingScreen onDone={handleOnboardingDone} />
    </>
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
    selectedChainShortName,
    setSelectedChainShortName,
    isScreenLockEnabled,
    isAppLaunching,
    cryptoCards,
  } = useContext(CryptoContext); // 获取 isAppLaunching 状态

  // 用于控制 Modal 的显示/隐藏
  const [isChainModalVisible, setChainModalVisible] = useState(false);

  const allChains = cryptoCards.map((card) => card.chainShortName);

  // 全选按钮处理
  const handleSelectAll = () => {
    if (selectedChainShortName.length !== allChains.length) {
      setSelectedChainShortName(allChains);
    }
    setChainModalVisible(false);
  };

  // 选择链操作
  const handleChainSelect = (chainName) => {
    if (selectedChainShortName !== chainName) {
      setSelectedChainShortName(chainName);
    }
  };

  const { isDarkMode } = useContext(DarkModeContext);
  const navigation = useNavigation();
  const [walletModalVisible, setWalletModalVisible] = useState(false);

  // 在这里打印 isScreenLockEnabled 的值
  useEffect(() => {
    console.log("isScreenLockEnabled:", isScreenLockEnabled);
  }, [isScreenLockEnabled]); // 当 isScreenLockEnabled 改变时，打印新值

  const handleConfirmDelete = () => {
    setHeaderDropdownVisible(false);
    navigation.navigate("Wallet", {
      showDeleteConfirmModal: true,
      isModalVisible: true, // 设置 isModalVisible 为 true
    });
  };

  const theme = isDarkMode ? darkTheme : lightTheme;
  const tabBarActiveTintColor = isDarkMode ? "#CCB68C" : "#CFAB95";
  const tabBarInactiveTintColor = isDarkMode ? "#ffffff50" : "#676776";
  const headerTitleColor = isDarkMode ? "#ffffff" : "#333333";
  const tabBarBackgroundColor = isDarkMode ? "#22201F" : "#fff";
  const bottomBackgroundColor = isDarkMode ? "#0E0D0D" : "#EDEBEF";
  const iconColor = isDarkMode ? "#ffffff" : "#000000";

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", (e) => {
      // console.log("导航状态详情", e.data.state); // 打印整个导航状态
      const rootRoutes = e.data.state?.routes;
      // console.log("全部路由列表", rootRoutes); // 打印全部路由的列表

      // 查找名为 "Back" 的路由，并进一步检查其嵌套路由
      const backRoute = rootRoutes?.find((route) => route.name === "Back");
      if (backRoute && backRoute.state) {
        // 打印 Back 路由的详细状态
        // console.log("Back 路由状态", backRoute.state);
        const tabRoutes = backRoute.state.routes;
        const walletRoute = tabRoutes.find((route) => route.name === "Wallet");
        // console.log("Wallet 路由:", walletRoute); // 打印 Wallet 路由信息
        if (walletRoute?.params?.isModalVisible !== undefined) {
          console.log(
            "isModalVisible 参数:",
            walletRoute.params.isModalVisible
          );
          setWalletModalVisible(walletRoute.params.isModalVisible);
        }
      }
    });
    return unsubscribe;
  }, [navigation]);

  // 条件渲染 ScreenLock 页面，只有在应用启动时和 ScreenLock 启用时才显示
  if (isScreenLockEnabled && isAppLaunching) {
    return <ScreenLock />;
  }

  const updateSelectedChain = (newChainShortName) => {
    setSelectedChainShortName(newChainShortName);
    navigation.setParams({ selectedChainShortName: newChainShortName }); // 动态更新导航参数
  };
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
          options={({ route, navigation }) => {
            const cryptoCards = route.params?.cryptoCards || [{}];
            const selectedChainShortName = route.params?.selectedChainShortName;
            const showAddIcon = cryptoCards.length > 0;
            const isModalVisible = route.params?.isModalVisible;

            console.log("selectedChainShortName:", selectedChainShortName);

            // 判断是否显示 "Selected Chain" 和 "Add Icon"
            const showChainAndAddIcon = showAddIcon && !isModalVisible;

            return {
              headerRight: () => {
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
                      showChainAndAddIcon && (
                        <TouchableOpacity
                          onPress={() =>
                            navigation.navigate("Wallet", {
                              showAddModal: true,
                            })
                          }
                          style={{ paddingRight: 20 }}
                        >
                          <Icon name="add" size={24} color={iconColor} />
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                );
              },
              headerLeft: () => {
                // 只有当没有显示设置图标时才显示 "Selected Chain"
                if (showChainAndAddIcon && !isModalVisible) {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingLeft: 20,
                      }}
                      onPress={() => setChainModalVisible(true)} // 点击时显示 Modal
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color: isDarkMode ? "white" : "black", // 根据模式设置颜色
                        }}
                      >
                        {Array.isArray(selectedChainShortName) &&
                        selectedChainShortName.every((chain) =>
                          allChains.includes(chain)
                        )
                          ? "All added"
                          : selectedChainShortName}
                      </Text>
                    </TouchableOpacity>
                  );
                }
                return null; // 如果没有显示 "Selected Chain"，返回 null
              },
            };
          }}
        />

        <Tab.Screen name="Transactions" component={TransactionsScreen} />
        <Tab.Screen name="My Cold Wallet" component={MyColdWalletScreen} />
      </Tab.Navigator>

      <StatusBar
        backgroundColor={isDarkMode ? "#21201E" : "#FFFFFF"}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
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

      {/* 选择chain的modal */}
      <Modal
        visible={isChainModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChainModalVisible(false)} // 关闭 Modal
      >
        <BlurView
          intensity={10}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          }}
        >
          <View
            style={{
              margin: 20,
              minHeight: 400,
              width: "90%",
              backgroundColor: isDarkMode ? "#3F3D3C" : "#ffffff",
              borderRadius: 20,
              padding: 35,
              alignItems: "center",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginBottom: 20,
                color: isDarkMode ? "white" : "black", // 根据暗黑模式设置文字颜色
              }}
            >
              {t("Added Chains")}
            </Text>

            {/* 显示所有链选项 */}
            <ScrollView style={{ width: "100%", maxHeight: 300 }}>
              {/* 全选按钮 */}
              <View
                style={{
                  width: "100%",
                  padding: 6,
                  marginBottom: 6,
                  borderRadius: 30,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  fontSize: 14,
                  borderWidth:
                    selectedChainShortName.length === allChains.length ? 2 : 0, // 选中所有时显示边框
                  borderColor:
                    selectedChainShortName.length === allChains.length
                      ? isDarkMode
                        ? "#CCB68C" // 暗黑模式下的边框颜色
                        : "#CFAB95" // 常规模式下的边框颜色
                      : "transparent", // 边框颜色
                }}
              >
                <Text
                  onPress={handleSelectAll}
                  style={{
                    fontSize: 14,
                    color:
                      selectedChainShortName.length === allChains.length
                        ? isDarkMode
                          ? "#CCB68C" // 暗黑模式下按钮颜色
                          : "#CFAB95" // 常规模式下按钮颜色
                        : isDarkMode
                        ? "white" // 暗黑模式下按钮颜色为白色
                        : "black", // 常规模式下按钮颜色为黑色
                    padding: 10,
                    textAlign: "center",
                    borderRadius: 30,
                  }}
                >
                  {t("Select All")}
                </Text>
              </View>

              {/* 显示链列表 */}
              {allChains.map((chain) => (
                <View
                  key={chain}
                  style={{
                    width: "100%",
                    padding: 6,
                    marginBottom: 6,
                    borderRadius: 30,
                    fontSize: 14,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    borderWidth:
                      selectedChainShortName.includes(chain) &&
                      selectedChainShortName.length !== allChains.length
                        ? 2
                        : 0,
                    borderColor:
                      selectedChainShortName.includes(chain) &&
                      selectedChainShortName.length !== allChains.length
                        ? isDarkMode
                          ? "#CCB68C" // 暗黑模式下的边框颜色
                          : "#CFAB95" // 常规模式下的边框颜色
                        : "transparent", // 边框颜色
                  }}
                >
                  <Text
                    onPress={() => {
                      handleChainSelect(chain);
                      setChainModalVisible(false); // 选择后关闭 Modal
                    }}
                    style={{
                      fontSize: 14,
                      color:
                        selectedChainShortName.includes(chain) &&
                        selectedChainShortName.length !== allChains.length
                          ? isDarkMode
                            ? "#CCB68C" // 暗黑模式下按钮颜色
                            : "#CFAB95" // 常规模式下按钮颜色
                          : isDarkMode
                          ? "white" // 暗黑模式下按钮颜色为白色
                          : "black", // 常规模式下按钮颜色为黑色
                      padding: 10,
                      textAlign: "center",
                      borderRadius: 30,
                    }}
                  >
                    {chain}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </BlurView>
      </Modal>
    </View>
  );
}
