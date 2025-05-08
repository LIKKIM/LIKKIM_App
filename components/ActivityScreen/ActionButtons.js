// ActionButtons.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const ActionButtons = ({
  ActivityScreenStyle,
  t,
  iconColor,
  handleSendPress,
  handleReceivePress,
  handleSwapPress,
}) => {
  return (
    <View
      style={{
        width: "100%", // Full width for responsiveness
        height: 110,
        flexDirection: "row",
        justifyContent: "space-between", // Evenly spaced buttons
        gap: 10, // Space between buttons
      }}
    >
      {/* Send button */}
      <TouchableOpacity
        style={[ActivityScreenStyle.roundButton, { flex: 1 }]} // Equal width for each button
        onPress={handleSendPress}
      >
        <Feather name="send" size={24} color={iconColor} />
        <Text style={ActivityScreenStyle.mainButtonText}>{t("Send")}</Text>
      </TouchableOpacity>

      {/* Receive button */}
      <TouchableOpacity
        style={[ActivityScreenStyle.roundButton, { flex: 1 }]} // Equal width for each button
        onPress={handleReceivePress}
      >
        <Icon name="vertical-align-bottom" size={24} color={iconColor} />
        <Text style={ActivityScreenStyle.mainButtonText}>{t("Receive")}</Text>
      </TouchableOpacity>

      {/* Swap button */}
      <TouchableOpacity
        style={[ActivityScreenStyle.roundButton, { flex: 1 }]} // Equal width for each button
        onPress={handleSwapPress}
      >
        <Icon name="swap-horiz" size={24} color={iconColor} />
        <Text style={ActivityScreenStyle.mainButtonText}>{t("Swap")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;
