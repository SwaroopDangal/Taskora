import mongoose from "mongoose";

const groupInviteSchema = new mongoose.Schema(
    {
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Group",
        },
        token: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
        },
    },
    { timestamps: true }
);


export default mongoose.models.GroupInvite || mongoose.model("GroupInvite", groupInviteSchema);