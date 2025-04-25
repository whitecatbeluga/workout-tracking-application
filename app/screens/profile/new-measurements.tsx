import { View, Text } from "react-native";
import React from "react";
import { ScrollView } from "react-native";

const NewMeasurements = () => {
  return (
    <View style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        <Text>NewMeasurements</Text>
      </ScrollView>
    </View>
  );
};

export default NewMeasurements;
