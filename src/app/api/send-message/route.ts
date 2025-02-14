import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    const { uniqueLink, message } = await req.json();

    console.log("Received data:", { uniqueLink, message }); // Log for debugging

    if (!uniqueLink || !message) {
      return NextResponse.json(
        { error: "Missing required fields: uniqueLink or message" },
        { status: 400 }
      );
    }

    // Your database and message saving logic here
    await connectDB();
    const user = await User.findOne({ uniqueLink });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const newMessage = new Message({
      userId: user._id,
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
