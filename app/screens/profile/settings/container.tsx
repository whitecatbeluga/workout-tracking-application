import { View, Text, ScrollView } from "react-native";
import React from "react";

const ContainerSettings = ({ children }: { children: React.ReactNode }) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {children}
      </ScrollView>
    </View>
  );
};

export default ContainerSettings;
