import connectDB from "@/lib/db";
import { protectRoute } from "@/lib/protectRoute";
import Group from "@/models/Group";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { NextResponse } from "next/server";

/* ======================================================
   NOTE: GET GROUP BY ID
   Any group member
====================================================== */
export const GET = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;

  try {
    await connectDB();

    const group = await Group.findById(groupId)
      .populate("projects", "_id name description status dueDate priority")
      .populate("members.user", "name email profileImage")
      .populate("tasks", "_id name description status dueDate assignedTo priority");

    if (!group) {
      return NextResponse.json(
        { message: "Group not found" },
        { status: 404 }
      );
    }

    const member = group.members.find(
      (m) => m.user._id.toString() === user._id.toString()
    );

    if (!member) {
      return NextResponse.json(
        { message: "You are not part of this group" },
        { status: 403 }
      );
    }

    return NextResponse.json(group, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching group" },
      { status: 500 }
    );
  }
};

/* ======================================================
   NOTE: UPDATE GROUP
   Group admin only
====================================================== */
export const PUT = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;

  const { name, description } = await request.json();
  if (!name) {
    return NextResponse.json(
      { message: "Fields are required" },
      { status: 400 }
    );
  }

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

    if (!member || member.role !== "admin") {
      return NextResponse.json(
        { message: "You are not an admin of this group" },
        { status: 403 }
      );
    }

    const updatedGroup = await Group.findByIdAndUpdate(
      groupId,
      { name, description },
      { new: true }
    );

    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error updating group" },
      { status: 500 }
    );
  }
};

/* ======================================================
   NOTE: DELETE GROUP
   Group admin only
====================================================== */
export const DELETE = async (request, { params }) => {
  const { groupId } = await params;
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

    if (!member || member.role !== "admin") {
      return NextResponse.json(
        { message: "You are not an admin of this group" },
        { status: 403 }
      );
    }

    await Project.deleteMany({ group: groupId });
    await Task.deleteMany({ group: groupId });
    await Group.findByIdAndDelete(groupId);

    return NextResponse.json(
      { message: "Group deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error deleting group" },
      { status: 500 }
    );
  }
};
