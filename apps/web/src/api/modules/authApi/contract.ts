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

export interface LoginCodeCommand {
  email: string;
}
