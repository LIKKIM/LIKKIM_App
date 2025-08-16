import React from "react";
import { Modal, View, Text, TouchableOpacity, Image } from "react-native";
import { BlurView } from "expo-blur";

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
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={20} style={ActivityScreenStyle.centeredView}>
        <View style={ActivityScreenStyle.confirmModalView}>
          <Text style={ActivityScreenStyle.modalTitle}>
            {t("Waiting for Confirmation")}
          </Text>

          {/* 基本信息 */}
          <View style={ActivityScreenStyle.convertModalMarginTop20}>
            {/* 网络信息 */}
            <View
              style={{
                marginBottom: 30,
                alignItems: "flex-end",
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
              style={ActivityScreenStyle.optionButton}
              onPress={onConfirm}
            >
              <Text style={ActivityScreenStyle.submitButtonText}>
                {t("Confirm")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={ActivityScreenStyle.cancelButton}
              onPress={onCancel}
            >
              <Text style={ActivityScreenStyle.cancelButtonText}>
                {t("Cancel")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default ConfirmConvertModal;
