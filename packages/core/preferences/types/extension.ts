export type CustomPreferencesValue = boolean | number | string;
export type CustomPreferencesRecord = Record<string, CustomPreferencesValue>;

// 基础控件定义
export interface BaseCustomPreferencesField<
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

export interface CustomPreferencesInputField<TKey extends string = string>
  extends BaseCustomPreferencesField<TKey, string> {
  component: 'input';
}

export interface CustomPreferencesNumberField<TKey extends string = string>
  extends BaseCustomPreferencesField<TKey, number> {
  component: 'number';
}

export interface CustomPreferencesOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

export interface CustomPreferencesSelectField<TKey extends string = string>
  extends BaseCustomPreferencesField<TKey, string> {
  component: 'select';
  options: CustomPreferencesOption[];
}

export interface CustomPreferencesSwitchField<TKey extends string = string>
  extends BaseCustomPreferencesField<TKey, boolean> {
  component: 'switch';
}

/**
 * 所有可用组件的并集，用于通用渲染逻辑
 */
export type AnyCustomPreferencesField =
  | CustomPreferencesInputField
  | CustomPreferencesNumberField
  | CustomPreferencesSelectField
  | CustomPreferencesSwitchField;

/**
 * 自动化类型映射逻辑 (元编程)
 */
export type MapField<K extends string, V> = V extends boolean
  ? CustomPreferencesSwitchField<K>
  : V extends number
    ? CustomPreferencesNumberField<K>
    : V extends string
      ? CustomPreferencesInputField<K> | CustomPreferencesSelectField<K>
      : never;

export type CustomPreferencesField<TCustomPreferences extends object> = {
  [K in keyof TCustomPreferences & string]: MapField<K, TCustomPreferences[K]>;
}[keyof TCustomPreferences & string];

/**
 * 扩展偏好设置业务契约
 */
export interface PreferencesExtension<
  TCustomPreference extends object = CustomPreferencesRecord,
> {
  fields: Array<CustomPreferencesField<TCustomPreference>>;
  tabLabel: string;
  title?: string;
}