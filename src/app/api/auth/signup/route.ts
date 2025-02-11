import { NextResponse } from "next/server";
import connectToDB from "@/lib/mongodb";
import User from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    await connectToDB();
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const uniqueLink = `user-${Math.random().toString(36).substr(2, 9)}`;

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      uniqueLink,
    });

    return NextResponse.json(
      { success: "User created", user },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
