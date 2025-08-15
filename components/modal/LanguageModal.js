// LanguageModal.js
import React, { useEffect, useState, useRef } from "react";
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

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

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
  }, [visible]);

  const filteredLanguages = languages.filter((language) =>
    language.name.toLowerCase().includes(searchLanguage.toLowerCase())
  );

  if (!showModal) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
          onClose();
        }}
      >
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
                style={styles.languageModalView}
                onStartShouldSetResponder={() => true}
              >
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
                      style={{ marginBottom: 6 }}
                      onPress={() => handleLanguageChange(language)}
                    >
                      <Text style={styles.languageModalText}>
                        {language.name}
                      </Text>
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

export default LanguageModal;
