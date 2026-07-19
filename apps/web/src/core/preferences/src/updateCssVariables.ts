import {
  type ThemeModeOptions,
  type ThemePreferences,
} from '@/core/preferences';
import type { DeepPartial } from '#/utils';

const updateThemeMode = (themePreferences: DeepPartial<ThemePreferences>) => {
  if (Object.keys(themePreferences).includes('mode')) {
    const themeModeOption: ThemeModeOptions | undefined = themePreferences.mode;
    if (themeModeOption === undefined) return;
    // const app = document.getElementById('app');
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

export const updateThemeColor = (color: string) => {
  // const el = document.getElementById('app');
  const els = document.getElementsByTagName('html');
  if (els.length > 0) {
    const el = els[0];
    el.style.setProperty('--app-accent-color', color);
  }
};

export { updateThemeMode };
