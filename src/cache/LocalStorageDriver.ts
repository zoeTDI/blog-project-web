import type {IStorageDriver} from "@/cache/type.ts";

type storageType = 'localStorage' | 'sessionStorage'

interface LocalStorageDriverOptions {
  storageType: storageType;
}

class LocalStorageDriver implements IStorageDriver {
  storage: Storage
  
  /**
   * 构造函数
   * @param options 驱动配置项，默认使用 localStorage
   */
  constructor(options: LocalStorageDriverOptions = {storageType: 'localStorage'}) {
    if (options.storageType === 'localStorage') {
      this.storage = window.localStorage;
    } else if (options.storageType === 'sessionStorage') {
      this.storage = window.sessionStorage;
    } else {
      throw new Error(`[LocalStorageDriver]: Unsupported driver type "${options.storageType}"`);
    }
  }
  
  /**
   * 存储指定键的值（自动将对象序列化为 JSON 字符串）
   * @template T 数据类型
   * @param key 完整的键名
   * @param value 存储的数据（在 StorageManager 中为 IStorageItem 胶囊对象）
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const serializedValue = JSON.stringify(value);
      this.storage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`[LocalStorageDriver] Failed to set item [${key}]:`, error);
      throw error;
    }
  }
  
  /**
   * 获取指定键的值（自动进行 JSON 反序列化）
   * @template T 期望返回的数据类型
   * @param key 完整的键名
   * @returns 反序列化后的对象，若不存在或解析失败则返回 null
   */
  async getItem<T>(key: string): Promise<T | null> {
    const rawValue = this.storage.getItem(key);
    if (rawValue === null) {
      return null;
    }
    try {
      return JSON.parse(rawValue);
    } catch (error) {
      try {
        this.storage.removeItem(key);
        // 可以在开发环境打印一行警告（生产环境可以选择不打印或换成上报日志）
        console.warn(`[LocalStorageDriver] Cleared corrupted data for key [${key}] due to parsing error.`);
      } catch (removeError) {
        // 防止极其罕见的移除失败（如 storage 处于锁死状态）导致整个应用崩溃
        console.error(`[LocalStorageDriver] Failed to remove corrupted key [${key}]:`, removeError);
      }
      return null;
    }
  }
  
  /**
   * 移除指定键的数据
   * @param key 完整的键名
   */
  async removeItem(key: string): Promise<void> {
    this.storage.removeItem(key)
  }
  
  /**
   * 清空当前驱动下的所有存储数据
   * 警告：该操作会清空当前域（Origin）下的所有数据，在多模块共用同一个域时需谨慎
   */
  async clear(): Promise<void> {
    this.storage.clear()
  }
  
  /**
   * 获取当前存储中所有的键名（Keys）
   * @returns 包含所有键名的数组
   */
  async keys(): Promise<string[]> {
    const keyList: string[] = [];
    const length = this.storage.length;
    for (let i = 0; i < length; i++) {
      const key = this.storage.key(i);
      if (key !== null) {
        keyList.push(key);
      }
    }
    return keyList;
  }
}

export {LocalStorageDriver}
export type {LocalStorageDriverOptions, storageType}