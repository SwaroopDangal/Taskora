import connectDB from "@/lib/db";
import Project from "@/models/Project";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";

//NOTE:create project inside group

export const POST = async (request, { params }) => {
  const { groupId } = await params;
  const { user, error } = await protectRoute();
  if (error) return error;
  const {
    name,
    description,
    projectType = "group",
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
    const project = await Project.create({
      name,
      description,
      projectType,
      dueDate,
      status,
      priority,
      group: groupId,
      role: [{ user: user._id, role: "creator" }],
    });
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
    }).populate("role.user");
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching projects" },
      { status: 500 }
    );
  }
};
