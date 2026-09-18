import { createClient } from '@supabase/supabase-js';
import { UserProfile } from '../types/stats';

const DEFAULT_SUPABASE_URL = 'https://jjbofttymfqjivzzhaly.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqYm9mdHR5bWZxaml2enpoYWx5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NDExODQsImV4cCI6MjEwMDQxNzE4NH0.PjLoA5LDDUtewmFdaRNVPUImSjhM6kLiViHdmVJgk84';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl !== 'https://your-project.supabase.co' &&
  supabaseAnonKey &&
  supabaseAnonKey !== 'your-anon-key-here'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isAcademicEmail = (email: string): boolean => {
  if (!email || typeof email !== 'string') return false;
  const e = email.trim().toLowerCase();
  if (!e.includes('@')) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
};

/**
 * Send OTP Code via email using Supabase Auth
 */
export async function sendEmailOtp(
  email: string,
  metadata?: { fullName?: string; university?: string; departmentAndClass?: string; password?: string }
): Promise<{ success: boolean; simulatedCode?: string; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Veritabanı bağlantısı yapılandırılamadı.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isAcademicEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Lütfen geçerli bir e-posta adresi giriniz.',
    };
  }

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: true,
        data: metadata
          ? {
              full_name: metadata.fullName,
              name: metadata.fullName,
              display_name: metadata.fullName,
              university: metadata.university,
              department_and_class: metadata.departmentAndClass,
            }
          : undefined,
      },
    });

    if (error) {
      console.warn('Supabase Auth OTP error:', error.message);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error sending OTP:', err);
    return { success: false, error: err.message || 'Onay kodu gönderilemedi.' };
  }
}

/**
 * Verify OTP token entered by the user
 */
export async function verifyEmailOtp(
  email: string,
  token: string
): Promise<{ success: boolean; user?: any; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Veritabanı bağlantısı bulunamadı.' };
  }

  const cleanToken = token.trim();

  try {
    // 1. Try 'signup' verification type first
    let res = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: cleanToken,
      type: 'signup',
    });

    // 2. If 'signup' fails, try 'email' type (used for magiclink/otp signin)
    if (res.error) {
      res = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanToken,
        type: 'email',
      });
    }

    if (res.error) {
      return { success: false, error: res.error.message || 'Geçersiz veya süresi dolmuş doğrulama kodu.' };
    }

    return { success: true, user: res.data.user };
  } catch (err: any) {
    return { success: false, error: err.message || 'Doğrulama hatası oluştu.' };
  }
}

/**
 * Sign Up with email, password and student profile metadata
 */
export async function signUpWithSupabase(
  email: string,
  password: string,
  metadata?: { fullName?: string; university?: string; departmentAndClass?: string }
): Promise<{ success: boolean; user?: any; session?: any; needsEmailVerification?: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Veritabanı bağlantısı bulunamadı.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isAcademicEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Kayıt için geçerli bir e-posta adresi gereklidir.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password: password.trim(),
      options: {
        data: metadata
          ? {
              full_name: metadata.fullName,
              name: metadata.fullName,
              display_name: metadata.fullName,
              university: metadata.university,
              department_and_class: metadata.departmentAndClass,
            }
          : undefined,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const needsEmailVerification = !data.session && Boolean(data.user && !data.user.email_confirmed_at);
    return {
      success: true,
      user: data.user,
      session: data.session,
      needsEmailVerification,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Kayıt işlemi başarısız.' };
  }
}

/**
 * Sign In with email and password via Supabase Auth
 */
export async function signInWithSupabase(
  email: string,
  password: string
): Promise<{ success: boolean; user?: any; session?: any; errorType?: 'WRONG_PASSWORD' | 'EMAIL_NOT_FOUND' | 'OTHER'; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, errorType: 'OTHER', error: 'Veritabanı bağlantısı bulunamadı.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isAcademicEmail(cleanEmail)) {
    return {
      success: false,
      errorType: 'OTHER',
      error: 'Lütfen geçerli bir e-posta adresi giriniz.',
    };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password.trim(),
    });

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        return {
          success: false,
          errorType: 'WRONG_PASSWORD',
          error: 'E-posta veya şifreniz hatalı. Lütfen kontrol edip tekrar deneyin.',
        };
      }
      if (msg.includes('email not confirmed')) {
        return {
          success: false,
          errorType: 'OTHER',
          error: 'E-posta adresiniz henüz onaylanmamış. Lütfen onay kodunu giriniz.',
        };
      }
      return { success: false, errorType: 'OTHER', error: error.message };
    }

    return { success: true, user: data.user, session: data.session };
  } catch (err: any) {
    return { success: false, errorType: 'OTHER', error: err.message || 'Giriş yapılamadı.' };
  }
}

/**
 * Send real password reset email via Supabase Auth
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Veritabanı bağlantısı bulunamadı.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  if (!isAcademicEmail(cleanEmail)) {
    return {
      success: false,
      error: 'Şifre sıfırlama için geçerli bir e-posta adresi gereklidir.',
    };
  }

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Şifre sıfırlama kodu gönderilemedi.' };
  }
}

/**
 * Verify password reset OTP token
 */
export async function verifyPasswordResetToken(
  email: string,
  token: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Veritabanı bağlantısı bulunamadı.' };
  }

  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: token.trim(),
      type: 'recovery',
    });

    if (error) {
      return { success: false, error: error.message || 'Geçersiz veya süresi dolmuş kod.' };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Kod doğrulanamadı.' };
  }
}

/**
 * Update user password after recovery
 */
export async function completePasswordReset(newPassword: string): Promise<{ success: boolean; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return { success: false, error: 'Veritabanı bağlantısı bulunamadı.' };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword.trim(),
    });

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'Şifre güncellenemedi.' };
  }
}

/**
 * Save / update user profile in Supabase profiles table (Strictly non-sensitive fields)
 */
export async function saveUserProfileToSupabase(profile: UserProfile & { xp?: number; streak?: number; completedLessons?: number }): Promise<void> {
  if (!supabase || !isSupabaseConfigured) return;

  try {
    const sanitizeText = (txt?: string, maxLen = 120) => (txt || '').replace(/<[^>]*>/g, '').trim().slice(0, maxLen);

    const payload: any = {
      email: profile.schoolEmail.trim().toLowerCase(),
      full_name: sanitizeText(profile.fullName, 80),
      university: sanitizeText(profile.university, 100),
      department_and_class: sanitizeText(profile.departmentAndClass, 100),
      avatar_emoji: sanitizeText(profile.avatarEmoji || '👨‍🎓', 10) || '👨‍🎓',
      is_verified: true,
      updated_at: new Date().toISOString(),
    };
    if (profile.avatarUrl) {
      payload.avatar_url = profile.avatarUrl;
    }
    if (typeof profile.xp === 'number') {
      const totalCompleted = Math.max(0, profile.completedLessons || 0);
      const maxAllowedXp = totalCompleted * 45 + Math.min(profile.streak || 1, 365) * 50 + 2000;
      payload.xp = Math.max(0, Math.min(Math.round(profile.xp), maxAllowedXp));
    }
    if (typeof profile.streak === 'number') {
      payload.streak = Math.max(1, Math.min(Math.round(profile.streak), 365));
    }
    if (typeof profile.completedLessons === 'number') {
      payload.completed_lessons = Math.max(0, Math.min(Math.round(profile.completedLessons), 200));
    }
    if (typeof profile.isPremium === 'boolean') {
      payload.is_premium = profile.isPremium;
    }
    if (profile.subscriptionStatus) {
      payload.subscription_status = profile.subscriptionStatus;
    }
    if (profile.subscriptionRenewsAt) {
      payload.subscription_renews_at = profile.subscriptionRenewsAt;
    }

    await supabase.from('profiles').upsert(
      payload,
      { onConflict: 'email' }
    );
  } catch (err) {
    console.warn('Supabase profile save warning:', err);
  }
}

/**
 * Fetch user profile from Supabase by email
 */
export async function fetchUserProfileFromSupabase(email: string): Promise<any | null> {
  if (!supabase || !isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error || !data) return null;
    return data;
  } catch (err) {
    console.warn('Supabase profile fetch error:', err);
    return null;
  }
}

/**
 * Fetch all registered profiles from Supabase for live leaderboard (Emails strictly excluded)
 */
export async function fetchAllProfilesFromSupabase(): Promise<any[]> {
  if (!supabase || !isSupabaseConfigured) return [];

  try {
    // 1. Query secure public_leaderboard view (contains zero emails)
    const { data: viewData, error: viewError } = await supabase
      .from('public_leaderboard')
      .select('id, full_name, university, department_and_class, avatar_emoji, avatar_url, xp, streak, completed_lessons')
      .order('xp', { ascending: false });

    if (!viewError && viewData && viewData.length > 0) return viewData;

    // 2. Direct fallback to profiles table without requesting email column
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, university, department_and_class, avatar_emoji, avatar_url, xp, streak, completed_lessons')
      .order('xp', { ascending: false });

    if (error || !data) return [];
    return data;
  } catch (err) {
    console.warn('Supabase fetchAllProfiles error:', err);
    return [];
  }
}

/**
 * Upload profile avatar image to Supabase Storage 'avatars' bucket
 */
export async function uploadAvatarImage(file: File, userIdentifier: string): Promise<{ success: boolean; url?: string; error?: string }> {
  if (!supabase || !isSupabaseConfigured) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve({ success: true, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    });
  }

  try {
    const cleanId = userIdentifier.replace(/[^a-zA-Z0-9_-]/g, '_');

    // 1. Check for any existing avatar files to delete after new upload succeeds
    let oldFilesToDelete: string[] = [];
    try {
      const { data: existingFiles } = await supabase.storage.from('avatars').list(cleanId);
      if (existingFiles && existingFiles.length > 0) {
        oldFilesToDelete = existingFiles.map((f) => `${cleanId}/${f.name}`);
      }
    } catch (e) {
      console.warn('Could not list previous avatars for cleanup:', e);
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const filePath = `${cleanId}/${Date.now()}.${fileExt}`;

    // 2. Upload new cropped avatar
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.warn('Storage upload error:', uploadError.message);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // 3. Immediately clean up old avatar files so they do not take up space
    if (oldFilesToDelete.length > 0) {
      try {
        await supabase.storage.from('avatars').remove(oldFilesToDelete);
      } catch (delErr) {
        console.warn('Could not clean up old avatars:', delErr);
      }
    }

    // 4. Update profile in database with new avatar_url
    if (userIdentifier && userIdentifier.includes('@')) {
      await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
        .eq('email', userIdentifier.trim().toLowerCase());
    }

    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error('Avatar upload exception:', err);
    return { success: false, error: err.message || 'Fotoğraf yüklenemedi.' };
  }
}

/**
 * Delete all avatar images for a user from Supabase Storage and reset avatar_url
 */
export async function deleteUserAvatar(userIdentifier: string): Promise<boolean> {
  if (!supabase || !isSupabaseConfigured) return true;

  try {
    const cleanId = userIdentifier.replace(/[^a-zA-Z0-9_-]/g, '_');
    const { data: existingFiles } = await supabase.storage.from('avatars').list(cleanId);
    if (existingFiles && existingFiles.length > 0) {
      const filesToDelete = existingFiles.map((f) => `${cleanId}/${f.name}`);
      await supabase.storage.from('avatars').remove(filesToDelete);
    }

    if (userIdentifier && userIdentifier.includes('@')) {
      await supabase
        .from('profiles')
        .update({ avatar_url: null, updated_at: new Date().toISOString() })
        .eq('email', userIdentifier.trim().toLowerCase());
    }

    return true;
  } catch (err) {
    console.warn('Delete avatar error:', err);
    return false;
  }
}

/**
 * Helper to sync user progress to Supabase database table `user_progress`
 */
export async function syncUserProgress(data: {
  userId?: string;
  totalXp: number;
  level: number;
  streak: number;
  completedLessons: string[];
  completedCaseExams: string[];
}) {
  if (!supabase || !isSupabaseConfigured) return;

  try {
    const userId = data.userId || 'guest_user';
    await supabase.from('user_progress').upsert(
      {
        user_id: userId,
        total_xp: data.totalXp,
        level: data.level,
        streak: data.streak,
        completed_lessons: data.completedLessons,
        completed_case_exams: data.completedCaseExams,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' }
    );
  } catch (err) {
    console.warn('Supabase sync warning:', err);
  }
}

/**
 * Fetch past Tanco chat messages for a user from Supabase
 */
export async function fetchTancoChatsFromSupabase(userIdentifier: string): Promise<Array<{ id: string; sender: 'tanco' | 'student'; text: string; timestamp: string }>> {
  if (!supabase || !isSupabaseConfigured || !userIdentifier) return [];

  try {
    const cleanId = userIdentifier.trim().toLowerCase();
    const { data, error } = await supabase
      .from('tanco_chats')
      .select('*')
      .or(`user_id.eq.${cleanId},user_email.eq.${cleanId}`)
      .order('created_at', { ascending: true })
      .limit(60);

    if (error || !data) {
      console.warn('fetchTancoChatsFromSupabase error:', error);
      return [];
    }

    return data.map((row: any) => ({
      id: row.id || `msg-${Date.now()}`,
      sender: row.sender as 'tanco' | 'student',
      text: row.text,
      timestamp: new Date(row.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }));
  } catch (err) {
    console.warn('fetchTancoChatsFromSupabase exception:', err);
    return [];
  }
}

/**
 * Save a single Tanco chat message to Supabase
 */
export async function saveTancoChatMessageToSupabase(
  userIdentifier: string,
  userEmail: string | undefined,
  sender: 'tanco' | 'student',
  text: string
): Promise<void> {
  if (!supabase || !isSupabaseConfigured || !userIdentifier || !text.trim()) return;

  try {
    const cleanId = userIdentifier.trim().toLowerCase();
    const cleanEmail = userEmail ? userEmail.trim().toLowerCase() : cleanId;

    await supabase.from('tanco_chats').insert({
      user_id: cleanId,
      user_email: cleanEmail,
      sender,
      text: text.trim(),
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('saveTancoChatMessageToSupabase error:', err);
  }
}

/**
 * Clear all chat messages for a user from Supabase
 */
export async function clearTancoChatsInSupabase(userIdentifier: string): Promise<void> {
  if (!supabase || !isSupabaseConfigured || !userIdentifier) return;

  try {
    const cleanId = userIdentifier.trim().toLowerCase();
    await supabase
      .from('tanco_chats')
      .delete()
      .or(`user_id.eq.${cleanId},user_email.eq.${cleanId}`);
  } catch (err) {
    console.warn('clearTancoChatsInSupabase error:', err);
  }
}

/**
 * Get latest message info to detect unread messages from Tanco
 */
export async function getLatestTancoMessageInfo(
  userIdentifier: string
): Promise<{ text: string; createdAt: string; sender: string } | null> {
  if (!supabase || !isSupabaseConfigured || !userIdentifier) return null;
  try {
    const cleanId = userIdentifier.trim().toLowerCase();
    const { data, error } = await supabase
      .from('tanco_chats')
      .select('text, created_at, sender')
      .or(`user_id.eq.${cleanId},user_email.eq.${cleanId}`)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !data || data.length === 0) return null;
    return {
      text: data[0].text,
      createdAt: data[0].created_at,
      sender: data[0].sender,
    };
  } catch {
    return null;
  }
}

export interface UploadedCourseNoteRecord {
  id?: string;
  courseCode: string;
  courseTitle?: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl?: string;
  uploaderEmail: string;
  uploaderName: string;
  noteDescription?: string;
  createdAt: string;
}

/**
 * Upload course notes and study materials to Supabase Storage & Database
 */
export async function uploadCourseNoteDocument(
  file: File,
  courseCode: string,
  courseTitle: string,
  uploaderEmail: string,
  uploaderName: string,
  noteDescription?: string
): Promise<{ success: boolean; record?: UploadedCourseNoteRecord; error?: string }> {
  try {
    const ALLOWED_EXTENSIONS = new Set([
      'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'
    ]);
    const rawExt = (file.name.split('.').pop() || '').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(rawExt)) {
      return {
        success: false,
        error: 'Güvenlik Uyarısı: Yalnızca geçerli doküman ve görsel formatları (.pdf, .docx, .pptx, .xlsx, .txt, .png, .jpg) yüklenebilir.',
      };
    }

    let publicUrl = '';
    const cleanCourseCode = courseCode.replace(/[^a-zA-Z0-9_-]/g, '_');
    const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filePath = `${cleanCourseCode}/${Date.now()}_${safeFileName}`;

    if (supabase && isSupabaseConfigured) {
      // 1. Try uploading to 'course-notes' or 'avatars' storage bucket
      const bucketName = 'course-notes';
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);
        publicUrl = data?.publicUrl || '';
      } else {
        // Fallback to avatars bucket if course-notes bucket not created yet
        const { error: fallbackError } = await supabase.storage
          .from('avatars')
          .upload(`notes_${filePath}`, file, { upsert: true });
        if (!fallbackError) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(`notes_${filePath}`);
          publicUrl = data?.publicUrl || '';
        }
      }
    }

    const newRecord: UploadedCourseNoteRecord = {
      id: `note_${Date.now()}`,
      courseCode,
      courseTitle,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type || file.name.split('.').pop() || 'unknown',
      fileUrl: publicUrl,
      uploaderEmail: uploaderEmail || 'anonymous',
      uploaderName: uploaderName || 'Öğrenci',
      noteDescription: noteDescription || '',
      createdAt: new Date().toISOString(),
    };

    // 2. Notify serverless API endpoint (/api/upload-course-note)
    try {
      await fetch('/api/upload-course-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecord),
      });
    } catch (apiErr) {
      console.warn('API sync warning:', apiErr);
    }

    // 3. Save to local storage cache of uploaded materials
    try {
      const existing = JSON.parse(localStorage.getItem('tancorelab_uploaded_notes') || '[]');
      existing.unshift(newRecord);
      localStorage.setItem('tancorelab_uploaded_notes', JSON.stringify(existing.slice(0, 50)));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    return { success: true, record: newRecord };
  } catch (err: any) {
    console.error('uploadCourseNoteDocument error:', err);
    return { success: false, error: err.message || 'Dosya yükleme sırasında bir hata oluştu.' };
  }
}

export interface AppIssueReport {
  id?: string;
  userMessage: string;
  detectedIssue?: string;
  screenContext?: any;
  userEmail?: string;
  userName?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
  createdAt?: string;
}

/**
 * Report a platform issue/bug detected from chat or UI to backend
 */
export async function reportAppIssue(report: AppIssueReport): Promise<boolean> {
  try {
    const payload = {
      id: `ISSUE-${Date.now().toString().slice(-6)}`,
      user_message: report.userMessage,
      detected_issue: report.detectedIssue || report.userMessage,
      screen_context: typeof report.screenContext === 'object' ? JSON.stringify(report.screenContext) : String(report.screenContext || 'Genel'),
      user_email: report.userEmail || 'anonymous',
      user_name: report.userName || 'Öğrenci',
      severity: report.severity || 'Medium',
      status: 'Open',
      created_at: new Date().toISOString(),
    };

    if (supabase && isSupabaseConfigured) {
      try {
        await supabase.from('app_issues').insert([payload]);
      } catch (dbErr) {
        console.warn('Supabase app_issues insert error:', dbErr);
      }
    }

    try {
      await fetch('/api/report-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
    } catch (e) {
      // API call fallback
    }

    return true;
  } catch (err) {
    console.warn('reportAppIssue error:', err);
    return false;
  }
}



