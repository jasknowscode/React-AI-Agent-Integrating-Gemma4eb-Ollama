# React-AI-Agent-Integrating-Gemma4eb-Ollama
Gemmae4b AI engine integrated with Ollama with functional UI built in Next.js
A fully local AI agent built with Next.js and powered by Google's Gemma 4 running on Ollama. No API keys, no cloud costs, and no data leaving your machine.

I wanted to explore how AI agents worked under the hood, so I build one on a completely free, local stack that
can run on an M1 MacBook with 16GB memory - utilizing approximately 9MG of memory in runtime.

Runs 100% locally through Ollama, so conversations remain private. 
Streams chat interface for responses appear token by token. 
Next.js API routes as the backend, with no separate Python server needed

Tech stack
Frontend: React, Next.js
Backend: Next.js API routes
Model runtime: Ollama
Model: gemma 4 (gemma4:e4b)
Language: Typescript/JavaScript

Prerequisites: node.js 20+ and npm, Ollama installed and running, around 8GB of free memory for the 4B model (tested on anM1 Mac with 16GB)

Getting started
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
6. Run the app
   npm run dev

Open http://localhost:3000 and start chatting.

How it works
1. You send a message from the React frontend
2. A Next.js API route receives it and forwards it to Ollama with the conversation history
3. If the model decides it needs a tool, the route runs the tool and sends the result back to the model
4. The final response is returned to the frontend

<!-- Adjust these steps to match your actual flow -->

Project structure
app/
  page.tsx          # chat UI
  api/
    chat/route.ts   # agent logic and Ollama calls
lib/
  tools/            # tool definitions
  
<!-- Replace with your real structure: run `tree -I node_modules -L 3` to generate it -->

Troubleshooting
"Connection refused" or fetch errors: Ollama isn't running. Start it with ollama serve or open the Ollama app.
"Model not found": run ollama pull gemma4:e4b, and check that OLLAMA_MODEL in .env.local matches exactly.
Slow responses: close other memory-heavy apps. On machines with less than 16GB, responses may be noticeably slower.

Roadmap
Persistent memory so the agent remembers information about the user across conversations

 
Author : Jasmine · GitHub

License

MIT
