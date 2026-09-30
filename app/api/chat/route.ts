import fs from "fs";
import path from "path";


export async function POST(req: Request) {
  const { messages } = await req.json();
  const memoryPath = path.join(process.cwd(), "memory.json");

  const latestMessage = messages[messages.length - 1].content as string;

  if (latestMessage.toLowerCase().startsWith("remember that I")) {
    const fact = latestMessage.slice("remember that".length).trim();

    const memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8"));
    memory.facts.push(fact);
    fs.writeFileSync(memoryPath, JSON.stringify(memory, null, 2));

    const confirmation = `Got it, I'll remember: ${fact}`;
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(confirmation));
        controller.close();
      },
    });

    return new Response(stream, { headers: { "Content-Type": "text/plain" } });
  }
  
  const memory = JSON.parse(fs.readFileSync(memoryPath, "utf-8")); 
  const systemMessage = {
    role: "system",
    content: `Here are some things you know about the user:\n${memory.facts.join("\n")}`,
  };

  const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "gemma4:e4b",
      messages: [systemMessage, ...messages],
      stream: true,
    }),
  });

  // Ollama streams newline-delimited JSON objects, each with a `message.content`
  // chunk. We transform that into a plain text stream the browser can read.
  const stream = new ReadableStream({
    async start(controller) {
      const reader = ollamaResponse.body!.getReader();
      const decoder = new TextDecoder();
      const encoder = new TextEncoder();

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // keep incomplete last line for next chunk

        for (const line of lines) {
          if (!line.trim()) continue;
          const json = JSON.parse(line);
          if (json.message?.content) {
            controller.enqueue(encoder.encode(json.message.content));
          }
        }
      }
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { "Content-Type": "text/plain" },
  });
}