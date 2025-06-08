// components/ChatBot.jsx
"use client";
import { useState, useRef, useEffect } from "react";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages are added
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input.trim() };
    const currentInput = input.trim();
    
    // Add user message and clear input
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/chatbot", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      if (data.response) {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          text: data.response 
        }]);
      } else if (data.error) {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          text: `Error: ${data.error}` 
        }]);
      } else {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          text: "I'm not sure how to respond to that. Could you please rephrase your question?" 
        }]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [...prev, { 
        role: "bot", 
        text: "I'm having trouble connecting right now. Please check your connection and try again." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      { role: "bot", text: "Hello! I'm your AI assistant. How can I help you today?" }
    ]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {open ? (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col border border-gray-200">
          {/* Header */}
          <div className="p-3 font-semibold bg-purple-600 text-white rounded-t-xl flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              AI ChatBot
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={clearChat}
                className="text-sm hover:bg-purple-700 px-2 py-1 rounded transition-colors"
                title="Clear chat"
              >
                🗑️
              </button>
              <button 
                onClick={() => setOpen(false)} 
                className="text-sm hover:bg-purple-700 px-2 py-1 rounded transition-colors"
              >
                ✖
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] text-sm p-3 rounded-lg shadow-sm ${
                    msg.role === "user" 
                      ? "bg-purple-600 text-white rounded-br-none" 
                      : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">
                    {msg.text}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-lg rounded-bl-none p-3 shadow-sm border border-gray-200">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.1s"}}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t bg-white rounded-b-xl">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                maxLength={1000}
              />
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  input.trim() && !isLoading
                    ? "bg-blue-600 text-white hover:bg-purple-700" 
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-105"
          title="Open AI ChatBot"
        >
          <span className="text-2xl">💬</span>
        </button>
      )}
    </div>
  );
}