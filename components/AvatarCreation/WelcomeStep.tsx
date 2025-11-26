"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Briefcase, MessageSquare, Clock } from "lucide-react";
import { useSearchParams } from "next/navigation";

type WelcomeStepProps = {
  onNext: () => void;
};

export function WelcomeStep({ onNext }: WelcomeStepProps) {
   const searchParams = useSearchParams();
    const q = searchParams.get("q");
  
    let decoded = "";
    try {
      decoded = Buffer.from(q || "", "base64").toString("utf8");
      localStorage.setItem("olivData", decoded);
    } catch (e) {
      console.error("Decode error:::", e);
    }

  return (
    <Card className="p-8 md:p-12 text-center border-0 shadow-none">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4454FF]">
        <Sparkles className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#4454FF]">
        Let's Bring Your Career to Life
      </h1>

      <p className="text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
        We'll help you create your own Digital Avatar that represents you to employers — ready to apply, answer, and
        connect 24/7.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mb-10 text-left">
        <div className="flex flex-col items-start gap-2">
          <div className="w-12 h-12 rounded-lg bg-[#4454FF]/10 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-[#4454FF]" />
          </div>
          <h3 className="font-semibold text-zinc-900">Always Available</h3>
          <p className="text-sm text-zinc-600">Your avatar works around the clock, connecting with opportunities</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="w-12 h-12 rounded-lg bg-[#4454FF]/10 flex items-center justify-center">
            <MessageSquare className="w-6 h-6 text-[#4454FF]" />
          </div>
          <h3 className="font-semibold text-zinc-900">Smart Conversations</h3>
          <p className="text-sm text-zinc-600">Answers recruiter questions using your real experience</p>
        </div>

        <div className="flex flex-col items-start gap-2">
          <div className="w-12 h-12 rounded-lg bg-[#4454FF]/10 flex items-center justify-center">
            <Clock className="w-6 h-6 text-[#4454FF]" />
          </div>
          <h3 className="font-semibold text-zinc-900">5 Minutes Setup</h3>
          <p className="text-sm text-zinc-600">Quick and easy process to get your avatar live</p>
        </div>
      </div>

      <Button size="lg" variant='olivBtn' onClick={onNext} className="w-full cursor-pointer md:w-auto px-8 bg-[#4454FF] hover:bg-[#4454FF]/90 text-white">
        Get Started
      </Button>
    </Card>
  );
}
