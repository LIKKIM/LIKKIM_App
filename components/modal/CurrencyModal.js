/**
 * CurrencyModal Component
 *
 * A modal component that displays a list of currencies with corresponding country flags for selection.
 *
 * Props:
 *  - visible {boolean} - Whether the modal is visible.
 *  - onClose {function} - Callback function to close the modal.
 *  - currencies {Array} - Array of currency objects. Each object should contain `name` and `shortName`.
 *  - searchCurrency {string} - The current search query.
 *  - setSearchCurrency {function} - Function to update the search query.
 *  - handleCurrencyChange {function} - Callback function when a currency is selected.
 *  - styles {object} - Custom styles for the modal.
 *  - isDarkMode {boolean} - Flag indicating dark mode.
 *  - t {function} - Translation function.
 *
 * @module CurrencyModal
 */

import React from "react";
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
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
// Import the CountryFlag component from react-native-country-flag library
import CountryFlag from "react-native-country-flag";

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
  // Mapping from currency short names to corresponding country ISO codes
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
    // Add more mappings as needed...
  };

  // Filter currencies based on search query (case-insensitive)
  const filteredCurrencies = currencies.filter(
    (currency) =>
      currency.name.toLowerCase().includes(searchCurrency.toLowerCase()) ||
      currency.shortName.toLowerCase().includes(searchCurrency.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      {/*
        Dismiss keyboard and close modal when tapping outside.
      */}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss(); // Dismiss the keyboard
          onClose(); // Close the modal
        }}
      >
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <BlurView intensity={10} style={styles.centeredView}>
              <View
                style={styles.currencyModalView}
                onStartShouldSetResponder={() => true} // Prevent touch event propagation
              >
                <Text style={styles.languageModalTitle}>
                  {t("Select Currency")}
                </Text>

                {/* Search Box */}
                <View style={styles.searchContainer}>
                  <Icon name="search" size={20} style={styles.searchIcon} />
                  <TextInput
                    style={styles.searchInput}
                    placeholder={t("Search Currency")}
                    placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                    onChangeText={setSearchCurrency}
                    value={searchCurrency}
                  />
                </View>

                {/* List of filtered currencies with flags */}
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

                {/* Cancel Button */}
                <TouchableOpacity
                  style={styles.languageCancelButton}
                  onPress={onClose}
                >
                  <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CurrencyModal;
