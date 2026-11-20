import type { ValueOf } from '@caldm/utils';

export const sysUserStatus = {
  /** 正常 */
  normal: '正常',
  /** 停用 */
  disabled: '停用',
} as const;

/**
 * 用户状态,对应后端 SysUserStatusEnum
 * 后端 @JsonValue 标注在 desc 上,接口返回值为 '正常' | '停用'
 */
export type SysUserStatusEnum = ValueOf<typeof sysUserStatus>;

export interface LoginRes {
  id: number;
  email: string;
  username: string;
  nickname: string;
  avatar: string;
  roles: string[];
  menus: string[];
}

export interface UserRole {
  /** 角色 ID */
  id: number;
  /** 角色编码 */
  code: string;
}

export interface UserPageItem {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  status: SysUserStatusEnum;
  roles: UserRole[];
  createTime: string;
}

export interface CreateUserResponse {
  id: number;
  username: string;
  nickname: string;
  email: string;
  avatar: string;
  status: SysUserStatusEnum;
  roles: UserRole[];
  createTime: string;
}
