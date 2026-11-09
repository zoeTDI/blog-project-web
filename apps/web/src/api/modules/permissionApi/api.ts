import { defHttp } from '@/utils/request.ts';
import type {
  CreateResourcePayload,
  MenuVO,
  ResourceNode,
  ResourceResponse,
  RoleResponse,
  UpdateResourcePayload,
} from '@/api/modules/permissionApi/types.ts';

const Api = {
  // 资源管理
  createResource: '/permission/resources',
  getAllRoles: '/permission/roles',
  getResourceById: '/permission/resources',
  getResourceChildren: '/permission/resources',
  updateResource: '/permission/resources',
  enableResource: '/permission/resources',
  disableResource: '/permission/resources',
  deleteResource: '/permission/resources',
  // 角色-资源授权
  getResourcesByRoleId: '/permission/resource',
  grantResourceToRole: '/permission/roles',
  revokeResourceFromRole: '/permission/roles',
  // 当前用户权限
  getMyMenus: '/permission/me/menus',
  getMyPermissionCodes: '/permission/me/codes',
};

/** 创建资源 */
export const createResource = (
  payload: CreateResourcePayload
): Promise<ResourceResponse> => {
  return defHttp.post(Api.createResource, payload);
};

/** 获取所有角色 */
export const getAllRoles = (): Promise<RoleResponse[]> => {
  return defHttp.get(Api.getAllRoles);
}

/** 根据 ID 获取资源 */
export const getResourceById = (id: number): Promise<ResourceResponse> => {
  return defHttp.get(`${Api.getResourceById}/${id}`);
};

/** 获取子资源列表 */
export const getResourceChildren = (
  id: number
): Promise<ResourceResponse[]> => {
  return defHttp.get(`${Api.getResourceChildren}/${id}/children`);
};

/** 更新资源 */
export const updateResource = (
  id: number,
  payload: UpdateResourcePayload
): Promise<ResourceResponse> => {
  return defHttp.put(`${Api.updateResource}/${id}`, payload);
};

/** 启用资源 */
export const enableResource = (id: number): Promise<void> => {
  return defHttp.put(`${Api.enableResource}/${id}/enable`);
};

/** 停用资源 */
export const disableResource = (id: number): Promise<void> => {
  return defHttp.put(`${Api.disableResource}/${id}/disable`);
};

/** 删除资源 */
export const deleteResource = (id: number): Promise<void> => {
  return defHttp.delete(`${Api.deleteResource}/${id}`);
};

/** 获取角色已授权的资源树 */
export const getResourcesByRoleId = (
  roleId: number
): Promise<ResourceNode[]> => {
  return defHttp.get(`${Api.getResourcesByRoleId}/${roleId}`);
};

/** 给角色授权资源 */
export const grantResourceToRole = (
  roleId: number,
  resourceId: number
): Promise<void> => {
  return defHttp.post(
    `${Api.grantResourceToRole}/${roleId}/resources/${resourceId}`
  );
};

/** 撤销角色资源授权 */
export const revokeResourceFromRole = (
  roleId: number,
  resourceId: number
): Promise<void> => {
  return defHttp.delete(
    `${Api.revokeResourceFromRole}/${roleId}/resources/${resourceId}`
  );
};

/** 获取当前用户菜单树 */
export const getMyMenus = (): Promise<MenuVO[]> => {
  return defHttp.get(Api.getMyMenus);
};

/** 获取当前用户权限码列表 */
export const getMyPermissionCodes = (): Promise<string[]> => {
  return defHttp.get(Api.getMyPermissionCodes);
};
