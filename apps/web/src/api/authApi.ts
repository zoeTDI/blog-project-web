import { defHttp } from '@/utils/request.ts';

export interface LoginUPReq {
  username: string;
  password: string;
}

export interface LoginEPReq {
  email: string;
  password: string;
}

export interface LoginECReq {
  email: string;
  code: string;
}

export interface LoginRes {
  id: number;
  email: string;
  username: string;
  nickname: string;
  avatar: string;
  roles: string[];
  menus: string[];
}

export interface LoginCodeReq {
  email: string;
}

const Api = {
  // “用户名+密码”登录
  loginUP: '/auth/login/username-password',
  // “邮箱+密码”登录
  loginEP: '/auth/login/email-password',
  // “邮箱+验证码”登录
  loginEC: '/auth/login/email-code',
  // 发送登录验证码
  sendLoginCode: '/auth/send-login-code',
  refresh: '/auth/refresh',
  logout: '/auth/logout',
};

export const loginUP = (payload: LoginUPReq): Promise<LoginRes> => {
  return defHttp.post(Api.loginUP, payload);
};

export const loginEP = (payload: LoginEPReq): Promise<LoginRes> => {
  return defHttp.post(Api.loginEP, payload);
};

export const loginEC = (payload: LoginECReq): Promise<LoginRes> => {
  return defHttp.post(Api.loginEC, payload);
};

export const sendLoginCode = (payload: LoginCodeReq): Promise<boolean> => {
  return defHttp.post(Api.sendLoginCode, payload);
};

export const refreshToken = () => {
  return defHttp.post(Api.refresh);
};

export const logout = () => {
  return defHttp.post(Api.logout);
};
