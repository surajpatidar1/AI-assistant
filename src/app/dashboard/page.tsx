'use client'

import { Loader2, Send, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import Sidebar from '../compos/sidebar/page';
import Markdown from 'react-markdown'

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [iconPosition, setIconPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarOpen && 
          sidebarRef.current && 
          !sidebarRef.current.contains(event.target as Node) &&
          !(event.target as Element).closest('.mobile-toggle-icon')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);

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
    } catch (error) {
       const err = error instanceof Error ? error : new Error("Unknown error");
      console.error("API Error:", err.message);
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
        return "eg- suraj";
      case 'normal_chat':
        return `Ask about Suraj&apos;s skills, projects, or experience...`;
      default:
        return "Ask anything about Suraj...";
    }
  };

  // Handle touch events for dragging the icon
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dragStartPos.current = {
      x: touch.clientX - iconPosition.x,
      y: touch.clientY - iconPosition.y
    };
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const touch = e.touches[0];
    const newX = touch.clientX - dragStartPos.current.x;
    const newY = touch.clientY - dragStartPos.current.y;
    
    // Get viewport dimensions
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    
    // Constrain to viewport boundaries
    const constrainedX = Math.max(0, Math.min(newX, vw - 50)); // 50 is icon width
    const constrainedY = Math.max(0, Math.min(newY, vh - 50)); // 50 is icon height
    
    setIconPosition({ x: constrainedX, y: constrainedY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Quick suggestions for user to click
  const quickSuggestions = [
    "What are Suraj's skills?",
    "Tell me about Suraj's education",
    "What projects has Suraj worked on?",
    "How can I contact Suraj?",
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(prev => ({ ...prev, question: suggestion }));
  };

  return (
    <div className="min-h-screen bg-[url('/black.jpg')] bg-cover bg-center flex gap-1 relative">
      
     
      <div 
        className="mobile-toggle-icon md:hidden fixed z-50 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
        style={{ left: `${iconPosition.x}px`, top: `${iconPosition.y}px` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X size={24} color="white" /> : <Menu size={24} color="white" />}
      </div>
      
      {/* Sidebar with mobile responsiveness */}
      <div 
        ref={sidebarRef}
        className={`${sidebarOpen ? 'block absolute z-40 h-full' : 'hidden'} md:block md:relative`}
      >
        <Sidebar />
      </div>
      
      <section className="bg-white/5 backdrop-blur-[80px] border border-white/10 rounded-2xl shadow-xl w-full max-w-8xl m-2 md:m-5 flex flex-col">
        <div className="w-full h-full max-h-[70vh] text-white p-3 md:p-5 rounded-2xl overflow-y-auto flex-1">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`p-4 rounded-lg max-w-lg mb-4 ${
                msg.type === 'user' 
                  ? 'ml-auto bg-white/8 border border-white/8' 
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
                  <div className="w-full text-white/90 whitespace-pre-wrap">
                    <Markdown>{msg.text}</Markdown>
                  </div>
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
              className="rounded-lg bg-white/10 p-3 text-sm hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white flex items-center justify-center"
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