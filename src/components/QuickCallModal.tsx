import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Phone, MessageCircle, MapPin, Clock, ShieldCheck, ExternalLink, Building2 } from 'lucide-react';
import { COMPANY_CONTACTS } from '../data/initialData';
import { Logo } from './Logo';

export const QuickCallModal: React.FC = () => {
  const { isCallModalOpen, setIsCallModalOpen } = useApp();

  if (!isCallModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-[#0D1B34] border border-[#233B6B] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Grab bar on mobile */}
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Header with Official Logo */}
        <div className="px-5 py-3 border-b border-[#1E355F] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Direct Call & Support</h3>
              <p className="text-[11px] text-amber-400 font-medium">Sapana Employment Service Pvt. Ltd.</p>
            </div>
          </div>
          <button
            onClick={() => setIsCallModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#162747] hover:bg-[#203763] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Quick Notice */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200/90 text-xs flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">Govt. Registered Agency (Nepal Lic. 1234/078/079)</p>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Visit our offices or call our recruitment counselors for verified overseas vacancy guidance.
              </p>
            </div>
          </div>

          {/* Primary Call Action 1: +9779716275258 */}
          <div className="bg-[#122244] border border-[#213866] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                  Head Office Hotline (Nepalgunj)
                </span>
                <p className="text-lg font-bold text-white font-mono tracking-tight">
                  +977 9716275258
                </p>
                <p className="text-xs text-slate-400">
                  Counseling · Greece, Malaysia & UAE Vacancies
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:+9779716275258"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold text-xs shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Hotline</span>
              </a>
              <a
                href="https://wa.me/9779716275258"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-lg bg-[#1F8A4D] hover:bg-[#1C7B44] text-white font-medium text-xs active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Call Action 2: +9779716748601 */}
          <div className="bg-[#122244] border border-[#213866] rounded-xl p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-blue-400">
                  Branch & Document Desk (Bhurigaun)
                </span>
                <p className="text-lg font-bold text-white font-mono tracking-tight">
                  +977 9716748601
                </p>
                <p className="text-xs text-slate-400">
                  Application Status · Medical & Flight Inquiries
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href="tel:+9779716748601"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs active:scale-[0.98] transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Support</span>
              </a>
              <a
                href="https://wa.me/9779716748601"
                target="_blank"
                rel="noreferrer"
                className="min-h-[44px] flex items-center justify-center gap-2 rounded-lg bg-[#1F8A4D] hover:bg-[#1C7B44] text-white font-medium text-xs active:scale-[0.98] transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Office Locations */}
          <div className="bg-[#0A162B] rounded-xl p-3.5 border border-[#1A2E54] text-xs text-slate-300 space-y-3">
            {/* Head office */}
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>Head Office:</span>
                  <span className="text-amber-400 font-semibold">Nepalgunj - BP Chowk, Banke</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{COMPANY_CONTACTS.headOffice}</p>
              </div>
            </div>

            {/* Branch office */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#182845]">
              <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>Branch Office:</span>
                  <span className="text-blue-300 font-semibold">Bhurigaun, Bardiya</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">{COMPANY_CONTACTS.branchOffice}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#182845]">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-slate-200">Counseling Office Hours</p>
                <p className="text-[11px] text-slate-400">{COMPANY_CONTACTS.workingHours}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1E355F] bg-[#0A1528] flex justify-end">
          <button
            onClick={() => setIsCallModalOpen(false)}
            className="w-full min-h-[44px] rounded-lg bg-[#192B4D] hover:bg-[#213761] text-slate-300 text-xs font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
