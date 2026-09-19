/**
 * Default 3D Avatar Helper for TanCoreLab
 * Provides stylized 3D student character avatars generated to match the brand aesthetic.
 */

export const DEFAULT_AVATARS: string[] = [
  '/avatars/avatar-1.jpg', // Male, curly brown hair, black glasses, mustache
  '/avatars/avatar-2.jpg', // Female, wavy brown hair, rose-gold glasses
  '/avatars/avatar-3.jpg', // Male, short fade black hair, warm smile
  '/avatars/avatar-4.jpg', // Female, sleek black hair ponytail, round glasses
  '/avatars/avatar-5.jpg', // Male, neat light brown hair, friendly smile
  '/avatars/avatar-6.jpg', // Female, curly afro high puff bun
  '/avatars/avatar-7.jpg', // Male, messy dark wavy hair, wireframe glasses, orange tee
  '/avatars/avatar-8.jpg', // Female, blonde bob haircut, friendly hazel eyes
];

/**
 * Returns a random avatar from the default avatars list
 */
export function getRandomDefaultAvatar(): string {
  const index = Math.floor(Math.random() * DEFAULT_AVATARS.length);
  return DEFAULT_AVATARS[index];
}

/**
 * Computes a deterministic default avatar for a user based on their email / name / ID
 * This ensures the user sees the same consistent 3D avatar until they upload a custom one.
 */
export function getDefaultAvatarForUser(identifier?: string | null): string {
  if (!identifier || typeof identifier !== 'string' || !identifier.trim()) {
    return DEFAULT_AVATARS[0];
  }

  const str = identifier.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  const index = Math.abs(hash) % DEFAULT_AVATARS.length;
  return DEFAULT_AVATARS[index];
}

/**
 * Gets effective avatar URL: user's custom avatarUrl or deterministic default avatar
 */
export function getEffectiveAvatarUrl(avatarUrl?: string | null, identifier?: string | null): string {
  if (avatarUrl && typeof avatarUrl === 'string' && avatarUrl.trim().length > 0) {
    return avatarUrl;
  }
  return getDefaultAvatarForUser(identifier);
}

/**
 * Check if the given avatarUrl is one of our default preset 3D avatars
 */
export function isPresetDefaultAvatar(url?: string | null): boolean {
  if (!url) return false;
  return DEFAULT_AVATARS.includes(url) || url.startsWith('/avatars/avatar-');
}
