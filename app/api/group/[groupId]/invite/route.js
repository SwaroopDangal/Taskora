import connectDB from "@/lib/db";
import Group from "@/models/Group";
import GroupInvite from "@/models/GroupInvite";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";
import crypto from "crypto";

export const GET = async (req, { params }) => {
    connectDB();
    const { groupId } = await params;
    const { user, error } = await protectRoute();
    if (error) return error;
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    try {
        const existingInvite = await GroupInvite.findOne({ groupId }).sort({
            createdAt: -1,
        });
        if (existingInvite && existingInvite.expiresAt > new Date()) {
            return NextResponse.json({
                invitationLink: `${process.env.CLIENT_URL}/group/${groupId}/invite/${existingInvite.token}`,
            }, { status: 200 });
        }
        const group = await Group.findById(groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" }, { status: 404 });
        }
        if (group.groupType === "personal")
            return NextResponse.json(
                { message: "You cannot invite members to a personal group" }, { status: 200 });


        const invite = await GroupInvite.create({
            groupId,
            token,
            expiresAt,
        });

        return NextResponse.json({
            invitationLink: `${process.env.CLIENT_URL}/group/${groupId}/invite/${invite.token}`,
        }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error creating invitation link" }, { status: 500 });
    }
};