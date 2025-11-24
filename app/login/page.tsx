"use client";

import { useState, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Login = () => {
  // State to hold form data
  const [data, setData] = useState({
    username: "",
    candidateId: "",
  });

  // Function to update form data
  const updateData = (newData: Partial<typeof data>) => {
    setData((prev) => ({ ...prev, ...newData }));
  };

  // Form submit handler
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Do something with the form data
    console.log("Form submitted:", data);
    // Example: navigate to next step or call API
  };

  return (
    <div className="h-full bg-white flex items-center justify-center py-12">
      <div className="container max-w-3xl mx-auto px-4 w-full">
        <div className="animate-fade-in">
          <Card className="p-8 md:p-10 border-0 shadow-elegant">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome Back!
            </h2>
            <p className="text-muted-foreground mb-8">
            Please enter your details to continue to the chat.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="username">User Name</Label>
                <Input
                  id="username"
                  value={data.username}
                  onChange={(value) => updateData({ username: value })}
                  placeholder="e.g. Sarah Johnson"
                  required
                />
              </div>

              <div>
                <Label htmlFor="candidateId">Candidate ID</Label>
                <Input
                  id="candidateId"
                  value={data.candidateId}
                  onChange={(value) => updateData({ candidateId: value })}
                  placeholder="e.g. 82377"
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                variant="olivBtn"
                className="w-full cursor-pointer"
              >
                Continue to Chat →
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
