"use client";

import { useCallback, useMemo, useState, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { WelcomeStep } from "@/components/AvatarCreation/WelcomeStep";
import { ProfileStep } from "@/components/AvatarCreation/ProfileStep";
import { UploadDataStep } from "@/components/AvatarCreation/UploadDataStep";
import { HandleStep } from "@/components/AvatarCreation/HandleStep";
import { ExpertiseStep } from "@/components/AvatarCreation/ExpertiseStep";
import { PersonalityStep } from "@/components/AvatarCreation/PersonalityStep";
import { PreviewStep } from "@/components/AvatarCreation/PreviewStep";
import { ShareStep } from "@/components/AvatarCreation/ShareStep";
import { TrainChatStep } from "@/components/AvatarCreation/TrainChatStep";
import { KnowledgeUploadStep } from "@/components/AvatarCreation/KnowledgeUploadStep";
import { SharePubliclyStep } from "@/components/AvatarCreation/SharePubliclyStep";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setAvatarDataState } from "@/lib/store/slices/avatarSlice";

type FileLike =
  | File
  | {
      name: string;
      type: string;
      size: number;
      lastModified: number;
    }
  | null
  | undefined;

export interface AvatarData {
  fullName: string;
  headline: string;
  location: string;
  bio: string;
  cv?: FileLike;
  linkedinConnected: boolean;
  portfolioLink: string;
  handle: string;
  expertise: string[];
  personalityType: string;
  customTone: string;
  voiceNote?: FileLike;
  handleVerified?: boolean;
  oliv_id?: string;
}

const stepSlugs = [
  "welcome-step",
  "handle-step",
  "profile-step",
  "upload-data-step",
  "expertise-step",
  "personality-step",
  "preview-step",
  "share-step",
  // "train-chat-step",
  // "knowledge-upload-step",
  // "share-publicly-step",
] as const;

export default function AvatarCreationBySlug() {
  const dispatch = useAppDispatch();
  const persistedData = useAppSelector((state) => state.avatar);
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();

  const totalSteps = stepSlugs.length;

  const [avatarData, setAvatarData] = useState<AvatarData>(() => ({
    fullName: persistedData.fullName ?? "",
    headline: persistedData.headline ?? "",
    location: persistedData.location ?? "",
    bio: persistedData.bio ?? "",
    cv: persistedData.cv ?? undefined,
    linkedinConnected: persistedData.linkedinConnected ?? false,
    portfolioLink: persistedData.portfolioLink ?? "",
    handle: persistedData.handle ?? "",
    expertise: persistedData.expertise ?? [],
    personalityType: persistedData.personalityType || "professional",
    customTone: persistedData.customTone ?? "",
    voiceNote: persistedData.voiceNote ?? undefined,
    handleVerified: persistedData.handleVerified ?? false,
    oliv_id: persistedData.oliv_id ?? undefined,
  }));

  useEffect(() => {
    setAvatarData((prev) => ({
      ...prev,
      fullName: persistedData.fullName ?? "",
      headline: persistedData.headline ?? "",
      location: persistedData.location ?? "",
      bio: persistedData.bio ?? "",
      cv: persistedData.cv ?? undefined,
      linkedinConnected: persistedData.linkedinConnected ?? false,
      portfolioLink: persistedData.portfolioLink ?? "",
      handle: persistedData.handle ?? "",
      expertise: persistedData.expertise ?? [],
      personalityType: persistedData.personalityType || "professional",
      customTone: persistedData.customTone ?? "",
      voiceNote: persistedData.voiceNote ?? undefined,
      handleVerified: persistedData.handleVerified ?? false,
      oliv_id: persistedData.oliv_id ?? undefined,
    }));
  }, [persistedData]);

  const currentSlug = Array.isArray(params?.slug)
    ? params.slug[0]
    : (params?.slug as string | undefined);

  const currentStep = useMemo(() => {
    const index = stepSlugs.indexOf(
      (currentSlug as (typeof stepSlugs)[number]) ?? "welcome-step"
    );
    return index >= 0 ? index + 1 : 1;
  }, [currentSlug]);

  useEffect(() => {
    if (
      !currentSlug ||
      !stepSlugs.includes(currentSlug as (typeof stepSlugs)[number])
    ) {
      router.replace(`/avatar-creation/${stepSlugs[0]}`, { scroll: false });
    }
  }, [currentSlug, router]);

  const goToStep = (step: number) => {
    const next = Math.min(Math.max(step, 1), totalSteps);
    const nextSlug = stepSlugs[next - 1];
    const base =
      pathname.split("/").slice(0, -1).join("/") || "/avatar-creation";
    router.push(`${base}/${nextSlug}`, { scroll: false });
  };

  const updateData = useCallback(
    (data: Partial<AvatarData>) => {
      setAvatarData((prev) => ({ ...prev, ...data }));
      dispatch(setAvatarDataState(data));
    },
    [dispatch]
  );

  const nextStep = () => {
    if (currentStep < totalSteps) goToStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) goToStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={nextStep} />;
      case 2:
        return (
          <HandleStep
            data={avatarData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 3:
        return (
          <ProfileStep
            data={avatarData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 4:
        return (
          <UploadDataStep
            data={avatarData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 5:
        return (
          <ExpertiseStep
            data={avatarData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 6:
        return (
          <PersonalityStep
            data={avatarData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 7:
        return (
          <PreviewStep
            data={avatarData}
            updateData={updateData}
            onNext={nextStep}
            onBack={prevStep}
          />
        );
      case 8:
        return <ShareStep data={avatarData} onNext={nextStep} />;
      // case 9:
      //   return <TrainChatStep data={avatarData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      // case 10:
      //   return <KnowledgeUploadStep data={avatarData} updateData={updateData} onNext={nextStep} onBack={prevStep} />;
      // case 11:
      //   return <SharePubliclyStep data={avatarData} />;
      default:
        return null;
    }
  };

  console.log("Avatar Data State:", avatarData);
  return (
    <div className="flex items-center justify-center h-full py-12 bg-white">
      <div className="container w-full max-w-3xl px-4 mx-auto">
        {currentStep > 1 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-zinc-600">
                {currentStep <= 8 ? "Phase 1: Setup" : "Phase 2: Studio"} — Step{" "}
                {currentStep} of {totalSteps}
              </span>
              <span className="text-sm font-medium text-[#4454FF]">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-zinc-200">
              <div
                className="h-full bg-[#4454FF] transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="animate-fade-in">{renderStep()}</div>

        {/* <pre>{JSON.stringify(avatarData, null, 2)}</pre> */}
      </div>
    </div>
  );
}
