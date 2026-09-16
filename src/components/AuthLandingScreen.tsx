import React, { useState, useEffect, useRef } from 'react';
import { useAppStore, isValidStudentEmail } from '../store/useAppStore';
import { sendEmailOtp, verifyEmailOtp } from '../lib/supabase';
import {
  Zap,
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
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';

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
  const [forgotSuccessMsg, setForgotSuccessMsg] = useState<string | null>(null);

  // Logo Spin Animation State (Every 3 Seconds)
  const [isLogoSpinning, setIsLogoSpinning] = useState(false);

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

    // 1. Validate student email domain
    if (!isValidStudentEmail(cleanEmail)) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir üniversite öğrenci e-posta adresi giriniz (ör: ad.soyad@universite.edu.tr).'
          : 'Please enter a valid student university email (e.g., name@university.edu).'
      );
      return;
    }

    // 2. Validate password match
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

    // Admin bypass: instant verification without OTP
    if (
      cleanEmail === 'resultankilic.business@gmail.com' ||
      cleanEmail.startsWith('rtankilic.business') ||
      cleanEmail.startsWith('admin@') ||
      cleanEmail === 'admin@tancorelab.com'
    ) {
      registerAccountAndSendOtp(
        {
          schoolEmail: cleanEmail,
          fullName: fullName.trim() || 'Resul Tan Kılıç (Admin)',
          university: university.trim() || 'Koç Üniversitesi',
          departmentAndClass: departmentAndClass.trim() || 'Kurucu & Yönetici',
          password: password || 'admin123',
          avatarEmoji: '👑',
        },
        '123456'
      );
      verifyOtpAndActivateAccount('123456', true);
      onSuccess?.();
      return;
    }

    setIsSubmitting(true);
    setOtpDigits(['', '', '', '', '', '', '', '']);

    try {
      // Trigger Supabase email OTP
      const res = await sendEmailOtp(cleanEmail);

      registerAccountAndSendOtp(
        {
          schoolEmail: cleanEmail,
          fullName: fullName.trim(),
          university: university.trim(),
          departmentAndClass: departmentAndClass.trim(),
          password: password,
          avatarEmoji: '👨‍🎓',
        },
        res.simulatedCode
      );

      if (res.simulatedCode) {
        setSimulatedCode(res.simulatedCode);
      } else {
        setSimulatedCode(null);
      }

      setStep('otp');
      setResendTimer(60);
    } catch (err: any) {
      setErrorMessage(err.message || (language === 'tr' ? 'Onay kodu gönderilemedi. Lütfen tekrar deneyiniz.' : 'Could not send verification code.'));
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
      if (res.simulatedCode) setSimulatedCode(res.simulatedCode);
      setResendTimer(60);
      setOtpSentMsg(language === 'tr' ? 'Yeni doğrulama kodu e-postanıza gönderildi!' : 'New verification code sent to your email!');
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
          ? 'Lütfen 8 haneli onay kodunuzu kutucuklara eksiksiz giriniz.'
          : 'Please enter your complete verification code.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Check local/simulated code first
      const localRes = verifyOtpAndActivateAccount(token);
      if (localRes.success) {
        onSuccess?.();
        return;
      }

      // 2. Check remote Supabase verification
      const remoteRes = await verifyEmailOtp(cleanEmail, token, simulatedCode || undefined);
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

  // Handle Sign In Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowForgotPassword(false);

    const cleanEmail = schoolEmail.trim().toLowerCase();

    // Admin bypass: instant login without password
    if (
      cleanEmail === 'resultankilic.business@gmail.com' ||
      cleanEmail.startsWith('rtankilic.business') ||
      cleanEmail.startsWith('admin@') ||
      cleanEmail === 'admin@tancorelab.com'
    ) {
      registerAccountAndSendOtp(
        {
          schoolEmail: cleanEmail,
          fullName: 'Resul Tan Kılıç (Admin)',
          university: 'Koç Üniversitesi',
          departmentAndClass: 'Kurucu & Yönetici',
          password: password || 'admin123',
          avatarEmoji: '👑',
        },
        '123456'
      );
      verifyOtpAndActivateAccount('123456', true);
      onSuccess?.();
      return;
    }

    const res = loginWithPassword(schoolEmail, password);

    if (res.success) {
      onSuccess?.();
    } else {
      setErrorMessage(res.message || 'Giriş yapılamadı.');
      if (res.errorType === 'WRONG_PASSWORD') {
        setShowForgotPassword(true);
      }
    }
  };

  // Handle Password Reset Submission
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = resetPasswordWithOtp(forgotEmail, forgotOtp, newPassword);
    if (res.success) {
      setForgotSuccessMsg(res.message || 'Şifreniz sıfırlandı.');
      setTimeout(() => {
        setStep('form');
        setActiveTab('login');
        setSchoolEmail(forgotEmail);
        setPassword(newPassword);
        setForgotSuccessMsg(null);
      }, 1500);
    } else {
      setErrorMessage(res.message || 'Şifre sıfırlanamadı.');
    }
  };

  return (
    <div className="min-h-screen w-full bg-white font-sans flex flex-col overflow-x-hidden animate-fade-in">
      
      {/* TOP LAYER: Complete Orange Section (Üst Kısım Komple Turuncu) */}
      <div className="w-full bg-gradient-to-br from-[#ff7a00] via-orange-600 to-amber-600 px-6 py-12 sm:px-12 sm:py-16 text-white relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center justify-center text-center space-y-4">
          {/* Huge Circular Logo with Static Shadow & Rotating Inner Icon */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white text-[#ff7a00] shadow-2xl shrink-0 p-3 flex items-center justify-center">
            <div
              className={`w-full h-full rounded-full flex items-center justify-center ${
                isLogoSpinning ? 'animate-logo-spin' : ''
              }`}
            >
              <Zap className="w-10 h-10 sm:w-12 sm:h-12 fill-[#ff7a00] stroke-[2]" />
            </div>
          </div>

          {/* TanCoreLab Brand Title */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-sans">
            TanCoreLab
          </h1>
        </div>
      </div>

      {/* BOTTOM LAYER: Complete White Section (Alt Kısım Komple Beyaz) */}
      <div className="w-full bg-white px-6 py-8 sm:px-12 sm:py-12 flex-1 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-md">
          
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
            /* Step 3: Forgot Password Screen */
            <div className="space-y-4 animate-fade-in">
              <div className="text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#ff7a00] font-mono">
                  {language === 'tr' ? 'ŞİFRE SIFIRLAMA' : 'RESET PASSWORD'}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  {language === 'tr' ? 'Şifremi Unuttum' : 'Forgot Password'}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1">
                  Kayıtlı okul e-posta adresinizi ve onay kodunu (123456) girerek şifrenizi yenileyin.
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

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Okul E-postası</label>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => {
                      setForgotEmail(e.target.value);
                      handleInputChange();
                    }}
                    placeholder={language === 'tr' ? 'E-posta adresiniz' : 'Email address'}
                    autoComplete="off"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'tr' ? 'Onay Kodu' : 'Verification Code'}
                  </label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => {
                      setForgotOtp(e.target.value);
                      handleInputChange();
                    }}
                    placeholder={language === 'tr' ? '6 haneli kod' : '6-digit code'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Yeni Şifre</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      handleInputChange();
                    }}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Şifreyi Güncelle
                </button>
              </form>

              <button
                onClick={() => setStep('form')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-[#ff7a00] cursor-pointer pt-1"
              >
                ← Giriş Ekranına Dön
              </button>
            </div>
          ) : (
            /* Step 1: Login / Register Tab Form */
            <div className="space-y-4 animate-fade-in">
              {/* Tab Switcher: Kayıt Ol vs Giriş Yap */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200/80 mb-2">
                <button
                  onClick={() => {
                    setActiveTab('login');
                    setErrorMessage(null);
                    setShowForgotPassword(false);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'login'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {language === 'tr' ? 'Giriş Yap' : 'Sign In'}
                </button>
                <button
                  onClick={() => {
                    setActiveTab('register');
                    setErrorMessage(null);
                    setShowForgotPassword(false);
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    activeTab === 'register'
                      ? 'bg-[#ff7a00] text-white shadow-xs'
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
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          handleInputChange();
                        }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">
                        {language === 'tr' ? 'Şifre Onayı' : 'Confirm Password'}
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          handleInputChange();
                        }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
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
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          handleInputChange();
                        }}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>{language === 'tr' ? 'Uygulamaya Giriş Yap' : 'Sign In to App'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-[11px] sm:text-xs text-slate-400 font-medium">
          {language === 'tr'
            ? 'Sadece geçerli üniversite e-posta adresleri kabul edilir.'
            : 'Only valid university email addresses are accepted.'}
        </div>
      </div>
    </div>
  );
};
