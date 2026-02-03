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

    if (!name || !dueDate || !status || !priority) {
        return NextResponse.json(
            { message: "Fields are required" },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        /* -------------------- GROUP CHECK -------------------- */
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }

        const member = group.members.find(
            (m) => m.user.toString() === user._id.toString()
        );

        if (!member) {
            return NextResponse.json(
                { message: "You are not part of this group" },
                { status: 403 }
            );
        }

        /* -------------------- PROJECT CHECK -------------------- */
        const project = await Project.findOne({
            _id: projectId,
            group: groupId,
        });

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        /* -------------------- CREATE TASK -------------------- */
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
    } catch (err) {
        console.error(err);
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
                { message: "Group not found" },
                { status: 404 }
            );
        }

        const member = group.members.find(
            (m) => m.user.toString() === user._id.toString()
        );

        if (!member) {
            return NextResponse.json(
                { message: "You are not part of this group" },
                { status: 403 }
            );
        }

        const project = await Project.findById(projectId)
            .populate("tasks", "_id name status priority dueDate")
            .lean();

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(project, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Error fetching project" },
            { status: 500 }
        );
    }
};


// NOTE: update project by id
export const PUT = async (request, { params }) => {
    const { groupId, projectId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;

    const { name, description, dueDate, status, priority } =
        await request.json();

    if (!name || !dueDate || !status || !priority) {
        return NextResponse.json(
            { message: "Fields are required" },
            { status: 400 }
        );
    }

    try {
        await connectDB();

        /* -------------------- GROUP CHECK -------------------- */
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }

        const member = group.members.find(
            (m) => m.user.toString() === user._id.toString()
        );

        if (!member) {
            return NextResponse.json(
                { message: "You are not part of this group" },
                { status: 403 }
            );
        }

        /* -------------------- PROJECT CHECK -------------------- */
        const project = await Project.findOne({
            _id: projectId,
            group: groupId,
        });

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        /* -------------------- AUTHORIZATION -------------------- */
        const isGroupAdmin = member.role === "admin";

        const isProjectAdmin = project.admin.toString() === user._id.toString();
        if (!isGroupAdmin && !isProjectAdmin) {
            return NextResponse.json(
                { message: "You are not authorized to update this project" },
                { status: 403 }
            );
        }

        /* -------------------- UPDATE -------------------- */
        project.set({
            name,
            description,
            dueDate,
            status,
            priority,
        });

        await project.save();

        return NextResponse.json(project, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Error updating project" },
            { status: 500 }
        );
    }
};


// NOTE: delete project by id
export const DELETE = async (request, { params }) => {
    const { groupId, projectId } =await params;
    const { user, error } = await protectRoute();
    if (error) return error;

    try {
        await connectDB();

        /* -------------------- GROUP CHECK -------------------- */
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }

        const member = group.members.find(
            (m) => m.user.toString() === user._id.toString()
        );

        if (!member) {
            return NextResponse.json(
                { message: "You are not part of this group" },
                { status: 403 }
            );
        }

        /* -------------------- PROJECT CHECK -------------------- */
        const project = await Project.findOne({
            _id: projectId,
            group: groupId,
        });

        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        /* -------------------- AUTHORIZATION -------------------- */
        const isGroupAdmin = member.role === "admin";

        const isProjectAdmin = project.admin.toString() === user._id.toString();

        if (!isGroupAdmin && !isProjectAdmin) {
            return NextResponse.json(
                { message: "You are not authorized to delete this project" },
                { status: 403 }
            );
        }

        /* -------------------- DELETE -------------------- */
        await Project.deleteOne({ _id: projectId });
        await Task.deleteMany({ project: projectId });

        group.projects.pull(projectId);
        await group.save();

        return NextResponse.json(
            { message: "Project deleted" },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Error deleting project" },
            { status: 500 }
        );
    }
};
