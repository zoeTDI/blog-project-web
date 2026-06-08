import {
  type CustomPreferencesRecord,
  type Preferences,
  type PreferencesExtension
} from "@/core/preferences";
import {updateThemeMode} from '@/core/preferences/src/updateCssVariables.ts'
import {defaultPreferences} from '@/core/preferences/src/config.ts'
import {StorageManager} from "@/cache";
import {useDebounceFn} from "@/hooks/useDebounceFn.ts";
import {markRaw, reactive, readonly} from "vue";
import {deepMerge} from "@/utils/deepFu.ts";
import {isObject} from "@/utils/isFu.ts";

const STORAGE_KEYS = {
  CUSTOM: 'preferences-custom',
  MAIN: 'preferences',
  LOCALE: 'preference-locale',
  THEME: 'preferences-theme',
} as const;

class PreferenceManager {
  // 缓存
  private cache: StorageManager;
  private customPreferencesExtension: null | PreferencesExtension<any> = null;
  private customState: CustomPreferencesRecord;
  private debouncedSave: () => void;
  private initialCustomPreferences: CustomPreferencesRecord = {};
  // 初始用户偏好设置
  private initialPreferences: Preferences = defaultPreferences;
  // 是否初始化
  private isInitialized: boolean = false;
  private state: Preferences;
  
  private constructor() {
    this.cache = new StorageManager();
    this.state = reactive<Preferences>({...defaultPreferences});
    this.debouncedSave = useDebounceFn(this.saveToCache.bind(this), 150)
    this.initialPreferences = defaultPreferences;
  }
  
  public static async create(): Promise<PreferenceManager> {
    const instance = new PreferenceManager();
    const cache = await instance.readFromCache();
    instance.updatePreferences(cache)
    return instance;
  }
  
  /**
   * 读取缓存
   */
  private async readFromCache(): Promise<Preferences> {
    const main = await this.cache.getItem<Preferences>(STORAGE_KEYS.MAIN)
    return main == null ? {} : main;
  }
  
  /**
   * 获取当前偏好设置（readonly）
   */
  public getStats() {
    return readonly<Preferences>(this.state)
  }
  
  /**
   * 更新偏好设置
   * @param updates 要更新的偏好对象
   */
  public updatePreferences(updates: Partial<Preferences>) {
    const mergeState = deepMerge({}, markRaw(this.state), updates)
    Object.assign(this.state, mergeState);
    this.handleUpdates(updates);
    this.debouncedSave()
  }
  
  private handleUpdates(updates: Partial<Preferences>) {
    const {theme, app} = updates;
    if (theme && (Object.keys(theme).length > 0 || Reflect.has(theme, 'fontSize'))) {
      updateThemeMode(theme)
    }
    if (app && (Object.keys(app).length > 0 || Reflect.has(app, 'colorWeakMode'))) {
    
    }
  }
  
  private cloneValue<T>(value: T): T {
    if (Array.isArray(value)) {
      return value.map((item) => this.cloneValue(item)) as T;
    }
    if (isObject(value)) {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(
          ([key, nestedValue]) => [key, this.cloneValue(nestedValue)],
        ),
      ) as T;
    }
    return value;
  }
  
  /**
   * 保存内容到缓存
   */
  async saveToCache() {
    try {
      await this.cache.setItem(STORAGE_KEYS.MAIN, this.state)
      await this.cache.setItem(STORAGE_KEYS.LOCALE, this.state.app.locale)
      await this.cache.setItem(STORAGE_KEYS.THEME, this.state.theme.mode)
    } catch (error) {
      console.error('Failed to save preference to cache: ', error)
    }
  }
  
  getPreferences() {
    return readonly(this.state)
  }
  
  getCustomPreferences<TCustomPreferences extends object = CustomPreferencesRecord>() {
    return readonly(this.customState) as Readonly<TCustomPreferences>;
  }
  
  getInitialPreferences() {
    return this.initialPreferences;
  }
  
  getInitialCustomPreferences<
    TCustomPreferences extends object = CustomPreferencesRecord
  >() {
    return this.cloneValue(this.initialCustomPreferences) as Readonly<TCustomPreferences>;
  }
  
  getPreferencesExtension<
    TCustomPreferences extends object = CustomPreferencesRecord
  >() {
    return this.customPreferencesExtension
      ? (this.cloneValue(this.customPreferencesExtension) as Readonly<
        PreferencesExtension<TCustomPreferences>
      >)
      : null
  }
}

const preferenceManager =await PreferenceManager.create()

const getPreferences = () => preferenceManager.getStats()

const preferences = getPreferences();

export {preferences, preferenceManager}