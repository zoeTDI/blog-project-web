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
  token: string;
  role: string;
  menus: string[];
}

const Api = {
  login: '/login',
};

export const login = (options: LoginReq): Promise<LoginRes> => {
  return defHttp.post(Api.login, options);
};
