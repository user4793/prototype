"use client";
import { useEffect, useRef, useState } from "react";

export default function ChatPage({ params }) {
  const slug = params.slug.toLowerCase();
  const [messages, setMessages] = useState([
    { role: "assistant", text: `Hi, I’m ${slug}’s assistant. How can I help?` }
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function sendMessage(e) {
    e.preventDefault();
    if (!input.trim() || sending) return;
    const userMsg = input.trim();
    setMessages(m => [...m, { role: "user", text: userMsg }]);
    setInput("");
    setSending(true);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, message: userMsg })
      });
      const data = await res.json().catch(async () => ({ reply: await res.text() }));
      await new Promise(r => setTimeout(r, 400)); // small typing delay
      setMessages(m => [...m, { role: "assistant", text: data.reply || "No reply." }]);
    } catch {
      setMessages(m => [...m, { role: "assistant", text: "Error connecting to server." }]);
    } finally {
      setSending(false);
      setTyping(false);
    }
  }

  return (
    <main>
      <div className="chat-container">
        <div ref={chatRef} className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              <div className="avatar">{m.role === "user" ? "U" : "AI"}</div>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
          {typing && <div className="typing">Assistant is typing…</div>}
        </div>

        <form onSubmit={sendMessage} className="inputbar">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={`Message ${slug}’s assistant...`}
          />
          <button disabled={sending}>Send</button>
        </form>
      </div>
    </main>
  );
}
