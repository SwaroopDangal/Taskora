import { protectRoute } from "@/lib/protectRoute";
import Group from "@/models/Group";
import { NextResponse } from "next/server";

// GET MY ROLE IN GROUP
export async function GET(req, { params }) {
    const { groupId } = await params;
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

        return NextResponse.json(
            { role: member.role },
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