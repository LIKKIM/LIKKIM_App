// TabModal.js
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  Modal,
  Dimensions,
  RefreshControl,
} from "react-native";
import PriceChartCom from "../VaultScreen/PriceChartCom";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { accountAPI } from "../../env/apiEndpoints";

const TabModal = ({
  activeTab,
  setActiveTab,
  closeModal,
  VaultScreenStyle,
  t,
  tabOpacity,
  scrollViewRef,
  selectedCrypto,
  isDarkMode,
  backgroundAnim,
  darkColorsDown,
  lightColorsDown,
  mainColor, // 新增
  secondaryColor, // 新增
}) => {
  const [ActivityLog, setActivityLog] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [historyRefreshing, setHistoryRefreshing] = useState(false);
  const onHistoryRefresh = async () => {
    setHistoryRefreshing(true);
    try {
      const response = await fetch(accountAPI.queryTransaction, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chain: selectedCrypto.queryChainName,
          address: selectedCrypto.address,
          page: 1,
          pageSize: 10,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.msg !== "success") {
        setActivityLog([]);
      } else {
        const enhancedData = data.data.map((transaction) => ({
          ...transaction,
          transactionType:
            transaction.from === selectedCrypto.address ? "Send" : "Receive",
          state: transaction.state,
          amount: transaction.amount,
          address: transaction.address,
          fromAddress: transaction.fromAddress,
          toAddress: transaction.toAddress,
          symbol: transaction.symbol,
          transactionTime: transaction.transactionTime,
        }));

        setActivityLog(enhancedData);
        AsyncStorage.setItem("ActivityLog", JSON.stringify(enhancedData));
      }
    } catch (error) {
      setActivityLog([]);
    }
    setHistoryRefreshing(false);
  };

  useEffect(() => {
    // 打印色值
    if (mainColor && secondaryColor) {
      console.log("TabModal接收到的主色:", mainColor, "副色:", secondaryColor);
    }
    const fetchActivityLog = async () => {
      if (selectedCrypto && activeTab === "History") {
        try {
          const response = await fetch(accountAPI.queryTransaction, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              chain: selectedCrypto.queryChainName,
              address: selectedCrypto.address,
              page: 1,
              pageSize: 10,
            }),
          });

          const data = await response.json();

          if (!response.ok || data.msg !== "success") {
            console.log(
              `Tab页行情数据API Error: HTTP status: ${response.status}, Message: ${data.msg}`
            );
            setActivityLog([]);
          } else {
            const enhancedData = data.data.map((transaction) => ({
              ...transaction,
              transactionType:
                transaction.from === selectedCrypto.address
                  ? "Send"
                  : "Receive",
              state: transaction.state,
              amount: transaction.amount,
              address: transaction.address,
              fromAddress: transaction.fromAddress,
              toAddress: transaction.toAddress,
              symbol: transaction.symbol,
              transactionTime: transaction.transactionTime,
            }));

            setActivityLog(enhancedData);
            AsyncStorage.setItem("ActivityLog", JSON.stringify(enhancedData));
          }
        } catch (error) {
          // console.error(
          //   `Failed to fetch transaction history: ${error.message}`
          // );
          setActivityLog([]);
        }
      }
    };

    fetchActivityLog();
  }, [selectedCrypto, activeTab]);

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const closeTransactionModal = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };
  const { height, width } = Dimensions.get("window");

  // 用于色值球动画
  const leftAnim = useRef(new Animated.Value(width * 0.3)).current; // 初始30%
  const rightAnim = useRef(new Animated.Value(width * 0.0)).current; // 初始0%
  // 新增：上下动画
  const leftBottomAnim = useRef(new Animated.Value(0)).current;
  const rightBottomAnim = useRef(new Animated.Value(0)).current;

  // 互斥动画递归
  useEffect(() => {
    let isMounted = true;
    const minDistance = 100; // 最小距离，单位px，可根据需要调整

    // left球在左半区（-20%~50%），right球在右半区（-10%~30%）
    function getRandomLeft() {
      return width * (-0.2 + 0.7 * Math.random());
    }
    function getRandomRight() {
      return width * (-0.1 + 0.4 * Math.random());
    }
    // 新增：上下动画目标
    function getRandomBottom() {
      return height * (0 + 0.05 * Math.random());
    }

    function animateLeft() {
      if (!isMounted) return;
      let target;
      let tryCount = 0;
      do {
        target = getRandomLeft();
        tryCount++;
        // rightAnim._value 可能未定义，需用rightAnim.__getValue()
        const rightValue = rightAnim.__getValue
          ? rightAnim.__getValue()
          : rightAnim._value;
        if (
          typeof rightValue === "number" &&
          width - target - rightValue > minDistance
        )
          break;
      } while (tryCount < 10);
      Animated.timing(leftAnim, {
        toValue: target,
        duration: 4000 + Math.random() * 2000,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(animateLeft, 0);
      });
    }

    function animateRight() {
      if (!isMounted) return;
      let target;
      let tryCount = 0;
      do {
        target = getRandomRight();
        const leftValue = leftAnim.__getValue
          ? leftAnim.__getValue()
          : leftAnim._value;
        tryCount++;
        if (
          typeof leftValue === "number" &&
          width - leftValue - target > minDistance
        )
          break;
      } while (tryCount < 10);
      Animated.timing(rightAnim, {
        toValue: target,
        duration: 4000 + Math.random() * 2000,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(animateRight, 0);
      });
    }

    // 新增：上下动画递归
    function animateLeftBottom() {
      if (!isMounted) return;
      const target = getRandomBottom();
      Animated.timing(leftBottomAnim, {
        toValue: target,
        duration: 4000 + Math.random() * 2000,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(animateLeftBottom, 0);
      });
    }
    function animateRightBottom() {
      if (!isMounted) return;
      const target = getRandomBottom();
      Animated.timing(rightBottomAnim, {
        toValue: target,
        duration: 4000 + Math.random() * 2000,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(animateRightBottom, 0);
      });
    }

    animateLeft();
    animateRight();
    animateLeftBottom();
    animateRightBottom();
    return () => {
      isMounted = false;
    };
  }, [width, height, leftAnim, rightAnim, leftBottomAnim, rightBottomAnim]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "History":
        return (
          <>
            <Text style={VaultScreenStyle.historyTitle}>
              {t("Activity Log")}
            </Text>
            <View
              style={{
                height: 292,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ScrollView
                style={VaultScreenStyle.historyList}
                refreshControl={
                  <RefreshControl
                    refreshing={historyRefreshing}
                    onRefresh={onHistoryRefresh}
                    progressViewOffset={-20}
                  />
                }
              >
                <View
                  style={{
                    position: "absolute",
                    top: -30,
                    left: 0,
                    right: 0,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: isDarkMode ? "#fff" : "#888" }}>
                    {historyRefreshing
                      ? t("Refreshing…")
                      : t("Pull down to refresh")}
                  </Text>
                </View>
                {ActivityLog.length === 0 ? (
                  <View
                    style={{
                      height: 292,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={VaultScreenStyle.noHistoryText}>
                      {t("No Histories")}
                    </Text>
                  </View>
                ) : (
                  ActivityLog.filter((transaction) => {
                    const amount = parseFloat(transaction.amount);
                    return !isNaN(amount) && amount !== 0;
                  }).map((transaction, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => openTransactionModal(transaction)}
                      >
                        <View
                          style={[
                            {
                              borderRadius: 10,
                              backgroundColor:
                                transaction.state.toLowerCase() === "success"
                                  ? "rgba(71, 180, 128, 0.05)"
                                  : "rgba(210, 70, 75, 0.05)",
                              borderLeftWidth: 3,
                              borderLeftColor:
                                transaction.state.toLowerCase() === "success"
                                  ? "#47B480"
                                  : "#D2464B",
                              marginVertical: 4,
                              padding: 10,
                            },
                          ]}
                        >
                          <Text style={VaultScreenStyle.historyItemText}>
                            {`${new Date(
                              Number(transaction.transactionTime)
                            ).toLocaleString()}`}
                          </Text>

                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={[
                                VaultScreenStyle.historyItemText,
                                { fontSize: 16, fontWeight: "bold" },
                              ]}
                            >
                              {transaction.transactionType === "Send"
                                ? t("Send")
                                : t("Receive")}
                              {"  "}
                              <Text
                                style={{
                                  color:
                                    transaction.state.toLowerCase() ===
                                    "success"
                                      ? "#47B480"
                                      : "#D2464B",
                                  fontWeight: "normal",
                                }}
                              >
                                {transaction.state}
                              </Text>
                            </Text>

                            <Text
                              style={[
                                VaultScreenStyle.historyItemText,
                                { fontSize: 16, fontWeight: "bold" },
                              ]}
                            >
                              {transaction.amount} {`${transaction.symbol}`}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </ScrollView>
            </View>
          </>
        );
      case "Prices":
        return (
          <View style={VaultScreenStyle.priceContainer}>
            <PriceChartCom
              instId={`${selectedCrypto?.shortName}-USD`}
              priceFla="$"
              parentScrollviewRef={scrollViewRef}
            />
          </View>
        );
      default:
        return null;
    }
  };

  // 缩放动画state
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 0,
    }).start();
  };

  return (
    <>
      <Animated.View
        style={[VaultScreenStyle.cardModalView, { opacity: backgroundAnim }]}
      >
        {/* 色值球 */}

        {Platform.OS === "ios" && (
          <View
            style={{
              width: "100%",
              height: "100%",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 3,
              position: "relative",
            }}
          >
            <Animated.View
              style={{
                position: "absolute",
                bottom: leftBottomAnim,
                left: leftAnim,
                width: "40%",
                height: "20%",
                borderRadius: 100,
                backgroundColor: mainColor,
                opacity: 0.4,
                marginBottom: "-12%",
              }}
            />
            <Animated.View
              style={{
                position: "absolute",
                bottom: rightBottomAnim,
                right: rightAnim,
                width: "80%",
                height: "30%",
                borderRadius: 100,
                backgroundColor: secondaryColor,
                opacity: 0.1,
                marginBottom: "-8%",
              }}
            />
            <BlurView
              style={{
                position: "absolute",
                bottom: 0,
                top: 0,
                left: 0,
                right: 0,
                borderRadius: 30,
                zIndex: 3,
                opacity: 1,
              }}
              intensity={100}
              tint={isDarkMode ? "dark" : "light"}
              pointerEvents="none"
            />
          </View>
        )}
        <LinearGradient
          colors={isDarkMode ? darkColorsDown : lightColorsDown}
          style={[VaultScreenStyle.cardModalView]}
        />
      </Animated.View>

      {/* Tab Modal Animated Container */}
      <Animated.View
        style={[
          VaultScreenStyle.animatedTabContainer,
          { opacity: tabOpacity },
          {
            marginTop:
              Platform.OS === "android" ||
              (Platform.OS === "ios" && height < 700)
                ? -30
                : 0,
          },
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <TouchableOpacity
            style={[
              VaultScreenStyle.tabButton,
              activeTab === "Prices" && VaultScreenStyle.activeTabButton,
            ]}
            onPress={() => setActiveTab("Prices")}
          >
            <Text
              style={[
                VaultScreenStyle.tabButtonText,
                activeTab === "Prices" && VaultScreenStyle.activeTabButtonText,
              ]}
            >
              {t("Prices")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              VaultScreenStyle.tabButton,
              activeTab === "History" && VaultScreenStyle.activeTabButton,
            ]}
            onPress={() => setActiveTab("History")}
          >
            <Text
              style={[
                VaultScreenStyle.tabButtonText,
                activeTab === "History" && VaultScreenStyle.activeTabButtonText,
              ]}
            >
              {t("History")}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1 }}>{renderTabContent()}</View>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={VaultScreenStyle.cancelButtonCardItem}
            onPress={closeModal}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
          >
            <Text style={VaultScreenStyle.cancelButtonText}>{t("Close")}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* Transaction Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgrounrdColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: isDarkMode ? "#3F3D3C" : "#fff",
              padding: 20,
              borderRadius: 10,
              width: 324,
              maxHeight: "80%",
            }}
          >
            <View
              style={{
                flexDirection: "row", // 水平排列
                justifyContent: "space-between", // 左右两端对齐
                alignItems: "center", // 垂直居中
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#000",
                }}
              >
                {selectedTransaction?.transactionType === "Send"
                  ? t("Send")
                  : t("Receive")}
                {"  "}
                <Text
                  style={{
                    color:
                      selectedTransaction?.state.toLowerCase() === "success"
                        ? "#47B480"
                        : "#D2464B",
                    fontWeight: "normal",
                  }}
                >
                  {selectedTransaction?.state}
                </Text>
              </Text>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#000",
                }}
              >
                {selectedTransaction?.amount} {`${selectedTransaction?.symbol}`}
              </Text>
            </View>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#fff" : "#000",
                marginBottom: 10,
              }}
            >
              {`${new Date(
                Number(selectedTransaction?.transactionTime)
              ).toLocaleString()}`}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#fff" : "#000",
                marginBottom: 10,
                lineHeight: 24,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>From: </Text>
              {selectedTransaction?.fromAddress}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#fff" : "#000",
                marginBottom: 10,
                lineHeight: 24,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>To: </Text>
              {selectedTransaction?.toAddress}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#fff" : "#000",
                marginBottom: 10,
                lineHeight: 24,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Transaction hash: </Text>
              {selectedTransaction?.txid}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#fff" : "#000",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Network Fee: </Text>
              {selectedTransaction?.txFee}
            </Text>

            <Text
              style={{
                fontSize: 16,
                color: isDarkMode ? "#fff" : "#000",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontWeight: "bold" }}>Block Height: </Text>
              {selectedTransaction?.height}
            </Text>

            <TouchableOpacity
              onPress={closeTransactionModal}
              style={{
                borderWidth: 2,
                borderColor: isDarkMode ? "#CCB68C" : "#CFAB95",
                padding: 10,
                width: 292,
                justifyContent: "center",
                borderRadius: 30,
                height: 60,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: isDarkMode ? "#CCB68C" : "#CFAB95",
                  fontSize: 16,
                }}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default TabModal;
