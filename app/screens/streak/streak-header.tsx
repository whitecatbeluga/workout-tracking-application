import React from "react";
import { StyleSheet, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

const StreakHeader = () => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.streakContainer}>
        <MaterialCommunityIcons name="fire" size={45} color="#DC723D" />
        <View>
          <Text style={styles.streakText}>15 Weeks</Text>
          <Text style={styles.streakLabel}>Streak</Text>
        </View>
      </View>
      <View style={styles.streakContainer}>
        <MaterialCommunityIcons name="power-sleep" size={45} color="#48A6A7" />
        <View>
          <Text style={styles.streakText}>1 Days</Text>
          <Text style={styles.streakLabel}>Rest</Text>
        </View>
      </View>
    </View>
  );
};

export default StreakHeader;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  headerContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  streakContainer: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#F8F8F8",
    borderRadius: 5,
    padding: 10,
  },
  streakText: {
    fontSize: 18,
    fontFamily: "Inter_400Regular",
  },
  streakLabel: {
    color: "#808080",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
  },
});
