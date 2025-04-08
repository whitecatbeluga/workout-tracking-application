import AntDesign from "@expo/vector-icons/AntDesign";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";

const DrawerFilter = () => {
  return (
    <View>
      <TouchableOpacity style={styles.tabButton}>
        <Text
          style={{
            color: "#006A71",
          }}
        >
          Last 3 Months
        </Text>
        <AntDesign name="circledowno" size={18} color="#006A71" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  profileInfo: {
    fontSize: 12,
    color: "gray",
  },

  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});

export default DrawerFilter;
