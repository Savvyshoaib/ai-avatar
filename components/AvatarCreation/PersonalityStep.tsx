"use client";

import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Briefcase, Smile, Laugh, Sparkles } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";

type PersonalityOption = {
  value: "professional" | "friendly" | "humorous" | "custom";
  label: string;
  icon: typeof Briefcase;
  description: string;
};

const personalityTypes: PersonalityOption[] = [
  {
    value: "professional",
    label: "Professional",
    icon: Briefcase,
    description: "Clear, formal, and business-focused",
  },
  {
    value: "friendly",
    label: "Friendly",
    icon: Smile,
    description: "Warm, approachable, and conversational",
  },
  {
    value: "humorous",
    label: "Humorous",
    icon: Laugh,
    description: "Light-hearted with personality",
  },
  {
    value: "custom",
    label: "My Own Style",
    icon: Sparkles,
    description: "Define your unique tone",
  },
];

type PersonalityStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function PersonalityStep({
  data,
  updateData,
  onNext,
  onBack,
}: PersonalityStepProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card className="p-8 border-0 md:p-10 shadow-elegant">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h2 className="mb-2 text-2xl font-bold md:text-3xl">
        How should your avatar sound?
      </h2>
      <p className="mb-8 text-muted-foreground">
        Choose the tone your avatar will use when talking to recruiters
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <RadioGroup
          value={data.personalityType}
          onValueChange={(value: PersonalityOption["value"]) =>
            updateData({ personalityType: value })
          }
          className="space-y-4"
        >
          {personalityTypes.map((type) => (
            <div key={type.value}>
              <div
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                  data.personalityType === type.value
                    ? "border-[#4454FF] bg-[#4454FF]/5"
                    : "border-zinc-200 hover:border-[#4454FF]/50"
                }`}
              >
                <RadioGroupItem
                  value={type.value}
                  id={type.value}
                  className="mt-1"
                />
                <Label htmlFor={type.value} className="flex-1 cursor-pointer">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-oliv-light">
                      <type.icon className="w-4 h-4 text-color-oliv" />
                    </div>
                    <span className="font-semibold">{type.label}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {type.description}
                  </p>
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        {data.personalityType === "custom" && (
          <div className="animate-fade-in">
            <Label htmlFor="customTone">
              Describe Your Tone (2-3 sentences)
            </Label>
            <Textarea
              id="customTone"
              value={data.customTone}
              onChange={(e) => updateData({ customTone: e.target.value })}
              placeholder="Describe how you want your avatar to sound. For example: 'Professional but enthusiastic, with a focus on collaboration and innovation...'"
              className="min-h-[100px]"
              required={data.personalityType === "custom"}
            />
          </div>
        )}

        <div className="p-4 border rounded-lg bg-muted/50">
          <p className="mb-2 text-sm font-medium">💡 Coming Soon</p>
          <p className="text-sm text-muted-foreground">
            Record a 10-second voice note to give your avatar your actual voice
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer"
          variant="olivBtn"
          disabled={
            data.personalityType === "custom" && !data.customTone.trim()
          }
        >
          Generate Avatar Preview
        </Button>
      </form>
    </Card>
  );
}
