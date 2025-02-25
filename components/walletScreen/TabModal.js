// TabModal.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from "react-native";
import PriceChartCom from "../PriceChartCom";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
            "https://bt.likkim.com/api/wallet/queryTransaction",
            {
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
            }
          );

          const data = await response.json();

          if (!response.ok || data.msg !== "success") {
            console.log(
              `Tab页行情数据API Error: HTTP status: ${response.status}, Message: ${data.msg}`
            );
            setTransactionHistory([]);
          } else {
            // 处理数据以添加 transactionType
            const enhancedData = data.data.map((transaction) => ({
              ...transaction,
              transactionType:
                transaction.from === selectedCrypto.address
                  ? "Send"
                  : "Receive",
            }));

            setTransactionHistory(enhancedData);
            AsyncStorage.setItem(
              "transactionHistory",
              JSON.stringify(enhancedData)
            ); // 保存调整后的数据
          }
        } catch (error) {
          console.error(
            `Failed to fetch transaction history: ${error.message}`
          );
          setTransactionHistory([]);
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
            <View
              style={{
                height: 280,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ScrollView style={WalletScreenStyle.historyList}>
                {transactionHistory.length === 0 ? (
                  <View
                    style={{
                      height: 280,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={WalletScreenStyle.noHistoryText}>
                      {t("No Histories")}
                    </Text>
                  </View>
                ) : (
                  transactionHistory.map((transaction, index) => {
                    return (
                      <View
                        key={index}
                        style={[
                          {
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
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[
                              WalletScreenStyle.historyItemText,
                              { fontSize: 18, fontWeight: "bold" },
                            ]}
                          >
                            {transaction.transactionType === "Send"
                              ? t("Send")
                              : t("Receive")}
                          </Text>

                          <Text
                            style={[
                              WalletScreenStyle.historyItemText,
                              { fontSize: 18, fontWeight: "bold" },
                            ]}
                          >
                            {transaction.amount}{" "}
                            {`${transaction.transactionSymbol}`}
                          </Text>
                        </View>

                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                          }}
                        >
                          <Text style={WalletScreenStyle.historyItemText}>
                            <Text
                              style={{ fontWeight: "bold" }}
                            >{`State: `}</Text>
                            <Text
                              style={{
                                color:
                                  transaction.state === "success"
                                    ? "#47B480"
                                    : "#D2464B",
                              }}
                            >
                              {transaction.state}
                            </Text>
                          </Text>
                        </View>

                        <Text style={WalletScreenStyle.historyItemText}>
                          {`${new Date(
                            Number(transaction.transactionTime)
                          ).toLocaleString()}`}
                        </Text>

                        <Text
                          style={[
                            WalletScreenStyle.historyItemText,
                            { lineHeight: 24 },
                          ]}
                        >
                          <Text style={{ fontWeight: "bold" }}>{`From: `}</Text>
                          {transaction.from}
                        </Text>
                        <Text
                          style={[
                            WalletScreenStyle.historyItemText,
                            { lineHeight: 24 },
                          ]}
                        >
                          <Text style={{ fontWeight: "bold" }}>{`To: `}</Text>
                          {transaction.to}
                        </Text>

                        <Text
                          style={[
                            WalletScreenStyle.historyItemText,
                            { lineHeight: 24 },
                          ]}
                        >
                          <Text
                            style={{ fontWeight: "bold" }}
                          >{`Transaction hash: `}</Text>
                          {transaction.txid}
                        </Text>

                        <Text style={WalletScreenStyle.historyItemText}>
                          <Text
                            style={{ fontWeight: "bold" }}
                          >{`Network Fee: `}</Text>
                          {transaction.txFee}
                        </Text>

                        <Text style={WalletScreenStyle.historyItemText}>
                          <Text
                            style={{ fontWeight: "bold" }}
                          >{`Block Height: `}</Text>
                          {transaction.height}
                        </Text>
                      </View>
                    );
                  })
                )}
              </ScrollView>
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
          { marginTop: Platform.OS === "android" ? -30 : 0 },
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
