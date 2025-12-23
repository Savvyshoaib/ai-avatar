"use client";

import { useState, useEffect, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";

const expertiseOptions: string[] = [
  "Design",
  "Engineering",
  "Product",
  "Marketing",
  "Business",
  "Finance",
  "Operations",
  "HR",
  "Sales",
  "Data Science",
  "Content",
  "Strategy",
];

type ExpertiseStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function ExpertiseStep({
  data,
  updateData,
  onNext,
  onBack,
}: ExpertiseStepProps) {
  const [customSkill, setCustomSkill] = useState<string>("");

  // 🔥 RESET PREFILLED DATA ON LOAD
  useEffect(() => {
    updateData({ expertise: [] });
  }, []);

  const toggleExpertise = (skill: string) => {
    const current = data.expertise || [];

    if (current.includes(skill)) {
      updateData({ expertise: current.filter((s) => s !== skill) });
    } else {
      updateData({ expertise: [...current, skill] });
    }
  };

  const addCustomSkill = () => {
    const trimmed = customSkill.trim();

    if (trimmed && !data.expertise.includes(trimmed)) {
      updateData({ expertise: [...data.expertise, trimmed] });
      setCustomSkill("");
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card className="p-8 md:p-10 border-0 shadow-elegant">
      <Button
        variant="ghost"
        size="sm"
        onClick={onBack}
        className="mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h2 className="text-2xl md:text-3xl font-bold mb-2">
        What best describes your strengths?
      </h2>
      <p className="text-muted-foreground mb-8">
        Select all areas where you have experience or expertise
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Expertise Options */}
        <div className="flex flex-wrap gap-3">
          {expertiseOptions.map((skill) => {
            const selected = data.expertise.includes(skill);

            return (
              <Badge
                key={skill}
                variant={selected ? "default" : "outline"}
                className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105 ${
                  selected
                    ? "bg-oliv text-white"
                    : "bg-oliv-light text-foreground"
                }`}
                onClick={() => toggleExpertise(skill)}
              >
                {skill}
              </Badge>
            );
          })}
        </div>

        {/* Custom Skill */}
        <div>
          <p className="text-sm font-medium mb-2">Add Custom Skill</p>
          <div className="flex gap-2">
            <Input
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              placeholder="Enter a skill..."
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addCustomSkill();
                }
              }}
            />
            <Button type="button" variant="outline" onClick={addCustomSkill}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Selected Skills */}
        {data.expertise.length > 0 && (
          <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
            <p className="text-sm font-medium mb-2">
              Selected Expertise ({data.expertise.length})
            </p>
            <div className="flex flex-wrap gap-2">
              {data.expertise.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer"
          variant="olivBtn"
          disabled={data.expertise.length === 0}
        >
          Next
        </Button>
      </form>
    </Card>
  );
}
