"use server";
import { auth } from "@clerk/nextjs/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function protectRoute() {
  const { userId } = await auth();
  console.log(userId)

  if (!userId) {
    return {
      error: new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
      }),
    };
  }

  await connectDB();

  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return {
      error: new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
      }),
    };
  }

  return { user };
}
