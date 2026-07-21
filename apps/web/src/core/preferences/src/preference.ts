import {
  type CustomPreferencesRecord,
  type Preferences,
} from '@/core/preferences';
import {
  updateThemeColor,
  updateThemeMode,
} from '@/core/preferences/src/updateCssVariables.ts';
import { defaultPreferences } from '@/core/preferences/src/config.ts';
import { defaultCustomPreference } from '@/core/preferences/src/curtomConfig.ts';
import { StorageManager } from '@/cache';
import {useDebounceFn} from '@caldm/hook';
import { markRaw, reactive, readonly } from 'vue';
import { deepMerge } from '@caldm/utils';

import type { DeepPartial } from '#/utils';

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
  // 防抖保存函数
  private readonly debouncedSave: () => void;
  // 初始自定义偏好设置
  private readonly initialCustomPreferences: CustomPreferencesRecord =
    defaultCustomPreference;
  // 初始用户偏好设置
  private readonly initialPreferences: Preferences = defaultPreferences;
  // 核心响应式状态
  private state: Preferences;
  // 自定义偏好设置状态
  private customState: CustomPreferencesRecord;

  /**
   * 私有构造函数，防止外部直接通过 new 实例化
   * 初始化缓存控制器、响应式状态以及防抖保存函数
   */
  private constructor() {
    // todo 后续可改成根据用户信息创建相应的存储空间
    this.cache = new StorageManager({ namespace: 'caldm' });
    this.initialPreferences = defaultPreferences;
    this.state = reactive<Preferences>({ ...this.initialPreferences });
    this.initialCustomPreferences = defaultCustomPreference;
    this.customState = reactive<CustomPreferencesRecord>({
      ...this.initialCustomPreferences,
    });
    this.debouncedSave = useDebounceFn(this.saveToCache.bind(this), 150);
  }

  /**
   * 异步静态工厂方法，用于创建并初始化 PreferenceManager 实例
   * 它会首先读取本地缓存，并将缓存的偏好应用到初始状态中
   * @returns {Promise<PreferenceManager>} 返回初始化完毕Manager实例
   */
  public static async create(): Promise<PreferenceManager> {
    const instance = new PreferenceManager();
    const cache = await instance.readFromCache();
    const customCache = await instance.readCustomFromCache();
    instance.updatePreferences(cache);
    instance.updateCustomPreferences(customCache);
    instance.applyAllStyles();
    return instance;
  }

  // 用户偏好设置 _____________________________________________

  /**
   * 获取当前偏好设置的只读(readonly)响应式状态
   * @returns {Readonly<Preferences>} 只读的偏好设置对象
   */
  public getStats() {
    return readonly<Preferences>(this.state);
  }

  /**
   * 更新偏好设置
   * 深度合并新配置到当前状态，触发相应副作用（如动态修改 CSS 变量），并防抖保存到缓存
   * @param {DeepPartial<Preferences>} updates - 需要增量更新的偏好设置对象
   * @returns {void}
   */
  public updatePreferences(updates: DeepPartial<Preferences>): void {
    const mergeState = deepMerge({}, markRaw(this.state), updates);
    Object.assign(this.state, mergeState);
    this.update(updates);
    this.debouncedSave();
  }

  /**
   * 从本地缓存中读取主偏好设置
   * @returns {Promise<Preferences | Partial<Preferences>>} 缓存中的偏好配置，若无则返回空对象
   */
  private async readFromCache(): Promise<DeepPartial<Preferences>> {
    const main = await this.cache.getItem<Preferences>(STORAGE_KEYS.MAIN);
    return main == null ? {} : main;
  }

  /**
   * 恢复默认偏好设置
   */
  public resetPreferences(): void {
    this.updatePreferences(defaultPreferences);
  }

  /**
   * 获取默认用户扩展偏好设置的只读数据
   */
  public getInitialPreferences() {
    return readonly<Preferences>(this.initialPreferences);
  }

  // 自定义偏好设置 _____________________________________________

  /**
   * 获取当前自定义偏好设置的只读（readonly）响应式状态
   */
  public getCustomState() {
    return readonly<CustomPreferencesRecord>(this.customState);
  }

  /**
   * 更新自定义偏好设置
   * @param updates
   */
  public updateCustomPreferences(
    updates: DeepPartial<CustomPreferencesRecord>
  ) {
    const mergeState = deepMerge({}, markRaw(this.customState), updates);
    Object.assign(this.customState, mergeState);
    this.debouncedSave();
  }

  /**
   * 从本地缓存中读取自定义偏好设置
   * @private
   */
  private async readCustomFromCache(): Promise<
    DeepPartial<CustomPreferencesRecord>
  > {
    const customMain = await this.cache.getItem<CustomPreferencesRecord>(
      STORAGE_KEYS.CUSTOM
    );
    return customMain == null ? {} : customMain;
  }

  /**
   * 恢复自定义偏好设置
   */
  public resetCustomPreferences(): void {
    this.updateCustomPreferences(defaultCustomPreference);
  }

  /**
   * 获取默认自定义扩展偏好设置的只读数据
   */
  public getInitialCustomPreferences() {
    return readonly<CustomPreferencesRecord>(this.initialCustomPreferences);
  }

  // 公共内部方法 _____________________________________________

  /**
   * 内部方法：处理偏好设置更新带来的副作用
   * 例如：当检测到主题或字体大小改变时，动态更新页面 CSS 变量
   * @param {DeepPartial<Preferences>} updates - 增量更新的偏好设置对象
   * @returns {void}
   */
  private update(updates: DeepPartial<Preferences>): void {
    const { theme, app } = updates;
    if (theme) {
      if (theme.mode) {
        updateThemeMode(theme);
      }
      if (theme.colorPrimary) {
        updateThemeColor(theme.colorPrimary);
      }
    }
    if (app || updates.app?.locale) {
      const currentLocale = this.state.app.locale;
      const websiteName =
        currentLocale === 'zh-CN'
          ? this.state.app.websiteName_zh_CN
          : this.state.app.websiteName_en_US;

      if (websiteName && websiteName.trim() !== '') {
        const curWebsiteName = document.title;
        let a = curWebsiteName.split(' - ');
        if (a.length > 1) {
          a[0] = websiteName;
          document.title = a.join(' - ');
        }
        // 如果长度小于2，说明当前页面不需要使用网站名称作为前缀
      }
    }
  }

  /**
   * 应用CSS样式
   */
  private applyAllStyles() {
    updateThemeMode(this.state.theme);
    updateThemeColor(this.state.theme.colorPrimary);
  }

  /**
   * 将当前的最新偏好设置持久化同步到本地缓存中
   * 分别保存主配置、语言配置以及主题模式配置
   * @returns {Promise<void>}
   */
  async saveToCache(): Promise<void> {
    try {
      await this.cache.setItem(STORAGE_KEYS.MAIN, this.state);
      await this.cache.setItem(STORAGE_KEYS.LOCALE, this.state.app.locale);
      await this.cache.setItem(STORAGE_KEYS.THEME, this.state.theme.mode);
      await this.cache.setItem(STORAGE_KEYS.CUSTOM, this.customState);
    } catch (error) {
      console.error('Failed to save preference to cache: ', error);
    }
  }
}

let preferenceManager = await PreferenceManager.create();

/**
 * 导出快捷获取只读用户偏好设置的函数
 */
const getPreferences = () => preferenceManager.getStats();

/**
 * 导出快捷获取只读自定义偏好设置的函数
 */
const getCustomPreferences = () => preferenceManager.getCustomState();

/**
 * 导出当前用户偏好的只读引用
 */
const preferences = getPreferences();

/**
 * 导出当前自定义偏好的只读引用
 */
const customPreferences = getCustomPreferences();

export { preferences, customPreferences, preferenceManager };
