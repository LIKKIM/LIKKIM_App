import React from "react";
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
}) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
    onRequestClose={onRequestClose}
  >
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={TransactionsScreenStyle.centeredView}
    >
      <BlurView intensity={10} style={TransactionsScreenStyle.blurBackground} />
      <View style={TransactionsScreenStyle.cardContainer}>
        {/* 其他组件和样式 */}
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
              height: 100,
            }}
          >
            <TextInput
              style={[
                TransactionsScreenStyle.input,
                {
                  flex: 1, // 让 TextInput 占据父容器的剩余空间
                  color: isDarkMode ? "#ffffff" : "#000",
                },
              ]}
              placeholder={t("Enter Address")}
              placeholderTextColor={isDarkMode ? "#ffffff" : "#24234C"}
              onChangeText={handleAddressChange}
              value={inputAddress}
              autoFocus={true}
            />
            <Icon
              name="portrait"
              size={28}
              color={isDarkMode ? "#ffffff" : "#000"}
              style={{
                marginLeft: 6,
                alignSelf: "center",
                position: "relative",
                top: 10,
              }} // 给图标一些左边距
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
                  detectedNetwork === "Invalid address" ? "#FF5252" : "#22AA94",
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
);

export default InputAddressModal;
