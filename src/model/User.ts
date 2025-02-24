import mongoose, { Document, Schema } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  uniqueLink: string;
  receivingMessages: boolean;
}

const UserSchema = new Schema<IUser>({
  name: String,
  email: { type: String, unique: true },
  password: String,
  uniqueLink: { type: String, unique: true },
  receivingMessages: { type: Boolean, default: true },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
