// InputAddressModal.js
import React, { useState } from "react";
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
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";
import AddressBookModal from "./AddressBookModal";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";

const InputAddressModal = ({
  visible,
  onRequestClose,
  TransactionsScreenStyle,
  t,
  isDarkMode,
  handleAddressChange,
  inputAddress,
  detectedNetwork,
  isAddressValid,
  buttonBackgroundColor,
  disabledButtonBackgroundColor,
  handleNextAfterAddress,
  setInputAddressModalVisible,
  selectedCrypto,
  selectedCryptoChain,
  selectedCryptoIcon,
}) => {
  const [isAddressBookVisible, setAddressBookVisible] = useState(false);
  const styles = SecureDeviceScreenStyles(isDarkMode);

  const handleIconPress = () => {
    setAddressBookVisible(true);
    setInputAddressModalVisible(false);
  };

  const handleAddressSelect = (selectedAddress) => {
    handleAddressChange(selectedAddress.address);
    setInputAddressModalVisible(true);
    setAddressBookVisible(false);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible && !isAddressBookVisible}
        onRequestClose={onRequestClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={TransactionsScreenStyle.centeredView}
        >
          <BlurView
            intensity={10}
            style={TransactionsScreenStyle.blurBackground}
          />
          <View style={TransactionsScreenStyle.cardContainer}>
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
              <Text style={TransactionsScreenStyle.modalTitle}>
                {selectedCrypto} ({selectedCryptoChain})
              </Text>
            </View>
            <Text style={TransactionsScreenStyle.modalTitle}>
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
                    TransactionsScreenStyle.input,
                    { flex: 1, color: isDarkMode ? "#ffffff" : "#000" },
                  ]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
                  onChangeText={handleAddressChange}
                  value={inputAddress}
                  autoFocus={true}
                />
                <Icon
                  name="portrait"
                  size={28}
                  color={isDarkMode ? "#ffffff" : "#000"}
                  style={{ marginLeft: 6, alignSelf: "center", top: 10 }}
                  onPress={handleIconPress}
                />
              </View>

              <ScrollView
                style={{ maxHeight: 60, marginVertical: 10 }}
                contentContainerStyle={{ flexGrow: 1 }}
                nestedScrollEnabled={true}
              >
                <Text
                  style={{
                    color:
                      detectedNetwork === "Invalid address"
                        ? "#FF5252"
                        : "#22AA94",
                    lineHeight: 36,
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
                TransactionsScreenStyle.optionButton,
                {
                  backgroundColor: isAddressValid
                    ? buttonBackgroundColor
                    : disabledButtonBackgroundColor,
                },
              ]}
              onPress={handleNextAfterAddress}
              disabled={!isAddressValid}
            >
              <Text style={TransactionsScreenStyle.submitButtonText}>
                {t("Next")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={TransactionsScreenStyle.cancelButton}
              onPress={() => setInputAddressModalVisible(false)}
            >
              <Text style={TransactionsScreenStyle.cancelButtonText}>
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

export default InputAddressModal;
