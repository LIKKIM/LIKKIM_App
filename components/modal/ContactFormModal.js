// ContactFormModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import AddressBookModal from "./AddressBookModal";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

const ContactFormModal = ({
  visible,
  onRequestClose,
  ActivityScreenStyle,
  t,
  isDarkMode,
  handleAddressChange,
  inputAddress,
  detectedNetwork,
  isAddressValid,
  buttonBackgroundColor,
  disabledButtonBackgroundColor,
  handleNextAfterAddress,
  setContactFormModalVisible,
  selectedCrypto,
  selectedCryptoChain,
  selectedCryptoIcon,
}) => {
  const [isAddressBookVisible, setAddressBookVisible] = useState(false);
  const styles = SecureDeviceScreenStyles(isDarkMode);

  const [showModal, setShowModal] = useState(visible && !isAddressBookVisible);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && !isAddressBookVisible) {
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
  }, [visible, isAddressBookVisible]);

  const handleIconPress = () => {
    setAddressBookVisible(true);
    setContactFormModalVisible(false);
  };

  const handleAddressSelect = (selectedAddress) => {
    handleAddressChange(selectedAddress.address);
    setContactFormModalVisible(true);
    setAddressBookVisible(false);
  };

  if (!showModal)
    return (
      <AddressBookModal
        visible={isAddressBookVisible}
        onClose={() => setAddressBookVisible(false)}
        onSelect={handleAddressSelect}
        styles={styles}
        isDarkMode={isDarkMode}
      />
    );

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={onRequestClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={ActivityScreenStyle.centeredView}
        >
          <AnimatedBlurView
            intensity={intensityAnim}
            style={ActivityScreenStyle.blurBackground}
          />
          <View style={ActivityScreenStyle.cardContainer}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              {selectedCryptoIcon && (
                <Image
                  source={selectedCryptoIcon}
                  style={{ width: 24, height: 24, marginRight: 8 }}
                />
              )}
              <Text style={ActivityScreenStyle.modalTitle}>
                {selectedCrypto} ({selectedCryptoChain})
              </Text>
            </View>
            <Text style={ActivityScreenStyle.modalTitle}>
              {t("Enter the recipient's address:")}
            </Text>
            <View style={{ width: "100%" }}>
              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={[
                    ActivityScreenStyle.input,
                    { flex: 1, color: isDarkMode ? "#ffffff" : "#000" },
                  ]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
                  onChangeText={handleAddressChange}
                  value={inputAddress}
                  autoFocus={true}
                />
                <TouchableOpacity
                  style={{
                    borderRadius: 14,
                    overflow: "hidden",
                    marginLeft: 6,
                    alignSelf: "center",
                    top: 10,
                  }}
                  onPress={handleIconPress}
                >
                  <Icon
                    name="portrait"
                    size={28}
                    color={isDarkMode ? "#ffffff" : "#000"}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                style={{ maxHeight: 60, marginVertical: 10 }}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={true}
                indicatorStyle={isDarkMode ? "white" : "black"}
              >
                <Text
                  style={{
                    color:
                      detectedNetwork === "Invalid address"
                        ? "#FF5252"
                        : "#22AA94",
                    lineHeight: 26,
                    textAlignVertical: "center",
                  }}
                >
                  {inputAddress
                    ? detectedNetwork === "Invalid address"
                      ? t("Invalid address")
                      : `${t("Detected Network")}: ${detectedNetwork}`
                    : ""}
                </Text>
              </ScrollView>
            </View>
            <TouchableOpacity
              style={[
                ActivityScreenStyle.optionButton,
                {
                  backgroundColor: isAddressValid
                    ? buttonBackgroundColor
                    : disabledButtonBackgroundColor,
                },
              ]}
              onPress={handleNextAfterAddress}
              disabled={!isAddressValid}
            >
              <Text style={ActivityScreenStyle.submitButtonText}>
                {t("Next")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ActivityScreenStyle.cancelButton}
              onPress={() => setContactFormModalVisible(false)}
            >
              <Text style={ActivityScreenStyle.cancelButtonText}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <AddressBookModal
        visible={isAddressBookVisible}
        onClose={() => setAddressBookVisible(false)}
        onSelect={handleAddressSelect}
        styles={styles}
        isDarkMode={isDarkMode}
      />
    </>
  );
};

export default ContactFormModal;
