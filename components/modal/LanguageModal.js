// LanguageModal.js
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

const LanguageModal = ({
  visible,
  onClose,
  languages,
  searchLanguage,
  setSearchLanguage,
  handleLanguageChange,
  styles,
  isDarkMode,
  t,
}) => {
  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(searchLanguage.toLowerCase())
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.languageModalView}>
          <Text style={styles.languageModalTitle}>{t("Select Language")}</Text>

          <View style={styles.searchContainer}>
            <Icon name="search" size={20} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("Search Language")}
              placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
              onChangeText={setSearchLanguage}
              value={searchLanguage}
            />
          </View>

          <ScrollView style={styles.languageList}>
            {filteredLanguages.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => handleLanguageChange(language)}
              >
                <Text style={styles.languageModalText}>{language.name}</Text>
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

export default LanguageModal;
