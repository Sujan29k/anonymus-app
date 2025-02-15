import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { uniqueLink, senderName, message } = await req.json();

    // Log the received data for debugging
    console.log("Received data:", { uniqueLink, senderName, message });

    if (!uniqueLink || !message) {
      return NextResponse.json(
        { error: "Missing required fields: uniqueLink or message" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Find the user by unique link
    const user = await User.findOne({ uniqueLink });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create a new message with the provided senderName or default to "Anonymous"
    const newMessage = new Message({
      userId: user._id,
      senderName: senderName || "Anonymous",
      message,
    });
    console.log("Message to be saved:", newMessage);
    // Save the message to the database
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
