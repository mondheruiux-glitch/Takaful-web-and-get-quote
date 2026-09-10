/**
 * DiceBear Avatar URL Helper
 * Uses DiceBear API v9 SVG endpoints for crisp, modern avatar generation
 */

export function getDicebearAvatar(name: string, gender?: 'male' | 'female' | string): string {
  const seed = encodeURIComponent(name);
  // Lorelei / Avataaars style from DiceBear
  if (gender === 'female') {
    return `https://api.dicebear.com/9.x/lorelei/svg?seed=${seed}&backgroundColor=e8edf5,f4f6f8,edf2f7`;
  }
  return `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}&backgroundColor=e8edf5,f4f6f8,edf2f7`;
}
