"use client"

import { useState, useEffect } from "react";

type Message = { 
  role: "user" | "assistant"; 
  content: string 
};

type Project = { 
  id: string; 
  name: string; 
  messages: Message[] };

type Star = {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([
    { id: "1", name: "New Chat", messages: [] },
  ]);

  const [activeProjectId, setActiveProjectId] = useState("1");
  const [input, setInput] = useState("");

  const activeProject = projects.find((p) => p.id === activeProjectId)!;
  const [stars, setStars] = useState<Star[]>([]);

  function generateStars(count: number): Star[] {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 2 + 1,
    }));
  }

  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch {
        console.warn("Saved projects data was corrupted, starting fresh.");
      }
    }
  }, []);

  useEffect(()=> {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    setStars(generateStars(100));
  }, []);

  function updateProjectMessages(projectId: string, newMessages: Message[]) {
    setProjects((prev) => 
      prev.map((p) => (p.id === projectId ? { ...p, messages: newMessages } : p))
    );
  }

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessages: Message[] = [...activeProject.messages, { role: "user", content: input }];
    updateProjectMessages(activeProjectId, newMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMessages }),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();
    let assistantReply = "";

    updateProjectMessages(activeProjectId, [...newMessages, { role: "assistant", content: "" }]);

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      assistantReply += decoder.decode(value, { stream: true });
      updateProjectMessages(activeProjectId, [...newMessages, { role: "assistant", content: assistantReply }]);
    }
  }

  function newProject() {
    const id = Date.now().toString();
    setProjects((prev) => [...prev, { id, name: `Chat ${prev.length + 1}`, messages: [] }]);
    setActiveProjectId(id);
  }

  return (
    <div style={{ display: "flex" }}>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute rounded-full bg-white animate-twinkle"
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              left: `${star.left}vw`,
              top: `${star.top}vh`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>
      <aside className="w-53 border-r border-gray-900 p-3">
        <button onClick={newProject}>+ New Chat</button>
        {projects.map((p) => (
          <p
            key={p.id}
            onClick={() => setActiveProjectId(p.id)}
            style={{
              cursor: "pointer",
              fontWeight: p.id === activeProjectId ? "bold" : "normal",
              }}
            >
            {p.name}
          </p>
        ))}
      </aside>

      
      <main style={{ flex: 1, padding: 16 }}>
        <h1>My Agent</h1>
        <div className="h-200 mx-auto overflow-y-auto rounded-lg bg-gradient-to-b from-gray-800 to-gray-900 p-4 mb-3 border border-gray-700">
          {activeProject.messages.map((m, i) => (
            <div 
              key={i}
              className={`flex mb-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-lg px-3 py-2 ${m.role === "user" ? "bg-purple-600 text-white":
                "bg-gray-700 text-white"
                }`}
                >
                {m.content}
              </div>    
            </div>
          ))};
        </div>
          
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-lg border border-gray-700 bg-gray-900 px-3 py-2 text-white" 
          />
          <button 
            onClick={sendMessage}
            className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-4 py-2 text-white transition hover:from-purple-500 hover:to-pink-500"
            >
              Send
          </button>
        </div>
      </main>
    </div>
  );
}
