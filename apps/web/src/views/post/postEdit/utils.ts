import {
  createBlogPost,
  getAllCategoriesByAuthor,
  getAllTagsByAuthor,
} from '@/api';
import type { CategoryTreeNode } from '@/api';
import { isEmpty } from '@caldm/utils';
import type {
  _CategoryNode,
  _NewPostPayload, _SavePostPayload,
  PostEditForm,
} from '@/views/post/postEdit/type.ts';

export const processCategory = (node: CategoryTreeNode): _CategoryNode => {
  const n = {
    label: node.category.name,
    value: node.category.id,
    children: [] as _CategoryNode[],
  };
  if (!isEmpty(node.children)) {
    n.children = node.children.map((child) => processCategory(child));
  }
  return n;
};

export const toNewPostPayload = (formData: PostEditForm): _NewPostPayload => {
  return {
    title: formData.title.slice(0, 200),
    subtitle: formData.subtitle.slice(0, 200),
    contentMd: formData.contentMd,
    contentHtml: formData.contentHtml,
    summary: formData.summary.slice(0, 500),
    type: formData.type,
    status: formData.status,
    isTop: formData.isTop,
    isOriginal: formData.isOriginal,
    slug: formData.slug,
    seoKeywords: formData.seoKeywords,
    seoDescription: formData.seoDescription,
    password: formData.password,
    allowComment: formData.allowComment,
    reprintSource: formData.reprintSource,
    sortWeight: formData.sortWeight,
    tagIds: JSON.parse(JSON.stringify(formData.tags)),
    categoryTrees: JSON.parse(JSON.stringify(formData.category)),
  } as _NewPostPayload;
};

export const toSavePostPayload = (formData: PostEditForm): _SavePostPayload => {
  return {
    targetPostId: formData.id!,
    title: formData.title.slice(0, 200),
    subtitle: formData.subtitle.slice(0, 200),
    contentMd: formData.contentMd,
    contentHtml: formData.contentHtml,
    summary: formData.summary.slice(0, 500),
    type: formData.type,
    status: formData.status,
    isTop: formData.isTop,
    isOriginal: formData.isOriginal,
    publishedTime: formData.publishedTime,
    slug: formData.slug,
    seoKeywords: formData.seoKeywords,
    seoDescription: formData.seoDescription,
    password: formData.password,
    allowComment: formData.allowComment,
    reprintSource: formData.reprintSource,
    sortWeight: formData.sortWeight,
    tagIds: JSON.parse(JSON.stringify(formData.tags)),
    categoryTrees: JSON.parse(JSON.stringify(formData.category)),
  } as _SavePostPayload;
};

// Api aliases
export const getTags = getAllTagsByAuthor;
export const getCategories = getAllCategoriesByAuthor;
export const newPost = createBlogPost;
