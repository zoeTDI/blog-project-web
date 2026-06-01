import {defHttp} from "@/utils/request.ts";
import type {UserInfo} from "#/user.ts";
import type {MenuDataItem} from "#/router";

enum Api {
    user = "/user",
    userMenu = '/user/menu'
}

export const getUserInfo = (id: number) => {
    return defHttp.get<UserInfo>(Api.user, {id});
}

export const getUserMenu = (id: string) => {
    return defHttp.post<MenuDataItem[]>(Api.userMenu, {id})
}