"use client";

import { UserButton } from "@clerk/nextjs";
import { Search, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
const projects = [
  { id: "1", name: "Portfolio Website", type: "personal" },
  { id: "2", name: "Exam Preparation", type: "personal" },
  { id: "3", name: "Taskora Dev Team", type: "group" },
  { id: "4", name: "Marketing Campaign", type: "group" },
];

export default function Navbar() {
  const router = useRouter();
  const params = useParams();

  const currentProjectId = params?.projectId;

  const currentProject = projects.find((p) => p.id === currentProjectId);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-xl font-black text-white">T</span>
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Taskora
            </span>
          </div>

          {/* Project Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center justify-between gap-2 min-w-[200px] border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      currentProject?.type === "group"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span className="font-medium text-slate-700">
                    {currentProject ? currentProject.name : "Select project"}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start" className="w-[220px]">
              <DropdownMenuLabel className="text-xs uppercase text-slate-500">
                Projects
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {projects.map((project) => (
                <DropdownMenuItem
                  key={project.id}
                  onClick={() => router.push(`/dashboard/${project.id}`)}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      project.type === "group"
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                    }`}
                  />
                  <span>{project.name}</span>

                  {currentProjectId === project.id && (
                    <span className="ml-auto text-emerald-600 font-semibold">
                      ✓
                    </span>
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => router.push("/projects/new")}
                className="font-medium text-emerald-600 cursor-pointer"
              >
                + Create Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search tasks..."
                className="pl-10 border-slate-300 focus-visible:ring-emerald-500"
              />
            </div>
          </div>

          {/* Add Task */}
          <Button
            disabled={!currentProjectId}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md disabled:opacity-60"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>

          {/* User */}
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-9 h-9",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
}
