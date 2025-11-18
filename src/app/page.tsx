'use client';

import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Mini-Box Chatbot</h1>
      <Chat />
    </main>
  );
}
