import React, { useState, useRef, useEffect } from 'react';
import { useAppStore, isValidStudentEmail } from '../store/useAppStore';
import { sendEmailOtp, verifyEmailOtp, signUpWithSupabase, saveUserProfileToSupabase, supabase } from '../lib/supabase';
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
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { soundService } from '../services/soundService';

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
    loginWithOtpSession,
    updateUserProfile,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>(initialTab);
  const [loginMode, setLoginMode] = useState<'password' | 'otp'>('password');
  const [step, setStep] = useState<'form' | 'otp' | 'otp_login' | 'profileSetup'>('form');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOtpFallbackBtn, setShowOtpFallbackBtn] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register Form State (Only Email & Password initially)
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
    if ((step === 'otp' || step === 'otp_login') && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Handle Switch to OTP Login Directly
  const handleStartOtpLogin = async (targetEmail?: string) => {
    const cleanEmail = (targetEmail || loginEmail).trim().toLowerCase();
    if (!cleanEmail) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen e-posta adresinizi girin.' : 'Please enter your email.');
      return;
    }
    if (!isValidStudentEmail(cleanEmail)) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen geçerli bir e-posta adresi giriniz.' : 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setShowOtpFallbackBtn(false);

    try {
      const res = await sendEmailOtp(cleanEmail);
      if (!res.success) {
        soundService.playWrong();
        setErrorMessage(res.error || (language === 'tr' ? 'Doğrulama kodu gönderilemedi.' : 'Could not send verification code.'));
        return;
      }

      if (res.simulatedCode) {
        setSimulatedCode(res.simulatedCode);
      } else {
        setSimulatedCode(null);
      }

      setLoginEmail(cleanEmail);
      setOtpDigits(['', '', '', '', '', '', '', '']);
      setStep('otp_login');
      setResendTimer(60);
      soundService.playModalOpen();
      setSuccessMessage(
        language === 'tr'
          ? `${cleanEmail} adresine 8 haneli tek kullanımlık giriş kodu gönderildi.`
          : `8-digit login code sent to ${cleanEmail}.`
      );
    } catch (err: any) {
      soundService.playWrong();
      setErrorMessage(err.message || 'Giriş kodu gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Submit Login Form
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowOtpFallbackBtn(false);

    const cleanEmail = loginEmail.trim().toLowerCase();
    if (!cleanEmail) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen e-posta adresinizi girin.' : 'Please enter your email.');
      return;
    }

    if (!isValidStudentEmail(cleanEmail)) {
      soundService.playWrong();
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir e-posta adresi giriniz.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (loginMode === 'otp') {
      await handleStartOtpLogin(cleanEmail);
      return;
    }

    if (!loginPassword) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen şifrenizi girin.' : 'Please enter your password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginWithPassword(cleanEmail, loginPassword);
      if (!res.success) {
        soundService.playWrong();
        setErrorMessage(res.message || (language === 'tr' ? 'Giriş yapılamadı.' : 'Login failed.'));
        setShowOtpFallbackBtn(true);
        return;
      }

      soundService.playCorrect();
      setSuccessMessage(language === 'tr' ? 'Giriş başarılı! Yönlendiriliyorsunuz...' : 'Login successful!');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } catch (err: any) {
      soundService.playWrong();
      setErrorMessage(err.message || (language === 'tr' ? 'Giriş işlemi başarısız.' : 'Login failed.'));
      setShowOtpFallbackBtn(true);
    } finally {
      setLoading(false);
    }
  };

  // Submit Register Form & Request OTP Code (ONLY EMAIL & PASSWORD)
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const emailClean = formData.schoolEmail.trim().toLowerCase();
    if (!emailClean) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen e-posta adresinizi girin.' : 'Please enter your email.');
      return;
    }

    if (!isValidStudentEmail(emailClean)) {
      soundService.playWrong();
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir e-posta adresi giriniz.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!registerPassword || registerPassword.trim().length < 4) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen en az 4 karakterli bir şifre belirleyin.' : 'Password must be at least 4 characters.');
      return;
    }

    setLoading(true);
    try {
      const fallbackName = emailClean.split('@')[0];
      
      // Try signup with Supabase
      const signUpRes = await signUpWithSupabase(emailClean, registerPassword.trim(), {
        fullName: fallbackName,
      });

      let simulated = null;
      if (!signUpRes.success) {
        // Fallback to OTP send if already partially registered or OTP mode
        const otpRes = await sendEmailOtp(emailClean, { fullName: fallbackName });
        if (!otpRes.success) {
          soundService.playWrong();
          setErrorMessage(otpRes.error || signUpRes.error || (language === 'tr' ? 'Doğrulama kodu gönderilemedi.' : 'Could not send verification code.'));
          return;
        }
        if (otpRes.simulatedCode) simulated = otpRes.simulatedCode;
      }

      setSimulatedCode(simulated);
      const randomEmoji = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];

      registerAccountAndSendOtp(
        {
          ...formData,
          fullName: fallbackName,
          avatarEmoji: randomEmoji,
        },
        simulated || undefined
      );

      soundService.playModalOpen();
      setStep('otp');
      setResendTimer(60);
      setSuccessMessage(
        language === 'tr'
          ? `${emailClean} adresine 8 haneli doğrulama kodu gönderildi.`
          : `8-digit verification code sent to ${emailClean}.`
      );
    } catch (err: any) {
      soundService.playWrong();
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
      soundService.playOtpStep(Math.min(pastedCode.length - 1, 7));
      const nextIdx = Math.min(pastedCode.length, 7);
      if (otpInputRefs.current[nextIdx]) {
        otpInputRefs.current[nextIdx]?.focus();
      }
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = cleaned;
    setOtpDigits(newDigits);
    soundService.playOtpStep(index);

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
    soundService.playOtpStep(Math.min(chars.length - 1, 7));
    const focusIdx = Math.min(chars.length, 7);
    otpInputRefs.current[focusIdx]?.focus();
  };

  // Submit OTP Verification Code for Registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('').trim();

    if (code.length < 8) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen 8 haneli kodu eksiksiz giriniz.' : 'Please enter the full 8-digit code.');
      return;
    }

    setLoading(true);

    try {
      const cleanEmail = formData.schoolEmail.trim().toLowerCase();

      // 1. Try remote Supabase verification
      const remoteRes = await verifyEmailOtp(cleanEmail, code);

      if (remoteRes.success) {
        if (supabase && registerPassword.trim()) {
          try {
            await supabase.auth.updateUser({ password: registerPassword.trim() });
          } catch (pwErr) {
            console.warn('Could not update user password:', pwErr);
          }
        }

        verifyOtpAndActivateAccount(code, true);

        saveUserProfileToSupabase({
          ...formData,
          isVerified: true,
        });
      } else {
        const localRes = verifyOtpAndActivateAccount(code);
        if (!localRes.success) {
          throw new Error(remoteRes.error || localRes.message || (language === 'tr' ? 'Girdiğiniz doğrulama kodu hatalı.' : 'Invalid code.'));
        }
      }

      soundService.playCorrect();
      // Transition to profile setup step after successful email confirmation
      setStep('profileSetup');
      setSuccessMessage(language === 'tr' ? 'E-postanız doğrulandı! 🎉 Şimdi profilinizi oluşturun.' : 'Email verified! 🎉 Setup your profile.');
    } catch (err: any) {
      soundService.playWrong();
      setErrorMessage(err.message || (language === 'tr' ? 'Doğrulama kodu hatalı. Lütfen tekrar deneyin.' : 'Verification failed.'));
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP Login Code (Passwordless instant login)
  const handleVerifyLoginOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('').trim();

    if (code.length < 8) {
      soundService.playWrong();
      setErrorMessage(language === 'tr' ? 'Lütfen 8 haneli kodu eksiksiz giriniz.' : 'Please enter the full 8-digit code.');
      return;
    }

    setLoading(true);
    try {
      const cleanEmail = loginEmail.trim().toLowerCase();
      const remoteRes = await verifyEmailOtp(cleanEmail, code);

      if (!remoteRes.success) {
        soundService.playWrong();
        setErrorMessage(remoteRes.error || (language === 'tr' ? 'Doğrulama kodu hatalı veya süresi dolmuş.' : 'Invalid or expired code.'));
        return;
      }

      await loginWithOtpSession(cleanEmail, remoteRes.user);
      soundService.playCorrect();
      setSuccessMessage(language === 'tr' ? 'Giriş başarılı! Hoş geldiniz 🎉' : 'Login successful! Welcome 🎉');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 700);
    } catch (err: any) {
      soundService.playWrong();
      setErrorMessage(err.message || 'Giriş işlemi başarısız.');
    } finally {
      setLoading(false);
    }
  };

  // Profile Setup Submit (Name, University, Dept, Avatar)
  const handleProfileSetupSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const cleanName = formData.fullName?.trim() || formData.schoolEmail.split('@')[0];
      const cleanUni = formData.university?.trim() || 'Üniversite';
      const cleanDept = formData.departmentAndClass?.trim() || 'Öğrenci';

      updateUserProfile({
        fullName: cleanName,
        university: cleanUni,
        departmentAndClass: cleanDept,
        avatarEmoji: formData.avatarEmoji || '👨‍🎓',
      });

      if (formData.schoolEmail) {
        saveUserProfileToSupabase({
          ...formData,
          fullName: cleanName,
          university: cleanUni,
          departmentAndClass: cleanDept,
          isVerified: true,
        });
      }

      soundService.playCorrect();
      setSuccessMessage(language === 'tr' ? 'Profiliniz kaydedildi! Hoş geldiniz 🚀' : 'Profile saved! Welcome 🚀');
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 600);
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
      const targetEmail = step === 'otp_login' ? loginEmail : formData.schoolEmail;
      const res = await sendEmailOtp(targetEmail);
      if (res.simulatedCode) setSimulatedCode(res.simulatedCode);
      if (step === 'otp') {
        const randomEmoji = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];
        registerAccountAndSendOtp(
          {
            ...formData,
            avatarEmoji: randomEmoji,
          },
          res.simulatedCode
        );
      }
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
      <div className="relative w-full sm:max-w-md bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl animate-modal-enter p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Switcher: Giriş Yap | Kayıt Ol */}
        {step === 'form' && (
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 mb-5 max-w-xs mx-auto w-full">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMessage(null);
                setSuccessMessage(null);
                setShowOtpFallbackBtn(false);
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
                setShowOtpFallbackBtn(false);
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

        {/* Header Banner - Registration OTP */}
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

        {/* Header Banner - OTP Login */}
        {step === 'otp_login' && (
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/25 shadow-inner mb-2.5">
              <KeyRound className="w-6 h-6 stroke-[2] animate-bounce" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'tr' ? 'Giriş Kodunu Girin' : 'Enter Login Code'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              {language === 'tr'
                ? `${loginEmail} adresine gönderilen 8 haneli tek kullanımlık giriş kodunu giriniz.`
                : `Enter the 8-digit single-use login code sent to ${loginEmail}`}
            </p>
          </div>
        )}

        {/* Header Banner - Step 3: Profile Setup */}
        {step === 'profileSetup' && (
          <div className="text-center mb-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/25 shadow-inner mb-2">
              <Sparkles className="w-6 h-6 stroke-[2] text-[#ff7a00]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {language === 'tr' ? 'Hoş Geldin! 🎉 Profilini Oluştur' : 'Welcome! 🎉 Setup Profile'}
            </h2>
            <div className="mt-2 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleProfileSetupSubmit()}
                className="px-4 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#ff7a00] border border-orange-200 text-xs font-black transition-all cursor-pointer inline-flex items-center space-x-1 shadow-xs"
              >
                <span>{language === 'tr' ? 'Hemen Derse Başla ➔' : 'Start Learning Now ➔'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error / Success Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold space-y-2">
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
            {showOtpFallbackBtn && (
              <button
                type="button"
                onClick={() => handleStartOtpLogin(loginEmail)}
                className="w-full py-2 px-3 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black flex items-center justify-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{language === 'tr' ? 'E-postama Doğrulama Kodu Göndererek Giriş Yap ➔' : 'Sign in via Email Code ➔'}</span>
              </button>
            )}
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ─── TAB 1: GİRİŞ YAP (LOGIN FORM) ─── */}
        {step === 'form' && activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {/* Login Method Toggle (Şifre / Kod ile Giriş) */}
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-bold text-slate-700">
                {language === 'tr' ? 'Giriş Yöntemi' : 'Sign-In Method'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setLoginMode(loginMode === 'password' ? 'otp' : 'password');
                  setErrorMessage(null);
                  setShowOtpFallbackBtn(false);
                }}
                className="text-xs font-bold text-[#ff7a00] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>
                  {loginMode === 'password'
                    ? language === 'tr'
                      ? '🔑 E-posta Kodu ile Giriş'
                      : '🔑 Sign In with Code'
                    : language === 'tr'
                    ? '🔒 Şifre ile Giriş'
                    : '🔒 Sign In with Password'}
                </span>
              </button>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'E-posta' : 'Email'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={language === 'tr' ? 'E-postanız' : 'Your email'}
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password (Only in Password mode) */}
            {loginMode === 'password' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {language === 'tr' ? 'Şifre' : 'Password'} *
                  </label>
                  <button
                    type="button"
                    onClick={() => handleStartOtpLogin(loginEmail)}
                    className="text-[11px] font-bold text-[#ff7a00] hover:underline cursor-pointer"
                  >
                    {language === 'tr' ? 'Şifremi unuttum' : 'Forgot password?'}
                  </button>
                </div>
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
            )}

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
                  <span>
                    {loginMode === 'password'
                      ? language === 'tr'
                        ? 'Giriş Yap'
                        : 'Sign In'
                      : language === 'tr'
                      ? 'Giriş Kodu Gönder'
                      : 'Send Login Code'}
                  </span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── TAB 2: KAYIT OL (SADECE E-POSTA VE ŞİFRE) ─── */}
        {step === 'form' && activeTab === 'register' && (
          <form onSubmit={handleSendOtp} autoComplete="off" className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'E-posta Adresiniz' : 'Email Address'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={language === 'tr' ? 'E-postanız' : 'Your email'}
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Şifre Belirleyin' : 'Create Password'} *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showRegisterPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegisterPassword((prev) => !prev)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  tabIndex={-1}
                >
                  {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Helper notice */}
            <p className="text-[11px] text-slate-500 text-center pt-0.5 leading-relaxed">
              {language === 'tr'
                ? 'E-posta onayından sonra isminizi, okulunuzu ve profilinizi kolayca belirleyebilirsiniz.'
                : 'After email confirmation, you can customize your name, university, and profile.'}
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#ff7a00]/30 disabled:opacity-50 cursor-pointer active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'tr' ? 'Kayıt Ol ve Onay Kodu Al' : 'Sign Up & Get Code'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* ─── STEP 2: REGISTRATION OTP VERIFICATION FORM ─── */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            {/* 8 Distinct Slots (4 + 4 with separator) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 my-3">
              {otpDigits.map((digit, idx) => (
                <React.Fragment key={idx}>
                  {idx === 4 && (
                    <div className="w-1.5 sm:w-2.5 h-0.5 bg-slate-300 rounded-full mx-0.5 sm:mx-1" />
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
                    className={`w-8 h-11 sm:w-10 sm:h-13 rounded-xl border-2 text-center font-mono font-black text-lg sm:text-2xl transition-all shadow-2xs ${
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
                    <span>{language === 'tr' ? 'Kodu Doğrula ve Devam Et' : 'Verify Code & Continue'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                >
                  {language === 'tr' ? 'E-postayı Değiştir' : 'Change Email'}
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

              <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
                {language === 'tr'
                  ? '💡 Kodun gelmesi birkaç saniye sürebilir veya Spam/Gereksiz klasörüne düşmüş olabilir.'
                  : '💡 The code might take a few seconds or land in your Spam/Junk folder.'}
              </p>
            </div>
          </form>
        )}

        {/* ─── STEP 2 (ALT): LOGIN OTP VERIFICATION FORM ─── */}
        {step === 'otp_login' && (
          <form onSubmit={handleVerifyLoginOtp} className="space-y-4">
            {/* 8 Distinct Slots (4 + 4 with separator) */}
            <div className="flex items-center justify-center gap-1 sm:gap-2 my-3">
              {otpDigits.map((digit, idx) => (
                <React.Fragment key={idx}>
                  {idx === 4 && (
                    <div className="w-1.5 sm:w-2.5 h-0.5 bg-slate-300 rounded-full mx-0.5 sm:mx-1" />
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
                    className={`w-8 h-11 sm:w-10 sm:h-13 rounded-xl border-2 text-center font-mono font-black text-lg sm:text-2xl transition-all shadow-2xs ${
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
                    <LogIn className="w-4 h-4" />
                    <span>{language === 'tr' ? 'Doğrula ve Giriş Yap' : 'Verify & Sign In'}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs font-semibold text-slate-500 px-1 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-slate-600 hover:text-slate-900 underline underline-offset-2 cursor-pointer"
                >
                  {language === 'tr' ? 'E-postayı Değiştir' : 'Change Email'}
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

              <p className="text-[11px] text-slate-400 text-center font-medium pt-1">
                {language === 'tr'
                  ? '💡 Kodun gelmesi birkaç saniye sürebilir veya Spam/Gereksiz klasörüne düşmüş olabilir.'
                  : '💡 The code might take a few seconds or land in your Spam/Junk folder.'}
              </p>
            </div>
          </form>
        )}

        {/* ─── STEP 3: POST-VERIFICATION PROFILE SETUP ─── */}
        {step === 'profileSetup' && (
          <form onSubmit={handleProfileSetupSubmit} autoComplete="off" className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Ad Soyad' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'Adınızı ve soyadınızı giriniz' : 'Enter your full name'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* University */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Üniversite' : 'University'}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'örn. Koç Üniversitesi, İTÜ, ODTÜ' : 'e.g. University Name'}
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Department & Class */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Bölüm ve Sınıf' : 'Department & Year'}
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={language === 'tr' ? 'örn. Endüstri Müh. 2. Sınıf' : 'e.g. Industrial Eng. Sophomore'}
                  value={formData.departmentAndClass}
                  onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                {language === 'tr' ? 'Avatarını Seç' : 'Choose Avatar'}
              </label>
              <div className="flex flex-wrap gap-2">
                {RANDOM_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarEmoji: emoji })}
                    className={`w-9 h-9 text-lg rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      formData.avatarEmoji === emoji
                        ? 'bg-[#ff7a00]/15 border-2 border-[#ff7a00] scale-110 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#ff7a00]/30 cursor-pointer active:scale-95"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{language === 'tr' ? 'Kaydet ve Başla' : 'Save & Start'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleProfileSetupSubmit()}
                className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer flex items-center justify-center space-x-1"
              >
                <span>{language === 'tr' ? 'Daha Sonra / Derse Başla' : 'Skip & Start'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
