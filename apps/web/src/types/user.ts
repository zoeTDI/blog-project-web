export interface UserInfo {
    id: number;
    username: string;
    nickname: string;
    avatar: string;
    email?: string; // 可选属性
    roles: string[];
}