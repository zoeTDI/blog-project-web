import {
  type ThemeModeOptions,
  type ThemePreferences,
} from '@/core/preferences';
import type { DeepPartial } from '@/types/deepType';

const updateThemeMode = (themePreferences: DeepPartial<ThemePreferences>) => {
  if (Object.keys(themePreferences).includes('mode')) {
    const themeModeOption: ThemeModeOptions | undefined = themePreferences.mode;
    if (themeModeOption === undefined) return;
    const app = document.getElementById('app');
    if (!app) {
      console.error(`无法获取到#app元素`);
      return;
    }
    if (app.classList.contains(themeModeOption)) {
      return;
    }
    app.classList.add(themeModeOption);
    app.classList.remove(themeModeOption === 'dark' ? 'light' : 'dark');
    if (themePreferences.colorPrimary) {
      updateThemeColor(themePreferences.colorPrimary);
    }
  }
};

export const updateThemeColor = (color: string) => {
  const appEl = document.getElementById('app');
  if (appEl) {
    appEl.style.setProperty('--app-accent-color', color);
  }
};

export { updateThemeMode };
