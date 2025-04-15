import { View, StyleSheet } from "react-native";
import { StreakList } from "./streak-list";
import StreakHeader from "./streak-header";

const Streak = () => {
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
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  calendarContainer: {
    flex: 10,
    paddingBottom: 50,
  },
});
