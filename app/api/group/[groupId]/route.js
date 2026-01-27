import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";
import Group from "@/models/Group";

//NOTE:create project inside group

export const POST = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  const {
    name,
    description,
    dueDate,
    status,
    priority,
  } = await request.json();
  if (!name || !status || !priority || !dueDate)
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
    const project = await Project.create({
      name,
      description,
      dueDate,

      priority,
      group: groupId,
      role: [{ user: user._id, role: "creator" }],
    });

    group.projects.push(project._id);
    await group.save();
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating project" },
      { status: 500 }
    );
  }
};

//NOTE:  get all projects inside group
export const GET = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  try {
    await connectDB();
    const projects = await Project.find({
      group: groupId,
    }).populate("role.user", "_id name email")
      .populate("group", "_id name description imageUrl groupType")
      .lean();
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching projects" },
      { status: 500 }
    );
  }
};
