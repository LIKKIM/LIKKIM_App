// TabModal.js
import React from "react";
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
  transactionHistory, // 传入transactionHistory
  scrollViewRef,
  selectedCrypto,
  isDarkMode,
  fadeAnim,
  darkColorsDown,
  lightColorsDown,
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
    <>
      {/* 数字货币弹窗背景层view 目的是衔接顶部菜单栏与背景的颜色 */}
      <Animated.View
        style={[WalletScreenStyle.cardModalView, { opacity: fadeAnim }]}
      >
        <LinearGradient
          colors={isDarkMode ? darkColorsDown : lightColorsDown}
          style={[WalletScreenStyle.cardModalView]}
        />
      </Animated.View>

      {/* 数字货币弹窗表面层TabModal view */}
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
