import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type InputDropdownProps = {
  data: any;
  value: string;
  icon: any;
  placeholder: string;
  onChangeText: (name: string) => void;
};

const InputDropdown = ({
  data,
  value,
  icon,
  placeholder,
  onChangeText,
}: InputDropdownProps) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <>
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: "blue" }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        value={value}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={!isFocus ? placeholder : "..."}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => onChangeText(item.value)}
        renderLeftIcon={() => (
          <Ionicons style={styles.icon} name={icon} size={24} color="#6F7A88" />
        )}
      />
    </>
  );
};

export default InputDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 50,
    backgroundColor: "white",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  icon: {
    marginRight: 8,
  },
  item: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
