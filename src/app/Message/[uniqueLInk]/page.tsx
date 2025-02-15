"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import styles from "./page.module.css";

export default function SendMessage() {
  const params = useParams();
  const uniqueLink = params?.uniqueLink as string;

  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSend = async () => {
    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    setStatus("");

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
          senderName: senderName || "Anonymous",
          message,
        }),
      });

      const text = await res.text();

      try {
        const data = JSON.parse(text);
        if (res.ok) {
          setMessage("");
          setSenderName("");
          setStatus("Message sent successfully!");

          setTimeout(() => setStatus(""), 3000);
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
    <div className={styles.container}>
      <h1>Send an Anonymous Message</h1>
      <input
        type="text"
        value={senderName}
        onChange={(e) => setSenderName(e.target.value)}
        placeholder="Your Fake Name (Optional)"
        className={styles.input}
      />
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className={styles.textarea}
      />
      <button onClick={handleSend} className={styles.button}>
        Send
      </button>
      {status && (
        <p
          className={
            status.includes("successfully") ? styles.success : styles.error
          }
        >
          {status}
        </p>
      )}
    </div>
  );
}
