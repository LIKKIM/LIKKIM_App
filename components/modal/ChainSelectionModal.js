// modal/ChainSelectionModal.js
import React, { useRef } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

const ChainSelectionModal = ({
  isVisible,
  onClose,
  selectedChain,
  handleSelectChain,
  cryptoCards,
  isDarkMode,
  t,
}) => {
  const AnimatedTouchableWithScale = (props) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.95,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start();
    };

    const onPressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 0,
      }).start();
    };

    return (
      <AnimatedTouchable
        {...props}
        onPressIn={(e) => {
          onPressIn();
          if (props.onPressIn) props.onPressIn(e);
        }}
        onPressOut={(e) => {
          onPressOut();
          if (props.onPressOut) props.onPressOut(e);
        }}
        style={[props.style, { transform: [{ scale: scaleAnim }] }]}
      >
        {props.children}
      </AnimatedTouchable>
    );
  };

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
            intensity={20}
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View
              style={{
                margin: 20,
                height: 500,
                width: "90%",
                borderRadius: 20,
                padding: 30,
                alignItems: "center",
                justifyContent: "space-between",
                backgroundColor: isDarkMode ? "#21201E" : "#FFFFFF",
              }}
              onStartShouldSetResponder={() => true}
            >
              <ScrollView
                contentContainerStyle={{ alignItems: "center" }}
                style={{ maxHeight: 500, width: 320, paddingHorizontal: 20 }}
              >
                <AnimatedTouchableWithScale
                  onPress={() => handleSelectChain("All")}
                  style={{
                    padding: 10,
                    width: "100%",
                    justifyContent: "center",
                    borderRadius: 15,
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
                    source={require("../../assets/VaultScreenLogo.png")}
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
                </AnimatedTouchableWithScale>

                {[
                  ...new Map(
                    cryptoCards.map((card) => [card.chainShortName, card])
                  ).values(),
                ]
                  .sort((a, b) =>
                    a.chainShortName.localeCompare(b.chainShortName)
                  )
                  .map((card, index) => (
                    <AnimatedTouchableWithScale
                      key={`${card.chainShortName}-${index}`}
                      onPress={() => handleSelectChain(card.chainShortName)}
                      style={{
                        padding: 10,
                        width: "100%",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 15,
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
                        {card.queryChainName
                          ? card.queryChainName.charAt(0).toUpperCase() +
                            card.queryChainName.slice(1)
                          : ""}{" "}
                        {t("Chain")}
                      </Text>
                    </AnimatedTouchableWithScale>
                  ))}
              </ScrollView>
            </View>
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ChainSelectionModal;
