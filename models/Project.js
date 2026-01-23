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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
