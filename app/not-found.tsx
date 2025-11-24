"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center h-[700px] text-center p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h1 className="text-6xl font-bold text-primary mb-4 text-color-oliv">404</h1>
      <h2 className="text-2xl font-semibold mb-3 text-color-oliv-500">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The page you’re looking for doesn’t exist or has been moved.  
        Please check the URL or return to the homepage.
      </p>

      <div className="flex gap-4">
        <Button asChild variant="olivBtn">
          <Link href="/">
            <Home className="w-4 h-4 mr-2" /> Go Home
          </Link>
        </Button>

        <Button className="cursor-pointer" variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    </motion.div>
  );
}
