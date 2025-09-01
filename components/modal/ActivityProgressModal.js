// ActivityProgressModal.js
import React, { useRef } from "react";
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  Animated,
} from "react-native";

const ActivityProgressModal = ({
  visible,
  onClose,
  modalStatus,
  ActivityScreenStyle,
  t,
}) => {
  // 缩放动画
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 0,
    }).start();
  };

  return (
    <Modal
      visible={visible}
      onRequestClose={onClose}
      transparent={true}
      animationType="slide"
    >
      <View style={ActivityScreenStyle.centeredView}>
        <View style={ActivityScreenStyle.pendingModalView}>
          <Text style={ActivityScreenStyle.modalTitle}>
            {modalStatus.title}
          </Text>
          <Image
            source={modalStatus.image}
            style={{ width: 120, height: 120 }}
          />
          <Text
            style={[ActivityScreenStyle.modalSubtitle, { marginBottom: 20 }]}
          >
            {modalStatus.subtitle}
          </Text>
          <Animated.View
            style={{ width: "100%", transform: [{ scale: scaleAnim }] }}
          >
            <TouchableOpacity
              style={ActivityScreenStyle.submitButton}
              onPress={onClose}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              activeOpacity={0.8}
            >
              <Text style={ActivityScreenStyle.submitButtonText}>
                {t("Close")}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

export default ActivityProgressModal;
