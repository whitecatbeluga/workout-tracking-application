import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Modal from "react-native-modal";
import { router } from "expo-router";

type CustomModalProps = {
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  modalActionButton: () => void;

  modalTitle?: string;
  modalDescription?: string;
  modalActionButtonText?: string;
};

const CustomModal = ({
  isModalVisible,
  setIsModalVisible,
  modalActionButton,

  modalTitle,
  modalDescription,
  modalActionButtonText,
}: CustomModalProps) => {
  return (
    <Modal
      isVisible={isModalVisible}
      onBackdropPress={() => setIsModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <Text
          style={{
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
            textAlign: "center",
          }}
        >
          {modalTitle}
        </Text>
        <View
          style={{
            width: "100%",
            height: 1,
            backgroundColor: "#CCC",
          }}
        />
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 14,
            textAlign: "center",
          }}
        >
          {modalDescription}
        </Text>
        <View style={{ width: "100%", alignItems: "center", gap: 14 }}>
          <TouchableOpacity
            style={styles.modalSettingsDiscardButton}
            onPress={() => {
              modalActionButton();
              setIsModalVisible(false);
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_500Medium",
                fontSize: 16,
                color: "#ED1010",
              }}
            >
              {modalActionButtonText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.modalSettingsDiscardButton}
            onPress={() => setIsModalVisible(false)}
          >
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 16 }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    gap: 10,
  },
  modalSettingsDiscardButton: {
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
  },
});
