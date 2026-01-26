const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    description: String,

    projectType: {
      type: String,
      enum: ["personal", "group"],
      required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    role: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: {
          type: String,
          enum: ["admin", "member", "creator"],
          default: "member",
        },
      },
    ],
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task",
      },
    ],
    dueDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["active", "On Hold", "Completed"],
      default: "active",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
