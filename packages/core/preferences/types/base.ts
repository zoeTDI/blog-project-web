import type { ValueOf } from '@caldm/utils';

/**
 * 支持的语言选项
 */
export const SUPPORT_LANGUAGE_OPTIONS = {
  zh_CN: 'zh-CN',
  en_US: 'en-US',
} as const;

export type SupportLanguageOption = ValueOf<typeof SUPPORT_LANGUAGE_OPTIONS>;

/**
 * 主题模式
 */
export type ThemeModeOptions = 'light' | 'dark';

/**
 * 页面切换动画类型
 */
export type PageTransitionType =
  | 'fade'
  | 'fade-down'
  | 'fade-slide'
  | 'fade-up';

/**
 * 时区选项
 */
export const TIMEZONE_OPTIONS = {
  UTC: 'UTC',
  America_New_York: 'America/New_York',
  America_Los_Angeles: 'America/Los_Angeles',
  America_Chicago: 'America/Chicago',
  America_Denver: 'America/Denver',
  Europe_London: 'Europe/London',
  Europe_Paris: 'Europe/Paris',
  Europe_Berlin: 'Europe/Berlin',
  Asia_Shanghai: 'Asia/Shanghai',
  Asia_Tokyo: 'Asia/Tokyo',
  Asia_Singapore: 'Asia/Singapore',
  Australia_Sydney: 'Australia/Sydney',
  Australia_Perth: 'Australia/Perth',
  Pacific_Auckland: 'Pacific/Auckland',
} as const;

export type TimezoneOption = ValueOf<typeof TIMEZONE_OPTIONS>;