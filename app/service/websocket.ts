import AsyncStorage from "@react-native-async-storage/async-storage";

type MessageHandler = (msg: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private subscriptions: Map<string, MessageHandler[]> = new Map();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connected = false;
  private pendingSend: Array<{ destination: string; body: string }> = [];

  async connect(userId: string) {
    const token = await AsyncStorage.getItem("access_token");
    const url = `ws://localhost:8080/ws?token=${token}`;

    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.connected = true;
      console.log("[WS] Connected");
      // Subscribe to personal channel
      this.stompSubscribe(`/user/${userId}/queue/messages`);
      this.stompSubscribe(`/user/${userId}/queue/notifications`);
      // Flush pending
      this.pendingSend.forEach((p) => this.stompSend(p.destination, p.body));
      this.pendingSend = [];
    };

    this.ws.onmessage = (event) => {
      try {
        const frame = this.parseStompFrame(event.data);
        if (frame.command === "MESSAGE") {
          const destination = frame.headers["destination"];
          const body = JSON.parse(frame.body);
          (this.subscriptions.get(destination) || []).forEach((h) => h(body));
        }
      } catch (e) {
        console.warn("[WS] Parse error", e);
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
      console.log("[WS] Disconnected, reconnecting in 3s...");
      this.reconnectTimer = setTimeout(() => this.connect(userId), 3000);
    };

    this.ws.onerror = (err) => {
      console.error("[WS] Error", err);
    };
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.connected = false;
  }

  subscribeToChat(chatId: string, handler: MessageHandler) {
    const dest = `/topic/chat/${chatId}`;
    if (!this.subscriptions.has(dest)) {
      this.subscriptions.set(dest, []);
      this.stompSubscribe(dest);
    }
    this.subscriptions.get(dest)!.push(handler);
    return () => this.unsubscribe(dest, handler);
  }

  subscribeToUser(userId: string, topic: string, handler: MessageHandler) {
    const dest = `/user/${userId}/queue/${topic}`;
    if (!this.subscriptions.has(dest)) {
      this.subscriptions.set(dest, []);
    }
    this.subscriptions.get(dest)!.push(handler);
    return () => this.unsubscribe(dest, handler);
  }

  sendMessage(chatId: string, content: string, type = "TEXT") {
    this.stompSend(
      `/app/chat/${chatId}/send`,
      JSON.stringify({ content, type }),
    );
  }

  sendTyping(chatId: string) {
    this.stompSend(`/app/chat/${chatId}/typing`, "{}");
  }

  private unsubscribe(dest: string, handler: MessageHandler) {
    const handlers = this.subscriptions.get(dest) || [];
    this.subscriptions.set(
      dest,
      handlers.filter((h) => h !== handler),
    );
  }

  private stompSubscribe(destination: string) {
    if (!this.connected) return;
    const frame = `SUBSCRIBE\ndestination:${destination}\nid:sub-${Date.now()}\n\n\0`;
    this.ws?.send(frame);
  }

  private stompSend(destination: string, body: string) {
    if (!this.connected) {
      this.pendingSend.push({ destination, body });
      return;
    }
    const frame = `SEND\ndestination:${destination}\ncontent-type:application/json\n\n${body}\0`;
    this.ws?.send(frame);
  }

  private parseStompFrame(raw: string) {
    const lines = raw.split("\n");
    const command = lines[0];
    const headers: Record<string, string> = {};
    let i = 1;
    while (lines[i] && lines[i] !== "") {
      const [key, ...rest] = lines[i].split(":");
      headers[key.trim()] = rest.join(":").trim();
      i++;
    }
    const body = lines
      .slice(i + 1)
      .join("\n")
      .replace("\0", "");
    return { command, headers, body };
  }
}

export const wsService = new WebSocketService();
