/**
 * NFT详情Modal
 * NFT 详情弹窗组件
 */
import React from "react";
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";

/**
 * SkeletonImage 组件（从 DeviceStatus.js 迁移）
 */
import { WebView } from "react-native-webview";
import { Animated } from "react-native";

const SkeletonImage = ({ source, style, resizeMode, VaultScreenStyle }) => {
  const [loaded, setLoaded] = React.useState(false);
  const skeletonOpacity = React.useState(new Animated.Value(1))[0];
  const imageOpacity = React.useState(new Animated.Value(0))[0];
  const shimmerTranslate = React.useState(new Animated.Value(-200))[0];

  React.useEffect(() => {
    if (!loaded) {
      Animated.loop(
        Animated.timing(shimmerTranslate, {
          toValue: 200,
          duration: 1500,
          useNativeDriver: true,
        })
      ).start();
    }
  }, [loaded]);

  const handleLoad = () => {
    setLoaded(true);
    Animated.timing(skeletonOpacity, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
    Animated.timing(imageOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={style}>
      {/* 骨架图层 */}
      {!loaded && (
        <Animated.View
          style={[
            VaultScreenStyle.placeholderWrapper,
            { opacity: skeletonOpacity, borderRadius: style.borderRadius || 0 },
          ]}
        >
          <Animated.View
            style={[
              VaultScreenStyle.shimmerBar,
              { transform: [{ translateX: shimmerTranslate }] },
            ]}
          >
            {/* 这里的 LinearGradient 建议在 VaultScreenStyle.shimmerBar 内部实现 */}
          </Animated.View>
        </Animated.View>
      )}
      <Animated.View
        style={{
          opacity: imageOpacity,
          borderRadius: 8,
          overflow: "hidden",
          flex: 1,
        }}
      >
        <WebView
          originWhitelist={["*"]}
          source={{
            html: `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>body,html{margin:0;padding:0;}</style>
        </head>
        <body>
          <img src="${source.uri}" style="
            width:100%;
            height:auto;
            object-fit:contain;
            display:block;
          "/>
        </body>
      </html>
    `,
          }}
          scrollEnabled={false}
          style={{ flex: 1 }}
          onLoadEnd={handleLoad}
        />
      </Animated.View>
    </View>
  );
};

/**
 * NFTDetailModal 组件
 * @param {object} props
 * @param {boolean} props.visible - 弹窗是否可见
 * @param {function} props.onClose - 关闭弹窗回调
 * @param {object} props.selectedNFT - 当前选中的 NFT 对象
 * @param {object} props.VaultScreenStyle - 样式对象
 * @param {function} props.t - 国际化函数
 * @param {function} props.handleSaveToDevice - 保存到设备回调
 * @param {function} props.setRecipientAddress - 设置收件人地址
 * @param {function} props.setSendModalVisible - 控制发送弹窗显示
 */
const NFTDetailModal = ({
  visible,
  onClose,
  selectedNFT,
  VaultScreenStyle,
  t,
  handleSaveToDevice,
  setRecipientAddress,
  setSendModalVisible,
}) => {
  return (
    // NFT详情Modal
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <BlurView intensity={20} style={VaultScreenStyle.centeredView}>
          <View
            style={VaultScreenStyle.NFTmodalView}
            onStartShouldSetResponder={(e) => e.stopPropagation()}
          >
            <View>
              {selectedNFT ? (
                <View>
                  {selectedNFT.logoUrl ? (
                    <SkeletonImage
                      source={{ uri: selectedNFT.logoUrl }}
                      style={VaultScreenStyle.nftModalImage}
                      resizeMode="cover"
                      VaultScreenStyle={VaultScreenStyle}
                    />
                  ) : (
                    <View style={VaultScreenStyle.nftNoImageContainer}>
                      <Image
                        source={require("../../assets/Logo@500.png")}
                        style={VaultScreenStyle.nftNoImageLogo}
                      />
                      <Text
                        style={[
                          VaultScreenStyle.modalSubtitle,
                          VaultScreenStyle.nftNoImageText,
                        ]}
                      >
                        {t("No Image")}
                      </Text>
                    </View>
                  )}

                  <ScrollView
                    showsVerticalScrollIndicator={true}
                    style={{ flexGrow: 0, height: 170, marginVertical: 20 }}
                    contentContainerStyle={{
                      flexGrow: 1,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "space-between",
                      }}
                    >
                      {/* NFT 名称 */}
                      <Text
                        style={[
                          VaultScreenStyle.modalTitle,
                          { marginBottom: 6 },
                        ]}
                      >
                        {selectedNFT.name || t("NFT Card")}
                      </Text>

                      {/* 合约地址 */}
                      <Text
                        style={[
                          VaultScreenStyle.chainCardText,
                          { marginBottom: 4 },
                        ]}
                      >
                        {t("Contract")}: {selectedNFT.tokenContractAddress}
                      </Text>

                      {/* Token ID */}
                      <Text
                        style={[
                          VaultScreenStyle.chainCardText,
                          { marginBottom: 4 },
                        ]}
                      >
                        {t("Token ID")}: {selectedNFT.tokenId}
                      </Text>

                      {/* 协议类型 */}
                      <Text
                        style={[
                          VaultScreenStyle.chainCardText,
                          { marginBottom: 4 },
                        ]}
                      >
                        {t("Protocol")}: {selectedNFT.protocolType || t("N/A")}
                      </Text>
                      <Text style={VaultScreenStyle.chainCardText}>
                        {t("Description")}: {selectedNFT.des || t("N/A")}
                      </Text>
                      {/* 价格信息，如果存在 */}
                      {selectedNFT.lastPrice && (
                        <Text
                          style={[
                            VaultScreenStyle.modalTitle,
                            { marginTop: 8 },
                          ]}
                        >
                          {t("Price")}: {selectedNFT.lastPrice}{" "}
                          {selectedNFT.lastPriceUnit || t("N/A")}
                        </Text>
                      )}
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <Text
                  style={[
                    VaultScreenStyle.modalSubtitle,
                    { textAlign: "center" },
                  ]}
                >
                  {t("No NFT Data")}
                </Text>
              )}
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={[
                  VaultScreenStyle.GallerySendBtn,
                  { flex: 1, marginRight: 8 },
                ]}
                onPress={() => {
                  if (setRecipientAddress) setRecipientAddress("");
                  if (setSendModalVisible) setSendModalVisible(true);
                  if (onClose) onClose();
                }}
              >
                <Text style={VaultScreenStyle.ButtonText}>{t("Send")}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[VaultScreenStyle.NFTButton, { flex: 1, marginLeft: 8 }]}
                onPress={handleSaveToDevice}
              >
                <Text style={VaultScreenStyle.NFTButtonText}>
                  {t("Save to Device")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default NFTDetailModal;
