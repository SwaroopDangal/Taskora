"use client";
import { SignIn, SignedIn, SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <SignedOut>
        <SignIn routing="hash" />
      </SignedOut>
      <SignedIn>
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-6xl font-bold">Welcome to taskora</h1>
          <p className="text-2xl font-medium">
            Taskora is a task management app that helps you stay organized and
            focused.
          </p>
          <div className="flex flex-col items-center justify-center gap-4">
            <button className="btn btn-primary">Sign Up</button>
            <button className="btn btn-primary">Sign In</button>
          </div>
        </div>
      </SignedIn>
    </div>
  );
}
