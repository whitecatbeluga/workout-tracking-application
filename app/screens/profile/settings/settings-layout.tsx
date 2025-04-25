import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { clearUser, logout } from "@/redux/auth-slice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import ContainerSettings from "./container";
import { signOut } from "firebase/auth";
import { auth } from "@/utils/firebase-config";

const otherSettings = [
  {
    label: "Account Details",
    icon: "person-circle",
    route: "/screens/profile/settings/account-details",
  },
  {
    label: "Contact Us",
    icon: "call",
    route: "/screens/profile/settings/contact-us",
  },
  {
    label: "Terms of Service",
    icon: "document-text",
    route: "/screens/profile/settings/terms-of-service",
  },
  {
    label: "About Us",
    icon: "people-circle",
    route: "/screens/profile/settings/about-us",
  },
];

const SettingsScreen = () => {
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(clearUser());
      router.replace("/screens/landingPage/login-page");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <ContainerSettings>
      {/* user info */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          justifyContent: "space-between",
          paddingVertical: 20,
          paddingHorizontal: 20,
          borderRadius: 8,
          borderColor: "#CBD5E1",
          borderWidth: 1,
        }}
        onPress={() => router.push("/screens/profile/settings/edit-profile")}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "center",
          }}
        >
          <Image
            source={{ uri: "https://avatar.iran.liara.run/public/41" }}
            style={{ width: 50, height: 50 }}
          />
          <View>
            <Text style={{ fontSize: 20, fontWeight: "bold" }}>
              {user?.first_name} {user?.last_name}
            </Text>
            <Text style={{ fontSize: 14, color: "gray" }}>{user?.email}</Text>
          </View>
        </View>
        <Ionicons name="chevron-forward-outline" size={26} color="#323232" />
      </TouchableOpacity>

      <View style={{ paddingVertical: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: "medium" }}>
          Other Settings
        </Text>
      </View>

      {/* other settings */}
      {otherSettings.map((item: any, index) => (
        <TouchableOpacity
          key={index}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
            paddingVertical: 16,
          }}
          onPress={() => router.push(item.route)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "center",
            }}
          >
            <Ionicons name={item.icon} size={26} color="#323232" />
            <Text style={{ fontSize: 16 }}>{item.label}</Text>
          </View>
          <Ionicons name="chevron-forward-outline" size={20} color="#323232" />
        </TouchableOpacity>
      ))}

      {/* logout */}
      <View style={{ alignItems: "center", marginTop: 20, marginBottom: 80 }}>
        <TouchableOpacity
          style={{
            paddingVertical: 12,
            paddingHorizontal: 24,
            borderRadius: 8,
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={handleLogout}
        >
          <Text
            style={{
              color: "#991B1B",
              fontSize: 16,
              fontFamily: "Inter_600SemiBold",
            }}
          >
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ContainerSettings>
  );
};

export default SettingsScreen;
