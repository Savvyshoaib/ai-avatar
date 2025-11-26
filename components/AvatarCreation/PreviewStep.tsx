"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, RefreshCw, MessageSquare } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/lib/store/hooks";
import { addKnowledge } from "@/lib/api/avatarApi";
import { toast } from "sonner";

type PreviewQA = {
  question: string;
  answer: string;
};

type PreviewStepProps = {
  data: AvatarData;
  updateData?: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function PreviewStep({ data, onNext, onBack }: PreviewStepProps) {
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [knowledgeField, setKnowledgeField] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const avatar = useAppSelector((state) => state.avatar);

  const sampleIntro = `Hi! I'm ${data.fullName}, ${data.headline}. ${data.bio}`;

  const sampleQA: PreviewQA[] = [
    {
      question: "Tell me about yourself",
      answer: `I'm ${data.fullName}, based in ${data.location}. ${
        data.bio
      } My expertise spans ${data.expertise
        .slice(0, 3)
        .join(
          ", "
        )}, and I'm passionate about bringing innovative solutions to challenging problems.`,
    },
    {
      question: "What are your key strengths?",
      answer: `My key strengths lie in ${data.expertise
        .slice(0, 2)
        .join(
          " and "
        )}. I combine technical expertise with strong communication skills, allowing me to bridge the gap between complex concepts and practical applications. I'm known for being ${
        data.personalityType === "professional"
          ? "results-driven and detail-oriented"
          : data.personalityType === "friendly"
          ? "collaborative and team-focused"
          : "creative and innovative"
      }.`,
    },
  ];

  // const handleRegenerate = async () => {
  //   setIsRegenerating(true);
  //   await new Promise((resolve) => setTimeout(resolve, 1500));
  //   setIsRegenerating(false);
  // };

  const handleSubmit = async () => {
    const trimmedKnowledge = knowledgeField.trim();

    let formData = {
      user_name: avatar.handle,
      knowledge: trimmedKnowledge,
      full_name: data.fullName,
      headline: data.headline,
      location: data.location,
      short_bio: data.bio,
      personality:
        data.personalityType === "custom"
          ? data.customTone || ""
          : data.personalityType,
      skills: data.expertise,
      about_yourself: sampleQA[0].answer,
      strength: sampleQA[1].answer,
    };

    if (!trimmedKnowledge) {
      toast.error(
        "Please describe the adjustments you want before continuing."
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await addKnowledge(formData);

      toast.success("Your feedback has been shared with the avatar.");
      localStorage.removeItem("olivData");
      onNext();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-8 border-0 shadow-none md:p-10">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold md:text-3xl text-zinc-900">
            Review Your Avatar
          </h2>
          <p className="text-zinc-600">
            See how your avatar will represent you
          </p>
        </div>
        {/* <Button
          variant="outline"
          size="sm"
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRegenerating ? "animate-spin" : ""}`} />
          Regenerate
        </Button> */}
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-white border rounded-lg border-zinc-200">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-[#4454FF] flex items-center justify-center text-white text-2xl font-bold">
              {data.fullName.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="mb-1 text-xl font-bold text-zinc-900">
                {data.fullName}
              </h3>
              <p className="mb-2 text-zinc-600">{data.headline}</p>
              <div className="flex flex-wrap gap-2">
                {data.expertise.slice(0, 4).map((skill) => (
                  <Badge key={skill} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-zinc-700">{sampleIntro}</p>
        </div>

        <div>
          <h3 className="mb-2 font-semibold text-zinc-900">Personality Tone</h3>
          <div className="p-4 border rounded-lg bg-zinc-100 border-zinc-200">
            <p className="text-sm capitalize">
              <span className="font-medium">Style:</span>{" "}
              {data.personalityType === "custom"
                ? "Custom"
                : data.personalityType}
            </p>
            {data.personalityType === "custom" && data.customTone && (
              <p className="mt-2 text-sm text-zinc-600">{data.customTone}</p>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold text-zinc-900">
            Sample Conversations
          </h3>
          <div className="space-y-4">
            {sampleQA.map((qa) => (
              <div
                key={qa.question}
                className="overflow-hidden border rounded-lg"
              >
                <div className="p-4 bg-zinc-100">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-zinc-500 mt-0.5" />
                    <p className="text-sm font-medium">{qa.question}</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {qa.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border rounded-lg bg-zinc-50 border-zinc-200">
          <p className="mb-2 text-sm text-zinc-600">
            Want to adjust the tone or responses?
          </p>
          <Textarea
            name="knowledgeField"
            value={knowledgeField}
            onChange={(event) => setKnowledgeField(event.target.value)}
            placeholder="Provide feedback or specific changes you'd like..."
            className="min-h-[80px]"
          />
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1 cursor-pointer"
          >
            Edit Details
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!knowledgeField.trim() || isSubmitting}
            className="flex-1 cursor-pointer bg-[#4454FF] hover:bg-[#4454FF]/90 text-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Looks Great → Publish Avatar"}
          </Button>
        </div>
      </div>
    </Card>
  );
}
