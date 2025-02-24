"use client";

import { useSession, signOut } from "next-auth/react";
import { Key, useEffect, useState } from "react";
import type { IMessage } from "@/model/Message";
import { Switch } from "@/components/ui/switch";
import styles from "./dashboard.module.css";
import { RefreshCw, Trash2 } from "lucide-react";

export default function Dashboard() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [receivingMessages, setReceivingMessages] = useState(true);

  const fetchMessages = async () => {
    if (!session?.user) return;
    setLoading(true);

    const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;

    try {
      const res = await fetch(`/api/messages?uniqueLink=${uniqueLink}`);
      if (!res.ok) {
        throw new Error("Failed to fetch messages");
      }
      const data = await res.json();
      setMessages(data.messages?.length > 0 ? data.messages : []);
    } catch (err) {
      setError("Error fetching messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session || !session.user)
    return <p>Please log in to view your dashboard.</p>;

  const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;
  const linkUrl = `${window.location.origin}/Message/${uniqueLink}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(linkUrl);
  };

  const handleDelete = async (messageId: string) => {
    try {
      const res = await fetch("/api/delete-message", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId, uniqueLink }),
      });

      if (res.ok) {
        setMessages((prevMessages) =>
          prevMessages.filter((msg) => msg._id !== messageId)
        );
      }
    } catch {
      setError("Error deleting message.");
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Anonymous Messages</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className={styles.signOutButton}
        >
          Sign Out
        </button>
      </div>

      <section className={styles.linkSection}>
        <div className={styles.linkHeader}>
          <h2>Your Anonymous Link</h2>
          <div className={styles.switchContainer}>
            <span>Accept Messages:</span>
            <Switch
              checked={receivingMessages}
              onCheckedChange={setReceivingMessages}
            />
          </div>
        </div>

        <div className={styles.linkContainer}>
          <input
            type="text"
            value={linkUrl}
            readOnly
            className={styles.linkInput}
          />
          <button onClick={handleCopyLink} className={styles.copyButton}>
            Copy Link
          </button>
        </div>
      </section>

      <section className={styles.messagesSection}>
        <div className={styles.messagesHeader}>
          <h2>Messages</h2>
          <button
            onClick={fetchMessages}
            className={styles.refreshButton}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw size={24} className={styles.loadingIcon} />
            ) : (
              <RefreshCw size={24} />
            )}
          </button>
        </div>

        {loading ? (
          <p>Loading messages...</p>
        ) : error ? (
          <p className={styles.error}>{error}</p>
        ) : messages.length > 0 ? (
          <ul className={styles.messagesList}>
            {messages.map((msg) => (
              <li key={msg._id as Key} className={styles.messageItem}>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(msg._id as string)}
                >
                  <Trash2 size={24} />
                </button>
                <p className={styles.senderName}>
                  {msg.senderName || "Anonymous"}
                </p>
                <div className={styles.messageContent}>
                  <p>{msg.message}</p>
                  <p className={styles.timestamp}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No messages yet.</p>
        )}
      </section>
    </div>
  );
}
