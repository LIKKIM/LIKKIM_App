// modal/CurrencyModal.js
import React, { useState } from "react";
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
  // 状态用来记录搜索框是否处于焦点状态
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 定义外部区域点击处理函数
  const handleOuterPress = () => {
    if (isSearchFocused) {
      // 如果搜索框正处于聚焦状态，则取消聚焦
      setIsSearchFocused(false);
      Keyboard.dismiss();
    } else {
      // 如果搜索框未聚焦，则关闭 Modal
      onClose();
    }
  };

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
      {/* 点击外部区域，根据当前状态决定是取消聚焦还是关闭 Modal */}
      <TouchableWithoutFeedback onPress={handleOuterPress}>
        <View style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
          >
            <BlurView intensity={10} style={styles.centeredView}>
              <View
                style={styles.currencyModalView}
                onStartShouldSetResponder={() => true} // 防止触摸事件冒泡
              >
                <Text style={styles.languageModalTitle}>
                  {t("Select Currency")}
                </Text>

                {/* 搜索框 */}
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

                {/* 显示过滤后的币种列表 */}
                <ScrollView style={styles.languageList}>
                  {filteredCurrencies.map((currency) => (
                    <TouchableOpacity
                      key={currency.shortName}
                      style={{ marginBottom: 16 }}
                      onPress={() => handleCurrencyChange(currency)}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
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

                {/* 取消按钮 */}
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
