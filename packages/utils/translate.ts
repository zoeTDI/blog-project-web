export type LanguageKey = string;

export const getDynamicText = <L extends string = string>(
  fieldObj: Record<L, string> | string | null | undefined,
  currentLocale: L,
  defaultLocale?: L,
  fallback = '',
): string => {
  if (!fieldObj) return fallback;
  if (typeof fieldObj === 'string') return fieldObj;

  // 匹配当前语言
  const currentText = fieldObj[currentLocale];
  if (currentText && currentText.trim() !== '') {
    return currentText;
  }

  // 匹配兜底语言
  if (defaultLocale) {
    const defaultText = fieldObj[defaultLocale];
    if (defaultText && defaultText.trim() !== '') {
      return defaultText;
    }
  }
  return fallback;
};