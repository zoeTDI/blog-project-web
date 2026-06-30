export const SUPPORT_LANGUAGE_OPTIONS = {
  zh_CN: 'zh-CN',
  en_US: 'en-US',
} as const;

export type SupportLanguageOption =
  (typeof SUPPORT_LANGUAGE_OPTIONS)[keyof typeof SUPPORT_LANGUAGE_OPTIONS];

export type ThemeModeOptions = 'light' | 'dark';

/**
 * 页面切换动画
 */
export type PageTransitionType =
  | 'fade'
  | 'fade-down'
  | 'fade-slide'
  | 'fade-up';

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

export type TimezoneOption =
  (typeof TIMEZONE_OPTIONS)[keyof typeof TIMEZONE_OPTIONS];

export interface AppPreferences {
  /**
   * 默认头像
   */
  defaultAvatar: string;
  /**
   * 默认主页
   */
  defaultHomePath: string;
  /**
   * 支持的语言
   */
  locale: SupportLanguageOption;
  /**
   * 是否开启水印
   */
  watermark: boolean;
  /**
   * 水印文案
   */
  watermarkContent: string;
  /**
   * 网站名称（zh-CN）
   */
  websiteName_zh_CN: string;
  /**
   * 网站名称（en-US）
   */
  websiteName_en_US: string;
  /**
   * 网站副标题（zh-CN）
   */
  websiteSubName_zh_CN: string;
  /**
   * 网站副标题（en-US）
   */
  websiteSubName_en_US: string;
  /**
   * 站长名字
   */
  websiteMaster: string;
  /**
   * 站长的个性签名(zh-CN)
   */
  signature_zh_CN: string;
  /**
   * 站长的个性签名(en-US)
   */
  signature_en_US: string;
  /**
   * 网站时区
   */
  timezone: TimezoneOption;
}

export type BreadcrumbStyleType = 'normal' | 'background';

export interface BreadcrumbPreferences {
  /**
   * 是否启用面包屑导航
   */
  enable: boolean;
  /**
   * 面包屑只有一个时是否隐藏
   */
  hideOnlyOne: boolean;
  /**
   * 面包屑首页图标是否可见
   */
  showHome: boolean;
  /**
   * 面包屑图标是否可见
   */
  showIcon: boolean;
  /**
   * 面包屑风格
   */
  styleType: BreadcrumbStyleType;
}

export interface CopyrightPreferences {
  /**
   * ICP备案号
   */
  icpRecordNumber: string;
  /**
   * ICP备案号链接
   */
  icpRecordNumberLink: string;
  /**
   * 公安备案号
   */
  gonganRecordNumber: string;
  /**
   * 公安备案号链接
   */
  gonganRecordNumberLink: string;
  /**
   * 网站所有者姓名，适用于个人网站
   */
  owner: string;
  /**
   * 网站的公司名称，适用于非个人网站
   */
  companyName: string;
  /**
   * 版权日期
   */
  date: string;
  /**
   * 权利声明
   */
  rightsText: string;
  /**
   * 备案警示文字
   */
  beianExtra: string;
  /**
   * 隐私政策链接
   */
  privacyPolicyLink: string;
  /**
   * 服务条款链接
   */
  termsLink: string;
}

export interface HeaderPreferences {
  /**
   * 是否启用顶栏
   */
  enable: boolean;
  /**
   * 顶栏是否固定
   */
  fixed: boolean;
  /**
   * 顶栏高度
   */
  height: number;
}

export interface FooterPreferences {
  /**
   * 是否启用底栏
   */
  enable: boolean;
  /**
   * 底栏是否固定
   */
  fixed: boolean;
  /**
   * 底栏高度
   */
  height: number;
}

export interface LogoPreferences {
  /**
   * logo是否可见
   */
  enable: boolean;
  /**
   * logo适应方式
   */
  fit: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  /**
   * logo地址
   */
  source: string;
  /**
   * 暗色模式下logo地址（可选）
   */
  sourceDark?: string;
}

export interface NavigationPreferences {}

export interface ThemePreferences {
  /**
   * 主题类型
   */
  mode: ThemeModeOptions;
  /**
   * 主题色
   */
  colorPrimary: string;
}

export interface TransitionPreferences {
  /**
   * 页面切换动画是否启用
   */
  enable: boolean;
  /**
   * 是否开启页面加载loading
   */
  loading: boolean;
  /**
   * 页面切换动画
   */
  name: PageTransitionType | string;
  /**
   * 是否开启页面加载进度动画
   */
  progress: boolean;
}

export interface WidgetPreferences {
  /**
   * 是否显示主题切换组件
   */
  themeToggle: boolean;
  /**
   * 是否显示语言切换组件
   */
  languageToggle: boolean;
  /**
   * 是否显示时区切换组件
   */
  timezoneToggle: boolean;
}

export interface Preferences {
  /**
   * 全局配置
   */
  app: AppPreferences;
  /**
   * 面包屑配置
   */
  breadcrumb: BreadcrumbPreferences;
  /**
   * 版权配置
   */
  copyright: CopyrightPreferences;
  /**
   * 顶栏配置
   */
  header: HeaderPreferences;
  /**
   * 底栏配置
   */
  footer: FooterPreferences;
  /**
   * logo配置
   */
  logo: LogoPreferences;
  /**
   * 导航配置
   */
  navigation: NavigationPreferences;
  /**
   * 主题配置
   */
  theme: ThemePreferences;
  /**
   * 动画配置
   */
  transition: TransitionPreferences;
  /**
   * 功能配置
   */
  widgetPreferences: WidgetPreferences;
}

interface BaseCustomPreferencesField<
  TKey extends string = string,
  TValue extends CustomPreferencesValue = CustomPreferencesValue,
> {
  componentProps?: Record<string, any>;
  defaultValue: TValue;
  disabled?: boolean;
  key: TKey;
  label: string;
  placeholder?: string;
  tip?: string;
}

interface CustomPreferencesInputField<
  TKey extends string = string,
> extends BaseCustomPreferencesField<TKey, string> {
  component: 'input';
}

interface CustomPreferencesNumberField<
  TKey extends string = string,
> extends BaseCustomPreferencesField<TKey, number> {
  component: 'number';
}

interface CustomPreferencesOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

interface CustomPreferencesSelectField<
  TKey extends string = string,
> extends BaseCustomPreferencesField<TKey, string> {
  component: 'select';
  options: CustomPreferencesOption[];
}

interface CustomPreferencesSwitchField<
  TKey extends string = string,
> extends BaseCustomPreferencesField<TKey, boolean> {
  component: 'switch';
}

type AnyCustomPreferencesField =
  | CustomPreferencesInputField
  | CustomPreferencesNumberField
  | CustomPreferencesSelectField
  | CustomPreferencesSwitchField;

type CustomPreferencesField<
  TCustomPreferences extends object = CustomPreferencesRecord,
> =
  string extends Extract<keyof TCustomPreferences, string>
    ? AnyCustomPreferencesField
    : {
        [K in Extract<
          keyof TCustomPreferences,
          string
        >]: TCustomPreferences[K] extends boolean
          ? CustomPreferencesSwitchField<K>
          : TCustomPreferences[K] extends number
            ? CustomPreferencesNumberField<K>
            : TCustomPreferences[K] extends string
              ? CustomPreferencesInputField<K> | CustomPreferencesSelectField<K>
              : never;
      }[Extract<keyof TCustomPreferences, string>];

export interface PreferencesExtension<
  TCustomPreference extends object = CustomPreferencesRecord,
> {
  fields: Array<CustomPreferencesField<TCustomPreference>>;
  tabLabel: string;
  title?: string;
}

type CustomPreferencesValue = boolean | number | string;

export type CustomPreferencesRecord = Record<string, CustomPreferencesValue>;
