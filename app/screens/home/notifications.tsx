import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const Notifications = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.noNotifContainer}>
        <Ionicons
          name="notifications-outline"
          size={46}
          color="#797979"
          style={{ marginBottom: 18, marginTop: 58 }}
        />
        <Text style={styles.noNotifText}>No recent notifications</Text>
      </View>
    </View>
  );
};

export default Notifications;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  noNotifContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noNotifText: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
  },
});
