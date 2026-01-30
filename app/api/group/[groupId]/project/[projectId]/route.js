import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Group from "@/models/Group";
import { protectRoute } from "@/lib/protectRoute";
import { NextResponse } from "next/server";

// NOTE: create tasks under a project in a group
export const POST = async (request, { params }) => {
    const { groupId, projectId } = await params;
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
    if (!name || !dueDate)
        return NextResponse.json(
            { message: "Fields are required" },
            { status: 400 }
        );
    try {
        await connectDB();
        const group = await Group.findById(groupId);
        console.log(group)
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" }, { status: 404 });
        }
        const project = await Project.findOne({
            _id: projectId,
            group: groupId,
        });
        console.log(project)

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" }, { status: 404 });
        }
        const task = await Task.create({
            name,
            description,
            project: projectId,
            group: groupId,
            createdBy: user._id,
            dueDate,
            status,
            priority,
            assignedTo,
        });
        project.tasks.push(task._id);
        await project.save();
        group.tasks.push(task._id);
        await group.save();
        return NextResponse.json(task, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error creating task" },
            { status: 500 }
        );
    }
};

// NOTE: get project by id
export const GET = async (request, { params }) => {
    const { groupId, projectId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;
    try {
        await connectDB();
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" }, { status: 404 });
        }
        const project = await Project.findById(projectId).populate("tasks _id name status priority dueDate").lean();
        if (!project) {
            return NextResponse.json(
                { message: "Project not found" }, { status: 404 });
        }
        return NextResponse.json(project, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching project" },
            { status: 500 }
        );
    }
};