"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { IMessage } from "@/model/Message";

export default function Dashboard() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    if (session && session.user) {
      const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;
      fetch(`/api/messages?uniqueLink=${uniqueLink}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.messages));
    }
  }, [session]);

  if (!session || !session.user)
    return <p>Please log in to view your dashboard.</p>;

  const uniqueLink = (session.user as { uniqueLink: string }).uniqueLink;
  const linkUrl = `${window.location.origin}/message/${uniqueLink}`;

  return (
    <div>
      <h1>Welcome, {session.user.name}</h1>
      <p>Your anonymous message link:</p>
      <input type="text" value={linkUrl} readOnly />
      <button onClick={() => navigator.clipboard.writeText(linkUrl)}>
        Copy Link
      </button>
      <h2>Received Messages:</h2>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg.message}</li>
        ))}
      </ul>
    </div>
  );
}
