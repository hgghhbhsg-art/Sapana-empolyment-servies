import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Bookmark, 
  FileCheck2, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  ExternalLink, 
  Clock, 
  AlertCircle,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Settings,
  Info,
  LogOut
} from 'lucide-react';
import { COMPANY_CONTACTS, ASSET_IMAGES } from '../../data/initialData';
import { Logo } from '../Logo';

export const ProfileView: React.FC = () => {
  const { 
    currentUser,
    logout,
    applications, 
    vacancies, 
    savedJobIds, 
    toggleSaveJob, 
    setSelectedVacancy, 
    setActiveTab, 
    setIsCallModalOpen,
    setIsSettingsModalOpen,
    setSettingsInitialTab
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'saved' | 'rules'>('overview');

  const savedVacancies = vacancies.filter(v => savedJobIds.includes(v.id));

  return (
    <div className="pb-24 pt-3 max-w-4xl mx-auto px-3 sm:px-6 space-y-4 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-[#0E1C36] p-4 sm:p-5 rounded-2xl border border-[#203661] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg shadow-amber-500/20 shrink-0">
            {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : <User className="w-7 h-7" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {currentUser?.name || 'Applicant Candidate Profile'}
              </h1>
              <span className="text-[10px] bg-amber-400/10 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-400/20">
                Verified Candidate
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {currentUser?.phoneOrEmail ? `Contact: ${currentUser.phoneOrEmail}` : 'Sapana Employment Service Pvt. Ltd.'}
              {currentUser?.passportNumber ? ` · Passport: ${currentUser.passportNumber}` : ''}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setSettingsInitialTab('settings');
              setIsSettingsModalOpen(true);
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#142340] hover:bg-[#1B2F54] border border-[#243963] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-amber-400" />
            <span>Settings</span>
          </button>

          <button
            onClick={() => {
              setSettingsInitialTab('about');
              setIsSettingsModalOpen(true);
            }}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#142340] hover:bg-[#1B2F54] border border-[#243963] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>About App</span>
          </button>

          <button
            onClick={logout}
            className="min-h-[40px] px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="flex items-center gap-2 border-b border-[#1E345F] pb-2">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'overview'
              ? 'bg-[#15274B] text-amber-300 border border-[#233F72]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Applications & Stats
        </button>
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'saved'
              ? 'bg-[#15274B] text-amber-300 border border-[#233F72]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Saved Jobs ({savedVacancies.length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('rules')}
          className={`min-h-[38px] px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeSubTab === 'rules'
              ? 'bg-[#15274B] text-amber-300 border border-[#233F72]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Foreign Employment Rules
        </button>
      </div>

      {/* Sub-tab 1: Overview */}
      {activeSubTab === 'overview' && (
        <div className="space-y-4">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#0E1C36] p-3 rounded-xl border border-[#1E3560]">
              <span className="text-[11px] text-slate-400 block">Submitted Applications</span>
              <p className="text-2xl font-bold text-white font-mono mt-0.5 tabular-nums">
                {applications.length}
              </p>
            </div>
            <div className="bg-[#0E1C36] p-3 rounded-xl border border-[#1E3560]">
              <span className="text-[11px] text-slate-400 block">Interview Stage</span>
              <p className="text-2xl font-bold text-amber-400 font-mono mt-0.5 tabular-nums">
                {applications.filter(a => a.status === 'Interview Scheduled' || a.status === 'Interviewed').length}
              </p>
            </div>
            <div className="bg-[#0E1C36] p-3 rounded-xl border border-[#1E3560]">
              <span className="text-[11px] text-slate-400 block">Selected / Visa Flow</span>
              <p className="text-2xl font-bold text-emerald-400 font-mono mt-0.5 tabular-nums">
                {applications.filter(a => a.status === 'Selected' || a.status === 'Visa Processing').length}
              </p>
            </div>
            <div className="bg-[#0E1C36] p-3 rounded-xl border border-[#1E3560]">
              <span className="text-[11px] text-slate-400 block">Saved Vacancies</span>
              <p className="text-2xl font-bold text-blue-400 font-mono mt-0.5 tabular-nums">
                {savedVacancies.length}
              </p>
            </div>
          </div>

          {/* Quick Applications list summary */}
          <div className="bg-[#0E1C36] p-4 sm:p-5 rounded-2xl border border-[#203661] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-amber-400" />
                <span>Recent Applied Jobs</span>
              </h3>
              <button
                onClick={() => setActiveTab('applications')}
                className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
              >
                <span>View Full Tracker</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {applications.length === 0 ? (
              <p className="text-xs text-slate-400 py-3 text-center">
                You haven't applied to any vacancies yet.
              </p>
            ) : (
              <div className="space-y-2">
                {applications.slice(0, 3).map(app => (
                  <div
                    key={app.id}
                    className="p-3 rounded-xl bg-[#122244] border border-[#1E355F] flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <p className="font-bold text-white">{app.jobTitle}</p>
                      <p className="text-slate-400 text-[11px]">
                        {app.country} · Code: <span className="text-amber-400 font-mono">{app.applicationCode}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-400/10 text-amber-300 border border-amber-400/20">
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Official Agency Accreditation Card */}
          <div className="bg-gradient-to-r from-[#0C1A33] to-[#102447] p-5 rounded-2xl border border-[#213A6A] space-y-3">
            <div className="flex items-start gap-3.5">
              <Logo size="lg" />
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white font-brand">
                  {COMPANY_CONTACTS.name}
                </h3>
                <p className="text-xs text-amber-300 font-medium">
                  {COMPANY_CONTACTS.tagline}
                </p>
                <p className="text-[11px] text-slate-300 mt-1">
                  {COMPANY_CONTACTS.licenseNo} (Ministry of Labour, Employment and Social Security, Nepal)
                </p>
                <div className="mt-2 space-y-1 text-xs text-slate-200">
                  <p>
                    <strong className="text-amber-400">Head Office:</strong> {COMPANY_CONTACTS.headOffice}
                  </p>
                  <p>
                    <strong className="text-blue-300">Branch Office:</strong> {COMPANY_CONTACTS.branchOffice}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-[#1C325B]">
              <a
                href={`tel:${COMPANY_CONTACTS.hotlines[0]}`}
                className="p-2.5 rounded-xl bg-[#091428] border border-[#1E3661] text-xs flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Hotline 1: {COMPANY_CONTACTS.hotlines[0]}</span>
              </a>
              <a
                href={`tel:${COMPANY_CONTACTS.hotlines[1]}`}
                className="p-2.5 rounded-xl bg-[#091428] border border-[#1E3661] text-xs flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>Hotline 2: {COMPANY_CONTACTS.hotlines[1]}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Saved Jobs */}
      {activeSubTab === 'saved' && (
        <div className="space-y-3">
          {savedVacancies.length === 0 ? (
            <div className="p-8 text-center bg-[#0D1A33] border border-[#1E345F] rounded-2xl space-y-2">
              <p className="text-sm font-semibold text-white">No Saved Vacancies</p>
              <p className="text-xs text-slate-400">
                Tap the bookmark icon on any vacancy card to save it for quick review.
              </p>
            </div>
          ) : (
            savedVacancies.map(v => (
              <div
                key={v.id}
                className="p-4 rounded-xl bg-[#0E1C36] border border-[#203661] flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="text-[11px] text-amber-400 font-semibold">{v.country} · {v.category}</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{v.title}</h4>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Salary: <span className="font-mono text-amber-300 font-bold">{v.salaryMonthly}</span> ({v.salaryNPRApprox})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedVacancy(v)}
                    className="px-3 py-1.5 rounded-lg bg-[#15274B] hover:bg-[#1E3766] text-white text-xs font-semibold transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => toggleSaveJob(v.id)}
                    className="p-1.5 text-red-400 hover:text-red-300"
                    title="Remove"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sub-tab 3: Legal & Safety Rules */}
      {activeSubTab === 'rules' && (
        <div className="bg-[#0E1C36] p-5 rounded-2xl border border-[#203661] space-y-4 text-xs">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">
              Official Safe Migration Guidelines (नेपाल सरकार वैदेशिक रोजगार नियमहरू)
            </h3>
            <p className="text-slate-400 text-[11px]">
              Compliance guidelines governed by Department of Foreign Employment (DoFE), Nepal.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="p-3 rounded-xl bg-[#122244] border border-[#1E355F] space-y-1">
              <span className="font-bold text-amber-300 block">1. Pre-Departure Orientation & Biometrics</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Every candidate selected for overseas employment must complete the mandatory 2-day pre-departure orientation training and undergo biometrics at government-approved medical clinics.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#122244] border border-[#1E355F] space-y-1">
              <span className="font-bold text-amber-300 block">2. Foreign Employment Insurance & Welfare Fund</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                A minimum NPR 1,500 contribution to the Foreign Employment Welfare Fund and life/accidental insurance of at least NPR 15,00,000 coverage is required before labor permit (Shram Swikriti) issuance.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#122244] border border-[#1E355F] space-y-1">
              <span className="font-bold text-amber-300 block">3. Zero-Cost Bilateral Recruitment</span>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Under government agreements (like Malaysia manufacturing), the employer covers the visa stamp, flight ticket, and medical fees. No unauthorized agent commission may be collected.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
