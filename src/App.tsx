/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNavBar } from './components/BottomNavBar';
import { QuickCallModal } from './components/QuickCallModal';
import { AppSettingsModal } from './components/AppSettingsModal';
import { HomeDashboard } from './components/client/HomeDashboard';
import { VacancyDetailModal } from './components/client/VacancyDetailModal';
import { ApplicationModal } from './components/client/ApplicationModal';
import { ApplicationsView } from './components/client/ApplicationsView';
import { ProfileView } from './components/client/ProfileView';
import { LiveChatView } from './components/shared/LiveChatView';
import { AdminInquiriesView } from './components/admin/AdminInquiriesView';
import { AdminVacanciesView } from './components/admin/AdminVacanciesView';
import { AdminChatView } from './components/admin/AdminChatView';
import { AdminAnalyticsView } from './components/admin/AdminAnalyticsView';
import { AuthScreen } from './components/auth/AuthScreen';

const MainContent: React.FC = () => {
  const { currentUser, role, activeTab, mobilePreviewFrame } = useApp();

  // If not logged in, display Authentication & Login/Signup screen
  if (!currentUser) {
    return (
      <>
        <AuthScreen />
        <QuickCallModal />
      </>
    );
  }

  const renderCurrentView = () => {
    if (role === 'admin') {
      switch (activeTab) {
        case 'admin-inquiries':
          return <AdminInquiriesView />;
        case 'admin-vacancies':
          return <AdminVacanciesView />;
        case 'admin-chat':
          return <AdminChatView />;
        case 'admin-analytics':
        default:
          return <AdminAnalyticsView />;
      }
    }

    // Client Views
    switch (activeTab) {
      case 'jobs':
        return <HomeDashboard />;
      case 'applications':
        return <ApplicationsView />;
      case 'chat':
        return <LiveChatView />;
      case 'profile':
      default:
        return <ProfileView />;
    }
  };

  if (mobilePreviewFrame) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 lg:p-6">
        {/* Smartphone Chassis Frame */}
        <div className="w-full max-w-[440px] h-[96vh] max-h-[890px] bg-[#0A162B] border-4 border-slate-700 rounded-[44px] shadow-2xl overflow-hidden flex flex-col relative">
          {/* Phone Top Speaker & Camera Notch */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-900 rounded-full z-50 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col">
            <Header />
            <main className="flex-1 overflow-y-auto">
              {renderCurrentView()}
            </main>
            <BottomNavBar />
          </div>

          {/* Phone Home Bar */}
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500/60 rounded-full z-50 pointer-events-none" />
        </div>

        {/* Modals */}
        <VacancyDetailModal />
        <ApplicationModal />
        <QuickCallModal />
        <AppSettingsModal />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071120] text-slate-100 flex flex-col">
      <Header />
      <main className="flex-1">
        {renderCurrentView()}
      </main>
      <BottomNavBar />

      {/* Global Modals */}
      <VacancyDetailModal />
      <ApplicationModal />
      <QuickCallModal />
      <AppSettingsModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
