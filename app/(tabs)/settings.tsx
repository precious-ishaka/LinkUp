import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../context/theme";
import { useTheme } from "../context/useTheme";
import { AuthAPI } from "../service/api";

type Status = "ONLINE" | "OFFLINE";

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [userStatus, setUserStatus] = useState<Status>("ONLINE");
  const [notifications, setNotifications] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleStatus = () => {
    const next: Status = userStatus === "ONLINE" ? "OFFLINE" : "ONLINE";
    setUserStatus(next);
    // UserAPI.updateStatus(next);
  };

  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "destructive",
        onPress: async () => {
          await AuthAPI.clearTokens();
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  const s = styles(colors, isDark);

  type RowProps = {
    icon: string;
    label: string;
    onPress?: () => void;
    right?: React.ReactNode;
    danger?: boolean;
    description?: string;
  };

  const Row = ({
    icon,
    label,
    onPress,
    right,
    danger,
    description,
  }: RowProps) => (
    <TouchableOpacity
      style={s.row}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[s.rowIcon, danger && s.rowIconDanger]}>
        <Text style={s.rowIconText}>{icon}</Text>
      </View>
      <View style={s.rowMiddle}>
        <Text style={[s.rowLabel, danger && { color: AppColors.danger }]}>
          {label}
        </Text>
        {description && <Text style={s.rowDesc}>{description}</Text>}
      </View>
      {right !== undefined ? (
        right
      ) : onPress ? (
        <Text style={s.rowChevron}>›</Text>
      ) : null}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text style={s.sectionHeader}>{title}</Text>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Profile card */}
        <TouchableOpacity
          style={s.profileCard}
          onPress={() => router.push("/editProfile" as any)}
          activeOpacity={0.85}
        >
          <View style={s.profileAvatar}>
            <Text style={{ fontSize: 38 }}>👤</Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={s.profileName}>Ishaka Precious</Text>
            <Text style={s.profileUsername}>@itachi</Text>
            <Text style={s.profileEdit}>Tap to edit profile →</Text>
          </View>
        </TouchableOpacity>

        {/* Appearance */}
        <SectionHeader title="Appearance" />
        <View style={s.section}>
          <Row
            icon="🌙"
            label="Switch Theme"
            description={isDark ? " Dark" : " Light"}
            right={
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{
                  false: colors.border,
                  true: AppColors.primaryLight,
                }}
                thumbColor={isDark ? AppColors.primary : colors.textMuted}
              />
            }
          />
        </View>

        {/* Account */}
        <SectionHeader title="Account" />
        <View style={s.section}>
          <Row
            icon="✏️"
            label="Edit Profile"
            onPress={() => router.push("/editProfile" as any)}
          />
          <View style={s.rowSep} />
          <Row
            icon={userStatus === "ONLINE" ? "🟢" : "⚫"}
            label={
              userStatus === "ONLINE" ? "Status: Online" : "Status: Offline"
            }
            description="Switch your visibility"
            right={
              <Switch
                value={userStatus === "ONLINE"}
                onValueChange={toggleStatus}
                trackColor={{
                  false: colors.border,
                  true: AppColors.online + "99",
                }}
                thumbColor={
                  userStatus === "ONLINE" ? AppColors.online : colors.textMuted
                }
              />
            }
          />
        </View>

        {/* Notifications */}
        <SectionHeader title="Notifications" />
        <View style={s.section}>
          <Row
            icon="🔔"
            label="Push Notifications"
            right={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{
                  false: colors.border,
                  true: AppColors.primaryLight,
                }}
                thumbColor={
                  notifications ? AppColors.primary : colors.textMuted
                }
              />
            }
          />
          <View style={s.rowSep} />
          <Row
            icon="🔊"
            label="Message Sounds"
            right={
              <Switch
                value={soundEnabled}
                onValueChange={setSoundEnabled}
                trackColor={{
                  false: colors.border,
                  true: AppColors.primaryLight,
                }}
                thumbColor={soundEnabled ? AppColors.primary : colors.textMuted}
              />
            }
          />
        </View>

        {/* Community */}
        <SectionHeader title="Community" />
        <View style={s.section}>
          <Row
            icon="📨"
            label="Invite Friends"
            description="Share LinkUp with your circle"
            onPress={() => router.push("/invite" as any)}
          />
        </View>

        {/* Support */}
        <SectionHeader title="Support" />
        <View style={s.section}>
          <Row
            icon="ℹ️"
            label="About"
            onPress={() => router.push("/about" as any)}
          />
          <View style={s.rowSep} />
          <Row
            icon="💬"
            label="Contact Us"
            onPress={() => router.push("/contact" as any)}
          />

          <View style={s.rowSep} />
          <Row
            icon="🔒"
            label="Privacy Policy"
            onPress={() => router.push("/privacy" as any)}
          />
          <View style={s.rowSep} />
          <Row
            icon="📄"
            label="Terms of Service"
            onPress={() => router.push("/terms" as any)}
          />
        </View>

        {/* Danger Zone */}
        <SectionHeader title="Account Actions" />
        <View style={s.section}>
          <Row icon="🚪" label="Log Out" onPress={handleLogout} danger />
          <View style={s.rowSep} />
          <Row
            icon="⚠️"
            label="Deactivate Account"
            description="Temporarily disable your account"
            onPress={() => router.push("/deactivate" as any)}
            danger
          />
        </View>

        <Text style={s.version}>LinkUp v1.0.0 · Made By ISHAKA</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    profileCard: {
      flexDirection: "row",
      alignItems: "center",
      margin: 16,
      padding: 16,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      borderRadius: 20,
      gap: 14,
      borderWidth: 1,
      borderColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
    },
    profileAvatar: {
      width: 68,
      height: 68,
      borderRadius: 34,
      backgroundColor: isDark
        ? AppColors.primaryDark
        : AppColors.primary + "22",
      alignItems: "center",
      justifyContent: "center",
    },
    profileInfo: { flex: 1 },
    profileName: { fontSize: 18, fontWeight: "800", color: colors.text },
    profileUsername: { fontSize: 13, color: AppColors.primary, marginTop: 2 },
    profileEdit: { fontSize: 12, color: colors.textSecondary, marginTop: 4 },
    sectionHeader: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textMuted,
      textTransform: "uppercase",
      letterSpacing: 1,
      marginHorizontal: 20,
      marginTop: 20,
      marginBottom: 6,
    },
    section: {
      marginHorizontal: 16,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 14,
      gap: 12,
    },
    rowIcon: {
      width: 36,
      height: 36,
      borderRadius: 10,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
    },
    rowIconDanger: {
      backgroundColor: `${AppColors.danger}22`,
    },
    rowIconText: { fontSize: 18 },
    rowMiddle: { flex: 1 },
    rowLabel: { fontSize: 15, fontWeight: "600", color: colors.text },
    rowDesc: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
    rowChevron: { fontSize: 22, color: colors.textMuted, fontWeight: "300" },
    rowSep: { height: 1, backgroundColor: colors.borderLight, marginLeft: 64 },
    version: {
      textAlign: "center",
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 24,
    },
  });
