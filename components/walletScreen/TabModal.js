// TabModal.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import PriceChartCom from "../PriceChartCom";
import { LinearGradient } from "expo-linear-gradient";

const TabModal = ({
  activeTab,
  setActiveTab,
  closeModal,
  WalletScreenStyle,
  t,
  tabOpacity,
  scrollViewRef,
  selectedCrypto,
  isDarkMode,
  fadeAnim,
  darkColorsDown,
  lightColorsDown,
}) => {
  const [transactionHistory, setTransactionHistory] = useState([]);

  useEffect(() => {
    const fetchTransactionHistory = async () => {
      if (selectedCrypto && activeTab === "History") {
        try {
          const response = await fetch(
            "https://bt.likkim.com/meridian/address/queryTransactionList",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                chainShortName: "TRON",
                address: "TN121JdH9t2y7qjuExHrYMdJA5RHJXdaZK",
                protocolType: "token_20",
              }),
            }
          );

          const data = await response.json(); // 尝试解析JSON响应

          console.log("API Response:", data); // 打印API响应

          if (!response.ok || data.msg !== "success") {
            console.error(
              `API Error: HTTP status: ${response.status}, Message: ${data.msg}`
            );
            setTransactionHistory([]); // 清空交易历史
          } else {
            printData(data.data); // 动态打印数据
            setTransactionHistory(data.data); // 更新状态
          }
        } catch (error) {
          console.error(
            `Failed to fetch transaction history: ${error.message}`
          );
          setTransactionHistory([]); // 清空交易历史
        }
      }
    };

    fetchTransactionHistory();
  }, [selectedCrypto, activeTab]);

  // 动态打印数据的函数
  function printData(data) {
    if (Array.isArray(data)) {
      data.forEach((item) => printData(item)); // 对数组的每一项递归
    } else if (typeof data === "object" && data !== null) {
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          console.log(`${key}: `, data[key]); // 打印每个键值对
          printData(data[key]); // 对对象的每个值递归
        }
      }
    } else {
      console.log(data); // 如果是基本类型，直接打印
    }
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "History":
        return (
          <>
            <Text style={WalletScreenStyle.historyTitle}>
              {t("Transaction History")}
            </Text>
            <View style={WalletScreenStyle.historyContainer}>
              {transactionHistory.length === 0 ? (
                <Text style={WalletScreenStyle.noHistoryText}>
                  {t("No Histories")}
                </Text>
              ) : (
                transactionHistory.map((transaction, index) => (
                  <View key={index} style={WalletScreenStyle.historyItem}>
                    <Text style={WalletScreenStyle.historyItemText}>
                      {transaction.detail || transaction.txId}
                    </Text>
                  </View>
                ))
              )}
            </View>
          </>
        );
      case "Prices":
        return (
          <View style={WalletScreenStyle.priceContainer}>
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

  return (
    <>
      <Animated.View
        style={[WalletScreenStyle.cardModalView, { opacity: fadeAnim }]}
      >
        <LinearGradient
          colors={isDarkMode ? darkColorsDown : lightColorsDown}
          style={[WalletScreenStyle.cardModalView]}
        />
      </Animated.View>

      <Animated.View
        style={[
          WalletScreenStyle.animatedTabContainer,
          { opacity: tabOpacity },
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
              WalletScreenStyle.tabButton,
              activeTab === "Prices" && WalletScreenStyle.activeTabButton,
            ]}
            onPress={() => setActiveTab("Prices")}
          >
            <Text
              style={[
                WalletScreenStyle.tabButtonText,
                activeTab === "Prices" && WalletScreenStyle.activeTabButtonText,
              ]}
            >
              {t("Prices")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              WalletScreenStyle.tabButton,
              activeTab === "History" && WalletScreenStyle.activeTabButton,
            ]}
            onPress={() => setActiveTab("History")}
          >
            <Text
              style={[
                WalletScreenStyle.tabButtonText,
                activeTab === "History" &&
                  WalletScreenStyle.activeTabButtonText,
              ]}
            >
              {t("History")}
            </Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}

        <TouchableOpacity
          style={WalletScreenStyle.cancelButtonCryptoCard}
          onPress={closeModal}
        >
          <Text style={WalletScreenStyle.cancelButtonText}>{t("Close")}</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  );
};

export default TabModal;
