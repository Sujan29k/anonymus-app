import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function GET(req: Request) {
  console.log("Fetching messages...");

  try {
    await connectDB();

    const url = new URL(req.url);
    const uniqueLink = url.searchParams.get("uniqueLink");

    if (!uniqueLink) {
      console.log("Missing uniqueLink in request");
      return NextResponse.json(
        { error: "Missing unique link" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ uniqueLink });
    if (!user) {
      console.log("User not found for uniqueLink:", uniqueLink);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const messages = await Message.find({ userId: user._id })
      .select("senderName message createdAt") // Include senderName in response
      .sort({ createdAt: -1 }); // Sort messages by newest first

    console.log("Messages fetched:", messages);

    return NextResponse.json({ messages }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
