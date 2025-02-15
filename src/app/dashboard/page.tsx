"use client";

import { useSession, signOut } from "next-auth/react";
import { Key, useEffect, useState } from "react";
import type { IMessage } from "@/model/Message";
import styles from "./dashboard.module.css";

export default function Dashboard() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // A simple function to generate a fake name (can be replaced with a more sophisticated approach if needed)
  const generateFakeName = (name?: string) => {
    if (name) return name; // Keep real name if available

    const fakeNames = ["John Doe", "Jane Smith", "Alex Johnson", "Chris Brown"];
    return fakeNames[Math.floor(Math.random() * fakeNames.length)];
  };

  const fakeName = generateFakeName(session?.user?.name ?? "");

  const fetchMessages = async () => {
    if (!session?.user) return;

    const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;

    try {
      console.log("Fetching messages for:", uniqueLink);

      const res = await fetch(`/api/messages?uniqueLink=${uniqueLink}`);

      if (!res.ok) {
        let errorMessage = `API Error: ${res.status} ${res.statusText}`;

        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await res.json();
          errorMessage = errorData.error || errorMessage;
        }

        throw new Error(errorMessage);
      }

      const data = await res.json();
      console.log("Fetched messages:", data);

      if (data.messages?.length > 0) {
        setMessages(data.messages);
      } else {
        setMessages([]);
        console.warn("No messages received from API");
      }
    } catch (err: unknown) {
      console.error("Failed to fetch messages:", err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();

    // Auto-refresh messages every 5 seconds
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, [session]);

  if (!session || !session.user)
    return <p>Please log in to view your dashboard.</p>;

  const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;
  const linkUrl = `${window.location.origin}/Message/${uniqueLink}`;

  const handleDelete = async (messageId: string) => {
    const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;

    try {
      const res = await fetch("/api/delete-message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, uniqueLink }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      } else {
        setError(data.error || "Error deleting message");
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Failed to delete the message.");
    }
  };

  // Generate a fake name for the use

  return (
    <div className={styles.dashboardContainer}>
      <h1 className={styles.greeting}>Welcome, {fakeName}</h1>

      {/* Logout Button */}
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className={styles.logoutButton}
      >
        Logout
      </button>

      <section className={styles.linkSection}>
        <p>Your anonymous message link:</p>
        <div className={styles.linkContainer}>
          <input
            type="text"
            value={linkUrl}
            readOnly
            className={styles.linkInput}
          />
          <button
            onClick={() => navigator.clipboard.writeText(linkUrl)}
            className={styles.copyButton}
          >
            Copy Link
          </button>
        </div>
      </section>

      <section className={styles.messagesSection}>
        <h2>Received Messages:</h2>
        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : messages.length > 0 ? (
          <ul className={styles.messagesList}>
            {messages.map((msg) => {
              const sender = msg.senderName
                ? msg.senderName
                : generateFakeName();
              return (
                <li key={msg._id as Key} className={styles.messageItem}>
                  <p>
                    <strong>{sender}:</strong> {msg.message}
                  </p>
                  <button
                    className={styles.deleteButton}
                    onClick={() => handleDelete(msg._id as string)}
                  >
                    Delete
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>No messages yet.</p>
        )}
      </section>
    </div>
  );
}
