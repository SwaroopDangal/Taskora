"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ListChecks,
  Loader2,
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
import CreateGroupModal from "@/components/CreateGroupModal";
import useGetGroups from "@/hooks/useGetGroups";
import Loading from "@/components/Loader";

export default function Dashboard() {
  const [sortBy, setSortBy] = useState("Recently Updated");
  const [filterBy, setFilterBy] = useState("All");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading } = useGetGroups();

  const groups = useMemo(() => {
    if (!data) return [];

    return data.map((group) => {
      const tasks = group?.tasks ?? [];

      const completedTasks = tasks.filter(
        (task) => task.status === "completed",
      );

      const inProgressTasks = tasks.filter(
        (task) => task.status === "in-progress",
      );

      const overdueTasks = tasks.filter(
        (task) =>
          task.dueDate &&
          task.status !== "completed" &&
          new Date(task.dueDate).getTime() < Date.now(),
      );

      return {
        _id: group?._id,
        imageUrl: group?.imageUrl,
        name: group?.name,
        description: group?.description,
        type: group?.groupType,
        members: group?.members?.length ?? 0,
        projectCount: group?.projects?.length ?? 0,
        taskCount: tasks.length,
        completedTasks: completedTasks.length,
        inProgressTasks: inProgressTasks.length,
        overdueTasks: overdueTasks.length,
      };
    });
  }, [data]);

  const stats = [
    {
      title: "Groups",
      value: groups.length,
      icon: Building2,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Total Tasks",
      value: groups.reduce((acc, group) => acc + group.taskCount, 0),
      icon: ListChecks,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "In Progress",
      value: groups.reduce((acc, group) => acc + group.inProgressTasks, 0),
      icon: Loader2,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Overdue",
      value: groups.reduce((acc, group) => acc + group.overdueTasks, 0),
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const hasgroups = groups.length > 0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Overview of your groups
          </p>
        </div>

        {/* Global Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className="border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
                        {stat.title}
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-slate-900">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${stat.bgColor} flex items-center justify-center flex-shrink-0`}
                    >
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* group Controls Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 w-full sm:w-auto"
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
                className="border-slate-300 hover:bg-slate-50 w-full sm:w-auto"
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              My groups
            </h2>
            <Button
              className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md w-full sm:w-auto"
              onClick={() => setIsOpen(true)}
            >
              <Users className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </div>

          {hasgroups ? (
            <div className="grid grid-cols-1 gap-4">
              {groups.map((group) => {
                return (
                  <Card
                    key={group._id}
                    className="border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all cursor-pointer group"
                  >
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                        {/* group Info */}
                        <div className="flex-1 min-w-0 w-full">
                          <div className="flex items-center gap-3 mb-3">
                            <div
                              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden ${
                                group.type === "personal"
                                  ? "bg-emerald-100"
                                  : "bg-blue-100"
                              }`}
                            >
                              {group.imageUrl ? (
                                <img
                                  src={group.imageUrl}
                                  alt={group.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : group?.groupType === "personal" ? (
                                <User
                                  className={`h-6 w-6 sm:h-7 sm:w-7 ${
                                    group.groupType === "personal"
                                      ? "text-emerald-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              ) : (
                                <Users
                                  className={`h-6 w-6 sm:h-7 sm:w-7 ${
                                    group.groupType === "personal"
                                      ? "text-emerald-600"
                                      : "text-blue-600"
                                  }`}
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base sm:text-lg font-bold text-slate-900 truncate">
                                {group.name}
                              </h3>
                              <p className="text-xs sm:text-sm text-slate-500">
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
                              className={`flex-shrink-0 text-xs ${
                                group.type === "personal"
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                  : "bg-blue-50 text-blue-700 border-blue-200"
                              }`}
                            >
                              {group.type === "personal" ? "Personal" : "Group"}
                            </Badge>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 sm:gap-6 mb-3">
                            <p className="text-xs sm:text-sm text-slate-600">
                              <span className="font-semibold text-slate-900">
                                {group.completedTasks}
                              </span>
                              /{group.taskCount} tasks completed
                            </p>
                            {group.taskCount > 0 && (
                              <p className="text-xs sm:text-sm font-semibold text-emerald-600">
                                {Math.round(
                                  (Number(group.completedTasks) /
                                    Number(group.taskCount)) *
                                    100,
                                )}
                                % complete
                              </p>
                            )}
                          </div>

                          {/* Progress Bar */}
                          {group.taskCount > 0 && (
                            <Progress
                              value={
                                (Number(group.completedTasks) /
                                  Number(group.taskCount)) *
                                100
                              }
                              className="h-2 bg-slate-100"
                            />
                          )}
                        </div>

                        {/* Action Button */}
                        <Link
                          href={`/group/${group._id}`}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            className="border-slate-300 hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 font-semibold group-hover:shadow-md transition-all flex-shrink-0 w-full sm:w-auto"
                          >
                            Open group
                            <ChevronRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            // Empty State
            <Card className="border-slate-200">
              <CardContent className="p-8 sm:p-12">
                <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                    <FolderOpen className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    No groups yet
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 mb-4 sm:mb-6">
                    Get started by creating a group group and invite your team
                    members to collaborate
                  </p>
                  <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base px-5 py-5 sm:px-6 sm:py-6 shadow-lg w-full sm:w-auto">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Create your first group
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {isOpen && <CreateGroupModal isOpen={isOpen} setIsOpen={setIsOpen} />}
    </div>
  );
}
