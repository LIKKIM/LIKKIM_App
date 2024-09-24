// ProcessModal.js
import React from "react";
import { View, Text, Modal, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";

const ProcessModal = ({
  visible,
  onClose,
  processMessages,
  showLetsGoButton,
  onLetsGo,
  styles,
  t,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <BlurView intensity={10} style={styles.centeredView}>
        <View style={styles.processModalView}>
          {processMessages.map((message, index) => (
            <Text key={index} style={styles.processButtonText}>
              {message}
            </Text>
          ))}
          {showLetsGoButton && (
            <TouchableOpacity style={styles.modalButton} onPress={onLetsGo}>
              <Text style={styles.mainButtonText}>{t("Let's Go")}</Text>
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default ProcessModal;
