import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";

const STATUS_OPTIONS = [
  { label: "🟢 Online", value: "ONLINE", color: AppColors.online },
  { label: "🟡 Away", value: "AWAY", color: AppColors.warning },
  { label: "⚫ Offline", value: "OFFLINE", color: AppColors.offline },
] as const;

const MY_POSTS = [
  { id: "1", emoji: "🏙️", label: "Photo post" },
  { id: "2", emoji: "📝", label: "Text post" },
  { id: "3", emoji: "🎨", label: "Design post" },
  { id: "4", emoji: "💡", label: "Idea post" },
  { id: "5", emoji: "🔥", label: "Fire post" },
  { id: "6", emoji: "📱", label: "App post" },
];

export default function ProfileScreen() {
  const { colors, isDark } = useTheme();
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"ONLINE" | "AWAY" | "OFFLINE">("ONLINE");
  const [showStatusModal, setShowStatusModal] = useState(false);

  const user = {
    fullName: "Ishaka Precious",
    username: "@itachi",
    bio: "Nothing is Hard We are Just New To It",
    friendsCount: 247,
    onlineFriendsCount: 31,
    postsCount: 4,
  };

  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow photo access to update your avatar.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      setUploading(true);
      try {
        // const res = await UserAPI.uploadAvatar(result.assets[0].uri);
        // Simulated upload
        await new Promise((r) => setTimeout(r, 1500));
        Alert.alert("Success", "Profile picture updated! ✨");
      } catch {
        Alert.alert("Error", "Failed to upload photo. Try again.");
      } finally {
        setUploading(false);
      }
    }
  };

  const changeStatus = (newStatus: typeof status) => {
    setStatus(newStatus);
    setShowStatusModal(false);
    // UserAPI.updateStatus(newStatus);
  };

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === status)!;

  const s = styles(colors, isDark);

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Profile</Text>
        <TouchableOpacity
          style={s.settingsBtn}
          onPress={() => router.push("/settings" as any)}
        >
          <Text style={s.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover / Banner */}
        <View style={s.banner}>
          <View style={s.bannerGradient} />
          <Text style={s.bannerPattern}>◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇ ◆ ◇ ◆</Text>
        </View>

        {/* Avatar + Info */}
        <View style={s.profileArea}>
          {/* Avatar */}
          <TouchableOpacity
            style={s.avatarWrap}
            onPress={pickAvatar}
            activeOpacity={0.85}
          >
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={s.avatarImage} />
            ) : (
              <View style={s.avatarPlaceholder}>
                <Text style={s.avatarEmoji}>👤</Text>
              </View>
            )}
            <View style={s.avatarEditBadge}>
              {uploading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={s.avatarEditIcon}>📷</Text>
              )}
            </View>
            <View
              style={[
                s.avatarStatusDot,
                { backgroundColor: currentStatus.color },
              ]}
            />
          </TouchableOpacity>

          {/* Name + status */}
          <View style={s.nameRow}>
            <Text style={s.fullName}>{user.fullName}</Text>
            <TouchableOpacity
              style={[
                s.statusBadge,
                { backgroundColor: `${currentStatus.color}22` },
              ]}
              onPress={() => setShowStatusModal(true)}
            >
              <Text style={[s.statusBadgeText, { color: currentStatus.color }]}>
                {currentStatus.label}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={s.username}>{user.username}</Text>
          <Text style={s.bio}>{user.bio}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statNumber}>{user.postsCount}</Text>
            <Text style={s.statLabel}>Posts</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={s.statNumber}>{user.friendsCount}</Text>
            <Text style={s.statLabel}>Friends</Text>
          </View>
          <View style={s.statDivider} />
          <View style={s.statItem}>
            <Text style={[s.statNumber, { color: AppColors.online }]}>
              {user.onlineFriendsCount}
            </Text>
            <Text style={s.statLabel}>🟢 Online</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={s.actionRow}>
          <TouchableOpacity
            style={s.editProfileBtn}
            onPress={() => router.push("../(settings)/editProfile" as any)}
          >
            <Text style={s.editProfileText}>
              <Image
                source={require("../images/edit-icon.png")}
                style={{ width: 20, height: 20 }}
              />{" "}
              Edit Profile
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={s.shareBtn}
            onPress={() => Alert.alert("Share", "Profile link copied!")}
          >
            <Text style={s.shareText}>📤</Text>
          </TouchableOpacity>
        </View>

        {/* Friends Online Preview */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Friends Online</Text>
            <TouchableOpacity>
              <Text style={s.sectionSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {["👩🏾", "👨🏿", "👩🏽", "🧑🏿", "👨🏾"].map((emoji, i) => (
              <View key={i} style={s.onlineFriend}>
                <View style={s.onlineFriendAvatar}>
                  <Text style={{ fontSize: 26 }}>{emoji}</Text>
                  <View style={s.onlineFriendDot} />
                </View>
                <Text style={s.onlineFriendName}>Friend {i + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Posts Grid */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>My Posts</Text>
            <TouchableOpacity>
              <Text style={s.sectionSeeAll}>See all</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Status Modal */}
      <Modal visible={showStatusModal} transparent animationType="fade">
        <TouchableOpacity
          style={s.modalOverlay}
          onPress={() => setShowStatusModal(false)}
          activeOpacity={1}
        >
          <View style={s.statusModal}>
            <Text style={s.statusModalTitle}>Set Status</Text>
            {STATUS_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[
                  s.statusOption,
                  status === opt.value && s.statusOptionActive,
                ]}
                onPress={() => changeStatus(opt.value)}
              >
                <Text style={s.statusOptionText}>{opt.label}</Text>
                {status === opt.value && (
                  <Text style={{ color: AppColors.primary }}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "800",
      color: colors.text,
      letterSpacing: -0.5,
    },
    settingsBtn: { padding: 6 },
    settingsIcon: { fontSize: 24 },
    banner: {
      height: 130,
      backgroundColor: AppColors.primary,
      overflow: "hidden",
      justifyContent: "center",
    },
    bannerGradient: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: AppColors.primaryDark,
      opacity: 0.5,
    },
    bannerPattern: {
      fontSize: 22,
      color: "#ffffff33",
      letterSpacing: 4,
      textAlign: "center",
    },
    profileArea: { paddingHorizontal: 20, marginTop: -40, marginBottom: 8 },
    avatarWrap: {
      position: "relative",
      width: 96,
      height: 96,
      marginBottom: 12,
    },
    avatarImage: {
      width: 96,
      height: 96,
      borderRadius: 48,
      borderWidth: 4,
      borderColor: colors.background,
    },
    avatarPlaceholder: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 4,
      borderColor: colors.background,
    },
    avatarEmoji: { fontSize: 48 },
    avatarEditBadge: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 30,
      height: 30,
      borderRadius: 15,
      backgroundColor: AppColors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },
    avatarEditIcon: { fontSize: 13 },
    avatarStatusDot: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2.5,
      borderColor: colors.background,
    },
    nameRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      flexWrap: "wrap",
    },
    fullName: { fontSize: 24, fontWeight: "800", color: colors.text },
    statusBadge: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: BorderRadius.full,
    },
    statusBadgeText: { fontSize: 12, fontWeight: "700" },
    username: {
      fontSize: 14,
      color: AppColors.primary,
      marginTop: 2,
      fontWeight: "600",
    },
    bio: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 8,
      lineHeight: 20,
    },
    statsRow: {
      flexDirection: "row",
      backgroundColor: colors.surfaceElevated,
      marginHorizontal: 20,
      borderRadius: 16,
      paddingVertical: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statItem: { flex: 1, alignItems: "center" },
    statNumber: { fontSize: 22, fontWeight: "800", color: colors.text },
    statLabel: { fontSize: 12, color: colors.textSecondary, marginTop: 2 },
    statDivider: { width: 1, backgroundColor: colors.border },
    actionRow: {
      flexDirection: "row",
      paddingHorizontal: 20,
      gap: 10,
      marginBottom: 20,
    },
    editProfileBtn: {
      flex: 1,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      borderRadius: BorderRadius.md,
      paddingVertical: 12,
      alignItems: "center",
    },
    editProfileText: {
      color: AppColors.primary,
      fontWeight: "700",
      fontSize: 14,
    },
    shareBtn: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    shareText: { fontSize: 20 },
    section: { paddingHorizontal: 20, marginBottom: 20 },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
    sectionSeeAll: {
      fontSize: 13,
      color: AppColors.primary,
      fontWeight: "600",
    },
    onlineFriend: { alignItems: "center", marginRight: 16 },
    onlineFriendAvatar: {
      position: "relative",
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 4,
      borderWidth: 2,
      borderColor: AppColors.primary,
    },
    onlineFriendDot: {
      position: "absolute",
      bottom: 1,
      right: 1,
      width: 13,
      height: 13,
      borderRadius: 7,
      backgroundColor: AppColors.online,
      borderWidth: 2,
      borderColor: colors.background,
    },
    onlineFriendName: { fontSize: 11, color: colors.textSecondary },
    postsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    postThumb: {
      width: "31.5%",
      aspectRatio: 1,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "center",
    },
    postThumbEmoji: { fontSize: 40 },
    // Status modal
    modalOverlay: {
      flex: 1,
      backgroundColor: "#00000066",
      justifyContent: "center",
      alignItems: "center",
    },
    statusModal: {
      width: 280,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    statusModalTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 16,
    },
    statusOption: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 14,
      paddingHorizontal: 12,
      borderRadius: 12,
      marginBottom: 4,
    },
    statusOptionActive: {
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
    },
    statusOptionText: { fontSize: 16, color: colors.text, fontWeight: "600" },
  });
