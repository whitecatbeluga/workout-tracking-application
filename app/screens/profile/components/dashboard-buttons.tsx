import { Text, TouchableOpacity, View } from "react-native";
import Styles from "../styles";
import { router } from "expo-router";

type Props = {
  routeName: string;
  routeUrl: string;
};

const DashboardButtons = ({ routeName, routeUrl }: Props) => {
  return (
    <View>
      <TouchableOpacity
        style={Styles.dashboardButton}
        onPress={() => router.push(routeUrl)}
      >
        <Text style={Styles.dashboardButtonText}>{routeName}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DashboardButtons;
