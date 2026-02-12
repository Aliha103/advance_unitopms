"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useMessageStore } from "@/stores/message-store";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TABS = ["All", "Open", "Closed"];

export default function InboxPage() {
  const searchParams = useSearchParams();
  const user = useAuthStore((s) => s.user);
  const isHost = user?.is_host ?? false;

  const conversations = useMessageStore((s) => s.conversations);
  const activeConversation = useMessageStore((s) => s.activeConversation);
  const loaded = useMessageStore((s) => s.loaded);
  const sending = useMessageStore((s) => s.sending);
  const fetchConversations = useMessageStore((s) => s.fetchConversations);
  const fetchConversation = useMessageStore((s) => s.fetchConversation);
  const sendMessage = useMessageStore((s) => s.sendMessage);
  const createConversation = useMessageStore((s) => s.createConversation);
  const closeConversation = useMessageStore((s) => s.closeConversation);

  const [tab, setTab] = useState("All");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newSubject, setNewSubject] = useState("");
  const [newBody, setNewBody] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Auto-select from URL param
  useEffect(() => {
    const convId = searchParams.get("conversation");
    if (convId && loaded) {
      setSelectedId(Number(convId));
    }
  }, [searchParams, loaded]);

  // Fetch conversation detail when selected
  useEffect(() => {
    if (selectedId) {
      fetchConversation(selectedId);
    }
  }, [selectedId, fetchConversation]);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  // Filter conversations by tab
  const filtered = conversations.filter((c) => {
    if (tab === "Open") return c.status === "open";
    if (tab === "Closed") return c.status === "closed";
    return true;
  });

  const handleSend = async () => {
    if (!messageText.trim() || !selectedId) return;
    await sendMessage(selectedId, messageText.trim());
    setMessageText("");
  };

  const handleCreate = async () => {
    if (!newSubject.trim() || !newBody.trim()) return;
    await createConversation(newSubject.trim(), newBody.trim());
    setShowNew(false);
    setNewSubject("");
    setNewBody("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isHost ? "Messages" : "Inbox"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {isHost
              ? "Send messages to UnitoPMS support."
              : "View and respond to host messages."}
          </p>
        </div>
        <button
          onClick={() => setShowNew(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all"
          style={{
            background: "linear-gradient(135deg, #0d9488, #0891b2)",
            boxShadow: "0 4px 12px rgba(13,148,136,0.3)",
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New Conversation
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit mb-4">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              tab === t
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Main chat layout */}
      <div className="flex-1 flex gap-4 min-h-0">
        {/* Conversation list */}
        <div className="w-80 shrink-0 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {!loaded ? (
              <div className="py-12 text-center text-sm text-gray-400">Loading...</div>
            ) : filtered.length === 0 ? (
              <div className="py-12 text-center">
                <svg className="w-10 h-10 text-gray-300 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-400">No conversations.</p>
              </div>
            ) : (
              filtered.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedId(conv.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-gray-50 transition-colors hover:bg-gray-50/80",
                    selectedId === conv.id && "bg-teal-50/50"
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className={cn(
                      "text-sm truncate",
                      conv.unread_count > 0 ? "font-bold text-gray-900" : "font-medium text-gray-700"
                    )}>
                      {conv.subject}
                    </p>
                    {conv.unread_count > 0 && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                  {!isHost && (
                    <p className="text-xs text-teal-600 font-medium mt-0.5">{conv.host_company}</p>
                  )}
                  <p className="text-xs text-gray-400 truncate mt-0.5">{conv.last_message_preview}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      conv.status === "open" ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {conv.status}
                    </span>
                    <span className="text-[10px] text-gray-400">{timeAgo(conv.last_message_at)}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat panel */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col overflow-hidden">
          {!selectedId || !activeConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm text-gray-500">Select a conversation to view messages.</p>
              </div>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{activeConversation.subject}</h3>
                  {!isHost && (
                    <p className="text-xs text-gray-500">
                      {activeConversation.host_company} &middot; {activeConversation.host_email}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-xs font-medium px-2 py-1 rounded-full",
                    activeConversation.status === "open"
                      ? "bg-green-50 text-green-600"
                      : "bg-gray-100 text-gray-500"
                  )}>
                    {activeConversation.status}
                  </span>
                  {!isHost && activeConversation.status === "open" && (
                    <button
                      onClick={() => closeConversation(activeConversation.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                    >
                      Close
                    </button>
                  )}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                {activeConversation.messages.map((msg) => {
                  const isMine = isHost ? msg.is_from_host : !msg.is_from_host;
                  return (
                    <div
                      key={msg.id}
                      className={cn("flex", isMine ? "justify-end" : "justify-start")}
                    >
                      <div
                        className={cn(
                          "max-w-[70%] rounded-2xl px-4 py-2.5",
                          isMine
                            ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        )}
                      >
                        <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
                        <div className={cn(
                          "flex items-center gap-2 mt-1",
                          isMine ? "justify-end" : "justify-start"
                        )}>
                          <span className={cn(
                            "text-[10px]",
                            isMine ? "text-white/70" : "text-gray-400"
                          )}>
                            {msg.sender_name}
                          </span>
                          <span className={cn(
                            "text-[10px]",
                            isMine ? "text-white/60" : "text-gray-400"
                          )}>
                            {timeAgo(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Compose bar */}
              {activeConversation.status === "open" && (
                <div className="px-4 py-3 border-t border-gray-100">
                  <div className="flex items-end gap-2">
                    <textarea
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message..."
                      rows={1}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300"
                    />
                    <button
                      onClick={handleSend}
                      disabled={sending || !messageText.trim()}
                      className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #0d9488, #0891b2)",
                      }}
                    >
                      {sending ? "..." : "Send"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* New conversation modal */}
      {showNew && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">New Conversation</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500">Subject</label>
                <input
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300"
                  placeholder="What is this about?"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500">Message</label>
                <textarea
                  value={newBody}
                  onChange={(e) => setNewBody(e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-300"
                  rows={4}
                  placeholder="Describe your issue or question..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowNew(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={sending || !newSubject.trim() || !newBody.trim()}
                className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #0d9488, #0891b2)",
                }}
              >
                {sending ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
