import React, { useEffect, useRef, useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from "react-native";
import { BlurView } from "expo-blur";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

/**
 * 确认兑换弹窗
 * @param {Object} props
 * @param {boolean} props.visible - 弹窗是否可见
 * @param {function} props.onConfirm - 点击确认回调
 * @param {function} props.onCancel - 点击取消回调
 * @param {object} props.ActivityScreenStyle - 样式对象
 * @param {function} props.t - 国际化函数
 * @param {function} props.getTokenDetails - 获取币种详情
 * @param {object} props.selectedFromToken
 * @param {object} props.selectedToToken
 * @param {string|number} props.fromValue
 * @param {string|number} props.toValue
 * @param {string|number} props.exchangeRate
 */
const ConfirmConvertModal = ({
  visible,
  onConfirm,
  onCancel,
  ActivityScreenStyle,
  t,
  getTokenDetails,
  selectedFromToken,
  selectedToToken,
  fromValue,
  toValue,
  exchangeRate,
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
      setShowModal(false);
      Animated.timing(intensityAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onCancel}
    >
      <TouchableWithoutFeedback onPress={onCancel}>
        <AnimatedBlurView
          intensity={intensityAnim}
          style={ActivityScreenStyle.centeredView}
        >
          <View
            style={ActivityScreenStyle.confirmModalView}
            onStartShouldSetResponder={() => true}
          >
            <Text style={ActivityScreenStyle.modalTitle}>
              {t("Waiting for Confirmation")}
            </Text>

            {/* 基本信息 */}
            <View style={ActivityScreenStyle.convertModalMarginTop20}>
              {/* 网络信息 */}
              <View
                style={{
                  marginBottom: 30,
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Image
                  source={getTokenDetails(selectedFromToken)?.chainIcon}
                  style={{
                    width: 24,
                    height: 24,
                    marginRight: 8,
                    marginBottom: 10,
                    borderRadius: 12,
                  }}
                />
                <Text style={ActivityScreenStyle.transactionText}>
                  {getTokenDetails(selectedFromToken)?.chain}
                </Text>
              </View>

              {/* From -> To 信息 */}
              <Text style={ActivityScreenStyle.transactionText}>
                {t("From")}: {getTokenDetails(selectedFromToken)?.name} (
                {fromValue})
              </Text>
              <Text style={ActivityScreenStyle.transactionText}>
                {t("To")}: {getTokenDetails(selectedToToken)?.name} ({toValue})
              </Text>
              <Text style={ActivityScreenStyle.transactionText}>
                {t("Convert Rate")}: 1{" "}
                {getTokenDetails(selectedFromToken)?.symbol} ≈ {exchangeRate}{" "}
                {getTokenDetails(selectedToToken)?.symbol}
              </Text>

              {/* 支付合约 */}
              <Text
                style={[ActivityScreenStyle.transactionText, { marginTop: 10 }]}
              >
                {t("From Token Address")}:{" "}
                {getTokenDetails(selectedFromToken)?.contractAddress || "-"}
              </Text>

              {/* 接收合约 */}
              <Text style={ActivityScreenStyle.transactionText}>
                {t("To Token Address")}:{" "}
                {getTokenDetails(selectedToToken)?.contractAddress || "-"}
              </Text>

              {/* 账户地址 */}
              <Text style={ActivityScreenStyle.transactionText}>
                {t("Account Address")}:{" "}
                {getTokenDetails(selectedFromToken)?.address || "-"}
              </Text>
            </View>

            {/* 确认/取消按钮 */}
            <View style={ActivityScreenStyle.convertModalButtonRow}>
              <TouchableOpacity
                style={[
                  ActivityScreenStyle.cancelButton,
                  {
                    flex: 1,
                    marginRight: 10,
                    borderRadius: 15,
                  },
                ]}
                onPress={onCancel}
              >
                <Text style={ActivityScreenStyle.cancelButtonText}>
                  {t("Cancel")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  ActivityScreenStyle.swapConfirmButton,
                  {
                    flex: 1,
                    marginLeft: 10,
                    borderRadius: 15,
                  },
                ]}
                onPress={onConfirm}
              >
                <Text style={ActivityScreenStyle.submitButtonText}>
                  {t("Confirm")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </AnimatedBlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ConfirmConvertModal;
