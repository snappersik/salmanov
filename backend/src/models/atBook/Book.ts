import mongoose, { Schema } from "mongoose";

interface IBook {
  title: string;
}

const bookSchema = new Schema<IBook>({
  title: {
    type: String,
    required: true,
  },
});

export const Book = mongoose.model<IBook>("Book", bookSchema);
