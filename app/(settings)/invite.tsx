import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppColors, BorderRadius } from "../context/theme";
import { useTheme } from "../context/useTheme";

const INVITE_LINK = "https://vibe.app/invite/abc123xyz";

export default function Invite() {
  const { colors, isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    await Share.share({
      message: `Join me on LinkUp 💜 The best social chat app. Download here: ${INVITE_LINK}`,
    });
  };

  const handleEmailInvite = async () => {
    if (!email.includes("@")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }
    setSending(true);
    try {
      // await InviteAPI.sendInvite(email);
      await new Promise((r) => setTimeout(r, 1000));
      setSent((prev) => [email, ...prev]);
      setEmail("");
    } finally {
      setSending(false);
    }
  };

  const handleCopyLink = () => {
    // Clipboard.setStringAsync(INVITE_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const s = styles(colors, isDark);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.hero}>
        <Text style={s.heroEmoji}>🎉</Text>
        <Text style={s.heroTitle}>Invite Your Squad</Text>
        <Text style={s.heroSub}>
          Get 1 month of LinkUp Pro for every friend who joins!
        </Text>
      </View>

      {/* Share Link */}
      <View style={s.card}>
        <Text style={s.cardLabel}>Your Invite Link</Text>
        <View style={s.linkRow}>
          <Text style={s.linkText} numberOfLines={1}>
            {INVITE_LINK}
          </Text>
          <TouchableOpacity
            style={[s.copyBtn, copied && s.copyBtnDone]}
            onPress={handleCopyLink}
          >
            <Text style={s.copyBtnText}>{copied ? "✓ Copied" : "Copy"}</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={s.shareBtn} onPress={handleShare}>
          <Text style={s.shareText}>📤 Share Invite Link</Text>
        </TouchableOpacity>
      </View>

      {/* Social buttons */}
      <View style={s.card}>
        <Text style={s.cardLabel}>Share via</Text>
        <View style={s.socialRow}>
          {[
            {
              emoji: <Image source={require("../images/w-icon.png")} />,
              label: "WhatsApp",
            },
            {
              emoji: <Image source={require("../images/link-icon.png")} />,
              label: "LinkedIn",
            },
            {
              emoji: <Image source={require("../images/x-icon.png")} />,
              label: "X",
            },
            {
              emoji: <Image source={require("../images/f-icon.png")} />,
              label: "Facebook",
            },
          ].map((app) => (
            <TouchableOpacity
              key={app.label}
              style={s.socialBtn}
              onPress={handleShare}
            >
              <View style={s.socialIconWrap}>
                <Text style={s.socialIcon}>{app.emoji}</Text>
              </View>
              <Text style={s.socialLabel}>{app.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Email invite */}
      <View style={s.card}>
        <Text style={s.cardLabel}>Invite by Email</Text>
        <View style={s.emailRow}>
          <TextInput
            style={s.emailInput}
            placeholder="friend@example.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TouchableOpacity
            style={[s.sendBtn, (sending || !email) && { opacity: 0.5 }]}
            onPress={handleEmailInvite}
            disabled={sending || !email}
          >
            {sending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={s.sendBtnText}>Send</Text>
            )}
          </TouchableOpacity>
        </View>

        {sent.length > 0 && (
          <View style={s.sentList}>
            <Text style={s.sentTitle}>Invites sent 🎊</Text>
            {sent.map((e, i) => (
              <View key={i} style={s.sentRow}>
                <Text style={s.sentCheck}>✅</Text>
                <Text style={s.sentEmail}>{e}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 40 },
    hero: { alignItems: "center", paddingVertical: 28 },
    heroEmoji: { fontSize: 56, marginBottom: 10 },
    heroTitle: { fontSize: 26, fontWeight: "800", color: colors.text },
    heroSub: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: "center",
      marginTop: 6,
      paddingHorizontal: 30,
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
    cardLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 12,
    },
    linkRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      padding: 12,
      borderWidth: 1.5,
      borderColor: colors.border,
      gap: 10,
      marginBottom: 12,
    },
    linkText: { flex: 1, fontSize: 13, color: colors.textSecondary },
    copyBtn: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      borderRadius: 8,
    },
    copyBtnDone: { backgroundColor: `${AppColors.success}22` },
    copyBtnText: { fontSize: 13, fontWeight: "700", color: AppColors.primary },
    shareBtn: {
      backgroundColor: AppColors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: 13,
      alignItems: "center",
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 8,
      elevation: 5,
    },
    shareText: { color: "#fff", fontWeight: "700", fontSize: 15 },
    socialRow: { flexDirection: "row", justifyContent: "space-around" },
    socialBtn: { alignItems: "center", gap: 6 },
    socialIconWrap: {
      width: 54,
      height: 54,
      borderRadius: 27,

      alignItems: "center",
      justifyContent: "center",
    },
    socialIcon: { fontSize: 26 },
    socialLabel: { fontSize: 12, color: colors.textSecondary },
    emailRow: { flexDirection: "row", gap: 8 },
    emailInput: {
      flex: 1,
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.border,
    },
    sendBtn: {
      backgroundColor: AppColors.primary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: 18,
      alignItems: "center",
      justifyContent: "center",
    },
    sendBtnText: { color: "#fff", fontWeight: "700" },
    sentList: { marginTop: 14 },
    sentTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: 8,
    },
    sentRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingVertical: 4,
    },
    sentCheck: { fontSize: 16 },
    sentEmail: { fontSize: 14, color: colors.text },
  });
