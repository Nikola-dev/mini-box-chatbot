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
        content: data.output,
      }; // ✅ use output
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
    <div className="w-full max-w-2xl mx-auto p-2 sm:p-4 bg-white rounded-lg shadow-md h-[calc(100vh-2rem)] sm:h-auto flex flex-col">
      <div className="flex-1 sm:h-96 overflow-y-auto border-b border-gray-200 p-2 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 sm:px-4 sm:py-2 rounded-lg max-w-[85%] sm:max-w-[75%] break-words ${
                msg.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-3 py-2 sm:px-4 sm:py-2 rounded-lg bg-gray-200 text-black">
              Mini-box kuca...
            </div>
          </div>
        )}
      </div>
      <form onSubmit={handleSubmit} className="flex p-2 sm:p-4 gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow p-2 sm:p-3 border border-gray-300 rounded-lg sm:rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
          placeholder="Unesite vašu poruku..."
          disabled={loading}
        />
        <button
          type="submit"
          className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-500 text-white rounded-lg sm:rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap text-sm sm:text-base"
          disabled={loading}
        >
          Pošalji
        </button>
      </form>
    </div>
  );
}
