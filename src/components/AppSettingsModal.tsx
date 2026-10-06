import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Settings, 
  Info, 
  ShieldCheck, 
  Globe2, 
  Bell, 
  Volume2, 
  Coins, 
  Trash2, 
  Phone, 
  MapPin, 
  Building2, 
  ExternalLink, 
  Check, 
  Sparkles,
  Smartphone
} from 'lucide-react';
import { COMPANY_CONTACTS } from '../data/initialData';
import { Logo } from './Logo';

export const AppSettingsModal: React.FC = () => {
  const { 
    isSettingsModalOpen, 
    setIsSettingsModalOpen, 
    settingsInitialTab,
    language,
    setLanguage,
    vacancyAlerts,
    setVacancyAlerts,
    currencyDisplay,
    setCurrencyDisplay,
    soundHaptics,
    setSoundHaptics,
    setIsCallModalOpen,
    setActiveTab
  } = useApp();

  const [activeTab, setActiveTabLocal] = useState<'settings' | 'about'>(settingsInitialTab);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Sync with initial tab when opened
  React.useEffect(() => {
    setActiveTabLocal(settingsInitialTab);
  }, [settingsInitialTab, isSettingsModalOpen]);

  if (!isSettingsModalOpen) return null;

  const handleConfirmReset = () => {
    localStorage.removeItem('sapana_saved_jobs_v1');
    setShowConfirmReset(false);
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-[#0D1A33] border border-[#233C6B] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-[#1E3661] flex items-center justify-between bg-[#0A162B]">
          <div className="flex items-center gap-2.5">
            <Logo size="sm" />
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                {activeTab === 'settings' ? 'App Settings' : 'About Sapana Employment'}
              </h3>
              <p className="text-[10px] text-amber-400 font-medium">
                Sapana Employment Service Pvt. Ltd.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="w-8 h-8 rounded-full bg-[#162747] hover:bg-[#203763] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Segmented Tab Switcher */}
        <div className="p-3 bg-[#0B152B] border-b border-[#1A2E55] flex items-center gap-2">
          <button
            onClick={() => setActiveTabLocal('settings')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'settings'
                ? 'bg-[#15274B] text-amber-400 border border-[#233F72] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>App Settings</span>
          </button>
          <button
            onClick={() => setActiveTabLocal('about')}
            className={`flex-1 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'about'
                ? 'bg-[#15274B] text-amber-400 border border-[#233F72] shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>About App & Company</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {activeTab === 'settings' ? (
            /* ================= SETTINGS TAB ================= */
            <div className="space-y-4 text-xs">
              {/* 1. Language Preference */}
              <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1E3661] space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="font-bold text-white">Application Language / भाषा</p>
                      <p className="text-[11px] text-slate-400">Choose preferred interface language</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    onClick={() => setLanguage('en')}
                    className={`py-2 px-3 rounded-lg border font-medium flex items-center justify-between transition-all ${
                      language === 'en'
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-[#142345] border-[#223966] text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>English (International)</span>
                    {language === 'en' && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => setLanguage('ne')}
                    className={`py-2 px-3 rounded-lg border font-medium flex items-center justify-between transition-all ${
                      language === 'ne'
                        ? 'bg-amber-400 text-slate-950 font-bold border-amber-400'
                        : 'bg-[#142345] border-[#223966] text-slate-300 hover:text-white'
                    }`}
                  >
                    <span>नेपाली (Nepali)</span>
                    {language === 'ne' && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 2. Notifications & Job Alerts */}
              <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1E3661] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Vacancy & Interview Alerts</p>
                    <p className="text-[11px] text-slate-400">Receive notices when new European/Gulf jobs open</p>
                  </div>
                </div>
                <button
                  onClick={() => setVacancyAlerts(!vacancyAlerts)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    vacancyAlerts ? 'bg-emerald-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* 3. Salary & Currency Display Format */}
              <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1E3661] space-y-2">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-amber-400" />
                  <div>
                    <p className="font-bold text-white">Salary Currency Display</p>
                    <p className="text-[11px] text-slate-400">How monthly salaries are displayed on vacancy cards</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-1.5 pt-1">
                  {[
                    { id: 'both', label: 'Foreign + NPR' },
                    { id: 'foreign', label: 'Euro / Gulf Only' },
                    { id: 'npr', label: 'NPR Approx Only' },
                  ].map((curr) => (
                    <button
                      key={curr.id}
                      onClick={() => setCurrencyDisplay(curr.id as any)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium border text-center transition-all ${
                        currencyDisplay === curr.id
                          ? 'bg-blue-600 text-white font-bold border-blue-500 shadow-sm'
                          : 'bg-[#142345] border-[#223966] text-slate-300 hover:text-white'
                      }`}
                    >
                      {curr.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Sound & Tactile Haptics */}
              <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1E3661] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Sound Feedback</p>
                    <p className="text-[11px] text-slate-400">Play subtle audio chime on message delivery</p>
                  </div>
                </div>
                <button
                  onClick={() => setSoundHaptics(!soundHaptics)}
                  className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                    soundHaptics ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                  }`}
                >
                  <span className="w-5 h-5 rounded-full bg-white shadow-md" />
                </button>
              </div>

              {/* 5. Theme Identity */}
              <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1E3661] flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">Corporate Brand Theme</p>
                  <p className="text-[11px] text-amber-400/90 font-medium">Deep Navy Blue & Royal Gold</p>
                </div>
                <div className="flex items-center gap-1.5 bg-[#0C172C] px-2.5 py-1 rounded-lg border border-[#223A69]">
                  <span className="w-3 h-3 rounded-full bg-[#0A162B] border border-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="text-[10px] text-slate-300 font-semibold ml-1">Official</span>
                </div>
              </div>

              {/* 6. Clear Cache / Reset */}
              <div className="pt-2">
                {!showConfirmReset ? (
                  <button
                    onClick={() => setShowConfirmReset(true)}
                    className="w-full py-2.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Reset Bookmarks & Local Settings</span>
                  </button>
                ) : (
                  <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 space-y-2">
                    <p className="text-xs text-red-200">
                      Clear saved job bookmarks and reset preferences? Submitted applications will remain safe.
                    </p>
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setShowConfirmReset(false)}
                        className="px-3 py-1.5 rounded-lg bg-[#142340] text-slate-300 hover:text-white text-xs font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmReset}
                        className="px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
                      >
                        Confirm Reset
                      </button>
                    </div>
                  </div>
                )}
                {resetSuccess && (
                  <p className="text-[11px] text-emerald-400 text-center mt-1.5">
                    ✓ Cache cleared and preferences reset successfully.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* ================= ABOUT APP TAB ================= */
            <div className="space-y-4 text-xs">
              {/* Official Corporate Lockup */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C1A33] via-[#102447] to-[#0A162B] border border-[#233B6B] text-center space-y-2">
                <div className="flex justify-center">
                  <Logo size="xl" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white font-brand">
                    {COMPANY_CONTACTS.name}
                  </h2>
                  <p className="text-xs text-amber-400 font-semibold mt-0.5">
                    {COMPANY_CONTACTS.tagline}
                  </p>
                  <span className="inline-block mt-1 bg-amber-400/10 text-amber-300 font-mono text-[11px] font-semibold px-2 py-0.5 rounded border border-amber-400/20">
                    {COMPANY_CONTACTS.licenseNo}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 max-w-sm mx-auto leading-relaxed pt-1">
                  Government authorized recruitment agency dedicated to ethical manpower solutions, connecting Nepalese talent with European, Gulf, and Southeast Asian employers.
                </p>
              </div>

              {/* Office Locations */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Office Locations in Nepal:
                </span>
                <div className="bg-[#101F3E] p-3 rounded-xl border border-[#1E3661] space-y-2">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">
                        Head Office: <span className="text-amber-400">Nepalgunj - BP Chowk, Banke</span>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        BP Chowk, Nepalgunj, Banke District, Lumbini Province, Nepal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 pt-2 border-t border-[#182845]">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-white">
                        Branch Office: <span className="text-blue-300">Bhurigaun, Bardiya</span>
                      </p>
                      <p className="text-[11px] text-slate-300 mt-0.5">
                        Bhurigaun Market Center, Bardiya District, Lumbini Province, Nepal
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Hotlines & Emails */}
              <div className="space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Official Communication Desks:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <a
                    href="tel:+9779716275258"
                    className="p-2.5 rounded-xl bg-[#122244] border border-[#1E355F] flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Nepalgunj Head Office</span>
                      <span className="font-mono font-bold text-amber-300 text-xs">+977 9716275258</span>
                    </div>
                  </a>
                  <a
                    href="tel:+9779716748601"
                    className="p-2.5 rounded-xl bg-[#122244] border border-[#1E355F] flex items-center gap-2 text-slate-200 hover:text-amber-300 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-blue-400" />
                    <div>
                      <span className="text-[10px] text-slate-400 block">Bhurigaun Branch Desk</span>
                      <span className="font-mono font-bold text-blue-300 text-xs">+977 9716748601</span>
                    </div>
                  </a>
                </div>
              </div>

              {/* Regulatory Notice & Version */}
              <div className="p-3.5 rounded-xl bg-[#091428] border border-[#1C3259] text-[11px] text-slate-300 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Legal & Regulatory Compliance</span>
                </div>
                <p className="leading-relaxed text-slate-400">
                  Registered under Department of Foreign Employment (DoFE), Government of Nepal. All candidate recruitments comply with Foreign Employment Act 2064 and bilateral MoUs.
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#182845] text-[10px] text-slate-500 font-mono">
                  <span>Application Build: v1.2.0 (Verified Enterprise Mobile)</span>
                  <span>Kathmandu NST</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-[#1E355F] bg-[#0A162B] flex items-center justify-between gap-2">
          <button
            onClick={() => {
              setIsSettingsModalOpen(false);
              setIsCallModalOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-[#15274B] hover:bg-[#1E3766] border border-[#233F72] text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Offices</span>
          </button>
          <button
            onClick={() => setIsSettingsModalOpen(false)}
            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all text-center"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
