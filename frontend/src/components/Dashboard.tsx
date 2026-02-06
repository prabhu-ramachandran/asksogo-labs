import React, { useState, useEffect, useRef } from 'react';
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Send, 
  ChevronLeft, 
  Trophy, 
  Target, 
  Code, 
  Terminal as TerminalIcon,
  CheckCircle2,
  Circle,
  Lightbulb,
  Sparkles
} from 'lucide-react';

import VoiceTutor from './VoiceTutor';

const API_BASE = import.meta.env.VITE_BACKEND_URL || "/api";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface XP {
  Logic: number;
  Frontend: number;
  Database: number;
}

export default function Dashboard() {
  const { user } = useUser();
  const [view, setView] = useState<'selection' | 'lab' | 'english-lab'>('selection');
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [currentModule, setCurrentModule] = useState<string>('');
  const [allModules, setAllModules] = useState<string[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');
  const [terminalOutput, setTerminalOutput] = useState('');
  const [xp, setXp] = useState<XP>({ Logic: 0, Frontend: 0, Database: 0 });
  const [isLoading, setIsLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (user) {
      fetchProgress();
    }
  }, [user]);

  const fetchProgress = async () => {
    try {
      const res = await fetch(`${API_BASE}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id || 'guest' })
      });
      const data = await res.json();
      setXp(data.xp);
    } catch (err) {
      console.error("Failed to fetch progress", err);
    }
  };

  const startGoal = async (goal: string) => {
    setIsLoading(true);
    setSelectedGoal(goal);
    try {
      const res = await fetch(`${API_BASE}/start_module`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user?.id || 'guest', goal })
      });
      const data = await res.json();
      setCurrentModule(data.module);
      setAllModules(data.all_modules);
      setMessages([{ role: 'assistant', content: data.intro_message }]);
      setView('lab');
    } catch (err) {
      console.error("Failed to start goal", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 'guest',
          message: userMsg,
          history: messages,
          module_name: currentModule,
          goal: selectedGoal
        })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      if (data.module_complete) {
        setCurrentModule(data.next_module);
        fetchProgress();
      }
    } catch (err) {
      console.error("Chat error", err);
    } finally {
      setIsLoading(false);
    }
  };

  const runCode = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/run_code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, user_id: user?.id || 'guest' })
      });
      const data = await res.json();
      setTerminalOutput(data.output);
      
      // Also send code execution result to the tutor
      const resChat = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user?.id || 'guest',
          message: `I ran this code:\n\`\`\`python\n${code}\n\`\`\`\nOutput:\n\`\`\`\n${data.output}\n\`\`\``,
          history: messages,
          module_name: currentModule,
          goal: selectedGoal
        })
      });
      const chatData = await resChat.json();
      setMessages(prev => [...prev, { role: 'assistant', content: chatData.response }]);
    } catch (err) {
      console.error("Run code error", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (view === 'selection') {
    return (
      <div className="min-h-screen bg-[#FAFAFA] p-6 pt-12">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-extrabold text-[#1A2B3C] mb-4">
              Namaskara, <span className="text-[#FF8C00]">{user?.firstName || 'Builder'}</span>!
            </h1>
            <p className="text-2xl text-gray-600">What do you want to build today?</p>
          </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                      {[
                        { id: 'Cricket Game', title: 'Cricket Game', icon: '🏏', color: 'bg-blue-500' },
                        { id: 'Food Blog', title: 'Food Blog', icon: '🌐', color: 'bg-green-500' },
                        { id: 'Expense Tracker', title: 'Kharcha Tracker', icon: '💰', color: 'bg-orange-500' },
                        { id: 'English Adventure', title: 'English Adventure', icon: '🦁', color: 'bg-yellow-500', isVoice: true }
                      ].map((goal, idx) => (
                        <motion.button
                          key={goal.id}
                          whileHover={{ scale: 1.05, y: -5 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => goal.isVoice ? setView('english-lab') : startGoal(goal.id)}
                          className="bg-white rounded-3xl p-8 border-4 border-gray-200 hover:border-[#FF8C00] transition-all shadow-[0_8px_0_0_#E5E7EB] hover:shadow-[0_8px_0_0_#FF8C00] text-center"
                        >
                          <div className="text-7xl mb-6">{goal.icon}</div>
                          <h3 className="text-2xl font-bold text-[#1A2B3C] mb-2">{goal.title}</h3>
                          <p className="text-gray-500">
                            {goal.isVoice ? "Learn English through talking with Sogo the Lion!" : "Master Python through local logic."}
                          </p>
                        </motion.button>
                      ))}
                    </div>
          <div className="mt-16 bg-white rounded-3xl p-8 border-4 border-gray-200">
            <h2 className="text-2xl font-bold text-[#1A2B3C] mb-6 flex items-center">
              <Trophy className="mr-3 text-[#FFD700]" /> Your Skill Levels
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(xp).map(([skill, val]) => (
                <div key={skill} className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-[#1A2B3C] bg-orange-100">
                      {skill}
                    </span>
                    <span className="text-xs font-semibold inline-block text-[#FF8C00]">
                      {val} XP
                    </span>
                  </div>
                  <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-gray-100 border-2 border-gray-200">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(val, 100)}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#FF8C00]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'english-lab') {
    return <VoiceTutor scenario="Introduction" onBack={() => setView('selection')} />;
  }

  return (
    <div className="h-[calc(100vh-80px)] bg-[#FAFAFA] flex overflow-hidden">
      {/* Sidebar - Path */}
      <div className="w-64 bg-white border-r-4 border-gray-100 p-6 overflow-y-auto hidden lg:block">
        <button 
          onClick={() => setView('selection')}
          className="flex items-center text-gray-500 hover:text-[#FF8C00] mb-8 font-bold transition-colors"
        >
          <ChevronLeft size={20} /> Back
        </button>
        
        <div className="space-y-6">
          <h3 className="text-lg font-black text-[#1A2B3C] uppercase tracking-wider flex items-center">
            <Target size={20} className="mr-2 text-[#FF8C00]" /> {selectedGoal}
          </h3>
          
          <div className="space-y-4">
            {allModules.map((mod, idx) => {
              const isCurrent = mod === currentModule;
              const isPast = allModules.indexOf(currentModule) > idx;
              
              return (
                <div 
                  key={mod}
                  className={`flex items-center p-3 rounded-2xl border-2 transition-all ${ 
                    isCurrent ? 'bg-orange-50 border-[#FF8C00] scale-105 shadow-sm' : 
                    isPast ? 'bg-gray-50 border-gray-100 opacity-60' : 'border-transparent text-gray-400'
                  }`}
                >
                  {isPast ? <CheckCircle2 size={20} className="text-green-500 mr-3" /> : 
                   isCurrent ? <Circle size={20} className="text-[#FF8C00] fill-[#FF8C00] mr-3 animate-pulse" /> :
                   <Circle size={20} className="mr-3" />}
                  <span className={`font-bold text-sm ${isCurrent ? 'text-[#1A2B3C]' : ''}`}>
                    {mod}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Lab Area */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col bg-white border-r-4 border-gray-100 shadow-xl relative z-10">
          <div className="p-4 border-b-2 border-gray-50 bg-white flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                <Lightbulb size={24} className="text-[#FF8C00]" />
              </div>
              <div>
                <h4 className="font-bold text-[#1A2B3C]">Socratic Tutor</h4>
                <p className="text-xs text-green-500 font-bold flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-ping"></span> Online
                </p>
              </div>
            </div>
            <div className="bg-orange-100 px-3 py-1 rounded-full text-xs font-bold text-[#FF8C00]">
              Level 1
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence>
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-4 rounded-3xl font-medium text-lg shadow-sm ${ 
                    msg.role === 'user' 
                      ? 'bg-[#1A2B3C] text-white rounded-tr-none' 
                      : 'bg-gray-100 text-[#1A2B3C] rounded-tl-none border-2 border-gray-200'
                  }`}>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                  <div className="bg-gray-100 p-4 rounded-3xl rounded-tl-none border-2 border-gray-200 flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={chatEndRef} />
          </div>

          <div className="p-6 bg-white border-t-4 border-gray-100">
            <div className="flex space-x-3 bg-gray-50 p-2 rounded-2xl border-2 border-gray-200 focus-within:border-[#FF8C00] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your answer..."
                className="flex-1 bg-transparent border-none focus:ring-0 font-medium px-2"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading}
                className="bg-[#FF8C00] text-white p-3 rounded-xl shadow-md hover:bg-[#E67E00] active:scale-95 transition-all disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Code & Terminal Area */}
        <div className="flex-1 flex flex-col bg-[#1A2B3C]">
          {/* Editor */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center justify-between mb-2 text-white/50 text-xs font-bold uppercase tracking-widest">
              <span className="flex items-center"><Code size={14} className="mr-2" /> Python Sandbox</span>
              <button 
                onClick={runCode}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded-full flex items-center transition-colors disabled:opacity-50"
              >
                <Play size={14} className="mr-2 fill-current" /> Run Code
              </button>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 bg-[#0D1721] text-green-400 font-mono p-6 rounded-2xl border-2 border-white/10 focus:border-[#FF8C00]/50 focus:ring-0 resize-none text-lg"
              placeholder="# Write your Python code here...
print('Namaskara Bengaluru!')"
            />
          </div>

          {/* Terminal */}
          <div className="h-1/3 p-4 pt-0">
            <div className="flex items-center mb-2 text-white/30 text-xs font-bold uppercase tracking-widest">
              <TerminalIcon size={14} className="mr-2" /> Terminal Output
            </div>
            <div className="w-full h-full bg-black/40 rounded-2xl p-6 font-mono text-white/80 overflow-y-auto text-lg border-2 border-white/5">
              {terminalOutput || '> Output will appear here after you run code...'}
              {isLoading && <span className="inline-block w-2 h-4 bg-white/50 animate-pulse ml-2"></span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}