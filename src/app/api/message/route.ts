import { NextApiRequest, NextApiResponse } from "next";
import connectToDB from "@/lib/mongodb";
import MessageModel from "../../../model/Message";
import User from "../../../model/User";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectToDB();
  if (req.method === "POST") {
    const { uniqueLink, message } = req.body;
    const user = await User.findOne({ uniqueLink });
    if (!user) return res.status(404).json({ error: "User not found" });
    await MessageModel.create({ userId: user._id, message });
    return res.status(200).json({ success: true });
  }
  res.status(405).json({ error: "Method not allowed" });
}
