"use client";

import { useState, use } from "react";

export default function SendMessage({
  params,
}: {
  params: Promise<{ uniqueLink: string }>;
}) {
  const resolvedParams = use(params); // Unwrap params
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    try {
      console.log("📩 Sending message...");

      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uniqueLink: (await params).uniqueLink,
          message,
        }),
      });

      const data = await res.json().catch(() => null); // Handle empty response

      if (res.ok) {
        console.log("✅ Message sent:", data);
        setMessage("");
      } else {
        console.error("⚠️ Server error:", data?.error || "Unknown error");
      }
    } catch (error) {
      console.error("🚨 Fetch error:", error);
    }
  };

  return (
    <div>
      <h1>Send an Anonymous Message</h1>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
      />
      <button onClick={handleSend}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
}
