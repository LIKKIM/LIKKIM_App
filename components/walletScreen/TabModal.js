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

          const data = await response.json(); // 总是尝试解析JSON响应

          console.log("API Response:", data); // 总是打印API响应

          // 检查响应是否OK，并确认msg字段是否为'success'
          if (!response.ok || data.msg !== "success") {
            console.error(
              `API Error: HTTP status: ${response.status}, Message: ${data.msg}`
            );
            setTransactionHistory([]); // 清空交易历史，以防出错时显示旧数据
          } else {
            // 成功时处理和打印具体交易数据
            if (data.data && data.data.length > 0) {
              data.data.forEach((transaction) => {
                console.log(`Transaction:
                  Amount: ${transaction.amount},
                  From: ${transaction.from},
                  State: ${transaction.state},
                  To: ${transaction.to},
                  Token Contract Address: ${transaction.tokenContractAddress},
                  Transaction Symbol: ${transaction.transactionSymbol},
                  Transaction Time: ${new Date(
                    parseInt(transaction.transactionTime) * 1000
                  ).toLocaleString()},
                  Transaction ID: ${transaction.txid}`);
              });
              setTransactionHistory(data.data);
            } else {
              console.log("No transactions found.");
              setTransactionHistory([]);
            }
          }
        } catch (error) {
          console.error(
            `Failed to fetch transaction history: ${error.message}`
          );
          setTransactionHistory([]); // 清空交易历史，以防出错时显示旧数据
        }
      }
    };

    fetchTransactionHistory();
  }, [selectedCrypto, activeTab]);

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
