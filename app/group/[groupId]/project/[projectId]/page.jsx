"use client";

import { useState } from "react";
import {
  Users,
  User,
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

export default function ProjectDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("Recently updated");
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 10;

  // Mock project data
  const project = {
    id: "proj-123",
    name: "Website Redesign",
    type: "group", // or "personal"
    description:
      "Complete overhaul of the company website with modern design and improved UX",
    totalTasks: 24,
    completedTasks: 18,
    overdueTasks: 2,
    progress: 75,
  };

  // Mock tasks data (expanded to show pagination)
  const tasks = [
    {
      id: 1,
      title: "Design new homepage layout",
      status: "done",
      priority: "high",
      dueDate: "2026-01-20",
      assignee: {
        name: "Sarah Chen",
        avatar: "SC",
      },
    },
    {
      id: 2,
      title: "Implement responsive navigation",
      status: "in-progress",
      priority: "high",
      dueDate: "2026-01-25",
      assignee: {
        name: "John Doe",
        avatar: "JD",
      },
    },
    {
      id: 3,
      title: "Optimize images for web",
      status: "todo",
      priority: "medium",
      dueDate: "2026-01-28",
      assignee: {
        name: "Mike Wilson",
        avatar: "MW",
      },
    },
    {
      id: 4,
      title: "Write blog post about redesign",
      status: "todo",
      priority: "low",
      dueDate: "2026-02-05",
      assignee: {
        name: "Emily Davis",
        avatar: "ED",
      },
    },
    {
      id: 5,
      title: "Update contact form validation",
      status: "done",
      priority: "medium",
      dueDate: "2026-01-18",
      assignee: {
        name: "John Doe",
        avatar: "JD",
      },
    },
    {
      id: 6,
      title: "Review accessibility compliance",
      status: "in-progress",
      priority: "high",
      dueDate: "2026-01-22",
      assignee: {
        name: "Sarah Chen",
        avatar: "SC",
      },
    },
    {
      id: 7,
      title: "Set up Google Analytics tracking",
      status: "todo",
      priority: "medium",
      dueDate: "2026-01-30",
      assignee: {
        name: "Mike Wilson",
        avatar: "MW",
      },
    },
    {
      id: 8,
      title: "Create style guide documentation",
      status: "in-progress",
      priority: "low",
      dueDate: "2026-02-02",
      assignee: {
        name: "Emily Davis",
        avatar: "ED",
      },
    },
    {
      id: 9,
      title: "Test cross-browser compatibility",
      status: "todo",
      priority: "high",
      dueDate: "2026-01-27",
      assignee: {
        name: "John Doe",
        avatar: "JD",
      },
    },
    {
      id: 10,
      title: "Implement SEO meta tags",
      status: "done",
      priority: "medium",
      dueDate: "2026-01-19",
      assignee: {
        name: "Sarah Chen",
        avatar: "SC",
      },
    },
    {
      id: 11,
      title: "Configure CDN for static assets",
      status: "in-progress",
      priority: "medium",
      dueDate: "2026-01-26",
      assignee: {
        name: "Mike Wilson",
        avatar: "MW",
      },
    },
    {
      id: 12,
      title: "Design mobile app mockups",
      status: "todo",
      priority: "high",
      dueDate: "2026-02-08",
      assignee: {
        name: "Emily Davis",
        avatar: "ED",
      },
    },
    {
      id: 13,
      title: "Update terms of service page",
      status: "todo",
      priority: "low",
      dueDate: "2026-02-10",
      assignee: {
        name: "John Doe",
        avatar: "JD",
      },
    },
    {
      id: 14,
      title: "Integrate payment gateway",
      status: "in-progress",
      priority: "high",
      dueDate: "2026-01-29",
      assignee: {
        name: "Sarah Chen",
        avatar: "SC",
      },
    },
    {
      id: 15,
      title: "Build email newsletter template",
      status: "done",
      priority: "medium",
      dueDate: "2026-01-21",
      assignee: {
        name: "Mike Wilson",
        avatar: "MW",
      },
    },
  ];

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
  const getStatusBadge = (status) => {
    const statusConfig = {
      todo: {
        label: "To Do",
        className: "bg-slate-100 text-slate-700 border-slate-200",
      },
      "in-progress": {
        label: "In Progress",
        className: "bg-blue-50 text-blue-700 border-blue-200",
      },
      done: {
        label: "Done",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
    };

    const config = statusConfig[status] || statusConfig.todo;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      low: {
        label: "Low",
        className: "bg-slate-100 text-slate-600 border-slate-200",
      },
      medium: {
        label: "Medium",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      high: {
        label: "High",
        className: "bg-red-50 text-red-700 border-red-200",
      },
    };

    const config = priorityConfig[priority] || priorityConfig.low;
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const isOverdue =
      date < today && date.toDateString() !== today.toDateString();

    const formatted = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    return (
      <span
        className={isOverdue ? "text-red-600 font-medium" : "text-slate-600"}
      >
        {formatted}
      </span>
    );
  };

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
                <Badge
                  variant="secondary"
                  className={
                    project.type === "personal"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200 w-fit"
                      : "bg-blue-50 text-blue-700 border-blue-200 w-fit"
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
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-md w-full sm:w-auto">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-slate-200">
                    <TableHead className="font-semibold text-slate-700 min-w-[200px]">
                      Task
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 min-w-[120px]">
                      Status
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 min-w-[100px]">
                      Priority
                    </TableHead>
                    <TableHead className="font-semibold text-slate-700 min-w-[120px]">
                      Due Date
                    </TableHead>
                    {project.type === "group" && (
                      <TableHead className="font-semibold text-slate-700 min-w-[150px]">
                        Assignee
                      </TableHead>
                    )}
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTasks.map((task) => (
                    <TableRow
                      key={task.id}
                      className="cursor-pointer hover:bg-slate-50 border-slate-200"
                    >
                      <TableCell className="font-medium text-slate-900">
                        {task.title}
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4 text-slate-400 flex-shrink-0" />
                          {formatDate(task.dueDate)}
                        </div>
                      </TableCell>
                      {project.type === "group" && (
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                              {task.assignee.avatar}
                            </div>
                            <span className="text-sm text-slate-700 truncate">
                              {task.assignee.name}
                            </span>
                          </div>
                        </TableCell>
                      )}
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <MoreHorizontal className="h-4 w-4 text-slate-500" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Edit task</DropdownMenuItem>
                            <DropdownMenuItem>Change status</DropdownMenuItem>
                            <DropdownMenuItem>Set priority</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              Delete task
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </div>
  );
}
