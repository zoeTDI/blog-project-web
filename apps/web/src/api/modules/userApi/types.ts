import type { ValueOf } from '@caldm/utils';
import { sysUserStatus } from '@/api/modules/userApi/constants.ts';

export interface CreateUserPayload {
  /** 角色 ID 列表 */
  roleIds: number[];
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 邮箱 */
  email: string;
  /** 昵称 */
  nickname?: string;
}


export interface SoftDeletePayload {
  /** 目标用户 ID */
  targetUserId: number;
}


export interface BanUserPayload {
  /** 目标用户 ID */
  targetUserId: number;
}

/**
 * 用户状态,对应后端 SysUserStatusEnum
 * 后端 @JsonValue 标注在 desc 上,接口返回值为 '正常' | '停用'
 */
export type SysUserStatusEnum = ValueOf<typeof sysUserStatus>;

export interface UserRole {
  /** 角色 ID */
  id: number;
  /** 角色编码 */
  code: string;
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
