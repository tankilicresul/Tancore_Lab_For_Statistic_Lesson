import { LocalizedText } from '../types/stats';

export function getLocalized(text: LocalizedText | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  return text[lang] || text.tr || text.en || '';
}

/**
 * Formats student full name for greeting:
 * - If name is provided:
 *   * 1-2 words: 1st word (e.g. "Resul Tankılıç" -> "Resul")
 *   * 3+ words: 1st word's uppercase initial + "." + 2nd word (e.g. "Mehmet Ali Yılmaz" -> "M. Ali")
 * - If name is missing / empty: extracts the handle before '@' from email (e.g. "resul@itu.edu.tr" -> "Resul")
 * - Otherwise: returns fallback ("kanka" / "friend")
 */
export function formatStudentGreetingName(
  fullName?: string | null,
  emailOrFallback: string = 'kanka',
  fallback: string = 'kanka'
): string {
  let email: string | undefined = undefined;
  let defaultFallback = fallback;

  if (emailOrFallback && emailOrFallback.includes('@')) {
    email = emailOrFallback;
  } else if (emailOrFallback) {
    defaultFallback = emailOrFallback;
  }

  const trimmedName = fullName?.trim();
  const isGeneric = Boolean(
    trimmedName &&
    (trimmedName.toLowerCase() === 'öğrenci' ||
      trimmedName.toLowerCase() === 'student' ||
      trimmedName.toLowerCase() === 'kullanıcı' ||
      trimmedName.toLowerCase() === 'user')
  );

  if (trimmedName && !isGeneric) {
    const words = trimmedName.split(/\s+/).filter(Boolean);
    if (words.length === 1 || words.length === 2) {
      return words[0];
    }
    const firstLetter = words[0].charAt(0).toLocaleUpperCase('tr-TR');
    const secondWord = words[1];
    return `${firstLetter}. ${secondWord}`;
  }

  if (email && email.includes('@')) {
    const prefix = email.split('@')[0].trim();
    if (prefix) {
      return prefix.charAt(0).toLocaleUpperCase('tr-TR') + prefix.slice(1);
    }
  }

  return defaultFallback;
}
