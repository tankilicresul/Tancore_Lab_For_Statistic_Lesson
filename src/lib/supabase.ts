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

  try {
    const { error } = await supabase.auth.signInWithOtp({
      email,
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

  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
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

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
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

  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase());
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
    const payload: any = {
      email: profile.schoolEmail.trim().toLowerCase(),
      full_name: profile.fullName,
      university: profile.university,
      department_and_class: profile.departmentAndClass,
      avatar_emoji: profile.avatarEmoji || '👨‍🎓',
      is_verified: true,
      updated_at: new Date().toISOString(),
    };
    if (profile.avatarUrl) {
      payload.avatar_url = profile.avatarUrl;
    }
    if (typeof profile.xp === 'number') {
      payload.xp = profile.xp;
    }
    if (typeof profile.streak === 'number') {
      payload.streak = profile.streak;
    }
    if (typeof profile.completedLessons === 'number') {
      payload.completed_lessons = profile.completedLessons;
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
 * Fetch all registered profiles from Supabase profiles table for live leaderboard
 */
export async function fetchAllProfilesFromSupabase(): Promise<any[]> {
  if (!supabase || !isSupabaseConfigured) return [];

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
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

