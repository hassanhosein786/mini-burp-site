import mongoose from "mongoose";

const scanSchema = new mongoose.Schema(
  {
    baseUrl: { type: String, required: true, trim: true },
    allowedHost: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["queued", "running", "completed", "failed"],
      default: "queued"
    },
    config: {
      maxDepth: { type: Number, default: 2 },
      maxPages: { type: Number, default: 25 },
      activeChecks: { type: Boolean, default: true }
    },
    stats: {
      pagesVisited: { type: Number, default: 0 },
      findingsCount: { type: Number, default: 0 }
    },
    startedAt: Date,
    completedAt: Date,
    errorMessage: String
  },
  { timestamps: true }
);

export const Scan = mongoose.model("Scan", scanSchema);

