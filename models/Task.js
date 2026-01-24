const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },

    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },

    order: { type: Number, default: 0 },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    tags: {
      type: [String],
      default: [],
      index: true,
    },

    dueDate: Date,
  },
  { timestamps: true }
);

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
