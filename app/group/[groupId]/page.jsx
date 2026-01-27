"use client";
import React, { useState } from "react";
import {
  Users,
  Settings,
  Plus,
  UserPlus,
  Search,
  ChevronDown,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Calendar,
  MoreVertical,
  Shield,
  Trash2,
  Link2,
  Edit3,
  LayoutGrid,
  LayoutList,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import CreateProjectModal from "@/components/CreateProjectModal";

const TaskoraGroupPage = ({ params }) => {
  const { groupId } = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Mock Data
  const groupData = {
    id: 1,
    name: "Engineering Team",
    description: "Product development and technical operations",
    logo: "ET",
    memberCount: 24,
    totalProjects: 12,
    totalTasks: 187,
    completedTasks: 142,
    activeMembers: 18,
    inviteLink: "https://taskora.app/invite/eng-team-xyz123",
  };

  const projects = [
    {
      id: 1,
      name: "Website Redesign 2026",
      description: "Complete overhaul of company website",
      status: "active",
      progress: 67,
      dueDate: "2026-02-15",
      totalTasks: 24,
      completedTasks: 16,
      lead: {
        name: "Sarah Chen",
        avatar: "SC",
        color: "from-blue-500 to-cyan-500",
      },
      priority: "high",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "iOS and Android native applications",
      status: "active",
      progress: 45,
      dueDate: "2026-03-20",
      totalTasks: 56,
      completedTasks: 25,
      lead: {
        name: "Mike Johnson",
        avatar: "MJ",
        color: "from-purple-500 to-pink-500",
      },
      priority: "high",
    },
    {
      id: 3,
      name: "API v3 Documentation",
      description: "Developer documentation and guides",
      status: "active",
      progress: 82,
      dueDate: "2026-01-30",
      totalTasks: 18,
      completedTasks: 15,
      lead: {
        name: "Alex Kumar",
        avatar: "AK",
        color: "from-green-500 to-emerald-500",
      },
      priority: "medium",
    },
    {
      id: 4,
      name: "Customer Support Portal",
      description: "Self-service support platform",
      status: "on-hold",
      progress: 28,
      dueDate: "2026-04-10",
      totalTasks: 42,
      completedTasks: 12,
      lead: {
        name: "Emma Davis",
        avatar: "ED",
        color: "from-orange-500 to-red-500",
      },
      priority: "medium",
    },
    {
      id: 5,
      name: "Q1 2026 Marketing Campaign",
      description: "Integrated marketing initiatives",
      status: "completed",
      progress: 100,
      dueDate: "2026-01-20",
      totalTasks: 32,
      completedTasks: 32,
      lead: {
        name: "Lisa Anderson",
        avatar: "LA",
        color: "from-indigo-500 to-purple-500",
      },
      priority: "low",
    },
    {
      id: 6,
      name: "Infrastructure Migration",
      description: "Cloud infrastructure upgrade",
      status: "active",
      progress: 55,
      dueDate: "2026-02-28",
      totalTasks: 15,
      completedTasks: 8,
      lead: {
        name: "James Wilson",
        avatar: "JW",
        color: "from-teal-500 to-cyan-500",
      },
      priority: "high",
    },
  ];

  const members = [
    {
      id: 1,
      name: "Sarah Chen",
      avatar: "SC",
      role: "owner",
      email: "sarah@acme.co",
      taskCount: 28,
      color: "from-blue-500 to-cyan-500",
    },
    {
      id: 2,
      name: "Mike Johnson",
      avatar: "MJ",
      role: "admin",
      email: "mike@acme.co",
      taskCount: 24,
      color: "from-purple-500 to-pink-500",
    },
    {
      id: 3,
      name: "Alex Kumar",
      avatar: "AK",
      role: "admin",
      email: "alex@acme.co",
      taskCount: 22,
      color: "from-green-500 to-emerald-500",
    },
    {
      id: 4,
      name: "Emma Davis",
      avatar: "ED",
      role: "member",
      email: "emma@acme.co",
      taskCount: 18,
      color: "from-orange-500 to-red-500",
    },
    {
      id: 5,
      name: "James Wilson",
      avatar: "JW",
      role: "member",
      email: "james@acme.co",
      taskCount: 16,
      color: "from-teal-500 to-cyan-500",
    },
    {
      id: 6,
      name: "Lisa Anderson",
      avatar: "LA",
      role: "member",
      email: "lisa@acme.co",
      taskCount: 14,
      color: "from-indigo-500 to-purple-500",
    },
    {
      id: 7,
      name: "Tom Brown",
      avatar: "TB",
      role: "member",
      email: "tom@acme.co",
      taskCount: 12,
      color: "from-yellow-500 to-orange-500",
    },
    {
      id: 8,
      name: "Kate Miller",
      avatar: "KM",
      role: "member",
      email: "kate@acme.co",
      taskCount: 10,
      color: "from-pink-500 to-rose-500",
    },
  ];

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: "Active",
        className: "bg-green-50 text-green-700 border-green-200",
        dotColor: "bg-green-500",
      },
      "on-hold": {
        label: "On Hold",
        className: "bg-yellow-50 text-yellow-700 border-yellow-200",
        dotColor: "bg-yellow-500",
      },
      completed: {
        label: "Completed",
        className: "bg-blue-50 text-blue-700 border-blue-200",
        dotColor: "bg-blue-500",
      },
    };
    return configs[status];
  };

  const getPriorityConfig = (priority) => {
    const configs = {
      high: {
        label: "High",
        className: "bg-red-50 text-red-700 border-red-200",
      },
      medium: {
        label: "Medium",
        className: "bg-orange-50 text-orange-700 border-orange-200",
      },
      low: {
        label: "Low",
        className: "bg-gray-50 text-gray-700 border-gray-200",
      },
    };
    return configs[priority];
  };

  const filteredProjects = projects
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "status") return a.status.localeCompare(b.status);
      if (sortBy === "dueDate")
        return new Date(a.dueDate) - new Date(b.dueDate);
      if (sortBy === "priority") {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return 0;
    });

  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(groupData.inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-16 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-12 h-10 sm:w-14 sm:h-14 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-sm flex-shrink-0">
                {groupData.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                  {groupData.name}
                </h1>
                <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                  {groupData.description}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{groupData.memberCount} members</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    <span>{groupData.totalProjects} projects</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="hidden sm:flex px-4 py-2 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors items-center gap-2 font-medium text-sm">
                <UserPlus className="w-4 h-4" />
                Invite Member
              </button>
              <button
                className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white hover:bg-indigo-700 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm shadow-sm"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span className="sm:inline">Create Project</span>
              </button>
              <button
                onClick={() => setActiveSection("settings")}
                className="p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex gap-4 sm:gap-6 border-b border-gray-200 overflow-x-auto scrollbar-hid">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-1 py-3 font-medium text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeSection === "overview"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveSection("members")}
              className={`px-1 py-3 font-medium text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeSection === "members"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Members
            </button>
            <button
              onClick={() => setActiveSection("settings")}
              className={`px-1 py-3 font-medium text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeSection === "settings"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Settings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 mt-[50px]">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {groupData.totalProjects}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {groupData.totalTasks}
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Completed
                  </p>
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {groupData.completedTasks}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(
                    (groupData.completedTasks / groupData.totalTasks) * 100,
                  )}
                  % completion
                </p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Active Members
                  </p>
                  <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {groupData.activeMembers}
                </p>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-lg border border-gray-200">
              {/* Projects Header */}
              <div className="p-4 sm:p-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                    Projects
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <LayoutList className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="status">Sort by Status</option>
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="priority">Sort by Priority</option>
                  </select>
                </div>
              </div>

              {/* Projects List/Grid */}
              {filteredProjects.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FolderKanban className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Get started by creating your first project
                  </p>
                  <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    Create Project
                  </button>
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const priorityConfig = getPriorityConfig(project.priority);

                    return (
                      <div
                        key={project.id}
                        className="p-5 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-base font-semibold text-gray-900">
                                {project.name}
                              </h3>
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${statusConfig.className}`}
                              >
                                <span
                                  className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                                />
                                {statusConfig.label}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-md text-xs font-medium border ${priorityConfig.className}`}
                              >
                                {priorityConfig.label}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {project.description}
                            </p>

                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-6 h-6 rounded-full bg-gradient-to-br ${project.lead.color} flex items-center justify-center text-white text-xs font-medium`}
                                >
                                  {project.lead.avatar}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {project.lead.name}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>
                                  {project.completedTasks}/{project.totalTasks}{" "}
                                  tasks
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Due{" "}
                                  {new Date(project.dueDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" },
                                  )}
                                </span>
                              </div>

                              <div className="flex-1 max-w-xs">
                                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                                  <span>Progress</span>
                                  <span className="font-medium">
                                    {project.progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-1.5">
                                  <div
                                    className="bg-indigo-600 h-1.5 rounded-full transition-all"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>

                          <button
                            className="ml-6 px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium opacity-0 group-hover:opacity-100"
                            onClick={() =>
                              router.push(
                                `/group/${groupData.id}/project/${project.id}`,
                              )
                            }
                          >
                            Open
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredProjects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const priorityConfig = getPriorityConfig(project.priority);

                    return (
                      <div
                        key={project.id}
                        className="p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all bg-white group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${statusConfig.className}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor}`}
                              />
                              {statusConfig.label}
                            </span>
                            <span
                              className={`px-2.5 py-1 rounded-md text-xs font-medium border ${priorityConfig.className}`}
                            >
                              {priorityConfig.label}
                            </span>
                          </div>
                        </div>

                        <h3 className="text-base font-semibold text-gray-900 mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {project.completedTasks}/{project.totalTasks}{" "}
                              tasks
                            </span>
                            <span className="font-medium text-gray-900">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-indigo-600 h-1.5 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-6 h-6 rounded-full bg-gradient-to-br ${project.lead.color} flex items-center justify-center text-white text-xs font-medium`}
                            >
                              {project.lead.avatar}
                            </div>
                            <span className="text-xs text-gray-600">
                              Due{" "}
                              {new Date(project.dueDate).toLocaleDateString(
                                "en-US",
                                { month: "short", day: "numeric" },
                              )}
                            </span>
                          </div>
                          <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Open →
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* Members Section */}
        {activeSection === "members" && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 sm:p-5 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                  Team Members
                </h2>
                <button className="w-full sm:w-auto px-4 py-2 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 sm:p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white font-medium flex-shrink-0`}
                      >
                        {member.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-2 mb-1">
                          {member.role === "owner" && (
                            <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium">
                              Owner
                            </span>
                          )}
                          {member.role === "admin" && (
                            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">
                              Admin
                            </span>
                          )}
                          {member.role === "member" && (
                            <span className="px-2.5 py-1 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-xs font-medium">
                              Member
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-600">
                          {member.taskCount} tasks assigned
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === "settings" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Group Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Group Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Name
                  </label>
                  <input
                    type="text"
                    defaultValue={groupData.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    defaultValue={groupData.description}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="pt-2">
                  <button className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            {/* Invitation Link */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-gray-900 mb-4">
                Invitation Link
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Share this link to invite new members to your group
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={groupData.inviteLink}
                  readOnly
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm"
                />
                <button
                  onClick={handleCopyInviteLink}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium whitespace-nowrap"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </>
                  )}
                </button>
              </div>
              <button className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                Generate New Link
              </button>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-4 sm:p-6">
              <h3 className="text-base font-semibold text-red-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Danger Zone
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Once you delete this group, all projects and data will be
                permanently removed. This action cannot be undone.
              </p>
              <button className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium">
                <Trash2 className="w-4 h-4" />
                Delete Group
              </button>
            </div>
          </div>
        )}
      </div>
      {isOpen && (
        <CreateProjectModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default TaskoraGroupPage;
