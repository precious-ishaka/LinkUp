import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
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

export default function EditProfile() {
  const { colors, isDark } = useTheme();
  const [form, setForm] = useState({
    fullName: "Your Name",
    username: "yourhandle",
    bio: "Building the future of African tech 🌍",
    email: "you@example.com",
  });
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key: string, val: string) =>
    setForm((f) => ({ ...f, [key]: val }));

  const pickAvatar = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // await UserAPI.updateProfile(form);
      // if (avatarUri) await UserAPI.uploadAvatar(avatarUri);
      await new Promise((r) => setTimeout(r, 1000));
      Alert.alert("Saved!", "Your profile has been updated ✨");
      router.back();
    } catch {
      Alert.alert("Error", "Failed to save changes. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const s = styles(colors, isDark);

  return (
    <ScrollView
      style={s.container}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      {/* Avatar */}
      <View style={s.avatarSection}>
        <TouchableOpacity style={s.avatarWrap} onPress={pickAvatar}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={s.avatar} />
          ) : (
            <View style={s.avatarPlaceholder}>
              <Text style={{ fontSize: 52 }}>👤</Text>
            </View>
          )}
          <View style={s.avatarCameraBtn}>
            <Text>📷</Text>
          </View>
        </TouchableOpacity>
        <Text style={s.avatarHint}>Tap to change photo</Text>
      </View>

      {/* Form */}
      <View style={s.card}>
        {[
          { key: "fullName", label: "Full Name", placeholder: " " },
          { key: "username", label: "Username", placeholder: " " },
          {
            key: "email",
            label: "Email",
            placeholder: " ",
            keyboard: "email-address",
          },
        ].map(({ key, label, placeholder, keyboard }) => (
          <View key={key} style={s.field}>
            <Text style={s.label}>{label}</Text>
            <TextInput
              style={s.input}
              value={form[key as keyof typeof form]}
              onChangeText={(v) => update(key, v)}
              placeholder={placeholder}
              placeholderTextColor={colors.textMuted}
              keyboardType={keyboard as any}
              autoCapitalize={
                key === "email" || key === "username" ? "none" : "words"
              }
            />
          </View>
        ))}

        <View style={s.field}>
          <Text style={s.label}>Bio</Text>
          <TextInput
            style={[s.input, s.bioInput]}
            value={form.bio}
            onChangeText={(v) => update("bio", v)}
            placeholder="Tell the world about yourself..."
            placeholderTextColor={colors.textMuted}
            multiline
            maxLength={160}
          />
          <Text style={s.charCount}>{form.bio.length}/160</Text>
        </View>
      </View>

      <TouchableOpacity
        style={[s.saveBtn, saving && { opacity: 0.7 }]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={s.saveBtnText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = (colors: any, isDark: boolean) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingBottom: 40 },
    avatarSection: { alignItems: "center", paddingVertical: 24 },
    avatarWrap: { position: "relative" },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      borderWidth: 3,
      borderColor: AppColors.primary,
    },
    avatarPlaceholder: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: AppColors.primary,
    },
    avatarCameraBtn: {
      position: "absolute",
      bottom: 0,
      right: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: AppColors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.background,
    },
    avatarHint: { marginTop: 8, color: colors.textSecondary, fontSize: 13 },
    card: {
      marginHorizontal: 16,
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      gap: 4,
    },
    field: { marginBottom: 14 },
    label: {
      fontSize: 12,
      fontWeight: "700",
      color: colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.6,
      marginBottom: 6,
    },
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
    bioInput: { minHeight: 90, textAlignVertical: "top" },
    charCount: {
      fontSize: 11,
      color: colors.textMuted,
      textAlign: "right",
      marginTop: 4,
    },
    saveBtn: {
      margin: 16,
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
    saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  });
