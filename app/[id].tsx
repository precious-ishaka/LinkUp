// import React, { useState, useEffect, useRef } from "react";
// import {
//   View,
//   Text,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Platform,
// } from "react-native";
// import { useLocalSearchParams, router } from "expo-router";
// import { useTheme } from "./context/useTheme";
// import { AppColors, BorderRadius } from "./context/theme";
// import { ChatAPI, Message } from "./service/api";
// import { wsService } from "./service/websocket";

// const MY_ID = "me";

// const MOCK_MESSAGES: Message[] = [
//   {
//     id: "1",
//     chatRoomId: "1",
//     content: "Hey! Are you free tonight? 🎉",
//     type: "TEXT",
//     readBy: [],
//     createdAt: new Date(Date.now() - 3600000).toISOString(),
//     sender: {
//       id: "u1",
//       fullName: "Amara Osei",
//       username: "@amara",
//       email: "",
//       status: "ONLINE",
//       friendsCount: 0,
//       onlineFriendsCount: 0,
//       createdAt: "",
//     },
//   },
//   {
//     id: "2",
//     chatRoomId: "1",
//     content: "Yeah, what's up? 👀",
//     type: "TEXT",
//     readBy: [],
//     createdAt: new Date(Date.now() - 3500000).toISOString(),
//     sender: {
//       id: MY_ID,
//       fullName: "Me",
//       username: "@me",
//       email: "",
//       status: "ONLINE",
//       friendsCount: 0,
//       onlineFriendsCount: 0,
//       createdAt: "",
//     },
//   },
//   {
//     id: "3",
//     chatRoomId: "1",
//     content: "We're having a tech meetup! Come through 💜",
//     type: "TEXT",
//     readBy: [],
//     createdAt: new Date(Date.now() - 3400000).toISOString(),
//     sender: {
//       id: "u1",
//       fullName: "Amara Osei",
//       username: "@amara",
//       email: "",
//       status: "ONLINE",
//       friendsCount: 0,
//       onlineFriendsCount: 0,
//       createdAt: "",
//     },
//   },
//   {
//     id: "4",
//     chatRoomId: "1",
//     content: "That sounds amazing! Where at?",
//     type: "TEXT",
//     readBy: [],
//     createdAt: new Date(Date.now() - 3000000).toISOString(),
//     sender: {
//       id: MY_ID,
//       fullName: "Me",
//       username: "@me",
//       email: "",
//       status: "ONLINE",
//       friendsCount: 0,
//       onlineFriendsCount: 0,
//       createdAt: "",
//     },
//   },
//   {
//     id: "5",
//     chatRoomId: "1",
//     content: "The Hub on Lagos Island. 7pm 🔥",
//     type: "TEXT",
//     readBy: [],
//     createdAt: new Date(Date.now() - 2000000).toISOString(),
//     sender: {
//       id: "u1",
//       fullName: "Amara Osei",
//       username: "@amara",
//       email: "",
//       status: "ONLINE",
//       friendsCount: 0,
//       onlineFriendsCount: 0,
//       createdAt: "",
//     },
//   },
// ];

// function formatMessageTime(iso: string) {
//   return new Date(iso).toLocaleTimeString([], {
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// export default function ChatScreen() {
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const { colors, isDark } = useTheme();
//   const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
//   const [text, setText] = useState("");
//   const [isTyping, setIsTyping] = useState(false);
//   const flatRef = useRef<FlatList>(null);

//   // Real-time subscription (uncomment when backend is live)
//   // useEffect(() => {
//   //   ChatAPI.getMessages(id).then(r => setMessages(r.content.reverse()));
//   //   const unsub = wsService.subscribeToChat(id, (msg: Message) => {
//   //     setMessages(prev => [...prev, msg]);
//   //   });
//   //   return unsub;
//   // }, [id]);

//   const send = () => {
//     if (!text.trim()) return;
//     const newMsg: Message = {
//       id: Date.now().toString(),
//       chatRoomId: id,
//       content: text.trim(),
//       type: "TEXT",
//       readBy: [],
//       createdAt: new Date().toISOString(),
//       sender: {
//         id: MY_ID,
//         fullName: "Me",
//         username: "@me",
//         email: "",
//         status: "ONLINE",
//         friendsCount: 0,
//         onlineFriendsCount: 0,
//         createdAt: "",
//       },
//     };
//     setMessages((prev) => [...prev, newMsg]);
//     setText("");
//     // wsService.sendMessage(id, text.trim());
//     setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 100);
//   };

//   const s = styles(colors, isDark);

//   const renderMessage = ({ item, index }: { item: Message; index: number }) => {
//     const isMe = item.sender.id === MY_ID;
//     const prevMsg = messages[index - 1];
//     const showAvatar =
//       !isMe && (!prevMsg || prevMsg.sender.id !== item.sender.id);
//     const showName = !isMe && showAvatar;

//     return (
//       <View style={[s.msgRow, isMe && s.msgRowMe]}>
//         {!isMe && (
//           <View style={[s.msgAvatar, !showAvatar && { opacity: 0 }]}>
//             <Text style={{ fontSize: 20 }}>👩🏾</Text>
//           </View>
//         )}
//         <View style={s.msgContent}>
//           {showName && (
//             <Text style={s.msgSenderName}>{item.sender.fullName}</Text>
//           )}
//           <View style={[s.bubble, isMe ? s.bubbleMe : s.bubbleThem]}>
//             <Text style={[s.bubbleText, isMe && s.bubbleTextMe]}>
//               {item.content}
//             </Text>
//           </View>
//           <Text style={[s.msgTime, isMe && s.msgTimeMe]}>
//             {formatMessageTime(item.createdAt)}
//             {isMe ? " ✓✓" : ""}
//           </Text>
//         </View>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={s.safeArea}>
//       {/* Header */}
//       <View style={s.header}>
//         <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
//           <Text style={s.backIcon}>←</Text>
//         </TouchableOpacity>
//         <View style={s.headerAvatar}>
//           <Text style={{ fontSize: 24 }}>👩🏾</Text>
//           <View style={s.headerOnlineDot} />
//         </View>
//         <View style={s.headerInfo}>
//           <Text style={s.headerName}>Amara Osei</Text>
//           <Text style={s.headerStatus}>🟢 Online</Text>
//         </View>
//         <View style={s.headerActions}>
//           <TouchableOpacity style={s.headerActionBtn}>
//             <Text>📞</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={s.headerActionBtn}>
//             <Text>📹</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Messages */}
//       <KeyboardAvoidingView
//         style={{ flex: 1 }}
//         behavior={Platform.OS === "ios" ? "padding" : undefined}
//         keyboardVerticalOffset={90}
//       >
//         <FlatList
//           ref={flatRef}
//           data={messages}
//           keyExtractor={(item) => item.id}
//           renderItem={renderMessage}
//           contentContainerStyle={s.messageList}
//           onContentSizeChange={() =>
//             flatRef.current?.scrollToEnd({ animated: false })
//           }
//         />

//         {/* Typing indicator */}
//         {isTyping && (
//           <View style={s.typingRow}>
//             <View style={s.typingBubble}>
//               <Text style={s.typingDots}>●●●</Text>
//             </View>
//           </View>
//         )}

//         {/* Input */}
//         <View style={s.inputBar}>
//           <TouchableOpacity style={s.attachBtn}>
//             <Text style={{ fontSize: 22 }}>📎</Text>
//           </TouchableOpacity>
//           <TextInput
//             style={s.input}
//             placeholder="Message..."
//             placeholderTextColor={colors.textMuted}
//             value={text}
//             onChangeText={setText}
//             multiline
//             maxLength={1000}
//           />
//           <TouchableOpacity style={s.emojiBtn}>
//             <Text style={{ fontSize: 22 }}>😊</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[s.sendBtn, !text.trim() && s.sendBtnDisabled]}
//             onPress={send}
//             disabled={!text.trim()}
//           >
//             <Text style={s.sendIcon}>➤</Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// }

// const styles = (colors: any, isDark: boolean) =>
//   StyleSheet.create({
//     safeArea: { flex: 1, backgroundColor: colors.background },
//     header: {
//       flexDirection: "row",
//       alignItems: "center",
//       paddingHorizontal: 12,
//       paddingVertical: 10,
//       borderBottomWidth: 1,
//       borderBottomColor: colors.border,
//       gap: 10,
//       backgroundColor: colors.surfaceElevated,
//     },
//     backBtn: { padding: 6 },
//     backIcon: { fontSize: 22, color: AppColors.primary, fontWeight: "700" },
//     headerAvatar: { position: "relative" },
//     headerOnlineDot: {
//       position: "absolute",
//       bottom: 0,
//       right: 0,
//       width: 11,
//       height: 11,
//       borderRadius: 6,
//       backgroundColor: AppColors.online,
//       borderWidth: 2,
//       borderColor: colors.surfaceElevated,
//     },
//     headerInfo: { flex: 1 },
//     headerName: { fontSize: 16, fontWeight: "700", color: colors.text },
//     headerStatus: { fontSize: 12, color: colors.textSecondary },
//     headerActions: { flexDirection: "row", gap: 8 },
//     headerActionBtn: {
//       width: 36,
//       height: 36,
//       borderRadius: 18,
//       backgroundColor: colors.surface,
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     messageList: { paddingHorizontal: 12, paddingVertical: 16, gap: 4 },
//     msgRow: {
//       flexDirection: "row",
//       alignItems: "flex-end",
//       gap: 8,
//       marginBottom: 4,
//     },
//     msgRowMe: { flexDirection: "row-reverse" },
//     msgAvatar: {
//       width: 32,
//       height: 32,
//       borderRadius: 16,
//       backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
//       alignItems: "center",
//       justifyContent: "center",
//     },
//     msgContent: { maxWidth: "72%" },
//     msgSenderName: {
//       fontSize: 11,
//       color: AppColors.primary,
//       fontWeight: "700",
//       marginBottom: 3,
//       marginLeft: 12,
//     },
//     bubble: {
//       paddingHorizontal: 14,
//       paddingVertical: 10,
//       borderRadius: 18,
//     },
//     bubbleMe: {
//       backgroundColor: AppColors.primary,
//       borderBottomRightRadius: 4,
//     },
//     bubbleThem: {
//       backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
//       borderBottomLeftRadius: 4,
//     },
//     bubbleText: {
//       fontSize: 15,
//       color: isDark ? AppColors.primaryLight : AppColors.primaryDark,
//       lineHeight: 21,
//     },
//     bubbleTextMe: { color: "#fff" },
//     msgTime: {
//       fontSize: 11,
//       color: colors.textMuted,
//       marginTop: 3,
//       marginLeft: 4,
//     },
//     msgTimeMe: { textAlign: "right", marginRight: 4 },
//     typingRow: { paddingHorizontal: 16, paddingBottom: 8 },
//     typingBubble: {
//       alignSelf: "flex-start",
//       backgroundColor: isDark ? AppColors.primaryDeep : AppColors.accentLight,
//       paddingHorizontal: 16,
//       paddingVertical: 10,
//       borderRadius: 18,
//       borderBottomLeftRadius: 4,
//     },
//     typingDots: { color: AppColors.primary, letterSpacing: 2 },
//     inputBar: {
//       flexDirection: "row",
//       alignItems: "flex-end",
//       paddingHorizontal: 12,
//       paddingVertical: 10,
//       borderTopWidth: 1,
//       borderTopColor: colors.border,
//       gap: 8,
//       backgroundColor: colors.surfaceElevated,
//     },
//     attachBtn: { padding: 4, paddingBottom: 6 },
//     input: {
//       flex: 1,
//       backgroundColor: colors.surface,
//       borderRadius: 22,
//       paddingHorizontal: 16,
//       paddingVertical: 10,
//       fontSize: 15,
//       color: colors.text,
//       borderWidth: 1,
//       borderColor: colors.border,
//       maxHeight: 100,
//     },
//     emojiBtn: { padding: 4, paddingBottom: 6 },
//     sendBtn: {
//       width: 42,
//       height: 42,
//       borderRadius: 21,
//       backgroundColor: AppColors.primary,
//       alignItems: "center",
//       justifyContent: "center",
//       shadowColor: AppColors.primary,
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.4,
//       shadowRadius: 8,
//       elevation: 6,
//     },
//     sendBtnDisabled: { backgroundColor: colors.border, shadowOpacity: 0 },
//     sendIcon: { color: "#fff", fontSize: 16, marginLeft: 2 },
//   });
