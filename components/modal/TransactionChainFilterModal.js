// TransactionChainFilterModal.js
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

const TransactionChainFilterModal = ({
  isVisible,
  onClose,
  selectedChain,
  handleSelectChain,
  chainCards,
  isDarkMode,
  t,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1 }}>
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
                height: 500,
                width: "90%",
                borderRadius: 20,
                padding: 35,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF",
              }}
              onStartShouldSetResponder={() => true}
            >
              <Text
                style={{
                  fontSize: 16,
                  textAlign: "center",
                  marginBottom: 20,
                  lineHeight: 30,
                  color: isDarkMode ? "#FFFFFF" : "#000000",
                }}
              >
                {t("Select Chain")}
              </Text>

              <ScrollView
                contentContainerStyle={{ alignItems: "center" }}
                style={{ maxHeight: 400, width: 320, paddingHorizontal: 20 }}
              >
                <TouchableOpacity
                  onPress={() => handleSelectChain("All")}
                  style={{
                    padding: 10,
                    width: "100%",
                    justifyContent: "center",
                    borderRadius: 30,
                    height: 60,
                    alignItems: "center",
                    marginBottom: 16,
                    backgroundColor:
                      selectedChain === "All"
                        ? isDarkMode
                          ? "#CCB68C"
                          : "#CFAB95"
                        : isDarkMode
                        ? "#444444"
                        : "#e0e0e0",
                    flexDirection: "row",
                  }}
                >
                  <Image
                    source={require("../../assets/WalletScreenLogo.png")}
                    style={{
                      width: 24,
                      height: 24,
                      marginRight: 8,
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      borderRadius: 12,
                    }}
                  />
                  <Text
                    style={{
                      color:
                        selectedChain === "All"
                          ? isDarkMode
                            ? "#FFFFFF"
                            : "#ffffff"
                          : isDarkMode
                          ? "#DDDDDD"
                          : "#000000",
                    }}
                  >
                    {t("All Chains")}
                  </Text>
                </TouchableOpacity>

                {chainCards
                  .sort((a, b) =>
                    a.chainShortName.localeCompare(b.chainShortName)
                  )
                  .map((card, index) => (
                    <TouchableOpacity
                      key={`${card.chainShortName}-${index}`}
                      onPress={() => handleSelectChain(card.chainShortName)}
                      style={{
                        padding: 10,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 30,
                        height: 60,
                        flexDirection: "row",
                        marginBottom: 16,
                        backgroundColor:
                          selectedChain === card.chainShortName
                            ? isDarkMode
                              ? "#CCB68C"
                              : "#CFAB95"
                            : isDarkMode
                            ? "#444444"
                            : "#e0e0e0",
                      }}
                    >
                      {card.chainIcon && (
                        <Image
                          source={card.chainIcon}
                          style={{
                            width: 24,
                            height: 24,
                            marginRight: 8,
                            backgroundColor: "rgba(255, 255, 255, 0.2)",
                            borderRadius: 12,
                          }}
                        />
                      )}
                      <Text
                        style={{
                          color:
                            selectedChain === card.chainShortName
                              ? isDarkMode
                                ? "#FFFFFF"
                                : "#ffffff"
                              : isDarkMode
                              ? "#DDDDDD"
                              : "#000000",
                        }}
                      >
                        {card.chain} {t("Chain")}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </ScrollView>
            </View>
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default TransactionChainFilterModal;
