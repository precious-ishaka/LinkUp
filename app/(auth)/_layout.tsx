import { Stack } from "expo-router";
import { ThemeProvider } from "../context/useTheme";

export default function AuthLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgotPassword" />
      </Stack>
    </ThemeProvider>
  );
}
