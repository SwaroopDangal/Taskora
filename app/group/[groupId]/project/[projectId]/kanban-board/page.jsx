"use client";

import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useGetTask from "@/hooks/useGetTask";
import { axiosInstance } from "@/lib/axios";
import CreateTaskModal from "@/components/CreateTaskModal";
import useGetMyRoleInProject from "@/hooks/useGetMyRoleInProject";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import Loading from "@/components/Loader";
import ProtectRoute from "@/components/ProtectRoute";
import useGetMyRoleInGroup from "@/hooks/useGetMyRoleInGroup";

const COLUMN_ORDER = ["todo", "in-progress", "completed"];

const KanbanBoard = () => {
  const { groupId, projectId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const { myRoleInGroup } = useGetMyRoleInGroup(groupId);
  const { myRoleInProject, roleLoading } = useGetMyRoleInProject(
    groupId,
    projectId,
  );
  const isAdmin =
    myRoleInProject?.role === "admin" || myRoleInProject?.role === "groupAdmin";

  const {
    taskData = [],
    taskLoading,
    refetch,
  } = useGetTask(groupId, projectId);
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  const [draggedTask, setDraggedTask] = useState(null);

  /* ---------------- BUILD COLUMNS FROM TASKS ---------------- */
  const columns = useMemo(() => {
    return {
      todo: {
        name: "To Do",
        items: taskData.filter((t) => t.status === "todo"),
      },
      "in-progress": {
        name: "In Progress",
        items: taskData.filter((t) => t.status === "in-progress"),
      },
      completed: {
        name: "Completed",
        items: taskData.filter((t) => t.status === "completed"),
      },
    };
  }, [taskData]);

  /* ---------------- DRAG & DROP ---------------- */
  const handleDragStart = (task) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const isAssigned = draggedTask.assignedTo.some(
      (member) => member._id.toString() === myRoleInProject?.userId?.toString(),
    );
    const isCreator =
      draggedTask.createdBy.toString() === myRoleInProject?.userId?.toString();

    if (!isAdmin && !isAssigned && !isCreator) {
      return toast.error("You are not authorized to update this task");
    }

    if (!draggedTask || draggedTask.status === newStatus) return;

    await axiosInstance.patch(
      `/group/${groupId}/project/${projectId}/task/${draggedTask._id}`,
      { status: newStatus },
    );

    setDraggedTask(null);
    refetch();
  };

  /* ---------------- DELETE TASK ---------------- */
  const removeTask = async (task) => {
    const isAssigned = task.assignedTo.some(
      (member) => member._id.toString() === myRoleInProject?.userId?.toString(),
    );
    const isCreator =
      task.createdBy.toString() === myRoleInProject?.userId?.toString();

    if (!isAdmin && !isAssigned && !isCreator) {
      return toast.error("You are not authorized to delete this task");
    }

    await axiosInstance.delete(
      `/group/${groupId}/project/${projectId}/task/${task._id}`,
    );
    toast.success("Task deleted successfully");
    refetch();
  };

  /* ---------------- UI STYLES ---------------- */
  const columnStyles = {
    todo: {
      header: "bg-gradient-to-r from-emerald-600 to-emerald-400",
      badge: "bg-emerald-100 text-emerald-700",
      colBg: "bg-emerald-50",
      border: "border-emerald-200",
      cardHover: "hover:border-emerald-300",
      emptyText: "text-emerald-300",
      dot: "bg-emerald-400",
    },
    "in-progress": {
      header: "bg-gradient-to-r from-teal-600 to-teal-400",
      badge: "bg-teal-100 text-teal-700",
      colBg: "bg-teal-50",
      border: "border-teal-200",
      cardHover: "hover:border-teal-300",
      emptyText: "text-teal-300",
      dot: "bg-teal-400",
    },
    completed: {
      header: "bg-gradient-to-r from-emerald-600 to-teal-600",
      badge: "bg-emerald-100 text-teal-700",
      colBg: "bg-slate-50",
      border: "border-slate-200",
      cardHover: "hover:border-teal-300",
      emptyText: "text-slate-300",
      dot: "bg-teal-500",
    },
  };

  if (taskLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin mb-4" />
        <p className="text-gray-400 text-sm font-medium">Loading tasks...</p>
      </div>
    );
  }

  return (
    <ProtectRoute myRoleInGroup={myRoleInGroup}>
      <div className="p-6 min-h-screen bg-white">
        {/* Header */}
        <div className="max-w-5xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          {/* Left — icon + title + subtitle (unchanged) */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-sm">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="18" rx="1" />
                  <rect x="14" y="3" width="7" height="12" rx="1" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Kanban Board</h1>
            </div>
            <p className="text-gray-400 text-sm ml-12">
              Drag and drop tasks to update their status
            </p>
          </div>

          {/* Right — Create Task button */}
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-br from-emerald-600 to-teal-600 text-white text-sm font-semibold shadow-sm hover:shadow-md hover:from-emerald-700 hover:to-teal-700 active:scale-[0.96] transition-all whitespace-nowrap"
            onClick={() => setIsOpen(true)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Task
          </button>
        </div>

        {/* Columns */}
        <div className="flex flex-col lg:flex-row gap-5 lg:overflow-x-auto pb-6 max-w-5xl mx-auto">
          {COLUMN_ORDER.map((columnId) => (
            <div
              key={columnId}
              className={`w-full lg:w-80 lg:shrink-0 rounded-xl border ${columnStyles[columnId].border} ${columnStyles[columnId].colBg} shadow-sm`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, columnId)}
            >
              {/* Column Header */}
              <div
                className={`p-4 rounded-t-xl ${columnStyles[columnId].header}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold text-sm tracking-wide uppercase">
                    {columns[columnId].name}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${columnStyles[columnId].badge}`}
                  >
                    {columns[columnId].items.length}
                  </span>
                </div>
              </div>

              {/* Task List */}
              <div className="p-3 min-h-[280px]">
                {columns[columnId].items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-gray-200 mt-2">
                    <p
                      className={`text-xs font-medium ${columnStyles[columnId].emptyText}`}
                    >
                      Drop tasks here
                    </p>
                  </div>
                ) : (
                  columns[columnId].items.map((task) => {
                    console.log(task);
                    return (
                      <div
                        key={task._id}
                        draggable
                        onDragStart={() => handleDragStart(task)}
                        className={`group flex items-center justify-between p-3.5 mb-2.5 bg-white border border-gray-200 ${columnStyles[columnId].cardHover} rounded-lg shadow-sm cursor-grab active:cursor-grabbing hover:shadow-md transition-all`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-2 h-2 rounded-full ${columnStyles[columnId].dot}`}
                          />
                          <span className="text-gray-700 text-sm font-medium truncate">
                            {task.name}
                          </span>

                          {/* Profile Images */}
                          {task.assignedTo && task.assignedTo.length > 0 && (
                            <div className="flex -space-x-2">
                              {task.assignedTo.map((person, index) => (
                                <img
                                  key={index}
                                  src={person.profileImage}
                                  alt={person.name || "Assigned user"}
                                  className="w-6 h-6 rounded-full border-2 border-white object-cover"
                                  title={person.name}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => removeTask(task)}
                          className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Create Task Modal */}
        {isOpen && (
          <CreateTaskModal
            isOpen={isOpen}
            groupId={groupId}
            projectId={projectId}
            setIsOpen={setIsOpen}
          />
        )}
      </div>
    </ProtectRoute>
  );
};

export default KanbanBoard;
