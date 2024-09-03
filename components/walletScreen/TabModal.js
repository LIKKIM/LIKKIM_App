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
          //     chainShortName: selectedCrypto.shortName,
          //    address: selectedCrypto.address,
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.code === "OK") {
            setTransactionHistory(data.data[0]?.transactionLists || []);
          } else {
            setTransactionHistory([]);
            console.error("Failed to fetch transaction history:", data.msg);
          }
        } catch (error) {
          console.error("Failed to fetch transaction history:", error.message);
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
