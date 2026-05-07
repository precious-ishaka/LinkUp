import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppColors } from "../context/theme";
import { useTheme } from "../context/useTheme";

const POSTS = [
  {
    id: "1",
    user: "Amara Osei",
    username: "@amara",
    avatar: "👩🏾",
    time: "2m ago",
    content:
      "Just shipped a new feature to production! The team crushed it this week ",
    likes: 42,
    comments: 8,
    shares: 3,
    liked: false,
  },
  {
    id: "2",
    user: "Kofi Mensah",
    username: "@kofi_dev",
    avatar: "👨🏿",
    time: "15m ago",
    content:
      " Consistency is a Great Key to success. \n Trying and Failing isn't Failure, Not Trying is",
    likes: 89,
    comments: 24,
    shares: 12,
    liked: true,
  },
  {
    id: "3",
    user: "Zara Nwosu",
    username: "@zara_designs",
    avatar: "👩🏿",
    time: "1h ago",
    content:
      "Purple is the new blue 💜 Redesigned my whole portfolio today.\n Mood: obsessed.",
    likes: 156,
    comments: 31,
    shares: 7,
    liked: false,
  },
  {
    id: "4",
    user: "Ishaka Precious",
    username: "@itachi",
    avatar: "🧑🏿",
    time: "3h ago",
    content:
      "I Have Read Books On Psycopath, Narcissist, Sociopath and Other Dark Personalities, I Suggest Running Away From A Narcissist",
    likes: 101,
    comments: 45,
    shares: 38,
    liked: false,
  },
];

export default function FeedScreen() {
  const { colors, isDark } = useTheme();
  const [posts, setPosts] = useState(POSTS);
  const [newPost, setNewPost] = useState("");

  const toggleLike = (id: string) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              liked: !p.liked,
              likes: p.liked ? p.likes - 1 : p.likes + 1,
            }
          : p,
      ),
    );
  };

  const s = styles(colors, isDark);

  return (
    <SafeAreaView style={s.safeArea}>
      {/* Header */}
      <View style={s.header}>
        <Text style={s.headerTitle}>LinkUp</Text>
      </View>

      <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>
        {/* Compose Box */}
        <View style={s.composeCard}>
          <View style={s.composeAvatar}>
            <Text style={s.composeAvatarText}>👤</Text>
          </View>
          <View style={s.composeRight}>
            <TextInput
              style={s.composeInput}
              placeholder="What's on your mind?"
              placeholderTextColor={colors.textMuted}
              value={newPost}
              onChangeText={setNewPost}
              multiline
            />
            <View style={s.composeActions}>
              <TouchableOpacity style={s.composeMediaBtn}>
                <Text>📷</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.composeMediaBtn}>
                <Text>🎥</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.postBtn, !newPost && { opacity: 0.4 }]}
                disabled={!newPost}
              >
                <Text style={s.postBtnText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stories Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={s.storiesRow}
        >
          {["👩🏾", "👨🏿", "👩🏿", "🧑🏿", "👨🏾", "👩🏽"].map((emoji, i) => (
            <TouchableOpacity key={i} style={s.storyItem}>
              <View style={s.storyRing}>
                <View style={s.storyAvatar}>
                  <Text style={s.storyEmoji}>{emoji}</Text>
                </View>
              </View>
              <Text style={s.storyName}>Friend {i + 1}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        {posts.map((post) => (
          <View key={post.id} style={s.postCard}>
            <View style={s.postHeader}>
              <View style={s.postAvatar}>
                <Text style={s.postAvatarText}>{post.avatar}</Text>
              </View>
              <View style={s.postMeta}>
                <Text style={s.postUser}>{post.user}</Text>
                <Text style={s.postUsernameTime}>
                  {post.username} · {post.time}
                </Text>
              </View>
              <TouchableOpacity style={s.moreBtn}>
                <Text style={s.moreDots}>···</Text>
              </TouchableOpacity>
            </View>

            <Text style={s.postContent}>{post.content}</Text>

            <View style={s.postActions}>
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => toggleLike(post.id)}
              >
                <Text
                  style={[
                    s.actionIcon,
                    post.liked && { color: AppColors.danger },
                  ]}
                >
                  {post.liked ? "❤️" : "🤍"}
                </Text>
                <Text
                  style={[
                    s.actionCount,
                    post.liked && { color: AppColors.danger },
                  ]}
                >
                  {post.likes}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.actionBtn}>
                <Text style={s.actionIcon}>💬</Text>
                <Text style={s.actionCount}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.actionBtn}>
                <Text style={s.actionIcon}>🔁</Text>
                <Text style={s.actionCount}>{post.shares}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={s.actionBtn}>
                <Text style={s.actionIcon}>📤</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingVertical: 14,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 6,
    },
    headerTitle: {
      fontSize: 26,
      fontWeight: "900",
      color: AppColors.primary,
      letterSpacing: -1,
    },
    headerEmoji: { fontSize: 22 },
    scroll: { flex: 1 },
    composeCard: {
      flexDirection: "row",
      margin: 16,
      padding: 14,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 12,
    },
    composeAvatar: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    composeAvatarText: { fontSize: 22 },
    composeRight: { flex: 1 },
    composeInput: {
      fontSize: 14,
      color: colors.text,
      minHeight: 40,
      paddingTop: 4,
    },
    composeActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      marginTop: 8,
    },
    composeMediaBtn: {
      padding: 6,
      borderRadius: 8,
      backgroundColor: colors.surface,
    },
    postBtn: {
      marginLeft: "auto",
      backgroundColor: AppColors.primary,
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 20,
    },
    postBtnText: { color: "#fff", fontWeight: "700", fontSize: 13 },
    storiesRow: { paddingLeft: 16, marginBottom: 8 },
    storyItem: { alignItems: "center", marginRight: 14, width: 60 },
    storyRing: {
      padding: 2,
      borderRadius: 30,
      borderWidth: 2.5,
      borderColor: AppColors.primary,
      marginBottom: 4,
    },
    storyAvatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
    storyEmoji: { fontSize: 28 },
    storyName: {
      fontSize: 11,
      color: colors.textSecondary,
      textAlign: "center",
    },
    postCard: {
      marginHorizontal: 16,
      marginBottom: 12,
      padding: 16,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    postHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    postAvatar: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    postAvatarText: { fontSize: 24 },
    postMeta: { flex: 1 },
    postUser: { fontSize: 15, fontWeight: "700", color: colors.text },
    postUsernameTime: { fontSize: 12, color: colors.textMuted, marginTop: 1 },
    moreBtn: { padding: 4 },
    moreDots: { fontSize: 18, color: colors.textMuted, letterSpacing: 2 },
    postContent: {
      fontSize: 15,
      color: colors.text,
      lineHeight: 22,
      marginBottom: 14,
    },
    postActions: { flexDirection: "row", gap: 4 },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 20,
      flex: 1,
      justifyContent: "center",
    },
    actionIcon: { fontSize: 17 },
    actionCount: {
      fontSize: 13,
      color: colors.textSecondary,
      fontWeight: "600",
    },
  });
