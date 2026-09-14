import { LocalizedText } from '../types/stats';

export function getLocalized(text: LocalizedText | undefined, lang: 'tr' | 'en'): string {
  if (!text) return '';
  return text[lang] || text.tr || text.en || '';
}
