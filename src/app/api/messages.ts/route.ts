import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Message from "@/model/Message";
import User from "@/model/User";

export async function GET(req: Request) {
  await connectDB();
  const url = new URL(req.url);
  const uniqueLink = url.searchParams.get("uniqueLink");

  if (!uniqueLink) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const user = await User.findOne({ uniqueLink });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const messages = await Message.find({ userId: user._id });
  return NextResponse.json({ messages }, { status: 200 });
}
