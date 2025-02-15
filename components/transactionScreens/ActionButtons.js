// ActionButtons.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

const ActionButtons = ({
  TransactionsScreenStyle,
  t,
  iconColor,
  handleSendPress,
  handleReceivePress,
  handleSwapPress,
}) => {
  return (
    <View
      style={{
        width: "100%", // 使用100%的宽度来确保自适应
        height: 110,
        flexDirection: "row",
        justifyContent: "space-between", // 确保按钮均匀分布
        gap: 10, // 设置按钮之间的间距
      }}
    >
      {/* Send 按钮 */}
      <TouchableOpacity
        style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 每个按钮占据均等的宽度
        onPress={handleSendPress}
      >
        <Feather name="send" size={24} color={iconColor} />
        <Text style={TransactionsScreenStyle.mainButtonText}>{t("Send")}</Text>
      </TouchableOpacity>

      {/* Receive 按钮 */}
      <TouchableOpacity
        style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 均等宽度
        onPress={handleReceivePress}
      >
        <Icon name="vertical-align-bottom" size={24} color={iconColor} />
        <Text style={TransactionsScreenStyle.mainButtonText}>
          {t("Receive")}
        </Text>
      </TouchableOpacity>

      {/* Swap 按钮 */}
      <TouchableOpacity
        style={[TransactionsScreenStyle.roundButton, { flex: 1 }]} // 均等宽度
        onPress={handleSwapPress}
      >
        <Icon name="swap-horiz" size={24} color={iconColor} />
        <Text style={TransactionsScreenStyle.mainButtonText}>{t("Swap")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ActionButtons;
