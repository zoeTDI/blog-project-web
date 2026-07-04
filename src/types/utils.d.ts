/**
 * 自定义类型函数：从常量对象中自动提取所有的 Value 类型
 * T: 传入的常量对象类型
 */
export type ValueOf<T> = T[keyof T];

/**
 * 深度递归可选类型
 * T: 传入的对象类型
 */
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};
