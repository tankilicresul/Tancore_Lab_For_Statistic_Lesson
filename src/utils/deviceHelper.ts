/**
 * Utility for generating and maintaining persistent anonymous device fingerprints
 * for audit and multi-account detection.
 */

const DEVICE_KEY = 'tancore_device_fingerprint_v1';

export function getOrCreateDeviceId(): string {
  try {
    if (typeof window === 'undefined') return 'dev_server';
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      const rand = Math.random().toString(36).substring(2, 8);
      const time = Date.now().toString(36);
      id = `dev_${rand}_${time}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return 'dev_local';
  }
}

export function getDeviceSignature(): string {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent || '';
  let os = 'Diğer';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/linux/i.test(ua)) os = 'Linux';

  let browser = 'Tarayıcı';
  if (/chrome|crios/i.test(ua) && !/edge|edg|opr/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/edg/i.test(ua)) browser = 'Edge';

  return `${os} • ${browser}`;
}
