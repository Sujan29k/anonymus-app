import { useState } from 'react';
import { useRouter } from 'next/router';

export default function SendMessage() {
  const router = useRouter();
  const { uniqueLink } = router.query;
  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    if (!message) return;
    await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uniqueLink, message })
    });
    setMessage('');
    alert('Message sent anonymously!');
  };

  return (
    <div>
      <h1>Send an Anonymous Message</h1>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}
