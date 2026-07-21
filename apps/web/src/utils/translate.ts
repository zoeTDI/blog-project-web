import { getDynamicText as getDynamicTextCore } from '@caldm/utils';
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
  return getDynamicTextCore(
    fieldObj,
    i18n.global.locale as SupportLanguageOption,
    DEFAULT_MESSAGE as SupportLanguageOption,
    fallback
  );
};

export { getDynamicText };
