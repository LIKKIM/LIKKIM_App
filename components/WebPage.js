import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "../styles"; // 确保此处路径正确

function WebPage() {
  const navigation = useNavigation();
  const route = useRoute();
  const { url } = route.params;

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Icon name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Web Page</Text>
      </View>
      <WebView source={{ uri: url }} style={{ flex: 1 }} />
    </View>
  );
}

export default WebPage;
