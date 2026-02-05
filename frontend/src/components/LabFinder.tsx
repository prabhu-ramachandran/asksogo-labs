import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, ArrowRight, Code, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  role: 'bot' | 'user';
  content: string;
  options?: { label: string; value: string }[];
}

export default function LabFinder() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Namaskara! I am the SOGO Guide. I can help you find your perfect learning path. Shall we start?",
      options: [
        { label: "Yes, help me choose! 🚀", value: "start" },
        { label: "Just show me everything.", value: "all" }
      ]
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [result, setResult] = useState<'python' | 'english' | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleOption = async (option: { label: string; value: string }) => {
    // Add user selection
    setMessages(prev => [...prev, { role: 'user', content: option.label }]);
    setResult(null); // Reset result if restarting

    setIsTyping(true);
    
    // Simulate thinking delay
    setTimeout(() => {
      let nextMsg: Message;

      if (option.value === "start") {
        nextMsg = {
          role: 'bot',
          content: "Great! First question: When you see a problem, what is your first instinct?",
          options: [
            { label: "I want to build a tool to fix it. 🛠️", value: "build" },
            { label: "I want to explain it clearly to others. 🗣️", value: "talk" }
          ]
        };
      } else if (option.value === "build") {
        nextMsg = {
          role: 'bot',
          content: "Interesting! And do you prefer working with...",
          options: [
            { label: "Logic, Numbers, and Data? 🔢", value: "logic" },
            { label: "Stories, Words, and People? 📝", value: "words" }
          ]
        };
      } else if (option.value === "talk" || option.value === "words") {
        nextMsg = {
          role: 'bot',
          content: "I see! You value communication and connection. Based on this, I have a recommendation...",
        };
        setResult('english');
      } else if (option.value === "logic") {
        nextMsg = {
          role: 'bot',
          content: "A builder at heart! You like structure and efficiency. I have just the place for you...",
        };
        setResult('python');
      } else {
        // Fallback / Show All
        nextMsg = { role: 'bot', content: "No problem! You can explore all our labs below." };
      }

      setMessages(prev => [...prev, nextMsg]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border-4 border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
        {/* Header */}
        <div className="bg-[#1A2B3C] p-4 flex items-center">
          <div className="w-10 h-10 bg-[#FF8C00] rounded-full flex items-center justify-center mr-3">
            <Bot className="text-white" size={24} />
          </div>
          <div>
            <h3 className="font-bold text-white text-lg">SOGO Lab Finder</h3>
            <div className="flex items-center text-green-400 text-xs font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span> Online
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={chatContainerRef} className="flex-1 p-6 space-y-6 overflow-y-auto bg-gray-50">
          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] p-4 rounded-2xl font-medium ${
                  msg.role === 'user' 
                    ? 'bg-[#1A2B3C] text-white rounded-tr-none' 
                    : 'bg-white text-[#1A2B3C] border-2 border-gray-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border-2 border-gray-100 shadow-sm flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Result Card */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-4"
            >
              {result === 'python' ? (
                <div className="bg-white border-4 border-[#FF8C00] rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="text-[#FF8C00]" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2B3C] mb-2">Recommended: Python Logic Lab</h3>
                  <p className="text-gray-600 mb-6 text-sm">You have the mindset of an engineer. Start building real applications today.</p>
                  <Link to="/lab">
                    <button className="bg-[#FF8C00] text-white font-bold py-3 px-8 rounded-xl hover:bg-[#E67E00] transition-colors w-full flex items-center justify-center">
                      Enter Lab <ArrowRight size={18} className="ml-2" />
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="bg-white border-4 border-blue-500 rounded-2xl p-6 shadow-lg text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="text-blue-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-[#1A2B3C] mb-2">Recommended: English Lab</h3>
                  <p className="text-gray-600 mb-6 text-sm">You are a communicator. Master the language of business to amplify your voice.</p>
                  <button disabled className="bg-gray-100 text-gray-400 font-bold py-3 px-8 rounded-xl cursor-not-allowed w-full">
                    Join Waitlist
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </div>

        {/* Input Area (Options) */}
        {!result && !isTyping && messages[messages.length - 1].role === 'bot' && messages[messages.length - 1].options && (
          <div className="p-4 bg-white border-t-2 border-gray-100 grid grid-cols-1 gap-3">
            {messages[messages.length - 1].options?.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleOption(opt)}
                className="w-full text-left p-3 rounded-xl border-2 border-gray-200 hover:border-[#FF8C00] hover:bg-orange-50 font-medium text-gray-700 transition-all flex justify-between items-center group"
              >
                {opt.label}
                <Send size={16} className="text-gray-300 group-hover:text-[#FF8C00]" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
