import type { ValueOf } from '@caldm/utils';
import { resourceType } from '@/api/modules/permissionApi/constants.ts';

/**
 * 资源类型,对应后端 ResourceTypeEnum
 * 后端 @JsonValue 标注在 desc 上,接口返回值为 '目录' | '菜单' | '按钮'
 */
export type ResourceType = ValueOf<typeof resourceType>;

/** 对应后端 CreateResourceRequest */
export interface CreateResourcePayload {
  /** 资源名称 */
  name: string;
  /** 权限标识 */
  permission?: string;
  /** 资源类型 */
  type: ResourceType;
  /** 父资源 ID */
  parentId: number;
  /** 排序值 */
  sort: number;
  /** 前端路由地址 */
  path?: string;
  /** 前端组件标识 */
  component?: string;
  /** 前端图标标识 */
  icon?: string;
  /** 前端国际化 Key */
  titleKey?: string;
}

/** 对应后端 UpdateResourceRequest */
export interface UpdateResourcePayload {
  /** 资源名称 */
  name: string;
  /** 权限标识 */
  permission?: string;
  /** 父资源 ID */
  parentId: number;
  /** 排序值 */
  sort: number;
  /** 前端路由地址 */
  path?: string;
  /** 前端组件标识 */
  component?: string;
  /** 前端图标标识 */
  icon?: string;
  /** 前端国际化 Key */
  titleKey?: string;
}

/** 对应后端 ResourceResponse */
export interface ResourceResponse {
  id: number;
  /** 资源名称 */
  name: string;
  /** 权限标识 */
  permission: string;
  /** 资源类型 */
  type: ResourceType;
  /** 父资源 ID */
  parentId: number;
  /** 排序值 */
  sort: number;
  /** 前端路由地址 */
  path: string;
  /** 前端组件标识 */
  component: string;
  /** 前端图标标识 */
  icon: string;
  /** 前端国际化 Key */
  titleKey: string;
  /** 是否启用 */
  enabled: boolean;
}

/** 对应后端 ResourceNode(角色资源树节点) */
export interface ResourceNode {
  node: ResourceResponse;
  children: ResourceNode[];
}

/** 对应后端 MenuVO */
export interface MenuVO {
  id: number;
  name: string;
  /** 菜单类型 */
  type: number;
  /** 排序值 */
  sort: number;
  /** 前端路由地址 */
  path: string;
  /** 前端组件标识 */
  component: string;
  /** 前端图标标识 */
  icon: string;
  /** 前端国际化 Key */
  titleKey: string;
  children: MenuVO[];
}

export interface RoleResponse {
  id: number;
  name: string,
  code: string,
  sort: number,
  remark: string,
  enabled: boolean
}
