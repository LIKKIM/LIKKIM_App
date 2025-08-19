// modal/ChangeLockCodeModal.js
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity as RNTouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { BlurView } from "expo-blur";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

// 新增 AnimatedTouchableOpacity 组件，封装点击缩放效果
const AnimatedTouchableOpacity = ({
  children,
  style,
  onPress,
  activeOpacity = 0.2,
  ...rest
}) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <RNTouchableOpacity
        activeOpacity={activeOpacity}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        {...rest}
      >
        {children}
      </RNTouchableOpacity>
    </Animated.View>
  );
};

const ChangeLockCodeModal = ({
  visible,
  onClose,
  onSubmit,
  styles,
  isDarkMode,
  t,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [isCurrentPasswordHidden, setIsCurrentPasswordHidden] = useState(true);

  // 动画和 Modal 显隐控制
  const [showModal, setShowModal] = useState(visible);
  const intensityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
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
      setCurrentPassword("");
      setIsCurrentPasswordHidden(true);
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

  const handleNextForChangePassword = () => {
    onSubmit(currentPassword);
  };

  if (!showModal) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showModal}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <AnimatedBlurView intensity={intensityAnim} style={styles.centeredView}>
          <View style={styles.changeLockCodeModalView}>
            <Text style={styles.LockCodeModalTitle}>
              {t("Change Password")}
            </Text>
            <View style={{ marginVertical: 10, width: "100%" }}>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[styles.passwordInput, styles.focusedInput]}
                  placeholder={t("Enter current password")}
                  placeholderTextColor={isDarkMode ? "#ccc" : "#666"}
                  secureTextEntry={isCurrentPasswordHidden}
                  onChangeText={setCurrentPassword}
                  value={currentPassword}
                  autoFocus={true}
                />
                <AnimatedTouchableOpacity
                  onPress={() =>
                    setIsCurrentPasswordHidden(!isCurrentPasswordHidden)
                  }
                  style={styles.eyeIcon}
                >
                  <Icon
                    name={
                      isCurrentPasswordHidden ? "visibility-off" : "visibility"
                    }
                    size={24}
                    color={isDarkMode ? "#ccc" : "#666"}
                  />
                </AnimatedTouchableOpacity>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <AnimatedTouchableOpacity
                style={styles.submitButton}
                onPress={handleNextForChangePassword}
              >
                <Text style={styles.submitButtonText}>{t("Next")}</Text>
              </AnimatedTouchableOpacity>
              <AnimatedTouchableOpacity
                style={styles.cancelButton}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>{t("Cancel")}</Text>
              </AnimatedTouchableOpacity>
            </View>
          </View>
        </AnimatedBlurView>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ChangeLockCodeModal;
