"use client";
import { SignIn, SignedOut, useAuth } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { isSignedIn } = useAuth();
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">Welcome to taskora</h1>
        <p className="text-2xl font-medium">
          Taskora is a task management app that helps you stay organized and
          focused.
        </p>
        <div className="flex flex-col items-center justify-center gap-4">
          <SignIn />
          <SignedOut>
            <button className="btn btn-primary">Sign Up</button>
          </SignedOut>
        </div>
      </div>
    </div>
  );
}
