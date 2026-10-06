import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  FileCheck2, 
  MessageSquare, 
  User, 
  Users, 
  FolderPlus, 
  BarChart3,
  PhoneCall
} from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { 
    role, 
    activeTab, 
    setActiveTab, 
    applications, 
    unreadChatCountClient,
    unreadChatCountAdmin,
    resetChatUnread,
    setIsCallModalOpen
  } = useApp();

  const pendingAppsCount = applications.filter(a => a.status === 'Pending').length;

  if (role === 'client') {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1528]/95 backdrop-blur-lg border-t border-[#1E3359] max-w-lg mx-auto md:max-w-none">
        <div className="grid grid-cols-5 items-center h-16 max-w-lg mx-auto px-1">
          {/* Vacancies / Explore */}
          <button
            onClick={() => setActiveTab('jobs')}
            className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
              activeTab === 'jobs' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className={`w-5 h-5 ${activeTab === 'jobs' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1">Vacancies</span>
            {activeTab === 'jobs' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
            )}
          </button>

          {/* Applications */}
          <button
            onClick={() => setActiveTab('applications')}
            className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
              activeTab === 'applications' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck2 className={`w-5 h-5 ${activeTab === 'applications' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1">My Status</span>
            {applications.length > 0 && (
              <span className="absolute top-1.5 right-3 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
                {applications.length}
              </span>
            )}
            {activeTab === 'applications' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
            )}
          </button>

          {/* Quick Call Action (Central thumb button) */}
          <button
            onClick={() => setIsCallModalOpen(true)}
            className="min-h-[48px] min-w-[48px] flex flex-col items-center justify-center -mt-3 group"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/25 group-active:scale-95 transition-transform border-2 border-[#0B1528]">
              <PhoneCall className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-semibold text-amber-300 tracking-tight mt-0.5">Call Us</span>
          </button>

          {/* Live Chat */}
          <button
            onClick={() => {
              setActiveTab('chat');
              resetChatUnread('client');
            }}
            className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
              activeTab === 'chat' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1">Live Chat</span>
            {unreadChatCountClient > 0 && (
              <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0B1528]" />
            )}
            {activeTab === 'chat' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
            )}
          </button>

          {/* Profile / Help */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
              activeTab === 'profile' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] font-medium tracking-tight mt-1">Profile</span>
            {activeTab === 'profile' && (
              <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
            )}
          </button>
        </div>
      </nav>
    );
  }

  // Admin Bottom Nav
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0A162B]/95 backdrop-blur-lg border-t border-[#1C325B] max-w-lg mx-auto md:max-w-none">
      <div className="grid grid-cols-4 items-center h-16 max-w-lg mx-auto px-2">
        {/* Applicants & Inquiries */}
        <button
          onClick={() => setActiveTab('admin-inquiries')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'admin-inquiries' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className={`w-5 h-5 ${activeTab === 'admin-inquiries' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Candidates</span>
          {pendingAppsCount > 0 && (
            <span className="absolute top-1 right-5 px-1 min-w-[16px] h-4 rounded-full bg-amber-500 text-slate-950 text-[9px] font-bold flex items-center justify-center">
              {pendingAppsCount}
            </span>
          )}
          {activeTab === 'admin-inquiries' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
          )}
        </button>

        {/* Vacancies Management */}
        <button
          onClick={() => setActiveTab('admin-vacancies')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'admin-vacancies' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FolderPlus className={`w-5 h-5 ${activeTab === 'admin-vacancies' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Post Jobs</span>
          {activeTab === 'admin-vacancies' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
          )}
        </button>

        {/* Support Chat */}
        <button
          onClick={() => {
            setActiveTab('admin-chat');
            resetChatUnread('admin');
          }}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'admin-chat' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <MessageSquare className={`w-5 h-5 ${activeTab === 'admin-chat' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Staff Chat</span>
          {unreadChatCountAdmin > 0 && (
            <span className="absolute top-1 right-5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0A162B]" />
          )}
          {activeTab === 'admin-chat' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
          )}
        </button>

        {/* Analytics & Overview */}
        <button
          onClick={() => setActiveTab('admin-analytics')}
          className={`min-h-[48px] min-w-[48px] flex flex-col items-center justify-center transition-colors relative ${
            activeTab === 'admin-analytics' ? 'text-amber-400' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${activeTab === 'admin-analytics' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] font-medium tracking-tight mt-1">Overview</span>
          {activeTab === 'admin-analytics' && (
            <span className="w-1 h-1 rounded-full bg-amber-400 absolute bottom-1" />
          )}
        </button>
      </div>
    </nav>
  );
};
