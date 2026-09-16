import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { sendEmailOtp, verifyEmailOtp, uploadAvatarImage } from '../lib/supabase';
import { UserProfile } from '../types/stats';
import { AvatarCropModal } from './AvatarCropModal';
import {
  X,
  Mail,
  User,
  GraduationCap,
  Building2,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  KeyRound,
  Sparkles,
  Info,
  Camera,
  Loader2,
} from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AVATAR_OPTIONS = ['👨‍🎓', '👩‍🎓', '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '🚀', '⚡', '📊', '🧠'];

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const { language, registerAccountAndSendOtp, verifyOtpAndActivateAccount, userProfile } = useAppStore();

  const [step, setStep] = useState<'register' | 'otp'>('register');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [simulatedCode, setSimulatedCode] = useState<string | null>(null);

  // Form State - Starts completely blank without any pre-filled data
  const [formData, setFormData] = useState<UserProfile>({
    fullName: '',
    schoolEmail: '',
    university: '',
    departmentAndClass: '',
    avatarEmoji: '👨‍🎓',
    avatarUrl: undefined,
  });

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [cropTargetImage, setCropTargetImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // OTP State (6 digits)
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
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

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert(language === 'tr' ? 'Fotoğraf boyutu en fazla 10MB olabilir.' : 'Photo size must be less than 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setCropTargetImage(reader.result as string);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCropComplete = async (croppedFile: File) => {
    setIsUploadingAvatar(true);
    try {
      const email = formData.schoolEmail.trim().toLowerCase() || 'register_user';
      const res = await uploadAvatarImage(croppedFile, email);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, avatarUrl: res.url }));
        setCropTargetImage(null);
      } else {
        alert(res.error || (language === 'tr' ? 'Fotoğraf yüklenemedi.' : 'Upload failed.'));
      }
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  // Submit Register Form & Request OTP Code
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const emailClean = formData.schoolEmail.trim().toLowerCase();
    if (!emailClean) {
      setErrorMessage(language === 'tr' ? 'Lütfen e-posta adresinizi girin.' : 'Please enter your email.');
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

      registerAccountAndSendOtp(formData, res.simulatedCode);

      setStep('otp');
      setResendTimer(60);
      setSuccessMessage(
        language === 'tr'
          ? `${formData.schoolEmail} adresine 6 haneli doğrulama kodu gönderildi.`
          : `6-digit verification code sent to ${formData.schoolEmail}.`
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'E-posta doğrulama kodu gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit input change
  const handleOtpDigitChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user pasted a 6-digit code
      const pastedCode = value.trim().slice(0, 6).split('');
      const newDigits = [...otpDigits];
      pastedCode.forEach((char, i) => {
        if (i < 6) newDigits[i] = char;
      });
      setOtpDigits(newDigits);
      if (otpInputRefs.current[5]) otpInputRefs.current[5]?.focus();
      return;
    }

    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);

    // Auto-focus next input box
    if (value && index < 5 && otpInputRefs.current[index + 1]) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation across digits
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Submit OTP Verification Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const code = otpDigits.join('');

    if (code.length < 6) {
      setErrorMessage(language === 'tr' ? 'Lütfen 6 haneli kodu eksiksiz giriniz.' : 'Please enter the full 6-digit code.');
      return;
    }

    setLoading(true);

    try {
      // Check local store verification & Supabase verification helper
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
      registerAccountAndSendOtp(formData, res.simulatedCode);
      setResendTimer(60);
      setSuccessMessage(language === 'tr' ? 'Yeni kod tekrar gönderildi.' : 'New code sent.');
    } catch (err: any) {
      setErrorMessage(err.message || 'Kod tekrar gönderilemedi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-5 sm:p-7 shadow-2xl overflow-hidden max-h-[95vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header Banner */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#ff7a00]/10 text-[#ff7a00] border border-[#ff7a00]/25 shadow-inner mb-3">
            {step === 'register' ? (
              <ShieldCheck className="w-7 h-7 stroke-[2]" />
            ) : (
              <KeyRound className="w-7 h-7 stroke-[2] animate-bounce" />
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            {step === 'register'
              ? language === 'tr'
                ? 'Hesap Oluştur veya Giriş Yap'
                : 'Create Account or Sign In'
              : language === 'tr'
              ? 'E-posta Kodunu Doğrula'
              : 'Verify Email Code'}
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            {step === 'register'
              ? language === 'tr'
                ? 'Okul bilgilerinizi yazın, maile gelen 6 haneli doğrulama kodu ile hemen erişim sağlayın.'
                : 'Enter your profile information to receive a 6-digit verification code.'
              : language === 'tr'
              ? `${formData.schoolEmail} adresine gelen 6 haneli kodu aşağıya giriniz.`
              : `Enter the 6-digit code sent to ${formData.schoolEmail}`}
          </p>
        </div>

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



        {/* STEP 1: Registration Profile Form */}
        {step === 'register' && (
          <form onSubmit={handleSendOtp} autoComplete="off" className="space-y-3.5 flex-1 overflow-y-auto pr-1">
            {/* Avatar Photo & Emoji Selector */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                {language === 'tr' ? 'Profil Fotoğrafı veya Avatar Seçin' : 'Choose Profile Photo or Avatar'}
              </label>

              <div className="flex items-center gap-3.5">
                {/* Preview Avatar Circle */}
                <div className="w-14 h-14 rounded-full bg-[#ff7a00] text-white font-black text-2xl flex items-center justify-center border-2 border-white shadow-md shrink-0 overflow-hidden relative">
                  {isUploadingAvatar ? (
                    <Loader2 className="w-6 h-6 animate-spin text-white" />
                  ) : formData.avatarUrl ? (
                    <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    formData.avatarEmoji || (formData.fullName ? formData.fullName.charAt(0).toUpperCase() : '👨‍🎓')
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-1.5">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{language === 'tr' ? 'Fotoğraf Seç / Çek' : 'Upload / Take Photo'}</span>
                    </button>

                    {formData.avatarUrl && (
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, avatarUrl: undefined }))}
                        className="px-2.5 py-1.5 rounded-xl bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        {language === 'tr' ? 'Kaldır' : 'Remove'}
                      </button>
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-500 font-medium">
                    {language === 'tr' ? 'Galerinizden fotoğraf seçebilir ya da emojilerden birini kullanabilirsiniz.' : 'You can pick a photo or choose an emoji below.'}
                  </p>
                </div>
              </div>

              {/* Emoji Options */}
              <div className="flex items-center space-x-2 overflow-x-auto py-1 scrollbar-none">
                {AVATAR_OPTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarEmoji: emoji, avatarUrl: undefined })}
                    className={`w-9 h-9 rounded-full text-lg flex items-center justify-center transition-all border shrink-0 cursor-pointer ${
                      !formData.avatarUrl && formData.avatarEmoji === emoji
                        ? 'bg-gradient-to-br from-[#ff7a00] to-orange-500 text-white border-white ring-2 ring-[#ff7a00] scale-110 shadow-md'
                        : 'bg-white hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

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
                  autoComplete="off"
                  placeholder={language === 'tr' ? 'Adınızı ve soyadınızı giriniz' : 'Enter your full name'}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* School Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'E-posta Adresi' : 'Email Address'} *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoComplete="off"
                  placeholder={language === 'tr' ? 'E-posta adresinizi giriniz' : 'Enter your email address'}
                  value={formData.schoolEmail}
                  onChange={(e) => setFormData({ ...formData, schoolEmail: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* University */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Üniversite İsmi' : 'University'}
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder={language === 'tr' ? 'Hangi üniversitede okuyorsunuz?' : 'Enter your university name'}
                  value={formData.university}
                  onChange={(e) => setFormData({ ...formData, university: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Department and Class */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'tr' ? 'Bölüm ve Sınıf' : 'Department & Class'}
              </label>
              <div className="relative">
                <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  autoComplete="off"
                  placeholder={language === 'tr' ? 'Bölümünüz ve sınıfınız nedir?' : 'Enter your department & class'}
                  value={formData.departmentAndClass}
                  onChange={(e) => setFormData({ ...formData, departmentAndClass: e.target.value })}
                  className="w-full pl-10 pr-3 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs font-medium focus:outline-none focus:border-[#ff7a00] focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-2xl bg-[#ff7a00] hover:bg-[#e66e00] text-white text-xs font-black tracking-wide flex items-center justify-center space-x-2 transition-all shadow-md shadow-[#ff7a00]/30 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{language === 'tr' ? 'Doğrulama Kodunu Gönder' : 'Send Verification Code'}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: OTP Code Entrance Form */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            {/* 6 Digit Input Group */}
            <div>
              <label className="block text-xs font-extrabold text-slate-700 text-center mb-3">
                {language === 'tr' ? '6 Haneli E-posta Kodunu Giriniz' : 'Enter 6-Digit Email Code'}
              </label>
              <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputRefs.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-10 h-12 sm:w-12 sm:h-14 rounded-2xl border-2 border-slate-300 text-center font-black text-lg sm:text-xl text-slate-900 bg-slate-50 focus:bg-white focus:border-[#ff7a00] focus:outline-none transition-all shadow-inner"
                  />
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                type="submit"
                disabled={loading || otpDigits.join('').length < 6}
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
                  className="text-slate-600 hover:text-slate-900 underline underline-offset-2"
                >
                  {language === 'tr' ? 'Bilgileri Değiştir' : 'Change Info'}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendTimer > 0 || loading}
                  className="text-[#ff7a00] hover:underline disabled:opacity-40 disabled:no-underline flex items-center space-x-1"
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

      {cropTargetImage && (
        <AvatarCropModal
          imageSrc={cropTargetImage}
          onCropComplete={handleCropComplete}
          onClose={() => setCropTargetImage(null)}
          language={language}
        />
      )}
    </div>
  );
};
