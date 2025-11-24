"use client";

import * as React from "react";
import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Copy, Pencil } from "lucide-react";
import { chatAvatar } from "@/lib/api/avatarApi";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import parse from "html-react-parser";
import { marked } from "marked";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  type TrainChatMessage = {
    role: "user" | "avatar";
    content: string;
  };

  const { id } = React.use(params);
  const [messages, setMessages] = useState<TrainChatMessage[]>([]);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement | null>(null);
  const [errorIndex, setErrorIndex] = useState(0);

  const errorMessages = [
    "Hmm… something went wrong on my side. Maybe the agent ID didn’t respond correctly. Could you try again?",
    "Still having trouble processing that. It looks like the agent ID might be invalid or disconnected. Please try rephrasing.",
    "I'm trying to reconnect to the agent, but the request failed again. Possibly an incorrect username or session error — try once more?",
    "Connection dropped with the agent. It could be a wrong agent ID or temporary network issue. Please try again differently.",
  ];

  useEffect(() => {
    // Always scroll to bottom smoothly when messages update
    endOfMessagesRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages]);

  // const handleSend = async () => {
  //     const trimmedInput = input.trim();
  //     if (!trimmedInput) return;

  //     const userMessage: TrainChatMessage = { role: "user", content: trimmedInput };
  //     setMessages((prev) => [...prev, userMessage]);

  //     setInput("");
  //     setIsTyping(true);

  //     try {
  //         const response = await chatAvatar({
  //             user_name: id,
  //             message: trimmedInput,
  //         });

  //         const responseData = response.data?.data;
  //         const firstReply = Array.isArray(responseData) ? responseData[0]?.reply : response.data?.reply;

  //         const apiMessage =
  //             firstReply ||
  //             response.data?.message ||
  //             "Thanks! I'm processing your instructions.";

  //         setMessages((prev) => [...prev, { role: "avatar", content: apiMessage }]);
  //     } catch (err) {
  //         const error = err as any;
  //         toast.error(error?.response?.data?.errors?.agentId?.[0] || "Avatar couldn't respond. Please try again.");

  //         const messageToShow = errorMessages[errorIndex % errorMessages.length];

  //         setMessages((prev) => [
  //             ...prev,
  //             { role: "avatar", content: messageToShow },
  //         ]);

  //         setErrorIndex((prev) => prev + 1);
  //     } finally {
  //         setIsTyping(false);
  //     }
  // };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // ---------- If Editing Message ----------
    if (editIndex !== null) {
      const updatedMessages = [...messages];
      updatedMessages[editIndex] = {
        ...updatedMessages[editIndex],
        content: trimmedInput,
      };

      setMessages(updatedMessages);
      setEditIndex(null);
      setInput("");
      setIsTyping(true);

      // Re-hit API with edited message
      try {
        const response = await chatAvatar({
          user_name: id,
          message: trimmedInput,
        });

        const reply =
          response.data?.data?.[0]?.reply ||
          response.data?.reply ||
          "Thanks! I'm processing your instructions.";

        // Replace the avatar reply AFTER the edited message
        setMessages((prev) => [...prev, { role: "avatar", content: reply }]);
      } catch (error) {
        toast.error("Error while updating message.");
      } finally {
        setIsTyping(false);
      }

      return;
    }

    // ---------- Normal Send ----------
    const userMessage: TrainChatMessage = {
      role: "user",
      content: trimmedInput,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await chatAvatar({
        user_name: id,
        message: trimmedInput,
      });

      const reply =
        response.data?.data?.[0]?.reply ||
        response.data?.reply ||
        "Thanks! I'm processing your instructions.";

      setMessages((prev) => [...prev, { role: "avatar", content: reply }]);
    } catch (err) {
      const messageToShow = errorMessages[errorIndex % errorMessages.length];
      setMessages((prev) => [
        ...prev,
        { role: "avatar", content: messageToShow },
      ]);
      setErrorIndex((prev) => prev + 1);
    } finally {
      setIsTyping(false);
    }
  };

  // -----------------------------
  // JSX
  // -----------------------------
  return (
    <div className="h-full bg-gradient-to-b from-white to-[#f4f6ff] flex items-center justify-center py-12">
      <div className="container w-full max-w-3xl px-4 mx-auto">
        <Card className="p-2 border-0 shadow-none md:p-10">
          {/* Header with gradient */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-[#4454FF] to-[#7182ff] text-transparent bg-clip-text">
              Chat With Your Avatar
            </h2>
            <p className="text-zinc-600">
              Say hello to your digital self. Teach it how to answer like you.
            </p>
          </div>

          <Card className="relative overflow-hidden bg-white border shadow-sm border-zinc-200 rounded-3xl">
            {/* Fade overlay on top */}
            <div className="chat-fade-top" />

            {/* Scrollable chat area */}
            <ScrollArea className="h-[600px] md:h-[400px] p-4 relative">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="py-8 text-sm text-center text-zinc-500">
                    Start chatting to teach your avatar how to respond like you.
                  </div>
                )}

                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex w-full ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex flex-col max-w-[80%] bubble-anim ${
                        message.role === "user"
                          ? "items-end text-right"
                          : "items-start text-left"
                      }`}
                    >
                      <span
                        className={`text-xs font-semibold mb-1 ${
                          message.role === "user"
                            ? "text-[#4454FF]"
                            : "text-zinc-500"
                        }`}
                      >
                        {message.role === "user" ? "You" : id}
                      </span>

                      {/* BUBBLE + FIXED HOVER */}
                      <div
                        className={`relative group rounded-2xl px-4 py-2 text-sm leading-relaxed text-left shadow-sm transition-all duration-200
          ${
            message.role === "user"
              ? "bg-[#4454FF] text-white rounded-br-none"
              : "bg-zinc-100 text-zinc-800 rounded-bl-none"
          }
        `}
                      >
                        {parse(marked.parse(message.content) as string)}

                        {/* ACTION BUTTONS — FIXED: bottom right + no hide on hover */}
                        <div
                          className="
            absolute bottom-0 right-0 translate-y-[110%]
            opacity-0 group-hover:opacity-100
            transition-opacity duration-200
            flex gap-3 bg-white   px-3 py-1
            pointer-events-auto
          "
                        >
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(message.content);
                              toast.success("Copied!");
                            }}
                            className="text-zinc-600 hover:text-[#4454FF] cursor-pointer"
                          >
                            <Copy size={14} />
                          </button>

                          {message.role === "user" && (
                            <button
                              onClick={() => {
                                setEditIndex(index);
                                setInput(message.content);
                              }}
                              className="text-zinc-600 hover:text-[#4454FF] cursor-pointer"
                            >
                              <Pencil size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing loader */}
                {isTyping && (
                  <div className="flex justify-start bubble-anim">
                    <div className="flex flex-col items-start max-w-[80%]">
                      <span className="mb-1 text-xs font-semibold text-zinc-500">
                        {id}
                      </span>
                      <div className="px-4 py-2 rounded-bl-none shadow-sm bg-zinc-100 text-zinc-800 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" />
                          <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                          <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce [animation-delay:0.3s]" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={endOfMessagesRef} />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="p-4 bg-white border-t border-zinc-200">
              <div className="flex gap-2">
                {/* Textarea with Shift + Enter */}
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask your avatar a question..."
                  className="flex-1 min-h-[48px] max-h-32 resize-none rounded-xl border border-zinc-300 px-3 py-3 focus:ring-2 focus:ring-[#4454FF]/30 focus:border-[#4454FF] outline-none"
                />

                <Button
                  onClick={handleSend}
                  className="cursor-pointer bg-[#4454FF] hover:bg-[#4454FF]/90 text-white rounded-xl shadow-md transition-all"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Card>
      </div>
    </div>
  );
}
