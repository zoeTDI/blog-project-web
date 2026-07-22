import type { ThemeModeOptions, ThemePreferences } from '../types';
import type { DeepPartial } from '@caldm/utils';

export const updateThemeColor = (color: string) => {
  if (typeof document === 'undefined') return;
  const els = document.getElementsByTagName('html');
  if (els.length > 0) {
    const el = els[0];
    el.style.setProperty('--app-accent-color', color);
  }
};

export const updateThemeMode = (
  themePreferences: DeepPartial<ThemePreferences>,
) => {
  if (typeof document === 'undefined') return;

  if ('mode' in themePreferences && themePreferences.mode) {
    const themeModeOption: ThemeModeOptions | undefined = themePreferences.mode;
    if (themeModeOption === undefined) return;

    const els = document.getElementsByTagName('html');
    if (els.length == 0) {
      console.error(`无法获取到#app元素`);
      return;
    }
    const el = els[0];
    if (el.classList.contains(themeModeOption)) {
      return;
    }
    el.classList.add(themeModeOption);
    el.classList.remove(themeModeOption === 'dark' ? 'light' : 'dark');
    if (themePreferences.colorPrimary) {
      updateThemeColor(themePreferences.colorPrimary);
    }
  }
};