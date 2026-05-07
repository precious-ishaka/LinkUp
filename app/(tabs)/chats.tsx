import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";
import { ChatRoom } from "../service/api";

// ── Mock data used until real API is ready ──────────────────
const MOCK_CHATS: ChatRoom[] = [
  {
    id: "1",
    isGroup: false,
    participants: [],
    unreadCount: 3,
    createdAt: "",
    lastMessage: {
      id: "m1",
      chatRoomId: "1",
      content: "Hey, are you free tonight?",
      type: "TEXT",
      readBy: [],
      createdAt: "2024-01-01T10:00:00Z",
      sender: {
        id: "u1",
        fullName: "Amara Osei",
        username: "@amara",
        email: "",
        status: "ONLINE",
        friendsCount: 0,
        onlineFriendsCount: 0,
        createdAt: "",
      },
    },
    name: "Amara Osei",
  },
  {
    id: "2",
    isGroup: true,
    participants: [],
    unreadCount: 12,
    createdAt: "",
    lastMessage: {
      id: "m2",
      chatRoomId: "2",
      content: "Kofi: Let's ship by Friday ",
      type: "TEXT",
      readBy: [],
      createdAt: "2024-01-01T09:30:00Z",
      sender: {
        id: "u2",
        fullName: "Kofi Mensah",
        username: "@kofi",
        email: "",
        status: "ONLINE",
        friendsCount: 0,
        onlineFriendsCount: 0,
        createdAt: "",
      },
    },
    name: "Dev Squad 🛠️",
  },
  {
    id: "3",
    isGroup: false,
    participants: [],
    unreadCount: 0,
    createdAt: "",
    lastMessage: {
      id: "m3",
      chatRoomId: "3",
      content: "The design looks amazing! ",
      type: "TEXT",
      readBy: [],
      createdAt: "2024-01-01T08:00:00Z",
      sender: {
        id: "u3",
        fullName: "Zara Nwosu",
        username: "@zara",
        email: "",
        status: "AWAY",
        friendsCount: 0,
        onlineFriendsCount: 0,
        createdAt: "",
      },
    },
    name: "Zara Nwosu",
  },
  {
    id: "4",
    isGroup: true,
    participants: [],
    unreadCount: 1,
    createdAt: "",
    lastMessage: {
      id: "m4",
      chatRoomId: "4",
      content: "Meeting at 3pm today",
      type: "TEXT",
      readBy: [],
      createdAt: "2024-01-01T07:00:00Z",
      sender: {
        id: "u4",
        fullName: "Emeka Eze",
        username: "@emeka",
        email: "",
        status: "OFFLINE",
        friendsCount: 0,
        onlineFriendsCount: 0,
        createdAt: "",
      },
    },
    name: "Lagos Tech Hub 🌍",
  },
];

const AVATARS: Record<string, string> = {
  "1": "👩🏾",
  "2": "👥",
  "3": "👩🏿",
  "4": "🌍",
};

const STATUS_COLOR: Record<string, string> = {
  ONLINE: AppColors.online,
  AWAY: AppColors.warning,
  OFFLINE: AppColors.offline,
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60000) return "now";
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
  return d.toLocaleDateString();
}

export default function ChatsScreen() {
  const { colors, isDark } = useTheme();
  const [chats, setChats] = useState<ChatRoom[]>(MOCK_CHATS);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Uncomment when backend is ready:
  // useEffect(() => {
  //   setLoading(true);
  //   ChatAPI.getMyChats().then(setChats).finally(() => setLoading(false));
  // }, []);

  const filtered = chats.filter((c) =>
    (c.name || "").toLowerCase().includes(search.toLowerCase()),
  );

  const s = styles(colors, isDark);

  const renderItem = ({ item }: { item: ChatRoom }) => {
    const senderStatus = item.lastMessage?.sender.status || "OFFLINE";
    return (
      <TouchableOpacity
        style={s.chatRow}
        onPress={() => router.push(`/chat/${item.id}` as any)}
        activeOpacity={0.75}
      >
        {/* Avatar */}
        <View style={s.avatarWrap}>
          <View style={[s.avatar, item.isGroup && s.groupAvatar]}>
            <Text style={s.avatarText}>{AVATARS[item.id] || "👤"}</Text>
          </View>
          {!item.isGroup && (
            <View
              style={[
                s.statusDot,
                { backgroundColor: STATUS_COLOR[senderStatus] },
              ]}
            />
          )}
        </View>

        {/* Info */}
        <View style={s.chatInfo}>
          <View style={s.chatTop}>
            <Text style={s.chatName} numberOfLines={1}>
              {item.name}
            </Text>
            <Text style={s.chatTime}>
              {item.lastMessage ? formatTime(item.lastMessage.createdAt) : ""}
            </Text>
          </View>
          <View style={s.chatBottom}>
            <Text style={s.chatPreview} numberOfLines={1}>
              {item.lastMessage?.content || "No messages yet"}
            </Text>
            {item.unreadCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>
                  {item.unreadCount > 99 ? "99+" : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Messages</Text>
        <TouchableOpacity style={s.newChatBtn}>
          <Image
            style={{ width: 24, height: 24 }}
            source={require("../images/edit-icon.png")}
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search conversations..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Online friends strip */}
      <View style={s.onlineStrip}>
        <Text style={s.onlineTitle}>Online now</Text>
        {["👩🏾", "👨🏿", "👩🏽", "🧑🏿", "👨🏾"].map((e, i) => (
          <TouchableOpacity key={i} style={s.onlineAvatar}>
            <View style={s.onlineAvatarCircle}>
              <Text style={{ fontSize: 22 }}>{e}</Text>
            </View>
            <View style={s.onlineDot} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Chat list */}
      {loading ? (
        <ActivityIndicator
          color={AppColors.primary}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={s.separator} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>💬</Text>
              <Text style={s.emptyText}>No conversations yet</Text>
            </View>
          }
        />
      )}
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
    newChatBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    newChatIcon: { fontSize: 18 },
    searchWrap: {
      flexDirection: "row",
      alignItems: "center",
      margin: 16,
      paddingHorizontal: 14,
      paddingVertical: 10,
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 8,
    },
    searchIcon: { fontSize: 16 },
    searchInput: { flex: 1, fontSize: 15, color: colors.text },
    onlineStrip: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingBottom: 14,
      gap: 12,
    },
    onlineTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      marginRight: 4,
    },
    onlineAvatar: { position: "relative" },
    onlineAvatarCircle: {
      width: 46,
      height: 46,
      borderRadius: 23,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: AppColors.primary,
    },
    onlineDot: {
      position: "absolute",
      bottom: 1,
      right: 1,
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: AppColors.online,
      borderWidth: 2,
      borderColor: colors.background,
    },
    chatRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      gap: 12,
    },
    avatarWrap: { position: "relative" },
    avatar: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
    },
    groupAvatar: {
      backgroundColor: isDark ? AppColors.primaryDark : AppColors.primaryLight,
    },
    avatarText: { fontSize: 28 },
    statusDot: {
      position: "absolute",
      bottom: 2,
      right: 2,
      width: 13,
      height: 13,
      borderRadius: 7,
      borderWidth: 2,
      borderColor: colors.background,
    },
    chatInfo: { flex: 1 },
    chatTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    chatName: {
      fontSize: 16,
      fontWeight: "700",
      color: colors.text,
      flex: 1,
      marginRight: 8,
    },
    chatTime: { fontSize: 12, color: colors.textMuted },
    chatBottom: { flexDirection: "row", alignItems: "center" },
    chatPreview: { fontSize: 14, color: colors.textSecondary, flex: 1 },
    badge: {
      backgroundColor: AppColors.primary,
      borderRadius: 12,
      minWidth: 22,
      height: 22,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
    },
    badgeText: { color: "#fff", fontSize: 11, fontWeight: "800" },
    separator: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginLeft: 82,
    },
    empty: { alignItems: "center", marginTop: 80 },
    emptyEmoji: { fontSize: 56, marginBottom: 12 },
    emptyText: { fontSize: 16, color: colors.textSecondary },
  });
