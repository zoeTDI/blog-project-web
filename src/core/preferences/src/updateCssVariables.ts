import {type ThemeModeOptions, type ThemePreferences} from "@/core/preferences";

const updateThemeMode = (themePreferences: ThemePreferences) => {
  if (Object.keys(themePreferences).includes('mode')) {
    const themeModeOption: ThemeModeOptions = themePreferences.mode;
    const app = document.getElementById('app');
    if (app?.classList.contains(themeModeOption)) {
      return;
    }
    app?.classList.add(themeModeOption);
    app.classList.remove(themeModeOption === 'dark' ? 'light' : 'dark');
  }
}

export {updateThemeMode}