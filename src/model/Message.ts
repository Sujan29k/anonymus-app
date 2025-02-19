import mongoose, { Document, Schema } from "mongoose";
import { ReactNode } from "react";

export interface IMessage extends Document {
  content: ReactNode;
  timestamp: string | number | Date;
  userId: mongoose.Schema.Types.ObjectId;
  senderName?: string; // Optional field for fake name
  message: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  senderName: { type: String, default: "Anonymous" }, // Default to "Anonymous" if not provided
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);

export default MessageModel;
