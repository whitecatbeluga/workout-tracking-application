import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";

type DropdownItem = {
  label: string;
  value: string | number;
  description?: string;
};

type InputDropdownProps = {
  inputLabel?: string;
  data: DropdownItem[];
  value?: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  placeholder: string;
  onChangeText?: (name: string) => void;
  hasDescription?: boolean;

  // multi select
  setSelected?: (item: string[]) => void;
  isMultiSelect?: boolean;
  multiSelectValue?: string[] | number[];
};

const InputDropdown = ({
  inputLabel,
  data,
  value,
  icon,
  placeholder,
  onChangeText,
  setSelected,
  isMultiSelect = false,
  hasDescription = false,
  multiSelectValue,
}: InputDropdownProps) => {
  const [isFocus, setIsFocus] = useState(false);

  const renderItemMulti = (item: DropdownItem, selected?: boolean) => (
    <View style={styles.itemMulti}>
      <Ionicons
        style={styles.icon}
        name={selected ? "checkbox" : "square-outline"}
        size={24}
        color="#6F7A88"
      />

      <View
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.textItem}>{item.label}</Text>
        {hasDescription && (
          <Text style={styles.textDesc}>{item.description}</Text>
        )}
      </View>
    </View>
  );

  const renderItemSingle = (item: DropdownItem, selected?: boolean) => (
    <View style={styles.itemSingle}>
      <Text style={styles.textItem}>{item.label}</Text>
      {hasDescription && (
        <Text style={styles.textDesc}>{item.description}</Text>
      )}
    </View>
  );

  return (
    <>
      {inputLabel && <Text style={styles.inputLabel}>{inputLabel}</Text>}

      {isMultiSelect ? (
        <MultiSelect
          style={[styles.dropdown, isFocus && { borderColor: "#48A6A7" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={{ borderRadius: 6, elevation: 0, marginTop: 5 }}
          iconStyle={styles.iconStyle}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={!isFocus ? placeholder : "..."}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          value={multiSelectValue?.map((item) => String(item))}
          searchPlaceholder="Search..."
          onChange={(item) => {
            setSelected?.(item);
          }}
          renderLeftIcon={() => (
            <Ionicons
              style={styles.icon}
              name={icon}
              size={24}
              color="#6F7A88"
            />
          )}
          renderItem={renderItemMulti}
          renderSelectedItem={(item, unSelect) => (
            <View style={styles.selectedStyle}>
              <Text style={styles.textSelectedStyle}>{item.label}</Text>
              <TouchableOpacity onPress={() => unSelect?.(item)}>
                <Ionicons
                  name="close-circle-outline"
                  size={24}
                  color="#6F7A88"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Dropdown
          style={[styles.dropdown, isFocus && { borderColor: "#48A6A7" }]}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          containerStyle={{ borderRadius: 6, elevation: 0, marginTop: 5 }}
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
          onChange={(item) => onChangeText?.(item.value)}
          renderLeftIcon={() => (
            <Ionicons
              style={styles.icon}
              name={icon}
              size={24}
              color="#6F7A88"
            />
          )}
          renderItem={renderItemSingle}
        />
      )}
    </>
  );
};

export default InputDropdown;

const styles = StyleSheet.create({
  dropdown: {
    height: 54,
    backgroundColor: "white",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Inter_400Regular",
    color: "#323232",
    marginBottom: 4,
  },
  icon: {
    marginRight: 8,
  },
  itemMulti: {
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
  },
  itemSingle: {
    padding: 17,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  textDesc: {
    flex: 1,
    fontSize: 12,
    color: "#9CA3AF",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#9CA3AF",
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

  // multi select
  selectedStyle: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 14,
    backgroundColor: "white",
    shadowColor: "#000",
    marginTop: 8,
    marginRight: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,

    borderColor: "#CBD5E1",
    borderWidth: 1,
  },
  textSelectedStyle: {
    marginRight: 5,
    fontSize: 16,
  },
});
