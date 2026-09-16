import React, { useState, useEffect } from 'react';
import { useAppStore, isValidStudentEmail } from '../store/useAppStore';
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
  const [university, setUniversity] = useState('Koç Üniversitesi');
  const [departmentAndClass, setDepartmentAndClass] = useState('Endüstri Mühendisliği - 3. Sınıf');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP Verification State
  const [otpCode, setOtpCode] = useState('');
  const [simulatedCode, setSimulatedCode] = useState('123456');

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

  // Quick helper to clear errors on input change
  const handleInputChange = () => {
    if (errorMessage) setErrorMessage(null);
  };

  // Handle Sign Up Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = schoolEmail.trim().toLowerCase();

    // 1. Validate student email domain
    if (!isValidStudentEmail(cleanEmail)) {
      setErrorMessage(
        language === 'tr'
          ? 'Lütfen geçerli bir üniversite öğrenci e-posta adresi giriniz (ör: ad.soyad@ku.edu.tr).'
          : 'Please enter a valid student university email (e.g., name@ku.edu.tr).'
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

    // Generate random 6-digit verification code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setSimulatedCode(generatedCode);

    // Save account & set pending OTP
    registerAccountAndSendOtp(
      {
        schoolEmail: cleanEmail,
        fullName: fullName.trim(),
        university: university.trim(),
        departmentAndClass: departmentAndClass.trim(),
        password: password,
        avatarEmoji: '👨‍🎓',
      },
      generatedCode
    );

    setStep('otp');
  };

  // Handle OTP Verification Submission
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const res = verifyOtpAndActivateAccount(otpCode);
    if (res.success) {
      onSuccess?.();
    } else {
      setErrorMessage(res.message || 'Girdiğiniz doğrulama kodu hatalı.');
    }
  };

  // Handle Sign In Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setShowForgotPassword(false);

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
      <div className="w-full bg-gradient-to-br from-[#ff7a00] via-orange-600 to-amber-600 px-6 py-10 sm:px-12 sm:py-14 text-white relative overflow-hidden flex flex-col items-center justify-center shadow-sm">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="w-full max-w-md relative z-10 space-y-6">
          {/* Logo Header */}
          <div className="flex items-center space-x-3.5">
            <div
              className={`w-12 h-12 rounded-full bg-white text-[#ff7a00] shadow-xl flex items-center justify-center p-2 shrink-0 ${
                isLogoSpinning ? 'animate-logo-spin' : ''
              }`}
            >
              <Zap className="w-6.5 h-6.5 fill-[#ff7a00] stroke-[2]" />
            </div>
            <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-sans">
              TanCoreLab
            </span>
          </div>

          {/* Only 3 Icons & Text */}
          <div className="space-y-3.5 pt-1">
            <div className="flex items-center space-x-3 text-sm sm:text-base font-extrabold text-white">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <span>{language === 'tr' ? '16 İnteraktif Modül & Canlı Simülatör' : '16 Interactive Modules & Calculators'}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm sm:text-base font-extrabold text-white">
              <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
              <span>{language === 'tr' ? 'Gerçek Şirket Vaka Sınavları (Case Exams)' : 'Real Business Case Exams'}</span>
            </div>
            <div className="flex items-center space-x-3 text-sm sm:text-base font-extrabold text-white">
              <ShieldCheck className="w-5 h-5 text-orange-200 shrink-0" />
              <span>{language === 'tr' ? 'Doğrulanmış Öğrenci Profili & Sıralama' : 'Verified Student Profile & Ranking'}</span>
            </div>
          </div>
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
                  <strong className="text-slate-900">{schoolEmail}</strong> adresinize gönderilen 6 haneli onay kodunu giriniz.
                </p>
              </div>

              {/* Simulated OTP Notification Banner for Easy Testing */}
              <div className="p-3 rounded-2xl bg-orange-50 border border-orange-200 text-[#ff7a00] text-xs font-bold flex items-center justify-between">
                <span>{language === 'tr' ? 'Test Onay Kodunuz:' : 'Demo Code:'}</span>
                <span className="font-mono text-sm font-black px-2 py-0.5 rounded-lg bg-[#ff7a00] text-white">
                  {simulatedCode}
                </span>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center space-x-2 animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    {language === 'tr' ? '6 Haneli Kod' : '6-Digit Code'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      setOtpCode(e.target.value);
                      handleInputChange();
                    }}
                    placeholder="123456"
                    className="w-full px-4 py-3 text-center tracking-[0.4em] font-mono text-lg font-black rounded-2xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-sm font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/30 cursor-pointer flex items-center justify-center space-x-2"
                >
                  <span>{language === 'tr' ? 'Kodu Onayla ve Başla' : 'Verify & Start'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <button
                onClick={() => setStep('form')}
                className="w-full text-center text-xs font-bold text-slate-500 hover:text-[#ff7a00] cursor-pointer pt-2"
              >
                {language === 'tr' ? '← Form Bilgilerine Geri Dön' : '← Back to Form'}
              </button>
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
                    placeholder="ad.soyad@ku.edu.tr"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00]"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Onay Kodu (123456)</label>
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => {
                      setForgotOtp(e.target.value);
                      handleInputChange();
                    }}
                    placeholder="123456"
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
                      {language === 'tr' ? 'Okul E-postası (@...edu.tr)' : 'School Email'}
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
                        placeholder="ad.soyad@ku.edu.tr"
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
                        placeholder={language === 'tr' ? 'Ad Soyad' : 'Full Name'}
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                        placeholder="Koç Üniversitesi"
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
                        placeholder="Endüstri Müh. - 3. Sınıf"
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                        className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 mt-2 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black uppercase tracking-wider transition-all shadow-md shadow-[#ff7a00]/25 cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>{language === 'tr' ? 'Kayıt Ol ve Onay Kodunu Al' : 'Sign Up & Get Code'}</span>
                    <ArrowRight className="w-4 h-4" />
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
                        placeholder="ad.soyad@ku.edu.tr"
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
            ? 'Sadece geçerli üniversite öğrenci e-posta adresleri (ör: @ku.edu.tr) kabul edilir.'
            : 'Only valid university student emails (e.g. @ku.edu.tr) are accepted.'}
        </div>
      </div>
    </div>
  );
};
