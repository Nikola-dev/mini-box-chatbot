"use client";

import { useState, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Zdravo! Ja sam mini-box, tvoj mali asistent! Kako mogu da ti pomognem?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userMessage: input }), // ✅ match API
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.output || data.error || "Došlo je do greške.",
      };
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: "Došlo je do greške. Molimo pokušajte ponovo kasnije.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg h-[calc(100vh-8rem)] sm:h-[600px] flex flex-col">
      <div className="flex-1 overflow-y-auto border-b border-gray-200 p-3 sm:p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2.5 sm:px-4 sm:py-2 rounded-2xl max-w-[80%] sm:max-w-[70%] text-sm sm:text-base break-words shadow-sm ${
                msg.role === "user"
                  ? "bg-blue-500 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2.5 sm:px-4 sm:py-2 rounded-2xl rounded-bl-sm bg-gray-100 text-gray-800 text-sm sm:text-base shadow-sm">
              Mini-box kuca...
            </div>
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex p-3 sm:p-4 gap-2 bg-gray-50"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow px-4 py-2.5 sm:py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
          placeholder="Unesite poruku..."
          disabled={loading}
        />
        <button
          type="submit"
          className="px-5 py-2.5 sm:px-6 sm:py-3 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base font-medium shadow-sm"
          disabled={loading}
        >
          Pošalji
        </button>
      </form>
    </div>
  );
}
