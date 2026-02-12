import { create } from "zustand";
import { api } from "@/lib/api-client";

interface Notification {
  id: number;
  category: string;
  title: string;
  message: string;
  is_read: boolean;
  action_url: string;
  created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loaded: boolean;
  fetch: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: number) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loaded: false,

  fetch: async () => {
    try {
      const data = await api.get<Notification[]>("/auth/notifications/");
      set({
        notifications: data,
        unreadCount: data.filter((n) => !n.is_read).length,
        loaded: true,
      });
    } catch {
      set({ loaded: true });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const data = await api.get<{ count: number }>("/auth/notifications/unread-count/");
      set({ unreadCount: data.count });
    } catch {
      // ignore
    }
  },

  markRead: async (id: number) => {
    try {
      await api.post(`/auth/notifications/${id}/read/`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, is_read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // ignore
    }
  },

  markAllRead: async () => {
    try {
      await api.post("/auth/notifications/read-all/");
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, is_read: true })),
        unreadCount: 0,
      }));
    } catch {
      // ignore
    }
  },
}));
