import React, { useState, useEffect, useRef } from 'react';
import { useAppStore, isValidStudentEmail } from '../store/useAppStore';
import {
  sendEmailOtp,
  verifyEmailOtp,
  signUpWithSupabase,
  requestPasswordReset,
  verifyPasswordResetToken,
  completePasswordReset,
} from '../lib/supabase';
import { LegalTermsModal } from './LegalTermsModal';
import {
  Mail,
  Lock,
  User,
  Building2,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ShieldCheck,
  Loader2,
  RefreshCw,
  Trophy,
  Activity,
  Eye,
  EyeOff,
} from 'lucide-react';

const RANDOM_AVATARS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '🚀', '⚡', '📊', '🧠', '🦉', '🎯'];

const HIGHLIGHT_ITEMS = [
  {
    icon: Activity,
    badgeTr: '🔬 12 İnteraktif Laboratuvar',
    badgeEn: '🔬 12 Interactive Labs',
    titleTr: 'İnteraktif İstatistik Simülasyonları',
    titleEn: 'Interactive Statistics Labs',
    descTr: 'Monte Carlo, Bayes Teoremi, Normal Dağılım ve Hipotez Testlerini anlık parametre değiştirerek görsel keşfet.',
    descEn: 'Experiment with Monte Carlo, Bayes Rule, Normal Distribution, and Hypothesis Testing with real-time sliders.',
  },
  {
    icon: GraduationCap,
    badgeTr: '🎓 Canlı Üniversite Sıralaması',
    badgeEn: '🎓 Live University League',
    titleTr: '40+ Üniversiteden Mühendis ve Analistler',
    titleEn: 'Students from 40+ Top Universities',
    descTr: 'Koç, İTÜ, ODTÜ, Boğaziçi ve Türkiye\'nin dört bir yanından öğrenciler TancoreLab liginde yarışıyor.',
    descEn: 'Engineers and data analysts from premier universities compete, learn, and climb the live XP leaderboard.',
  },
  {
    icon: Building2,
    badgeTr: '🏢 İş Dünyası Vaka Analizleri',
    badgeEn: '🏢 Real-World Case Studies',
    titleTr: 'Netflix, Spotify & Amazon Veri Senaryoları',
    titleEn: 'Netflix, Spotify & Amazon Case Scenarios',
    descTr: 'Sadece teoriyi değil; global şirketlerin A/B testlerini, algoritmalarını ve iş kararlarını veriyle çözmeyi deneyimle.',
    descEn: 'Beyond theory: solve real-world A/B test dilemmas, recommendation logic, and data-driven corporate decisions.',
  },
  {
    icon: Trophy,
    badgeTr: '🏆 XP & Seviye Sistemi',
    badgeEn: '🏆 XP & Level System',
    titleTr: 'Öğrenirken Rozet ve Seviye Kazan',
    titleEn: 'Earn Badges & Level Up As You Learn',
    descTr: 'Tamamladığın her ders ve vaka analiziyle XP topla, ligde yüksel ve Doğrulanmış Öğrenci rozetine sahip ol.',
    descEn: 'Gain XP with every lesson and case study you finish, climb leagues, and unlock verified student credentials.',
  },
];

interface AuthLandingScreenProps {
  onSuccess?: () => void;
}

export const AuthLandingScreen: React.FC<AuthLandingScreenProps> = ({ onSuccess }) => {
  const {
    language,
    registerAccountAndSendOtp,
    verifyOtpAndActivateAccount,
    loginWithPassword,
    resetPasswordWithOtp,
    userAccounts,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'form' | 'otp' | 'forgot_password'>('form');

  // Form State
  const [schoolEmail, setSchoolEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [university, setUniversity] = useState('');
  const [departmentAndClass, setDepartmentAndClass] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 8-Digit OTP Verification State
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '', '', '']);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [otpSentMsg, setOtpSentMsg] = useState<string | null>(null);

  // Error & Status State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);
  const [forgotStep, setForgotStep] = useState<'request' | 'verify'>('request');

  // Legal Modal (KVKK & Terms) State
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalTab, setLegalTab] = useState<'kvkk' | 'terms' | 'privacy'>('kvkk');

  // Logo Spin Animation State (Every 3 Seconds)
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);

  // Dynamic rotating highlight card (random on initial load, then auto-cycles every 6s)
  const [highlightIndex, setHighlightIndex] = useState(() => Math.floor(Math.random() * HIGHLIGHT_ITEMS.length));

  useEffect(() => {
    const timer = setInterval(() => {
      setHighlightIndex((prev) => (prev + 1) % HIGHLIGHT_ITEMS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsLogoSpinning(true);
      const timer = setTimeout(() => {
        setIsLogoSpinning(false);
      }, 1300);
      return () => clearTimeout(timer);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for resending OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'otp' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  // Auto-focus first OTP input when opening OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 150);
    }
  }, [step]);

  // Quick helper to clear errors on input change
  const handleInputChange = () => {
    if (errorMessage) setErrorMessage(null);
    if (otpSentMsg) setOtpSentMsg(null);
  };

  // 8-Digit OTP Input Handlers
  const handleDigitChange = (index: number, val: string) => {
    const cleaned = val.replace(/\D/g, '');
    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      handleInputChange();
      return;
    }

    if (cleaned.length > 1) {
      // Pasted multiple digits into a box
      const chars = cleaned.slice(0, 8).split('');
      const updated = [...otpDigits];
      chars.forEach((c, i) => {
        if (i < 8) updated[i] = c;
      });
      setOtpDigits(updated);
      handleInputChange();
      const nextFocus = Math.min(chars.length, 7);
      otpInputRefs.current[nextFocus]?.focus();
      return;
    }

    const updated = [...otpDigits];
    updated[index] = cleaned;
    setOtpDigits(updated);
    handleInputChange();

    // Auto-focus next box
    if (index < 7) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const updated = [...otpDigits];
        updated[index - 1] = '';
        setOtpDigits(updated);
        otpInputRefs.current[index - 1]?.focus();
      } else {
        const updated = [...otpDigits];
        updated[index] = '';
        setOtpDigits(updated);
      }
      handleInputChange();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 7) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleDigitPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 8);
    if (!pasteData) return;
    const chars = pasteData.split('');
    const updated = ['', '', '', '', '', '', '', ''];
    chars.forEach((c, i) => {
      if (i < 8) updated[i] = c;
    });
    setOtpDigits(updated);
    handleInputChange();
    const nextFocus = Math.min(chars.length, 7);
    otpInputRefs.current[nextFocus]?.focus();
  };

  // Handle Sign Up Submission
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setOtpSentMsg(null);

    const cleanEmail = schoolEmail.trim().toLowerCase();

    // 1. Validate full name (mandatory)
    if (!fullName.trim()) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen adınızı ve soyadınızı giriniz.'
          : 'Please enter your full name.'
      );
      return;
    }

    // 2. Validate student email domain
    if (!isValidStudentEmail(cleanEmail)) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir üniversite öğrenci e-posta adresi giriniz (ör: ad.soyad@universite.edu.tr).'
          : 'Please enter a valid student university email (e.g., name@university.edu).'
      );
      return;
    }

    // 3. Validate password match
    if (password !== confirmPassword) {
      setErrorMessage(
        language === 'tr'
          ? 'Girdiğiniz şifreler birbiriyle eşleşmiyor. Lütfen kontrol edip tekrar giriniz.'
          : 'Passwords do not match. Please re-check.'
      );
      return;
    }

    if (password.length < 4) {
      setErrorMessage(
        language === 'tr' ? 'Şifreniz en az 4 karakter olmalıdır.' : 'Password must be at least 4 characters.'
      );
      return;
    }

    setIsSubmitting(true);
    setOtpDigits(['', '', '', '', '', '', '', '']);

    try {
      // 1. Sign up user via Supabase Auth (bcrypt hashed, secure)
      const res = await signUpWithSupabase(cleanEmail, password, {
        fullName: fullName.trim(),
        university: university.trim(),
        departmentAndClass: departmentAndClass.trim(),
      });

      if (!res.success) {
        setErrorMessage(res.error || (language === 'tr' ? 'Kayıt işlemi gerçekleştirilemedi.' : 'Registration failed.'));
        return;
      }

      const randomEmoji = RANDOM_AVATARS[Math.floor(Math.random() * RANDOM_AVATARS.length)];

      registerAccountAndSendOtp({
        schoolEmail: cleanEmail,
        fullName: fullName.trim(),
        university: university.trim(),
        departmentAndClass: departmentAndClass.trim(),
        avatarEmoji: randomEmoji,
      });

      // If Supabase requires email verification (sends OTP)
      if (res.needsEmailVerification) {
        setStep('otp');
        setResendTimer(60);
      } else {
        // Automatically confirmed
        verifyOtpAndActivateAccount('', true);
        onSuccess?.();
      }
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Kayıt işlemi gerçekleştirilemedi.' : 'Registration failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Resending OTP
  const handleResendOtp = async () => {
    if (resendTimer > 0 || isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);
    setOtpSentMsg(null);
    setOtpDigits(['', '', '', '', '', '', '', '']);

    try {
      const res = await sendEmailOtp(schoolEmail.trim().toLowerCase());
      if (res.success) {
        setResendTimer(60);
        setOtpSentMsg(language === 'tr' ? 'Yeni doğrulama kodu e-postanıza gönderildi!' : 'New verification code sent to your email!');
      } else {
        setErrorMessage(res.error || (language === 'tr' ? 'Kod tekrar gönderilemedi.' : 'Could not resend code.'));
      }
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Kod tekrar gönderilemedi.' : 'Could not resend code.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP Verification Submission
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = schoolEmail.trim().toLowerCase();
    const token = otpDigits.join('').trim();

    if (token.length < 6) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen e-postanıza gelen doğrulama kodunu eksiksiz giriniz.'
          : 'Please enter your complete verification code.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Remote Supabase verification
      const remoteRes = await verifyEmailOtp(cleanEmail, token);
      if (remoteRes.success) {
        verifyOtpAndActivateAccount(token, true);
        onSuccess?.();
      } else {
        setErrorMessage(
          remoteRes.error ||
            (language === 'tr' ? 'Girdiğiniz doğrulama kodu hatalı veya süresi dolmuş.' : 'Invalid or expired code.')
        );
      }
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Doğrulama başarısız oldu.' : 'Verification failed.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Sign In Submission (Real bcrypt authentication)
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowForgotPassword(false);

    setIsSubmitting(true);
    try {
      const res = await loginWithPassword(schoolEmail, password);

      if (res.success) {
        onSuccess?.();
      } else {
        setErrorMessage(res.message || 'Giriş yapılamadı.');
        if (res.errorType === 'WRONG_PASSWORD') {
          setShowForgotPassword(true);
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Giriş yapılırken bir hata oluştu.' : 'An error occurred during login.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Password Reset: Phase 1 - Request Code via Email
  const handleRequestResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotSuccessMsg(null);

    const cleanEmail = forgotEmail.trim().toLowerCase();
    if (!cleanEmail) {
      setErrorMessage(language === 'tr' ? 'Lütfen kayıtlı e-posta adresinizi giriniz.' : 'Please enter your email.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await requestPasswordReset(cleanEmail);
      if (res.success) {
        setForgotStep('verify');
        setForgotSuccessMsg(
          language === 'tr'
            ? 'Şifre sıfırlama kodu e-postanıza gönderildi! Lütfen kodu ve yeni şifrenizi giriniz.'
            : 'Reset code sent to your email! Please enter the code and new password.'
        );
      } else {
        setErrorMessage(res.error || (language === 'tr' ? 'Şifre sıfırlama kodu gönderilemedi.' : 'Could not send reset code.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Real Password Reset: Phase 2 - Verify Code & Update Password
  const handleCompleteReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (newPassword.length < 4) {
      setErrorMessage(language === 'tr' ? 'Yeni şifreniz en az 4 karakter olmalıdır.' : 'Password must be at least 4 characters.');
      return;
    }

    setIsSubmitting(true);
    try {
      const verifyRes = await verifyPasswordResetToken(forgotEmail.trim().toLowerCase(), forgotOtp.trim());
      if (!verifyRes.success) {
        setErrorMessage(verifyRes.error || (language === 'tr' ? 'Geçersiz veya süresi dolmuş kod.' : 'Invalid code.'));
        return;
      }

      const updateRes = await completePasswordReset(newPassword);
      if (updateRes.success) {
        setForgotSuccessMsg(
          language === 'tr'
            ? 'Şifreniz başarıyla güncellendi! Yeni şifrenizle giriş yapabilirsiniz.'
            : 'Password updated successfully! You can now sign in.'
        );
        setTimeout(() => {
          setStep('form');
          setActiveTab('login');
          setSchoolEmail(forgotEmail);
          setPassword(newPassword);
          setForgotSuccessMsg(null);
          setForgotStep('request');
        }, 1500);
      } else {
        setErrorMessage(updateRes.error || (language === 'tr' ? 'Şifre güncellenemedi.' : 'Could not update password.'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#ff8800] via-[#ff6f00] to-[#f25900] font-sans flex flex-col items-center justify-start px-4 pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-x-hidden relative animate-fade-in">
      
      {/* Decorative ambient glowing lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-64 h-64 bg-amber-300/20 rounded-full blur-3xl pointer-events-none" />

      {/* TOP: Brand Logo & Title */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-3.5 pt-2 pb-5 sm:pt-4 sm:pb-7">
        {/* Huge Circular Logo with Static Shadow & Rotating Inner Icon */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#ff7a00] shadow-[0_12px_30px_rgba(0,0,0,0.18)] shrink-0 p-3.5 flex items-center justify-center">
          <div
            className={`w-full h-full rounded-full flex items-center justify-center ${
              isLogoSpinning ? 'animate-logo-spin' : ''
            }`}
          >
            <GraduationCap className="w-10 h-10 sm:w-11 sm:h-11 text-[#ff7a00] stroke-[2]" />
          </div>
        </div>

        {/* TancoreLab Brand Title */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans drop-shadow-xs">
          TancoreLab
        </h1>
      </div>

      {/* FLOATING WHITE CARD: Hem üstü hem altı kavisli, boyutu ihtiyaca göre otomatik esneyen panel */}
      <div className="w-full max-w-md bg-white rounded-[32px] sm:rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.18)] p-6 sm:p-8 relative z-10">
          
          {step === 'otp' ? (
            /* Step 2: OTP Verification Screen */
            <div className="space-y-4 animate-fade-in">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
                  {language === 'tr' ? 'E-POSTA DOĞRULAMA' : 'EMAIL VERIFICATION'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {language === 'tr' ? 'Doğrulama Kodu' : 'Verification Code'}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  <strong className="text-slate-900">{schoolEmail}</strong> adresinize gönderilen onay kodunu giriniz.
                </p>
              </div>

              {otpSentMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{otpSentMsg}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 block">
                      {language === 'tr' ? '8 Haneli Doğrulama Kodu' : '8-Digit Verification Code'}
                    </label>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      {otpDigits.filter(Boolean).length} / 8
                    </span>
                  </div>

                  {/* 8 Distinct Slots (4 + 4 with separator) */}
                  <div className="flex items-center justify-center gap-1 sm:gap-2">
                    {otpDigits.map((digit, i) => (
                      <React.Fragment key={i}>
                        {i === 4 && (
                          <div className="w-1.5 sm:w-2 h-0.5 bg-slate-300 rounded-full mx-0.5" />
                        )}
                        <input
                          ref={(el) => (otpInputRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleDigitChange(i, e.target.value)}
                          onKeyDown={(e) => handleDigitKeyDown(i, e)}
                          onPaste={handleDigitPaste}
                          className={`w-8 h-12 sm:w-10 sm:h-14 text-center font-mono text-xl sm:text-2xl font-black rounded-xl border transition-all ${
                            digit
                              ? 'bg-orange-50/70 border-[#ff7a00] text-[#ff7a00] shadow-xs'
                              : 'bg-slate-50 border-slate-300 text-slate-900 focus:bg-white focus:border-[#ff7a00] focus:ring-2 focus:ring-orange-200'
                          } focus:outline-none`}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-sm font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/30 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{language === 'tr' ? 'Doğrulanıyor...' : 'Verifying...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'tr' ? 'Kodu Onayla ve Başla' : 'Verify & Start'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Yeni Kod İste (Request New Code) Dedicated Section */}
              <div className="pt-2 flex flex-col items-center space-y-3">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendTimer > 0 || isSubmitting}
                  className={`w-full py-3 rounded-2xl border text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    resendTimer > 0 || isSubmitting
                      ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                      : 'bg-white hover:bg-orange-50/80 text-[#ff7a00] border-orange-200 shadow-xs'
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSubmitting ? 'animate-spin' : ''}`} />
                  <span>
                    {resendTimer > 0
                      ? language === 'tr'
                        ? `Yeni Kod İste (${resendTimer} sn bekleyin)`
                        : `Request New Code (Wait ${resendTimer}s)`
                      : language === 'tr'
                      ? '📩 Yeni Kod İste'
                      : '📩 Request New Code'}
                  </span>
                </button>

                <button
                  onClick={() => setStep('form')}
                  className="text-center text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer pt-1 transition-colors"
                >
                  {language === 'tr' ? '← Form Bilgilerine Geri Dön' : '← Back to Form'}
                </button>
              </div>
            </div>
          ) : step === 'forgot_password' ? (
            /* Step 3: Real Supabase Forgot Password Screen */
            <div className="space-y-4 animate-fade-in">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
                  {language === 'tr' ? 'GÜVENLİ ŞİFRE SIFIRLAMA' : 'SECURE PASSWORD RESET'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {language === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password'}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  {forgotStep === 'request'
                    ? (language === 'tr'
                        ? 'Kayıtlı üniversite e-posta adresinizi giriniz. Size tek kullanımlık sıfırlama kodu göndereceğiz.'
                        : 'Enter your registered email. We will send a one-time reset code.')
                    : (language === 'tr'
                        ? 'E-postanıza gönderilen onay kodunu ve belirlemek istediğiniz yeni şifreyi giriniz.'
                        : 'Enter the code sent to your email and your new password.')}
                </p>
              </div>

              {forgotSuccessMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{forgotSuccessMsg}</span>
                </div>
              )}

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {forgotStep === 'request' ? (
                <form onSubmit={handleRequestResetCode} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'tr' ? 'Okul E-postası' : 'School Email'}
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => {
                        setForgotEmail(e.target.value);
                        handleInputChange();
                      }}
                      placeholder={language === 'tr' ? 'ad.soyad@universite.edu.tr' : 'your.email@university.edu'}
                      autoComplete="off"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'tr' ? 'Kod Gönderiliyor...' : 'Sending Code...'}</span>
                      </>
                    ) : (
                      <span>{language === 'tr' ? 'Doğrulama Kodu Gönder' : 'Send Reset Code'}</span>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCompleteReset} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'tr' ? 'E-postadaki Onay Kodu' : 'Verification Code'}
                    </label>
                    <input
                      type="text"
                      value={forgotOtp}
                      onChange={(e) => {
                        setForgotOtp(e.target.value);
                        handleInputChange();
                      }}
                      placeholder={language === 'tr' ? 'E-postanıza gelen kod' : 'Code from email'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'tr' ? 'Yeni Şifre' : 'New Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          handleInputChange();
                        }}
                        placeholder="••••••••"
                        className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                        aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'tr' ? 'Güncelleniyor...' : 'Updating...'}</span>
                      </>
                    ) : (
                      <span>{language === 'tr' ? 'Şifreyi Güncelle ve Giriş Yap' : 'Save New Password'}</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setForgotStep('request')}
                    className="w-full text-center text-xs font-bold text-slate-500 hover:text-slate-800 cursor-pointer pt-1"
                  >
                    {language === 'tr' ? '← Farklı e-posta veya tekrar kod iste' : '← Try different email'}
                  </button>
                </form>
              )}

              <button
                onClick={() => {
                  setStep('form');
                  setForgotStep('request');
                  setErrorMessage(null);
                }}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-[#ff7a00] cursor-pointer pt-1"
              >
                ← {language === 'tr' ? 'Giriş Ekranına Dön' : 'Back to Sign In'}
              </button>
            </div>
          ) : (
            /* Step 1: Login / Register Tab Form */
            <div className="space-y-4 animate-fade-in">
              {/* Tab Switcher: Kayıt Ol vs Giriş Yap */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                    setShowForgotPassword(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-[#ff7a00] text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                    setShowForgotPassword(false);
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-[#ff7a00] text-white shadow-sm shadow-orange-500/20'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {language === 'tr' ? 'Kayıt Ol' : 'Sign Up'}
                </button>
              </div>

              {/* Error Message Display Banner */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold space-y-1.5 animate-shake">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{errorMessage}</span>
                  </div>

                  {showForgotPassword && (
                    <div className="pt-1.5 border-t border-rose-200/80 flex justify-end">
                      <button
                        onClick={() => {
                          setStep('forgot_password');
                          setForgotEmail(schoolEmail);
                          setErrorMessage(null);
                        }}
                        className="text-[11px] font-black text-[#ff7a00] underline hover:text-[#e66e00] cursor-pointer"
                      >
                        {language === 'tr' ? 'Şifremi Unuttum?' : 'Forgot Password?'}
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 1: KAYIT OL (Sign Up) */}
              {activeTab === 'register' ? (
                <form onSubmit={handleRegisterSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'tr' ? 'Okul E-postası' : 'School Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        value={schoolEmail}
                        onChange={(e) => {
                          setSchoolEmail(e.target.value);
                          handleInputChange();
                        }}
                        placeholder={language === 'tr' ? 'E-posta adresiniz' : 'Your email'}
                        autoComplete="off"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'tr' ? 'İsim Soyisim' : 'Full Name'}
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => {
                          setFullName(e.target.value);
                          handleInputChange();
                        }}
                        placeholder={language === 'tr' ? 'Adınız ve Soyadınız' : 'Your Full Name'}
                        autoComplete="off"
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {language === 'tr' ? 'Üniversite İsmi' : 'University'}
                      </label>
                      <input
                        type="text"
                        value={university}
                        onChange={(e) => {
                          setUniversity(e.target.value);
                          handleInputChange();
                        }}
                        placeholder={language === 'tr' ? 'Üniversiteniz' : 'Your University'}
                        autoComplete="off"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {language === 'tr' ? 'Bölüm ve Sınıf' : 'Dept & Class'}
                      </label>
                      <input
                        type="text"
                        value={departmentAndClass}
                        onChange={(e) => {
                          setDepartmentAndClass(e.target.value);
                          handleInputChange();
                        }}
                        placeholder={language === 'tr' ? 'Bölüm ve sınıfınız' : 'Department & Class'}
                        autoComplete="off"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {language === 'tr' ? 'Şifre' : 'Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            handleInputChange();
                          }}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          tabIndex={-1}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {language === 'tr' ? 'Şifre Onayı' : 'Confirm Password'}
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            handleInputChange();
                          }}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          className="w-full pl-3 pr-8 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          tabIndex={-1}
                          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 mt-2 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'tr' ? 'Onay Kodu Gönderiliyor...' : 'Sending Code...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'tr' ? 'Kayıt Ol ve Onay Kodunu Al' : 'Sign Up & Get Code'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center mt-2.5 leading-snug">
                    {language === 'tr' ? (
                      <>
                        Kayıt olarak{' '}
                        <button
                          type="button"
                          onClick={() => { setLegalTab('terms'); setShowLegalModal(true); }}
                          className="font-bold text-[#ff7a00] hover:underline cursor-pointer"
                        >
                          Kullanım Koşulları
                        </button>
                        {' '}ve{' '}
                        <button
                          type="button"
                          onClick={() => { setLegalTab('kvkk'); setShowLegalModal(true); }}
                          className="font-bold text-[#ff7a00] hover:underline cursor-pointer"
                        >
                          KVKK Aydınlatma Metni
                        </button>
                        'ni kabul etmiş olursunuz.
                      </>
                    ) : (
                      <>
                        By registering, you accept our{' '}
                        <button
                          type="button"
                          onClick={() => { setLegalTab('terms'); setShowLegalModal(true); }}
                          className="font-bold text-[#ff7a00] hover:underline cursor-pointer"
                        >
                          Terms of Service
                        </button>
                        {' '}and{' '}
                        <button
                          type="button"
                          onClick={() => { setLegalTab('privacy'); setShowLegalModal(true); }}
                          className="font-bold text-[#ff7a00] hover:underline cursor-pointer"
                        >
                          Privacy Policy
                        </button>.
                      </>
                    )}
                  </p>
                </form>
              ) : (
                /* TAB 2: GİRİŞ YAP (Sign In) */
                <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      {language === 'tr' ? 'Okul E-postası' : 'School Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="email"
                        value={schoolEmail}
                        onChange={(e) => {
                          setSchoolEmail(e.target.value);
                          handleInputChange();
                        }}
                        placeholder={language === 'tr' ? 'E-posta adresiniz' : 'Your email'}
                        autoComplete="off"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 block">
                        {language === 'tr' ? 'Şifre' : 'Password'}
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setStep('forgot_password');
                          setForgotEmail(schoolEmail);
                          setErrorMessage(null);
                        }}
                        className="text-[11px] font-bold text-[#ff7a00] hover:underline cursor-pointer"
                      >
                        {language === 'tr' ? 'Şifremi Unuttum?' : 'Forgot Password?'}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          handleInputChange();
                        }}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                        tabIndex={-1}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 mt-2 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 cursor-pointer flex items-center justify-center space-x-2 disabled:opacity-75 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'tr' ? 'Giriş Yapılıyor...' : 'Signing In...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{language === 'tr' ? 'Uygulamaya Giriş Yap' : 'Sign In to App'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-6 text-center text-[11px] sm:text-xs text-slate-400 font-medium">
            {language === 'tr'
              ? 'Sadece geçerli üniversite e-posta adresleri kabul edilir.'
              : 'Only valid university email addresses are accepted.'}
          </div>
        </div>

        {/* DYNAMIC HIGHLIGHT & COMMUNITY SHOWCASE (Her girişte rastgele değişen ve otomatik dönen vitrin) */}
        {(() => {
          const item = HIGHLIGHT_ITEMS[highlightIndex] || HIGHLIGHT_ITEMS[0];
          const IconComp = item.icon;
          return (
            <div className="w-full max-w-md mt-4 sm:mt-5 transition-all duration-500 animate-fade-in relative z-10">
              <div className="bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-4 sm:p-4.5 shadow-lg shadow-black/5 text-white">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white shrink-0 shadow-xs">
                      <IconComp className="w-5 h-5 stroke-[2.2]" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-black/15 text-orange-100 px-2.5 py-1 rounded-full">
                      {language === 'tr' ? item.badgeTr : item.badgeEn}
                    </span>
                  </div>

                  {/* Dots Navigation */}
                  <div className="flex items-center space-x-1.5 pt-1.5">
                    {HIGHLIGHT_ITEMS.map((_, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setHighlightIndex(idx)}
                        aria-label={`Slide ${idx + 1}`}
                        className={`h-1.5 rounded-full transition-all cursor-pointer ${
                          idx === highlightIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="mt-2.5">
                  <h4 className="text-xs sm:text-sm font-black text-white tracking-tight">
                    {language === 'tr' ? item.titleTr : item.titleEn}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-orange-50/90 font-medium leading-relaxed mt-1">
                    {language === 'tr' ? item.descTr : item.descEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Legal Terms Modal (KVKK, Terms of Service, Privacy Policy) */}
        <LegalTermsModal
          isOpen={showLegalModal}
          onClose={() => setShowLegalModal(false)}
          defaultTab={legalTab}
        />
      </div>
  );
};
