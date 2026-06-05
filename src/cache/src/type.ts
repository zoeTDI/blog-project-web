export interface StorageManagerOptions {
  namespace: string;
  ttl?: number;
}

export type StorageType = 'localStorage' | 'sessionStorage'

export interface LocalStorageDriverOptions {
  storageType: StorageType;
}

export interface IStorageDriver {
  /**
   * 更新指定键的值
   * @param key
   * @param value
   */
  setItem<T>(key: string, value: T): Promise<void>;
  
  /**
   * 获取指定键的值
   * @param key
   */
  getItem<T>(key: string): Promise<T | null>;
  
  /**
   * 移除指定键
   * @param key
   */
  removeItem(key: string): Promise<void>;
  
  /**
   * 清除所有键
   */
  clear(): Promise<void>;
  
  /**
   * 获取所有键的名称
   */
  keys(): Promise<string[]>;
}

/**
 * 缓存数据包裹胶囊接口
 */
export interface IStorageItem<T> {
  /** 实际存储的数据 */
  value: T;
  /** 过期时间戳（毫秒数），null 表示永久存储 */
  expire: number | null;
}