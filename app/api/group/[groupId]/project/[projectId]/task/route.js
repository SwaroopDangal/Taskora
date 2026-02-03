import connectDB from "@/lib/db";
import Task from "@/models/Task";
import Project from "@/models/Project";
import Group from "@/models/Group";
import { protectRoute } from "@/lib/protectRoute";
import { NextResponse } from "next/server";


// NOTE: get all tasks under a project in a group
export const GET = async (request, { params }) => {
    const { groupId, projectId } = await params;

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
                { message: "You are not a member of this group" },
                { status: 403 }
            );
        }

        /* -------------------- PROJECT CHECK -------------------- */
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { message: "Project not found" },
                { status: 404 }
            );
        }

        /* -------------------- FETCH TASKS -------------------- */
        const tasks = await Task.find({
            project: projectId,
            group: groupId,
        })
            .populate("assignedTo", "_id name email profileImage")
            .populate("createdBy", "_id name email profileImage")
            .lean();

        return NextResponse.json(tasks, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Error fetching tasks" },
            { status: 500 }
        );
    }
};

