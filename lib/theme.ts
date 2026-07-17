// src/lib/theme.ts

// Единый тип для всех брендовых цветов проекта
export type BrandTheme = 'matcha' | 'rose' | 'ice' | 'caramel';

// Словарь со всеми готовыми Tailwind-классами
export const themeColors: Record<BrandTheme, {
  text: string;
  bg: string;
  ring: string;
  gradient: string;
  borderTop: string;
  borderFull: string;
  // Специфичные составные стили (например, для табов или карточек)
  tabActive: string;
  tabInactive: string;
  softBg: string;
}> = {
  matcha: {
    text: 'text-matcha',
    bg: 'bg-matcha',
    ring: 'ring-matcha/30',
    gradient: 'from-matcha',
    borderTop: 'border-t-matcha',
    borderFull: 'border-matcha',
    tabActive: 'bg-matcha text-white border-matcha',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-matcha/[0.04]',
  },
  rose: {
    text: 'text-rose',
    bg: 'bg-rose',
    ring: 'ring-rose/30',
    gradient: 'from-rose',
    borderTop: 'border-t-rose',
    borderFull: 'border-rose',
    tabActive: 'bg-rose text-white border-rose',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-rose/[0.04]',
  },
  ice: {
    text: 'text-ice',
    bg: 'bg-ice',
    ring: 'ring-ice/30',
    gradient: 'from-ice',
    borderTop: 'border-t-ice',
    borderFull: 'border-ice',
    tabActive: 'bg-ice text-white border-ice',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-ice/[0.04]',
  },
  caramel: {
    text: 'text-caramel',
    bg: 'bg-caramel',
    ring: 'ring-caramel/30',
    gradient: 'from-caramel',
    borderTop: 'border-t-caramel',
    borderFull: 'border-caramel',
    tabActive: 'bg-caramel text-espresso border-caramel', // у карамели темный текст для контраста
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-caramel/[0.04]',
  }
};