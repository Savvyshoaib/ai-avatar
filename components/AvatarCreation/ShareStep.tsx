"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { AvatarData } from "@/app/avatar-creation/page";
import { useAppSelector } from "@/lib/store/hooks";

type ShareStepProps = {
  data: AvatarData;
  onNext?: () => void;
};

export function ShareStep({ data, onNext }: ShareStepProps) {
  const [locationInfo, setLocationInfo] = useState({ protocol: "", host: "" });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLocationInfo({
        protocol: window.location.protocol,
        host: window.location.host,
      });
    }
  }, []);

  const avatarDataState = useAppSelector((state) => state.avatar);
  const avatarUrl = locationInfo.host
    ? `${locationInfo.host}/${data.handle}`
    : data.handle
    ? `${data.handle}`
    : "";

  const copyToClipboard = () => {
    if (!locationInfo.protocol || !locationInfo.host) return;
    navigator.clipboard.writeText(`${locationInfo.protocol}//${avatarUrl}`);
    toast.success("Link copied to clipboard!");
  };

  return (
    <Card className="p-8 text-center border-0 shadow-none md:p-12">
      <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#4454FF]">
        <CheckCircle2 className="w-10 h-10 text-white" />
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-[#4454FF]">
        Your Digital Avatar is Ready!
      </h1>

      <p className="mb-8 text-lg text-zinc-600">
        Congratulations! Your AI-powered avatar is now live and ready to connect
        with employers
      </p>

      {/* Shareable Link */}
      <div className="max-w-xl mx-auto mb-8 text-left">
        <p className="mb-2 text-sm font-medium text-zinc-900">
          Your Avatar Link
        </p>
        <div className="flex gap-2">
          <div className="flex-1 p-4 font-mono text-left border rounded-lg bg-zinc-100 border-zinc-200 text-zinc-900">
            {avatarUrl}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={copyToClipboard}
            className="h-auto cursor-pointer"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col justify-center gap-3 mb-8 sm:flex-row">
        {/* <Button size="lg" className="gap-2 cursor-pointer" variant='olivBtn' asChild>
          <a href={`https://${avatarUrl}`} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Share Profile
          </a>
        </Button> */}
        <Button
          size="lg"
          variant="outline"
          className="gap-2 cursor-pointer"
          asChild
        >
          <Link
            href={locationInfo.protocol && avatarUrl ? `${locationInfo.protocol}//${avatarUrl}` : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageSquare className="w-4 h-4" />
            Preview Chat
          </Link>
        </Button>
        {/* {onNext ? (
          <Button size="lg" variant="outline" className="gap-2 cursor-pointer" onClick={onNext}>
            Continue Training →
          </Button>
        ) : (
          <Button size="lg" variant="outline" className="gap-2" asChild>
            <Link href="/applications">
              <LayoutDashboard className="w-4 h-4" />
              Go to Dashboard
            </Link>
          </Button>
        )} */}
      </div>

      {/* Next Steps */}
      <div className="max-w-2xl mx-auto text-left">
        <h3 className="mb-4 font-semibold text-zinc-900">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex gap-3 p-4 border rounded-lg bg-zinc-100 border-zinc-200">
            <div className="w-8 h-8 rounded-full bg-[#4454FF]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#4454FF]">1</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Share your link</p>
              <p className="text-sm text-zinc-600">
                Add your avatar link to your CV, LinkedIn, and job applications
              </p>
            </div>
          </div>
          <div className="flex gap-3 p-4 border rounded-lg bg-zinc-100 border-zinc-200">
            <div className="w-8 h-8 rounded-full bg-[#4454FF]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#4454FF]">2</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Employers connect</p>
              <p className="text-sm text-zinc-600">
                Recruiters can chat with your avatar anytime to learn about your
                experience
              </p>
            </div>
          </div>
          <div className="flex gap-3 p-4 border rounded-lg bg-zinc-100 border-zinc-200">
            <div className="w-8 h-8 rounded-full bg-[#4454FF]/10 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-[#4454FF]">3</span>
            </div>
            <div>
              <p className="font-medium text-zinc-900">Get notified</p>
              <p className="text-sm text-zinc-600">
                We'll notify you when employers interact with your avatar
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
