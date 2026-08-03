import { defHttp } from '@/utils/request.ts';

export interface LoginReq {
  username: string;
  password: string;
}

export interface LoginRes {
  id: number;
  email: string;
  username: string;
  nickname: string;
  avatar: string;
  role: string;
  menus: string[];
}

const Api = {
  login: '/login',
  refresh: '/secure/refresh',
  logout: '/secure/logout',
};

export const login = (options: LoginReq): Promise<LoginRes> => {
  return defHttp.post(Api.login, options);
};

export const refreshToken = () => {
  return defHttp.post(Api.refresh);
};

export const logout = () => {
  return defHttp.post(Api.logout);
};
