const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    categoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    durationMinutes: { type: Number, required: true }, // duration in minutes
    totalMarks: { type: Number, required: true },
    passingMarks: { type: Number, required: true },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isPublic: { type: Boolean, default: false }, // Public or invite only
    accessCode: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Assessment", assessmentSchema);
