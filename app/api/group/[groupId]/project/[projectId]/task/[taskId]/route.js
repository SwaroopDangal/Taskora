import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Group from "@/models/Group";
import { protectRoute } from "@/lib/protectRoute";
import { NextResponse } from "next/server";


// NOTE:get task by Id
export const GET = async (request, { params }) => {
    const { groupId, projectId, taskId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;
    try {
        await connectDB();

        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
            group: groupId,
        }).populate("assignedTo", "_id name email profileImage")
            .populate("createdBy", "_id name email profileImage")
            .lean();
        if (!task) {
            return NextResponse.json(
                { message: "Task not found" }, { status: 404 });
        }
        return NextResponse.json(task, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching task" },
            { status: 500 }
        );
    }
};

// NOTE:update task by Id
export const PUT = async (request, { params }) => {
    const { groupId, projectId, taskId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;


    const {
        name,
        description,
        dueDate,
        status,
        priority,
        assignedTo,
    } = await request.json();
    if (!name || !dueDate || !status || !priority || assignedTo.length === 0)
        return NextResponse.json(
            { message: "Fields are required" },
            { status: 400 }
        );
    try {
        await connectDB();

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, project: projectId, group: groupId },
            { name, description, dueDate, status, priority, assignedTo },
            { new: true }
        );

        if (!updatedTask) {
            return NextResponse.json(
                { message: "Task not found" },
                { status: 404 }
            );
        }
        return NextResponse.json(updatedTask, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error updating task" },
            { status: 500 }
        );
    }
};

// NOTE:delete task by Id
export const DELETE = async (request, { params }) => {
    const { groupId, projectId, taskId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;
    try {
        await connectDB();
        const task = await Task.findOne({
            _id: taskId,
            project: projectId,
            group: groupId,
        });
        if (!task) {
            return NextResponse.json(
                { message: "Task not found" }, { status: 404 });
        }
        await Project.findByIdAndUpdate(projectId, {
            $pull: { tasks: taskId },
        });
        await Group.findByIdAndUpdate(groupId, {
            $pull: { tasks: taskId },
        });
        await Task.deleteOne({ _id: taskId });
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error deleting task" },
            { status: 500 }
        );
    }
};      