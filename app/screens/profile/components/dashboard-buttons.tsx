import { Text, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { router, Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  routeName: string;
  routeUrl: Href;
  routeIcon: keyof typeof Ionicons.glyphMap;
};

const DashboardButtons = ({ routeName, routeUrl, routeIcon }: Props) => {
  return (
    <View>
      <TouchableOpacity
        style={Styles.dashboardButton}
        onPress={() => router.push(routeUrl)}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name={routeIcon} size={20} color="#323232" />
          <Text style={Styles.dashboardButtonText}>{routeName}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#323232" />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardButtons;
