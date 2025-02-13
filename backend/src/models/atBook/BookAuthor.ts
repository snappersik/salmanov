import mongoose, { Schema } from "mongoose";

interface IBookAuthor {
  book: string[];
  author: string[];
}

const bookAuthorSchema = new Schema<IBookAuthor>({
  book: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
  ],
  author: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
  ],
});

export const BookAuthor = mongoose.model<IBookAuthor>(
  "BookAuthor",
  bookAuthorSchema
);
