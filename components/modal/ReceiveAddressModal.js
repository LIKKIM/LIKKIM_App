// ReceiveAddressModal.js
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";
import QRCode from "react-native-qrcode-svg";

/**
 * 通用收款地址弹窗
 * props:
 *  - visible
 *  - onClose
 *  - styleObj
 *  - t
 *  - cryptoIcon
 *  - cryptoName
 *  - address
 *  - isVerifying
 *  - verifyMsg
 *  - handleVerify
 *  - isDarkMode
 *  - chainShortName
 */
const ReceiveAddressModal = ({
  visible,
  onClose,
  styleObj,
  cryptoIcon,
  cryptoName,
  address,
  isVerifying,
  verifyMsg,
  handleVerify,
  isDarkMode,
  chainShortName,
}) => {
  const { t } = useTranslation();
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styleObj.centeredView}>
        <View style={styleObj.receiveModalView}>
          <Header
            cryptoIcon={cryptoIcon}
            cryptoName={cryptoName}
            styleObj={styleObj}
            t={t}
          />
          <AddressInfo
            address={address}
            isDarkMode={isDarkMode}
            styleObj={styleObj}
            t={t}
          />
          <QRCodeView address={address} />
          {isVerifying && (
            <VerifyingStatus message={verifyMsg} styleObj={styleObj} />
          )}
          <ActionButtons
            handleVerify={handleVerify}
            onClose={onClose}
            styleObj={styleObj}
            t={t}
            chainShortName={chainShortName}
          />
        </View>
      </BlurView>
    </Modal>
  );
};

const Header = ({ cryptoIcon, cryptoName, styleObj, t }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Text style={styleObj.modalTitle}>{t("Address for")}</Text>
    {cryptoIcon && (
      <Image
        source={cryptoIcon}
        style={{ width: 24, height: 24, marginHorizontal: 5 }}
      />
    )}
    <Text style={styleObj.modalTitle}>{cryptoName}:</Text>
  </View>
);

const AddressInfo = ({ address, isDarkMode, styleObj, t }) => {
  const safeAddress = (address || "").trim();
  const hasValidAddress = safeAddress !== "";

  return (
    <View>
      {hasValidAddress && (
        <Text style={styleObj.subtitleText}>
          {t("Assets can only be sent within the same chain.")}
        </Text>
      )}

      <View
        style={{
          flexDirection: hasValidAddress ? "row" : "column",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}
      >
        {hasValidAddress ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              maxWidth: "100%",
              flexWrap: "nowrap",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                styleObj.addressText,
                {
                  textAlign: "center",
                  marginRight: 8,
                  maxWidth: 200,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {safeAddress}
            </Text>
            <TouchableOpacity
              onPress={() => {
                Clipboard.setString(safeAddress);
                Alert.alert("", t("Address copied to clipboard"));
              }}
            >
              <Icon
                name="content-copy"
                size={24}
                color={isDarkMode ? "#ffffff" : "#676776"}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <Text
            style={[
              styleObj.addressText,
              { textAlign: "center", width: "100%" },
            ]}
          >
            {t("Click the Verify Address Button.")}
          </Text>
        )}
      </View>
    </View>
  );
};

const QRCodeView = ({ address }) => {
  const safeAddress = (address || "").trim();
  if (safeAddress === "") {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: "#fff",
        height: 220,
        width: 220,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 12,
      }}
    >
      <QRCode value={safeAddress} size={200} />
    </View>
  );
};

const VerifyingStatus = ({ message, styleObj }) => (
  <View style={{ flexDirection: "row", alignItems: "center" }}>
    <Image
      source={require("../../assets/gif/Pending.gif")}
      style={{ width: 40, height: 40 }}
    />
    <Text style={[styleObj.verifyingAddressText, { color: "#3CDA84" }]}>
      {message}
    </Text>
  </View>
);

const ActionButtons = ({
  handleVerify,
  onClose,
  styleObj,
  t,
  chainShortName,
}) => (
  <View
    style={{
      flexDirection: "row",
      justifyContent: "space-between",
      gap: 8,
    }}
  >
    <TouchableOpacity style={styleObj.cancelAddressBtn} onPress={onClose}>
      <Text style={styleObj.cancelButtonText}>{t("Close")}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() => handleVerify(chainShortName)}
      style={styleObj.verifyAddressBtn}
    >
      <Text style={styleObj.submitButtonText}>{t("Verify Address")}</Text>
    </TouchableOpacity>
  </View>
);

export default ReceiveAddressModal;
