import connectDB from "@/lib/db";
import Group from "@/models/Group";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";

//NOTE:create group
export const POST = async (request) => {
  const { user, error } = await protectRoute();
  console.log("USER", user);
  if (error) return error;
  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const imageUrl = formData.get("imgUrl");
  const groupType = formData.get("groupType");
  if (!name)
    return NextResponse.json(
      { message: "Fields are required" },
      { status: 400 }
    );
  try {
    await connectDB();
    const group = await Group.create({
      name,
      description,
      imageUrl,
      groupType,
      members: [{ user: user._id, role: "admin" }],
    });
    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error creating group" },
      { status: 500 }
    );
  }
};

//NOTE:  get all my groups

export const GET = async (request) => {
  const { user, error } = await protectRoute();
  if (error) return error;
  try {
    await connectDB();
    const groups = await Group.find({
      members: { $elemMatch: { user: user._id } },
    }).populate("members.user", "_id name email").populate("tasks", "id name status");
    return NextResponse.json(groups, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching groups" },
      { status: 500 }
    );
  }
};
