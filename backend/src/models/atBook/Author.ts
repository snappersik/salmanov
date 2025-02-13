import mongoose, { Schema } from "mongoose";

interface IAuthor {
  firstName: string;
}

const authorSchema = new Schema<IAuthor>({
  firstName: {
    type: String,
    required: true,
  },
});

export const Author = mongoose.model<IAuthor>("Author", authorSchema);
