/**
 * CurrencyModal Component
 *
 * A modal component that displays a list of currencies for selection.
 *
 * Props:
 *  - visible {boolean} - Determines if the modal is visible.
 *  - onClose {function} - Callback to close the modal.
 *  - currencies {Array} - Array of currency objects.
 *  - searchCurrency {string} - Current search query.
 *  - setSearchCurrency {function} - Function to update the search query.
 *  - handleCurrencyChange {function} - Callback when a currency is selected.
 *  - styles {object} - Custom styles for the modal.
 *  - isDarkMode {boolean} - Flag for dark mode.
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
  // Filter currencies based on the search query (case-insensitive)
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

                {/* List of filtered currencies */}
                <ScrollView style={styles.languageList}>
                  {filteredCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.shortName}
                      style={{ marginBottom: 6 }}
                      onPress={() => handleCurrencyChange(currency)}
                    >
                      <Text style={styles.languageModalText}>
                        {currency.name} - {currency.shortName}
                      </Text>
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
