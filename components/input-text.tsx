import { Ionicons } from "@expo/vector-icons";
import { Text, TextInput, View } from "react-native";

type InputProps = {
  inputLabel?: string;
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
  error?: string | string[];
  toggleShowPassword?: () => void;
  editable?: boolean;
};

const Input = ({
  inputLabel,
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
  error,
  toggleShowPassword,
  multiline,
  numberOfLines,
  editable = true,
}: InputProps) => {
  return (
    <View>
      {inputLabel && (
        <View style={{ marginBottom: 8 }}>
          <Text
            style={{
              fontSize: 16,
              fontFamily: "Inter_400Regular",
              color: "#323232",
            }}
          >
            {inputLabel}
          </Text>
        </View>
      )}
      <View
        style={{
          justifyContent: "center",
        }}
      >
        <Ionicons
          style={{
            position: "absolute",
            left: 11,
            top: 13,
            zIndex: 1,
          }}
          name={icon}
          size={24}
          color="#6F7A88"
        />
        <TextInput
          editable={editable}
          style={{
            backgroundColor: "white",
            borderColor: error ? "#721c24" : "#CBD5E1",
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
            fontFamily: "Inter_400Regular",
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

        {Array.isArray(error)
          ? error.map((msg, idx) => (
              <Text
                key={idx}
                style={{
                  top: -10,
                  color: "#721c24",
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                }}
              >
                {"\u2022"} {msg}
              </Text>
            ))
          : error && (
              <Text
                style={{
                  top: -10,
                  color: "#721c24",
                  fontFamily: "Inter_400Regular",
                  fontSize: 14,
                }}
              >
                {"\u2022"} {error}
              </Text>
            )}
      </View>
    </View>
  );
};

export default Input;
