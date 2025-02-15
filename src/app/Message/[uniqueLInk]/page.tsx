"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function SendMessage() {
  const params = useParams(); // ✅ Correct way to access params in client components
  const uniqueLink = params?.uniqueLink as string; // Extracting uniqueLink properly

  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    console.log("📩 Sending message with data:", {
      uniqueLink,
      senderName,
      message,
    });

    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueLink,
          senderName: senderName || "Anonymous", // Ensure senderName is set
          message,
        }),
      });

      console.log("🔹 Response Status:", res.status);
      const text = await res.text();
      console.log("🔹 Raw Response Body:", text);

      try {
        const data = JSON.parse(text);
        console.log("✅ Parsed Response:", data);
        if (res.ok) {
          setMessage("");
          setSenderName("");
          setStatus("Message sent successfully!");
        } else {
          setStatus(
            "Failed to send message: " + (data.error || "Unknown error")
          );
        }
      } catch (parseError) {
        console.error("❌ Response is not valid JSON:", text);
        setStatus("Server response is not in expected format.");
      }
    } catch (error) {
      console.error("🚨 Fetch error:", error);
      setStatus("Network error. Please try again.");
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <h1 className="text-lg font-bold mb-2">Send an Anonymous Message</h1>
      <input
        type="text"
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
        placeholder="Your Fake Name (Optional)"
        className="border p-2 mb-2 w-full"
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className="border p-2 mb-2 w-full"
      />
      <button
        onClick={handleSend}
        className="bg-blue-500 text-white p-2 rounded-md"
      >
        Send
      </button>
      {status && <p className="mt-2 text-sm text-red-500">{status}</p>}
    </div>
  );
}
