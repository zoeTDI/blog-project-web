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

/**
 * 偏好设置管理器类
 * 用于管理系统的应用配置、主题、语言等偏好设置，支持持久化缓存与响应式状态
 */
class PreferenceManager {
  // 缓存实例
  private cache: StorageManager;
  // 自定义偏好设置扩展配置
  private customPreferencesExtension: null | PreferencesExtension<any> = null;
  // 自定义偏好设置状态
  private customState: CustomPreferencesRecord;
  // 防抖保存函数
  private debouncedSave: () => void;
  // 初始自定义偏好设置
  private initialCustomPreferences: CustomPreferencesRecord = {};
  // 初始用户偏好设置
  private initialPreferences: Preferences = defaultPreferences;
  // 是否已完成初始化
  private isInitialized: boolean = false;
  // 核心响应式状态
  private state: Preferences;
  
  /**
   * 私有构造函数，防止外部直接通过 new 实例化
   * 初始化缓存控制器、响应式状态以及防抖保存函数
   */
  private constructor() {
    this.cache = new StorageManager();
    this.state = reactive<Preferences>({...defaultPreferences});
    this.debouncedSave = useDebounceFn(this.saveToCache.bind(this), 150)
    this.initialPreferences = defaultPreferences;
  }
  
  /**
   * 异步静态工厂方法，用于创建并初始化 PreferenceManager 实例
   * 它会首先读取本地缓存，并将缓存的偏好应用到初始状态中
   * @returns {Promise<PreferenceManager>} 返回初始化完毕Manager实例
   */
  public static async create(): Promise<PreferenceManager> {
    const instance = new PreferenceManager();
    const cache = await instance.readFromCache();
    instance.updatePreferences(cache)
    return instance;
  }
  
  /**
   * 从本地缓存中读取主偏好设置
   * @returns {Promise<Preferences | Partial<Preferences>>} 缓存中的偏好配置，若无则返回空对象
   */
  private async readFromCache(): Promise<Preferences> {
    const main = await this.cache.getItem<Preferences>(STORAGE_KEYS.MAIN)
    return main == null ? {} : main;
  }
  
  /**
   * 获取当前偏好设置的只读(readonly)响应式状态
   * @returns {Readonly<Preferences>} 只读的偏好设置对象
   */
  public getStats() {
    return readonly<Preferences>(this.state)
  }
  
  /**
   * 更新偏好设置
   * 深度合并新配置到当前状态，触发相应副作用（如动态修改 CSS 变量），并防抖保存到缓存
   * @param {Partial<Preferences>} updates - 需要增量更新的偏好设置对象
   * @returns {void}
   */
  public updatePreferences(updates: Partial<Preferences>) {
    const mergeState = deepMerge({}, markRaw(this.state), updates)
    Object.assign(this.state, mergeState);
    this.handleUpdates(updates);
    this.debouncedSave()
  }
  
  /**
   * 恢复默认偏好设置
   */
  public resetPreferences(): void {
    this.updatePreferences(defaultPreferences)
  }
  
  /**
   * 内部方法：处理偏好设置更新带来的副作用
   * 例如：当检测到主题或字体大小改变时，动态更新页面 CSS 变量
   * @param {Partial<Preferences>} updates - 增量更新的偏好设置对象
   * @returns {void}
   */
  private handleUpdates(updates: Partial<Preferences>) {
    const {theme, app} = updates;
    if (theme && (Object.keys(theme).length > 0 || Reflect.has(theme, 'fontSize'))) {
      updateThemeMode(theme)
    }
    if (app && (Object.keys(app).length > 0 || Reflect.has(app, 'colorWeakMode'))) {
    
    }
  }
  
  /**
   * 内部工具方法：深度克隆一个值
   * 用于隔离对初始配置对象的引用，防止外部意外修改原有默认值
   * @template T
   * @param {T} value - 需要克隆的目标对象或值
   * @returns {T} 克隆后的全新对象或值
   */
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
   * 将当前的最新偏好设置持久化同步到本地缓存中
   * 分别保存主配置、语言配置以及主题模式配置
   * @returns {Promise<void>}
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
  
  /**
   * 获取当前偏好设置的只读状态（功能与 getStats 类似）
   * @returns {Readonly<Preferences>} 只读的偏好设置对象
   */
  getPreferences() {
    return readonly(this.state);
  }
  
  /**
   * 获取用户自定义扩展的偏好设置只读状态
   * @template TCustomPreferences 预留的自定义配置类型断言，默认为 CustomPreferencesRecord
   * @returns {Readonly<TCustomPreferences>} 只读的自定义偏好设置状态
   */
  getCustomPreferences<TCustomPreferences extends object = CustomPreferencesRecord>() {
    return readonly(this.customState) as Readonly<TCustomPreferences>;
  }
  
  /**
   * 获取系统最开始的默认偏好设置（未被用户修改和缓存覆盖的初始值）
   * @returns {Preferences} 默认偏好配置
   */
  getInitialPreferences() {
    return this.initialPreferences;
  }
  
  /**
   * 获取系统最开始的自定义扩展偏好设置的深度克隆副本
   * @template TCustomPreferences 预留的自定义配置类型断言
   * @returns {Readonly<TCustomPreferences>} 深度克隆后的初始自定义配置
   */
  getInitialCustomPreferences<
    TCustomPreferences extends object = CustomPreferencesRecord
  >() {
    return this.cloneValue(this.initialCustomPreferences) as Readonly<TCustomPreferences>;
  }
  
  /**
   * 获取自定义配置的扩展描述定义对象（如 schema 或 元数据定义）的克隆副本
   * @template TCustomPreferences 预留的自定义配置类型断言
   * @returns {Readonly<PreferencesExtension<TCustomPreferences>> | null} 扩展定义对象或空
   */
  getPreferencesExtension<
    TCustomPreferences extends object = CustomPreferencesRecord
  >() {
    return this.customPreferencesExtension
      ? (this.cloneValue(this.customPreferencesExtension) as Readonly<
        PreferencesExtension<TCustomPreferences>
      >)
      : null;
  }
}

let preferenceManager = await PreferenceManager.create()

/**
 * 导出快捷获取只读偏好设置的函数
 */
const getPreferences = () => preferenceManager.getStats()

/**
 * 导出当前偏好的只读引用
 */
const preferences = getPreferences();

export {preferences, preferenceManager}