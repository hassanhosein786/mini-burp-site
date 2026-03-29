import mongoose from "mongoose";

const findingSchema = new mongoose.Schema(
  {
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true
    },
    pageUrl: { type: String, required: true },
    groupKey: { type: String, required: true },
    type: { type: String, required: true },
    severity: {
      type: String,
      enum: ["info", "low", "medium", "high"],
      default: "info"
    },
    targetScope: {
      type: String,
      enum: ["page", "host"],
      default: "page"
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    evidence: mongoose.Schema.Types.Mixed,
    remediation: { type: String, required: true },
    affectedPages: [String]
  },
  { timestamps: true }
);

findingSchema.index({ scanId: 1, type: 1, groupKey: 1 }, { unique: true });

export const Finding = mongoose.model("Finding", findingSchema);
