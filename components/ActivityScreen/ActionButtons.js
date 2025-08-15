// ActionButtons.js
import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const PRESS_IN_SCALE = 0.95;
const ANIMATION_DURATION = 200;

const ActionButtons = ({
  ActivityScreenStyle,
  t,
  iconColor,
  handleSendPress,
  handleReceivePress,
  handleConvertPress,
}) => {
  // 分别为每个按钮创建 Animated.Value
  const sendScale = useRef(new Animated.Value(1)).current;
  const receiveScale = useRef(new Animated.Value(1)).current;
  const convertScale = useRef(new Animated.Value(1)).current;

  // 按下动画
  const animatePressIn = (animatedValue) => {
    Animated.timing(animatedValue, {
      toValue: PRESS_IN_SCALE,
      duration: ANIMATION_DURATION,
      useNativeDriver: true,
    }).start();
  };

  // 弹起动画（弹性效果）
  const animatePressOut = (animatedValue) => {
    Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View
      style={{
        width: "100%",
        height: 110,
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      {/* Send button */}
      <Animated.View style={{ flex: 1, transform: [{ scale: sendScale }] }}>
        <TouchableOpacity
          style={[ActivityScreenStyle.roundButton, { flex: 1 }]}
          onPress={handleSendPress}
          onPressIn={() => animatePressIn(sendScale)}
          onPressOut={() => animatePressOut(sendScale)}
          activeOpacity={1}
        >
          <Icon name="arrow-outward" size={24} color={iconColor} />
          <Text style={ActivityScreenStyle.mainButtonText}>{t("Send")}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Receive button */}
      <Animated.View style={{ flex: 1, transform: [{ scale: receiveScale }] }}>
        <TouchableOpacity
          style={[ActivityScreenStyle.roundButton, { flex: 1 }]}
          onPress={handleReceivePress}
          onPressIn={() => animatePressIn(receiveScale)}
          onPressOut={() => animatePressOut(receiveScale)}
          activeOpacity={1}
        >
          <Icon name="vertical-align-bottom" size={24} color={iconColor} />
          <Text style={ActivityScreenStyle.mainButtonText}>{t("Receive")}</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Convert button */}
        <Icon name="swap-horiz" size={24} color={iconColor} />
        <Text style={ActivityScreenStyle.mainButtonText}>{t("Convert")}</Text>
      </TouchableOpacity>
          onPressOut={() => animatePressOut(convertScale)}
          activeOpacity={1}
        >
          <Icon name="swap-horiz" size={24} color={iconColor} />
          <Text style={ActivityScreenStyle.mainButtonText}>{t("Convert")}</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default ActionButtons;
