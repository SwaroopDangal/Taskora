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
  Building2,
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
      title: "Active groups",
      value: 5,
      icon: Building2,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const groups = [
    {
      id: "personal",
      name: "Personal group",
      type: "personal",
      members: 1,
      projectCount: 3,
      taskCount: 18,
      completedTasks: 10,
      progress: 56,
    },
    {
      id: 2,
      name: "Engineering Team",
      type: "group",
      members: 8,
      projectCount: 5,
      taskCount: 67,
      completedTasks: 45,
      progress: 67,
    },
    {
      id: 3,
      name: "Marketing Department",
      type: "group",
      members: 5,
      projectCount: 4,
      taskCount: 32,
      completedTasks: 28,
      progress: 88,
    },
    {
      id: 4,
      name: "Design Team",
      type: "group",
      members: 4,
      projectCount: 3,
      taskCount: 24,
      completedTasks: 12,
      progress: 50,
    },
    {
      id: 5,
      name: "Product Management",
      type: "group",
      members: 6,
      projectCount: 6,
      taskCount: 41,
      completedTasks: 35,
      progress: 85,
    },
  ];

  const hasgroups = groups.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-6 py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600">Overview of your groups</p>
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

        {/* group Controls Section */}
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
                All groups
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("Personal")}>
                Personal Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("Groups")}>
                Groups Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterBy("Active")}>
                Active groups
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
              <DropdownMenuItem onClick={() => setSortBy("Recently Updated")}>
                Recently Updated
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Name")}>
                Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Progress")}>
                Progress
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("Members")}>
                Members
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* groups List Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">My groups</h2>
            <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md">
              <Users className="h-4 w-4 mr-2" />
              Create Group 
            </Button>
          </div>

          {hasgroups ? (
            <div className="grid grid-cols-1 gap-4">
              {groups.map((group) => (
                <Card
                  key={group.id}
                  className="border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-6">
                      {/* group Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              group.type === "personal"
                                ? "bg-emerald-100"
                                : "bg-blue-100"
                            }`}
                          >
                            {group.type === "personal" ? (
                              <User
                                className={`h-5 w-5 ${
                                  group.type === "personal"
                                    ? "text-emerald-600"
                                    : "text-blue-600"
                                }`}
                              />
                            ) : (
                              <Users
                                className={`h-5 w-5 ${
                                  group.type === "personal"
                                    ? "text-emerald-600"
                                    : "text-blue-600"
                                }`}
                              />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-slate-900 truncate">
                              {group.name}
                            </h3>
                            <p className="text-sm text-slate-500">
                              {group.projectCount}{" "}
                              {group.projectCount === 1
                                ? "project"
                                : "projects"}{" "}
                              •{" "}
                              {group.type === "personal"
                                ? "Private"
                                : `${group.members} members`}
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className={
                              group.type === "personal"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-blue-50 text-blue-700 border-blue-200"
                            }
                          >
                            {group.type === "personal" ? "Personal" : "Group"}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-6 mb-3">
                          <p className="text-sm text-slate-600">
                            <span className="font-semibold text-slate-900">
                              {group.completedTasks}
                            </span>
                            /{group.taskCount} tasks completed
                          </p>
                          <p className="text-sm font-semibold text-emerald-600">
                            {group.progress}% complete
                          </p>
                        </div>

                        {/* Progress Bar */}
                        <Progress
                          value={group.progress}
                          className="h-2 bg-slate-100"
                        />
                      </div>

                      {/* Action Button */}
                      <Link
                        href={
                          group.type === "personal"
                            ? `/group/personal`
                            : `/group/${group.id}`
                        }
                      >
                        <Button
                          variant="outline"
                          className="border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 font-semibold group-hover:shadow-md transition-all flex-shrink-0"
                        >
                          Open group
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
                    No groups yet
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Get started by creating a group group and invite your team
                    members to collaborate
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-base px-6 py-6 shadow-lg">
                    <Users className="h-5 w-5 mr-2" />
                    Create your first group
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
