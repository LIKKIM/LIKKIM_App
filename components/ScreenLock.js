import React, { useState, useContext } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { CryptoContext } from "./CryptoContext";

const ScreenLock = () => {
  const { screenLockPassword } = useContext(CryptoContext);
  const [inputPassword, setInputPassword] = useState("");
  const navigation = useNavigation();

  const handleUnlock = () => {
    if (inputPassword === screenLockPassword) {
      navigation.navigate("Wallet"); // 使用 navigate 导航
    } else {
      Alert.alert("Incorrect Password", "Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Password to Unlock</Text>
      <TextInput
        style={styles.input}
        secureTextEntry
        value={inputPassword}
        onChangeText={setInputPassword}
        placeholder="Enter Password"
      />
      <Button title="Unlock" onPress={handleUnlock} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 18,
    backgroundColor: "#fff",
  },
});

export default ScreenLock;
