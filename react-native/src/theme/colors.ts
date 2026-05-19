export type Theme = 'light' | 'dark';

export const Colors = {
  accent: '#D8FF3D',
  coral: '#FF5A4D',
  onAccent: '#0B0B0B',

  light: {
    bg: '#F1EFEB',
    surface: '#FFFFFF',
    ink: '#0B0B0B',
    ink2: 'rgba(11,11,11,0.55)',
    sep: 'rgba(11,11,11,0.06)',
    tabBar: 'rgba(255,255,255,0.93)',
    tabBorder: 'rgba(11,11,11,0.06)',
    pillBg: 'rgba(11,11,11,0.05)',
    accentPillBg: 'rgba(11,11,11,0.85)',
    coachBg: '#0B0B0B',
  },
  dark: {
    bg: '#0B0B0B',
    surface: '#161616',
    ink: '#FAFAFA',
    ink2: 'rgba(255,255,255,0.55)',
    sep: 'rgba(255,255,255,0.07)',
    tabBar: 'rgba(20,20,20,0.93)',
    tabBorder: 'rgba(255,255,255,0.08)',
    pillBg: 'rgba(255,255,255,0.06)',
    accentPillBg: 'rgba(11,11,11,0.85)',
    coachBg: '#161616',
  },
} as const;

export const th = (theme: Theme) => Colors[theme];
