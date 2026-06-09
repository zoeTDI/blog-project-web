import { type ThemeModeOptions, type ThemePreferences } from "@/core/preferences";

const updateThemeMode = (themePreferences: ThemePreferences) => {
  if (Object.keys(themePreferences).includes('mode')) {
    const themeModeOption: ThemeModeOptions = themePreferences.mode;
    const app = document.getElementById('app');
    if (!app) {
      console.error(`无法获取到#app元素`)
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
}

export const updateThemeColor = (color: string) => {
  document.documentElement.style.setProperty('--app-accent-color', color);
};

export { updateThemeMode }