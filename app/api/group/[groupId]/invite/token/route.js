import connectDB from "@/lib/db";
import Group from "@/models/Group";
import GroupInvite from "@/models/GroupInvite";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";
import crypto from "crypto";

export const GET = async (req, res) => {
    connectDB();
    const groupId = await req.params.groupId;
    const token = await req.params.token;
    const { user, error } = await protectRoute();
    if (error) return error;
    try {
        const invite = await GroupInvite.findOne({ token });
        if (!invite) {
            return NextResponse.json(
                { message: "Invitation link not found" }, { status: 404 });
        }
        if (invite.expiresAt < new Date()) {
            return NextResponse.json(
                { message: "Invitation link expired" }, { status: 404 });
        }
        const group = await Group.findById(invite.groupId);
        if (!group) {
            return NextResponse.json(
                { message: "Group not found" }, { status: 404 });
        }
        const existingMember = await Group.findOne({
            _id: groupId,
            members: user._id,
        });
        if (existingMember) {
            return NextResponse.json(
                { message: "You are already a member of this group" }, { status: 404 });
        }
        await Group.updateOne(
            { _id: groupId },
            { $push: { members: user._id } }
        );
        return NextResponse.json({ message: "Invitation accepted" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Error accepting invitation" }, { status: 500 });
    }
};