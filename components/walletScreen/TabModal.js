// TabModal.js
import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import PriceChartCom from "../PriceChartCom";

const TabModal = ({
  activeTab,
  setActiveTab,
  closeModal,
  WalletScreenStyle,
  t,
  tabOpacity,
  transactionHistory, // 传入transactionHistory
  scrollViewRef,
  selectedCrypto,
}) => {
  // renderTabContent 函数在这里定义
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
                      {transaction.detail}
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
    <Animated.View
      style={[WalletScreenStyle.animatedTabContainer, { opacity: tabOpacity }]}
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
              activeTab === "History" && WalletScreenStyle.activeTabButtonText,
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
  );
};

export default TabModal;
