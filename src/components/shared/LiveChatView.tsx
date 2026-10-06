import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  Phone, 
  ShieldCheck, 
  User, 
  Briefcase, 
  HelpCircle, 
  Trash2,
  CheckCheck
} from 'lucide-react';
import { COMPANY_CONTACTS } from '../../data/initialData';
import { Logo } from '../Logo';

const COMMON_QUICK_QUESTIONS = [
  'What documents are needed for Greece warehouse?',
  'Is Malaysia recruitment 100% zero-cost?',
  'What are the minimum height criteria for UAE security?',
  'Can I visit your Nepalgunj BP Chowk office tomorrow?',
];

export const LiveChatView: React.FC = () => {
  const { 
    role, 
    chatMessages, 
    sendChatMessage, 
    clearChatHistory, 
    setIsCallModalOpen 
  } = useApp();

  const [inputVal, setInputVal] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    if (role === 'admin') {
      sendChatMessage(inputVal.trim(), 'staff', 'Officer (Sapana Office Desk)');
    } else {
      sendChatMessage(inputVal.trim(), 'client', 'Applicant');
    }
    setInputVal('');
  };

  const handleQuickQuestion = (q: string) => {
    sendChatMessage(q, 'client', 'Applicant');
  };

  return (
    <div className="pb-24 pt-3 max-w-3xl mx-auto px-3 sm:px-6 h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      {/* Chat Header */}
      <div className="bg-[#0E1C36] p-3.5 sm:p-4 rounded-2xl border border-[#203661] shadow-lg flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Logo size="sm" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#0E1C36]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Sapana Office Live Support
              </h2>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold px-1.5 py-0.5 rounded border border-emerald-500/30">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Govt. Lic. 1234/078/079 · Nepalgunj & Bhurigaun Desks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden xs:inline">Call Hotline</span>
          </button>
          <button
            onClick={clearChatHistory}
            title="Reset Chat"
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto bg-[#0A162B] border border-[#1C325B] rounded-2xl p-4 space-y-3">
        {/* Security badge at top */}
        <div className="p-2.5 rounded-xl bg-[#0D1A33] border border-[#1E3560] text-center max-w-sm mx-auto text-[11px] text-slate-400">
          <p className="flex items-center justify-center gap-1.5 text-amber-400 font-semibold mb-0.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Recruitment Support</span>
          </p>
          Never share banking PINs or OTPs. Consultations and initial candidate reviews are free of charge.
        </div>

        {chatMessages.map((msg) => {
          const isMe = (role === 'admin' && msg.sender === 'staff') || (role === 'client' && msg.sender === 'client');
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 max-w-md mx-auto my-2 text-center">
                <p className="font-semibold text-amber-300 text-[11px]">{msg.senderName}</p>
                <p className="mt-1 leading-relaxed">{msg.text}</p>
                <span className="text-[9px] text-amber-300/60 block mt-1">{msg.timestamp}</span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1">
                <span>{msg.senderName}</span>
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isMe
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-medium rounded-tr-none shadow-md shadow-amber-500/10'
                    : 'bg-[#122346] text-slate-100 border border-[#203966] rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Question Chips (Only for Client) */}
      {role === 'client' && (
        <div className="py-2 flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar shrink-0">
          {COMMON_QUICK_QUESTIONS.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickQuestion(q)}
              className="text-[11px] bg-[#101F3E] hover:bg-[#162B54] text-slate-300 hover:text-amber-300 border border-[#203661] rounded-full px-3 py-1 whitespace-nowrap transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSend} className="pt-2 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={
            role === 'admin'
              ? 'Reply as Sapana Office Staff...'
              : 'Ask a question regarding jobs, visa, or interview...'
          }
          className="flex-1 px-4 py-3 bg-[#0E1C36] border border-[#213966] rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400/80 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="min-h-[44px] min-w-[44px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold flex items-center justify-center disabled:opacity-40 transition-all shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
