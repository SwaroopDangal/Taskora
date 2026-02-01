"use client";

import React, { useState } from "react";
import { Loader2, FolderPlus } from "lucide-react";
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
import useUpdateProject from "@/hooks/useUpdateProject";
import useGetProjectById from "@/hooks/useGetProjectById";

export default function UpdateProjectModal({
  isOpen,
  setIsOpen,
  groupId,
  projectId,
}) {
  const [edits, setEdits] = useState({});

  const { projectUpdateMutation, updatePending } = useUpdateProject(setIsOpen);
  const { projectByIdData } = useGetProjectById(groupId, projectId);
  const name = edits.name ?? projectByIdData?.name ?? "";
  const description = edits.description ?? projectByIdData?.description ?? "";
  const dueDate = edits.dueDate ?? projectByIdData?.dueDate.split("T")[0] ?? "";
  const status = edits.status ?? projectByIdData?.status ?? "";
  const priority = edits.priority ?? projectByIdData?.priority ?? "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name,
      description,
      dueDate,
      status,
      priority,
      groupId,
      projectId,
    };

    projectUpdateMutation(payload);
  };

  const isFormValid = name && description && dueDate && status && priority;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-emerald-600" />
            Update Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="project-name">
              Project Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="project-name"
              type="text"
              placeholder="Enter project name"
              value={name}
              onChange={(e) =>
                setEdits((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your project..."
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
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
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

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
              disabled={updatePending}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={updatePending || !isFormValid}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
            >
              {updatePending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
