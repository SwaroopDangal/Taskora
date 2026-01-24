"use client";

import { useState } from "react";
import {
  Calendar,
  AlertCircle,
  Star,
  Briefcase,
  Filter,
  ArrowUpDown,
  ChevronRight,
  FolderOpen,
  Users,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState("Recently Updated");
  const [filterBy, setFilterBy] = useState("All");

  // Mock data - replace with actual data from your backend
  const stats = [
    {
      title: "Tasks Due Today",
      value: 8,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Overdue Tasks",
      value: 3,
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "High Priority Tasks",
      value: 12,
      icon: Star,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Active Projects",
      value: 5,
      icon: Briefcase,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      type: "group",
      taskCount: 24,
      completedTasks: 18,
      progress: 75,
    },
    {
      id: 2,
      name: "Mobile App Development",
      type: "group",
      taskCount: 45,
      completedTasks: 12,
      progress: 27,
    },
    {
      id: 3,
      name: "Personal Goals 2026",
      type: "personal",
      taskCount: 10,
      completedTasks: 7,
      progress: 70,
    },
    {
      id: 4,
      name: "Marketing Campaign Q1",
      type: "group",
      taskCount: 18,
      completedTasks: 15,
      progress: 83,
    },
    {
      id: 5,
      name: "Learning React & Next.js",
      type: "personal",
      taskCount: 8,
      completedTasks: 3,
      progress: 38,
    },
  ];

  const hasProjects = projects.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Overview of your work</p>
        </div>

        {/* Global Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-black text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                    >
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Task Controls Section */}
        <div className="flex items-center gap-3 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter: {filterBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setFilterBy("All")}>
                All Projects
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("Personal")}>
                Personal Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("Group")}>
                Group Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("Active")}>
                Active Projects
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50"
              >
                <ArrowUpDown className="h-4 w-4 mr-2" />
                Sort by: {sortBy}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setSortBy("Due Date")}>
                Due Date
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Priority")}>
                Priority
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Recently Updated")}>
                Recently Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Name")}>
                Name
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Projects List Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Projects</h2>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md">
              <Briefcase className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>

          {hasProjects ? (
            <div className="grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <Card
                  key={project.id}
                  className="border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* Project Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-bold text-slate-900 truncate">
                            {project.name}
                          </h3>
                          <Badge
                            variant="secondary"
                            className={
                              project.type === "personal"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {project.type === "personal" ? (
                              <>
                                <User className="h-3 w-3 mr-1" />
                                Personal
                              </>
                            ) : (
                              <>
                                <Users className="h-3 w-3 mr-1" />
                                Group
                              </>
                            )}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 mb-3">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">
                              {project.completedTasks}
                            </span>
                            /{project.taskCount} tasks completed
                          </p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {project.progress}% complete
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <Progress
                          value={project.progress}
                          className="h-2 bg-slate-100"
                        />
                      </div>

                      {/* Action Button */}
                      <Link href={`/dashboard/${project.id}`}>
                        <Button
                          variant="outline"
                          className="border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 font-semibold group-hover:shadow-md transition-all flex-shrink-0"
                        >
                          Open Project
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            // Empty State
            <Card className="border-slate-200">
              <CardContent className="p-12">
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <FolderOpen className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    You don't have any projects yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Get started by creating your first project and start
                    organizing your tasks
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base px-6 py-6 shadow-lg">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Create your first project
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
