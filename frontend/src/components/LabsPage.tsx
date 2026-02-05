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
  BookOpen,
  Fingerprint,
  Radar,
  BrainCircuit,
  Palette,
  HardDrive,
  UserCheck,
  Zap,
  Sparkles
} from 'lucide-react';

export default function LabsPage() {
  const [activeTab, setActiveTab] = useState<'programming' | 'language'>('programming');

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans pt-12 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section: Universal Vision */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-[#FF8C00] font-bold text-sm mb-4">
            The SOGO Method
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-[#1A2B3C] mb-6">
            Find Your <span className="text-[#FF8C00]">Strengths.</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            SOGO Labs are more than just courses—they are <strong>career diagnostics</strong>. 
            Whether you are building code or mastering a language, our Socratic AI analyzes your natural problem-solving style to recommend your perfect next step.
          </p>
        </motion.div>

        {/* Lab Collections Selector */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
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
              Discover your Engineering DNA through Python, Web, and Systems development.
            </p>
            {activeTab === 'programming' && (
              <motion.div layoutId="active-ring" className="absolute inset-0 border-4 border-[#FF8C00] rounded-3xl pointer-events-none" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('language')}
            className={`relative p-8 rounded-3xl border-4 text-left transition-all group overflow-hidden ${
              activeTab === 'language' 
                ? 'bg-white border-blue-500 shadow-[0_8px_0_0_#2563EB]' 
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
              Identify your Communication style for the global professional workplace.
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
              {/* Programming Specific Vision: 5 Pillars */}
              <div className="mb-16">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-[#1A2B3C]">Programming Competencies</h2>
                  <p className="text-gray-500 mt-2">We track these 5 pillars to build your Engineering DNA profile.</p>
                </div>
                <div className="grid md:grid-cols-5 gap-4 max-w-6xl mx-auto">
                  <Pillar 
                    icon={BrainCircuit} 
                    color="text-purple-500" 
                    bg="bg-purple-50" 
                    title="Algorithmic Logic" 
                    desc="Solving complex puzzles efficiently." 
                  />
                  <Pillar 
                    icon={Palette} 
                    color="text-pink-500" 
                    bg="bg-pink-50" 
                    title="Product Engineering" 
                    desc="Crafting intuitive user experiences." 
                  />
                  <Pillar 
                    icon={Database} 
                    color="text-blue-500" 
                    bg="bg-blue-50" 
                    title="Data Strategy" 
                    desc="Structuring and managing information." 
                  />
                  <Pillar 
                    icon={HardDrive} 
                    color="text-slate-600" 
                    bg="bg-slate-100" 
                    title="Systems Arch." 
                    desc="Building scalable infrastructure." 
                  />
                  <Pillar 
                    icon={Fingerprint} 
                    color="text-orange-500" 
                    bg="bg-orange-50" 
                    title="Predictive Intuition" 
                    desc="Foundations of automated reasoning." 
                  />
                </div>
              </div>

              {/* Programming Roadmap */}
              <div className="relative max-w-5xl mx-auto mb-32">
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 transform md:-translate-x-1/2 hidden md:block" />
                
                <Level 
                  level={1}
                  title="The Generalist Builder"
                  subtitle="Discovery Phase"
                  color="bg-blue-500"
                  icon={Code}
                  description="We throw you into the deep end. You'll touch Logic, UI, and Data. We watch where you struggle and where you shine."
                  projects={['Gully Cricket (Logic)', 'Food Blog (Product)', 'Kharcha Tracker (Data)']}
                  skills={['Python Basics', 'File Management', 'Version Control']}
                  align="left"
                />

                <Level 
                  level={2}
                  title="The Systems Architect"
                  subtitle="Backend Focus"
                  color="bg-purple-500"
                  icon={Server}
                  description="For those who love order and efficiency. Learn to structure complex applications and manage data flow."
                  skills={['Modular Design', 'SQL Databases', 'API Structure', 'Security Basics']}
                  align="right"
                />

                <Level 
                  level={3}
                  title="The Product Engineer"
                  subtitle="Frontend Focus"
                  color="bg-green-500"
                  icon={Globe}
                  description="For those who care about the user. Connect your logic to a visual interface and master the art of usability."
                  skills={['Modern UI Frameworks', 'State Management', 'User Flow', 'Accessibility']}
                  align="left"
                />

                <Level 
                  level={4}
                  title="The AI-Ready Developer"
                  subtitle="Integration Phase"
                  color="bg-orange-500"
                  icon={Cpu}
                  description="The foundation is laid. Now you integrate basic intelligence. You aren't an AI researcher yet, but you know how to wield AI tools."
                  skills={['LLM Integration', 'Prompt Engineering', 'Automated Reasoning', 'Smart Dashboards']}
                  align="right"
                />
              </div>

              {/* Active Lab CTA */}
              <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 border-4 border-[#FF8C00] shadow-[0_8px_0_0_#CC7000] relative overflow-hidden text-center">
                 <div className="absolute top-0 right-0 bg-[#FF8C00] text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                  OPEN NOW
                </div>
                <h3 className="text-3xl font-bold text-[#1A2B3C] mb-4">Start Your Diagnosis</h3>
                <p className="text-xl text-gray-600 mb-8">
                  The Python Logic Lab is open. Start building and let us find your strength.
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
            >
              {/* Language Specific Vision: Placeholder Pillars */}
              <div className="mb-16">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-extrabold text-[#1A2B3C]">Communication Competencies</h2>
                  <p className="text-gray-500 mt-2">Identifying your professional voice in the global workplace.</p>
                </div>
                <div className="grid md:grid-cols-4 gap-4 max-w-5xl mx-auto">
                  <Pillar 
                    icon={BookOpen} 
                    color="text-blue-500" 
                    bg="bg-blue-50" 
                    title="Grammar Mastery" 
                    desc="Structural precision in writing." 
                  />
                  <Pillar 
                    icon={Zap} 
                    color="text-yellow-500" 
                    bg="bg-yellow-50" 
                    title="Contextual Vocab" 
                    desc="Choosing the right words for the right room." 
                  />
                  <Pillar 
                    icon={UserCheck} 
                    color="text-green-500" 
                    bg="bg-green-50" 
                    title="Professional Tone" 
                    desc="Conveying confidence and respect." 
                  />
                  <Pillar 
                    icon={Sparkles} 
                    color="text-purple-500" 
                    bg="bg-purple-50" 
                    title="Narrative Flow" 
                    desc="Connecting ideas into compelling stories." 
                  />
                </div>
              </div>

              <div className="text-center py-10">
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function Pillar({ icon: Icon, title, desc, color, bg }: any) {
  return (
    <div className={`p-4 rounded-2xl ${bg} text-center transition-all hover:scale-105 border-2 border-transparent hover:border-white shadow-sm`}>
      <div className="flex justify-center mb-3">
        <Icon size={32} className={color} />
      </div>
      <h4 className="font-bold text-[#1A2B3C] text-sm mb-1">{title}</h4>
      <p className="text-xs text-gray-500 leading-tight">{desc}</p>
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
              <Database size={18} className="mr-2 text-gray-400" /> Competencies Tested
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
                <GitBranch size={18} className="mr-2 text-gray-400" /> Diagnostic Projects
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
