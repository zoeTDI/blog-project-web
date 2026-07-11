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

const isString = (val: any): val is string => typeof val === 'string';
const isUndefined = (val: any): val is undefined => val === undefined;
const isBoolean = (val: any): val is boolean => typeof val === 'boolean';
const isNumber = (val: any): val is number => typeof val === 'number';

const isEmpty = (val: unknown) =>
  (!val && val !== 0) ||
  (isArray(val) && (val as any[]).length === 0) ||
  (isObject(val) && !Object.keys(val).length);

const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false;
  return e instanceof Element;
};

const isStringNumber = (val: string): boolean => {
  if (!isString(val)) {
    return false;
  }
  return !Number.isNaN(Number(val));
};

const isWindow = (val: unknown): val is Window => val === window;

export {
  isObject,
  isArray,
  isDev,
  isProd,
  isSameDay,
  isString,
  isUndefined,
  isBoolean,
  isNumber,
  isEmpty,
  isElement,
  isStringNumber,
  isWindow,
};
