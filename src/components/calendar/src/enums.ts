const TODO_COLORS = [
  { name: 'Red', value: '#EF444433' }, // 红色系
  { name: 'Orange', value: '#F9731633' }, // 橙色系
  { name: 'Amber', value: '#F59E0B33' }, // 琥珀色系
  { name: 'Green', value: '#22C55E33' }, // 绿色系
  { name: 'Blue', value: '#3B82F633' }, // 蓝色系
  { name: 'Purple', value: '#A855F733' }, // 紫色系
  { name: 'Pink', value: '#EC489933' }, // 粉色系
  { name: 'Gray', value: '#6B728033' }, // 灰色系
] as const;

const DAY_OF_WEEK_MAP = {
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sunday: 0,
};

export { TODO_COLORS, DAY_OF_WEEK_MAP };
