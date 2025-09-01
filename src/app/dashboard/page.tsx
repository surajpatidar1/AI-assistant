'use client'

import {  Github, Link2Icon, Linkedin, Loader2, Menu } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

type Message = { 
  type: 'user' | 'agent'; 
  text: string; 
  timestamp: Date;
  id: string; // Unique ID for each message
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
  const [isOpen,setIsOpen] = useState<boolean>(true)

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
            text: `Hello ${name}! How may I help you today?`,
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
          // Add agent response to chat with timestamp and unique ID
          const agentMessage: Message = { 
            type: "agent", 
            text: data.content,
            timestamp: new Date(),
            id: generateMessageId()
          };
          setMessages(prev => [...prev, agentMessage]);
        } else {
          toast.error(data.message || "Wait for agent, agent got stuck!");
        }
      }
    } catch (error: any) {
      console.log(error.message)
      toast.error("Error: " + error.message)
    } finally {
      setLoading(false)
      setInput(prev => ({ ...prev, question: '' }))
    }
  }

  useEffect(() => {
    generateSessionId();
 
    setMessages([{ 
      type: "agent", 
      text: "Hello! Welcome to Suraj's Assistant. What is your name?",
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
        return `Ask anything about suraj, ${userName}...`;
      default:
        return "Ask anything about suraj...";
    }
  };

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black bg-cover bg-center flex gap-1">
      <section
      className={`bg-white/5 backdrop-blur-[90px] border border-white/10 rounded-r-lg shadow-xl text-white transition-all duration-300 h-screen 
      ${isOpen ? "w-56 p-4" : "w-20 p-2"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 mb-4 flex justify-center items-center bg-white/5 hover:bg-white/10 rounded-lg w-full"
      >
        
        { isOpen ? 'Collapse' : <Menu />
          }

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

      {/* Title */}
      {isOpen && (
        <h1 className="text-white text-lg font-semibold mb-3 text-center">
          Suraj's Assis
        </h1>
      )}
      <hr className="text-white/10 mb-8" />

      {/* Links */}
      <nav className="flex flex-col gap-3">
        <p className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
          <a href="https://www.linkedin.com/in/suraj-patidar-777940279/" className='flex gap-3'>
          <Linkedin />
          {isOpen && <span>Linkedin</span>} </a>
        </p>
        <p className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
          <a href="https://github.com/surajpatidar1" className='flex gap-3'>
          <Github />
          {isOpen && <span>Github</span>}</a>
        </p>
        <p className="flex gap-3 rounded-lg py-3 px-3 font-bold text-lg items-center justify-center hover:bg-white/10 transition-all cursor-pointer">
          <a href=" https://workwith-ai-3p43.vercel.app/" className='flex gap-3'>
          <Link2Icon />
          {isOpen && <span>Portfolio</span>}</a>
        </p>
      </nav>
    </section>

      <section className="bg-white/5 backdrop-blur-[90px] border border-white/10 rounded-2xl shadow-xl w-full max-w-8xl m-5 flex flex-col">
        <div className='w-full h-full max-h-[75vh]  text-white p-5 m-2 rounded-2xl overflow-y-auto flex-1'>
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              Loading...
            </div>
          ) : (
            messages.map((msg, i) => (
              <div 
                key={msg.id} 
                className={`p-4 rounded-lg max-w-lg mb-4 ${
                  msg.type === 'user' 
                    ? 'self-end bg-white/10 ml-auto' 
                    : 'self-start bg-white/20 mr-auto'
                }`}
              >
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-white/70">
                      {msg.type === 'user' ? userName || 'You' : 'Assistant'}
                    </span>
                    <span className="text-xs text-white/50">
                      {formatTime(msg.timestamp)}
                    </span>
                  </div>
                  <p className='w-full text-white/90'>{msg.text}</p>
                </div>
              </div>
            ))
          )}
        </div>
        
        {loading && (
          <div className="self-start text-gray-400 px-5 py-2 flex items-center">
            <Loader2 className="animate-spin mr-2" size={16} />
            {appState === 'asking_name' ? 'Processing...' : 'Agent is typing...'}
          </div>
        )}
        
        <div className='text-white/70 px-5 py-3 mt-auto'>
          <form className='flex gap-2' onSubmit={handleResponse}>
            <input 
              type="text" 
              name='question'
              placeholder={getPlaceholder()}
              onChange={handleInput}
              value={input.question}
              className='border border-white/40 py-3 px-4 w-full max-w-5xl rounded-lg bg-white/5 focus:outline-none focus:border-white/60 text-white placeholder-white/50'
              disabled={loading}
            />
            <button 
              type="submit"
              className='rounded-lg bg-white/10 p-3 text-sm hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white'
              disabled={loading || !input.question.trim()}
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : 'Ask'}
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}

export default Page