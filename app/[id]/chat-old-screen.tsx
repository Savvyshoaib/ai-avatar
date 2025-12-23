"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Send,
  Copy,
  Pencil,
  PanelLeft,
  PanelLeftClose,
  Search,
} from "lucide-react";
import { chatAvatar } from "@/lib/api/avatarApi";
import { toast } from "sonner";
import parse from "html-react-parser";
import { marked } from "marked";
import Link from "next/link";

type TrainChatMessage = {
  role: "user" | "avatar";
  content: string;
};

type Conversation = {
  id: string;
  title: string;
  preview: string;
  lastUpdated: string;
  messages: TrainChatMessage[];
};

const truncateText = (text: string, limit = 60) =>
  text.length > limit ? `${text.slice(0, limit)}...` : text;

const createInitialConversations = (avatarLabel: string): Conversation[] => [
  {
    id: "conv-1",
    title: "Interview Prep",
    preview: "Let's polish your elevator pitch for recruiters.",
    lastUpdated: "Today",
    messages: [
      {
        role: "user",
        content: "Can you help me prep for marketing interviews?",
      },
      {
        role: "avatar",
        content: `Absolutely! Here's how I'd introduce myself and share two tailored examples when speaking as ${avatarLabel}.`,
      },
    ],
  },
  {
    id: "conv-2",
    title: "Cover Letter Draft",
    preview: "This opening paragraph feels confident and personal.",
    lastUpdated: "Yesterday",
    messages: [
      {
        role: "user",
        content: "Draft a short cover letter for a growth strategist role.",
      },
      {
        role: "avatar",
        content:
          "Here's a warm, metrics-driven intro paragraph that highlights your impact in previous growth roles.",
      },
    ],
  },
  {
    id: "conv-3",
    title: "Networking Reply",
    preview: "Use gratitude + next steps to keep things moving.",
    lastUpdated: "2 days ago",
    messages: [
      {
        role: "user",
        content: "How should I reply to a recruiter asking for availability?",
      },
      {
        role: "avatar",
        content:
          "Acknowledge their note, offer two time slots, and restate your excitement for the conversation.",
      },
    ],
  },
];

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);

  const initialConversations = React.useMemo(
    () => createInitialConversations(id),
    [id]
  );

  const [conversations, setConversations] = useState<Conversation[]>(
    initialConversations
  );
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    initialConversations[0]?.id ?? null
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [inputHeight, setInputHeight] = useState(50);

  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const inputTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );
  const messages = activeConversation?.messages ?? [];

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const textarea = inputTextareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const newHeight = Math.min(textarea.scrollHeight, 200);
    const clampedHeight = Math.max(newHeight, 50);
    textarea.style.height = `${clampedHeight}px`;
    textarea.style.overflowY = textarea.scrollHeight > 200 ? "auto" : "hidden";
    setInputHeight(clampedHeight);
  }, [input]);

  const filteredConversations = React.useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return conversations;
    return conversations.filter(
      (conversation) =>
        conversation.title.toLowerCase().includes(term) ||
        conversation.preview.toLowerCase().includes(term)
    );
  }, [conversations, searchTerm]);

  const inputBorderRadius = React.useMemo(() => {
    if (inputHeight <= 50) return "50px";
    if (inputHeight <= 90) return "20px";
    if (inputHeight <= 120) return "16px";
    if (inputHeight <= 150) return "14px";
    if (inputHeight <= 180) return "8px";
    return "4px";
  }, [inputHeight]);

  const handleSelectConversation = (conversationId: string) => {
    setActiveConversationId(conversationId);
    setInput("");
    setEditIndex(null);
    setIsTyping(false);
  };

  const handleCreateConversation = () => {
    const newConversation: Conversation = {
      id: `conv-${Date.now()}`,
      title: "New Chat",
      preview: "Start a new conversation to train your avatar.",
      lastUpdated: "Just now",
      messages: [],
    };

    setConversations((prev) => [newConversation, ...prev]);
    setActiveConversationId(newConversation.id);
    setInput("");
    setEditIndex(null);
  };

  // =====================
  // SEND MESSAGE
  // =====================
  const handleSend = async () => {
    const conversationId = activeConversationId;
    if (!conversationId) return;
    const trimmed = input.trim();
    if (!trimmed) return;

    setInput("");
    setInputHeight(50);
    if (inputTextareaRef.current) {
      inputTextareaRef.current.style.height = "50px";
      inputTextareaRef.current.style.overflowY = "hidden";
    }
    setIsTyping(true);
    setEditIndex(null);

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }

        const isEditingCurrentConversation =
          editIndex !== null && editIndex < conversation.messages.length;

        const newUserMessage: TrainChatMessage = {
          role: "user",
          content: trimmed,
        };

        const nextMessages = isEditingCurrentConversation
          ? conversation.messages.map((message, index) =>
              index === editIndex ? { ...message, content: trimmed } : message
            )
          : [...conversation.messages, newUserMessage];

        const shouldRename = conversation.messages.length === 0;

        return {
          ...conversation,
          messages: nextMessages,
          title: shouldRename
            ? truncateText(trimmed, 32)
            : conversation.title,
          preview: truncateText(trimmed),
          lastUpdated: "Just now",
        };
      })
    );

    try {
      const res = await chatAvatar({
        user_name: id,
        message: trimmed
      });

      const reply =
        res.data?.data?.[0]?.reply ||
        res.data?.reply ||
        "I'm processing your instructions.";

      const avatarReply: TrainChatMessage = { role: "avatar", content: reply };

      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.id === conversationId
            ? {
                ...conversation,
                messages: [...conversation.messages, avatarReply],
                preview: truncateText(reply),
                lastUpdated: "Just now",
              }
            : conversation
        )
      );
    } catch {
      toast.error("Avatar could not respond.");
    } finally {
      setIsTyping(false);
    }
  };

  // =====================
  // UI
  // =====================
  return (
    <div className="h-[calc(100vh-80px)] flex bg-gradient-to-br from-white to-[#f5f7ff]">
      {/* ================= SIDEBAR ================= */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 overflow-hidden border-r bg-white/90 backdrop-blur`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 pb-2 border-b space-y-3">
            <Button className="w-full" onClick={handleCreateConversation}>
              + New Chat
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search chats"
                className="w-full rounded-2xl border border-zinc-200 bg-white/70 py-2 pl-10 pr-3 text-sm text-zinc-700 placeholder:text-zinc-400 focus:border-[#4454FF] focus:outline-none focus:ring-2 focus:ring-[#4454FF]/20"
                type="text"
              />
            </div>
          </div>

          <ScrollArea className="flex-1 px-3 py-4">
            <div className="space-y-2">
              {filteredConversations.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-6">
                  No conversations found
                </p>
              )}
              {filteredConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation.id)}
                  className={`w-full text-left transition-all rounded-[6px] border px-4 py-3 backdrop-blur-sm  ${
                    conversation.id === activeConversationId
                      ? "border-[#4454FF]/40 bg-gradient-to-r from-[#eef1ff] to-white shadow"
                      : "border-transparent hover:border-zinc-200 bg-white/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">
                        {conversation.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {conversation.preview}
                      </p>
                    </div>
                    <span className="text-[11px] text-zinc-400 whitespace-nowrap">
                      {conversation.lastUpdated}
                    </span>
                  </div>
                  {/* <div className="mt-2 h-[6px] w-full rounded-full bg-zinc-100">
                    <div
                      className={`h-full rounded-full ${
                        conversation.id === activeConversationId
                          ? "bg-[#4454FF]"
                          : "bg-zinc-300"
                      }`}
                      style={{ width: "65%" }}
                    />
                  </div> */}
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t space-y-3">
            <Link href={`/update/${id}`}>
              <Button variant="outline" className="w-full">
                Update Avatar
              </Button>
            </Link>
            <p className="text-xs text-muted-foreground">
              Teach your avatar how to respond in your tone by iterating here.
            </p>
          </div>
        </div>
      </div>

      {/* ================= MAIN CHAT ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-4 gap-3 bg-white/90 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>

          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Training Chat
            </p>
            <h2 className="font-semibold text-lg">
              {activeConversation?.title ?? "Select a conversation"}
            </h2>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-10">
                Start a new conversation to teach your avatar how to respond like
                you.
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`relative group max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition ${
                      message.role === "user"
                        ? "bg-[#4454FF] text-white rounded-br-none"
                        : "bg-white text-zinc-800 rounded-bl-none"
                    }`}
                  >
                    {parse(marked.parse(message.content) as string)}

                    <div className="absolute bottom-0 right-0 translate-y-full opacity-0 group-hover:opacity-100 flex gap-2 bg-white px-2 py-1 rounded shadow">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(message.content);
                          toast.success("Copied");
                        }}
                        className="text-zinc-500 hover:text-[#4454FF]"
                      >
                        <Copy size={14} />
                      </button>

                      {message.role === "user" && (
                        <button
                          onClick={() => {
                            setEditIndex(index);
                            setInput(message.content);
                          }}
                          className="text-zinc-500 hover:text-[#4454FF]"
                        >
                          <Pencil size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex gap-2 text-xs text-muted-foreground items-center">
                <span className="h-2 w-2 rounded-full bg-[#4454FF] animate-pulse" />
                {id} is typing...
              </div>
            )}

            <div ref={endOfMessagesRef} />
          </div>
        </ScrollArea>

        {/* Input */}
       <div className="border-t bg-white/90 backdrop-blur p-4">
  <div className="max-w-3xl mx-auto">
    <div
      className="flex min-h-[50px] max-h-[200px] items-stretch gap-3 rounded-[50px] border border-zinc-200 bg-zinc-50 px-4 focus-within:border-[#4454FF] focus-within:ring-2 focus-within:ring-[#4454FF]/10"
      style={{ borderRadius: inputBorderRadius }}
    >
      <div className="relative flex-1 pr-1">
        <textarea
          ref={inputTextareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          rows={1}
          className="w-full resize-none bg-transparent py-3 pr-4 text-sm leading-relaxed placeholder:text-zinc-400 focus:outline-none scrollbar-thin scrollbar-thumb-[#cfd2df] scrollbar-track-transparent [&::-webkit-scrollbar-thumb]:rounded-full"
          style={{
            borderRadius: inputBorderRadius,
          }}
          placeholder="Send a message to train your avatar"
        />
      </div>

      <Button
        size="icon"
        onClick={handleSend}
        className={`h-[40px] w-[40px] shrink-0 bg-[#4454FF] text-white transition-all ${
          inputHeight >= 200 ? "self-end mb-1" : "self-center"
        }`}
        style={{ borderRadius: inputBorderRadius }}
      >
        <Send size={16} />
      </Button>
    </div>

    {editIndex !== null && (
      <p className="mt-2 text-xs text-amber-600">
        Editing previous message… press Enter to resubmit.
      </p>
    )}
  </div>
</div>

      </div>
    </div>
  );
}
