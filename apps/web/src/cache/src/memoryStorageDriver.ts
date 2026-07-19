import type { IStorageDriver } from '@/cache';

class MemoryStorageDriver implements IStorageDriver {
  private storage: Map<string, string>;

  constructor() {
    this.storage = new Map<string, string>();
  }

  /**
   * 存储指定键的值
   * @template T 数据类型
   * @param key 完整的键名
   * @param value 存储的数据
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      // 与 LocalStorage 一样进行序列化，确保数据的深拷贝隔离，避免引用污染
      const serializedValue = JSON.stringify(value);
      this.storage.set(key, serializedValue);
    } catch (error) {
      console.error(
        `[MemoryStorageDriver] Failed to set item [${key}]:`,
        error
      );
      throw error;
    }
  }

  /**
   * 获取指定键的值
   * @template T 期望返回的数据类型
   * @param key 完整的键名
   * @returns 反序列化后的对象，若不存在或解析失败则返回 null
   */
  async getItem<T>(key: string): Promise<T | null> {
    if (!this.storage.has(key)) {
      return null;
    }
    const rawValue = this.storage.get(key);
    if (rawValue === null) {
      return null;
    }
    try {
      return JSON.parse(rawValue as string) as T;
    } catch (error) {
      try {
        // 如果遭遇无法解析的脏数据，直接从内存中抹除
        this.storage.delete(key);
        console.warn(
          `[MemoryStorageDriver] Cleared corrupted data for key [${key}] due to parsing error.`
        );
      } catch (removeError) {
        console.error(
          `[MemoryStorageDriver] Failed to remove corrupted key [${key}]:`,
          removeError
        );
      }
      return null;
    }
  }

  /**
   * 移除指定键的数据
   * @param key 完整的键名
   */
  async removeItem(key: string): Promise<void> {
    this.storage.delete(key);
  }

  /**
   * 清空内存中的所有存储数据
   */
  async clear(): Promise<void> {
    this.storage.clear();
  }

  /**
   * 获取当前内存存储中所有的键名（Keys）
   * @returns 包含所有键名的数组
   */
  async keys(): Promise<string[]> {
    // 将 Map 的 keys 迭代器转换为标准的字符串数组
    return Array.from(this.storage.keys());
  }
}

export { MemoryStorageDriver };
