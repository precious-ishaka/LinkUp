import { Stack } from "expo-router";
import { AppColors } from "../context/theme";
import { ThemeProvider, useTheme } from "../context/useTheme";

export default function SettingsLayout() {
  const { colors } = useTheme();
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: AppColors.primary,
          headerTitleStyle: { fontWeight: "700", color: colors.text },
          headerShadowVisible: false,
          headerBackTitle: "Back",
        }}
      >
        <Stack.Screen name="editProfile" options={{ title: "Edit Profile" }} />
        <Stack.Screen name="about" options={{ title: "About" }} />
        <Stack.Screen name="contact" options={{ title: "Contact Us" }} />
        <Stack.Screen name="invite" options={{ title: "Invite Friends" }} />
        <Stack.Screen
          name="deactivate"
          options={{ headerShown: false, title: "Deactivate Account" }}
        />
      </Stack>
    </ThemeProvider>
  );
}
