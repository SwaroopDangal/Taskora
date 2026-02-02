import { protectRoute } from "@/lib/protectRoute";
import Group from "@/models/Group";
import Project from "@/models/Project";
import { NextResponse } from "next/server";

// GET MY ROLE IN PROJECT
export async function GET(req, { params }) {
    const { groupId, projectId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;
    try {
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" }, { status: 404 });
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

        if (member.role === "admin") {
            return NextResponse.json(
                { role: "groupAdmin" },
                { status: 200 }
            );
        }
        const project = await Project.findOne({
            _id: projectId,
            group: groupId,
        })
        if (!project) {
            return NextResponse.json(
                { message: "Project not found" }, { status: 404 });
        }
        if (user._id.toString() === project.admin.toString()) {
            return NextResponse.json(
                { role: "admin" },
                { status: 200 }
            );
        }
        return NextResponse.json(
            { role: "member" },
            { status: 200 }
        );

    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { message: "Error fetching group role" },
            { status: 500 }
        );

    }
}