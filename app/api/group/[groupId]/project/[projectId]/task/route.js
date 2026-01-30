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
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" }, { status: 404 });
        }
        const project = await Project.findById(projectId);
        if (!project) {
            return NextResponse.json(
                { message: "Project not found" }, { status: 404 });
        }
        const tasks = await Task.find({
            project: projectId,
            group: groupId,
        }).populate("assignedTo", "_id name email profileImage")
            .populate("createdBy", "_id name email profileImage")
            .lean();

        return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching tasks" },
            { status: 500 }
        );
    }
};