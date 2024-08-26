// CurrencyModal.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
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
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.currencyModalView}>
          <Text style={styles.languageModalTitle}>{t("Select Currency")}</Text>

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

          <ScrollView style={styles.languageList}>
            {filteredCurrencies.map((currency) => (
              <TouchableOpacity
                key={currency.shortName}
                style={styles.currencyOption}
                onPress={() => handleCurrencyChange(currency)}
              >
                <Text style={styles.languageModalText}>
                  {currency.name} - {currency.shortName}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            style={styles.languageCancelButton}
            onPress={onClose}
          >
            <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default CurrencyModal;
