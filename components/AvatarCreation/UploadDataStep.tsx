"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Upload, FileText, Linkedin, Link2, Loader2 } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/store/hooks";
import { uploadAvatarDocument } from "@/lib/api/avatarApi";

type UploadDataStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function UploadDataStep({ data, updateData, onNext, onBack }: UploadDataStepProps) {
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(() => (data.cv instanceof File ? data.cv : null));

  const username = useAppSelector((state) => state.avatar.handle);

  const getFileForUpload = () => {
    if (selectedFile) return selectedFile;
    return data.cv instanceof File ? data.cv : null;
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      updateData({ cv: file });
      toast.success("CV uploaded successfully");
    }
  };

  // const handleLinkedinConnect = () => {
  //   updateData({ linkedinConnected: true });
  //   toast.success("LinkedIn connected");
  // };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fileToUpload = getFileForUpload();

    if (!fileToUpload) {
      toast.error("Please upload your CV first.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const response = await uploadAvatarDocument({
        user_name: username,
        file: fileToUpload,
      });

      toast.success("CV uploaded successfully!");

      console.log("Upload API Response:", response.data);

      setIsAnalyzing(false);
      onNext();
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to upload CV. Please try again.");
      setIsAnalyzing(false);
    }
  };


  return (
    <Card className="p-8 md:p-10 border-0 shadow-elegant">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6 cursor-pointer">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <h2 className="text-2xl md:text-3xl font-bold mb-2">Help your avatar understand you better</h2>
      <p className="text-muted-foreground mb-8">Upload your professional information to train your avatar</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-8 text-center hover:border-[#4454FF]/50 transition-colors">
          <input
            type="file"
            id="cv-upload"
            accept=".pdf,.doc,.docx"
            onChange={handleFileUpload}
            className="hidden"
          />
          <Label htmlFor="cv-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-3">
              {selectedFile || data.cv ? (
                <>
                  <FileText className="w-12 h-12 text-color-oliv" />
                  <div>
                    <p className="font-semibold text-primary text-color-oliv">{selectedFile?.name ?? data.cv?.name}</p>
                    <p className="text-sm text-muted-foreground text-color-oliv-500">Click to change</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <div>
                    <p className="font-semibold">Upload Your CV</p>
                    <p className="text-sm text-muted-foreground">PDF or DOC format</p>
                  </div>
                </>
              )}
            </div>
          </Label>
        </div>

        {/* <div>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleLinkedinConnect}
            disabled={data.linkedinConnected}
          >
            <Linkedin className="w-5 h-5 mr-2" />
            {data.linkedinConnected ? "LinkedIn Connected ✓" : "Connect LinkedIn (Optional)"}
          </Button>
        </div>

        <div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              
              <Input
                icon={<Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />}
                label="Add Portfolio Link (Optional)"
                id="portfolio"
                type="url"
                value={data.portfolioLink ?? ""}
                onChange={(value: string) => updateData({ portfolioLink: value })}
                rules={[
                  { min: 10, message: "Must be at least 10 characters" },
                  { required: true, message: "is required" }
                ]}
                placeholder="GitHub, Behance, Notion, etc."
                className="pl-10"
              />
            </div>
          </div>
        </div> */}

        {isAnalyzing && (
          <div className="flex items-center justify-center gap-2 text-primary py-4">
            <Loader2 className="w-5 h-5 animate-spin text-color-oliv" />
            <span className="text-color-oliv">Analyzing your journey...</span>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full cursor-pointer" variant='olivBtn' disabled={!getFileForUpload() || isAnalyzing}>
          {isAnalyzing ? "Analyzing..." : "Next"}
        </Button>
      </form>
    </Card>
  );
}
