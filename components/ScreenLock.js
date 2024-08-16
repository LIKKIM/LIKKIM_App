import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CryptoContext, DarkModeContext } from "./CryptoContext";

const ScreenLock = () => {
  const { screenLockPassword } = useContext(CryptoContext);
  const { isDarkMode } = useContext(DarkModeContext); // 获取当前主题模式
  const [inputPassword, setInputPassword] = useState("");
  const navigation = useNavigation();

  const handleUnlock = () => {
    if (inputPassword === screenLockPassword) {
      setIsScreenLocked(false); // 解锁后设置 isScreenLocked 为 false
    } else {
      Alert.alert("Incorrect Password", "Please try again.");
    }
  };

  // 根据主题模式选择样式
  const themeStyles = isDarkMode ? darkStyles : lightStyles;

  return (
    <View style={[styles.container, themeStyles.container]}>
      <Text style={[styles.title, themeStyles.title]}>
        Enter Password to Unlock
      </Text>
      <TextInput
        style={[styles.input, themeStyles.input]}
        secureTextEntry
        value={inputPassword}
        onChangeText={setInputPassword}
        placeholder="Enter Password"
        placeholderTextColor={themeStyles.placeholder.color}
      />
      <Button
        title="Unlock"
        onPress={handleUnlock}
        color={themeStyles.button.backgroundColor}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
  },
});

const lightStyles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
  },
  title: {
    color: "#333",
  },
  input: {
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  placeholder: {
    color: "#999",
  },
  button: {
    backgroundColor: "#007bff", // 这里可以根据需要设置按钮颜色
  },
});

const darkStyles = StyleSheet.create({
  container: {
    backgroundColor: "#1c1c1c",
  },
  title: {
    color: "#f5f5f5",
  },
  input: {
    borderColor: "#555",
    backgroundColor: "#333",
  },
  placeholder: {
    color: "#ccc",
  },
  button: {
    backgroundColor: "#1c74ff", // 这里可以根据需要设置按钮颜色
  },
});

export default ScreenLock;
