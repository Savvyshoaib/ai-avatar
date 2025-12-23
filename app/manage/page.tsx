"use client";

import {
  useRef,
  useCallback,
  useState,
  useEffect,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import {
  ArrowLeft,
  Lock,
  Save,
  Eye,
  Share2,
  MessageSquare,
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  Sparkles,
  Loader2,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useAppSelector, useAppDispatch } from "@/lib/store/hooks";
import { uploadAvatarDocument, addKnowledge, type AddKnowledgePayload } from "@/lib/api/avatarApi";
import { fetchAvatarDetails } from "@/lib/store/slices/avatarSlice";

type KnowledgeFile = {
  id: string;
  name: string;
  sizeLabel: string;
  source: "existing" | "uploaded";
};

const ManageAvatar = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const avatarStore = useAppSelector((state) => state.avatar);
  const avatarHandle = avatarStore.handle;

  const [currentHost, setCurrentHost] = useState("");

  const [avatarData, setAvatarData] = useState({
    fullName: "John Doe",
    handle: "johndoe",
    headline: "Marketing Graduate passionate about AI & growth",
    location: "London, UK",
    bio: "Creative problem solver with a passion for digital marketing and emerging technologies. I thrive in collaborative environments and love turning data into actionable insights.",
    expertise: ["Marketing", "Business", "Product"],
    personality: "friendly",
    customTone: "",
    cvFileName: "John_Doe_CV.pdf",
    portfolioLink: "https://github.com/johndoe",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [initialAvatarData, setInitialAvatarData] = useState(avatarData);

  const [customSkill, setCustomSkill] = useState("");
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [knowledgeFiles, setKnowledgeFiles] = useState<KnowledgeFile[]>(() => []);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentHost(window.location.host);
    }
  }, []);

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

  const toggleExpertise = (skill: string) => {
    if (!isEditing || isSaving) return;
    const current = avatarData.expertise;

    if (current.includes(skill)) {
      updateField(
        "expertise",
        current.filter((s) => s !== skill)
      );
    } else {
      updateField("expertise", [...current, skill]);
    }
  };

  const addCustomSkill = () => {
    if (!isEditing || isSaving) return;
    const trimmed = customSkill.trim();

    if (!trimmed) return;
    if (avatarData.expertise.includes(trimmed)) return;

    updateField("expertise", [...avatarData.expertise, trimmed]);
    setCustomSkill("");
  };

  const cloneAvatarData = (data: typeof avatarData) => ({
    ...data,
    expertise: [...data.expertise],
  });

  const updateField = <K extends keyof typeof avatarData>(
    field: K,
    value: (typeof avatarData)[K]
  ) => {
    if (!isEditing || isSaving) return;
    setAvatarData((prev) => {
      if (prev[field] === value) {
        return prev;
      }
      const next = { ...prev, [field]: value };
      setIsDirty(JSON.stringify(next) !== JSON.stringify(initialAvatarData));
      return next;
    });
  };

  useEffect(() => {
    if (!avatarStore.detailsFetched || isEditing) return;

    const nextState = {
      ...avatarData,
      fullName: avatarStore.fullName || avatarData.fullName,
      handle: avatarStore.handle || avatarData.handle,
      headline: avatarStore.headline || avatarData.headline,
      location: avatarStore.location || avatarData.location,
      bio: avatarStore.bio || avatarData.bio,
      expertise:
        avatarStore.expertise && avatarStore.expertise.length > 0
          ? avatarStore.expertise
          : avatarData.expertise,
      personality: avatarStore.personalityType || avatarData.personality,
      customTone: avatarStore.customTone || avatarData.customTone,
    };

    setAvatarData(nextState);
    setInitialAvatarData(cloneAvatarData(nextState));
  }, [
    avatarStore.bio,
    avatarStore.customTone,
    avatarStore.detailsFetched,
    avatarStore.expertise,
    avatarStore.fullName,
    avatarStore.handle,
    avatarStore.headline,
    avatarStore.location,
    avatarStore.personalityType,
    isEditing,
    avatarData.bio,
    avatarData.customTone,
    avatarData.expertise,
    avatarData.fullName,
    avatarData.handle,
    avatarData.headline,
    avatarData.location,
    avatarData.personality,
  ]);

  const resolvedChatHandle = avatarHandle || avatarData.handle || "shoaib";
  const avatarLink = currentHost
    ? `${currentHost}/${avatarData.handle}`
    : `/${avatarData.handle}`;

  const handleEnterEdit = () => {
    setInitialAvatarData(cloneAvatarData(avatarData));
    setIsEditing(true);
    setIsDirty(false);
  };

  const handleCancelEdit = () => {
    setAvatarData(cloneAvatarData(initialAvatarData));
    setIsEditing(false);
    setIsDirty(false);
    setIsEditingSkills(false);
    setCustomSkill("");
  };

  const buildKnowledgePayload = (): AddKnowledgePayload => {
    const introduction = `Hi! I'm ${avatarData.fullName}, based in ${avatarData.location}. ${avatarData.bio}`;
    const strengths = avatarData.expertise.length
      ? `Key strengths: ${avatarData.expertise.join(", ")}.`
      : "Key strengths include adaptability and collaboration.";

    const resolvedPersonality =
      avatarData.personality === "custom"
        ? avatarData.customTone || "custom"
        : avatarData.personality;

    return {
      user_name: resolvedChatHandle,
      knowledge: "Profile updated via Manage Avatar page.",
      full_name: avatarData.fullName,
      headline: avatarData.headline,
      location: avatarData.location,
      short_bio: avatarData.bio,
      personality: resolvedPersonality,
      skills: avatarData.expertise,
      about_yourself: introduction,
      strength: strengths,
      customTone: avatarData.customTone,
    };
  };

  const handleSaveChanges = async () => {
    if (!isEditing || !isDirty || isSaving) return;
    setIsSaving(true);
    try {
      const payload = buildKnowledgePayload();
      await addKnowledge(payload);
      toast.success("Your avatar has been updated successfully.");
      await dispatch(fetchAvatarDetails(payload.user_name));
      setInitialAvatarData(cloneAvatarData(avatarData));
      setIsEditing(false);
      setIsDirty(false);
      setIsEditingSkills(false);
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to save changes.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  const fieldsDisabled = !isEditing || isSaving;

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "—";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    const fixed = unitIndex === 0 ? 0 : 1;
    return `${size.toFixed(fixed)} ${units[unitIndex]}`;
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedExtensions = ["pdf", "doc", "docx"];
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ext || !allowedExtensions.includes(ext)) {
      toast.error("Only PDF, DOC, or DOCX files are allowed.");
      event.target.value = "";
      return;
    }

    setKnowledgeFiles([
      {
        id: `${file.name}-${Date.now()}`,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        source: "uploaded",
      },
    ]);
    event.target.value = "";

    setIsUploading(true);
    try {
      const fallbackUser = `user_${Math.random().toString(36).slice(2, 8)}`;
      await uploadAvatarDocument({
        user_name: avatarHandle || fallbackUser,
        file,
      });
      toast.success("Document uploaded successfully.");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload document. Please try again.");
      setKnowledgeFiles([]);
    } finally {
      setIsUploading(false);
    }
  };

  const removeKnowledgeFile = (id: string) => {
    setKnowledgeFiles((prev) => prev.filter((file) => file.id !== id));
    toast.success("Document removed");
  };

  const triggerFilePicker = useCallback(() => {
    if (isUploading) return;
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }, [isUploading]);

  const personalityOptions = [
    {
      value: "professional",
      label: "Professional",
      description: "Formal and business-focused",
    },
    {
      value: "friendly",
      label: "Friendly",
      description: "Warm and approachable",
    },
    {
      value: "humorous",
      label: "Humorous",
      description: "Light-hearted with wit",
    },
    {
      value: "custom",
      label: "My Own Style",
      description: "Define your own tone",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f6fe] via-white to-[#eef2ff]">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[#4454FF]/10 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between max-w-5xl px-4 py-4 mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/applications")}
              className="text-[#4454FF] hover:bg-[#4454FF]/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-foreground">
                Manage Avatar
              </h1>
              <p className="text-sm text-muted-foreground">
                Update and configure your digital presence
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/chat-history">
              <Button className="cursor-pointer" variant="outline" size="sm">
                Chat History
              </Button>
            </Link>
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/${resolvedChatHandle}`)}
              className="border-[#4454FF]/30 text-[#4454FF] hover:bg-[#4454FF]/5"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </Button> */}
            {!isEditing ? (
              <Button
                variant="olivBtn"
                size="sm"
                onClick={handleEnterEdit}
                disabled={isSaving}
                className="shadow-lg shadow-[#4454FF]/20 cursor-pointer"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="shadow-lg shadow-red-200 cursor-pointer border-red-500 text-red-600 hover:bg-red-500 hover:text-white"
                >
                  Cancel
                </Button>
                <Button
                  variant="olivBtn"
                  size="sm"
                  onClick={() => void handleSaveChanges()}
                  disabled={!isDirty || isSaving}
                  className="shadow-lg shadow-[#4454FF]/20 cursor-pointer disabled:opacity-60"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl px-4 py-8 mx-auto">
        {/* Status Banner */}
        <Card className="mb-6 border-[#4454FF]/20 bg-gradient-to-r from-[#f7f6fe] to-white shadow-lg shadow-[#4454FF]/10">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 font-semibold rounded-full bg-gradient-to-br from-[#4454FF] to-[#6c7cff] text-white shadow-lg shadow-[#4454FF]/20">
                  {avatarData.fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-foreground">
                    {avatarData.fullName}'s Avatar
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {avatarLink}
                    </span>
                    <Badge
                      variant="default"
                      className="text-xs border border-[#4454FF]/20 bg-[#4454FF]/10 text-[#4454FF]"
                    >
                      Public
                    </Badge>
                  </div>
                </div>
              </div>
              <Button
                variant="olivBtn"
                size="sm"
                onClick={() => router.push(`/${resolvedChatHandle}`)}
                className="border-[#4454FF]/30 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
              Chat
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:inline-grid rounded-xl border border-[#4454FF]/10 bg-[#f7f6fe] p-1">
            <TabsTrigger
              value="profile"
              className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-[#4454FF]"
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-[#4454FF]"
            >
              Training
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            {/* Read-only Fields */}
            <Card className="border-[#4454FF]/10 shadow-md shadow-[#4454FF]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  Fixed Information
                </CardTitle>
                <CardDescription>
                  These fields cannot be changed after avatar creation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Full Name</Label>
                    <Input
                      value={avatarData.fullName}
                      disabled
                      className="bg-muted/50"
                      onChange={(_value) => {}}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-muted-foreground">Avatar Link</Label>
                    <div className="flex gap-2">
                      <Input
                        value={avatarLink}
                        disabled
                        className="bg-muted/50"
                        onChange={(_value) => {}}
                      />
                      <Button
                        variant="outline"
                        size="iconSm"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${avatarLink}`
                          );
                          toast.success("Link copied!");
                        }}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Editable Fields */}
            <Card className="border-[#4454FF]/10 shadow-md shadow-[#4454FF]/5">
              <CardHeader>
                <CardTitle className="text-lg">Editable Profile</CardTitle>
                <CardDescription>
                  Update your avatar's public information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="headline">Headline</Label>
                  <Input
                    id="headline"
                    value={avatarData.headline}
                    onChange={(value) => updateField("headline", value)}
                    placeholder="Your professional headline"
                    disabled={fieldsDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={avatarData.location}
                    onChange={(value) => updateField("location", value)}
                    placeholder="Your location"
                    disabled={fieldsDisabled}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={avatarData.bio}
                    disabled={fieldsDisabled}
                    onChange={(e) => updateField("bio", e.target.value)}
                    placeholder="Tell employers about yourself"
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    {avatarData.bio.length}/300 characters
                  </p>
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="portfolio">Portfolio Link</Label>
                  <Input
                    id="portfolio"
                    value={avatarData.portfolioLink}
                    onChange={(value) => updateField("portfolioLink", value)}
                    placeholder="https://..."
                  />
                </div> */}
              </CardContent>
            </Card>

            {/* Expertise */}
            <Card className="border-[#4454FF]/10 shadow-md shadow-[#4454FF]/5">
              <CardHeader>
                <CardTitle className="text-lg">Areas of Expertise</CardTitle>
                <CardDescription>
                  Select or add skills that describe your strengths
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Preset Skills */}
                <div className="flex flex-wrap gap-3">
                  {expertiseOptions.map((skill) => (
                    <Badge
                      key={skill}
                      variant={
                        avatarData.expertise.includes(skill)
                          ? "default"
                          : "outline"
                      }
                      onClick={() => toggleExpertise(skill)}
                      className={`cursor-pointer px-4 py-2 text-sm transition-all hover:scale-105
            ${
              avatarData.expertise.includes(skill)
                ? "bg-oliv text-white"
                : "bg-oliv-light text-color-oliv border-color-oliv/30"
            }`}
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Custom Skill Input */}
                {isEditingSkills && (
                  <div>
                    <p className="mb-2 text-sm font-medium">Add Custom Skill</p>
                    <div className="flex gap-2">
                      <Input
                        value={customSkill}
                        onChange={(value) => setCustomSkill(value)}
                        placeholder="Enter a skill..."
                        disabled={fieldsDisabled}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addCustomSkill();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomSkill}
                        size="iconSm"
                        disabled={fieldsDisabled}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Selected Expertise */}
                {avatarData.expertise.length > 0 && (
                  <div className="p-4 border rounded-lg bg-[#f7f6fe] border-[#4454FF]/20">
                    <p className="mb-2 text-sm font-medium">
                      Selected Expertise ({avatarData.expertise.length})
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {avatarData.expertise.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toggle Button */}
                <Button
                  type="button"
                  variant="outline"
                  className="border-2 border-[#4454FF] text-[#4454FF]
      hover:bg-[#4454FF]/10"
                  onClick={() => setIsEditingSkills((prev) => !prev)}
                  disabled={!isEditing || isSaving}
                >
                  {isEditingSkills ? "Done" : "Edit Skills"}
                </Button>
              </CardContent>
            </Card>

            {/* Personality/Tone */}
            <Card className="border-[#4454FF]/10 shadow-md shadow-[#4454FF]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5 text-color-oliv" />
                  Avatar Personality
                </CardTitle>
                <CardDescription>
                  How should your avatar sound when talking to employers?
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <RadioGroup
                  value={avatarData.personality}
                  onValueChange={(value) => updateField("personality", value)}
                  className={`space-y-4 ${fieldsDisabled ? "opacity-60" : ""}`}
                  aria-disabled={fieldsDisabled}
                >
                  {personalityOptions.map((option) => (
                    <div key={option.value}>
                      <div
                        onClick={() => updateField("personality", option.value)}
                        className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-colors cursor-pointer ${
                          avatarData.personality === option.value
                            ? "border-[#4454FF] bg-[#4454FF]/5"
                            : "border-zinc-200 hover:border-[#4454FF]/50"
                        }`}
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                          className="mt-1"
                        />

                        <Label
                          htmlFor={option.value}
                          className="flex-1 cursor-pointer"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-oliv-light">
                              <Sparkles className="w-4 h-4 text-color-oliv" />
                            </div>
                            <span className="font-semibold">
                              {option.label}
                            </span>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {option.description}
                          </p>
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                {avatarData.personality === "custom" && (
                  <div className="animate-fade-in">
                    <Label htmlFor="customTone">Describe your tone</Label>
                    <Textarea
                      id="customTone"
                      value={avatarData.customTone}
                      onChange={(e) =>
                        updateField("customTone", e.target.value)
                      }
                      placeholder="Professional but friendly, confident yet approachable..."
                      className="min-h-[100px]"
                      disabled={fieldsDisabled}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Training Tab */}
          <TabsContent value="training" className="space-y-6">
            <Card className="border-[#4454FF]/10 shadow-md shadow-[#4454FF]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5 text-color-oliv" />
                  Train Your Avatar
                </CardTitle>
                <CardDescription>
                  Chat with your avatar to improve its responses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/update/${avatarData.handle}`}>
                <Button
                  variant="olivBtn"
                  className="cursor-pointer"
                  // onClick={() => router.push(`/update/${avatarData.handle}`)}
                >
                  Open Training Chat
                </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-[#4454FF]/10 shadow-md shadow-[#4454FF]/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-color-oliv" />
                  Knowledge Base
                </CardTitle>
                <CardDescription>
                  Manage files that train your avatar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {knowledgeFiles.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-[#4454FF]/30 bg-[#f7f6fe] px-4 py-6 text-center text-sm text-muted-foreground">
                    No documents uploaded yet. Add PDFs or DOC files to train your avatar.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {knowledgeFiles.map((file) => (
                      <div
                        key={file.id}
                        className="flex items-center justify-between rounded-lg border border-[#4454FF]/15 bg-white px-3 py-2 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-color-oliv" />
                          <div>
                            <p className="text-sm font-medium">{file.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {file.sizeLabel}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeKnowledgeFile(file.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={handleFileUpload}
                />

                <Button
                  variant="olivBtn"
                  className="w-full"
                  type="button"
                  onClick={triggerFilePicker}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Document
                    </>
                  )}
                </Button>
              </CardContent>

              
            </Card>

        
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ManageAvatar;
