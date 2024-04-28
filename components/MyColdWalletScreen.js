// MyColdWalletScreen.js
import React, { useState } from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles"; // 确保路径正确

function MyColdWalletScreen() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <LinearGradient colors={["#24234C", "#101021"]} style={styles.container}>
      <View>
        <Text style={styles.titleText}>Bluetooth</Text>
        <TouchableOpacity
          style={styles.roundButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Pair with Bluetooth</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>LOOKING FOR DEVICES</Text>
              <Text style={styles.modalSubtitle}>
                Please make sure your Cold Wallet is unlocked and Bluetooth is
                enabled.
              </Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </LinearGradient>
  );
}

export default MyColdWalletScreen;
