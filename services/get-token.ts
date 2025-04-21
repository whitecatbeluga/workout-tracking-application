import AsyncStorage from "@react-native-async-storage/async-storage";

export const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem("token");
    return token ? token : null;
  } catch (error) {
    console.error("Error fetching token from AsyncStorage:", error);
    return null;
  }
};
