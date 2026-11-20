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
