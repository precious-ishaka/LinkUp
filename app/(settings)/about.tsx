// ── about.tsx ────────────────────────────────────────────────
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors } from "../context/theme";
import { useTheme } from "../context/useTheme";

export default function AboutScreen() {
  const { colors, isDark } = useTheme();
  const s = styles(colors, isDark);
  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.logoSection}>
        <View style={s.logoCircle}>
          <Text style={s.logoEmoji}>💬</Text>
        </View>
        <Text style={s.appName}>LinkUp</Text>
        <Text style={s.version}>Version 1.0.0</Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>About LinkUp</Text>
        <Text style={s.cardText}>
          LinkUp is a modern social chat platform built for seamless
          connections. Share posts, message friends, and stay in the loop.
        </Text>
      </View>
      <View style={s.card}>
        <Text style={s.cardTitle}>Tech Stack</Text>
        {[
          { icon: "📱", label: "React Native + Expo Router" },
          { icon: "⚡", label: "Spring Boot 3 + WebSocket" },
          { icon: "🛡️", label: "OAuth2 (Google & GitHub)" },
          { icon: "💾", label: "PostgreSQL" },
          { icon: "🔐", label: "JWT Authentication" },
          {
            icon: "📡",
            label:
              "All these are not yet implemented, i am still coming up with the websocket",
          },
        ].map((item) => (
          <View key={item.label} style={s.techRow}>
            <Text style={s.techIcon}>{item.icon}</Text>
            <Text style={s.techLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
      <View style={s.card}>
        <TouchableOpacity
          style={s.linkRow}
          onPress={() => Linking.openURL("https://github.com")}
        >
          <Text style={s.linkText}>🌐 Visit our website</Text>
          <Text style={s.linkChevron}>›</Text>
        </TouchableOpacity>
        <View style={s.divider} />
        <TouchableOpacity style={s.linkRow}>
          <Text style={s.linkText}>📄 Privacy Policy</Text>
          <Text style={s.linkChevron}>›</Text>
        </TouchableOpacity>
        <View style={s.divider} />
        <TouchableOpacity style={s.linkRow}>
          <Text style={s.linkText}>📋 Terms of Service</Text>
          <Text style={s.linkChevron}>›</Text>
        </TouchableOpacity>
      </View>
      <Text style={s.footer}>Made with 💜 for the community</Text>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 40 },
    logoSection: { alignItems: "center", paddingVertical: 32 },
    logoCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
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
    logoEmoji: { fontSize: 40 },
    appName: {
      fontSize: 32,
      fontWeight: "900",
      color: AppColors.primary,
      letterSpacing: -1,
    },
    version: { fontSize: 14, color: colors.textMuted, marginTop: 4 },
    card: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardTitle: {
      fontSize: 16,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 10,
    },
    cardText: { fontSize: 14, color: colors.textSecondary, lineHeight: 22 },
    techRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 8,
    },
    techIcon: { fontSize: 18 },
    techLabel: { fontSize: 14, color: colors.text, fontWeight: "500" },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
    },
    linkText: { fontSize: 15, color: AppColors.primary, fontWeight: "600" },
    linkChevron: { fontSize: 20, color: colors.textMuted },
    divider: { height: 1, backgroundColor: colors.border },
    footer: {
      textAlign: "center",
      color: colors.textMuted,
      fontSize: 13,
      marginTop: 8,
    },
  });
