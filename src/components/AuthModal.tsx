import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, isValidStudentEmail } from '../store/useAppStore';
import { sendEmailOtp, verifyEmailOtp } from '../lib/supabase';
import { UserProfile } from '../types/stats';
import {
  X,
  Mail,
  Lock,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  Info,
  Loader2,
  LogIn,
  UserPlus,
  Eye,
  EyeOff,
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'login' | 'register';
}

const RANDOM_AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '🚀', '⚡', '📊', '🧠', '🦉', '🎯'];

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  onSuccess,
  initialTab = 'login',
}) => {
  const {
    language,
    registerAccountAndSendOtp,
    verifyOtpAndActivateAccount,
    loginWithPassword,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    schoolEmail: '',
    university: '',
    departmentAndClass: '',
    avatarEmoji: '👨‍🎓',
  });
  const [registerPassword, setRegisterPassword] = useState('');
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);

  // OTP State (8 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendTimer, setResendTimer] = useState<number>(60);

  // Countdown timer for resend OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Submit Login Form
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage(language === 'tr' ? 'Lütfen e-posta adresinizi girin.' : 'Please enter your email.');
      return;
    }

    if (!isValidStudentEmail(cleanEmail)) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir üniversite e-posta adresi giriniz (ör: ad.soyad@universite.edu.tr).'
          : 'Please enter a valid university email address.'
      );
      return;
    }

    if (!loginPassword) {
      setErrorMessage(language === 'tr' ? 'Lütfen şifrenizi girin.' : 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithPassword(cleanEmail, loginPassword);
      if (!res.success) {
        setErrorMessage(res.message || (language === 'tr' ? 'Giriş yapılamadı.' : 'Login failed.'));
        return;
      }

      setSuccessMessage(language === 'tr' ? 'Giriş başarılı! Yönlendiriliyorsunuz...' : 'Login successful!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Giriş işlemi başarısız.' : 'Login failed.'));
    } finally {
      setLoading(false);
    }
  };

  // Submit Register Form & Request OTP Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailClean = formData.schoolEmail.trim().toLowerCase();
    if (!emailClean) {
      setErrorMessage(language === 'tr' ? 'Lütfen e-posta adresinizi girin.' : 'Please enter your email.');
      return;
    }

    if (!isValidStudentEmail(emailClean)) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir üniversite e-posta adresi giriniz (ör: ad.soyad@universite.edu.tr).'
          : 'Please enter a valid university email address.'
      );
      return;
    }

    if (!formData.fullName.trim()) {
      setErrorMessage(language === 'tr' ? 'Lütfen Ad Soyad alanını doldurun.' : 'Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendEmailOtp(formData.schoolEmail);

      if (res.simulatedCode) {
        setSimulatedCode(res.simulatedCode);
      } else {
        setSimulatedCode(null);
      }

      const randomEmoji = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];

      registerAccountAndSendOtp(
        {
          ...formData,
          avatarEmoji: randomEmoji,
          password: registerPassword || '123456',
        },
        res.simulatedCode
      );

      setStep('otp');
      setResendTimer(60);
      setSuccessMessage(
        language === 'tr'
          ? `${formData.schoolEmail} adresine 8 haneli doğrulama kodu gönderildi.`
          : `8-digit verification code sent to ${formData.schoolEmail}.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'E-posta doğrulama kodu gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit input change
  const handleOtpDigitChange = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) {
      const newDigits = [...otpDigits];
      newDigits[index] = '';
      setOtpDigits(newDigits);
      return;
    }

    if (cleaned.length > 1) {
      const pastedCode = cleaned.slice(0, 8).split('');
      const newDigits = [...otpDigits];
      pastedCode.forEach((char, i) => {
        if (i < 8) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      const nextIdx = Math.min(pastedCode.length, 7);
      if (otpInputRefs.current[nextIdx]) {
        otpInputRefs.current[nextIdx]?.focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);

    if (cleaned && index < 7 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace and arrow navigation across digits
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...otpDigits];
        newDigits[index] = '';
        setOtpDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Paste event for OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasteData) return;
    const chars = pasteData.split('');
    const newDigits = [...otpDigits];
    chars.forEach((c, i) => {
      if (i < 8) newDigits[i] = c;
    });
    setOtpDigits(newDigits);
    const focusIdx = Math.min(chars.length, 7);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // Submit OTP Verification Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('');

    if (code.length < 8) {
      setErrorMessage(language === 'tr' ? 'Lütfen 8 haneli kodu eksiksiz giriniz.' : 'Please enter the full 8-digit code.');
      return;
    }

    setLoading(true);

    try {
      const res = verifyOtpAndActivateAccount(code);

      if (!res.success) {
        const remoteRes = await verifyEmailOtp(formData.schoolEmail, code);
        if (!remoteRes.success) {
          throw new Error(remoteRes.error || (language === 'tr' ? 'Girdiğiniz doğrulama kodu hatalı.' : 'Invalid code.'));
        }
      }

      setSuccessMessage(language === 'tr' ? 'Hesabınız başarıyla doğrulandı! Giriş yapılıyor...' : 'Account verified successfully!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 900);
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Doğrulama kodu hatalı. Lütfen tekrar deneyin.' : 'Verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  // Resend code action
  const handleResendCode = async () => {
    if (resendTimer > 0) return;
    setErrorMessage(null);
    setLoading(true);
    try {
      const res = await sendEmailOtp(formData.schoolEmail);
      if (res.simulatedCode) setSimulatedCode(res.simulatedCode);
      const randomEmoji = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];
      registerAccountAndSendOtp(
        {
          ...formData,
          avatarEmoji: randomEmoji,
          password: registerPassword || '123456',
        },
        res.simulatedCode
      );
      setResendTimer(60);
      setSuccessMessage(language === 'tr' ? 'Yeni kod tekrar gönderildi.' : 'New code sent.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Kod tekrar gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/35 backdrop-blur-xs animate-fade-in font-sans">
      <div
        className="hidden sm:block absolute inset-0 -z-10"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher: Giriş Yap | Kayıt Ol */}
        {step !== 'otp' && (
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 mb-5 max-w-xs mx-auto w-full">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'login'
                  ? 'bg-[#ff7a00] text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Giriş Yap' : 'Sign In'}</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeTab === 'register'
                  ? 'bg-[#ff7a00] text-white shadow-sm shadow-orange-500/20'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'tr' ? 'Kayıt Ol' : 'Sign Up'}</span>
            </button>
          </div>
        )}

        {/* Header Banner - Only for OTP verification */}
        {step === 'otp' && (
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/25 shadow-inner mb-2.5">
              <KeyRound className="w-6 h-6 stroke-[2] animate-bounce" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'tr' ? 'E-posta Kodunu Doğrula' : 'Verify Email Code'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {language === 'tr'
                ? `${formData.schoolEmail} adresine gelen 8 haneli kodu aşağıya giriniz.`
                : `Enter the 8-digit code sent to ${formData.schoolEmail}`}
            </p>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center space-x-2">
            <Info className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ─── TAB 1: GİRİŞ YAP (LOGIN FORM) ─── */}
        {step !== 'otp' && activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {/* School Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Üniversite E-postası' : 'University Email'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={language === 'tr' ? 'ad.soyad@universite.edu.tr' : 'your.email@university.edu'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Şifre' : 'Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#ff7a00]/30 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'tr' ? 'Giriş Yap' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── TAB 2: KAYIT OL (REGISTER FORM) ─── */}
        {step === 'register' && activeTab === 'register' && (
          <form onSubmit={handleSendOtp} autoComplete="off" className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Ad Soyad' : 'Full Name'} *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="name"
                  placeholder={language === 'tr' ? 'Adınızı ve soyadınızı giriniz' : 'Enter your full name'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* School Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Üniversite E-postası' : 'University Email'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={language === 'tr' ? 'ad.soyad@universite.edu.tr' : 'your.email@university.edu'}
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="w-full pl-10 pr-3 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* University & Department */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'tr' ? 'Üniversite' : 'University'}
                </label>
                <div className="relative">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'tr' ? 'Üniversiteniz' : 'University'}
                    value={formData.university}
                    onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                    className="w-full pl-8 pr-2.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'tr' ? 'Bölüm ve Sınıf' : 'Dept & Class'}
                </label>
                <div className="relative">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={language === 'tr' ? 'Bölümünüz' : 'Department'}
                    value={formData.departmentAndClass}
                    onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                    className="w-full pl-8 pr-2.5 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Şifre Belirleyin' : 'Set Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                  aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-3 py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#ff7a00]/30 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'tr' ? 'Kayıt Ol ve Doğrula' : 'Sign Up & Verify'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── STEP 2: OTP VERIFICATION FORM ─── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* 8 Distinct Slots (4 + 4 with separator) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 my-3">
              {otpDigits.map((digit, idx) => (
                <React.Fragment key={idx}>
                  {idx === 4 && (
                    <div className="w-1.5 sm:w-2 h-0.5 bg-slate-300 rounded-full mx-0.5" />
                  )}
                  <input
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    autoFocus={idx === 0}
                    className={`w-8 h-12 sm:w-10 sm:h-14 rounded-xl border-2 text-center font-mono font-black text-lg sm:text-xl transition-all shadow-2xs ${
                      digit
                        ? 'bg-orange-50/70 border-[#ff7a00] text-[#ff7a00]'
                        : 'bg-slate-50 border-slate-200 text-slate-900 focus:bg-white focus:border-[#ff7a00] focus:ring-4 focus:ring-[#ff7a00]/15'
                    } focus:outline-none`}
                  />
                </React.Fragment>
              ))}
            </div>

            {simulatedCode && (
              <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold text-center flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {language === 'tr' ? 'Test Onay Kodu: ' : 'Test Verification Code: '}
                  <strong className="font-mono text-sm tracking-wider text-[#ff7a00] ml-1">{simulatedCode}</strong>
                </span>
              </div>
            )}

            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length < 8}
                className="w-full py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black tracking-wide flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#ff7a00]/30 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>{language === 'tr' ? 'Kodu Doğrula ve Hesaba Gir' : 'Verify Code & Access Account'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('register')}
                  className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                >
                  {language === 'tr' ? 'Bilgileri Değiştir' : 'Change Info'}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || loading}
                  className="text-[#ff7a00] hover:underline disabled:opacity-40 disabled:no-underline flex items-center space-x-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>
                    {resendTimer > 0
                      ? language === 'tr'
                        ? `Tekrar Kod (${resendTimer}s)`
                        : `Resend (${resendTimer}s)`
                      : language === 'tr'
                      ? 'Tekrar Kod Gönder'
                      : 'Resend Code'}
                  </span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
