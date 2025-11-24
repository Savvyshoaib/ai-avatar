"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Copy, ExternalLink, Code, Share2, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AvatarData } from "@/app/avatar-creation/page";

type SharePubliclyStepProps = {
  data: AvatarData;
};

export function SharePubliclyStep({ data }: SharePubliclyStepProps) {
  const avatarUrl = `oliv.ai/${data.handle}`;
  const embedCode = `<iframe src="https://${avatarUrl}/chat" width="100%" height="600" frameborder="0"></iframe>`;

  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast.success(message);
  };

  return (
    <Card className="p-8 md:p-12 border-0 shadow-none">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4454FF] animate-bounce-slow">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#4454FF]">
          🎉 Your Avatar is Live!
        </h1>

        <p className="text-lg text-zinc-600 max-w-xl mx-auto">
          Your avatar is now interactive. Employers can chat with it anytime to learn about your experience and skills.
        </p>
      </div>

      {/* Preview Window */}
      <Card className="mb-8 p-6 border border-zinc-200 bg-white shadow-none">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#4454FF] flex items-center justify-center text-white font-bold text-lg">
            {data.fullName.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-zinc-900">Chat with {data.fullName}'s Avatar</h3>
            <p className="text-sm text-zinc-600">{data.headline}</p>
          </div>
        </div>
        <div className="bg-background rounded-lg p-4 border">
          <p className="text-sm text-zinc-600 italic">
            "Hi! I'm {data.fullName}'s digital avatar. I can answer questions about their experience, skills, and career goals. What would you like to know?"
          </p>
        </div>
      </Card>

      {/* Shareable Link */}
      <div className="mb-6">
        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-zinc-900">
          <Share2 className="w-4 h-4" />
          Your Public Avatar Link
        </Label>
        <div className="flex gap-2">
          <Input
            value={avatarUrl}
            onChange={() => {}}
            readOnly
            className="flex-1 font-mono bg-zinc-100 border-zinc-200 text-zinc-900"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(`https://${avatarUrl}`, "Link copied!")}
            className="cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            asChild
            className="cursor-pointer"
          >
            <a href={`https://${avatarUrl}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </div>

      <Separator className="my-6" />

      {/* Embed Code */}
      <div className="mb-8">
        <Label className="text-sm font-medium mb-2 flex items-center gap-2 text-zinc-900">
          <Code className="w-4 h-4" />
          Embed on Your Website
        </Label>
        <div className="flex gap-2">
          <Input
            value={embedCode}
            onChange={() => {}}
            readOnly
            className="flex-1 font-mono text-xs bg-zinc-100 border-zinc-200 text-zinc-900"
          />
          <Button
            variant="outline"
            size="icon"
            onClick={() => copyToClipboard(embedCode, "Embed code copied!")}
            className="cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-zinc-600 mt-2">
          Copy this code to embed your avatar chat widget on your portfolio or website
        </p>
      </div>

      {/* Quick Tips */}
      <Card className="p-6 bg-zinc-50 border border-zinc-200 mb-6 shadow-none">
        <h3 className="font-semibold mb-3 text-zinc-900">💡 Pro Tips</h3>
        <ul className="space-y-2 text-sm text-zinc-600">
          <li className="flex gap-2">
            <span className="text-[#4454FF]">•</span>
            <span>Add your avatar link to your CV and LinkedIn profile</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#4454FF]">•</span>
            <span>Include it in job applications to stand out from other candidates</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#4454FF]">•</span>
            <span>Share it with recruiters for 24/7 availability</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#4454FF]">•</span>
            <span>Monitor interactions from your dashboard</span>
          </li>
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button size="lg" className="flex-1 gap-2 cursor-pointer" variant='olivBtn' asChild>
          <a href={`https://${avatarUrl}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Preview Your Avatar
          </a>
        </Button>
        <Button size="lg" variant="outline" className="flex-1 gap-2 cursor-pointer" asChild>
          <Link href="/">
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </Card>
  );
}
