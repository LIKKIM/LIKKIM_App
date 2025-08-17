/**
 * 发送ItemModal
 * 发送 Item 弹窗组件
 */
import React, { useRef, useState, useEffect } from "react";
import {
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * SendItemModal 组件
 * @param {object} props
 * @param {boolean} props.visible - 弹窗是否可见
 * @param {function} props.onClose - 关闭弹窗回调
 * @param {object} props.selectedNFT - 当前选中的 NFT 对象
 * @param {object} props.VaultScreenStyle - 样式对象
 * @param {function} props.t - 国际化函数
 * @param {function} props.setRecipientAddress - 设置收件人地址
 * @param {string} props.recipientAddress - 当前收件人地址
 * @param {function} props.setSendModalVisible - 控制弹窗显示
 * @param {function} props.handlePreview - 下一步回调
 * @param {function} props.handleOpenAddressBook - 打开地址簿回调
 * @param {boolean} props.isDarkMode - 暗黑模式
 */
const SendItemModal = ({
  visible,
  onClose,
  selectedNFT,
  VaultScreenStyle,
  t,
  setRecipientAddress,
  recipientAddress,
  setSendModalVisible,
  handlePreview,
  handleOpenAddressBook,
  isDarkMode,
}) => {
  // 动画和 Modal 显隐控制
  const [showModal, setShowModal] = useState(visible);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      setShowModal(true);
      Animated.sequence([
        Animated.timing(intensityAnim, {
          toValue: 0,
          duration: 800,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!showModal) return null;

  return (
    // 发送ItemModal
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <AnimatedBlurView
            intensity={intensityAnim}
            style={VaultScreenStyle.centeredView}
          >
            <View
              style={VaultScreenStyle.ContactFormModal}
              onStartShouldSetResponder={(e) => e.stopPropagation()}
            >
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text
                  style={[VaultScreenStyle.modalTitle, { marginBottom: 10 }]}
                >
                  {t("Send")}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "flex-start",
                }}
              >
                {selectedNFT?.logoUrl && (
                  <Image
                    source={{ uri: selectedNFT.logoUrl }}
                    style={VaultScreenStyle.nftCardBottom}
                  />
                )}
                <ScrollView
                  style={{ flex: 1, height: 60 }}
                  contentContainerStyle={{ alignItems: "flex-start" }}
                >
                  <Text
                    style={[VaultScreenStyle.modalTitle, { flexWrap: "wrap" }]}
                  >
                    {selectedNFT?.name || "NFT Name"}
                  </Text>
                  <Text style={VaultScreenStyle.modalSubtitleLeft}>
                    {t("Token ID")}: {selectedNFT?.tokenId || "N/A"}
                  </Text>
                </ScrollView>
              </View>

              <View
                style={{
                  width: "100%",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <TextInput
                  style={[
                    VaultScreenStyle.input,
                    { flex: 1, color: isDarkMode ? "#ffffff" : "#000" },
                  ]}
                  placeholder={t("Enter Address")}
                  placeholderTextColor={isDarkMode ? "#ffffff" : "#21201E"}
                  onChangeText={setRecipientAddress}
                  value={recipientAddress}
                  autoFocus={true}
                />

                <Icon
                  name="portrait"
                  size={28}
                  color={isDarkMode ? "#ffffff" : "#000"}
                  style={{ marginLeft: 6, alignSelf: "center", top: 10 }}
                  onPress={handleOpenAddressBook}
                />
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                {/* Close 按钮在左边 */}
                <TouchableOpacity
                  style={[
                    VaultScreenStyle.cancelButton,
                    { borderRadius: 15, flex: 1, marginRight: 10 },
                  ]}
                  onPress={onClose}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Cancel")}</Text>
                </TouchableOpacity>

                {/* Next 按钮在右边 */}
                <TouchableOpacity
                  style={[
                    VaultScreenStyle.submitButton,
                    { borderRadius: 15, flex: 1, marginLeft: 10 },
                  ]}
                  disabled={!recipientAddress}
                  onPress={handlePreview}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Next")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </AnimatedBlurView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default SendItemModal;
