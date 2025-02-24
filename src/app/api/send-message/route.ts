import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { uniqueLink, senderName, message } = await req.json();

    if (!uniqueLink || !message) {
      return NextResponse.json(
        { error: "Missing required fields: uniqueLink or message" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findOne({ uniqueLink });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.receivingMessages) {
      return NextResponse.json(
        { error: "User is not accepting messages at the moment." },
        { status: 403 }
      );
    }

    const newMessage = new Message({
      userId: user._id,
      senderName: senderName || "Anonymous",
      message,
    });

    await newMessage.save();

    return NextResponse.json(
      { success: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
