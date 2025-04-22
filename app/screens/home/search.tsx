import { useLayoutEffect, useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";
import { useNavigation } from "expo-router";

const Search = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState("");

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TextInput
          placeholder="Search..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.input}
          autoFocus
        />
      ),
    });
  }, [navigation, searchText]);

  return (
    <View style={styles.container}>
      <Text style={styles.recentTitle}>Recent </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    width: "100%",
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    marginLeft: -10,
  },
  recentTitle: {
    fontFamily: "Inter_600SemiBold",
    color: "#000000",
    fontSize: 16,
  },
});

export default Search;
