import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CandidateApplication, ApplicationStatus } from '../../types';
import { 
  Users, 
  Search, 
  Filter, 
  Phone, 
  MessageCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  AlertCircle, 
  X, 
  Image as ImageIcon, 
  Trash2, 
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

const STATUS_FILTERS: Array<ApplicationStatus | 'All'> = [
  'All',
  'Pending',
  'Interview Scheduled',
  'Interviewed',
  'Selected',
  'Visa Processing',
  'Rejected'
];

export const AdminInquiriesView: React.FC = () => {
  const { 
    applications, 
    updateApplicationStatus, 
    deleteApplication, 
    sendChatMessage, 
    setActiveTab 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateApplication | null>(null);

  // Status edit form state
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Pending');
  const [remarks, setRemarks] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // Document photo preview modal
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [deleteConfirmCandidate, setDeleteConfirmCandidate] = useState<CandidateApplication | null>(null);
  const [statusUpdatedFeedback, setStatusUpdatedFeedback] = useState<string | null>(null);

  const filteredApplications = applications.filter(app => {
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      app.fullName.toLowerCase().includes(q) ||
      app.phone.includes(q) ||
      app.passportNumber.toLowerCase().includes(q) ||
      app.applicationCode.toLowerCase().includes(q) ||
      app.jobTitle.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleOpenCandidate = (candidate: CandidateApplication) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status);
    setRemarks(candidate.adminRemarks || '');
    setInterviewDate(candidate.interviewDate || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    updateApplicationStatus(selectedCandidate.id, newStatus, remarks);

    setSelectedCandidate(prev => prev ? {
      ...prev,
      status: newStatus,
      adminRemarks: remarks,
      interviewDate: interviewDate || prev.interviewDate,
    } : null);

    setStatusUpdatedFeedback(`Status updated to "${newStatus}" successfully.`);
    setToastMessage(`Updated status for ${selectedCandidate.fullName} to ${newStatus}.`);
    setTimeout(() => {
      setStatusUpdatedFeedback(null);
      setToastMessage(null);
    }, 3500);
  };

  const handleDeleteCandidate = (candidate: CandidateApplication) => {
    setDeleteConfirmCandidate(candidate);
  };

  const confirmDeleteCandidate = () => {
    if (deleteConfirmCandidate) {
      deleteApplication(deleteConfirmCandidate.id);
      setToastMessage(`Removed registration for ${deleteConfirmCandidate.fullName}.`);
      setTimeout(() => setToastMessage(null), 3000);
      setDeleteConfirmCandidate(null);
      if (selectedCandidate?.id === deleteConfirmCandidate.id) {
        setSelectedCandidate(null);
      }
    }
  };

  return (
    <div className="pb-24 pt-3 max-w-7xl mx-auto px-3 sm:px-6 space-y-4 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-lg animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold">{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage(null)} className="text-emerald-400 hover:text-white text-xs font-bold px-2 py-0.5">
            ✕
          </button>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-[#0D1A33] p-4 sm:p-5 rounded-2xl border border-[#213866] shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Sapana Office Team Console</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1">
            Candidate Inquiries & Application Tracker
          </h1>
          <p className="text-xs text-slate-300 mt-0.5">
            Review incoming passport registrations, verify uploaded documents, and update applicant statuses.
          </p>
        </div>

        <div className="bg-[#122346] px-3.5 py-2 rounded-xl border border-[#203967] text-xs">
          <span className="text-slate-400 block text-[11px]">Total Registered:</span>
          <span className="text-lg font-bold text-amber-400 font-mono tabular-nums">
            {applications.length} Candidates
          </span>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name, passport number, phone, code (e.g. SAP-2026), or country..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0E1C36] border border-[#213966] rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {STATUS_FILTERS.map(st => {
            const isActive = statusFilter === st;
            const count = st === 'All' 
              ? applications.length 
              : applications.filter(a => a.status === st).length;

            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`min-h-[36px] px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-[#101F3E] border border-[#1E3560] text-slate-400 hover:text-white'
                }`}
              >
                <span>{st}</span>
                <span className="bg-black/30 px-1.5 py-0.2 rounded-full text-[10px] font-mono">
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="space-y-2.5">
        {filteredApplications.length === 0 ? (
          <div className="p-8 text-center bg-[#0D1A33] border border-[#1E345F] rounded-2xl text-slate-400 text-xs">
            No candidate registrations found matching current filter.
          </div>
        ) : (
          filteredApplications.map(app => {
            const hasPassport = !!app.documents.passportFrontUrl;
            const hasPhoto = !!app.documents.photoUrl;

            return (
              <div
                key={app.id}
                onClick={() => handleOpenCandidate(app)}
                className="p-3.5 sm:p-4 rounded-xl bg-[#0E1B36] border border-[#203661] hover:border-amber-400/50 cursor-pointer transition-all hover:bg-[#122244] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 group"
              >
                {/* Candidate Overview */}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold font-mono text-sm shrink-0 mt-0.5">
                    {app.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                        {app.fullName}
                      </span>
                      <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.2 rounded border border-amber-400/20">
                        {app.applicationCode}
                      </span>
                      <span className="text-[11px] text-slate-400">· {app.gender}</span>
                    </div>

                    <p className="text-xs text-slate-300 mt-0.5">
                      Target Job: <strong className="text-white">{app.jobTitle}</strong> ({app.country})
                    </p>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 mt-1 font-mono">
                      <span>Passport: <strong className="text-slate-200">{app.passportNumber}</strong></span>
                      <span>·</span>
                      <span>Phone: <strong className="text-slate-200">{app.phone}</strong></span>
                      <span>·</span>
                      <span className="text-slate-400 font-sans">Applied: {app.appliedDate}</span>
                    </div>
                  </div>
                </div>

                {/* Right badges & controls */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1A2E55]">
                  {/* Documents status */}
                  <div className="text-left sm:text-right text-[11px]">
                    <span className="text-slate-400 block">Docs Attached:</span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${hasPassport ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                        Passport {hasPassport ? '✓' : '—'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${hasPhoto ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}`}>
                        Photo {hasPhoto ? '✓' : '—'}
                      </span>
                    </div>
                  </div>

                  {/* Status label */}
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      {app.status}
                    </span>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors hidden sm:block" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Candidate Inspection & Status Update Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-2xl bg-[#0D1A33] border border-[#233C6B] rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grab handle */}
            <div className="w-10 h-1.5 bg-slate-600 rounded-full mx-auto my-2.5 sm:hidden" />

            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-[#1E3661] flex items-center justify-between bg-[#0A162B]">
              <div>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  {selectedCandidate.applicationCode}
                </span>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Candidate Profile: {selectedCandidate.fullName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="w-8 h-8 rounded-full bg-[#162747] hover:bg-[#203763] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 overflow-y-auto">
              {/* Target vacancy info */}
              <div className="p-3.5 rounded-xl bg-[#122244] border border-[#1F3763] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Applied Position</span>
                  <p className="text-sm font-bold text-white">{selectedCandidate.jobTitle}</p>
                  <p className="text-xs text-amber-400 font-medium">Destination: {selectedCandidate.country}</p>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${selectedCandidate.phone}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Candidate</span>
                  </a>
                  <a
                    href={`https://wa.me/${selectedCandidate.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-[#1F8A4D] hover:bg-[#1C7B44] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Personal Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1D355F]">
                  <span className="text-slate-400 text-[11px] block">Passport Number</span>
                  <span className="font-mono font-bold text-amber-300 text-sm">
                    {selectedCandidate.passportNumber}
                  </span>
                </div>
                <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1D355F]">
                  <span className="text-slate-400 text-[11px] block">Passport Expiry</span>
                  <span className="font-semibold text-white">
                    {selectedCandidate.passportExpiry || 'Not specified'}
                  </span>
                </div>
                <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1D355F]">
                  <span className="text-slate-400 text-[11px] block">Contact Number</span>
                  <span className="font-mono font-semibold text-white">
                    {selectedCandidate.phone}
                  </span>
                </div>
                <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1D355F]">
                  <span className="text-slate-400 text-[11px] block">Current Address</span>
                  <span className="font-medium text-white truncate block">
                    {selectedCandidate.currentAddress || 'Kathmandu, Nepal'}
                  </span>
                </div>
                <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1D355F]">
                  <span className="text-slate-400 text-[11px] block">Date of Birth / Gender</span>
                  <span className="font-medium text-white">
                    {selectedCandidate.dateOfBirth || 'N/A'} · {selectedCandidate.gender}
                  </span>
                </div>
                <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1D355F]">
                  <span className="text-slate-400 text-[11px] block">Application Date</span>
                  <span className="font-medium text-white">
                    {selectedCandidate.appliedDate}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents Gallery */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Uploaded Document Scans & Photos
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {/* Passport Front */}
                  <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1E3661] text-center space-y-1.5">
                    <span className="text-[11px] text-slate-300 font-medium block">Passport Front</span>
                    {selectedCandidate.documents.passportFrontUrl ? (
                      <div 
                        onClick={() => setPreviewImageUrl(selectedCandidate.documents.passportFrontUrl!)}
                        className="relative h-24 rounded-lg overflow-hidden border border-emerald-500/40 cursor-pointer group"
                      >
                        <img 
                          src={selectedCandidate.documents.passportFrontUrl} 
                          alt="Passport Front" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                          Click to Enlarge
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 rounded-lg bg-[#0C172B] border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-[10px]">
                        <span>No Photo Uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* PP Size Photo */}
                  <div className="bg-[#101F3E] p-2.5 rounded-xl border border-[#1E3661] text-center space-y-1.5">
                    <span className="text-[11px] text-slate-300 font-medium block">PP Photograph</span>
                    {selectedCandidate.documents.photoUrl ? (
                      <div 
                        onClick={() => setPreviewImageUrl(selectedCandidate.documents.photoUrl!)}
                        className="relative h-24 rounded-lg overflow-hidden border border-emerald-500/40 cursor-pointer group"
                      >
                        <img 
                          src={selectedCandidate.documents.photoUrl} 
                          alt="PP Photograph" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-semibold">
                          Click to Enlarge
                        </div>
                      </div>
                    ) : (
                      <div className="h-24 rounded-lg bg-[#0C172B] border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 text-[10px]">
                        <span>No Photo Uploaded</span>
                      </div>
                    )}
                  </div>

                  {/* Candidate notes */}
                  <div className="col-span-2 sm:col-span-1 bg-[#101F3E] p-2.5 rounded-xl border border-[#1E3661] space-y-1 text-left">
                    <span className="text-[11px] text-slate-300 font-medium block">Candidate Note:</span>
                    <p className="text-[11px] text-slate-400 italic">
                      {selectedCandidate.notes || 'No prior remarks provided by applicant.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Update Status & Remarks Form */}
              <form onSubmit={handleSaveStatus} className="bg-[#122244] p-4 rounded-xl border border-[#203966] space-y-3">
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Update Candidate Status & Remarks</span>
                </h4>

                {statusUpdatedFeedback && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{statusUpdatedFeedback}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Current Status *
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                      className="w-full px-3 py-2 bg-[#0D1A33] border border-[#223966] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                      <option value="Pending">Pending Document Review</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Interview Scheduled">Interview Scheduled</option>
                      <option value="Interviewed">Interviewed</option>
                      <option value="Selected">Selected / Approved</option>
                      <option value="Visa Processing">Visa Processing</option>
                      <option value="Rejected">Rejected / Ineligible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-200 mb-1">
                      Interview Date (If Scheduled)
                    </label>
                    <input
                      type="date"
                      value={interviewDate}
                      onChange={(e) => setInterviewDate(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0D1A33] border border-[#223966] rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                    >
                    </input>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    Office Verification Remarks & Instructions (Visible to Candidate)
                  </label>
                  <textarea
                    rows={2}
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="e.g. Passport front copy verified. Candidate recommended for Zoom interview on Thursday at 11 AM..."
                    className="w-full px-3 py-2 bg-[#0D1A33] border border-[#223966] rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => handleDeleteCandidate(selectedCandidate)}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Candidate</span>
                  </button>

                  <button
                    type="submit"
                    className="min-h-[38px] px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 active:scale-95 transition-all"
                  >
                    Save Status Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Delete Confirmation Modal */}
      {deleteConfirmCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0D1A33] border border-[#233C6B] rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-3">
            <h3 className="text-sm font-bold text-white">Confirm Candidate Removal</h3>
            <p className="text-xs text-slate-300">
              Are you sure you want to remove candidate <strong className="text-amber-400">{deleteConfirmCandidate.fullName}</strong> ({deleteConfirmCandidate.applicationCode})?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1C3259]">
              <button
                type="button"
                onClick={() => setDeleteConfirmCandidate(null)}
                className="px-3.5 py-1.5 rounded-xl bg-[#142340] text-slate-300 hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteCandidate}
                className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
              >
                Yes, Remove Candidate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Lightbox */}
      {previewImageUrl && (
        <div 
          onClick={() => setPreviewImageUrl(null)}
          className="fixed inset-0 z-60 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-xl max-h-[85vh] bg-[#0E1A30] rounded-2xl overflow-hidden border border-slate-700">
            <button
              onClick={() => setPreviewImageUrl(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
            >
              <X className="w-4 h-4" />
            </button>
            <img 
              src={previewImageUrl} 
              alt="Enlarged Document" 
              className="w-full h-full object-contain max-h-[80vh]"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      )}
    </div>
  );
};
