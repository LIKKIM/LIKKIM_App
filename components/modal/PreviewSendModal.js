/**
 * 发送预览Modal
 * 发送预览弹窗组件
 */
import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  BlurView,
} from "react-native";
import { BlurView as ExpoBlurView } from "expo-blur";

/**
 * PreviewSendModal 组件
 * @param {object} props
 * @param {boolean} props.visible - 弹窗是否可见
 * @param {function} props.onClose - 关闭弹窗回调
 * @param {object} props.selectedNFT - 当前选中的 NFT 对象
 * @param {object} props.VaultScreenStyle - 样式对象
 * @param {function} props.t - 国际化函数
 * @param {string} props.recipientAddress - 当前收件人地址
 * @param {function} props.handleSendPress - 发送回调
 * @param {boolean} props.isDarkMode - 暗黑模式
 */
const PreviewSendModal = ({
  visible,
  onClose,
  selectedNFT,
  VaultScreenStyle,
  t,
  recipientAddress,
  handleSendPress,
  isDarkMode,
}) => {
  return (
    // 发送预览Modal
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <ExpoBlurView intensity={20} style={VaultScreenStyle.centeredView}>
          <View
            style={VaultScreenStyle.ContactFormModal}
            onStartShouldSetResponder={(e) => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <View
              style={{
                width: "100%",
                alignItems: "center",
                marginBottom: 20,
              }}
            >
              <Text style={VaultScreenStyle.modalTitle}>
                {t("Waiting for Confirmation")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                marginBottom: 20,
              }}
            >
              {selectedNFT?.logoUrl && (
                <Image
                  source={{ uri: selectedNFT.logoUrl }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                />
              )}
              <View style={{ flexDirection: "column", flex: 1 }}>
                <Text
                  style={[
                    { flexWrap: "wrap" },
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  {selectedNFT?.name || "NFT Name"}
                </Text>
                <Text
                  style={[
                    { flexWrap: "wrap" },
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  {t("Token ID")}: {selectedNFT?.tokenId || "N/A"}
                </Text>
              </View>
            </View>

            <Text style={[{ color: isDarkMode ? "#fff" : "#000" }]}>
              {`${t("Recipient Address")}:`}
            </Text>

            <Text style={[{ color: isDarkMode ? "#fff" : "#000" }]}>
              {recipientAddress || t("No Address Selected")}
            </Text>
            <View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                {/* Close 按钮在左 */}
                <TouchableOpacity
                  style={[
                    VaultScreenStyle.cancelButton,
                    { borderRadius: 15, flex: 1, marginRight: 8 },
                  ]}
                  onPress={onClose}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Close")}</Text>
                </TouchableOpacity>

                {/* Send 按钮在右 */}
                <TouchableOpacity
                  style={[
                    VaultScreenStyle.submitButton,
                    { borderRadius: 15, flex: 1, marginLeft: 8 },
                  ]}
                  disabled={!recipientAddress}
                  onPress={() => {
                    handleSendPress();
                    onClose();
                  }}
                >
                  <Text style={VaultScreenStyle.ButtonText}>{t("Send")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ExpoBlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default PreviewSendModal;
