import React from 'react';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { Link, Outlet } from 'react-router-dom';
import { Lightbulb } from 'lucide-react';

export default function Layout() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <header className="h-20 px-6 flex justify-between items-center border-b-2 border-gray-100 bg-white sticky top-0 z-50">
        <Link to="/" className="flex items-center space-x-2">
          <Lightbulb className="text-[#FF8C00]" size={32} />
          <span className="font-bold text-2xl text-[#1A2B3C]">AskSOGO</span>
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <a href="/#about" className="text-gray-600 font-semibold hover:text-[#FF8C00] transition-colors">About</a>
          <Link to="/labs" className="text-gray-600 font-semibold hover:text-[#FF8C00] transition-colors">Labs</Link>
          <a href="/#methodology" className="text-gray-600 font-semibold hover:text-[#FF8C00] transition-colors">Methodology</a>
          <a href="/#contact" className="text-gray-600 font-semibold hover:text-[#FF8C00] transition-colors">Contact</a>
        </div>

        <div className="flex items-center space-x-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-[#FF8C00] text-white px-6 py-2 rounded-xl font-bold shadow-[0_4px_0_0_#CC7000] hover:shadow-[0_2px_0_0_#CC7000] active:translate-y-[2px] active:shadow-none transition-all">
                Login
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link to="/lab" className="mr-4 font-bold text-[#1A2B3C] hover:text-[#FF8C00]">
              My Lab
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
