import { ThemeConfig, ThemeAccent } from '../types';

export const THEMES: Record<ThemeAccent, ThemeConfig> = {
  amber: {
    id: 'amber',
    name: 'Candlelight Amber',
    label: 'Low-blue warm amber for melatonin preservation',
    colorHex: '#d89f5e',
    glowRgba: 'rgba(216, 159, 94, 0.35)',
    activeBg: 'rgba(216, 159, 94, 0.12)',
    borderHex: 'rgba(216, 159, 94, 0.4)',
  },
  sage: {
    id: 'sage',
    name: 'Forest Sage',
    label: 'Subtle eucalyptus green, organic & calming',
    colorHex: '#7ea88b',
    glowRgba: 'rgba(126, 168, 139, 0.35)',
    activeBg: 'rgba(126, 168, 139, 0.12)',
    borderHex: 'rgba(126, 168, 139, 0.4)',
  },
  teal: {
    id: 'teal',
    name: 'Midnight Teal',
    label: 'Tranquil deep ocean mist and rain',
    colorHex: '#5c94a6',
    glowRgba: 'rgba(92, 148, 166, 0.35)',
    activeBg: 'rgba(92, 148, 166, 0.12)',
    borderHex: 'rgba(92, 148, 166, 0.4)',
  },
  lavender: {
    id: 'lavender',
    name: 'Dream Lavender',
    label: 'Soft twilight amethyst, gentle on sleepy eyes',
    colorHex: '#a38fc2',
    glowRgba: 'rgba(163, 143, 194, 0.35)',
    activeBg: 'rgba(163, 143, 194, 0.12)',
    borderHex: 'rgba(163, 143, 194, 0.4)',
  },
  coral: {
    id: 'coral',
    name: 'Warm Terracotta',
    label: 'Cozy hearthstone embers on a rainy night',
    colorHex: '#c98075',
    glowRgba: 'rgba(201, 128, 117, 0.35)',
    activeBg: 'rgba(201, 128, 117, 0.12)',
    borderHex: 'rgba(201, 128, 117, 0.4)',
  },
};
