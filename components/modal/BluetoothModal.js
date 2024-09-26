// BluetoothModal.js
import React from "react";
import {
  View,
  Text,
  Modal,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { BlurView } from "expo-blur";
import Icon from "react-native-vector-icons/MaterialIcons";

const BluetoothModal = ({
  visible,
  devices,
  isScanning,
  iconColor,
  onDevicePress,
  onCancel,
  verifiedDevices,
  MyColdWalletScreenStyle,
  t,
  onDisconnectPress, // 添加断开连接的回调函数
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <BlurView intensity={10} style={MyColdWalletScreenStyle.centeredView}>
        <View style={MyColdWalletScreenStyle.bluetoothModalView}>
          <Text style={MyColdWalletScreenStyle.bluetoothModalTitle}>
            {t("LOOKING FOR DEVICES")}
          </Text>
          {isScanning ? (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Bluetooth.gif")}
                style={MyColdWalletScreenStyle.bluetoothImg}
              />
              <Text style={MyColdWalletScreenStyle.scanModalSubtitle}>
                {t("Scanning...")}
              </Text>
            </View>
          ) : (
            devices.length > 0 && (
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isVerified = verifiedDevices.includes(item.id);
                  return (
                    <TouchableOpacity
                      onPress={() => {
                        if (!isVerified) {
                          onDevicePress(item);
                        }
                      }}
                    >
                      <View style={MyColdWalletScreenStyle.deviceItemContainer}>
                        <Icon
                          name={isVerified ? "mobile-friendly" : "smartphone"}
                          size={24}
                          color={isVerified ? "#3CDA84" : iconColor}
                          style={MyColdWalletScreenStyle.deviceIcon}
                        />
                        <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                          {item.name || item.id}
                        </Text>
                        {isVerified && (
                          <TouchableOpacity
                            style={MyColdWalletScreenStyle.disconnectButton}
                            onPress={() => onDisconnectPress(item)}
                          >
                            <Text
                              style={
                                MyColdWalletScreenStyle.disconnectButtonText
                              }
                            >
                              {t("Disconnect")}
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            )
          )}
          {!isScanning && devices.length === 0 && (
            <View style={{ alignItems: "center" }}>
              <Image
                source={require("../../assets/gif/Search.gif")}
                style={{ width: 180, height: 180, margin: 30 }}
              />
              <Text style={MyColdWalletScreenStyle.modalSubtitle}>
                {t(
                  "Please make sure your Cold Wallet is unlocked and Bluetooth is enabled."
                )}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={MyColdWalletScreenStyle.cancelButtonLookingFor}
            onPress={onCancel}
          >
            <Text style={MyColdWalletScreenStyle.cancelButtonText}>
              {t("Cancel")}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </Modal>
  );
};

export default BluetoothModal;
