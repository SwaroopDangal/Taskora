import connectDB from "@/lib/db";
import Group from "@/models/Group";
import GroupInvite from "@/models/GroupInvite";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";

export const GET = async (req, { params }) => {
    await connectDB();

    const { token } = await params;

    const { user, error } = await protectRoute();
    if (error) return error;

    try {
        const invite = await GroupInvite.findOne({ token });
        if (!invite) {
            return NextResponse.json(
                { message: "Invitation link not found" },
                { status: 404 }
            );
        }

        if (invite.expiresAt < new Date()) {
            return NextResponse.json(
                { message: "Invitation link expired" },
                { status: 410 }
            );
        }

        const group = await Group.findById(invite.groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" },
                { status: 404 }
            );
        }
        if (group.groupType === "personal")
            return NextResponse.json(
                { message: "You cannot enter into a personal group" },
                { status: 403 }
            );

        const existingMember = await Group.findOne({
            _id: invite.groupId,
            "members.user": user._id,
        });

        if (existingMember) {
            return NextResponse.json(
                { message: "You are already a member of this group" },
                { status: 409 }
            );
        }

        await Group.updateOne(
            { _id: invite.groupId },
            {
                $push: {
                    members: {
                        user: user._id,
                        role: "member",
                    },
                },
            }
        );


        return NextResponse.json(
            { message: "Invitation accepted successfully" },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { message: "Error accepting invitation" },
            { status: 500 }
        );
    }
};
