"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const router = useRouter();


  return (
    <div className="flex items-center justify-center bg-gradient-subtle h-[700px]">
      <div className="text-center space-y-6 p-8">
        <div className="inline-flex items-center gap-2 mb-8">
          <Image src="/logo.svg" alt="Logo" width={80} height={80} />
        </div>
        <h1 className="text-5xl font-bold text-[#4454FF]">
          Welcome to Oliv
        </h1>
        <p className="text-xl text-muted-foreground max-w-md">
          Your AI-powered career companion. Navigate to your applications to get started.
        </p>
        <Button
          variant='olivBtn'
          size="lg"
          onClick={() => router.push("/avatar-creation")}
          className="mt-4 cursor-pointer"
        >
          Go to Applications
        </Button>
      </div>
    </div>
  );
}
