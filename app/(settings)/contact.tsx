import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
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

const TOPICS = [
  "Bug Report",
  "Feature Request",
  "Account Help",
  "Billing",
  "Other",
];

export default function ContactScreen() {
  const { colors, isDark } = useTheme();
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!topic || !message.trim()) {
      Alert.alert(
        "Missing info",
        "Please select a topic and write your message.",
      );
      return;
    }
    setLoading(true);
    // POST /api/support/contact
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    Alert.alert("Sent! 🎉", "We'll get back to you within 24 hours.", [
      {
        text: "OK",
        onPress: () => {
          setTopic("");
          setMessage("");
        },
      },
    ]);
  };

  const s = styles(colors, isDark);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={s.hero}>
        <Text style={s.heroEmoji}>💌</Text>
        <Text style={s.heroTitle}>Get in Touch</Text>
        <Text style={s.heroSub}>We typically respond within 24 hours</Text>
      </View>

      <View style={s.card}>
        <Text style={s.sectionLabel}>Topic</Text>
        <View style={s.topicsWrap}>
          {TOPICS.map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.topicBtn, topic === t && s.topicBtnActive]}
              onPress={() => setTopic(t)}
            >
              <Text style={[s.topicText, topic === t && s.topicTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[s.sectionLabel, { marginTop: 16 }]}>Message</Text>
        <TextInput
          style={s.messageInput}
          placeholder="Describe your issue or question..."
          placeholderTextColor={colors.textMuted}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <Text style={s.charCount}>{message.length}/500</Text>

        <TouchableOpacity
          style={[
            s.submitBtn,
            (loading || !topic || !message.trim()) && { opacity: 0.5 },
          ]}
          onPress={handleSubmit}
          disabled={loading || !topic || !message.trim()}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.submitBtnText}>Send Message 📤</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={s.altContact}>
        <Text style={s.altTitle}>Other ways to reach us</Text>
        {[
          {
            icon: <Image source={require("../images/e-icon.png")} />,
            label: "ishakaprecious734@gmail.com",
          },
          {
            icon: <Image source={require("../images/x-icon.png")} />,
            label: "precious_ishaka",
          },
          {
            icon: <Image source={require("../images/link-icon.png")} />,
            label: "precious-ishaka",
          },
        ].map((item) => (
          <View key={item.label} style={s.altRow}>
            <Text style={s.altIcon}>{item.icon}</Text>
            <Text style={s.altLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 40 },
    hero: { alignItems: "center", paddingVertical: 28 },
    heroEmoji: { fontSize: 52, marginBottom: 10 },
    heroTitle: { fontSize: 26, fontWeight: "800", color: colors.text },
    heroSub: { fontSize: 13, color: colors.textSecondary, marginTop: 4 },
    card: {
      marginHorizontal: 16,
      marginBottom: 16,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionLabel: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 10,
    },
    topicsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
    topicBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: BorderRadius.full,
      borderWidth: 1.5,
      borderColor: colors.border,
      backgroundColor: colors.inputBg,
    },
    topicBtnActive: {
      backgroundColor: AppColors.primary,
      borderColor: AppColors.primary,
    },
    topicText: { fontSize: 13, fontWeight: "600", color: colors.textSecondary },
    topicTextActive: { color: "#fff" },
    messageInput: {
      backgroundColor: colors.inputBg,
      borderRadius: BorderRadius.md,
      padding: 14,
      minHeight: 120,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1.5,
      borderColor: colors.border,
      textAlignVertical: "top",
    },
    charCount: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: "right",
      marginTop: 4,
    },
    submitBtn: {
      marginTop: 16,
      backgroundColor: AppColors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: 15,
      alignItems: "center",
      shadowColor: AppColors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 6,
    },
    submitBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
    altContact: {
      marginHorizontal: 16,
      padding: 16,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    altTitle: {
      fontSize: 15,
      fontWeight: "700",
      color: colors.text,
      marginBottom: 12,
    },
    altRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      paddingVertical: 6,
    },
    altIcon: { fontSize: 18 },
    altLabel: { fontSize: 14, color: colors.textSecondary },
  });
