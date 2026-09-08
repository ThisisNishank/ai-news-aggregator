import mongoose, { Model, Schema } from "mongoose";

export type SavedArticleDocument = {
  userId: mongoose.Types.ObjectId;
  articleId: string;
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  publishedAt: Date;
  url: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
};

const savedArticleSchema = new Schema<SavedArticleDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    articleId: {
      type: String,
      required: true,
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
    imageUrl: {
      type: String,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    publishedAt: {
      type: Date,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      default: "General",
    },
  },
  {
    timestamps: true,
  },
);

savedArticleSchema.index(
  { userId: 1, articleId: 1 },
  { unique: true },
);

const SavedArticle: Model<SavedArticleDocument> =
  mongoose.models.SavedArticle ||
  mongoose.model<SavedArticleDocument>("SavedArticle", savedArticleSchema);

export default SavedArticle;