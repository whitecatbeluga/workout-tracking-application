import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  StyleSheet,
  TextInput,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

type SearchInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  containerStyle?: ViewStyle;
  inputStyle?: TextStyle;
  iconColor?: string;
  iconSize?: number;
};

const SearchInput = ({
  placeholder,
  value,
  onChangeText,
  containerStyle,
  inputStyle,
  iconColor = "#808080",
  iconSize = 20,
}: SearchInputProps) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons
        name="search"
        size={iconSize}
        color={iconColor}
        style={styles.icon}
      />
      <TextInput
        style={[styles.input, inputStyle]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#A9A9A9"
      />
    </View>
  );
};

export default SearchInput;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 40,
    marginVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    paddingLeft: 10,
    color: "#FFFFFF",
  },
  icon: {
    marginRight: 10,
    color: "#FFFFFF",
  },
});
