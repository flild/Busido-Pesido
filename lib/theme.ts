// src/lib/theme.ts

export type BrandTheme = 'matcha' | 'rose' | 'ice' | 'caramel' | 'berry' | 'forest' | 'oat';

export const themeColors: Record<BrandTheme, {
  text: string;
  bg: string;
  ring: string;
  gradient: string;
  borderTop: string;
  borderFull: string;
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
    tabActive: 'bg-caramel text-espresso border-caramel',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-caramel/[0.04]',
  },
  berry: {
    text: 'text-berry',
    bg: 'bg-berry',
    ring: 'ring-berry/30',
    gradient: 'from-berry',
    borderTop: 'border-t-berry',
    borderFull: 'border-berry',
    tabActive: 'bg-berry text-white border-berry',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-berry/[0.04]',
  },
  forest: {
    text: 'text-forest',
    bg: 'bg-forest',
    ring: 'ring-forest/30',
    gradient: 'from-forest',
    borderTop: 'border-t-forest',
    borderFull: 'border-forest',
    tabActive: 'bg-forest text-white border-forest',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-forest/[0.04]',
  },
  oat: {
    text: 'text-oat',
    bg: 'bg-oat',
    ring: 'ring-oat/30',
    gradient: 'from-oat',
    borderTop: 'border-t-oat',
    borderFull: 'border-oat',
    tabActive: 'bg-oat text-espresso border-oat',
    tabInactive: 'bg-white text-coal border-forest/15 hover:bg-snow',
    softBg: 'bg-oat/[0.04]',
  }
};