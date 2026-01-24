import { serve } from "inngest/next";
import { deleteUserFromDB, inngest, syncUser } from "@/lib/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [syncUser, deleteUserFromDB],
});
