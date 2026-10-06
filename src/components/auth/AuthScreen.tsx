import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';
import { Logo } from '../Logo';
import { COMPANY_CONTACTS } from '../../data/initialData';
import { 
  sendPhoneOTP, 
  verifyOTP, 
  loginWithPassword, 
  signUpCandidate, 
  adminLogin 
} from '../../services/authService';
import { 
  User, 
  Briefcase, 
  Lock, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  FileText, 
  Building2, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  RotateCw,
  Sparkles
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { login, setIsCallModalOpen } = useApp();

  // Selected portal role: 'client' or 'admin'
  const [authRole, setAuthRole] = useState<UserRole>('client');

  // Client mode: 'login' | 'signup'
  const [clientMode, setClientMode] = useState<'login' | 'signup'>('login');

  // Applicant login method: 'otp' | 'password'
  const [authMethod, setAuthMethod] = useState<'otp' | 'password'>('otp');

  // Form Fields
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  // Active in-memory simulated OTP session
  const [activeGeneratedOtp, setActiveGeneratedOtp] = useState<string | null>(null);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [otpSentBanner, setOtpSentBanner] = useState<string | null>(null);

  // Client Signup specific
  const [fullName, setFullName] = useState('');
  const [passportNumber, setPassportNumber] = useState('');

  // Admin specific
  const [adminPin, setAdminPin] = useState('');
  const [staffBranch, setStaffBranch] = useState<'Nepalgunj Head Office' | 'Bhurigaun Branch'>('Nepalgunj Head Office');

  // Feedback & Loading states
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 60-second OTP countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpCountdown > 0) {
      timer = setInterval(() => {
        setOtpCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpCountdown]);

  // Handle "Send OTP" action
  const handleSendOtp = async () => {
    setErrorMsg(null);
    const cleaned = phoneOrEmail.trim();
    if (!cleaned || cleaned.length < 9) {
      setErrorMsg('Please enter a valid mobile number first (e.g. +977 98XXXXXXXX).');
      return;
    }

    setIsOtpSending(true);
    try {
      const res = await sendPhoneOTP(cleaned);
      setIsOtpSending(false);
      if (!res.success) {
        setErrorMsg(res.message);
        return;
      }

      setActiveGeneratedOtp(res.simulatedCode || null);
      setOtpSentBanner(`OTP code dispatched to ${cleaned}. SMS Verification Code: ${res.simulatedCode}`);
      setOtpCountdown(60);
    } catch {
      setIsOtpSending(false);
      setErrorMsg('Failed to send OTP. Please check network connection.');
    }
  };

  const handleAutoFillOtp = () => {
    if (activeGeneratedOtp) {
      setOtpCode(activeGeneratedOtp);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. ADMIN / OFFICE STAFF SUBMISSION
    if (authRole === 'admin') {
      if (!adminPin.trim()) {
        setErrorMsg('Access Denied: Invalid Admin Credentials');
        return;
      }

      setIsLoading(true);
      const res = await adminLogin(phoneOrEmail, adminPin, staffBranch);
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Access Denied: Invalid Admin Credentials');
        return;
      }

      login(res.user);
      return;
    }

    // 2. APPLICANT LOGIN
    if (clientMode === 'login') {
      if (authMethod === 'otp') {
        if (!phoneOrEmail.trim()) {
          setErrorMsg('Please enter your mobile phone number.');
          return;
        }
        if (!otpCode.trim()) {
          setErrorMsg('Please enter the 6-digit OTP code sent to your phone.');
          return;
        }
        if (!activeGeneratedOtp || otpCode.trim() !== activeGeneratedOtp) {
          setErrorMsg('Invalid OTP Code. Please enter the 6-digit verification code sent to your phone.');
          return;
        }

        setIsLoading(true);
        const res = await verifyOTP(phoneOrEmail, otpCode.trim());
        setIsLoading(false);

        if (!res.success || !res.user) {
          setErrorMsg(res.error || 'Invalid OTP Code.');
          return;
        }

        login(res.user);
        return;
      }

      // Password Method
      if (authMethod === 'password') {
        if (!phoneOrEmail.trim()) {
          setErrorMsg('Invalid Phone/Password');
          return;
        }
        if (!password.trim() || password.length < 6) {
          setErrorMsg('Invalid Phone/Password');
          return;
        }

        setIsLoading(true);
        const res = await loginWithPassword(phoneOrEmail, password);
        setIsLoading(false);

        if (!res.success || !res.user) {
          setErrorMsg(res.error || 'Invalid Phone/Password');
          return;
        }

        login(res.user);
        return;
      }
    }

    // 3. APPLICANT SIGNUP / REGISTRATION
    if (clientMode === 'signup') {
      if (!fullName.trim() || fullName.trim().length < 3) {
        setErrorMsg('Full Name (as written on passport) is required.');
        return;
      }
      if (!phoneOrEmail.trim() || phoneOrEmail.trim().length < 9) {
        setErrorMsg('Valid mobile phone number is required.');
        return;
      }
      if (!passportNumber.trim() || passportNumber.trim().length < 6) {
        setErrorMsg('Passport Number is required for foreign employment verification.');
        return;
      }

      if (authMethod === 'otp') {
        if (!otpCode.trim() || !activeGeneratedOtp || otpCode.trim() !== activeGeneratedOtp) {
          setErrorMsg('Invalid OTP Code. Please enter the 6-digit verification code sent to your phone.');
          return;
        }
      } else {
        if (!password.trim() || password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          return;
        }
      }

      setIsLoading(true);
      const res = await signUpCandidate(
        fullName,
        phoneOrEmail,
        passportNumber,
        authMethod === 'otp' ? otpCode.trim() : password,
        authMethod,
        activeGeneratedOtp || undefined
      );
      setIsLoading(false);

      if (!res.success || !res.user) {
        setErrorMsg(res.error || 'Registration failed. Please check your information.');
        return;
      }

      login(res.user);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#071120] via-[#0A162B] to-[#060D1A] text-slate-100 flex flex-col justify-between p-3 sm:p-6 animate-fade-in">
      {/* Top bar with government accreditation seal */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between text-[11px] text-slate-400 py-1 border-b border-[#1A2E55]">
        <div className="flex items-center gap-1.5 truncate">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="text-amber-400 font-semibold">{COMPANY_CONTACTS.licenseNo}</span>
          <span className="text-slate-500">·</span>
          <span className="text-slate-300 truncate">DoFE Govt. Regd. Agency</span>
        </div>
        <button
          onClick={() => setIsCallModalOpen(true)}
          className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium"
        >
          <Phone className="w-3 h-3 text-amber-400" />
          <span>Hotline Support</span>
        </button>
      </div>

      {/* Main Authentication Container */}
      <div className="max-w-md w-full mx-auto my-auto py-4 space-y-4">
        {/* Brand Header & Official Logo */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <Logo size="xl" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight font-brand">
              SAPANA EMPLOYMENT SERVICE
            </h1>
            <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Pvt. Ltd. · Nepalgunj & Bardiya
            </p>
            <p className="text-[11px] text-slate-300 mt-1">
              Recruitment · Consultancy · Manpower Solution
            </p>
          </div>
        </div>

        {/* Portal Role Selector (Client vs Office Staff) */}
        <div className="p-1 rounded-2xl bg-[#0E1C36] border border-[#213966] grid grid-cols-2 gap-1 shadow-inner">
          <button
            type="button"
            onClick={() => {
              setAuthRole('client');
              setErrorMsg(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              authRole === 'client'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Applicant / Client</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthRole('admin');
              setErrorMsg(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              authRole === 'admin'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Office Staff / Admin</span>
          </button>
        </div>

        {/* Auth Box Container */}
        <div className="bg-[#0E1C36] border border-[#233C6B] rounded-2xl p-5 shadow-2xl space-y-4">
          {/* Sub-header text */}
          <div className="flex items-center justify-between border-b border-[#1C335C] pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">
                {authRole === 'admin'
                  ? 'Office Staff Console Sign In'
                  : clientMode === 'login'
                  ? 'Candidate Account Sign In'
                  : 'New Candidate Registration'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {authRole === 'admin'
                  ? 'Protected access for authorized verification officers only'
                  : clientMode === 'login'
                  ? 'Sign in via verified Mobile OTP or Password'
                  : 'Register passport details for overseas placement'}
              </p>
            </div>

            {authRole === 'client' && (
              <div className="flex bg-[#122448] p-0.5 rounded-lg border border-[#213B6B]">
                <button
                  type="button"
                  onClick={() => {
                    setClientMode('login');
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    clientMode === 'login' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientMode('signup');
                    setErrorMsg(null);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    clientMode === 'signup' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  Register
                </button>
              </div>
            )}
          </div>

          {/* Verification Method Switcher for Applicant (OTP vs Password) */}
          {authRole === 'client' && (
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#10203E] rounded-xl border border-[#1E345C]">
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('otp');
                  setErrorMsg(null);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  authMethod === 'otp'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile OTP SMS</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('password');
                  setErrorMsg(null);
                }}
                className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  authMethod === 'password'
                    ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Password</span>
              </button>
            </div>
          )}

          {/* OTP Sent Banner Notification */}
          {otpSentBanner && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs space-y-1.5 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>OTP Sent Successfully!</span>
                </span>
                {activeGeneratedOtp && (
                  <button
                    type="button"
                    onClick={handleAutoFillOtp}
                    className="text-[10px] bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded shadow hover:bg-emerald-300 transition-colors flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Fill Code</span>
                  </button>
                )}
              </div>
              <p className="text-[11px] text-emerald-200 font-mono">
                {otpSentBanner}
              </p>
            </div>
          )}

          {/* Error Message banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Applicant Signup fields */}
            {authRole === 'client' && clientMode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Full Name (As on Passport) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Ramesh Bahadur Gurung"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#122244] border border-[#223966] focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Passport Number *
                  </label>
                  <div className="relative">
                    <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={passportNumber}
                      onChange={(e) => setPassportNumber(e.target.value)}
                      placeholder="e.g. PP-10928374"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-[#122244] border border-[#223966] focus:border-amber-400 rounded-xl text-xs text-white uppercase placeholder-slate-500 focus:outline-none transition-colors font-mono"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Phone or Email Input with functional Send OTP button */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  {authRole === 'admin'
                    ? 'Staff Official Email / ID *'
                    : authMethod === 'otp'
                    ? 'Registered Mobile Phone (+977) *'
                    : 'Mobile Phone or Email *'}
                </label>

                {authRole === 'client' && authMethod === 'otp' && (
                  <span className="text-[10px] text-slate-400">
                    Nepal DoFE SMS Gateway
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  {authRole === 'admin' ? (
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  ) : (
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  )}
                  <input
                    type={authRole === 'admin' ? 'email' : 'text'}
                    required
                    value={phoneOrEmail}
                    onChange={(e) => setPhoneOrEmail(e.target.value)}
                    placeholder={
                      authRole === 'admin'
                        ? 'officer.suman@sapanaemployment.com.np'
                        : '+977 98XXXXXXXX'
                    }
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#122244] border border-[#223966] focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-sans"
                  />
                </div>

                {/* Send OTP button next to Phone field */}
                {authRole === 'client' && authMethod === 'otp' && (
                  <button
                    type="button"
                    disabled={isOtpSending || otpCountdown > 0}
                    onClick={handleSendOtp}
                    className={`min-h-[42px] px-3.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
                      otpCountdown > 0
                        ? 'bg-[#152545] border border-[#233B6B] text-slate-400 cursor-not-allowed'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md shadow-amber-400/20 active:scale-95'
                    }`}
                  >
                    {isOtpSending ? (
                      <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : otpCountdown > 0 ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className="font-mono tabular-nums">{otpCountdown}s</span>
                      </>
                    ) : (
                      <>
                        <span>{activeGeneratedOtp ? 'Resend' : 'Send OTP'}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* OTP Input Field (when in OTP method) */}
            {authRole === 'client' && authMethod === 'otp' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    6-Digit Mobile Verification Code *
                  </label>
                  {otpCountdown > 0 && (
                    <span className="text-[10px] text-amber-400 font-mono">
                      Resend code in {otpCountdown}s
                    </span>
                  )}
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit OTP (e.g. 123456)"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#122244] border border-[#223966] focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono tracking-widest text-base"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Click <strong className="text-amber-400">Send OTP</strong> above to receive your 6-digit security code.
                </p>
              </div>
            )}

            {/* Password Field (when in Password method) */}
            {authRole === 'client' && authMethod === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password *
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Minimum 6 characters
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter account password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#122244] border border-[#223966] focus:border-amber-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Office Branch Field (Only for Admin) */}
            {authRole === 'admin' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Operating Office Branch *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <select
                    value={staffBranch}
                    onChange={(e) => setStaffBranch(e.target.value as any)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-[#122244] border border-[#223966] focus:border-amber-400 rounded-xl text-xs text-white focus:outline-none transition-colors"
                  >
                    <option value="Nepalgunj Head Office">Nepalgunj Head Office (BP Chowk, Banke)</option>
                    <option value="Bhurigaun Branch">Bhurigaun Branch Office (Bardiya)</option>
                  </select>
                </div>
              </div>
            )}

            {/* Admin PIN / Master Password Field */}
            {authRole === 'admin' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-300">
                    Secret Security PIN / Master Password *
                  </label>
                  <span className="text-[10px] text-blue-400 font-semibold">
                    Authorized Personnel Only
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPin}
                    onChange={(e) => setAdminPin(e.target.value)}
                    placeholder="Enter Staff PIN or Master Password"
                    className="w-full pl-10 pr-10 py-2.5 bg-[#122244] border border-[#223966] focus:border-blue-400 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-2.5 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* Primary Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full min-h-[44px] rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-98 ${
                authRole === 'admin'
                  ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/25'
              } disabled:opacity-50`}
            >
              {isLoading ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <span>
                    {authRole === 'admin'
                      ? 'Verify Staff Access & Open Console'
                      : clientMode === 'login'
                      ? authMethod === 'otp'
                        ? 'Verify OTP & Open Candidate Portal'
                        : 'Sign In via Password'
                      : 'Complete Registration & Sign In'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="pt-2 border-t border-[#1C325B] text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted DoFE Licensed Recruitment Verification</span>
          </div>
        </div>

        {/* Office Contact Info */}
        <div className="text-center text-[11px] text-slate-400 space-y-1">
          <p>
            <strong className="text-amber-400">Head Office:</strong> {COMPANY_CONTACTS.headOffice}
          </p>
          <p>
            <strong className="text-blue-300">Branch Office:</strong> {COMPANY_CONTACTS.branchOffice}
          </p>
          <p className="text-slate-500 pt-0.5">
            Hotlines: {COMPANY_CONTACTS.hotlines.join(' · ')}
          </p>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="text-center text-[10px] text-slate-500 py-1">
        © 2026 Sapana Employment Service Pvt. Ltd. · Ministry of Labour Govt. Regd. Lic. 1234/078/079
      </div>
    </div>
  );
};
