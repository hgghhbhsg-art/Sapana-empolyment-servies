import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Send, Phone, MessageSquare, ShieldCheck, CheckCheck, Trash2 } from 'lucide-react';
import { COMPANY_CONTACTS } from '../../data/initialData';

const STAFF_CANNED_REPLIES = [
  'Namaste! Please bring your original passport and 8 PP size photos to our Battisputali office for verification.',
  'Your application has been shortlisted for the client video interview! Please check your SMS for the Zoom link.',
  'This vacancy is 100% Zero Cost under government bilateral agreement. Air ticket and visa are paid by the employer.',
  'Please visit our office between 9:30 AM and 5:00 PM (Sunday to Friday) with your citizenship and passport.',
];

export const AdminChatView: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChatHistory, setIsCallModalOpen } = useApp();
  const [inputVal, setInputVal] = useState('');
  const [officerName, setOfficerName] = useState('Senior Counselor (Sapana Desk)');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    sendChatMessage(inputVal.trim(), 'staff', officerName);
    setInputVal('');
  };

  const handleCannedClick = (reply: string) => {
    setInputVal(reply);
  };

  return (
    <div className="pb-24 pt-3 max-w-4xl mx-auto px-3 sm:px-6 h-[calc(100vh-120px)] flex flex-col animate-fade-in">
      {/* Admin Chat Top Bar */}
      <div className="bg-[#0E1C36] p-3.5 sm:p-4 rounded-2xl border border-[#203661] shadow-lg flex items-center justify-between shrink-0 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            Staff
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
                Applicant Live Chat Management
              </h2>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded border border-blue-500/30">
                Staff Console
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Responding as: <span className="text-amber-400 font-medium">{officerName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="min-h-[38px] px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Office Hotlines</span>
          </button>
          <button
            onClick={clearChatHistory}
            title="Clear Chat Logs"
            className="p-2 text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto bg-[#0A162B] border border-[#1C325B] rounded-2xl p-4 space-y-3">
        {chatMessages.map(msg => {
          const isStaff = msg.sender === 'staff';
          const isClient = msg.sender === 'client';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 max-w-md mx-auto text-center my-1">
                <span className="font-semibold text-amber-300 text-[10px] block">{msg.senderName}</span>
                <p className="mt-0.5 leading-relaxed">{msg.text}</p>
                <span className="text-[9px] text-amber-300/60 block mt-1 font-mono">{msg.timestamp}</span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isStaff ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-0.5 px-1">
                <span className={isClient ? 'text-amber-400 font-medium' : 'text-blue-300 font-medium'}>
                  {msg.senderName}
                </span>
                <span>·</span>
                <span className="font-mono">{msg.timestamp}</span>
              </div>
              <div
                className={`max-w-[85%] sm:max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                  isStaff
                    ? 'bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-600/10'
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

      {/* Staff Canned Responses Bar */}
      <div className="py-2 space-y-1 shrink-0">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block px-1">
          Quick Response Templates (Click to paste into input):
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none no-scrollbar">
          {STAFF_CANNED_REPLIES.map((rep, idx) => (
            <button
              key={idx}
              onClick={() => handleCannedClick(rep)}
              className="text-[11px] bg-[#101F3E] hover:bg-[#162B54] text-slate-300 hover:text-white border border-[#203661] rounded-lg px-2.5 py-1 whitespace-nowrap transition-colors"
            >
              Template #{idx + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Input Form */}
      <form onSubmit={handleSend} className="pt-1 flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Type official reply to applicant..."
          className="flex-1 px-4 py-3 bg-[#0E1C36] border border-[#213966] rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
        />
        <button
          type="submit"
          disabled={!inputVal.trim()}
          className="min-h-[44px] px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-40 transition-all shadow-md active:scale-95"
        >
          <span>Send Reply</span>
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
