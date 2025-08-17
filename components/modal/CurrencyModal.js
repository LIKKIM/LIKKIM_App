// modal/CurrencyModal.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const CurrencyModal = ({
  visible,
  onClose,
  currencies,
  searchCurrency,
  setSearchCurrency,
  handleCurrencyChange,
  styles,
  isDarkMode,
  t,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 动画相关
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
      setShowModal(false);
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const handleOuterPress = () => {
    if (isSearchFocused) {
      setIsSearchFocused(false);
      Keyboard.dismiss();
    } else {
      onClose();
    }
  };

  const currencyToCountryMap = {
    AUD: "AU",
    BHD: "BH",
    BRL: "BR",
    GBP: "GB",
    CAD: "CA",
    CLP: "CL",
    CZK: "CZ",
    DKK: "DK",
    AED: "AE",
    EUR: "EU",
    HKD: "HK",
    HUF: "HU",
    INR: "IN",
    IDR: "ID",
    ILS: "IL",
    JPY: "JP",
    MYR: "MY",
    MXN: "MX",
    NZD: "NZ",
    NGN: "NG",
    NOK: "NO",
    PKR: "PK",
    PHP: "PH",
    PLN: "PL",
    RUB: "RU",
    SGD: "SG",
    ZAR: "ZA",
    KRW: "KR",
    SEK: "SE",
    CHF: "CH",
    THB: "TH",
    TRY: "TR",
    USD: "US",
    UAH: "UA",
    VND: "VN",
    CNY: "CN",
  };

  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      currency.shortName.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  if (!showModal) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={showModal}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={handleOuterPress}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <AnimatedBlurView
              intensity={intensityAnim}
              style={styles.centeredView}
            >
              <View
                style={styles.currencyModalView}
                onStartShouldSetResponder={() => true}
              >
                <View
                  style={[
                    styles.searchContainer,
                    isSearchFocused && styles.focusedSearchContainer,
                  ]}
                >
                  <Icon name="search" size={20} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t("Search Currency")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    onChangeText={setSearchCurrency}
                    value={searchCurrency}
                  />
                </View>
                <ScrollView style={styles.languageList}>
                  {filteredCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.shortName}
                      style={{ marginBottom: 16 }}
                      onPress={() => handleCurrencyChange(currency)}
                    >
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <CountryFlag
                          isoCode={currencyToCountryMap[currency.shortName]}
                          size={20}
                          style={{ marginRight: 8, marginLeft: 30 }}
                        />
                        <Text
                          style={[
                            styles.currencyModalText,
                            { height: 20, textAlignVertical: "center" },
                          ]}
                        >
                          {currency.name} - {currency.shortName}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </AnimatedBlurView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CurrencyModal;
