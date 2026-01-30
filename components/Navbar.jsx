"use client";

import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => router.push("/dashboard")}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-lg sm:text-xl font-black text-white">
                T
              </span>
            </div>
            <span className="hidden sm:inline text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Taskora
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Spacer for mobile - pushes buttons to the right */}
            <div className="flex-1 sm:hidden" />

            {/* User Button */}
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 sm:w-9 sm:h-9",
                },
              }}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
