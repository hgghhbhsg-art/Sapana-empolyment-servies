import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  MapPin, 
  Building2, 
  Coins, 
  Clock, 
  Calendar, 
  UtensilsCrossed, 
  Users, 
  CheckCircle2, 
  Award, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  FileText
} from 'lucide-react';

export const VacancyDetailModal: React.FC = () => {
  const { 
    selectedVacancy, 
    setSelectedVacancy, 
    setApplyingForJob, 
    savedJobIds, 
    toggleSaveJob,
    setIsCallModalOpen 
  } = useApp();

  if (!selectedVacancy) return null;

  const isSaved = savedJobIds.includes(selectedVacancy.id);
  const remainingSpots = selectedVacancy.vacancyCount - selectedVacancy.appliedCount;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-[#0D1A33] border border-[#233C6B] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile drag handle */}
        <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Modal Top Bar */}
        <div className="px-5 py-3 border-b border-[#1D355F] flex items-center justify-between bg-[#0A162B]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-amber-400">
              {selectedVacancy.country} · {selectedVacancy.category}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleSaveJob(selectedVacancy.id)}
              className="p-1.5 text-slate-400 hover:text-amber-400 transition-colors"
              title="Bookmark"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-amber-400" />
              ) : (
                <Bookmark className="w-5 h-5" />
              )}
            </button>
            <button
              onClick={() => setSelectedVacancy(null)}
              className="w-8 h-8 rounded-full bg-[#162747] hover:bg-[#203763] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5 overflow-y-auto">
          {/* Header image banner if available */}
          {selectedVacancy.posterImage && (
            <div className="relative h-44 sm:h-52 rounded-xl overflow-hidden border border-[#213763]">
              <img
                src={selectedVacancy.posterImage}
                alt={selectedVacancy.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-[#0B1528]/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm border border-amber-400/30">
                    Verified Demand
                  </span>
                  <p className="text-lg font-bold text-white mt-1 drop-shadow">
                    {selectedVacancy.companyName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-300 block">Total Quota</span>
                  <span className="text-base font-bold text-amber-400 font-mono">
                    {selectedVacancy.vacancyCount} Seats
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Title & Organization */}
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {selectedVacancy.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300 mt-1.5">
              <span className="flex items-center gap-1 font-medium text-amber-300">
                <MapPin className="w-3.5 h-3.5" />
                {selectedVacancy.city}, {selectedVacancy.country}
              </span>
              <span>·</span>
              <span>Category: {selectedVacancy.category}</span>
              <span>·</span>
              <span className="text-emerald-400 font-medium">{remainingSpots} openings left</span>
            </div>
          </div>

          {/* Core Contract Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {/* Salary */}
            <div className="bg-[#122448] p-3 rounded-xl border border-[#203967]">
              <span className="text-[11px] text-slate-400 block">Monthly Salary</span>
              <p className="text-sm sm:text-base font-bold text-amber-400 font-mono mt-0.5 tabular-nums">
                {selectedVacancy.salaryMonthly}
              </p>
              <p className="text-[10px] text-slate-300 mt-0.5">
                ≈ {selectedVacancy.salaryNPRApprox}
              </p>
            </div>

            {/* Duty Hours */}
            <div className="bg-[#122448] p-3 rounded-xl border border-[#203967]">
              <span className="text-[11px] text-slate-400 block">Working Hours</span>
              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                {selectedVacancy.dutyHours}
              </p>
              <p className="text-[10px] text-emerald-400 mt-0.5">
                Overtime: {selectedVacancy.overtime}
              </p>
            </div>

            {/* Contract Duration */}
            <div className="bg-[#122448] p-3 rounded-xl border border-[#203967]">
              <span className="text-[11px] text-slate-400 block">Contract Period</span>
              <p className="text-xs sm:text-sm font-semibold text-white mt-0.5">
                {selectedVacancy.contractPeriod}
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Renewable as per labor law
              </p>
            </div>

            {/* Food & Accommodation */}
            <div className="bg-[#122448] p-3 rounded-xl border border-[#203967]">
              <span className="text-[11px] text-slate-400 block">Food & Housing</span>
              <p className="text-xs font-semibold text-emerald-300 mt-0.5">
                {selectedVacancy.foodAccommodation}
              </p>
            </div>

            {/* Total Vacancy & Applied */}
            <div className="bg-[#122448] p-3 rounded-xl border border-[#203967]">
              <span className="text-[11px] text-slate-400 block">Seat Availability</span>
              <p className="text-xs font-semibold text-white mt-0.5">
                {selectedVacancy.vacancyCount} Total ({selectedVacancy.appliedCount} Applied)
              </p>
            </div>

            {/* Application Deadline */}
            <div className="bg-[#122448] p-3 rounded-xl border border-[#203967]">
              <span className="text-[11px] text-slate-400 block">Closing Deadline</span>
              <p className="text-xs font-semibold text-red-300 mt-0.5">
                {selectedVacancy.deadline}
              </p>
            </div>
          </div>

          {/* Job Requirements */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Candidate Eligibility & Requirements</span>
            </h4>
            <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1C3560] space-y-2">
              {selectedVacancy.requirements.map((req, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0 mt-1.5" />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits & Welfare */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Company Benefits & Airfare Policy</span>
            </h4>
            <div className="bg-[#101F3E] p-3.5 rounded-xl border border-[#1C3560] space-y-2">
              {selectedVacancy.benefits.map((ben, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-slate-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1.5" />
                  <span>{ben}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Agency Certification Seal */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="font-semibold text-amber-300">
                Direct Recruiter: Sapana Employment Service Pvt. Ltd.
              </p>
              <p className="text-[11px] text-slate-300">
                Official Government License No: 1234/078/079. Pre-interview verification carried out at Kathmandu office.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-[#1F3663] bg-[#0A162B] flex items-center gap-3">
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="min-h-[44px] px-3.5 rounded-xl bg-[#16294D] hover:bg-[#1E3766] border border-[#233F72] text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            <span>Hotline</span>
          </button>
          <button
            onClick={() => {
              const target = selectedVacancy;
              setSelectedVacancy(null);
              setApplyingForJob(target);
            }}
            className="flex-1 min-h-[44px] rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Application Form</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
