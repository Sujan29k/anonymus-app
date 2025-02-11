"use client";

import { useState } from "react";

export default function SendMessage({ params }: { params: { uniqueLink: string } }) {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    await fetch("/api/send-message", {
      method: "POST",
      body: JSON.stringify({ uniqueLink: params.uniqueLink, message }),
    });
    setMessage("");
  };

  return (
    <div>
      <h1>Send an Anonymous Message</h1>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={handleSend}>Send</button>
    </div>
  );
}
