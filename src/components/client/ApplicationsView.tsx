import React from 'react';
import { useApp } from '../../context/AppContext';
import { ApplicationStatus } from '../../types';
import { 
  FileCheck2, 
  Clock, 
  MapPin, 
  CheckCircle, 
  AlertCircle, 
  MessageSquare, 
  Phone, 
  Calendar, 
  User, 
  ArrowRight,
  ShieldCheck,
  Building2,
  HelpCircle
} from 'lucide-react';

const STATUS_ORDER: ApplicationStatus[] = [
  'Pending',
  'Under Review',
  'Interview Scheduled',
  'Interviewed',
  'Selected',
  'Visa Processing'
];

export const ApplicationsView: React.FC = () => {
  const { applications, setActiveTab, sendChatMessage, setIsCallModalOpen } = useApp();

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
      case 'Visa Processing':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Interview Scheduled':
      case 'Interviewed':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'Rejected':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'Pending':
      default:
        return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    }
  };

  const handleInquireStatus = (appCode: string, jobTitle: string) => {
    sendChatMessage(
      `Namaste, I am inquiring regarding my application for "${jobTitle}" (Reference Code: ${appCode}). Could you please update me on the document verification and interview schedule?`,
      'client'
    );
    setActiveTab('chat');
  };

  return (
    <div className="pb-24 pt-3 max-w-4xl mx-auto px-3 sm:px-6 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="bg-[#0E1C36] p-4 sm:p-5 rounded-2xl border border-[#203661] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
            <FileCheck2 className="w-4 h-4" />
            <span>Applicant Portal</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            My Applied Jobs & Live Status
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Track foreign employment selection, interview invites, and visa progress in real-time.
          </p>
        </div>
        <button
          onClick={() => setIsCallModalOpen(true)}
          className="min-h-[40px] px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 hover:bg-amber-500/20 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>Inquire via Hotline</span>
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="p-8 text-center bg-[#0D1A33] border border-[#1E345F] rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">No Applications Submitted Yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Browse our active foreign vacancies in Greece, Malaysia, UAE and apply with your passport.
          </p>
          <button
            onClick={() => setActiveTab('jobs')}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
          >
            Explore Active Vacancies
          </button>
        </div>
      ) : (
        applications.map((app) => {
          return (
            <div
              key={app.id}
              className="bg-[#0E1B36] border border-[#213966] rounded-2xl overflow-hidden shadow-lg"
            >
              {/* Top Banner */}
              <div className="p-4 sm:p-5 border-b border-[#1A2E55] bg-[#0A162B] flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {app.applicationCode}
                    </span>
                    <span className="text-slate-400">· Applied on {app.appliedDate}</span>
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-white mt-1">
                    {app.jobTitle}
                  </h2>
                  <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>Destination Country: {app.country}</span>
                  </p>
                </div>

                {/* Status Badge */}
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                  {app.interviewDate && (
                    <p className="text-[11px] text-amber-300 font-medium mt-1 flex items-center gap-1 justify-end">
                      <Calendar className="w-3 h-3" />
                      <span>Interview: {app.interviewDate}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Status Stepper Progression */}
              <div className="px-4 sm:px-5 py-4 bg-[#091428] border-b border-[#1A2E55]">
                <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                  <span className="font-semibold text-slate-200 uppercase tracking-wider">
                    Recruitment Progress Pipeline
                  </span>
                  <span className="text-amber-400 font-medium">Stage: {app.status}</span>
                </div>

                {/* Step indicators */}
                <div className="grid grid-cols-5 gap-1.5 pt-1">
                  {STATUS_ORDER.slice(0, 5).map((step, idx) => {
                    const currentIndex = STATUS_ORDER.indexOf(app.status);
                    const isPassed = currentIndex >= idx;
                    const isCurrent = app.status === step;

                    return (
                      <div key={step} className="flex flex-col items-center text-center">
                        <div
                          className={`w-full h-1.5 rounded-full mb-1.5 transition-colors ${
                            isCurrent
                              ? 'bg-amber-400 ring-2 ring-amber-400/30'
                              : isPassed
                              ? 'bg-emerald-500'
                              : 'bg-slate-700'
                          }`}
                        />
                        <span
                          className={`text-[9px] sm:text-[10px] truncate max-w-full font-medium ${
                            isCurrent
                              ? 'text-amber-300 font-bold'
                              : isPassed
                              ? 'text-emerald-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Applicant Info & Office Remarks */}
              <div className="p-4 sm:p-5 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-[#122244] p-2.5 rounded-xl border border-[#1F355F]">
                    <span className="text-slate-400 block text-[11px]">Candidate Name</span>
                    <span className="font-semibold text-white">{app.fullName}</span>
                  </div>
                  <div className="bg-[#122244] p-2.5 rounded-xl border border-[#1F355F]">
                    <span className="text-slate-400 block text-[11px]">Passport Number</span>
                    <span className="font-semibold text-amber-300 font-mono">{app.passportNumber}</span>
                  </div>
                  <div className="bg-[#122244] p-2.5 rounded-xl border border-[#1F355F]">
                    <span className="text-slate-400 block text-[11px]">Registered Mobile</span>
                    <span className="font-semibold text-white font-mono">{app.phone}</span>
                  </div>
                </div>

                {/* Office Remarks Box */}
                {app.adminRemarks ? (
                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-300 block">
                        Office Verification Remarks:
                      </span>
                      <p className="text-[11px] text-slate-200 mt-0.5 leading-relaxed">
                        {app.adminRemarks}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#112140] border border-[#1D355F] text-xs text-slate-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Your documents are in queue for verification by the counseling team.</span>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 border-t border-[#1C325B] bg-[#0A162B] flex flex-wrap items-center justify-between gap-2">
                <div className="text-[11px] text-slate-400">
                  Sapana Employment Service Desk · Lic. 1234/078/079
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleInquireStatus(app.applicationCode, app.jobTitle)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-[#16294D] hover:bg-[#1E3766] border border-[#233F72] text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Inquire in Chat</span>
                  </button>
                  <button
                    onClick={() => setIsCallModalOpen(true)}
                    className="min-h-[38px] px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Desk</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
