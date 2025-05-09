import React from "react";
import { View, StyleSheet } from "react-native";
import Streak from "../streak";

const CalendarScreen = () => {
  return (
    <View style={styles.container}>
      <Streak />
    </View>
  );
};

export default CalendarScreen;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    flex: 10,
    paddingBottom: 50,
  },
  settingsDiscardButton: {
    backgroundColor: "#EEEEEE",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    width: "100%",
    borderRadius: 8,
  },
});
