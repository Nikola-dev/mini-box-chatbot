import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const { userMessage } = await req.json();

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
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
  } catch (err: any) {
    console.error("[CHAT_ERROR]", err);
    return new Response(
      JSON.stringify({
        error: "Chat API error",
        details: err.message,
      }),
      { status: 500 }
    );
  }
}
