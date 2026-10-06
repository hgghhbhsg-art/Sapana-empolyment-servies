import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Phone, 
  ShieldCheck, 
  User, 
  Briefcase, 
  Smartphone, 
  Monitor, 
  MapPin, 
  MoreVertical, 
  Settings, 
  Info,
  Building2,
  ExternalLink,
  LogOut
} from 'lucide-react';
import { COMPANY_CONTACTS } from '../data/initialData';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const { 
    currentUser,
    logout,
    role, 
    setIsCallModalOpen, 
    mobilePreviewFrame, 
    setMobilePreviewFrame,
    setActiveTab,
    unreadChatCountAdmin,
    setIsSettingsModalOpen,
    setSettingsInitialTab
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleOpenSettings = (tab: 'settings' | 'about') => {
    setSettingsInitialTab(tab);
    setIsSettingsModalOpen(true);
    setIsDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0B1528]/95 backdrop-blur-md border-b border-[#203254] text-white">
      {/* Top micro bar for office accreditation & locations */}
      <div className="bg-[#080F1D] px-3 sm:px-6 py-1 border-b border-[#182642] flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-amber-300 font-medium shrink-0">{COMPANY_CONTACTS.licenseNo}</span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="text-slate-300 truncate">
            Head Office: <strong className="text-white">Nepalgunj (BP Chowk, Banke)</strong> · Branch: <strong className="text-white">Bhurigaun, Bardiya</strong>
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsCallModalOpen(true)}
            className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium transition-colors"
          >
            <Phone className="w-3 h-3 text-amber-400" />
            <span className="tabular-nums">+977 9716275258</span>
          </button>
        </div>
      </div>

      {/* Main Bar: Strictly structured 3-zone layout */}
      <div className="px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 max-w-7xl mx-auto">
        {/* Zone 1: Official Circular Logo + Brand Wordmark */}
        <div 
          onClick={() => {
            if (role === 'client') setActiveTab('jobs');
            else setActiveTab('admin-inquiries');
          }}
          className="cursor-pointer flex items-center gap-2.5 select-none group"
        >
          <Logo size="md" />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg tracking-tight text-white font-brand group-hover:text-amber-300 transition-colors">
                SAPANA
              </span>
              <span className="text-[10px] font-semibold text-amber-400 tracking-wider uppercase bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                Employment
              </span>
            </div>
            <p className="text-[10px] text-slate-300 -mt-0.5 hidden xs:block truncate">
              Nepalgunj - BP Chowk, Banke · Bhurigaun, Bardiya
            </p>
          </div>
        </div>

        {/* Zone 2 & 3: Actions & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Frame Switcher */}
          <button
            onClick={() => setMobilePreviewFrame(!mobilePreviewFrame)}
            title={mobilePreviewFrame ? 'Switch to Full Width View' : 'Simulate Mobile Device Frame'}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-[#142340] border border-[#243963] text-slate-300 hover:text-white transition-colors"
          >
            {mobilePreviewFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>Full View</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-amber-400" />
                <span>Mobile Frame</span>
              </>
            )}
          </button>

          {/* Quick Hotline Dial Action */}
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 hover:text-amber-200 transition-colors flex items-center gap-1.5 text-xs font-medium"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            <span className="hidden sm:inline">Call Hotline</span>
            <span className="sm:hidden">Call</span>
          </button>

          {/* User Profile Identity Pill (No manual toggle) */}
          {currentUser && (
            <div className="flex items-center gap-2 bg-[#0E1C36] px-2.5 py-1.5 rounded-xl border border-[#213866] text-xs">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[11px] ${
                role === 'admin' ? 'bg-blue-600 text-white' : 'bg-amber-400 text-slate-950'
              }`}>
                {role === 'admin' ? <Briefcase className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
              </div>
              <div className="text-left hidden sm:block">
                <span className="font-semibold text-white block text-[11px] max-w-[130px] truncate leading-tight">
                  {currentUser.name}
                </span>
                <span className={`text-[9px] font-bold uppercase tracking-wider block ${
                  role === 'admin' ? 'text-blue-400' : 'text-amber-400'
                }`}>
                  {role === 'admin' ? 'Office Staff' : 'Applicant'}
                </span>
              </div>
            </div>
          )}

          {/* Quick Logout Button */}
          <button
            onClick={logout}
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 hover:text-red-200 transition-colors flex items-center gap-1 text-xs font-semibold"
            title="Log out of current session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Sign Out</span>
          </button>

          {/* Three-Dot Menu Button & Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`min-h-[38px] min-w-[38px] flex items-center justify-center rounded-xl border transition-colors ${
                isDropdownOpen 
                  ? 'bg-[#1C3259] border-amber-400 text-amber-400' 
                  : 'bg-[#142340] hover:bg-[#1B2F54] border-[#243963] text-slate-300 hover:text-white'
              }`}
              title="More Options · App Settings & About"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4 text-amber-400" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 bg-[#0E1C36] border border-[#233C6B] rounded-2xl shadow-2xl overflow-hidden py-1 z-50 animate-fade-in divide-y divide-[#1A3159]">
                {/* User Session Info */}
                {currentUser && (
                  <div className="px-3.5 py-2.5 bg-[#091428] text-xs">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Active Session:</p>
                    <p className="font-bold text-white truncate mt-0.5">{currentUser.name}</p>
                    <span className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                      role === 'admin' ? 'bg-blue-600/20 text-blue-300' : 'bg-amber-400/20 text-amber-300'
                    }`}>
                      {role === 'admin' ? 'Office Staff / Admin' : 'Applicant'}
                    </span>
                  </div>
                )}

                {/* Section 1: Settings & About App */}
                <div className="py-1">
                  <button
                    onClick={() => handleOpenSettings('settings')}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-200 hover:bg-[#15274B] hover:text-amber-400 flex items-center gap-2.5 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-400/10 text-amber-400 flex items-center justify-center shrink-0 group-hover:bg-amber-400/20">
                      <Settings className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-white group-hover:text-amber-400">App Settings</span>
                      <span className="text-[10px] text-slate-400 block">Language, Alerts & Display</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleOpenSettings('about')}
                    className="w-full px-3.5 py-2.5 text-left text-xs text-slate-200 hover:bg-[#15274B] hover:text-amber-400 flex items-center gap-2.5 transition-colors group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-semibold block text-white group-hover:text-amber-400">About App</span>
                      <span className="text-[10px] text-slate-400 block">License 1234 & Company Info</span>
                    </div>
                  </button>
                </div>

                {/* Section 2: Quick Office Hotlines & Locations */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setIsCallModalOpen(true);
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-300 hover:bg-[#15274B] hover:text-white flex items-center gap-2 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Call Hotlines & Counseling</span>
                  </button>

                  <div className="px-3.5 py-2 text-[10px] text-slate-400 space-y-0.5">
                    <p className="flex items-center gap-1 font-semibold text-slate-300">
                      <Building2 className="w-3 h-3 text-amber-400" />
                      <span>Official Office Network:</span>
                    </p>
                    <p className="text-slate-300 pl-4">• Head Office: Nepalgunj - BP Chowk</p>
                    <p className="text-slate-300 pl-4">• Branch: Bhurigaun, Bardiya</p>
                  </div>
                </div>

                {/* Section 3: Logout Action */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 transition-colors font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out ({role === 'admin' ? 'Staff' : 'Applicant'})</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
