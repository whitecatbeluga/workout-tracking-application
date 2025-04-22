import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ContainerSettings from "./container";
import Input from "@/components/input-text";
import { useAppSelector } from "@/hooks/use-app-selector";

const screenWidth = Dimensions.get("window").width;

const ContactUs = () => {
  const user = useAppSelector((state) => state.auth.user);

  const [ContactUsFormData, setContactUsFormData] = useState({
    full_name: `${user?.first_name} ${user?.last_name}`,
    email: user?.email || "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    field: keyof typeof ContactUsFormData,
    value: string
  ) => {
    setContactUsFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <ContainerSettings>
      <Text
        style={{
          fontSize: 32,
          fontFamily: "Inter_800ExtraBold",
          letterSpacing: -2,
          color: "#323232",
          textAlign: "center",
        }}
      >
        Need a Spot? We're Here to Help.
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Image
          source={require("@/assets/images/contact-us.jpg")}
          style={{ width: 300, height: 300 }}
        />
      </View>

      <Input
        inputLabel="Subject"
        value={ContactUsFormData.subject}
        icon="mail-open"
        placeholder="Subject"
        onChangeText={(value) => {
          handleInputChange("subject", value);
        }}
      />
      <Input
        inputLabel="Message"
        value={ContactUsFormData.message}
        icon="document-text"
        placeholder="Message"
        onChangeText={(value) => {
          handleInputChange("message", value);
        }}
        multiline={true}
        numberOfLines={4}
      />

      <Text style={{ fontFamily: "Inter_400Regular", textAlign: "center" }}>
        Message from:{" "}
        <Text style={{ fontFamily: "Inter_500Medium" }}>
          {ContactUsFormData.full_name} ({ContactUsFormData.email})
        </Text>
      </Text>

      <TouchableOpacity
        style={{
          backgroundColor: "#006A71",
          alignItems: "center",
          paddingVertical: 10,
          borderRadius: 8,
          marginTop: 20,
          width: "100%",
        }}
        onPress={() => {}}
      >
        <Text
          style={{
            color: "#FFFFFF",
            fontFamily: "Inter_600SemiBold",
            fontSize: 16,
          }}
        >
          Send
        </Text>
      </TouchableOpacity>
    </ContainerSettings>
  );
};

export default ContactUs;
