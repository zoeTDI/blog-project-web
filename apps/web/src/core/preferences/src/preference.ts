import { PreferenceManager } from '@caldm/core';
import { defaultPreferences } from '@/core/preferences/src/config.ts';
import { defaultCustomPreference } from '@/core/preferences/src/curtomConfig.ts';

const preferenceManager = await PreferenceManager.create({
  defaultPreferences: defaultPreferences,
  defaultCustomPreferences: defaultCustomPreference,
});

/**
 * 导出当前用户偏好的只读引用
 */
const preferences = preferenceManager.preferences;

/**
 * 导出当前自定义偏好的只读引用
 */
const customPreferences = preferenceManager.customPreferences;

export { preferences, customPreferences, preferenceManager };
