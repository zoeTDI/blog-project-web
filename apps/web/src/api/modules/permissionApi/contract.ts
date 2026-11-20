import type { ResourceType } from '#/permission';

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
