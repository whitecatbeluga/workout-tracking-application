import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

type InputProps = {
  value: any;
  icon: any;
  placeholder: string;
  autoCapitalize?: any;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  multiline?: boolean;
  numberOfLines?: number;
  secureTextEntry?: boolean;
  isSuffix?: boolean;
  suffixIcon?: any;
  passwordToggle?: boolean;
  showPassword?: boolean;
  toggleShowPassword?: () => void;
};

const Input = ({
  value,
  icon,
  suffixIcon,
  placeholder,
  autoCapitalize,
  onChangeText,
  keyboardType,
  secureTextEntry,
  isSuffix,
  showPassword,
  toggleShowPassword,
  multiline,
  numberOfLines,
}: InputProps) => {
  return (
    <View
      style={{
        justifyContent: "center",
      }}
    >
      <Ionicons
        style={{ position: "absolute", left: 11, top: 13, zIndex: 1 }}
        name={icon}
        size={24}
        color="#6F7A88"
      />
      <TextInput
        style={{
          backgroundColor: "white",
          borderColor: "#CBD5E1",
          borderWidth: 1,
          ...(multiline
            ? {
                minHeight: numberOfLines ? numberOfLines * 20 : 100,
                textAlignVertical: "top",
              }
            : { height: 50 }),
          paddingHorizontal: 8,
          paddingLeft: 40,
          paddingRight: 40,
          borderRadius: 10,
          fontSize: 16,
          marginBottom: 16,
        }}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        numberOfLines={numberOfLines}
      />

      {isSuffix && (
        <Ionicons
          style={{ position: "absolute", right: 11, top: 13, zIndex: 1 }}
          name={
            typeof showPassword === "boolean"
              ? showPassword
                ? "eye-off"
                : "eye"
              : suffixIcon
          }
          size={24}
          color="#6F7A88"
          onPress={toggleShowPassword}
        />
      )}
    </View>
  );
};

export default Input;
