// CheckStatusModal.js
import React, { useContext, useState, useEffect } from "react";
import { View, Text, Modal, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { useTranslation } from "react-i18next";
import SuccessGif from "../../assets/gif/Success.gif";
import FailGif from "../../assets/gif/Fail.gif";
import PendingGif from "../../assets/gif/Pending.gif";
import { DarkModeContext } from "../../utils/DeviceContext";
import SecureDeviceScreenStyles from "../../styles/SecureDeviceScreenStyle";

const CheckStatusModal = ({
  visible,
  status,
  missingChains = [],
  onClose,
  setVerificationStatus,
  progress: externalProgress, // 新增
}) => {
  const { isDarkMode, setIsDarkMode } = useContext(DarkModeContext);
  const styles = SecureDeviceScreenStyles(isDarkMode);
  const { t } = useTranslation();
  const [progress, setProgress] = useState(0);
  let imageSource;
  let title;
  let subtitle;

  useEffect(() => {
    if (typeof externalProgress === "number") {
      setProgress(externalProgress);
      return;
    }
    let intervalId;
    if (status === "waiting") {
      setProgress(0);
      intervalId = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 0.16;
          if (next >= 0.8) {
            clearInterval(intervalId);
            return 0.8;
          }
          return next;
        });
      }, 1000);
    } else {
      setProgress(0);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [status, externalProgress]);

  if (status === "success") {
    imageSource = SuccessGif;
    title = t("Verification successful!");
    subtitle = t("You can now safely use the device.");
  } else if (status === "walletReady") {
    imageSource = SuccessGif;
    title = t("Wallet ready!");
    subtitle = t("The wallet has been fully set up and is ready to use.");
  } else if (status === "fail") {
    imageSource = FailGif;
    title = t("Verification failed!");
    subtitle = t(
      "The verification code you entered is incorrect. Please try again."
    );
  } else if (status === "waiting") {
    imageSource = PendingGif;
    title = t("Creating wallet...");
    subtitle = t(
      "Receiving all addresses from the device. Wallet is being created, please wait..."
    );
  } else if (status === "noWalletInHardware") {
    imageSource = FailGif;
    title = t("No wallet found in LUKKEY hardware");
    subtitle = t(
      "Please create or import a wallet in your LUKKEY hardware device."
    );
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.SecurityCodeModalView}>
          <Image
            key={status}
            source={imageSource}
            style={{ width: 120, height: 120, marginTop: 20 }}
          />
          <Text style={styles.modalTitle}>{title}</Text>
          {status === "waiting" && (
            <View
              style={{
                height: 10,
                width: "80%",
                backgroundColor: "#e0e0e0",
                borderRadius: 5,
                marginTop: 10,
                overflow: "hidden",
                alignSelf: "center",
              }}
            >
              <View
                style={{
                  height: "100%",
                  width: `${Math.min(Math.max(progress, 0), 1) * 100}%`,
                  backgroundColor: "#3b82f6",
                  borderRadius: 5,
                }}
              />
            </View>
          )}
          {status === "waiting" && typeof externalProgress === "number" && (
            <Text style={{ textAlign: "center", marginTop: 4, color: "#888" }}>
              {t("Synchronized")} {Math.round(progress * 100)}%
            </Text>
          )}
          <Text style={styles.modalSubtitle}>{subtitle}</Text>

          {status !== "waiting" ? (
            <TouchableOpacity
              style={styles.submitButton}
              onPress={() => {
                if (setVerificationStatus) setVerificationStatus(null);
                if (onClose) onClose();
              }}
            >
              <Text style={styles.submitButtonText}>{t("Close")}</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ height: 60 }} />
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default CheckStatusModal;
