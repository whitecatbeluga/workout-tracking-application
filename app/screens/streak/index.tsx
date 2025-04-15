import React, { useLayoutEffect } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { StreakList } from "./streak-list";
import { StreakHeader } from "./streak-header";

const Streak = () => {
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Calendar",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StreakHeader />
      <StreakList />
    </View>
  );
};

export default Streak;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    flex: 10,
    paddingBottom: 50,
  },
});
