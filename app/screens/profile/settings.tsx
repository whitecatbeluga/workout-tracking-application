import { useAppDispatch } from "@/hooks/use-app-dispatch";
import { useAppSelector } from "@/hooks/use-app-selector";
import { logout } from "@/redux/auth-slice";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";

const SettingsScreen = () => {
  const user = useAppSelector((state) => state.auth.user);

  const appDispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await appDispatch(logout());

      if (res.type == "auth/logout/fulfilled") {
        router.replace("/screens/landingPage/login-page");
      }
      if (res.type === "auth/logout/rejected") {
        console.log("logout failed.", res);
      }
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {/* user info */}
        <View
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
        </View>

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
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
