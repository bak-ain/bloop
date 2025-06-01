export function getBadgeImage(badgeType: 'artist' | 'fan', badgeLevel?: number): string {
  if (badgeType === 'artist') return '/images/badges/artist.png';

  if (badgeType === 'fan') {
    if (badgeLevel === 1) return '/images/badges/lv1.png';
    if (badgeLevel === 2) return '/images/badges/lv2.png';
    if (badgeLevel === 3) return '/images/badges/lv3.png';
  }

  return '/images/badges/default.png'; // fallback
}
export type UserLevel = 'BEGINNER' | 'LOFAN' | 'PROFANSSOR';

export function getLevelBadgeIcon(level: UserLevel): string {
  switch (level) {
    case 'BEGINNER':
      return '/images/levels/badge-beginner.png';
    case 'LOFAN':
      return '/images/levels/badge-lofan.png';
    case 'PROFANSSOR':
      return '/images/levels/badge-profanssor.png';
    default:
      return '/images/levels/badge-default.png';
  }
}
