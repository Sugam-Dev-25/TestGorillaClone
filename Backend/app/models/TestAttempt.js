const mongoose = require("mongoose");

const testAttemptSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assessmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assessment",
      required: true,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        selectedAnswer: { type: mongoose.Schema.Types.Mixed },
        isCorrect: { type: Boolean, default: false },
        marksObtained: { type: Number, default: 0 },
      },
    ],
    score: { type: Number, default: 0 },
    totalMarks: { type: Number, required: true },
    status: {
      type: String,
      enum: ["in-progress", "completed", "expired"],
      default: "in-progress",
    },
    isPassed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

module.exports = mongoose.model("TestAttempt", testAttemptSchema);
