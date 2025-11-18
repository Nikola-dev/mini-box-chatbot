"use client";

import Chat from "./components/Chat";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start sm:justify-center p-4 sm:p-8 md:p-12 bg-gray-100">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold my-4 sm:mb-8 text-gray-800">
        Mini-Box Chatbot
      </h1>
      <Chat />
    </main>
  );
}
