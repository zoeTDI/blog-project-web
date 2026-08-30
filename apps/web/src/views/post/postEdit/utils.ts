import { getAllCategoriesByAuthor, getAllTagsByAuthor } from '@/api';
import type { CategoryTreeNode } from '@/api';
import { isEmpty } from '@caldm/utils';
import type { _CategoryNode } from '@/views/post/postEdit/type.ts';

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

// Api aliases
export const getTags = getAllTagsByAuthor;
export const getCategories = getAllCategoriesByAuthor;
