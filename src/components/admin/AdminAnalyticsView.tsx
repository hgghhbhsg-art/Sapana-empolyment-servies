import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  BarChart3, 
  Users, 
  FolderCheck, 
  Award, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Plus, 
  FileText,
  Clock,
  LogOut
} from 'lucide-react';
import { COMPANY_CONTACTS, ASSET_IMAGES } from '../../data/initialData';
import { Logo } from '../Logo';

export const AdminAnalyticsView: React.FC = () => {
  const { vacancies, applications, setActiveTab, setIsCallModalOpen, currentUser, logout } = useApp();

  const totalSeats = vacancies.reduce((acc, v) => acc + (v.status === 'active' ? v.vacancyCount : 0), 0);
  const pendingCount = applications.filter(a => a.status === 'Pending').length;
  const selectedCount = applications.filter(a => a.status === 'Selected' || a.status === 'Visa Processing').length;
  const interviewedCount = applications.filter(a => a.status === 'Interviewed' || a.status === 'Interview Scheduled').length;

  return (
    <div className="pb-24 pt-3 max-w-7xl mx-auto px-3 sm:px-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-[#0D1A33] p-4 sm:p-5 rounded-2xl border border-[#213866] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <BarChart3 className="w-4 h-4" />
            <span>Operations Dashboard</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Sapana Employment Service — Office Overview
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time pipeline metrics for foreign employment recruitment and visa processing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('admin-vacancies')}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post New Vacancy</span>
          </button>
          <button
            onClick={logout}
            className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Staff Sign Out</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-[#0E1C36] p-4 rounded-xl border border-[#203661]">
          <span className="text-xs text-slate-400 font-medium block">Total Quota Openings</span>
          <p className="text-2xl sm:text-3xl font-bold text-white font-mono mt-1 tabular-nums">
            {totalSeats}
          </p>
          <span className="text-[11px] text-amber-400 mt-1 block">Across {vacancies.length} Active Vacancies</span>
        </div>

        <div className="bg-[#0E1C36] p-4 rounded-xl border border-[#203661]">
          <span className="text-xs text-slate-400 font-medium block">Pending Document Review</span>
          <p className="text-2xl sm:text-3xl font-bold text-blue-400 font-mono mt-1 tabular-nums">
            {pendingCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Requires staff passport check</span>
        </div>

        <div className="bg-[#0E1C36] p-4 rounded-xl border border-[#203661]">
          <span className="text-xs text-slate-400 font-medium block">Interview Stage</span>
          <p className="text-2xl sm:text-3xl font-bold text-amber-400 font-mono mt-1 tabular-nums">
            {interviewedCount}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Client Zoom / In-person</span>
        </div>

        <div className="bg-[#0E1C36] p-4 rounded-xl border border-[#203661]">
          <span className="text-xs text-slate-400 font-medium block">Selected & Visa Flow</span>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono mt-1 tabular-nums">
            {selectedCount}
          </p>
          <span className="text-[11px] text-emerald-400 mt-1 block">Labor permit & tickets</span>
        </div>
      </div>

      {/* Country Quota Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Breakdown Card */}
        <div className="bg-[#0E1C36] p-4 sm:p-5 rounded-2xl border border-[#203661] space-y-3">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            <span>Country Deployment Distribution</span>
          </h3>

          <div className="space-y-2.5 pt-1 text-xs">
            {['Greece', 'Malaysia', 'UAE', 'Croatia', 'Qatar'].map(country => {
              const countryVacancies = vacancies.filter(v => v.country === country);
              const seats = countryVacancies.reduce((acc, v) => acc + v.vacancyCount, 0);
              const applied = countryVacancies.reduce((acc, v) => acc + v.appliedCount, 0);
              const percent = seats > 0 ? Math.round((applied / seats) * 100) : 0;

              return (
                <div key={country} className="p-3 rounded-xl bg-[#122244] border border-[#1F355F] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-sm">{country}</span>
                    <span className="text-slate-300 font-mono tabular-nums">
                      {applied} / {seats} Filled ({percent}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                      style={{ width: `${Math.min(100, Math.max(10, percent))}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Office Duty & Contact Infrastructure */}
        <div className="bg-[#0E1C36] p-4 sm:p-5 rounded-2xl border border-[#203661] space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Office Staff & Contact Infrastructure</span>
            </h3>
            <p className="text-xs text-slate-400">
              Assigned officers on duty at Head Office (Nepalgunj) & Branch Office (Bhurigaun, Bardiya).
            </p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 rounded-xl bg-[#122244] border border-[#1F355F] flex items-center justify-between">
              <div>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>Suman Shrestha</span>
                  <span className="text-[10px] text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded">Head Office</span>
                </p>
                <p className="text-slate-400 text-[11px]">Nepalgunj BP Chowk · Senior Counselor (Europe & Gulf Desk)</p>
              </div>
              <a
                href={`tel:${COMPANY_CONTACTS.hotlines[0]}`}
                className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 font-mono text-xs hover:bg-amber-500/20"
              >
                {COMPANY_CONTACTS.hotlines[0]}
              </a>
            </div>

            <div className="p-3 rounded-xl bg-[#122244] border border-[#1F355F] flex items-center justify-between">
              <div>
                <p className="font-bold text-white flex items-center gap-1.5">
                  <span>Bikash Tamang</span>
                  <span className="text-[10px] text-blue-300 bg-blue-500/10 px-1.5 py-0.2 rounded">Branch Office</span>
                </p>
                <p className="text-slate-400 text-[11px]">Bhurigaun, Bardiya · Document Verification & Passport Desk</p>
              </div>
              <a
                href={`tel:${COMPANY_CONTACTS.hotlines[1]}`}
                className="px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 font-mono text-xs hover:bg-blue-500/20"
              >
                {COMPANY_CONTACTS.hotlines[1]}
              </a>
            </div>

            <div className="p-3 rounded-xl bg-[#122244] border border-[#1F355F] flex items-center justify-between">
              <div>
                <p className="font-bold text-white">Office Hours (Both Locations)</p>
                <p className="text-slate-400 text-[11px]">Sunday – Friday 9:30 AM – 5:30 PM</p>
              </div>
              <span className="text-emerald-400 font-semibold text-[11px]">Desks Open</span>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => setIsCallModalOpen(true)}
              className="w-full min-h-[42px] rounded-xl bg-[#172B50] hover:bg-[#1E3766] border border-[#243F72] text-amber-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>Test Hotlines & Client Dialer</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
