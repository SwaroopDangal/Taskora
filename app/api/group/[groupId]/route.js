import connectDB from "@/lib/db";
import { protectRoute } from "@/lib/protectRoute";
import Group from "@/models/Group";
import Project from "@/models/Project";
import Task from "@/models/Task";
import { NextResponse } from "next/server";


//NOTE: GET group BY ID

export const GET = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  try {
    await connectDB();
    const group = await Group.findById(groupId)
      .populate("projects", "_id name description status dueDate priority")
      .populate("members.user", "_id name email profileImage")
      .populate("tasks", "_id name description status dueDate priority");
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" }, { status: 404 });
    }
    return NextResponse.json(group, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching group" },
      { status: 500 }
    );
  }
}


//update group BY ID
export const PUT = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  const { name, description } = await request.json();
  if (!name)
    return NextResponse.json(
      { message: "Fields are required" },
      { status: 400 }
    );
  try {
    await connectDB();
    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" }, { status: 404 });
    }
    const updatedGroup = await Group.findByIdAndUpdate(groupId, {
      name,
      description,
    }, { new: true });
    return NextResponse.json(updatedGroup, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error updating group" },
      { status: 500 }
    );
  }
}

// DELETE group BY ID
export const DELETE = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  try {
    await connectDB();
    const group = await Group.findById(groupId);
    if (!group) {
      return NextResponse.json(
        { message: "Group not found" }, { status: 404 });
    }

    await Project.deleteMany({ group: groupId })
    await Task.deleteMany({ group: groupId })
    const deletedGroup = await Group.findByIdAndDelete(groupId);
    return NextResponse.json(deletedGroup, { status: 200 }, { message: "Group deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error deleting group" },
      { status: 500 }
    );
  }
}