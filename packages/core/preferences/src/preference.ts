import type { CustomPreferencesRecord, Preferences } from '../types';
import { updateThemeColor, updateThemeMode } from './updateCssVariables.ts';
import { StorageManager } from '@caldm/cache';
import { useDebounceFn } from '@caldm/hook';
import { type DeepReadonly, reactive, readonly, type UnwrapNestedRefs } from 'vue';
import { deepMerge } from '@caldm/utils';
import type { DeepPartial } from '@caldm/utils';

const STORAGE_KEYS = {
  CUSTOM: 'custom',
  MAIN: 'main',
  LOCALE: 'locale',
  THEME: 'theme',
} as const;

export interface PreferenceManagerOptions<
  TCustom extends CustomPreferencesRecord = CustomPreferencesRecord
> {
  /** 基础默认配置 (必需) */
  defaultPreferences: Preferences;
  /** 扩展个性化默认配置 (可选) */
  defaultCustomPreferences?: TCustom;
  /** 缓存 StorageManager 实例 (可选，如果不传则自动实例化默认 StorageManager) */
  cacheManager?: StorageManager;
}

/**
 * 偏好设置管理器类
 * 用于管理系统的应用配置、主题、语言等偏好设置，支持持久化缓存与响应式状态
 */
export class PreferenceManager<
  TCustom extends CustomPreferencesRecord = CustomPreferencesRecord
> {
  // 缓存实例
  private cache: StorageManager;
  // 防抖保存函数
  private readonly debouncedSave: () => void;

  private readonly initialPreferences: Preferences;
  private readonly initialCustomPreferences: TCustom;

  // 核心响应式状态
  private readonly state: Preferences;
  // 自定义偏好设置状态
  private readonly customState: CustomPreferencesRecord;

  /**
   * 私有构造函数，防止外部直接通过 new 实例化
   * 初始化缓存控制器、响应式状态以及防抖保存函数
   */
  private constructor(
    options: PreferenceManagerOptions<TCustom>,
    cachedMain: DeepPartial<Preferences> | null,
    cachedCustom: DeepPartial<TCustom> | null,
  ) {
    this.initialPreferences = options.defaultPreferences;
    this.initialCustomPreferences = (options.defaultCustomPreferences || {}) as TCustom;
    this.cache = options.cacheManager || new StorageManager({ namespace: 'preferences' });

    const mergedMain = deepMerge(
      {},
      this.initialPreferences,
      cachedMain || {},
    ) as Preferences;

    const mergedCustom = deepMerge(
      {},
      this.initialCustomPreferences,
      cachedCustom || {},
    ) as TCustom;

    this.state = reactive(mergedMain) as Preferences;
    this.customState = reactive(mergedCustom) as TCustom;

    this.applyAllStyles();
    this.updateDocumentTitle();
    this.debouncedSave = useDebounceFn(this.saveToCache.bind(this), 500);
  }

  /**
   * 异步静态工厂方法，用于创建并初始化 PreferenceManager 实例
   * 它会首先读取本地缓存，并将缓存的偏好应用到初始状态中
   * @returns {Promise<PreferenceManager>} 返回初始化完毕Manager实例
   */
  public static async create<
    TCustom extends CustomPreferencesRecord = CustomPreferencesRecord
  >(
    options: PreferenceManagerOptions<TCustom>,
  ): Promise<PreferenceManager<TCustom>> {
    const cache = options.cacheManager || new StorageManager({ namespace: 'preferences' });
    let cachedMain: DeepPartial<Preferences> | null = null;
    let cachedCustom: DeepPartial<TCustom> | null = null;

    try {
      cachedMain = await cache.getItem<DeepPartial<Preferences>>(STORAGE_KEYS.MAIN);
      cachedCustom = await cache.getItem<DeepPartial<TCustom>>(STORAGE_KEYS.CUSTOM);
    } catch (e) {
      console.warn('Failed to load preferences from storage cache:', e);
    }

    return new PreferenceManager<TCustom>(options, cachedMain, cachedCustom);
  }

  /**
   * 获取只读的主配置状态
   */
  get preferences(): Readonly<Preferences> {
    return readonly(this.state);
  }

  /**
   * 获取只读的个性化配置状态
   */
  get customPreferences(): DeepReadonly<UnwrapNestedRefs<CustomPreferencesRecord>> {
    return readonly(this.customState);
  }

  /**
   * 更新主偏好配置
   */
  public updatePreferences(partialState: DeepPartial<Preferences>) {
    deepMerge(this.state, partialState);
    this.applyAllStyles();
    this.updateDocumentTitle();
    this.debouncedSave();
  }

  /**
   * 更新扩展个性化配置
   */
  public updateCustomPreferences(partialCustomState: DeepPartial<TCustom>) {
    deepMerge(this.customState, partialCustomState);
    this.debouncedSave();
  }

  /**
   * 仅重置主偏好配置为默认值
   */
  public async resetMainPreferences() {
    // 深度克隆初始默认值，先清空响应式对象属性再合并，确保无旧属性残存
    const defaultMain = deepMerge({}, this.initialPreferences);
    Object.keys(this.state).forEach((key) => {
      delete (this.state as Record<string, any>)[key];
    });
    Object.assign(this.state, defaultMain);

    this.applyAllStyles();
    this.updateDocumentTitle();
    await this.saveToCache();
  }

  /**
   * 仅重置自定义偏好配置为默认值
   */
  public async resetCustomPreferences() {
    const defaultCustom = deepMerge({}, this.initialCustomPreferences);
    Object.keys(this.customState).forEach((key) => {
      delete (this.customState as Record<string, any>)[key];
    });
    Object.assign(this.customState, defaultCustom);

    await this.saveToCache();
  }

  /**
   * 重置偏好配置为默认值（包括扩展偏好配置）
   */
  public async resetPreferences() {
    await Promise.all([
      this.resetMainPreferences(),
      this.resetCustomPreferences(),
    ]);
  }

  private updateDocumentTitle() {
    if (typeof document === 'undefined') return;
    const websiteName =
      this.state.app.locale === 'zh-CN'
        ? this.state.app.websiteName_zh_CN
        : this.state.app.websiteName_en_US;

    if (websiteName && websiteName.trim() !== '') {
      const curWebsiteName = document.title;
      const a = curWebsiteName.split(' - ');
      if (a.length > 1) {
        a[0] = websiteName;
        document.title = a.join(' - ');
      }
    }
  }

  /**
   * 应用CSS样式
   */
  private applyAllStyles() {
    if (typeof document === 'undefined') return;
    updateThemeMode(this.state.theme);
    updateThemeColor(this.state.theme.colorPrimary);
  }

  /**
   * 持久化到缓存
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
