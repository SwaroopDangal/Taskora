"use client";

import React, { useState } from "react";
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
import useCreateTask from "@/hooks/useCreateTask";
import useGetGroupById from "@/hooks/useGetGroupById";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function CreateTaskModal({
  isOpen,
  setIsOpen,
  groupId,
  projectId,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);

  const { createTaskMutation, isPending } = useCreateTask({
    setIsOpen,
    groupId: groupId,
    projectId: projectId,
  });

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

    const payload = {
      name,
      description,
      dueDate,
      status,
      priority,
      assignedTo,
      groupId,
      projectId,
    };

    createTaskMutation(payload);

    setName("");
    setDescription("");
    setDueDate("");
    setStatus("");
    setPriority("");
    setAssignedTo("");
  };

  const isFormValid =
    name && dueDate && status && priority && assignedTo.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-semibold flex items-center gap-2">
            <CheckSquare className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
            Create New Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-5 py-3 sm:py-4">
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
              onChange={(e) => setName(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
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
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          {/* Status & Priority - Two columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">
                Status <span className="text-red-500">*</span>
              </Label>
              <Select value={status} onValueChange={setStatus}>
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
              <Select value={priority} onValueChange={setPriority}>
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
              <PopoverContent
                className="w-[calc(100vw-2rem)] sm:w-80 p-0"
                align="start"
              >
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
                          setAssignedTo((prev) =>
                            prev.includes(member.id)
                              ? prev.filter((id) => id !== member.id)
                              : [...prev, member.id],
                          );
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
                      onClick={() => setAssignedTo([])}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-3 sm:pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 w-full"
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isPending || !isFormValid}
              className="flex-1 w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
