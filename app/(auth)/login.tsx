import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
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

const { width } = Dimensions.get("window");

export default function Login() {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      router.replace("/(tabs)/chats");
    }, 1500);
  };

  const handleOAuth = async (provider: "google" | "github") => {
    setOauthLoading(provider);
    // Simulate OAuth flow
    setTimeout(() => {
      setOauthLoading(null);
      router.replace("/(tabs)/chats");
    }, 2000);
  };

  const s = styles(colors, isDark);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header Blob */}
      <View style={s.blob} />

      <View style={s.logoContainer}>
        <View style={s.logoCircle}>
          <Text style={s.logoEmoji}>💬</Text>
        </View>
        <Text style={s.appName}>LinkUp</Text>
        <Text style={s.tagline}>Connect. Chat. Thrive.</Text>
      </View>

      <View style={s.card}>
        <Text style={s.cardTitle}>Welcome back</Text>
        <Text style={s.cardSubtitle}>Sign in to your account</Text>

        {/* Email */}
        <View style={s.inputGroup}>
          <Text style={s.label}>Email</Text>
          <TextInput
            style={s.input}
            placeholder=" "
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <View style={s.inputGroup}>
          <Text style={s.label}>Password</Text>
          <View style={s.passwordRow}>
            <TextInput
              style={[s.input, { flex: 1 }]}
              placeholder=" "
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={s.eyeBtn}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={s.eyeText}>
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
          </View>
        </View>

        {/* Forgot password */}
        <Link href="/(auth)/forgotPassword" asChild>
          <TouchableOpacity style={s.forgotBtn}>
            <Text style={s.forgotText}>Forgot password?</Text>
          </TouchableOpacity>
        </Link>

        {/* Login Button */}
        <TouchableOpacity
          style={[s.primaryBtn, loading && s.btnDisabled]}
          onPress={handleLogin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.primaryBtnText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* Divider */}
        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or continue with</Text>
          <View style={s.dividerLine} />
        </View>

        {/* OAuth Buttons */}
        <TouchableOpacity
          style={s.oauthBtn}
          onPress={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          activeOpacity={0.85}
        >
          {oauthLoading === "google" ? (
            <ActivityIndicator color={AppColors.primary} size="small" />
          ) : (
            <>
              <Image
                style={{ width: 24, height: 24 }}
                source={require("../images/google-icon.png")}
              />
              <Text style={s.oauthText}>Continue with Google</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[s.oauthBtn, s.githubBtn]}
          onPress={() => handleOAuth("github")}
          disabled={!!oauthLoading}
          activeOpacity={0.85}
        >
          {oauthLoading === "github" ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Image
                style={{ width: 24, height: 24 }}
                source={require("../images/github-icon.png")}
              />
              <Text style={[s.oauthText, { color: "#fff" }]}>
                Continue with GitHub
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Register link */}
        <View style={s.registerRow}>
          <Text style={s.registerText}>Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <TouchableOpacity>
              <Text style={s.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flexGrow: 1,
      paddingBottom: 40,
    },
    blob: {
      position: "absolute",
      top: -100,
      left: -80,
      width: 350,
      height: 350,
      borderRadius: 175,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      opacity: 0.5,
    },
    logoContainer: {
      alignItems: "center",
      paddingTop: 90,
      paddingBottom: 32,
    },
    logoCircle: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: AppColors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 12,
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.4,
      shadowRadius: 16,
      elevation: 10,
    },
    logoEmoji: { fontSize: 34 },
    appName: {
      fontSize: 36,
      fontWeight: "800",
      color: AppColors.primary,
      letterSpacing: -1,
    },
    tagline: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 4,
    },
    card: {
      marginHorizontal: 20,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 24,
      padding: 24,
      shadowColor: isDark ? AppColors.primaryDeep : "#000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.5 : 0.08,
      shadowRadius: 24,
      elevation: 8,
      borderWidth: isDark ? 1 : 0,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 4,
    },
    cardSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 24,
    },
    inputGroup: { marginBottom: 16 },
    label: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: 6,
      textTransform: "uppercase",
      letterSpacing: 0.5,
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
    },
    passwordRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    eyeBtn: {
      padding: 10,
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    eyeText: { fontSize: 18 },
    forgotBtn: { alignSelf: "flex-end", marginBottom: 20, marginTop: 4 },
    forgotText: {
      fontSize: 13,
      color: AppColors.primary,
      fontWeight: "600",
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
    },
    btnDisabled: { opacity: 0.7 },
    primaryBtnText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "700",
      letterSpacing: 0.3,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
      gap: 10,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    dividerText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: "500",
    },
    oauthBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
      borderRadius: BorderRadius.md,
      paddingVertical: 14,
      marginBottom: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.inputBg,
    },
    githubBtn: {
      backgroundColor: "#24292e",
      borderColor: "#24292e",
    },
    oauthIcon: { fontSize: 20 },
    oauthText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    registerRow: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 8,
    },
    registerText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    registerLink: {
      fontSize: 14,
      color: AppColors.primary,
      fontWeight: "700",
    },
  });
