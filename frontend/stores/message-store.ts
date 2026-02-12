import { create } from "zustand";
import { api } from "@/lib/api-client";

export interface MessageItem {
  id: number;
  body: string;
  is_from_host: boolean;
  sender_name: string;
  is_read: boolean;
  created_at: string;
}

export interface ConversationItem {
  id: number;
  subject: string;
  status: string;
  host_company: string;
  host_email: string;
  last_message_at: string;
  unread_count: number;
  last_message_preview: string;
  created_at: string;
}

interface ConversationDetail {
  id: number;
  subject: string;
  status: string;
  host_company: string;
  host_email: string;
  last_message_at: string;
  messages: MessageItem[];
  created_at: string;
}

interface MessageState {
  conversations: ConversationItem[];
  activeConversation: ConversationDetail | null;
  loaded: boolean;
  sending: boolean;

  fetchConversations: (statusFilter?: string) => Promise<void>;
  fetchConversation: (id: number) => Promise<void>;
  sendMessage: (conversationId: number, body: string) => Promise<void>;
  createConversation: (subject: string, body: string, hostId?: number) => Promise<void>;
  closeConversation: (id: number) => Promise<void>;
}

export const useMessageStore = create<MessageState>((set) => ({
  conversations: [],
  activeConversation: null,
  loaded: false,
  sending: false,

  fetchConversations: async (statusFilter?: string) => {
    try {
      const url = statusFilter
        ? `/auth/conversations/?status=${statusFilter}`
        : "/auth/conversations/";
      const data = await api.get<ConversationItem[]>(url);
      set({ conversations: data, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },

  fetchConversation: async (id: number) => {
    try {
      const data = await api.get<ConversationDetail>(`/auth/conversations/${id}/`);
      set({ activeConversation: data });
    } catch {
      // Conversation not found
    }
  },

  sendMessage: async (conversationId: number, body: string) => {
    set({ sending: true });
    try {
      const data = await api.post<ConversationDetail>(
        `/auth/conversations/${conversationId}/messages/`,
        { body }
      );
      set({ activeConversation: data, sending: false });
      // Refresh the list to update previews
      const list = await api.get<ConversationItem[]>("/auth/conversations/");
      set({ conversations: list });
    } catch {
      set({ sending: false });
    }
  },

  createConversation: async (subject: string, body: string, hostId?: number) => {
    set({ sending: true });
    try {
      const payload: Record<string, unknown> = { subject, body };
      if (hostId) payload.host_id = hostId;
      const data = await api.post<ConversationDetail>("/auth/conversations/", payload);
      set({ activeConversation: data, sending: false });
      // Refresh the list
      const list = await api.get<ConversationItem[]>("/auth/conversations/");
      set({ conversations: list });
    } catch {
      set({ sending: false });
    }
  },

  closeConversation: async (id: number) => {
    try {
      await api.post(`/auth/conversations/${id}/close/`);
      // Refresh
      const list = await api.get<ConversationItem[]>("/auth/conversations/");
      set({ conversations: list });
      const detail = await api.get<ConversationDetail>(`/auth/conversations/${id}/`);
      set({ activeConversation: detail });
    } catch {
      // Error
    }
  },
}));
