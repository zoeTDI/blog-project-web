import { DEFAULT_MESSAGE, i18n } from '@/plugins/i18n.ts';
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

  const currentText = fieldObj[currentLocale];

  if (currentText && currentText.trim() !== '') {
    return currentText;
  }

  const defaultText = fieldObj[DEFAULT_MESSAGE];
  if (defaultText && defaultText !== '') {
    return defaultText;
  }

  return fallback;
};

export { getDynamicText };
