import { View, StyleSheet } from "react-native";
import StreakList from "./streak-list";
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
  },
});
