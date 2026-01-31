"use client";

import { useState } from "react";
import {
  Circle,
  Menu,
  Plus,
  LayoutGrid,
  CheckCircle2,
  AlertCircle,
  Clock,
  ListTodo,
  Filter,
  ArrowUpDown,
  Search,
  MoreHorizontal,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CreateTaskModal from "@/components/CreateTaskModal";
import { useParams } from "next/navigation";
import useGetProjectById from "@/hooks/useGetProjectById";
import Loading from "@/components/Loader";
import useGetTask from "@/hooks/useGetTask";
import TaskActions from "@/components/TaskActions";

export default function ProjectDetailPage() {
  const { groupId, projectId } = useParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("Recently updated");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const tasksPerPage = 10;

  const { projectByIdData, isLoading } = useGetProjectById(groupId, projectId);
  const { taskData, taskLoading } = useGetTask(groupId, projectId);

  let tasks = [];
  taskData?.map((task) => {
    const assignedTo = task.assignedTo.map((member) => ({
      name: member.name,
      avatar: member.profileImage,
    }));
    const payload = {
      id: task?._id,
      description: task?.description,
      title: task?.name,
      status: task?.status,
      dueDate: task?.dueDate,
      priority: task?.priority,
      assignedTo,
    };
    tasks.push(payload);
  });
  console.log(tasks);

  const project = {
    id: projectByIdData?._id,
    name: projectByIdData?.name,
    type: projectByIdData?.type,
    description: projectByIdData?.description,
    totalTasks: projectByIdData?.tasks?.length,
    completedTasks: projectByIdData?.tasks?.filter(
      (task) => task.status === "completed",
    ).length,
    overdueTasks: projectByIdData?.tasks?.filter((task) => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== "completed";
    }).length,

    progress: Math.round(
      (projectByIdData?.tasks?.filter((task) => task.status === "completed")
        .length /
        (projectByIdData?.tasks?.length || 1)) *
        100,
    ),
  };

  const hasTasks = tasks.length > 0;

  // Pagination logic
  const totalPages = Math.ceil(tasks.length / tasksPerPage);
  const startIndex = (currentPage - 1) * tasksPerPage;
  const endIndex = startIndex + tasksPerPage;
  const currentTasks = tasks.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  // Helper function to get status badge
  const getStatusConfig = (status) => {
    const configs = {
      todo: {
        icon: Circle,
        label: "To Do",
        bgColor: "bg-slate-100",
        textColor: "text-slate-700",
        dotColor: "bg-slate-400",
      },
      "in-progress": {
        icon: Clock,
        label: "In Progress",
        bgColor: "bg-teal-50",
        textColor: "text-teal-700",
        dotColor: "bg-teal-500",
      },
      completed: {
        icon: CheckCircle2,
        label: "Completed",
        bgColor: "bg-emerald-50",
        textColor: "text-emerald-700",
        dotColor: "bg-emerald-500",
      },
    };
    return configs[status] || configs.todo;
  };

  // Helper function to get priority badge

  const getPriorityConfig = (priority) => {
    const configs = {
      low: {
        label: "Low",
        bgColor: "bg-slate-100",
        textColor: "text-slate-600",
        borderColor: "border-slate-300",
      },
      medium: {
        label: "Medium",
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-300",
      },
      high: {
        label: "High",
        bgColor: "bg-rose-50",
        textColor: "text-rose-700",
        borderColor: "border-rose-300",
      },
    };
    return configs[priority] || configs.medium;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const diffTime = date - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
    });

    if (diffDays < 0)
      return {
        text: formatted,
        overdue: true,
        daysText: `${Math.abs(diffDays)}d overdue`,
      };
    if (diffDays === 0)
      return { text: "Today", urgent: true, daysText: "Due today" };
    if (diffDays === 1)
      return { text: "Tomorrow", urgent: true, daysText: "Due tomorrow" };
    if (diffDays <= 7)
      return { text: formatted, soon: true, daysText: `${diffDays}d left` };
    return { text: formatted, daysText: `${diffDays}d left` };
  };

  if (isLoading || taskLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Project Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 lg:gap-6 mb-4">
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-3">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {project.name}
                </h1>
              </div>
              {project.description && (
                <p className="text-sm sm:text-base text-slate-600 max-w-3xl">
                  {project.description}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-shrink-0">
              <Button
                variant="outline"
                className="border-slate-300 hover:bg-slate-50 w-full sm:w-auto"
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Open Kanban Board
              </Button>
              <Button
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md w-full sm:w-auto"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Card className="border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
                    Total Tasks
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {project.totalTasks}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                  <ListTodo className="h-5 w-5 sm:h-6 sm:w-6 text-slate-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
                    Completed
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-emerald-600">
                    {project.completedTasks}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
                    Overdue
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-red-600">
                    {project.overdueTasks}
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-50 rounded-lg flex items-center justify-center">
                  <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1 sm:mb-2">
                    Progress
                  </p>
                  <p className="text-2xl sm:text-3xl font-black text-blue-600">
                    {project.progress}%
                  </p>
                </div>
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-full sm:min-w-[280px] sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-slate-300 focus-visible:ring-emerald-500 focus-visible:border-emerald-500"
            />
          </div>

          {/* Filters - Wrap on mobile */}
          <div className="flex items-center gap-3 flex-wrap">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Status: </span>
                  {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setFilterStatus("All")}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("To Do")}>
                  To Do
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilterStatus("In Progress")}
                >
                  In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("Done")}>
                  Done
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 flex-1 sm:flex-none"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Priority: </span>
                  {filterPriority}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setFilterPriority("All")}>
                  All Priorities
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority("High")}>
                  High
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority("Medium")}>
                  Medium
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterPriority("Low")}>
                  Low
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-slate-300 hover:bg-slate-50 flex-1 sm:flex-none"
                >
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sort: </span>
                  <span className="sm:hidden">Sort</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => setSortBy("Due date")}>
                  Due date
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Priority")}>
                  Priority
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("Recently updated")}>
                  Recently updated
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Task List */}
        {hasTasks ? (
          <Card className="border-slate-200">
            {/* Desktop Table View - Hidden on mobile */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-lg border border-emerald-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Task
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Priority
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Due Date
                      </th>
                      <th className="text-left py-4 px-6 text-sm font-semibold text-slate-700">
                        Assigned To
                      </th>
                      <th className="w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => {
                      const statusConfig = getStatusConfig(task.status);
                      const priorityConfig = getPriorityConfig(task.priority);
                      const dateInfo = formatDate(task.dueDate);
                      const StatusIcon = statusConfig.icon;

                      return (
                        <tr
                          key={task.id}
                          className={`border-b border-slate-100 transition-all duration-200 ${
                            hoveredRow === task.id
                              ? "bg-gradient-to-r from-emerald-50 to-transparent shadow-sm"
                              : "hover:bg-slate-50"
                          }`}
                          onMouseEnter={() => setHoveredRow(task.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          {/* Task Title */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-1 h-10 rounded-full ${priorityConfig.bgColor} ${priorityConfig.borderColor} border-2`}
                              ></div>
                              <div>
                                <p className="font-medium text-slate-900 mb-0.5">
                                  {task.title}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {task.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-4 px-6">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bgColor}`}
                            >
                              <StatusIcon
                                className={`w-4 h-4 ${statusConfig.textColor}`}
                              />
                              <span
                                className={`text-sm font-medium ${statusConfig.textColor}`}
                              >
                                {statusConfig.label}
                              </span>
                            </div>
                          </td>

                          {/* Priority */}
                          <td className="py-4 px-6">
                            <div
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor}`}
                            >
                              <div
                                className={`w-2 h-2 rounded-full ${priorityConfig.textColor.replace("text-", "bg-")}`}
                              ></div>
                              <span className="text-sm font-medium">
                                {priorityConfig.label}
                              </span>
                            </div>
                          </td>

                          {/* Due Date */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2">
                              <Calendar
                                className={`w-4 h-4 flex-shrink-0 ${
                                  dateInfo.overdue
                                    ? "text-rose-500"
                                    : dateInfo.urgent
                                      ? "text-amber-500"
                                      : dateInfo.soon
                                        ? "text-teal-500"
                                        : "text-slate-400"
                                }`}
                              />
                              <div>
                                <p
                                  className={`text-sm font-medium ${
                                    dateInfo.overdue
                                      ? "text-rose-700"
                                      : dateInfo.urgent
                                        ? "text-amber-700"
                                        : "text-slate-700"
                                  }`}
                                >
                                  {dateInfo.text}
                                </p>
                                <p
                                  className={`text-xs ${
                                    dateInfo.overdue
                                      ? "text-rose-600"
                                      : dateInfo.urgent
                                        ? "text-amber-600"
                                        : "text-slate-500"
                                  }`}
                                >
                                  {dateInfo.daysText}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Assigned To */}
                          <td className="py-4 px-6">
                            <div className="flex items-center -space-x-2">
                              {task.assignedTo.map((member, i) => (
                                <div
                                  key={i}
                                  className="relative group"
                                  style={{ zIndex: task.assignedTo.length - i }}
                                >
                                  <div className="w-9 h-9 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden shadow-md hover:scale-110 transition-transform cursor-pointer">
                                    <img
                                      src={member.avatar}
                                      alt={member.name}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  {/* Tooltip */}
                                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-50">
                                    {member.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-2 h-2 bg-slate-900 rotate-45"></div>
                                  </div>
                                </div>
                              ))}
                              {task.assignedTo.length > 3 && (
                                <div className="w-9 h-9 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 shadow-md">
                                  +{task.assignedTo.length - 3}
                                </div>
                              )}
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="py-4 px-6 relative overflow-visible text-right">
                            <TaskActions
                              taskId={task.id}
                              groupId={groupId}
                              projectId={projectId}
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Card View - Shown on small/medium screens */}
            <div className="lg:hidden space-y-4">
              {tasks.map((task) => {
                const statusConfig = getStatusConfig(task.status);
                const priorityConfig = getPriorityConfig(task.priority);
                const dateInfo = formatDate(task.dueDate);
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-xl shadow-md border border-emerald-100 p-4 sm:p-5 hover:shadow-lg transition-shadow"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className={`w-1 h-8 rounded-full ${priorityConfig.bgColor} ${priorityConfig.borderColor} border-2`}
                          ></div>
                          <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
                            {task.title}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500 ml-3">
                          #{task.id}
                        </p>
                      </div>
                      <button className="w-8 h-8 rounded-lg hover:bg-emerald-50 flex items-center justify-center transition-colors flex-shrink-0">
                        <MoreHorizontal className="w-5 h-5 text-slate-400" />
                      </button>
                    </div>

                    {/* Status and Priority */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusConfig.bgColor}`}
                      >
                        <StatusIcon
                          className={`w-3.5 h-3.5 ${statusConfig.textColor}`}
                        />
                        <span
                          className={`text-xs font-medium ${statusConfig.textColor}`}
                        >
                          {statusConfig.label}
                        </span>
                      </div>
                      <div
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${priorityConfig.bgColor} ${priorityConfig.textColor} ${priorityConfig.borderColor}`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${priorityConfig.textColor.replace("text-", "bg-")}`}
                        ></div>
                        <span className="text-xs font-medium">
                          {priorityConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-2 mb-3 p-2 bg-slate-50 rounded-lg">
                      <Calendar
                        className={`w-4 h-4 flex-shrink-0 ${
                          dateInfo.overdue
                            ? "text-rose-500"
                            : dateInfo.urgent
                              ? "text-amber-500"
                              : dateInfo.soon
                                ? "text-teal-500"
                                : "text-slate-400"
                        }`}
                      />
                      <div>
                        <p
                          className={`text-xs font-medium ${
                            dateInfo.overdue
                              ? "text-rose-700"
                              : dateInfo.urgent
                                ? "text-amber-700"
                                : "text-slate-700"
                          }`}
                        >
                          {dateInfo.text}
                        </p>
                        <p
                          className={`text-xs ${
                            dateInfo.overdue
                              ? "text-rose-600"
                              : dateInfo.urgent
                                ? "text-amber-600"
                                : "text-slate-500"
                          }`}
                        >
                          {dateInfo.daysText}
                        </p>
                      </div>
                    </div>

                    {/* Assigned To */}
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-slate-600 font-medium">
                        Assigned to:
                      </p>
                      <div className="flex items-center -space-x-2">
                        {task.assignedTo.map((member, i) => (
                          <div
                            key={i}
                            className="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-emerald-400 to-teal-500 overflow-hidden shadow-sm"
                            title={member.name}
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      {task.assignedTo.length > 0 && (
                        <span className="text-xs text-slate-600 ml-1">
                          {task.assignedTo.map((m) => m.name).join(", ")}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-4 sm:px-6 py-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-xs sm:text-sm text-slate-600 text-center sm:text-left">
                    Showing{" "}
                    <span className="font-medium text-slate-900">
                      {startIndex + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium text-slate-900">
                      {Math.min(endIndex, tasks.length)}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-slate-900">
                      {tasks.length}
                    </span>{" "}
                    tasks
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="h-4 w-4 sm:mr-1" />
                      <span className="hidden sm:inline">Previous</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <Button
                            key={page}
                            variant={
                              currentPage === page ? "default" : "outline"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className={
                              currentPage === page
                                ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white w-8 sm:w-auto"
                                : "border-slate-300 hover:bg-slate-50 w-8 sm:w-auto"
                            }
                          >
                            {page}
                          </Button>
                        ),
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="hidden sm:inline">Next</span>
                      <ChevronRight className="h-4 w-4 sm:ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ) : (
          // Empty State
          <Card className="border-slate-200">
            <CardContent className="p-8 sm:p-12">
              <div className="flex flex-col items-center justify-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                  <ListTodo className="h-8 w-8 sm:h-10 sm:w-10 text-slate-400" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                  No tasks yet
                </h3>
                <p className="text-sm sm:text-base text-slate-600 mb-6">
                  Get started by creating your first task for this project
                </p>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm sm:text-base px-6 py-5 sm:py-6 shadow-lg w-full sm:w-auto">
                  <Plus className="h-5 w-5 mr-2" />
                  Create first task
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        groupId={groupId}
        projectId={projectId}
      />
    </div>
  );
}
