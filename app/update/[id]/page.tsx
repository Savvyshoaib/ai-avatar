"use client";

import { useState, useEffect, useRef, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";
import { increaseKnowledge } from "@/lib/api/avatarApi";
import { useAppSelector } from "@/lib/store/hooks";
import { toast } from "sonner";
import React from "react";
import Link from "next/link";

export default function UpdateChat({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  type TrainChatMessage = {
    role: "user" | "avatar";
    content: string;
  };

  const [messages, setMessages] = useState<TrainChatMessage[]>([]);
  const { id } = React.use(params);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const avatarHandle = useAppSelector((state) => state.avatar.handle);

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

  const handleSend = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    const userMessage: TrainChatMessage = {
      role: "user",
      content: trimmedInput,
    };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");
    setIsTyping(true);

    try {
      const response = await increaseKnowledge({
        user_name: id,
        knowledge: trimmedInput,
      });

      const responseData = response.data?.data;
      const firstReply = Array.isArray(responseData)
        ? responseData[0]?.reply
        : response.data?.reply;

      const apiMessage =
        firstReply ||
        response.data?.message ||
        "Thanks! I'm processing your instructions.";

      setMessages((prev) => [...prev, { role: "avatar", content: apiMessage }]);
    } catch (error) {
      toast.error(
        (error as any)?.response?.data?.errors?.user_name?.[0] ||
          "Avatar couldn't respond. Please try again."
      );
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

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex items-center justify-center h-full py-12 bg-white">
      <div className="container w-full max-w-3xl px-4 mx-auto">
        <Card className="p-2 border-0 shadow-none md:p-10">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-bold md:text-3xl text-zinc-900">
              Update Your Avatar
            </h2>
            <p className="text-zinc-600">
              Say hello to your digital self. Teach it how to answer like you.
            </p>
          </div>

          <Card className="mb-6 bg-white border shadow-none border-zinc-200">
            {/* Scrollable chat area */}
            <ScrollArea className="h-[600px] md:h-[400px] p-4">
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
                      className={`flex flex-col max-w-[80%] ${
                        message.role === "user"
                          ? "items-end text-right"
                          : "items-start text-left"
                      }`}
                    >
                      {/* Sender name */}
                      <span
                        className={`text-xs font-semibold mb-1 ${
                          message.role === "user"
                            ? "text-[#4454FF]"
                            : "text-zinc-500"
                        }`}
                      >
                        {message.role === "user" ? "You" : "Oliv"}
                      </span>

                      {/* Chat bubble */}
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm leading-relaxed shadow-sm ${
                          message.role === "user"
                            ? "bg-[#4454FF] text-white rounded-br-none"
                            : "bg-zinc-100 text-zinc-800 rounded-bl-none"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing loader */}
                {isTyping && (
                  <div className="flex justify-start">
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

                {/* Scroll anchor (always last) */}
                <div ref={endOfMessagesRef} />
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="p-4 border-t border-zinc-200">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(value) => setInput(value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your avatar a question..."
                  className="flex-1"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  className="cursor-pointer bg-[#4454FF] hover:bg-[#4454FF]/90 text-white"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </Card>

        <div className="flex justify-center">
          <Link href={`/${id}`}>
            <Button
              size="lg"
              variant="olivBtn"
              className="w-full cursor-pointer md:w-auto px-8 bg-[#4454FF] hover:bg-[#4454FF]/90 text-white"
            >
              Chat with avatar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
