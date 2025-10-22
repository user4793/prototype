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
  <main
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "calc(100vh - 100px)",
      padding: "40px 20px",
      background: "#f6f7f9",
    }}
  >
    <div
      style={{
        width: "100%",
        maxWidth: 780,
        height: "80vh",
        borderRadius: 20,
        background: "#ffffff",
        border: "1px solid #e6e6e9",
        boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Chat messages */}
      <div
        ref={chatRef}
        className="messages"
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 20,
          display: "grid",
          gap: 12,
          background: "#ffffff",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            className={`message ${m.role}`}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-start",
            }}
          >
            <div
              className="avatar"
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: m.role === "user" ? "#e3e6ea" : "#10a37f",
                color: m.role === "user" ? "#000" : "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {m.role === "user" ? "U" : "AI"}
            </div>
            <div
              className="bubble"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background:
                  m.role === "user" ? "#e9eef6" : "rgba(0,0,0,0.04)",
                color: "#111",
                border:
                  m.role === "assistant"
                    ? "1px solid rgba(0,0,0,0.05)"
                    : "none",
                lineHeight: 1.5,
                whiteSpace: "pre-wrap",
                maxWidth: "75%",
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input bar */}
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          padding: 14,
          borderTop: "1px solid #ececef",
          background: "#fafafa",
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${slug}’s assistant...`}
          style={{
            flex: 1,
            border: "1px solid #e2e2e5",
            background: "#fff",
            color: "#111",
            borderRadius: 8,
            padding: "12px 14px",
            outline: "none",
          }}
        />
        <button
          disabled={sending}
          style={{
            background: "#10a37f",
            border: "none",
            borderRadius: 8,
            color: "#fff",
            padding: "12px 18px",
            marginLeft: 10,
            fontWeight: 600,
            cursor: "pointer",
            opacity: sending ? 0.6 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  </main>
);

}
