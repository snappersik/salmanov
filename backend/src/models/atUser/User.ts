import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
  name: string;
  login: string;
  password: string;
  role?: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  login: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
});

export const User = mongoose.model<IUser>("User", userSchema);
