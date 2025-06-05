
export function getBadgeImage(badgeType: 'artist' | 'fan', badgeLevel?: number): string {
  if (badgeType === 'artist') return '/images/artist.png';

  if (badgeType === 'fan') {
    if (badgeLevel === 1) return '/images/lv1.png';
    if (badgeLevel === 2) return '/images/lv2.png';
    if (badgeLevel === 3) return '/images/lv3.png';
  }


  return '/images/lv1.png'; // fallback
}
export type UserLevel = 'BLING' | 'LOOPY' | 'POPIN';

export function getLevelBadgeIcon(level: UserLevel): string {
  switch (level) {
    case 'BLING':
      return '/images/lv1.png';
    case 'LOOPY':
      return '/images/lv2.png';
    case 'POPIN':
      return '/images/lv3.png';
    default:
      return '/images/lv1.png';
  }
}
// utils/emoji.ts

export function getAvailableEmojis(badgeLevel: number = 1): string[] {
  const base = [
    "/images/emoji1.png",
    "/images/emoji2.png",
    "/images/emoji3.png",
  ];

  const level2 = [
    "/images/emoji4.png",
    "/images/emoji5.png",
    "/images/emoji6.png",
  ];

  const level3 = [
    "/images/emoji7.png",
    "/images/emoji8.png",
    "/images/emoji9.png",
  ];

  if (badgeLevel === 3) return [...base, ...level2, ...level3];
  if (badgeLevel === 2) return [...base, ...level2];
  return base;
}
