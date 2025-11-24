"use client";

import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowLeft, Send, RefreshCw } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";

type TrainChatMessage = {
  role: "user" | "avatar";
  content: string;
};

type TrainChatStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function TrainChatStep({ data, updateData: _updateData, onNext, onBack }: TrainChatStepProps) {
  const initialMessage = `Hi! I'm ${data.fullName || "your"} digital avatar. Ask me anything about your experience, and help me learn how to answer like you!`;

  const [messages, setMessages] = useState<TrainChatMessage[]>([
    {
      role: "avatar",
      content: initialMessage,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: TrainChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    // Simulate avatar response
    setTimeout(() => {
      const avatarResponse: TrainChatMessage = {
        role: "avatar",
        content: "That's a great question! I'm learning from your inputs. You can correct me or provide more context to help me improve.",
      };
      setMessages((prev) => [...prev, avatarResponse]);
    }, 800);

    setInput("");
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="p-8 md:p-10 border-0 shadow-none">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6  cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-6">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-zinc-900">Chat With Your Avatar</h2>
        <p className="text-zinc-600">Say hello to your digital self. Teach it how to answer like you.</p>
      </div>

      <Card className="border border-zinc-200 shadow-none mb-6 bg-white">
        <ScrollArea className="h-[400px] p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-[#4454FF] text-white"
                      : "bg-zinc-100 text-zinc-700"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t border-zinc-200 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(value) => setInput(value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask your avatar a question..."
              className="flex-1"
            />
            <Button size="icon" onClick={handleSend} className="cursor-pointer bg-[#4454FF] hover:bg-[#4454FF]/90 text-white">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" className="gap-2 cursor-pointer">
          <RefreshCw className="w-4 h-4" />
          Train Again
        </Button>
        <Button size="lg" className="flex-1 cursor-pointer bg-[#4454FF] hover:bg-[#4454FF]/90 text-white" onClick={onNext}>
          Continue to Knowledge Upload
        </Button>
      </div>
    </Card>
  );
}
