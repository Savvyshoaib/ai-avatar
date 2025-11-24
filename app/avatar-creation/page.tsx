"use client";   

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export type { AvatarData } from "./[slug]/page";

export default function AvatarCreation() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/avatar-creation/welcome-step", { scroll: false });
  }, [router]);

  return null;
}
