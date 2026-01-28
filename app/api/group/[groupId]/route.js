

//NOTE: GET group BY ID

import connectDB from "@/lib/db";
import { protectRoute } from "@/lib/protectRoute";
import Group from "@/models/Group";
import { NextResponse } from "next/server";

export const GET = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  try {
    await connectDB();
    const group = await Group.findById(groupId)
      .populate("projects", "_id name description status dueDate priority")
      .populate("members", "_id name email profileImage")
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
