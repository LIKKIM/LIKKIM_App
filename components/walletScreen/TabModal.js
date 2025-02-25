// TabModal.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
  Modal,
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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

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

            setTransactionHistory(enhancedData);
            AsyncStorage.setItem(
              "transactionHistory",
              JSON.stringify(enhancedData)
            );
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

  const openTransactionModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalVisible(true);
  };

  const closeTransactionModal = () => {
    setIsModalVisible(false);
    setSelectedTransaction(null);
  };

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
                  transactionHistory
                    .filter((transaction) => {
                      const amount = parseFloat(transaction.amount);
                      return !isNaN(amount) && amount !== 0;
                    })
                    .map((transaction, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => openTransactionModal(transaction)}
                        >
                          <View
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
                            <Text style={WalletScreenStyle.historyItemText}>
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
                                  WalletScreenStyle.historyItemText,
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
                                  WalletScreenStyle.historyItemText,
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

      {/* Transaction Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
                borderWidth: 3,
                borderColor: isDarkMode ? "#CCB68C" : "#CFAB95",
                padding: 10,
                width: 280,
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
