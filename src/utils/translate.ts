import { i18n } from '@/plugins/i18n.ts';
import type { SupportLanguageOption } from '@/core/preferences';

/**
 * 动态解析多语言字段
 * @param fieldObj 后端返回的JSON对象
 * @param fallback 兜底默认文本
 */
const getDynamicText = (
  fieldObj: Record<SupportLanguageOption, string> | string,
  fallback = ''
): string => {
  if (!fieldObj) return fallback;
  if (typeof fieldObj === 'string') return fieldObj;
  const currentLocale = i18n.global.locale as SupportLanguageOption;
  return (
    fieldObj[currentLocale] || fieldObj['en-US'] || Object.values(fieldObj)[0]
  );
};

export { getDynamicText };
