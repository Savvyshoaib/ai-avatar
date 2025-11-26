"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect } from "react";

type ProfileStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function ProfileStep({ data, updateData, onNext, onBack }: ProfileStepProps) {
  
  useEffect(() => {
    const storedData = localStorage.getItem("olivData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        if (parsed.fullName) updateData({ fullName: parsed.fullName });
        if (parsed.about) updateData({ bio: parsed.about });
        if (parsed.location) updateData({ location: parsed.location });
        // Optional: add email, phoneNumber if needed
      } catch (e) {
        console.error("Failed to parse olivData from localStorage", e);
      }
    }
  }, [updateData]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onNext();
  };

  return (
    <Card className="p-8 md:p-10 border-0 shadow-elegant">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h2 className="text-2xl md:text-3xl font-bold mb-2">Let's start with your basics</h2>
      <p className="text-muted-foreground mb-8">Help us understand who you are professionally</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Full Name"
            id="fullName"
            value={data?.fullName ?? ""}
            onChange={(value: string) => updateData({ fullName: value })}
            placeholder="e.g. Sarah Johnson"
            type="text"
            rules={[
              { required: true, message: "is required" },
              { min: 2, message: "must be at least 2 characters" },
              { max: 20, message: "cannot exceed 10 characters" },
              { type: "text", message: "Text only" },
            ]}
          />
        </div>

        <div>
          <Input
            label="Professional Headline"
            id="headline"
            value={data.headline ?? ""}
            placeholder="e.g. Marketing Graduate passionate about AI & growth"
            onChange={(value: string) => updateData({ headline: value })}
            rules={[
              { required: true, message: "is required" },
              { min: 2, message: "must be at least 2 characters" },
              { max: 30, message: "cannot exceed 10 characters" },
              { type: "text", message: "Text only" },
            ]}
            
          />
        </div>

        <div>
          <Input
            label="Location"
            id="location"
            value={data.location ?? ""}
            onChange={(value: string) => updateData({ location: value })}
            placeholder="e.g. London, UK"
            rules={[
              { required: true, message: "is required" },
            ]}
          />
        </div>

        <div>
          <Label htmlFor="bio">Short Bio (150-300 characters)</Label>
          <Textarea
            id="bio"
            value={data.bio}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => updateData({ bio: e.target.value })}
            placeholder="What defines you professionally? Share your passion, experience, or what you're looking for..."
            className="min-h-[100px]"
            maxLength={300}
            required
          />
          <p className="text-sm text-muted-foreground mt-1">{data.bio.length}/300 characters</p>
        </div>

        <Button type="submit" size="lg" variant='olivBtn' className="w-full cursor-pointer">
          Continue →
        </Button>
      </form>
    </Card>
  );
}
