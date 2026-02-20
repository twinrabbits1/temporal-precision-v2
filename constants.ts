
import { Theme } from './types';

export const THEMES: Theme[] = [
  {
    id: '01',
    name: 'Sentinel Red',
    primary: '#ff003c', // Bright Red
    secondary: '#00e6ff', // Cyan
  },
  {
    id: '02',
    name: 'Deep Blue',
    primary: '#2962ff', // Vivid Blue
    secondary: '#ffab40', // Neon Orange
  },
  {
    id: '03',
    name: 'Neo Green',
    primary: '#00e676', // Bright Green
    secondary: '#ff00e6', // Magenta
  },
  {
    id: '04',
    name: 'Cyber Violet',
    primary: '#a000ff', // Violet
    secondary: '#fffb00', // Bright Yellow
  },
  {
    id: '05',
    name: 'Gold Circuit',
    primary: '#ffd740', // Gold/Amber
    secondary: '#18ffff', // Aqua
  },
];

export const DEFAULT_TARGET_TIME = 3.0000;
export const QUICK_SELECT_OPTIONS = [1.0000, 3.0000, 5.0000, 10.0000];
export const MAX_HISTORY_ITEMS = 10;
export const CELEBRATION_DURATION = 1500;
