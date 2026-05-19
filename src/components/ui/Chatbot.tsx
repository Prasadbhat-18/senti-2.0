import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from './CyberUI';
import { Send, Bot, X, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

type Message = {
  role: 'user' | 'assistant';
  text: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Welcome agent. I am the AETHER AI. How can I assist you with your digital footprint analysis today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = { role: 'user', text: inputText };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response");
      }

      setIsLoading(false); // Stop generic loading indicator
      setMessages(prev => [...prev, { role: 'assistant', text: "" }]); // Add empty message for streaming

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6);
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              setMessages(prev => {
                const updated = [...prev];
                const lastIdx = updated.length - 1;
                if (updated[lastIdx].role === 'assistant') {
                  updated[lastIdx] = { ...updated[lastIdx], text: updated[lastIdx].text + data.text };
                }
                return updated;
              });
            } catch (e) {
              console.error("Error parsing stream data", e);
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: 'assistant', text: "Error: Connection lost. Unable to reach AI core." }]);
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-12 right-8 w-14 h-14 bg-gradient-to-tr from-[#00f2ff] to-[#bc13fe] rounded-full flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(0,242,255,0.4)] hover:scale-105 transition-transform z-50 group"
        >
          <Bot className="w-6 h-6 text-white group-hover:animate-pulse" />
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050508] flex items-center justify-center text-[8px] font-bold text-white">
            1
          </div>
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-12 right-8 w-96 flex flex-col z-50 h-[500px]"
          >
            <GlassCard className="p-0 border-[#00f2ff]/30 overflow-hidden bg-[#050508]/95 flex flex-col h-full shadow-[0_0_30px_rgba(0,242,255,0.15)] backdrop-blur-xl">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00f2ff] animate-pulse" />
                  <span className="font-bold text-sm text-[#00f2ff]">SENTINEL BOT CORE</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/50 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scrollbar-hide">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start'
                    }`}
                  >
                    <span className="text-[10px] text-white/30 uppercase mb-1 px-1">
                      {msg.role === 'user' ? 'You' : 'Aether'}
                    </span>
                    <div
                      className={`p-3 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-[#00f2ff]/20 text-[#e0e0e0] border border-[#00f2ff]/30 rounded-tr-sm'
                          : 'bg-white/5 text-[#e0e0e0] border border-white/10 rounded-tl-sm'
                      }`}
                    >
                      <div className="markdown-body prose prose-invert max-w-none text-sm">
                        <ReactMarkdown>
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex flex-col max-w-[85%] self-start items-start">
                    <span className="text-[10px] text-white/30 uppercase mb-1 px-1">Aether</span>
                    <div className="p-3 rounded-xl bg-white/5 text-[#e0e0e0] border border-white/10 rounded-tl-sm flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-[#00f2ff]" />
                      <span className="text-xs text-white/50 animate-pulse">Processing query...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-white/10 bg-[#050508]">
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter command query..."
                    className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm flex-1 outline-none focus:border-[#00f2ff]/50 transition-colors text-white placeholder-white/30"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !inputText.trim()}
                    className="bg-gradient-to-r from-[#00f2ff] to-[#00b3cc] p-2 rounded-lg text-black hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center justify-center w-10"
                  >
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
