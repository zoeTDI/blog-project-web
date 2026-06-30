const isObject = (item: any): boolean => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

const isArray = (item: any): boolean => {
  return Array.isArray(item);
};

const isSameDay = (d1: Date, d2: Date) => {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
};

const isDev = (): boolean => import.meta.env.DEV;
const isProd = (): boolean => import.meta.env.PROD;

export { isObject, isArray, isDev, isProd, isSameDay };
