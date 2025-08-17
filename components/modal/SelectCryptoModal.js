// SelectCryptoModal.js
import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const SelectCryptoModal = ({
  visible,
  onRequestClose,
  addedCryptos,
  operationType,
  selectCrypto,
  ActivityScreenStyle,
  t,
  setModalVisible,
  isDarkMode,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  // 动画和 Modal 显隐控制
  const [showModal, setShowModal] = useState(visible);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: false,
        }),
        Animated.timing(intensityAnim, {
          toValue: 20,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    } else if (showModal) {
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      }).start(() => {
        setShowModal(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const filteredCryptos = addedCryptos.filter((crypto) =>
    `${crypto.shortName} ${crypto.chain}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (!showModal) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <AnimatedBlurView
            intensity={intensityAnim}
            style={ActivityScreenStyle.centeredView}
          >
            <View
              style={ActivityScreenStyle.modalView}
              onStartShouldSetResponder={() => true}
            >
              {addedCryptos.length === 0 ? (
                <Text style={ActivityScreenStyle.TransactionModalTitle}>
                  {t(
                    "No assets available. Please connect your device to continue."
                  )}
                </Text>
              ) : null}

              {addedCryptos.length > 0 && (
                <View style={ActivityScreenStyle.searchContainer}>
                  <Icon
                    name="search"
                    size={20}
                    style={ActivityScreenStyle.searchIcon}
                  />
                  <TextInput
                    style={ActivityScreenStyle.searchInput}
                    placeholder={t("Search Asset")}
                    placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
                    onChangeText={(text) => setSearchQuery(text)}
                    value={searchQuery}
                  />
                </View>
              )}

              {addedCryptos.length === 0 ? (
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    height: 260,
                  }}
                >
                  <Image
                    source={require("../../assets/gif/Empty.gif")}
                    style={{
                      width: 200,
                      height: 200,
                      marginBottom: 40,
                    }}
                  />
                </View>
              ) : (
                <ScrollView
                  contentContainerStyle={{ alignItems: "center" }}
                  style={{ maxHeight: 400, width: 320, paddingHorizontal: 20 }}
                >
                  {filteredCryptos.map((crypto) => (
                    <TouchableOpacity
                      key={`${crypto.shortName}_${crypto.chain}`}
                      style={ActivityScreenStyle.optionButton}
                      onPress={() => selectCrypto(crypto)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        {crypto.icon && (
                          <Image
                            source={crypto.icon}
                            style={{
                              width: 24,
                              height: 24,
                              marginRight: 8,
                              backgroundColor: "rgba(255, 255, 255, 0.2)",
                              borderRadius: 12,
                            }}
                          />
                        )}
                        <Text style={ActivityScreenStyle.optionButtonText}>
                          {crypto.shortName} ({crypto.chain})
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
              <TouchableOpacity
                style={ActivityScreenStyle.cancelButtonReceive}
                onPress={() => setModalVisible(false)}
              >
                <Text style={ActivityScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>
            </View>
          </AnimatedBlurView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SelectCryptoModal;
