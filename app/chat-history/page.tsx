"use client"

import { useEffect, useMemo, useState } from "react";
import parse from "html-react-parser";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  MessageSquare, 
  Search, 
  Building2, 
  PanelLeftClose,
  PanelLeft,
  User,
  Sparkles,
  MoreHorizontal,
  Copy,
  Check
} from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChatHistoryRecord,
  ChatHistoryMessage,
  getChatHistory,
} from "@/lib/api/avatarApi";
import { getStoredUserName } from "@/lib/utils/userStorage";
import { useAppSelector } from "@/lib/store/hooks";

marked.setOptions({
  gfm: true,
  breaks: true,
});

const formatTimestamp = (timestamp?: string) => {
  if (!timestamp) return "";
  const sanitized = timestamp.replace(" ", "T");
  const parsed = new Date(sanitized);
  if (Number.isNaN(parsed.getTime())) {
    return timestamp;
  }
  return parsed.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getConversationLastTimestamp = (conversation: ChatHistoryRecord) => {
  const lastMessage = conversation.messages[conversation.messages.length - 1];
  if (!lastMessage?.created_at) {
    return 0;
  }
  const sanitized = lastMessage.created_at.replace(" ", "T");
  const parsed = new Date(sanitized);
  return Number.isNaN(parsed.getTime()) ? 0 : parsed.getTime();
};

const ConversationListSkeleton = () => (
  <div className="p-2 space-y-2">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`conversation-skeleton-${index}`}
        className="p-3 rounded-xl border border-transparent bg-white/60"
      >
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-4 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const MessagesSkeleton = () => (
  <div className="max-w-3xl mx-auto py-6 space-y-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={`message-skeleton-${index}`}
        className="px-4 py-6 rounded-2xl bg-white/80 border border-[#4454FF]/10"
      >
        <div className="flex gap-4">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ChatHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState<ChatHistoryRecord[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [resolvedUserName, setResolvedUserName] = useState<string | null>(null);
  const avatarHandle = useAppSelector((state) => state.avatar.handle);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    const stored = getStoredUserName();
    if (stored) {
      setResolvedUserName(stored);
      return;
    }

    if (avatarHandle) {
      setResolvedUserName(avatarHandle);
      return;
    }

    setResolvedUserName("shoaib");
  }, [avatarHandle]);

  useEffect(() => {
    if (!resolvedUserName) return;

    let cancelled = false;
    setIsLoading(true);

    getChatHistory(resolvedUserName)
      .then((response) => {
        if (cancelled) return;
        const chats = response.data?.data?.chats ?? [];
        setConversations(chats);
        setSelectedConversationId((prev) => {
          if (prev && chats.some((chat) => chat.conversation_id === prev)) {
            return prev;
          }
          let latestId: number | null = null;
          let latestTimestamp = -Infinity;
          chats.forEach((chat) => {
            const timestamp = getConversationLastTimestamp(chat);
            if (timestamp >= latestTimestamp) {
              latestTimestamp = timestamp;
              latestId = chat.conversation_id;
            }
          });
          return latestId ?? chats[0]?.conversation_id ?? null;
        });
      })
      .catch((error: any) => {
        if (cancelled) return;
        setConversations([]);
        setSelectedConversationId(null);
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Unable to load chat history.";
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [resolvedUserName]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort(
      (a, b) => getConversationLastTimestamp(b) - getConversationLastTimestamp(a)
    );
  }, [conversations]);

  const filteredConversations = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return sortedConversations;

    return sortedConversations.filter((conversation) => {
      const participant = conversation.user?.user_name?.toLowerCase() ?? "";
      const matchesMessages = conversation.messages.some((message) =>
        (message.message ?? "").toLowerCase().includes(term)
      );
      return participant.includes(term) || matchesMessages;
    });
  }, [sortedConversations, searchQuery]);

  const selectedConversation = conversations.find(
    (conversation) => conversation.conversation_id === selectedConversationId
  );

  const handleCopy = (content: string, id: number) => {
    if (!navigator?.clipboard) {
      toast.error("Clipboard not available in this browser.");
      return;
    }
    
    console.log('content', content);
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    toast.success("Copied to clipboard");
  };

  const renderSenderLabel = (message: ChatHistoryMessage, participantName?: string) => {
    if (message.sender?.type === "agent") {
      return "Your Avatar";
    }
    return participantName || "Recruiter";
  };

  const renderMessageTimestamp = (message: ChatHistoryMessage) =>
    formatTimestamp(message.created_at);

  const renderAgentMessageContent = (content?: string) => {
    if (!content) return null;
    try {
      const html = marked.parse(content, { async: false }) as string;
      return parse(html);
    } catch {
      return content;
    }
  };

  const hasConversations = conversations.length > 0;
  const noHistory = !isLoading && !hasConversations;

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#f7f6fe] via-white to-[#eef2ff] text-foreground">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-72" : "w-0"
        } transition-all duration-300 overflow-hidden border-r border-[#4454FF]/10 bg-white/80 backdrop-blur-sm shadow-sm flex flex-col sticky top-0 self-start h-screen`}
      >
        {/* Sidebar Header */}
        {/* <div className="p-3 border-b border-[#4454FF]/10 bg-white/60">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 bg-white/80 text-[#4454FF] border-[#4454FF]/30 hover:bg-[#4454FF]/10"
            onClick={() => router.push("/applications")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div> */}

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9 bg-white/90 border-[#4454FF]/20 focus-visible:ring-[#4454FF]/30"
            />
          </div>
        </div>

        {/* Conversation List */}
        <ScrollArea className="flex-1">
          {isLoading ? (
            <ConversationListSkeleton />
          ) : filteredConversations.length ? (
            <div className="p-2 space-y-1">
              {filteredConversations.map((conversation) => {
                const participantName = conversation.user?.user_name ?? "Recruiter";
                const lastMessage =
                  conversation.messages[conversation.messages.length - 1];
                const lastTimestamp = lastMessage
                  ? formatTimestamp(lastMessage.created_at)
                  : "No messages yet";

                return (
                  <button
                    key={conversation.conversation_id}
                    onClick={() => setSelectedConversationId(conversation.conversation_id)}
                    className={`w-full text-left p-3 rounded-xl transition-all group ${
                      selectedConversationId === conversation.conversation_id
                        ? "bg-gradient-to-r from-[#eef1ff] to-white border border-[#4454FF]/30 shadow"
                        : "border border-transparent hover:border-[#4454FF]/20 hover:bg-white/70"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-4 w-4 text-[#4454FF] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-foreground truncate">
                            {participantName}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">
                          {lastMessage?.message ?? "No messages yet"}
                        </p>
                        <p className="text-[10px] text-muted-foreground/80 truncate">
                          {lastTimestamp}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-sm text-muted-foreground">
              No conversations match your search.
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white/80 backdrop-blur-sm border-l border-transparent">
        {/* Chat Header */}
        <header className="h-16 border-b border-[#4454FF]/10 flex items-center px-4 gap-3 bg-white/80 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="shrink-0 text-[#4454FF] hover:bg-[#4454FF]/10"
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-5 w-5" />
            ) : (
              <PanelLeft className="h-5 w-5" />
            )}
          </Button>

          {selectedConversation && (
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0">
                <h1 className="font-semibold text-foreground truncate">
                  {selectedConversation.user?.user_name ?? "Recruiter"}
                </h1>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  Conversation #{selectedConversation.conversation_id}
                </p>
              </div>
            </div>
          )}
        </header>

        {/* Messages */}
        {isLoading ? (
          <ScrollArea className="flex-1">
            <MessagesSkeleton />
          </ScrollArea>
        ) : noHistory ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-medium text-foreground mb-1">No history available</h3>
            <p className="text-sm text-center">
              Your avatar has not chatted with anyone yet.
            </p>
          </div>
        ) : selectedConversation ? (
          <ScrollArea className="flex-1">
            <div className="max-w-3xl mx-auto py-6 space-y-4">
              {selectedConversation.messages.map((message, index) => {
                const isAvatar = message.sender?.type === "agent";
                const participantName = selectedConversation.user?.user_name;

                return (
                  <div
                    key={message.id}
                    className={`group px-4 py-6 ${
                      isAvatar
                        ? "bg-gradient-to-br from-[#eef1ff] to-white border border-[#4454FF]/10 shadow-sm"
                        : "bg-white/90 border border-[#4454FF]/5"
                    } rounded-2xl ${index !== 0 ? "mt-2" : ""}`}
                  >
                    <div className="max-w-3xl mx-auto flex gap-4">
                      <Avatar className="h-8 w-8 shrink-0 mt-1">
                        <AvatarFallback
                          className={
                            isAvatar
                              ? "bg-gradient-to-br from-[#4454FF] to-[#6c7cff] text-white"
                              : "bg-white border border-[#4454FF]/20 text-[#4454FF]"
                          }
                        >
                          {isAvatar ? (
                            <Sparkles className="h-4 w-4" />
                          ) : (
                            <User className="h-4 w-4" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm text-foreground">
                            {renderSenderLabel(message, participantName)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {renderMessageTimestamp(message)}
                          </span>
                        </div>
                        {isAvatar ? (
                          <div className="prose prose-sm max-w-none text-foreground prose-headings:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-li:text-foreground">
                            {renderAgentMessageContent(message.message)}
                          </div>
                        ) : (
                          <div className="prose prose-sm max-w-none text-muted-foreground">
                            <p className="whitespace-pre-wrap leading-relaxed text-base text-foreground/90">
                              {message.message}
                            </p>
                          </div>
                        )}

                        {/* Action buttons */}
                        <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-muted-foreground hover:text-[#4454FF]"
                            onClick={() => handleCopy(message.message, message.id)}
                          >
                            {copiedId === message.id ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2 text-muted-foreground hover:text-[#4454FF]"
                          >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <div className="h-16 w-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h3 className="font-medium text-foreground mb-1">Select a conversation</h3>
            <p className="text-sm text-center">
              Choose a conversation from the sidebar to view the chat history
            </p>
          </div>
        )}

        {/* Footer note */}
        {selectedConversation && !isLoading && (
          <div className="border-t border-[#4454FF]/10 p-4 text-center bg-white/80">
            <p className="text-xs text-muted-foreground">
              This is a read-only view of conversations employers have had with your avatar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
