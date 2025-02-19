import { NextResponse } from "next/server";
import { OpenAI } from "openai";

export async function POST(req: Request) {
  try {
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is missing" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const prompt = `
      Generate 3 short anonymous friendly messages that someone might send to another person.
      Each message should be uplifting, encouraging, or positive. Separate them with "###".
    `;

    // Log the prompt before sending the request to OpenAI
    console.log("Prompt sent to OpenAI:", prompt);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 50,
      temperature: 0.7,
    });

    // Log the response for debugging
    console.log("OpenAI Response:", response);

    if (!response || !response.choices || response.choices.length === 0) {
        return NextResponse.json(
            { error: "Failed to generate messages. Response empty or malformed." },
            { status: 500 }
        );
    }

    const generatedText = response.choices[0]?.message.content.trim();
    const messages = generatedText
        .split("###")
        .map((msg: string) => msg.trim());

    // Log the messages to verify they're being processed
    console.log("Generated Messages:", messages);

    return NextResponse.json({ messages });
  } catch (error) {
    console.error("Error during OpenAI request:", error);
    return NextResponse.json(
      { error: "Error generating messages. Please try again." },
      { status: 500 }
    );
  }
}
