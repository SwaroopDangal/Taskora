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
  User,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import CreateProjectModal from "@/components/CreateProjectModal";
import useGetProjects from "@/hooks/useGetProjects";
import useGetGroupById from "@/hooks/useGetGroupById";
import Loading from "@/components/Loader";
import useGetInvitationalLink from "@/hooks/useGetInvitationalLink";
import InviteModal from "@/components/InviteModal";
import useUpdateGroup from "@/hooks/useUpdateGroup";
import useDeleteGroup from "@/hooks/useDeleteGroup";
import DeleteGroupModal from "@/components/DeleteGroupModal";
import Image from "next/image";

const TaskoraGroupPage = () => {
  const { groupId } = useParams();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("overview");
  const [viewMode, setViewMode] = useState("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);

  const { projectsData, isLoading: isProjectLoading } = useGetProjects(groupId);
  const { groupUpdateMutation, updatePending } = useUpdateGroup();
  const { invitationLink, isLoading: isInvitationLoading } =
    useGetInvitationalLink(groupId);

  const { groupByIdData, isLoading } = useGetGroupById(groupId);

  const [edits, setEdits] = useState({});

  const name = edits.name ?? groupByIdData?.name ?? "";
  const description = edits.description ?? groupByIdData?.description ?? "";

  let projects = [];
  projectsData?.map((project) => {
    const payload = {
      id: project?._id,
      name: project?.name,
      description: project?.description,
      status: project?.status,
      dueDate: project?.dueDate,
      priority: project?.priority,
      totalTasks: project?.tasks?.length,
      lead: {
        name: project?.role.map((role) => role?.user?.name)[0],
        avatar: project?.role.map((role) => role?.user?.profileImage)[0],
        color: "from-blue-500 to-cyan-500",
      },
      completedTasks: project?.tasks?.filter(
        (task) => task.status === "completed",
      ).length,
    };

    projects.push(payload);
  });
  const groupData = {
    id: groupByIdData?._id,
    name: groupByIdData?.name,
    groupType: groupByIdData?.groupType,
    description: groupByIdData?.description,
    logo: groupByIdData?.imageUrl,
    memberCount: groupByIdData?.members?.length,
    totalProjects: groupByIdData?.projects?.length,
    totalTasks: groupByIdData?.tasks?.length,
    completedTasks: groupByIdData?.tasks?.filter(
      (task) => task.status === "completed",
    ).length,
  };

  const members = groupByIdData?.members?.map((member) => {
    console.log(member);
    const payload = {
      id: member?._id,
      name: member?.user?.name,
      avatar: member?.user?.profileImage,
      role: member?.role,
      email: member?.user?.email,
      taskCount: 10,
    };
    return payload;
  });

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

  const handleUpdateGroup = async (e) => {
    e.preventDefault();
    if (!name) return;
    const payload = {
      name: edits.name ?? groupByIdData?.name,
      description: edits.description ?? groupByIdData?.description,
      groupId,
    };
    groupUpdateMutation(payload);
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
    navigator.clipboard.writeText(invitationLink?.invitationLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading || isProjectLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 fixed top-16 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-6">
            <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-sm flex-shrink-0">
                {groupData.logo ? (
                  <img
                    src={groupData.logo}
                    alt={groupData.name}
                    className="w-full h-full object-cover"
                  />
                ) : groupData?.groupType === "personal" ? (
                  <User
                    className={`h-6 w-6 sm:h-7 sm:w-7 ${
                      groupData.groupType === "personal"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  />
                ) : (
                  <Users
                    className={`h-6 w-6 sm:h-7 sm:w-7 ${
                      groupData.groupType === "personal"
                        ? "text-emerald-600"
                        : "text-blue-600"
                    }`}
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 truncate">
                  {groupData.name}
                </h1>
                <p className="text-sm sm:text-base text-gray-600 mb-2 sm:mb-3 line-clamp-2">
                  {groupData.description}
                </p>
                <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 text-xs sm:text-sm text-gray-500">
                  {groupData.groupType !== "personal" && (
                    <div className="flex items-center gap-1.5">
                      <Users className="w-4 h-4" />
                      <span>{groupData.memberCount} members</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <FolderKanban className="w-4 h-4" />
                    <span>{groupData.totalProjects} projects</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              {groupData.groupType !== "personal" && (
                <button
                  className="hidden md:flex px-4 py-2.5 text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors items-center gap-2 font-medium text-sm"
                  onClick={() => setIsInviteOpen(true)}
                >
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </button>
              )}
              <button
                className="flex-1 sm:flex-none px-4 sm:px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm shadow-sm"
                onClick={() => setIsOpen(true)}
              >
                <Plus className="w-4 h-4" />
                <span>Create Project</span>
              </button>
              <button
                onClick={() => setActiveSection("settings")}
                className="p-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 sm:gap-8 border-b border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveSection("overview")}
              className={`px-1 py-3 sm:py-4 font-medium text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeSection === "overview"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Overview
            </button>
            {groupData.groupType !== "personal" && (
              <button
                onClick={() => setActiveSection("members")}
                className={`px-1 py-3 sm:py-4 font-medium text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                  activeSection === "members"
                    ? "border-emerald-600 text-emerald-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                Members
              </button>
            )}
            <button
              onClick={() => setActiveSection("settings")}
              className={`px-1 py-3 sm:py-4 font-medium text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 mt-[180px] sm:mt-[160px]">
        {/* Overview Section */}
        {activeSection === "overview" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Projects
                  </p>
                  <FolderKanban className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {groupData.totalProjects}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Total Tasks
                  </p>
                  <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {groupData.totalTasks}
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs sm:text-sm font-medium text-gray-600">
                    Completed
                  </p>
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                  {groupData.completedTasks}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                  {Math.round(
                    (groupData.completedTasks / groupData.totalTasks) * 100,
                  )}
                  % completion
                </p>
              </div>
            </div>

            {/* Projects Section */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Projects Header */}
              <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-5">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Projects
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2.5 rounded-lg transition-colors ${
                        viewMode === "list"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <LayoutList className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2.5 rounded-lg transition-colors ${
                        viewMode === "grid"
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <LayoutGrid className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
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
                <div className="p-12 sm:p-16 lg:p-20 text-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                    <FolderKanban className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                    No projects yet
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                    Get started by creating your first project
                  </p>
                  <button
                    className="px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                    onClick={() => setIsOpen(true)}
                  >
                    Create Project
                  </button>
                </div>
              ) : viewMode === "list" ? (
                <div className="divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const progress =
                      (Number(project.completedTasks) /
                        Number(project.totalTasks)) *
                      100;
                    const statusConfig = getStatusConfig(project.status);
                    const priorityConfig = getPriorityConfig(project.priority);

                    return (
                      <div
                        key={project.id}
                        className="p-4 sm:p-5 lg:p-6 hover:bg-gray-50 transition-colors group"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
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
                            <p className="text-sm sm:text-base text-gray-600 mb-4">
                              {project.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-7 h-7 rounded-full bg-gradient-to-br ${project.lead.color} flex items-center justify-center text-white text-xs font-medium`}
                                >
                                  <Image
                                    src={project.lead.avatar}
                                    alt={project.lead.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full"
                                  />
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

                              {project.totalTasks > 0 && (
                                <div className="flex-1 min-w-[200px] max-w-xs">
                                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
                                    <span>Progress</span>
                                    <span className="font-medium">
                                      {progress}%
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-indigo-600 h-2 rounded-full transition-all"
                                      style={{
                                        width: `${progress}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <button
                            className="lg:ml-6 px-4 sm:px-5 py-2 sm:py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium lg:opacity-0 lg:group-hover:opacity-100"
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
                <div className="p-4 sm:p-5 lg:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                  {filteredProjects.map((project) => {
                    const statusConfig = getStatusConfig(project.status);
                    const priorityConfig = getPriorityConfig(project.priority);

                    return (
                      <div
                        key={project.id}
                        className="p-5 sm:p-6 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all bg-white group cursor-pointer"
                        onClick={() =>
                          router.push(
                            `/group/${groupData.id}/project/${project.id}`,
                          )
                        }
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex flex-wrap items-center gap-2">
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

                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                          {project.description}
                        </p>

                        <div className="space-y-3 mb-5">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">
                              {project.completedTasks}/{project.totalTasks}{" "}
                              tasks
                            </span>
                            <span className="font-medium text-gray-900">
                              {project.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-full bg-gradient-to-br ${project.lead.color} flex items-center justify-center text-white text-xs font-medium`}
                            >
                              {project.lead.avatar}
                            </div>
                            <span className="text-xs sm:text-sm text-gray-600">
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

        {/* Members Section - Only shown for non-personal groups */}
        {activeSection === "members" && groupData.groupType !== "personal" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 sm:p-5 lg:p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                  Team Members
                </h2>
                <button className="w-full sm:w-auto px-4 sm:px-5 py-2.5 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium">
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </button>
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="p-4 sm:p-5 lg:p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br  flex items-center justify-center text-white font-medium text-base flex-shrink-0`}
                      >
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-base sm:text-lg text-gray-900 truncate">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6">
                      <div className="text-left sm:text-right">
                        <div className="flex items-center gap-2 mb-1.5">
                          {member.role === "owner" && (
                            <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-md text-xs font-medium">
                              Owner
                            </span>
                          )}
                          {member.role === "admin" && (
                            <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-md text-xs font-medium">
                              Admin
                            </span>
                          )}
                          {member.role === "member" && (
                            <span className="px-3 py-1.5 bg-gray-50 text-gray-700 border border-gray-200 rounded-md text-xs font-medium">
                              Member
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {member.taskCount} tasks assigned
                        </p>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg flex-shrink-0 transition-colors">
                        <MoreVertical className="w-5 h-5" />
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
          <div className="space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Group Information */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5 sm:mb-6">
                Group Information
              </h3>
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2.5">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setEdits((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2.5">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base resize-none"
                  />
                </div>
                <div className="pt-2">
                  <button
                    disabled={!name || updatePending}
                    onClick={handleUpdateGroup}
                    className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3
             bg-indigo-600 text-white rounded-lg
             hover:bg-indigo-700 transition-colors
             font-medium text-sm sm:text-base
             flex items-center justify-center gap-2
             disabled:opacity-70"
                  >
                    {updatePending ? (
                      <>
                        <Loader className="w-5 h-5 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Invitation Link - Only shown for non-personal groups */}
            {groupData.groupType !== "personal" && (
              <div className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 lg:p-8 shadow-sm">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">
                  Invitation Link
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                  Share this link to invite new members to your group
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={invitationLink?.invitationLink || ""}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 text-sm sm:text-base"
                  />
                  <button
                    onClick={handleCopyInviteLink}
                    className="px-5 sm:px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 font-medium whitespace-nowrap text-sm sm:text-base"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
                        Copy Link
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-white rounded-xl border-2 border-red-200 p-5 sm:p-6 lg:p-8 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-red-900 mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                Danger Zone
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6">
                Once you delete this group, all projects and data will be
                permanently removed. This action cannot be undone.
              </p>
              <button
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                onClick={() => setShowDeleteGroupModal(true)}
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
      {isInviteOpen && groupData.groupType !== "personal" && (
        <InviteModal
          isInviteOpen={isInviteOpen}
          setIsInviteOpen={setIsInviteOpen}
          inviteLink={invitationLink?.invitationLink || ""}
        />
      )}
      {showDeleteGroupModal && (
        <DeleteGroupModal
          setShowDeleteGroupModal={setShowDeleteGroupModal}
          groupId={groupId}
        />
      )}
    </div>
  );
};

export default TaskoraGroupPage;
