import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function DELETE(req: Request) {
  try {
    const { messageId, uniqueLink } = await req.json();
    console.log(
      "Deleting message with ID:",
      messageId,
      "for user with uniqueLink:",
      uniqueLink
    );

    if (!messageId || !uniqueLink) {
      return NextResponse.json(
        { error: "Missing required fields: messageId or uniqueLink" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ uniqueLink });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const deletedMessage = await Message.findOneAndDelete({
      _id: messageId,
      userId: user._id,
    });

    if (!deletedMessage) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: "Message deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
