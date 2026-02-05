import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lightbulb } from 'lucide-react';
import { useState } from 'react';

export default function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'About', href: '#about' },
    { label: 'Labs', href: '#labs' },
    { label: 'Methodology', href: '#methodology' },
    { label: 'Contact', href: '#contact' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b-4 border-gray-200 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 rounded-lg bg-[#FF8C00]/20 flex items-center justify-center">
              <Lightbulb size={24} className="text-[#FF8C00]" strokeWidth={2} />
            </div>
            <span className="text-2xl font-extrabold text-[#1A2B3C] hidden sm:inline">
              SOGO
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-gray-600 font-semibold hover:text-[#FF8C00] transition-colors"
              >
                {item.label}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:block px-6 py-2.5 bg-[#FF8C00] text-white font-bold rounded-xl shadow-[0_4px_0_0_#CC7000] hover:shadow-[0_5px_0_0_#CC7000] transition-all"
            >
              Log In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? (
                <X size={28} className="text-[#1A2B3C]" />
              ) : (
                <Menu size={28} className="text-[#1A2B3C]" />
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden mt-4 pb-4 border-t-2 border-gray-100"
            >
              <div className="space-y-3 pt-4">
                {navItems.map((item) => (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    whileHover={{ x: 5 }}
                    className="block py-2 text-gray-600 font-semibold hover:text-[#FF8C00] transition-colors"
                  >
                    {item.label}
                  </motion.a>
                ))}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-3 bg-[#FF8C00] text-white font-bold rounded-xl shadow-[0_4px_0_0_#CC7000] hover:shadow-[0_5px_0_0_#CC7000] transition-all mt-4"
                >
                  Log In
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
