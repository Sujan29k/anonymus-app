import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { uniqueLink, message } = await req.json();

    console.log("Received request:", { uniqueLink, message });

    if (!uniqueLink || !message) {
      return NextResponse.json(
        { error: "Invalid request. Missing data." },
        { status: 400 }
      );
    }

    const user = await User.findOne({ uniqueLink });

    if (!user) {
      console.error("User not found for uniqueLink:", uniqueLink);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newMessage = new Message({
      userId: user._id,
      message,
      timestamp: new Date(),
    });

    await newMessage.save();

    console.log("Message saved successfully:", newMessage);
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error in /api/send-message:", error);
    return NextResponse.json(
      { error: "Failed to send the message" },
      { status: 500 }
    );
  }
}
