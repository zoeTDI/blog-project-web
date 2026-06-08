export const isObject = (item: unknown): item is Record<string, any> => {
  return (item && typeof item === 'object' && !Array.isArray(item));
}

export const isArray = (item: unknown): item is Array => {
  return Array.isArray(item);
}
