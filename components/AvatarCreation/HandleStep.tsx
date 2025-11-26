"use client";

import { useState, useEffect, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, X, Loader2 } from "lucide-react";
import { AvatarData } from "@/app/avatar-creation/page";
import { createAvatar } from "@/lib/api/avatarApi";
import { toast } from "sonner";

type HandleStepProps = {
  data: AvatarData;
  updateData: (data: Partial<AvatarData>) => void;
  onNext: () => void;
  onBack: () => void;
};

export function HandleStep({
  data,
  updateData,
  onNext,
  onBack,
}: HandleStepProps) {
  const [handleValue, setHandleValue] = useState<string>(data.handle);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>("Confirm");
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [host, setHost] = useState<string>("");
  let candidateId: string = "";

  const storedData = localStorage.getItem("olivData");

  if (storedData) {
    const parsed = JSON.parse(storedData);
    candidateId = parsed.id;
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHost(window.location.host);
    }
  }, []);

  // Restore verified state when coming back to this step
  useEffect(() => {
    if (data.handleVerified) {
      setIsAvailable(true);
      setButtonText("Continue →");
    } else {
      setIsAvailable(null);
      setButtonText("Confirm");
    }
  }, [data.handleVerified]);

  const handleConfirm = async () => {
    if (buttonText === "Continue →") {
      onNext();
      return;
    }

    if (!handleValue.trim()) {
      toast.error("Please enter a handle name");
      return;
    }

    setIsChecking(true);
    setButtonText("Checking...");

    try {
      const oliv_id = data.oliv_id || Math.random().toString(36).substring(2);

      await createAvatar({
        user_name: handleValue,
        oliv_id: candidateId,
      });

      // If we reach here, API returned 2xx, so success
      toast.success("This link is available!");
      setIsAvailable(true);
      setButtonText("Continue →");
      updateData({ handle: handleValue, handleVerified: true, oliv_id });
    } catch (error: any) {
      // Axios errors have error.response
      const resData = error.response?.data;

      if (resData?.success === false) {
        // Handle validation errors from backend
        const usernameError = resData.errors?.user_name?.[0];
        const olivError = resData.errors?.oliv_id?.[0];

        toast.error(
          usernameError ||
            olivError ||
            resData.message ||
            "This link is already taken"
        );
        setIsAvailable(false);
        setButtonText("Confirm");
      } else {
        // Network or unexpected error
        toast.error("Error connecting to server. Please try again.");
        setIsAvailable(false);
        setButtonText("Confirm");
      }

      console.error("API Error:", error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleConfirm();
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
        Claim your public avatar link
      </h2>
      <p className="text-muted-foreground mb-8">
        Recruiters will use this link to chat with your avatar
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="handle">Your Avatar Link</Label>
          <div
            className="relative group"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              {host}/
            </div>

            <Input
              id="handle"
              value={handleValue}
              onChange={(value: string) => {
                const sanitizedValue = value
                  .toLowerCase()
                  .replace(/[^a-z0-9-]/g, "");
                setHandleValue(sanitizedValue);
                setIsAvailable(null);
                setButtonText("Confirm");
                updateData({ handle: sanitizedValue, handleVerified: false });
              }}
              placeholder="yourname"
              className={`pr-10`}
              style={{
                paddingLeft: `${host.length * 8 + 28}px`,
              }}
              required
            />

            {hovered && handleValue && (
              <button
                type="button"
                onClick={() => {
                  setHandleValue("");
                  setIsAvailable(null);
                  setButtonText("Confirm");
                  updateData({ handle: "", handleVerified: false });
                }}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-destructive transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {handleValue && (
            <p
              className={`text-sm mt-2 ${
                isChecking
                  ? "text-gray-500"
                  : isAvailable
                  ? "text-green-600"
                  : "text-red-500"
              }`}
            >
              {isChecking
                ? "Checking availability..."
                : isAvailable
                ? "This link is available!"
                : isAvailable === false
                ? "This link is already taken"
                : ""}
            </p>
          )}
        </div>

        {handleValue && isAvailable && (
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 bg-oliv-light">
            <p className="text-sm font-medium mb-1">Your Avatar URL</p>
            <p className="text-primary font-mono text-color-oliv">
              {host}/{handleValue}
            </p>
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          className="w-full cursor-pointer"
          variant="olivBtn"
          disabled={!handleValue || isChecking}
        >
          {isChecking ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            buttonText
          )}
        </Button>
      </form>
    </Card>
  );
}
