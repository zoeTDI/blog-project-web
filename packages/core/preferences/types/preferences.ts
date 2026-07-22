import type {
  PageTransitionType,
  SupportLanguageOption,
  ThemeModeOptions,
  TimezoneOption,
} from './base';

export interface AppPreferences {
  defaultAvatar: string;
  defaultHomePath: string;
  locale: SupportLanguageOption;
  watermark: boolean;
  watermarkContent: string;
  websiteName_zh_CN: string;
  websiteName_en_US: string;
  websiteSubName_zh_CN: string;
  websiteSubName_en_US: string;
  websiteMaster: string;
  signature_zh_CN: string;
  signature_en_US: string;
  timezone: TimezoneOption;
}

export type BreadcrumbStyleType = 'normal' | 'background';

export interface BreadcrumbPreferences {
  enable: boolean;
  hideOnlyOne: boolean;
  showHome: boolean;
  showIcon: boolean;
  styleType: BreadcrumbStyleType;
}

export interface CopyrightPreferences {
  icpRecordNumber: string;
  icpRecordNumberLink: string;
  gonganRecordNumber: string;
  gonganRecordNumberLink: string;
  owner: string;
  companyName: string;
  date: string;
  rightsText: string;
  beianExtra: string;
  privacyPolicyLink: string;
  termsLink: string;
}

export interface HeaderPreferences {
  enable: boolean;
  fixed: boolean;
  height: number;
}

export interface FooterPreferences {
  enable: boolean;
  fixed: boolean;
  height: number;
}

export interface LogoPreferences {
  enable: boolean;
  fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  source: string;
  sourceDark?: string;
}

export interface NavigationPreferences {}

export interface ThemePreferences {
  mode: ThemeModeOptions;
  colorPrimary: string;
}

export interface TransitionPreferences {
  enable: boolean;
  loading: boolean;
  name: PageTransitionType | string;
  progress: boolean;
}

export interface WidgetPreferences {
  themeToggle: boolean;
  languageToggle: boolean;
  timezoneToggle: boolean;
}

/**
 * 根偏好设置汇总接口
 */
export interface Preferences {
  app: AppPreferences;
  breadcrumb: BreadcrumbPreferences;
  copyright: CopyrightPreferences;
  header: HeaderPreferences;
  footer: FooterPreferences;
  logo: LogoPreferences;
  navigation: NavigationPreferences;
  theme: ThemePreferences;
  transition: TransitionPreferences;
  widgetPreferences: WidgetPreferences;
}