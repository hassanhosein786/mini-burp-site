import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scan",
      required: true,
      index: true
    },
    url: { type: String, required: true },
    statusCode: Number,
    headers: { type: Map, of: String },
    links: [String],
    forms: [
      {
        action: String,
        method: String,
        inputs: [
          {
            name: String,
            type: String
          }
        ]
      }
    ],
    cookies: [
      {
        name: String,
        httpOnly: Boolean,
        secure: Boolean,
        sameSite: String,
        raw: String
      }
    ]
  },
  { timestamps: true }
);

pageSchema.index({ scanId: 1, url: 1 }, { unique: true });

export const Page = mongoose.model("Page", pageSchema);

