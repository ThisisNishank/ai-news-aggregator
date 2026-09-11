import mongoose, { Model, Schema } from "mongoose";

export type UserPreferenceDocument = {
  userId: string;
  categories: string[];
  language: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
};

const userPreferenceSchema = new Schema<UserPreferenceDocument>(
  {
    userId: {
  type: String,
  required: true,
  unique: true,
    },
    categories: {
      type: [String],
      default: [],
    },
    language: {
      type: String,
      default: "en",
    },
    country: {
      type: String,
      default: "in",
    },
  },
  {
    timestamps: true,
  },
);

const UserPreference: Model<UserPreferenceDocument> =
  mongoose.models.UserPreference ||
  mongoose.model<UserPreferenceDocument>(
    "UserPreference",
    userPreferenceSchema,
  );

export default UserPreference;