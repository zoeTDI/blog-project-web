const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

const isArray = (item: any): boolean => {
  return Array.isArray(item);
};

const isDev = (): boolean => import.meta.env.DEV;
const isProd = (): boolean => import.meta.env.PROD;

export { isObject, isArray, isDev, isProd };
