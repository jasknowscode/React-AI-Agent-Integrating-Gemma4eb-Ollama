# React-AI-Agent-Integrating-Gemma4eb-Ollama
Gemmae4b AI engine integrated with Ollama with functional UI built in Next.js
A fully local AI agent built with Next.js and powered by Google's Gemma 4 running on Ollama. No API keys, no cloud costs, and no data leaving your machine.

I wanted to explore how AI agents worked under the hood, so I build one on a completely free, local stack that
can run on an M1 MacBook with 16GB memory - utilizing approximately 9MG of memory in runtime.

Runs 100% locally through Ollama, so conversations remain private. 
Streams chat interface for responses appear token by token. 
Next.js API routes as the backend, with no separate Python server needed

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Tech stack
Frontend: React, Next.js
Backend: Next.js API routes
Model runtime: Ollama
Model: gemma 4 (gemma4:e4b)
Language: Typescript/JavaScript

## Prerequisites: node.js 20+ and npm, Ollama installed and running, around 8GB of free memory for the 4B model (tested on anM1 Mac with 16GB)

## Getting started
1. Clone the rep
   git clone https://github.com/jasknowscode/React-AI-Agent-Integrating-Gemma4eb-Ollama.git
   cd React-AI-Agent-Integrating-Gemma4eb-Ollama.git
2. npm install
3. Pull the model
   ollama pull gemma4:e4b
4. cp .env.example .env.local

The defaults work in Ollama is running on its standard port: 
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=gemma4:e4b

5. Start Ollama
   ollama serve
6. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpmdev
   # or
   bun dev
   ```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## How it works
1. You send a message from the React frontend
2. A Next.js API route receives it and forwards it to Ollama with the conversation history
3. If the model decides it needs a tool, the route runs the tool and sends the result back to the model
4. The final response is returned to the frontend

<!-- Adjust these steps to match your actual flow -->

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Project structure
app/
  page.tsx          # chat UI
  api/
    chat/route.ts   # agent logic and Ollama calls
lib/
  tools/            # tool definitions
  
<!-- Replace with your real structure: run `tree -I node_modules -L 3` to generate it -->

## Troubleshooting
"Connection refused" or fetch errors: Ollama isn't running. Start it with ollama serve or open the Ollama app.
"Model not found": run ollama pull gemma4:e4b, and check that OLLAMA_MODEL in .env.local matches exactly.
Slow responses: close other memory-heavy apps. On machines with less than 16GB, responses may be noticeably slower.

## Roadmap
Persistent memory so the agent remembers information about the user across conversations.

## Author : Jasmine · GitHub

## License : MIT
i