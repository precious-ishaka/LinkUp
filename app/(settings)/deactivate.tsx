import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";
import { AuthAPI } from "../service/api";

const REASONS = [
  "I need a break from social media",
  "I have privacy concerns",
  "I'm getting too many notifications",
  "The app isn't useful for me",
  "I created a duplicate account",
  "Other reason",
];

export default function Deactivate() {
  const { colors, isDark } = useTheme();
  const [reason, setReason] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleDeactivate = () => {
    if (!password) {
      Alert.alert(
        "Password required",
        "Please enter your password to confirm.",
      );
      return;
    }
    Alert.alert(
      "⚠️ Deactivate Account",
      "Your account will be hidden from all users. You can reactivate it any time by logging back in. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Deactivate",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              // await UserAPI.deactivateAccount();
              await new Promise((r) => setTimeout(r, 1500));
              await AuthAPI.clearTokens();
              Alert.alert(
                "Account Deactivated",
                "Your account has been deactivated. We hope to see you back soon 💜",
                [
                  {
                    text: "OK",
                    onPress: () => router.replace("/(auth)/login"),
                  },
                ],
              );
            } catch {
              Alert.alert("Error", "Failed to deactivate. Please try again.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const s = styles(colors, isDark);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Warning header */}
      <View style={s.warning}>
        <Text style={s.warningEmoji}>⚠️</Text>
        <Text style={s.warningTitle}>Deactivate Account</Text>
        <Text style={s.warningText}>
          Deactivating your account will hide your profile and posts from all
          users. You can reactivate at any time by signing in again.
        </Text>
      </View>

      {/* What happens */}
      <View style={s.card}>
        <Text style={s.cardTitle}>What happens when you deactivate?</Text>
        {[
          { icon: "👻", text: "Your profile becomes invisible to others" },
          {
            icon: "💬",
            text: "Your messages will still be visible to recipients",
          },
          { icon: "📸", text: "Your posts and data are preserved" },
          { icon: "🔄", text: "You can reactivate anytime by logging in" },
        ].map((item) => (
          <View key={item.text} style={s.consequenceRow}>
            <Text style={s.consequenceIcon}>{item.icon}</Text>
            <Text style={s.consequenceText}>{item.text}</Text>
          </View>
        ))}
      </View>

      {/* Reason */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Reason (optional)</Text>
        {REASONS.map((r) => (
          <TouchableOpacity
            key={r}
            style={[s.reasonRow, reason === r && s.reasonRowActive]}
            onPress={() => setReason(r)}
          >
            <View style={[s.radioCircle, reason === r && s.radioCircleActive]}>
              {reason === r && <View style={s.radioDot} />}
            </View>
            <Text
              style={[
                s.reasonText,
                reason === r && { color: AppColors.primary },
              ]}
            >
              {r}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Password confirm */}
      <View style={s.card}>
        <Text style={s.cardTitle}>Confirm with Password</Text>
        <TextInput
          style={s.input}
          placeholder="Enter your password"
          placeholderTextColor={colors.textMuted}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Action buttons */}
      <TouchableOpacity
        style={[s.deactivateBtn, (loading || !password) && { opacity: 0.5 }]}
        onPress={handleDeactivate}
        disabled={loading || !password}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.deactivateBtnText}>Deactivate My Account</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={s.cancelBtn} onPress={() => router.back()}>
        <Text style={s.cancelBtnText}>Keep My Account 💜</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 40 },
    warning: {
      alignItems: "center",
      paddingVertical: 28,
      paddingHorizontal: 24,
    },
    warningEmoji: { fontSize: 56, marginBottom: 12 },
    warningTitle: {
      fontSize: 24,
      fontWeight: "800",
      color: AppColors.danger,
      marginBottom: 10,
    },
    warningText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 22,
    },
    card: {
      marginHorizontal: 16,
      marginBottom: 14,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 15,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 12,
    },
    consequenceRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 12,
      paddingVertical: 7,
    },
    consequenceIcon: { fontSize: 18 },
    consequenceText: {
      flex: 1,
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    reasonRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingVertical: 12,
      borderRadius: 10,
      paddingHorizontal: 6,
    },
    reasonRowActive: {
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    radioCircleActive: { borderColor: AppColors.primary },
    radioDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: AppColors.primary,
    },
    reasonText: { fontSize: 14, color: colors.text, flex: 1 },
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
    deactivateBtn: {
      marginHorizontal: 16,
      marginBottom: 12,
      backgroundColor: AppColors.danger,
      borderRadius: BorderRadius.md,
      paddingVertical: 16,
      alignItems: "center",
    },
    deactivateBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    cancelBtn: {
      marginHorizontal: 16,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      borderRadius: BorderRadius.md,
      paddingVertical: 16,
      alignItems: "center",
    },
    cancelBtnText: {
      color: AppColors.primary,
      fontSize: 15,
      fontWeight: "700",
    },
  });
