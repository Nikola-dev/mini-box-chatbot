import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    // Check if API key exists
    if (!process.env.GEMINI_API_KEY) {
      console.error("[CHAT_ERROR] GEMINI_API_KEY is not set");
      return new Response(
        JSON.stringify({
          error: "API key not configured",
          details: "Please set GEMINI_API_KEY in .env.local file",
        }),
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
    });

    const systemPrompt = `
Ti si mini-box, mali AI asistent za ITBox Srbija.
Odgovaraj uvek na srpskom jeziku.
Budi stručan, jasan i ljubazan.
`;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: systemPrompt + "\n" + userMessage }],
        },
      ],
    });

    console.log(
      "FULL GEMINI RESPONSE:",
      JSON.stringify(result.response, null, 2)
    );

    // Safe extraction of text
    let text = "";
    if (result.response.candidates?.length) {
      const parts = result.response.candidates[0].content.parts;
      text = parts.map((p) => p.text).join("\n") || "";
    }

    return new Response(JSON.stringify({ output: text }), { status: 200 });
  } catch (err) {
    console.error("[CHAT_ERROR]", err);
    const errorMessage = err instanceof Error ? err.message : "Unknown error";

    // Check if it's a rate limit error
    if (
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests")
    ) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded",
          output:
            "Izvinite, API je dostigao limit zahteva. Molimo pokušajte ponovo za nekoliko minuta. 🕐",
        }),
        { status: 429 }
      );
    }

    return new Response(
      JSON.stringify({
        error: "Chat API error",
        details: errorMessage,
        output:
          "Došlo je do greške u komunikaciji sa AI modelom (Verovatno zbog besplatnog plana). Molimo pokušajte ponovo. 🔄",
      }),
      { status: 500 }
    );
  }
}
