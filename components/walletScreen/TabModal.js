// TabModal.js
import React from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";

const TabModal = ({
  activeTab,
  setActiveTab,
  renderTabContent,
  closeModal,
  WalletScreenStyle,
  t,
  tabOpacity,
}) => {
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
