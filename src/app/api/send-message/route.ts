import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function POST(req: Request) {
  await connectDB();
  const { uniqueLink, message } = await req.json();

  if (!uniqueLink || !message) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const user = await User.findOne({ uniqueLink });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await Message.create({ userId: user._id, message });
  return NextResponse.json({ success: "Message sent" }, { status: 201 });
}
