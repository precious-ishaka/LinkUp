import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";
import { User } from "../service/api";

const AVATARS = ["👩🏾", "👨🏿", "👩🏽", "🧑🏿", "👨🏾", "👩🏿", "🧑🏽"];

const MOCK_USERS: (User & { avatar: string })[] = [
  {
    id: "1",
    fullName: "Amara Osei",
    username: "@amara",
    email: "",
    status: "ONLINE",
    friendsCount: 128,
    onlineFriendsCount: 14,
    createdAt: "",
    avatar: "👩🏾",
  },
  {
    id: "2",
    fullName: "Kofi Mensah",
    username: "@kofi_dev",
    email: "",
    status: "ONLINE",
    friendsCount: 241,
    onlineFriendsCount: 33,
    createdAt: "",
    avatar: "👨🏿",
  },
  {
    id: "3",
    fullName: "Zara Nwosu",
    username: "@zara_designs",
    email: "",
    status: "AWAY",
    friendsCount: 89,
    onlineFriendsCount: 7,
    createdAt: "",
    avatar: "👩🏿",
  },
  {
    id: "4",
    fullName: "Emeka Eze",
    username: "@emeka",
    email: "",
    status: "OFFLINE",
    friendsCount: 312,
    onlineFriendsCount: 0,
    createdAt: "",
    avatar: "🧑🏿",
  },
  {
    id: "5",
    fullName: "Fatima Bello",
    username: "@fatima_b",
    email: "",
    status: "ONLINE",
    friendsCount: 67,
    onlineFriendsCount: 12,
    createdAt: "",
    avatar: "👩🏽",
  },
  {
    id: "6",
    fullName: "Chidi Okeke",
    username: "@chidi",
    email: "",
    status: "ONLINE",
    friendsCount: 192,
    onlineFriendsCount: 28,
    createdAt: "",
    avatar: "👨🏾",
  },
];

const TRENDING_TAGS = [
  "#ReactNative",
  "#ExpoRouter",
  "#Nigeria",
  "#TechAfrica",
  "#TypeScript",
  "#SpringBoot",
  "#FullStack",
];
const STATUS_COLOR: Record<string, string> = {
  ONLINE: AppColors.online,
  AWAY: AppColors.warning,
  OFFLINE: AppColors.offline,
};

export default function SearchScreen() {
  const { colors, isDark } = useTheme();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<typeof MOCK_USERS>([]);
  const [loading, setLoading] = useState(false);
  const [requested, setRequested] = useState<Set<string>>(new Set());
  const [activeFilter, setActiveFilter] = useState<
    "people" | "posts" | "groups"
  >("people");

  const handleSearch = useCallback((q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    // Simulate API search — replace with:
    // UserAPI.searchUsers(q).then(r => setResults(r)).finally(() => setLoading(false));
    setTimeout(() => {
      setResults(
        MOCK_USERS.filter(
          (u) =>
            u.fullName.toLowerCase().includes(q.toLowerCase()) ||
            u.username.toLowerCase().includes(q.toLowerCase()),
        ),
      );
      setLoading(false);
    }, 400);
  }, []);

  const sendRequest = (id: string) => {
    setRequested((prev) => new Set(prev).add(id));
    // FriendAPI.sendRequest(id);
  };

  const s = styles(colors, isDark);

  const renderUser = ({ item }: { item: (typeof MOCK_USERS)[0] }) => (
    <View style={s.userCard}>
      <View style={s.userLeft}>
        <View style={s.userAvatarWrap}>
          <View style={s.userAvatar}>
            <Text style={{ fontSize: 28 }}>{item.avatar}</Text>
          </View>
          <View
            style={[
              s.statusDot,
              { backgroundColor: STATUS_COLOR[item.status] },
            ]}
          />
        </View>
        <View>
          <Text style={s.userName}>{item.fullName}</Text>
          <Text style={s.userHandle}>{item.username}</Text>
          <Text style={s.userFriends}>👥 {item.friendsCount} friends</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[s.addBtn, requested.has(item.id) && s.addBtnSent]}
        onPress={() => !requested.has(item.id) && sendRequest(item.id)}
        activeOpacity={0.8}
      >
        <Text
          style={[s.addBtnText, requested.has(item.id) && s.addBtnTextSent]}
        >
          {requested.has(item.id) ? "✓ Sent" : "+ Add"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>Explore</Text>
      </View>

      {/* Search bar */}
      <View style={s.searchWrap}>
        <Text style={s.searchIcon}>🔍</Text>
        <TextInput
          style={s.searchInput}
          placeholder="Search people, posts, groups..."
          placeholderTextColor={colors.textMuted}
          value={query}
          onChangeText={handleSearch}
          autoCorrect={false}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch("")}>
            <Text style={s.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <View style={s.filters}>
        {(["people", "posts", "groups"] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[s.filterBtn, activeFilter === f && s.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[s.filterText, activeFilter === f && s.filterTextActive]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {!query ? (
        <View style={s.emptyState}>
          <Text style={s.sectionTitle}>Trending Topics</Text>
          <View style={s.tagsWrap}>
            {TRENDING_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={s.tag}
                onPress={() => handleSearch(tag)}
              >
                <Text style={s.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[s.sectionTitle, { marginTop: 24 }]}>
            People You May Know
          </Text>
          <FlatList
            data={MOCK_USERS.slice(0, 3)}
            keyExtractor={(i) => i.id}
            renderItem={renderUser}
            scrollEnabled={false}
          />
        </View>
      ) : loading ? (
        <ActivityIndicator
          color={AppColors.primary}
          style={{ marginTop: 40 }}
        />
      ) : results.length === 0 ? (
        <View style={s.noResults}>
          <Text style={s.noResultsEmoji}>🔍</Text>
          <Text style={s.noResultsText}>No results for "{query}"</Text>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(i) => i.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
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
    searchWrap: {
      flexDirection: "row",
      alignItems: "center",
      margin: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.full,
      borderWidth: 1.5,
      borderColor: colors.border,
      gap: 8,
    },
    searchIcon: { fontSize: 16 },
    searchInput: { flex: 1, fontSize: 15, color: colors.text },
    clearIcon: { fontSize: 14, color: colors.textMuted, padding: 2 },
    filters: {
      flexDirection: "row",
      paddingHorizontal: 16,
      gap: 8,
      marginBottom: 12,
    },
    filterBtn: {
      paddingHorizontal: 16,
      paddingVertical: 7,
      borderRadius: BorderRadius.full,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    filterBtnActive: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    filterText: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.textSecondary,
    },
    filterTextActive: { color: "#fff" },
    emptyState: { paddingHorizontal: 16 },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "800",
      color: colors.text,
      marginBottom: 12,
    },
    tagsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    tag: {
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      paddingHorizontal: 14,
      paddingVertical: 7,
      borderRadius: BorderRadius.full,
    },
    tagText: { color: AppColors.primary, fontWeight: "700", fontSize: 13 },
    userCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
    },
    userLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
    userAvatarWrap: { position: "relative" },
    userAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
    },
    statusDot: {
      position: "absolute",
      bottom: 1,
      right: 1,
      width: 12,
      height: 12,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: colors.background,
    },
    userName: { fontSize: 15, fontWeight: "700", color: colors.text },
    userHandle: { fontSize: 13, color: AppColors.primary, marginTop: 1 },
    userFriends: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
    addBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: BorderRadius.full,
      backgroundColor: AppColors.primary,
    },
    addBtnSent: {
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
    },
    addBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    addBtnTextSent: { color: AppColors.primary },
    noResults: { alignItems: "center", marginTop: 60 },
    noResultsEmoji: { fontSize: 52, marginBottom: 12 },
    noResultsText: { fontSize: 15, color: colors.textSecondary },
  });
