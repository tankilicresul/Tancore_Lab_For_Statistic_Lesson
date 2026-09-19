import { LocalizedText } from '../types/stats';

export function getLocalized(text: LocalizedText | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  return text[lang] || text.tr || text.en || '';
}

/**
 * Formats student full name for greeting:
 * - 1 word: that word
 * - 2 words: 1st word (e.g. "Resul Tankılıç" -> "Resul")
 * - 3 or 4+ words: 1st word's uppercase initial + "." + 2nd word (e.g. "Mehmet Ali Yılmaz" -> "M. Ali", "Ahmet Can Berk Demir" -> "A. Can")
 */
export function formatStudentGreetingName(fullName?: string, fallback: string = 'kanka'): string {
  if (!fullName || !fullName.trim()) return fallback;

  const words = fullName.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return fallback;

  if (words.length === 1 || words.length === 2) {
    return words[0];
  }

  const firstLetter = words[0].charAt(0).toLocaleUpperCase('tr-TR');
  const secondWord = words[1];
  return `${firstLetter}. ${secondWord}`;
}
