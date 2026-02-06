import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowLeft, Sparkles, Star } from 'lucide-react';
import { useUser } from "@clerk/clerk-react";

const API_BASE = import.meta.env.VITE_BACKEND_URL || "/api";

interface VoiceTutorProps {
  scenario: string;
  onBack: () => void;
}

export default function VoiceTutor({ scenario, onBack }: VoiceTutorProps) {
  const { user } = useUser();
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiText, setAiText] = useState('Hello! I am Sogo. Ready to play?');
  const [error, setError] = useState('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const synth = window.speechSynthesis;

  const speak = (text: string) => {
    if (!synth) return;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.pitch = 1.2;
    utterance.rate = 0.9;
    
    const voices = synth.getVoices();
    const googleVoice = voices.find(v => v.name.includes('Google') && v.lang.startsWith('en'));
    if (googleVoice) utterance.voice = googleVoice;

    setAiText(text);
    synth.speak(utterance);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await sendAudioToBackend(audioBlob);
        
        // Stop all tracks to release mic
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
      setError('');
    } catch (err) {
      console.error("Mic Error:", err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    // Filename must end in .wav for Groq to accept it easily
    formData.append("audio", audioBlob, "recording.wav");
    formData.append("user_id", user?.id || "guest");
    formData.append("history", JSON.stringify([])); // Todo: Track history
    formData.append("module_name", "Level 0");
    formData.append("goal", "English Adventure");

    try {
      const res = await fetch(`${API_BASE}/voice_chat`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Backend error");

      const data = await res.json();
      setTranscript(data.transcription);
      speak(data.response);
    } catch (err) {
      console.error("API Error:", err);
      setError("Sorry, I couldn't understand that.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#FAFAFA] z-[60] flex flex-col items-center p-6">
      {/* Top Bar */}
      <div className="w-full max-w-2xl flex justify-between items-center mb-8">
        <button 
          onClick={onBack}
          className="p-3 rounded-2xl bg-white border-2 border-gray-100 text-gray-500 hover:text-[#FF8C00] transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center space-x-2 bg-orange-100 px-4 py-2 rounded-full">
          <Star className="text-[#FF8C00] fill-[#FF8C00]" size={20} />
          <span className="font-bold text-[#FF8C00]">Level 0</span>
        </div>
      </div>

      {/* AI Avatar Area */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl text-center">
        <motion.div
          animate={isSpeaking ? { 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          } : {}}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-48 h-48 bg-[#FF8C00] rounded-full flex items-center justify-center mb-8 shadow-2xl relative"
        >
          <Sparkles className="text-white absolute -top-4 -right-4" size={40} />
          <span className="text-8xl">🦁</span>
        </motion.div>

        <div className="bg-white p-8 rounded-3xl border-4 border-gray-100 shadow-sm mb-12 w-full min-h-[150px] flex items-center justify-center relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-white border-t-4 border-l-4 border-gray-100 rotate-45"></div>
          <p className="text-3xl font-bold text-[#1A2B3C] leading-tight">
            {aiText}
          </p>
        </div>

        {/* User Transcript */}
        <AnimatePresence>
          {(transcript || isProcessing) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8"
            >
              <p className="text-xl text-gray-400 font-medium italic">
                {isProcessing ? "Thinking..." : `" ${transcript} "`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {error && (
          <p className="text-red-500 font-bold mb-4">{error}</p>
        )}
      </div>

      {/* Interaction Button */}
      <div className="w-full max-w-md pb-12">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.9 }}
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`w-full py-8 rounded-3xl text-white font-black text-2xl flex flex-col items-center justify-center shadow-[0_12px_0_0_#CC7000] active:shadow-none active:translate-y-2 transition-all ${
            isListening ? 'bg-red-500 shadow-[0_12px_0_0_#991B1B]' : 'bg-[#FF8C00]'
          } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isProcessing}
        >
          {isListening ? (
            <>
              <div className="flex space-x-2 mb-2">
                {[1, 2, 3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [20, 40, 20] }}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className="w-2 bg-white rounded-full"
                  />
                ))}
              </div>
              LISTENING...
            </>
          ) : (
            <>
              <Mic size={48} className="mb-2" />
              HOLD TO SPEAK
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}