import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";

export default function Register() {
  const { colors, isDark } = useTheme();
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.fullName) e.fullName = "Required";
    if (!form.username) e.username = "Required";
    if (!form.email.includes("@")) e.email = "Valid email required";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)");
    }, 1500);
  };

  const s = styles(colors, isDark);

  const fields: {
    key: keyof typeof form;
    label: string;
    placeholder: string;
    secure?: boolean;
    keyboard?: any;
  }[] = [
    { key: "fullName", label: "Full Name", placeholder: "John Doe" },
    { key: "username", label: "Username", placeholder: "@johndoe" },
    {
      key: "email",
      label: "Email",
      placeholder: "you@example.com",
      keyboard: "email-address",
    },
    {
      key: "password",
      label: "Password",
      placeholder: "••••••••",
      secure: true,
    },
    {
      key: "confirmPassword",
      label: "Confirm Password",
      placeholder: "••••••••",
      secure: true,
    },
  ];

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.blobTop} />
      <View style={s.blobBottom} />

      {/* Back Button */}
      <TouchableOpacity style={s.backBtn} onPress={() => router.back()}>
        <Text style={s.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={s.header}>
        <View style={s.logoCircle}>
          <Text style={s.logoEmoji}>✨</Text>
        </View>
        <Text style={s.title}>Create Account</Text>
        <Text style={s.subtitle}>Join LinkUp and start connecting</Text>
      </View>

      <View style={s.card}>
        {fields.map(({ key, label, placeholder, secure, keyboard }) => (
          <View key={key} style={s.inputGroup}>
            <Text style={s.label}>{label}</Text>
            <View style={s.inputRow}>
              <TextInput
                style={[
                  s.input,
                  { flex: 1 },
                  errors[key] ? s.inputError : null,
                ]}
                placeholder={" "}
                placeholderTextColor={colors.textMuted}
                value={form[key]}
                onChangeText={(v) => update(key, v)}
                secureTextEntry={secure && !showPassword}
                keyboardType={keyboard}
                autoCapitalize={
                  key === "email"
                    ? "none"
                    : key === "username"
                      ? "none"
                      : "words"
                }
              />
              {secure && key === "password" && (
                <TouchableOpacity
                  style={s.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text>
                    {showPassword ? (
                      <Image
                        style={{ width: 16, height: 16 }}
                        source={require("../images/close.png")}
                      />
                    ) : (
                      <Image
                        style={{ width: 16, height: 16 }}
                        source={require("../images/show.png")}
                      />
                    )}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            {errors[key] && <Text style={s.errorText}>{errors[key]}</Text>}
          </View>
        ))}

        {/* Terms */}
        <Text style={s.termsText}>
          By signing up, you agree to our{" "}
          <Text style={s.termsLink}>Terms of Service</Text> and{" "}
          <Text style={s.termsLink}>Privacy Policy</Text>
        </Text>

        <TouchableOpacity
          style={[s.primaryBtn, loading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={s.loginRow}>
          <Text style={s.loginText}>Already have an account? </Text>
          <Link href="/(auth)/login" asChild>
            <TouchableOpacity>
              <Text style={s.loginLink}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flexGrow: 1, paddingBottom: 40 },
    blobTop: {
      position: "absolute",
      top: -60,
      right: -60,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      opacity: 0.4,
    },
    blobBottom: {
      position: "absolute",
      bottom: 100,
      left: -80,
      width: 200,
      height: 200,
      borderRadius: 100,
      backgroundColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
      opacity: 0.15,
    },
    backBtn: { marginTop: 56, marginLeft: 20, marginBottom: 8 },
    backText: { fontSize: 16, color: AppColors.primary, fontWeight: "600" },
    header: { alignItems: "center", paddingVertical: 20 },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: AppColors.accentDark,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 12,
      elevation: 8,
    },
    logoEmoji: { fontSize: 30 },
    title: {
      fontSize: 28,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -0.5,
    },
    subtitle: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
    card: {
      marginHorizontal: 20,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 24,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.4 : 0.06,
      shadowRadius: 20,
      elevation: 6,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
    },
    inputGroup: { marginBottom: 14 },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.6,
    },
    inputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
    input: {
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      paddingHorizontal: 14,
      paddingVertical: 13,
      fontSize: 15,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    inputError: { borderColor: AppColors.danger },
    errorText: { fontSize: 12, color: AppColors.danger, marginTop: 4 },
    eyeBtn: {
      padding: 12,
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    termsText: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: "center",
      marginBottom: 20,
      marginTop: 4,
      lineHeight: 18,
    },
    termsLink: { color: AppColors.primary, fontWeight: "600" },
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
      marginBottom: 16,
    },
    primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
    loginRow: { flexDirection: "row", justifyContent: "center" },
    loginText: { fontSize: 14, color: colors.textSecondary },
    loginLink: { fontSize: 14, color: AppColors.primary, fontWeight: "700" },
  });
