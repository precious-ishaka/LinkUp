import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";
export default function ForgotPassword() {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleReset = () => {
    if (!email.includes("@")) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

  const s = styles(colors, isDark);

  return (
    <View style={s.container}>
      <View style={s.blob} />

      <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
        <Text style={s.backText}>← Back to Login</Text>
      </TouchableOpacity>

      <View style={s.main}>
        <View style={s.iconWrap}>
          <Text style={s.icon}>{sent ? "📬" : "🔐"}</Text>
        </View>

        <Text style={s.title}>{sent ? "Email Sent!" : "Forgot Password?"}</Text>
        <Text style={s.subtitle}>
          {sent
            ? `We sent a reset link to ${email}. Check your inbox and follow the instructions.`
            : "No worries! Enter your email and we'll send you a reset link."}
        </Text>

        {!sent && (
          <View style={s.card}>
            <Text style={s.label}>Email Address</Text>
            <TextInput
              style={s.input}
              placeholder=" "
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TouchableOpacity
              style={[s.primaryBtn, (loading || !email) && { opacity: 0.6 }]}
              onPress={handleReset}
              disabled={loading || !email}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.primaryBtnText}>Send Reset Link</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {sent && (
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.replace("/(auth)/login")}
            activeOpacity={0.85}
          >
            <Text style={s.primaryBtnText}>Back to Login</Text>
          </TouchableOpacity>
        )}

        {!sent && (
          <Text style={s.helpText}>
            Remember your password?{" "}
            <Text
              style={s.loginLink}
              onPress={() => router.replace("/(auth)/login")}
            >
              Sign In
            </Text>
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    blob: {
      position: "absolute",
      top: -80,
      right: -60,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      opacity: 0.45,
    },
    backBtn: { marginTop: 60, marginLeft: 20 },
    backText: { fontSize: 15, color: AppColors.primary, fontWeight: "600" },
    main: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: "center",
      paddingBottom: 60,
    },
    iconWrap: {
      width: 90,
      height: 90,
      borderRadius: 45,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "center",
      marginBottom: 24,
    },
    icon: { fontSize: 44 },
    title: {
      fontSize: 30,
      fontWeight: "800",
      color: colors.text,
      textAlign: "center",
      marginBottom: 12,
    },
    subtitle: {
      fontSize: 15,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 32,
    },
    card: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: 20,
      padding: 20,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.07,
      shadowRadius: 14,
      elevation: 4,
    },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 8,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    input: {
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      paddingHorizontal: 14,
      paddingVertical: 14,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.border,
      marginBottom: 16,
    },
    primaryBtn: {
      backgroundColor: AppColors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: 16,
      alignItems: "center",
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 8,
      marginTop: 8,
    },
    primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    helpText: {
      textAlign: "center",
      color: colors.textSecondary,
      marginTop: 24,
      fontSize: 14,
    },
    loginLink: { color: AppColors.primary, fontWeight: "700" },
  });
