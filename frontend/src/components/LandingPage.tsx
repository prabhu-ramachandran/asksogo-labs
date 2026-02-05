import { motion } from 'framer-motion';
import { Lightbulb, BookOpen, Puzzle, Sparkles, Brain, Target, Zap } from 'lucide-react';
import CareerQuiz from './CareerQuiz';
import Navigation from './Navigation';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <Navigation />
      <HeroSection />
      <ProblemSolutionSection />
      <CareerDiscoverySection />
      <MethodologySection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 py-20 pt-32 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
            className="inline-block mb-8"
          >
            <div className="relative">
              <Lightbulb
                size={120}
                className="text-[#FF8C00] drop-shadow-2xl"
                strokeWidth={1.5}
                fill="#FFD700"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -top-2 -right-2"
              >
                <Sparkles size={24} className="text-[#FF8C00]" />
              </motion.div>
            </div>
          </motion.div>

          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-[#1A2B3C] mb-6 leading-tight">
            Stop Memorizing.<br />
            <span className="text-[#FF8C00]">Start Asking.</span>
          </h1>

          <p className="text-2xl md:text-3xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            The Socratic AI Lab for the next generation of Indian builders.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95, y: 2 }}
            className="chunky-button bg-[#FF8C00] text-white px-12 py-6 text-2xl font-bold rounded-2xl shadow-[0_8px_0_0_#CC7000] hover:shadow-[0_6px_0_0_#CC7000] active:shadow-[0_2px_0_0_#CC7000] transition-all"
          >
            Enter the Lab
          </motion.button>
        </motion.div>
      </div>

      <div className="absolute inset-0 -z-0 opacity-30">
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FF8C00] rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-[#1A2B3C] rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}

function ProblemSolutionSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-10 border-4 border-gray-200 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <div className="flex items-center justify-center mb-6">
              <BookOpen size={80} className="text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-bold text-gray-500 mb-4 text-center">
              The Old Way
            </h3>
            <ul className="space-y-3 text-lg text-gray-600">
              <li className="flex items-start">
                <span className="mr-3">❌</span>
                <span>Rote memorization without understanding</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">❌</span>
                <span>Passive learning from boring textbooks</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">❌</span>
                <span>No clarity on career paths</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">❌</span>
                <span>One-size-fits-all teaching methods</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl p-10 border-4 border-[#FF8C00] shadow-[0_8px_0_0_#CC7000] hover:shadow-[0_12px_0_0_#CC7000] transition-all duration-300"
          >
            <div className="flex items-center justify-center mb-6">
              <Puzzle size={80} className="text-[#FF8C00]" strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-bold text-[#1A2B3C] mb-4 text-center">
              The SOGO Way
            </h3>
            <ul className="space-y-3 text-lg text-gray-700">
              <li className="flex items-start">
                <span className="mr-3">✓</span>
                <span>Learn by asking questions, not answers</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✓</span>
                <span>Interactive, AI-powered Socratic method</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✓</span>
                <span>Discover careers through active learning</span>
              </li>
              <li className="flex items-start">
                <span className="mr-3">✓</span>
                <span>Personalized paths for every learner</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CareerDiscoverySection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#FAFAFA] to-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl md:text-6xl font-extrabold text-[#1A2B3C] mb-4">
            Which Lab is for <span className="text-[#FF8C00]">you?</span>
          </h2>
          <p className="text-xl text-gray-600">
            Take our quick discovery quiz and find your perfect learning path
          </p>
        </motion.div>

        <CareerQuiz />
      </div>
    </section>
  );
}

function MethodologySection() {
  const methods = [
    {
      icon: Brain,
      title: 'Socratic Questioning',
      description: 'We don\'t give you answers. We guide you to discover them yourself through strategic questions that build critical thinking.',
      color: '#FF8C00'
    },
    {
      icon: Zap,
      title: 'Active Logic',
      description: 'Every lesson is interactive. You\'re not watching - you\'re doing, building, and solving real problems that matter.',
      color: '#1A2B3C'
    },
    {
      icon: Target,
      title: 'Career Clarity',
      description: 'Learn skills tied to real careers. Whether it\'s Python for data science or English for business - see the path ahead.',
      color: '#FF8C00'
    }
  ];

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-5xl md:text-6xl font-extrabold text-[#1A2B3C] mb-16 text-center"
        >
          How <span className="text-[#FF8C00]">SOGO</span> Works
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {methods.map((method, index) => (
            <motion.div
              key={index}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-3xl p-8 border-4 border-gray-200 hover:border-[#FF8C00] transition-all duration-300 hover:shadow-[0_8px_0_0_#CC7000]"
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#FF8C00]/10 flex items-center justify-center">
                  <method.icon size={40} style={{ color: method.color }} strokeWidth={2} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-[#1A2B3C] mb-4 text-center">
                {method.title}
              </h3>
              <p className="text-gray-600 text-center leading-relaxed">
                {method.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-[#1A2B3C] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-lg leading-relaxed opacity-90">
          Built for efficiency. Low data. Runs on any browser.<br />
          <span className="font-semibold text-[#FF8C00]">
            A social initiative for educational equity.
          </span>
        </p>
        <div className="mt-6 text-sm opacity-70">
          AskSOGO.org - Empowering the next generation of Indian builders
        </div>
      </div>
    </footer>
  );
}
