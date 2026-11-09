

export interface LoginUPCommand {
  username: string;
  password: string;
}

export interface LoginEPCommand {
  email: string;
  password: string;
}

export interface LoginECCommand {
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

export interface LoginCodeCommand {
  email: string;
}