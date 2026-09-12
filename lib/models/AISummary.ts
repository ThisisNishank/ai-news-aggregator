import mongoose, { Model, Schema } from "mongoose";

export type AISummaryDocument = {
  articleId: string;
  title: string;
  description: string;
  summary: string;
  keyTakeaways: string[];
  createdAt: Date;
  updatedAt: Date;
};

const aiSummarySchema = new Schema<AISummaryDocument>(
  {
    articleId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      required: true,
    },
    keyTakeaways: {
      type: [String],
      required: true,
      validate: {
        validator: (takeaways: string[]) => takeaways.length === 3,
        message: "AI summary must contain exactly three key takeaways",
      },
    },
  },
  {
    timestamps: true,
  },
);

const AISummary: Model<AISummaryDocument> =
  mongoose.models.AISummary ||
  mongoose.model<AISummaryDocument>("AISummary", aiSummarySchema);

export default AISummary;