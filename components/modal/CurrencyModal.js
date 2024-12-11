// CurrencyModal.js
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
      {/* 点击模糊区域关闭键盘和Modal */}
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss(); // 关闭键盘
          onClose(); // 关闭 Modal
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
                onStartShouldSetResponder={() => true} // 阻止点击事件冒泡
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

                <ScrollView style={styles.languageList}>
                  {filteredCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.shortName}
                      style={{
                        marginBottom: 6,
                      }}
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
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CurrencyModal;
