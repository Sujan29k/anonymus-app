"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Send,
  MessageSquare,
  User,
  Sparkles,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import styles from "./page.module.css";

export default function SendMessage() {
  const params = useParams();
  const uniqueLink = params?.uniqueLink as string;

  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [aiMessages, setAiMessages] = useState<string[]>([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) {
      setStatus("Message cannot be empty.");
      return;
    }

    setStatus("");

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
          setStatus("Message sent successfully! ✅");

          setTimeout(() => setStatus(""), 3000);
        } else {
          setStatus(
            "Failed to send message: " + (data.error || "Unknown error")
          );
        }
      } catch (parseError) {
        setStatus("Server response is not in expected format.");
      }
    } catch (error) {
      setStatus("Network error. Please try again.");
    }
  };

  const generateAiMessages = async () => {
    setLoadingAI(true);
    setAiMessages([]);

    try {
      const res = await fetch("/api/generate-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setAiMessages(data.messages || []);
      } else {
        setAiMessages(["Failed to generate messages. Try again."]);
      }
    } catch (error) {
      setAiMessages(["Error fetching AI messages."]);
    } finally {
      setLoadingAI(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <h1>Send an Anonymous Message</h1>

      <div className={styles.messageBox}>
        <div className={styles.inputContainer}>
          <User size={20} className={styles.icon} />
          <input
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Your Fake Name (Optional)"
            className={styles.input}
          />
        </div>

        <div className={styles.inputContainer}>
          <MessageSquare size={20} className={styles.icon} />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className={styles.textarea}
          />
        </div>

        <button onClick={handleSend} className={styles.button}>
          <Send size={18} className={styles.sendIcon} /> Send
        </button>

        {status && (
          <p
            className={
              status.includes("successfully") ? styles.success : styles.error
            }
          >
            {status.includes("successfully") ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            {status}
          </p>
        )}

        <div className={styles.autoMessageSection}>
          <button
            onClick={generateAiMessages}
            className={styles.autoMessageButton}
            disabled={loadingAI}
          >
            <Sparkles size={18} />{" "}
            {loadingAI ? "Generating..." : "Generate AI Messages"}
          </button>

          {aiMessages.length > 0 && (
            <div className={styles.autoMessages}>
              {aiMessages.map((msg, index) => (
                <button
                  key={index}
                  className={styles.autoMessage}
                  onClick={() => setMessage(msg)}
                >
                  {msg}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
