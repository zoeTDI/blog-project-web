const padDatePart = (value: number): string => value.toString().padStart(2, '0');

export const formatSlugTimestamp = (date: Date): string => {
  return [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
    padDatePart(date.getHours()),
    padDatePart(date.getMinutes()),
    padDatePart(date.getSeconds()),
  ].join('');
};

export const resolvePostSlug = (
  title: string,
  slug: string,
  manuallyModified: boolean,
  now = new Date()
): string => {
  return manuallyModified ? slug : `${title}${formatSlugTimestamp(now)}`;
};
