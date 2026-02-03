import connectDB from "@/lib/db";
import Group from "@/models/Group";
import { NextResponse } from "next/server";
import { protectRoute } from "@/lib/protectRoute";

/* ======================================================
   NOTE: CREATE GROUP
====================================================== */
export const POST = async (request) => {
  const { user, error } = await protectRoute();
  if (error) return error;

  const formData = await request.formData();
  const name = formData.get("name");
  const description = formData.get("description");
  const imageUrl = formData.get("imgUrl"); // frontend key
  const groupType = formData.get("groupType");

  if (!name || !groupType) {
    return NextResponse.json(
      { message: "Fields are required" },
      { status: 400 }
    );
  }

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
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error creating group" },
      { status: 500 }
    );
  }
};

/* ======================================================
   NOTE: GET ALL MY GROUPS
====================================================== */
export const GET = async () => {
  const { user, error } = await protectRoute();
  if (error) return error;

  try {
    await connectDB();

    const groups = await Group.find({
      members: { $elemMatch: { user: user._id } },
    })
      .populate("members.user", "_id name email")
      .populate("tasks", "_id name status dueDate");

    return NextResponse.json(groups, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Error fetching groups" },
      { status: 500 }
    );
  }
};
