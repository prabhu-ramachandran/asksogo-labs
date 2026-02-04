import { motion, AnimatePresence } from 'framer-motion';
import { Code, Book, Sparkles } from 'lucide-react';
import { useState } from 'react';

type QuizChoice = 'patterns' | 'stories' | 'both' | null;

export default function CareerQuiz() {
  const [selected, setSelected] = useState<QuizChoice>(null);
  const [showResult, setShowResult] = useState(false);

  const handleChoice = (choice: QuizChoice) => {
    setSelected(choice);
    setShowResult(false);
    setTimeout(() => setShowResult(true), 300);
  };

  const getResults = () => {
    switch (selected) {
      case 'patterns':
        return {
          primary: { lab: 'Python Lab', match: 95, icon: Code, color: '#FF8C00' },
          secondary: { lab: 'English Lab', match: 40, icon: Book, color: '#1A2B3C' }
        };
      case 'stories':
        return {
          primary: { lab: 'English Lab', match: 95, icon: Book, color: '#1A2B3C' },
          secondary: { lab: 'Python Lab', match: 40, icon: Code, color: '#FF8C00' }
        };
      case 'both':
        return {
          primary: { lab: 'Python Lab', match: 88, icon: Code, color: '#FF8C00' },
          secondary: { lab: 'English Lab', match: 88, icon: Book, color: '#1A2B3C' }
        };
      default:
        return null;
    }
  };

  const results = getResults();

  return (
    <div className="bg-white rounded-3xl p-10 border-4 border-gray-200 shadow-lg">
      <div className="space-y-6 mb-8">
        <QuizButton
          selected={selected === 'patterns'}
          onClick={() => handleChoice('patterns')}
          icon="🔢"
          text="I like patterns"
        />
        <QuizButton
          selected={selected === 'stories'}
          onClick={() => handleChoice('stories')}
          icon="📚"
          text="I like stories"
        />
        <QuizButton
          selected={selected === 'both'}
          onClick={() => handleChoice('both')}
          icon="✨"
          text="I like both"
        />
      </div>

      <AnimatePresence mode="wait">
        {showResult && results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <div className="text-center mb-6">
              <Sparkles className="inline-block text-[#FF8C00] mb-2" size={32} />
              <h3 className="text-2xl font-bold text-[#1A2B3C]">Your Perfect Match!</h3>
            </div>

            <MatchCard
              lab={results.primary.lab}
              match={results.primary.match}
              icon={results.primary.icon}
              color={results.primary.color}
              isPrimary={true}
            />
            <MatchCard
              lab={results.secondary.lab}
              match={results.secondary.match}
              icon={results.secondary.icon}
              color={results.secondary.color}
              isPrimary={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuizButton({
  selected,
  onClick,
  icon,
  text
}: {
  selected: boolean;
  onClick: () => void;
  icon: string;
  text: string;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full p-6 rounded-2xl text-left font-bold text-xl transition-all duration-300 ${
        selected
          ? 'bg-[#FF8C00] text-white shadow-[0_6px_0_0_#CC7000]'
          : 'bg-gray-100 text-[#1A2B3C] border-4 border-gray-200 hover:border-[#FF8C00] shadow-[0_4px_0_0_#D1D5DB] hover:shadow-[0_6px_0_0_#FF8C00]'
      }`}
    >
      <span className="text-3xl mr-4">{icon}</span>
      {text}
    </motion.button>
  );
}

function MatchCard({
  lab,
  match,
  icon: Icon,
  color,
  isPrimary
}: {
  lab: string;
  match: number;
  icon: React.ElementType;
  color: string;
  isPrimary: boolean;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: isPrimary ? 0 : 0.2 }}
      className={`p-6 rounded-2xl border-4 ${
        isPrimary
          ? 'border-[#FF8C00] bg-gradient-to-r from-[#FF8C00]/10 to-[#FF8C00]/5'
          : 'border-gray-200 bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon size={32} style={{ color }} strokeWidth={2} />
          </div>
          <div>
            <h4 className="text-xl font-bold text-[#1A2B3C]">{lab}</h4>
            <p className="text-sm text-gray-600">
              {isPrimary ? 'Perfect match!' : 'Also great for you'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3, type: 'spring' }}
            className="text-4xl font-extrabold"
            style={{ color }}
          >
            {match}%
          </motion.div>
          <p className="text-sm text-gray-600">Match</p>
        </div>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${match}%` }}
        transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
        className="h-3 rounded-full mt-4"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
