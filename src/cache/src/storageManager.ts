import {
  type IStorageDriver,
  type IStorageItem,
  LocalStorageDriver,
  MemoryStorageDriver,
  type StorageManagerOptions
} from "@/cache";


/**
 * 统一存储管理器
 * 支持命名空间隔离、TTL过期机制、自动降级内存存储
 */
class StorageManager {
  /** 底层存储驱动实例 */
  private driver: IStorageDriver;
  /** 命名空间前缀 */
  private readonly prefix: string;
  /** 统一设置的过期时间（毫秒），null 表示永久存储 */
  private readonly ttl: number | null;
  
  /**
   * 构造函数
   * @param options 配置项
   * @param options.namespace 命名空间，用于隔离不同的业务缓存，防止键名冲突
   * @param options.ttl 默认过期时间（毫秒），不传或传 undefined 则默认永久存储
   */
  constructor(options: StorageManagerOptions = {}) {
    if (!options.namespace || options.namespace === '') {
      console.warn('存储管理没有设置命名空间，改动将会影响所有存储中心。');
    }
    this.driver = this.createDefaultStorage();
    this.prefix = options?.namespace || '';
    this.ttl = options.ttl ?? null;
  }
  
  /**
   * 存储指定键的值，并自动注入过期时间
   * @template T 存储的数据类型
   * @param key 键名（不需要带前缀，内部会自动拼接）
   * @param value 存储的数据（支持任意可序列化类型）
   * @returns 异步操作的 Promise 凭证
   */
  async setItem<T>(key: string, value: T): Promise<void> {
    const fullKey = this.getFullKey(key);
    // 💡 修正：由 this.ttl 替换之前笔误的 this.expire
    const expire = this.ttl !== null ? Date.now() + this.ttl : null;
    const storageItem: IStorageItem<T> = {
      value,
      expire,
    };
    await this.driver.setItem<IStorageItem<T>>(fullKey, storageItem);
  }
  
  /**
   * 获取指定键的值，并包含「惰性删除」的过期校验
   * @template T 期望返回的数据类型
   * @param key 键名（不需要带前缀）
   * @returns 返回存储的原始数据，若不存在或已过期则返回 null
   */
  async getItem<T>(key: string): Promise<T | null> {
    const fullKey = this.getFullKey(key);
    const cachedItem = await this.driver.getItem<IStorageItem<T>>(fullKey);
    
    // 缓存不存在
    if (!cachedItem) {
      return null;
    }
    
    // 校验是否过期，若过期则触发「惰性删除」机制
    if (cachedItem.expire !== null && Date.now() > cachedItem.expire) {
      await this.removeItem(key);
      return null;
    }
    
    return cachedItem.value;
  }
  
  /**
   * 移除指定键及其对应的数据
   * @param key 键名（不需要带前缀）
   * @returns 异步操作的 Promise 凭证
   */
  async removeItem(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);
    await this.driver.removeItem(fullKey);
  }
  
  /**
   * 清除当前命名空间下的所有缓存数据（不影响其他命名空间）
   * @returns 异步操作的 Promise 凭证
   */
  async clear(): Promise<void> {
    const keys = (await this.driver.keys()).filter((key: string) => key.startsWith(this.prefix));
    await Promise.all(keys.map(async (key: string) => {
      await this.driver.removeItem(key);
    }));
  }
  
  /**
   * 主动扫描并清理当前命名空间下所有已经过期的数据
   * @returns 异步操作的 Promise 凭证
   */
  async clearExpired(): Promise<void> {
    const allKeys = await this.driver.keys();
    const currentNamespaceKeys = allKeys.filter((key: string) => key.startsWith(this.prefix));
    
    await Promise.all(
      currentNamespaceKeys.map(async (fullKey: string) => {
        try {
          const cachedItem = await this.driver.getItem<IStorageItem<unknown>>(fullKey);
          if (cachedItem && cachedItem.expire !== null && Date.now() > cachedItem.expire) {
            await this.driver.removeItem(fullKey); // 💡 之前代码里的 removeItem 没带前缀会漏删，这里改用底层 driver 物理删除
          }
        } catch (e) {
          // 💡 修正：把之前笔误的 error 改为 e
          console.error(`Failed to clear expired key [${fullKey}]:`, e);
        }
      })
    );
  }
  
  /**
   * 获取当前命名空间下的所有键名列表
   * @returns 返回过滤并剥离了命名空间前缀后的纯净键名数组
   */
  async keys(): Promise<string[]> {
    const allKeys = await this.driver.keys();
    return allKeys
      .filter((key: string) => key.startsWith(this.prefix))
      .map((key: string) => key.slice(this.prefix.length + 1));
  }
  
  /**
   * 根据当前运行环境创建默认的存储驱动
   * 优先使用 LocalStorage，若在 SSR 阶段或无 window 环境则降级为内存存储驱动
   * @returns 实现了 IStorageDriver 接口的驱动实例
   */
  createDefaultStorage(): IStorageDriver {
    if (typeof window !== 'undefined' && window.localStorage) {
      return new LocalStorageDriver();
    } else {
      return new MemoryStorageDriver();
    }
  }
  
  /**
   * 拼接命名空间前缀，获取底层驱动所需的完整键名
   * @param key 原始键名
   * @returns 拼接后的完整键名（例如: namespace-key）
   */
  private getFullKey(key: string): string {
    return (this.prefix && this.prefix !== '') ? `${this.prefix}-${key}` : key;
  }
}

export {StorageManager};
