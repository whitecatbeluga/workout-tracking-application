import { Stack } from "expo-router";

export default function ProfileScreensLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="calendar"
        options={{
          title: "Calendar",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="workouts"
        options={{
          title: "Workouts",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="measures"
        options={{
          title: "Measures",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="routines"
        options={{
          title: "Routines",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="statistics"
        options={{
          title: "Statistics",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />

      {/* under profile */}
      <Stack.Screen
        name="settings/settings-layout"
        options={{
          title: "Settings",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="settings/edit-profile"
        options={{
          title: "Edit Profile",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="settings/account-details"
        options={{
          title: "Account Details",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="settings/contact-us"
        options={{
          title: "Contact Us",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="settings/terms-of-service"
        options={{
          title: "Terms of Service",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
      <Stack.Screen
        name="settings/about-us"
        options={{
          title: "About Us",
          headerTitleAlign: "center",
          headerTitleStyle: {
            fontSize: 18,
            fontFamily: "Inter_400Regular",
          },
        }}
      />
    </Stack>
  );
}
