import { describe, expect, it } from 'vitest';
import {
  formatSlugTimestamp,
  resolvePostSlug,
} from '@/views/post/postEdit/slug.ts';

describe('postEdit slug', () => {
  const now = new Date(2026, 7, 28, 9, 5, 7);

  it('按本地时间生成 YYYYMMDDHHmmss 格式的时间戳', () => {
    expect(formatSlugTimestamp(now)).toBe('20260828090507');
  });

  it('用户未手动修改时使用文章标题和时间戳', () => {
    expect(resolvePostSlug('文章标题', '', false, now)).toBe(
      '文章标题20260828090507'
    );
  });

  it('标题为空时只生成时间戳', () => {
    expect(resolvePostSlug('', '', false, now)).toBe('20260828090507');
  });

  it('用户手动修改后使用输入的 slug', () => {
    expect(resolvePostSlug('文章标题', 'custom-slug', true, now)).toBe(
      'custom-slug'
    );
  });

  it('用户手动清空后保留空值，不再自动生成', () => {
    expect(resolvePostSlug('文章标题', '', true, now)).toBe('');
  });
});
