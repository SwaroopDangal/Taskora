import mongoose from "mongoose";
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: String,



    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    dueDate: {
      type: Date,
      default: null,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "On Hold", "Completed"],
      default: "active",
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
