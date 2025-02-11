// src/models/Message.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export default MessageModel;
