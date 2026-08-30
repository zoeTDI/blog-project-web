export const blogPostType = {
  normal: '普通文章',
  techPost: '技术笔记',
  essay: '生活随笔',
  other: '其他',
} as const;

export const blogPostStatus = {
  draft: '草稿',
  published: '已发布',
  reviewing: '审核中',
} as const;