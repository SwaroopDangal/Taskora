"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckSquare, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetGroupById from "@/hooks/useGetGroupById";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import useUpdateTask from "@/hooks/useUpdateTask";
import useGetTaskById from "@/hooks/useGetTaskById";

export default function UpdateTaskModal({
  isOpen,
  setIsOpen,
  groupId,
  projectId,
  taskId,
}) {
  const [edits, setEdits] = useState({});
  const { myRoleInProject, roleLoading } = useGetMyRoleInProject(
    groupId,
    projectId,
  );
  const isAdmin =
    myRoleInProject?.role === "admin" || myRoleInProject?.role === "groupAdmin";

  const { taskUpdateMutation, isPending } = useUpdateTask(setIsOpen);
  const { taskByIdData } = useGetTaskById(groupId, projectId, taskId);

  const name = edits.name ?? taskByIdData?.name ?? "";
  const description = edits.description ?? taskByIdData?.description ?? "";
  const dueDate = edits.dueDate ?? taskByIdData?.dueDate.split("T")[0] ?? "";
  const status = edits.status ?? taskByIdData?.status ?? "";
  const priority = edits.priority ?? taskByIdData?.priority ?? "";
  const assignedTo =
    edits.assignedTo ??
    taskByIdData?.assignedTo.map((member) => member._id) ??
    [];
  console.log(dueDate);

  const { groupByIdData, isLoading } = useGetGroupById(groupId);

  let members = [];

  groupByIdData?.members?.map((member) => {
    const payload = {
      id: member.user._id,
      name: member.user.name,
      profileImage: member.user.profileImage,
      role: member.role,
    };
    members.push(payload);
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !isAdmin ||
      !assignedTo.find(
        (member) =>
          member._id.toString() === myRoleInProject?.userId.toString(),
      )
    )
      return toast.error("You are not authorized to update this task");
    if (!name || !dueDate || !status || !priority || assignedTo.length === 0) {
      return;
    }

    const payload = {
      name: edits.name ?? taskByIdData?.name,
      description: edits.description ?? taskByIdData?.description,
      dueDate: edits.dueDate ?? taskByIdData?.dueDate,
      status: edits.status ?? taskByIdData?.status,
      priority: edits.priority ?? taskByIdData?.priority,
      assignedTo,
      groupId,
      projectId,
      taskId,
    };

    taskUpdateMutation(payload);
  };

  const isFormValid =
    name && assignedTo.length > 0 && dueDate && status && priority;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-emerald-600" />
            Update Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Task Name */}
          <div className="space-y-2">
            <Label htmlFor="task-name">
              Task Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="task-name"
              type="text"
              placeholder="Enter task name"
              value={name}
              onChange={(e) =>
                setEdits((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your task..."
              value={description}
              onChange={(e) =>
                setEdits((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="resize-none"
              required
            />
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label htmlFor="due-date">
              Due Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="due-date"
              type="date"
              value={dueDate}
              onChange={(e) =>
                setEdits((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              required
            />
          </div>

          {/* Status & Priority - Two columns */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select
                value={status}
                onValueChange={(e) =>
                  setEdits((prev) => ({ ...prev, status: e }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">
                Priority <span className="text-red-500">*</span>
              </Label>
              <Select
                value={priority}
                onValueChange={(e) =>
                  setEdits((prev) => ({ ...prev, priority: e }))
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assigned To */}
          <div className="space-y-2">
            <Label htmlFor="assigned-to">
              Assigned To <span className="text-red-500">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  {assignedTo.length === 0 ? (
                    <span className="text-muted-foreground">
                      Select team members
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {assignedTo.slice(0, 2).map((id) => {
                        const member = members.find((m) => m.id === id);
                        return member ? (
                          <div
                            key={id}
                            className="flex items-center gap-1.5 bg-secondary px-2 py-0.5 rounded-md"
                          >
                            <img
                              src={member.profileImage}
                              alt={member.name}
                              width={16}
                              height={16}
                              className="rounded-full object-cover"
                            />
                            <span className="text-sm">{member.name}</span>
                          </div>
                        ) : null;
                      })}
                      {assignedTo.length > 2 && (
                        <div className="flex items-center justify-center bg-secondary px-2 py-0.5 rounded-md">
                          <span className="text-sm font-medium">
                            +{assignedTo.length - 2}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="max-h-64 overflow-y-auto p-2">
                  {members.map((member) => {
                    const isSelected = assignedTo.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors hover:bg-accent ${
                          isSelected ? "bg-accent" : ""
                        }`}
                        onClick={() => {
                          const newAssignedTo = assignedTo.includes(member.id)
                            ? assignedTo.filter((id) => id !== member.id)
                            : [...assignedTo, member.id];
                          setEdits((prev) => ({
                            ...prev,
                            assignedTo: newAssignedTo,
                          }));
                        }}
                      >
                        <div className="relative">
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            width={40}
                            height={40}
                            className="rounded-full object-cover border-2 border-background"
                          />
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                              <svg
                                className="w-3 h-3 text-primary-foreground"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path d="M5 13l4 4L19 7"></path>
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {member.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {member.role}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {assignedTo.length > 0 && (
                  <div className="p-2 border-t flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {assignedTo.length} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setEdits((prev) => ({ ...prev, assignedTo: [] }))
                      }
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !isFormValid}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Task"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
