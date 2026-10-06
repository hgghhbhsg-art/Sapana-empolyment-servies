import React, { createContext, useContext, useState, useEffect } from 'react';
import { Vacancy, CandidateApplication, ChatMessage, UserRole, ApplicationStatus, AuthUser } from '../types';
import { INITIAL_VACANCIES, INITIAL_APPLICATIONS, INITIAL_CHAT_MESSAGES } from '../data/initialData';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';

interface AppContextType {
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;

  role: UserRole;
  vacancies: Vacancy[];
  addVacancy: (vacancy: Omit<Vacancy, 'id' | 'appliedCount' | 'createdAt'>) => void;
  updateVacancy: (id: string, updated: Partial<Vacancy>) => void;
  deleteVacancy: (id: string) => void;
  
  applications: CandidateApplication[];
  submitApplication: (appData: Omit<CandidateApplication, 'id' | 'applicationCode' | 'status' | 'appliedDate'>) => string;
  updateApplicationStatus: (id: string, status: ApplicationStatus, remarks?: string, interviewDate?: string) => void;
  deleteApplication: (id: string) => void;

  chatMessages: ChatMessage[];
  sendChatMessage: (text: string, sender: 'client' | 'staff', senderName?: string) => void;
  clearChatHistory: () => void;

  activeTab: string;
  setActiveTab: (tab: string) => void;

  selectedVacancy: Vacancy | null;
  setSelectedVacancy: (v: Vacancy | null) => void;

  applyingForJob: Vacancy | null;
  setApplyingForJob: (v: Vacancy | null) => void;

  isCallModalOpen: boolean;
  setIsCallModalOpen: (open: boolean) => void;

  mobilePreviewFrame: boolean;
  setMobilePreviewFrame: (val: boolean) => void;

  // Applicant Saved Jobs
  savedJobIds: string[];
  toggleSaveJob: (id: string) => void;

  // Notification badge counts
  unreadChatCountClient: number;
  unreadChatCountAdmin: number;
  resetChatUnread: (target: 'client' | 'admin') => void;

  // Settings & About Modal
  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (open: boolean) => void;
  settingsInitialTab: 'settings' | 'about';
  setSettingsInitialTab: (tab: 'settings' | 'about') => void;

  // User preferences
  language: 'en' | 'ne';
  setLanguage: (lang: 'en' | 'ne') => void;
  vacancyAlerts: boolean;
  setVacancyAlerts: (val: boolean) => void;
  currencyDisplay: 'both' | 'npr' | 'foreign';
  setCurrencyDisplay: (val: 'both' | 'npr' | 'foreign') => void;
  soundHaptics: boolean;
  setSoundHaptics: (val: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('sapana_auth_user_v1');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const role: UserRole = currentUser?.role || 'client';

  const [activeTab, setActiveTab] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('sapana_auth_user_v1');
      if (saved) {
        const u = JSON.parse(saved);
        return u.role === 'admin' ? 'admin-inquiries' : 'jobs';
      }
    } catch {}
    return 'jobs';
  });

  const [mobilePreviewFrame, setMobilePreviewFrame] = useState<boolean>(false);

  const login = (user: AuthUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('sapana_auth_user_v1', JSON.stringify(user));
    } catch {}
    if (user.role === 'admin') {
      setActiveTab('admin-inquiries');
    } else {
      setActiveTab('jobs');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('sapana_auth_user_v1');
    } catch {}
    setActiveTab('jobs');
  };

  // Vacancies State with local fallback
  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    try {
      const saved = localStorage.getItem('sapana_vacancies_v1');
      return saved ? JSON.parse(saved) : INITIAL_VACANCIES;
    } catch {
      return INITIAL_VACANCIES;
    }
  });

  // Applications State with local fallback
  const [applications, setApplications] = useState<CandidateApplication[]>(() => {
    try {
      const saved = localStorage.getItem('sapana_applications_v1');
      return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
    } catch {
      return INITIAL_APPLICATIONS;
    }
  });

  // Chat Messages State with local fallback
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('sapana_chat_v1');
      return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
    } catch {
      return INITIAL_CHAT_MESSAGES;
    }
  });

  // Saved Jobs
  const [savedJobIds, setSavedJobIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sapana_saved_jobs_v1');
      return saved ? JSON.parse(saved) : ['vac-gr-01'];
    } catch {
      return ['vac-gr-01'];
    }
  });

  const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
  const [applyingForJob, setApplyingForJob] = useState<Vacancy | null>(null);
  const [isCallModalOpen, setIsCallModalOpen] = useState<boolean>(false);

  const [unreadChatCountClient, setUnreadChatCountClient] = useState<number>(0);
  const [unreadChatCountAdmin, setUnreadChatCountAdmin] = useState<number>(0);

  // App Settings & About Modal State
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState<'settings' | 'about'>('settings');
  const [language, setLanguage] = useState<'en' | 'ne'>('en');
  const [vacancyAlerts, setVacancyAlerts] = useState<boolean>(true);
  const [currencyDisplay, setCurrencyDisplay] = useState<'both' | 'npr' | 'foreign'>('both');
  const [soundHaptics, setSoundHaptics] = useState<boolean>(true);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sapana_vacancies_v1', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('sapana_applications_v1', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('sapana_chat_v1', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('sapana_saved_jobs_v1', JSON.stringify(savedJobIds));
  }, [savedJobIds]);

  // ================= FIRESTORE REAL-TIME SUBSCRIPTIONS =================
  useEffect(() => {
    // 1. Subscribe to Vacancies Collection
    const unsubscribeVacancies = onSnapshot(
      collection(db, 'vacancies'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedVacancies: Vacancy[] = snapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            id: docSnap.id
          } as Vacancy));
          setVacancies(loadedVacancies);
        } else {
          // Seed initial verified vacancies to Firestore if collection is empty
          INITIAL_VACANCIES.forEach(async (vac) => {
            try {
              await setDoc(doc(db, 'vacancies', vac.id), vac);
            } catch (err) {
              console.warn('Initial vacancy seed notice:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'vacancies');
      }
    );

    // 2. Subscribe to Applicants Collection
    const unsubscribeApplicants = onSnapshot(
      collection(db, 'applicants'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedApps: CandidateApplication[] = snapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            id: docSnap.id
          } as CandidateApplication));
          setApplications(loadedApps);
        } else {
          // Seed initial applications if collection is empty
          INITIAL_APPLICATIONS.forEach(async (app) => {
            try {
              await setDoc(doc(db, 'applicants', app.id), app);
            } catch (err) {
              console.warn('Initial applicant seed notice:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'applicants');
      }
    );

    // 3. Subscribe to Real-Time Live Chat Messages
    const unsubscribeChat = onSnapshot(
      collection(db, 'chat_messages'),
      (snapshot) => {
        if (!snapshot.empty) {
          const loadedMessages: ChatMessage[] = snapshot.docs.map(docSnap => ({
            ...docSnap.data(),
            id: docSnap.id
          } as ChatMessage));

          // Sort messages by creation order
          loadedMessages.sort((a, b) => {
            const timeA = (a as any).createdAtMillis || 0;
            const timeB = (b as any).createdAtMillis || 0;
            return timeA - timeB;
          });

          setChatMessages(loadedMessages);
        } else {
          // Seed initial chat greetings
          INITIAL_CHAT_MESSAGES.forEach(async (msg, idx) => {
            try {
              await setDoc(doc(db, 'chat_messages', msg.id), {
                ...msg,
                createdAtMillis: Date.now() - (INITIAL_CHAT_MESSAGES.length - idx) * 60000
              });
            } catch (err) {
              console.warn('Initial chat seed notice:', err);
            }
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, 'chat_messages');
      }
    );

    return () => {
      unsubscribeVacancies();
      unsubscribeApplicants();
      unsubscribeChat();
    };
  }, []);

  const toggleSaveJob = (id: string) => {
    setSavedJobIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Add Vacancy: Real-time Firestore setDoc + local state
  const addVacancy = async (newVac: Omit<Vacancy, 'id' | 'appliedCount' | 'createdAt'>) => {
    const vacancyId = `vac-${Date.now().toString(36)}`;
    const vacancy: Vacancy = {
      ...newVac,
      id: vacancyId,
      appliedCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setVacancies(prev => [vacancy, ...prev]);

    try {
      await setDoc(doc(db, 'vacancies', vacancyId), vacancy);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `vacancies/${vacancyId}`);
    }
  };

  // Update Vacancy: Real-time Firestore updateDoc + local state
  const updateVacancy = async (id: string, updated: Partial<Vacancy>) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, ...updated } : v));
    if (selectedVacancy && selectedVacancy.id === id) {
      setSelectedVacancy(prev => prev ? { ...prev, ...updated } : null);
    }

    try {
      await updateDoc(doc(db, 'vacancies', id), updated);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `vacancies/${id}`);
    }
  };

  // Delete Vacancy: Real-time Firestore deleteDoc + local state
  const deleteVacancy = async (id: string) => {
    setVacancies(prev => prev.filter(v => v.id !== id));
    if (selectedVacancy && selectedVacancy.id === id) {
      setSelectedVacancy(null);
    }

    try {
      await deleteDoc(doc(db, 'vacancies', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `vacancies/${id}`);
    }
  };

  // Submit Application: Real-time Firestore setDoc + vacancy count update
  const submitApplication = (appData: Omit<CandidateApplication, 'id' | 'applicationCode' | 'status' | 'appliedDate'>) => {
    const codeNumber = Math.floor(1000 + Math.random() * 9000);
    const code = `SAP-${new Date().getFullYear()}-${codeNumber}`;
    const appId = `app-${Date.now()}`;
    const newApp: CandidateApplication = {
      ...appData,
      id: appId,
      applicationCode: code,
      status: 'Pending',
      appliedDate: new Date().toISOString().split('T')[0],
    };

    setApplications(prev => [newApp, ...prev]);

    // Update local vacancies
    setVacancies(prev => prev.map(v => {
      if (v.id === appData.jobId) {
        return { ...v, appliedCount: (v.appliedCount || 0) + 1 };
      }
      return v;
    }));

    setUnreadChatCountAdmin(prev => prev + 1);

    // Save to Firestore 'applicants'
    setDoc(doc(db, 'applicants', appId), newApp).catch((err) => {
      handleFirestoreError(err, OperationType.CREATE, `applicants/${appId}`);
    });

    // Increment vacancy count in Firestore
    const targetVac = vacancies.find(v => v.id === appData.jobId);
    if (targetVac) {
      updateDoc(doc(db, 'vacancies', appData.jobId), {
        appliedCount: (targetVac.appliedCount || 0) + 1
      }).catch(err => {
        console.warn('Applied count update note:', err);
      });
    }

    // Auto-message to chat confirming submission
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const autoNotice: ChatMessage = {
      id: `msg-sys-${Date.now()}`,
      sender: 'system',
      senderName: 'Sapana Automated Desk',
      text: `✅ Application submitted successfully for "${appData.jobTitle}" (Reference Code: ${code}). Our office verification desk is reviewing your passport. Expect a call within 24 hours.`,
      timestamp: timeStr,
    };

    setChatMessages(prev => [...prev, autoNotice]);

    setDoc(doc(db, 'chat_messages', autoNotice.id), {
      ...autoNotice,
      createdAtMillis: Date.now()
    }).catch(err => console.warn('Auto notice write note:', err));

    return code;
  };

  // Update Application Status: Real-time Firestore updateDoc + chat notice
  const updateApplicationStatus = (id: string, status: ApplicationStatus, remarks?: string, interviewDate?: string) => {
    const updatePayload: any = {
      status
    };
    if (remarks !== undefined) updatePayload.adminRemarks = remarks;
    if (interviewDate !== undefined) updatePayload.interviewDate = interviewDate;

    setApplications(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          status,
          adminRemarks: remarks !== undefined ? remarks : app.adminRemarks,
          interviewDate: interviewDate !== undefined ? interviewDate : app.interviewDate,
        };
      }
      return app;
    }));

    updateDoc(doc(db, 'applicants', id), updatePayload).catch(err => {
      handleFirestoreError(err, OperationType.UPDATE, `applicants/${id}`);
    });

    // Post update notice in chat for user
    const app = applications.find(a => a.id === id);
    if (app) {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const statusNotice: ChatMessage = {
        id: `msg-status-${Date.now()}`,
        sender: 'staff',
        senderName: 'Office Verification Desk',
        text: `📌 Status Update for ${app.fullName} (${app.applicationCode}): Status changed to "${status}". ${remarks ? `Note: ${remarks}` : ''}${interviewDate ? ` (Interview scheduled on: ${interviewDate})` : ''}`,
        timestamp: timeStr,
      };

      setChatMessages(prev => [...prev, statusNotice]);
      setUnreadChatCountClient(prev => prev + 1);

      setDoc(doc(db, 'chat_messages', statusNotice.id), {
        ...statusNotice,
        createdAtMillis: Date.now()
      }).catch(err => console.warn('Status notice write note:', err));
    }
  };

  const deleteApplication = (id: string) => {
    setApplications(prev => prev.filter(a => a.id !== id));
    deleteDoc(doc(db, 'applicants', id)).catch(err => {
      handleFirestoreError(err, OperationType.DELETE, `applicants/${id}`);
    });
  };

  // Send Chat Message: Real-time Firestore setDoc
  const sendChatMessage = (text: string, sender: 'client' | 'staff', senderName?: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const msgId = `msg-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: msgId,
      sender,
      senderName: senderName || (sender === 'client' ? 'You (Applicant)' : 'Sapana Counselor'),
      text,
      timestamp: timeStr,
    };

    setChatMessages(prev => [...prev, newMsg]);

    setDoc(doc(db, 'chat_messages', msgId), {
      ...newMsg,
      createdAtMillis: Date.now()
    }).catch(err => {
      handleFirestoreError(err, OperationType.CREATE, `chat_messages/${msgId}`);
    });

    if (sender === 'client') {
      setUnreadChatCountAdmin(prev => prev + 1);
      // Auto-reply simulation for responsive candidate experience if staff is not active
      setTimeout(() => {
        const replies = [
          'Namaste! Thank you for contacting Sapana Employment Service. Our documentation officer is reviewing your question and will reply shortly. You may also call our hotline directly at +9779716275258.',
          'Understood. For passport verification and interview slots, please make sure your passport has at least 2 years validity.',
          'Thank you. We have forwarded your inquiry to our overseas processing department. One of our counselors will attend to you.',
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyId = `msg-reply-${Date.now()}`;
        const autoReply: ChatMessage = {
          id: replyId,
          sender: 'staff',
          senderName: 'Sapana Support Desk',
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatMessages(curr => [...curr, autoReply]);
        setUnreadChatCountClient(curr => curr + 1);

        setDoc(doc(db, 'chat_messages', replyId), {
          ...autoReply,
          createdAtMillis: Date.now()
        }).catch(err => console.warn('Reply message write note:', err));
      }, 1500);
    } else {
      setUnreadChatCountClient(prev => prev + 1);
    }
  };

  const clearChatHistory = () => {
    setChatMessages(INITIAL_CHAT_MESSAGES);
  };

  const resetChatUnread = (target: 'client' | 'admin') => {
    if (target === 'client') setUnreadChatCountClient(0);
    if (target === 'admin') setUnreadChatCountAdmin(0);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        role,
        vacancies,
        addVacancy,
        updateVacancy,
        deleteVacancy,
        applications,
        submitApplication,
        updateApplicationStatus,
        deleteApplication,
        chatMessages,
        sendChatMessage,
        clearChatHistory,
        activeTab,
        setActiveTab,
        selectedVacancy,
        setSelectedVacancy,
        applyingForJob,
        setApplyingForJob,
        isCallModalOpen,
        setIsCallModalOpen,
        mobilePreviewFrame,
        setMobilePreviewFrame,
        savedJobIds,
        toggleSaveJob,
        unreadChatCountClient,
        unreadChatCountAdmin,
        resetChatUnread,
        isSettingsModalOpen,
        setIsSettingsModalOpen,
        settingsInitialTab,
        setSettingsInitialTab,
        language,
        setLanguage,
        vacancyAlerts,
        setVacancyAlerts,
        currencyDisplay,
        setCurrencyDisplay,
        soundHaptics,
        setSoundHaptics,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
