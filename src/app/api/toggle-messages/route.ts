import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/model/User";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { uniqueLink, receivingMessages } = await req.json();

    if (!uniqueLink) {
      return NextResponse.json(
        { error: "Unique link is required" },
        { status: 400 }
      );
    }

    // Update the receivingMessages field to the new value (false or true)
    const user = await User.findOneAndUpdate(
      { uniqueLink },
      { receivingMessages: receivingMessages },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
