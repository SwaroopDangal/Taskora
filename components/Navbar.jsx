"use client";

import { UserButton } from "@clerk/nextjs";
import { ChevronDown, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter, useParams } from "next/navigation";

/**
 * TEMP DATA
 * Later replace this with DB data
 */
const groups = [
  { id: "personal", name: "Personal Workspace", type: "personal" },
  { id: "2", name: "Engineering Team", type: "group" },
  { id: "3", name: "Marketing Department", type: "group" },
  { id: "4", name: "Design Team", type: "group" },
];

export default function Navbar() {
  const router = useRouter();
  const params = useParams();

  const currentgroupId = params?.groupId;

  const currentgroup = groups.find((w) => w.id === currentgroupId);

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
            {/* Workspace Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0 sm:min-w-[220px] border-slate-300 hover:bg-slate-50 px-2 sm:px-4"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                    <div
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-md flex items-center justify-center flex-shrink-0 ${
                        currentgroup?.type === "group"
                          ? "bg-blue-100"
                          : "bg-emerald-100"
                      }`}
                    >
                      {currentgroup?.type === "group" ? (
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      ) : (
                        <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600" />
                      )}
                    </div>
                    <span className="font-medium text-slate-700 text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                      {currentgroup ? currentgroup.name : "Select"}
                    </span>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="start" className="w-[240px]">
                <DropdownMenuLabel className="text-xs uppercase text-slate-500">
                  Workspaces
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {groups.map((group) => (
                  <DropdownMenuItem
                    key={group.id}
                    onClick={() =>
                      router.push(
                        group.type === "personal"
                          ? `/group/personal`
                          : `/group/${group.id}`
                      )
                    }
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <div
                      className={`w-7 h-7 rounded-md flex items-center justify-center ${
                        group.type === "group"
                          ? "bg-blue-100"
                          : "bg-emerald-100"
                      }`}
                    >
                      {group.type === "group" ? (
                        <Users className="h-3.5 w-3.5 text-blue-600" />
                      ) : (
                        <User className="h-3.5 w-3.5 text-emerald-600" />
                      )}
                    </div>
                    <span className="flex-1">{group.name}</span>

                    {currentgroupId === group.id && (
                      <span className="ml-auto text-emerald-600 font-semibold">
                        ✓
                      </span>
                    )}
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/group/new")}
                  className="font-medium text-emerald-600 cursor-pointer"
                >
                  + Create Workspace
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

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
