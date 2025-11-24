"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Upload, FileText, Video, Mic, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { AvatarData } from "@/app/avatar-creation/page";

type UploadEntry = {
  name: string;
  type: "document" | "video" | "voice";
  icon: typeof FileText;
};

type KnowledgeUploadStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function KnowledgeUploadStep({ onNext, onBack }: KnowledgeUploadStepProps) {
  const [uploads, setUploads] = useState<UploadEntry[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, type: UploadEntry["type"]) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];
    const icon = type === "video" ? Video : type === "voice" ? Mic : FileText;

    setUploads((prev) => [...prev, { name: file.name, type, icon }]);
    setIsProcessing(true);
    setProgress(0);

    // Simulate processing
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          toast.success(`${file.name} processed successfully`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Card className="p-8 md:p-10 border-0 shadow-none">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-zinc-900">Enhance Your Avatar's Knowledge</h2>
        <p className="text-zinc-600">
          Upload more files, voice notes, or experiences to make your avatar smarter (Optional)
        </p>
      </div>

      <div className="space-y-6 mb-8">
        {/* Document Upload */}
        <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 bg-white transition-colors hover:border-[#4454FF]/60">
          <input
            type="file"
            id="docs-upload"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileUpload(e, "document")}
            className="hidden"
          />
          <Label htmlFor="docs-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <FileText className="w-10 h-10 text-[#4454FF]" />
              <div className="text-center">
                <p className="font-semibold text-zinc-900">Upload Additional Documents</p>
                <p className="text-sm text-zinc-600">Project docs, certifications, notes</p>
              </div>
            </div>
          </Label>
        </div>

        {/* Video Upload */}
        <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 bg-white transition-colors hover:border-[#4454FF]/60">
          <input
            type="file"
            id="video-upload"
            accept="video/*"
            onChange={(e) => handleFileUpload(e, "video")}
            className="hidden"
          />
          <Label htmlFor="video-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <Video className="w-10 h-10 text-[#4454FF]" />
              <div className="text-center">
                <p className="font-semibold text-zinc-900">Upload Video Introductions</p>
                <p className="text-sm text-zinc-600">Help employers know you better</p>
              </div>
            </div>
          </Label>
        </div>

        {/* Voice Notes */}
        <div className="border-2 border-dashed border-zinc-200 rounded-lg p-6 bg-white transition-colors hover:border-[#4454FF]/60">
          <input
            type="file"
            id="voice-upload"
            accept="audio/*"
            onChange={(e) => handleFileUpload(e, "voice")}
            className="hidden"
          />
          <Label htmlFor="voice-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              <Mic className="w-10 h-10 text-[#4454FF]" />
              <div className="text-center">
                <p className="font-semibold text-zinc-900">Add Voice Notes</p>
                <p className="text-sm text-zinc-600">Share experiences in your own voice</p>
              </div>
            </div>
          </Label>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <Card className="p-4 mb-6 border border-zinc-200 bg-zinc-50 shadow-none">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#4454FF]/10 flex items-center justify-center animate-pulse">
              <Upload className="w-4 h-4 text-[#4454FF]" />
            </div>
            <p className="font-medium text-sm text-zinc-700">Learning about your experiences...</p>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>
      )}

      {/* Uploaded Files List */}
      {uploads.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-zinc-900">Processed Files</h3>
          <div className="space-y-2">
            {uploads.map((file, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-zinc-100 border border-zinc-200">
                <file.icon className="w-5 h-5 text-[#4454FF]" />
                <span className="flex-1 text-sm text-zinc-700">{file.name}</span>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onNext} className="cursor-pointer">
          Skip This Step
        </Button>
        <Button size="lg" className="flex-1 cursor-pointer bg-[#4454FF] hover:bg-[#4454FF]/90 text-white" onClick={onNext} disabled={isProcessing}>
          Continue to Share
        </Button>
      </div>
    </Card>
  );
}
