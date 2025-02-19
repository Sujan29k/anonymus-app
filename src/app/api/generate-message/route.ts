import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key is missing" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Generate 3 short anonymous friendly messages that someone might send to another person.
      Each message should be some kind of scolding. Separate them with "###".
    `;

    console.log("Prompt sent to Gemini:", prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedText = response.text().trim();

    const messages = generatedText.split("###").map((msg) => msg.trim());

    console.log("Generated Messages:", messages);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error during Gemini request:", error);
    return NextResponse.json(
      { error: "Error generating messages. Please try again." },
      { status: 500 }
    );
  }
}
