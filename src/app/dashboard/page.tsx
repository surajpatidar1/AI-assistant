'use client'

import { Github, Link2Icon, Linkedin, Loader2, Menu, Send } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

type Message = { 
  type: 'user' | 'agent'; 
  text: string; 
  timestamp: Date;
  id: string;
};

type AppState = 'asking_name' | 'normal_chat' | 'ready';

const Page = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState({
    question: '',
    sessionId: ''
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [appState, setAppState] = useState<AppState>('asking_name');
  const [userName, setUserName] = useState<string>('');
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({ ...prev, [name]: value }))
  };

  const generateSessionId = () => {
    const sessionId = 'user' + Math.floor(100000 * Math.random() + 90000);
    setInput((prev) => ({ ...prev, sessionId: sessionId }))
  };

  const generateMessageId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  const formatTime = (date: Date | undefined | null) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '--:--';
    }
    
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.question.trim()) {
      toast.error("Please enter a question");
      return;
    }

    const userMessage: Message = { 
      type: "user", 
      text: input.question,
      timestamp: new Date(),
      id: generateMessageId()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true)

    try {
      if (appState === 'asking_name') {
        const name = input.question.trim();
        setUserName(name);
        setAppState('normal_chat');

        setTimeout(() => {
          const welcomeMessage: Message = { 
            type: "agent", 
            text: `Hello ${name}! I'm Suraj's AI assistant. I can tell you about his education, skills, projects, and experience. What would you like to know?`,
            timestamp: new Date(),
            id: generateMessageId()
          };
          setMessages(prev => [...prev, welcomeMessage]);
        }, 500);
        
      } else {
        const response = await fetch('/api/response', {
          method: "POST",
          body: JSON.stringify({
            input: input.question,
            sessionId: input.sessionId,
            userName: userName 
          }),
          headers: {
            "Content-Type": "application/json"
          }
        });

        const data = await response.json();
        
        if (data.success) {
          const agentMessage: Message = { 
            type: "agent", 
            text: data.content,
            timestamp: new Date(),
            id: generateMessageId()
          };
          setMessages(prev => [...prev, agentMessage]);
          
          // Update username if provided in response
          if (data.userName && data.userName !== userName) {
            setUserName(data.userName);
          }
        } else {
          toast.error(data.message || "Sorry, I encountered an error. Please try again.");
          
          // Add error message to chat
          const errorMessage: Message = { 
            type: "agent", 
            text: "I'm sorry, I'm having trouble processing your request. Could you please try again?",
            timestamp: new Date(),
            id: generateMessageId()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    } catch (error: any) {
      console.error("API Error:", error);
      toast.error("Network error. Please check your connection and try again.");
      
      // Add error message to chat
      const errorMessage: Message = { 
        type: "agent", 
        text: "I'm having connection issues. Please try again in a moment.",
        timestamp: new Date(),
        id: generateMessageId()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false)
      setInput(prev => ({ ...prev, question: '' }))
    }
  }

  useEffect(() => {
    generateSessionId();
 
    setMessages([{ 
      type: "agent", 
      text: "Hello! Welcome to Suraj's Assistant. What's your name?",
      timestamp: new Date(),
      id: generateMessageId()
    }]);
    
    setAppState('asking_name');
  }, [])

  const getPlaceholder = () => {
    switch (appState) {
      case 'asking_name':
        return "Enter your name...";
      case 'normal_chat':
        return `Ask about Suraj's skills, projects, or experience...`;
      default:
        return "Ask anything about Suraj...";
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  // Quick suggestions for user to click
  const quickSuggestions = [
    "What are Suraj's skills?",
    "Tell me about Suraj's education",
    "What projects has Suraj worked on?",
    "How can I contact Suraj?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(prev => ({ ...prev, question: suggestion }));
  };

  return (
    <div className="min-h-screen bg-black bg-cover bg-center flex gap-1">
      <section
        className={`bg-white/5 backdrop-blur-[90px] border border-white/10 rounded-r-lg shadow-xl text-white transition-all duration-300 h-screen 
        ${isOpen ? "w-56 p-4" : "w-20 p-2"} hidden md:block`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 mb-4 flex justify-center items-center bg-white/5 hover:bg-white/10 rounded-lg w-full"
        >
          {isOpen ? 'Collapse' : <Menu />}
        </button>

        <div className="flex justify-center">
          <Image
            src={"/logo.png"}
            alt="logo"
            width={isOpen ? 100 : 50}
            height={isOpen ? 100 : 50}
            className={`rounded-full mb-5 transition-all duration-300 ${
              isOpen ? "p-3" : "p-1"
            }`}
          />
        </div>

        {isOpen && (
          <h1 className="text-white text-lg font-semibold mb-3 text-center">
            Suraj's Assistant
          </h1>
        )}
        <hr className="text-white/10 mb-8" />

        <nav className="flex flex-col gap-3">
          <a 
            href="https://www.linkedin.com/in/suraj-patidar-777940279/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
          >
            <Linkedin />
            {isOpen && <span>LinkedIn</span>}
          </a>
          <a 
            href="https://github.com/surajpatidar1" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
          >
            <Github />
            {isOpen && <span>GitHub</span>}
          </a>
          <a 
            href="https://workwith-ai-3p43.vercel.app/" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer"
          >
            <Link2Icon />
            {isOpen && <span>Portfolio</span>}
          </a>
        </nav>
      </section>

      <section className="bg-white/5 backdrop-blur-[90px] border border-white/10 rounded-2xl shadow-xl w-full max-w-8xl m-2 md:m-5 flex flex-col">
        <div className="w-full h-full max-h-[70vh] text-white p-3 md:p-5 rounded-2xl overflow-y-auto flex-1">
          {messages.map((msg, i) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-lg max-w-lg mb-4 ${
                msg.type === 'user' 
                  ? 'ml-auto bg-blue-500/20 border border-blue-500/30' 
                  : 'mr-auto bg-white/10 border border-white/10'
              }`}
            >
              <div className="flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-white/70">
                    {msg.type === 'user' ? userName || 'You' : "Suraj's Assistant"}
                  </span>
                  <span className="text-xs text-white/50">
                    {formatTime(msg.timestamp)}
                  </span>
                </div>
                <p className="w-full text-white/90 whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center p-4 rounded-lg max-w-lg mb-4 bg-white/10 border border-white/10 mr-auto">
              <Loader2 className="animate-spin mr-2" size={16} />
              <span>Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Quick Suggestions */}
        {appState === 'normal_chat' && messages.length > 2 && !loading && (
          <div className="px-4 py-2 flex flex-wrap gap-2">
            {quickSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1.5 text-sm bg-white/10 hover:bg-white/20 rounded-full transition-colors text-white/80"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
        
        <div className="text-white/70 px-4 py-3 mt-auto border-t border-white/10">
          <form className="flex gap-2" onSubmit={handleResponse}>
            <input 
              type="text" 
              name="question"
              placeholder={getPlaceholder()}
              onChange={handleInput}
              value={input.question}
              className="border border-white/20 py-3 px-4 w-full rounded-lg bg-white/5 focus:outline-none focus:border-white/40 text-white placeholder-white/50"
              disabled={loading}
            />
            <button 
              type="submit"
              className="rounded-lg bg-blue-600 p-3 text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white flex items-center justify-center"
              disabled={loading || !input.question.trim()}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Page