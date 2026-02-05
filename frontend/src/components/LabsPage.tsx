import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  GitBranch, 
  Database, 
  Layout, 
  Server, 
  Code, 
  Cpu, 
  Globe, 
  Lock, 
  BarChart, 
  ArrowRight,
  CheckCircle2,
  Terminal,
  Languages,
  BookOpen
} from 'lucide-react';

export default function LabsPage() {
  const [activeTab, setActiveTab] = useState<'programming' | 'language'>('programming');

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-[#FF8C00] font-bold text-sm mb-4">
            Explore Our Labs
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A2B3C] mb-6">
            Choose Your <span className="text-[#FF8C00]">Path</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover specialized labs designed to build career-ready skills.
          </p>
        </motion.div>

        {/* Lab Collections Selector */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-24">
          <button
            onClick={() => setActiveTab('programming')}
            className={`relative p-8 rounded-3xl border-4 text-left transition-all group overflow-hidden ${
              activeTab === 'programming' 
                ? 'bg-white border-[#FF8C00] shadow-[0_8px_0_0_#CC7000]' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              activeTab === 'programming' ? 'bg-orange-100' : 'bg-gray-100 group-hover:bg-orange-50'
            }`}>
              <Terminal size={32} className={activeTab === 'programming' ? 'text-[#FF8C00]' : 'text-gray-400 group-hover:text-[#FF8C00]'} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${activeTab === 'programming' ? 'text-[#1A2B3C]' : 'text-gray-500'}`}>
              Programming Labs
            </h3>
            <p className="text-gray-500">
              Master Python, Web Development, and AI Engineering through building real apps.
            </p>
            {activeTab === 'programming' && (
              <motion.div layoutId="active-ring" className="absolute inset-0 border-4 border-[#FF8C00] rounded-3xl pointer-events-none" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('language')}
            className={`relative p-8 rounded-3xl border-4 text-left transition-all group overflow-hidden ${
              activeTab === 'language' 
                ? 'bg-white border-[#FF8C00] shadow-[0_8px_0_0_#CC7000]' 
                : 'bg-white border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${
              activeTab === 'language' ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'
            }`}>
              <Languages size={32} className={activeTab === 'language' ? 'text-blue-500' : 'text-gray-400 group-hover:text-blue-500'} />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${activeTab === 'language' ? 'text-[#1A2B3C]' : 'text-gray-500'}`}>
              Language Labs
            </h3>
            <p className="text-gray-500">
              Coming Soon: Business English and Communication skills for the global workplace.
            </p>
            {activeTab === 'language' && (
              <motion.div layoutId="active-ring" className="absolute inset-0 border-4 border-blue-500 rounded-3xl pointer-events-none" />
            )}
          </button>
        </div>

        {/* Dynamic Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'programming' ? (
            <motion.div
              key="programming"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center mb-16">
                <h2 className="text-3xl font-extrabold text-[#1A2B3C]">Programming Curriculum</h2>
                <div className="h-1 w-24 bg-[#FF8C00] mx-auto mt-4 rounded-full"></div>
              </div>

              {/* Programming Roadmap */}
              <div className="relative max-w-5xl mx-auto mb-32">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform md:-translate-x-1/2 hidden md:block" />
                
                <Level 
                  level={1}
                  title="The Junior Builder"
                  subtitle="Build Your Portfolio"
                  color="bg-blue-500"
                  icon={Code}
                  description="Start by building real tools. No boring theory. You learn logic, data, and UI by creating things you can use."
                  projects={['Gully Cricket Game', 'Food Blog Generator', 'Kharcha (Expense) Tracker']}
                  skills={['Python Logic', 'File I/O', 'Basic Data Structures', 'Git Version Control']}
                  align="left"
                />

                <Level 
                  level={2}
                  title="The Software Architect"
                  subtitle="Think Like an Engineer"
                  color="bg-purple-500"
                  icon={Server}
                  description="Move beyond scripts. Learn how to structure complex applications, manage databases, and write clean, maintainable code."
                  skills={['Backend Modules', 'Persistent SQL Databases', 'Advanced Styling', 'System Design']}
                  align="right"
                />

                <Level 
                  level={3}
                  title="The Full Stack Builder"
                  subtitle="Connect the Dots"
                  color="bg-green-500"
                  icon={Globe}
                  description="Bridge the gap between backend logic and frontend beauty. Build complete web applications that users love."
                  skills={['FastAPI / REST APIs', 'User Authentication', 'React / Modern UI', 'Cloud Deployment']}
                  align="left"
                />

                <Level 
                  level={4}
                  title="The AI Engineer"
                  subtitle="Future Proofing"
                  color="bg-orange-500"
                  icon={Cpu}
                  description="The final frontier. Integrate Machine Learning and AI agents into your apps to solve problems intelligently."
                  skills={['ML Heuristics', 'AI Agents (LangChain)', 'Scalable Architecture', 'AI Dashboards']}
                  align="right"
                />
              </div>

              {/* Active Lab CTA */}
              <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border-4 border-[#FF8C00] shadow-[0_8px_0_0_#CC7000] relative overflow-hidden text-center">
                 <div className="absolute top-0 right-0 bg-[#FF8C00] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  OPEN NOW
                </div>
                <h3 className="text-3xl font-bold text-[#1A2B3C] mb-4">Ready to Start Level 1?</h3>
                <p className="text-xl text-gray-600 mb-8">
                  The Python Logic Lab is open. Your first project: The Gully Cricket Game.
                </p>
                <Link to="/lab">
                  <button className="px-12 py-4 bg-[#1A2B3C] text-white font-bold rounded-xl hover:bg-[#2A3B4C] transition-colors inline-flex items-center">
                    Enter Python Lab <ArrowRight size={20} className="ml-2" />
                  </button>
                </Link>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="language"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="text-center py-20"
            >
              <div className="max-w-2xl mx-auto bg-white rounded-3xl p-12 border-4 border-gray-200">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BookOpen size={48} className="text-blue-500" />
                </div>
                <h2 className="text-3xl font-bold text-[#1A2B3C] mb-4">English Lab Coming Soon</h2>
                <p className="text-xl text-gray-500 mb-8">
                  We are building an immersive experience to help you master Business English through real-world scenarios.
                </p>
                <button disabled className="px-8 py-3 bg-gray-100 text-gray-400 font-bold rounded-xl cursor-not-allowed">
                  Join Waitlist
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function Level({ level, title, subtitle, description, skills, projects, color, icon: Icon, align }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      className={`relative flex flex-col md:flex-row items-center mb-16 md:mb-24 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
    >
      {/* Timeline Dot */}
      <div className={`hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full ${color} border-4 border-white shadow-lg z-10 items-center justify-center text-white font-bold text-xl`}>
        {level}
      </div>

      {/* Content Side */}
      <div className={`w-full md:w-1/2 px-6 md:px-12 ${align === 'right' ? 'text-left md:text-left' : 'text-left md:text-right'}`}>
        <div className={`flex items-center mb-4 ${align === 'right' ? 'md:justify-start' : 'md:justify-end'}`}>
          <span className={`md:hidden inline-flex w-8 h-8 rounded-full ${color} text-white items-center justify-center font-bold mr-3`}>
            {level}
          </span>
          <h3 className="text-3xl font-extrabold text-[#1A2B3C]">{title}</h3>
        </div>
        <h4 className={`text-xl font-bold ${color.replace('bg-', 'text-')} mb-4`}>{subtitle}</h4>
        <p className="text-gray-600 mb-6 text-lg leading-relaxed">
          {description}
        </p>
      </div>

      {/* Details Side (Card) */}
      <div className="w-full md:w-1/2 px-6">
        <div className="bg-white p-6 rounded-3xl border-4 border-gray-100 hover:border-gray-200 transition-colors shadow-sm">
          <div className="mb-4">
            <h5 className="font-bold text-[#1A2B3C] mb-3 flex items-center">
              <Database size={18} className="mr-2 text-gray-400" /> Skills You'll Unlock
            </h5>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-gray-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          {projects && (
            <div>
              <h5 className="font-bold text-[#1A2B3C] mb-3 flex items-center">
                <GitBranch size={18} className="mr-2 text-gray-400" /> Key Projects
              </h5>
              <ul className="space-y-2">
                {projects.map((proj: string) => (
                  <li key={proj} className="flex items-center text-sm text-gray-600">
                    <CheckCircle2 size={16} className="text-green-500 mr-2" />
                    {proj}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
