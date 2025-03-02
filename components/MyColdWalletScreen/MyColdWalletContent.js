// MyColdWalletScreen/MyColdWalletContent.js
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Vibration,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

const MyColdWalletContent = ({
  styles, // MyColdWalletScreenStyle
  settingsOptions,
  isDeleteWalletVisible,
  setIsDeleteWalletVisible,
  isSupportExpanded,
  setIsSupportExpanded,
  handleDeleteWallet,
  handleBluetoothPairing,
  iconColor,
  t,
}) => {
  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.contentContainer}>
        {/* Settings Section */}
        <View>
          {settingsOptions.settings.map((option) => (
            <TouchableOpacity
              key={option.title}
              style={styles.settingsItem}
              onPress={option.onPress}
            >
              <View style={styles.listContainer}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={iconColor}
                  style={styles.Icon}
                />
                <Text style={[styles.Text, { flex: 1 }]}>{option.title}</Text>
                {option.selectedOption && (
                  <Text style={[styles.buttonText, { marginRight: 8 }]}>
                    {option.selectedOption}
                  </Text>
                )}
                {option.extraIcon && (
                  <Icon name={option.extraIcon} size={24} color={iconColor} />
                )}
              </View>
              {option.toggle}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => setIsDeleteWalletVisible(!isDeleteWalletVisible)}
        >
          <View style={styles.listContainer}>
            <Icon
              name="wallet"
              size={24}
              color={iconColor}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.Text, { flex: 1 }]}>
              {t("Wallet Management")}
            </Text>
            <Icon
              name={isDeleteWalletVisible ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={iconColor}
            />
          </View>
        </TouchableOpacity>

        {isDeleteWalletVisible && (
          <View>
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleDeleteWallet}
            >
              <View style={styles.listContainer}>
                <Icon
                  name="delete-outline"
                  size={24}
                  color={iconColor}
                  style={[styles.Icon, { marginLeft: 10 }]}
                />
                <Text style={[styles.Text, { flex: 1 }]}>
                  {t("Delete Wallet")}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Support Section (collapsible) */}
        <TouchableOpacity
          style={styles.settingsItem}
          onPress={() => setIsSupportExpanded(!isSupportExpanded)}
        >
          <View style={styles.listContainer}>
            <Icon
              name="support-agent"
              size={24}
              color={iconColor}
              style={{ marginRight: 8 }}
            />
            <Text style={[styles.Text, { flex: 1 }]}>{t("Support")}</Text>
            <Icon
              name={isSupportExpanded ? "arrow-drop-up" : "arrow-drop-down"}
              size={24}
              color={iconColor}
            />
          </View>
        </TouchableOpacity>

        {isSupportExpanded && (
          <View>
            {settingsOptions.support.map((option) => {
              const extraIconStyle = [
                "Help & Support",
                "Privacy & Data",
              ].includes(option.title)
                ? { marginLeft: 10 }
                : {};
              return (
                <TouchableOpacity
                  key={option.title}
                  style={styles.settingsItem}
                  onPress={option.onPress}
                >
                  <View style={styles.listContainer}>
                    <Icon
                      name={option.icon}
                      size={24}
                      color={iconColor}
                      style={[styles.Icon, extraIconStyle]}
                    />
                    <Text style={[styles.Text, { flex: 1 }]}>
                      {option.title}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Info Section (always expanded) */}
        <View>
          {settingsOptions.info.map((option) => (
            <TouchableOpacity
              key={option.title}
              style={styles.settingsItem}
              onPress={option.onPress}
            >
              <View style={styles.listContainer}>
                <Icon
                  name={option.icon}
                  size={24}
                  color={iconColor}
                  style={styles.Icon}
                />
                <Text style={[styles.Text, { flex: 1 }]}>{option.title}</Text>
                {option.version && (
                  <Text style={[styles.buttonText, { marginRight: 8 }]}>
                    {option.version}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bluetooth Pairing Button */}
        <View style={{ marginTop: 40, alignItems: "center" }}>
          <TouchableOpacity
            style={styles.roundButton}
            onPress={() => {
              Vibration.vibrate();
              handleBluetoothPairing();
            }}
          >
            <Text style={styles.BluetoothBtnText}>
              {t("Pair with Bluetooth")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default MyColdWalletContent;
